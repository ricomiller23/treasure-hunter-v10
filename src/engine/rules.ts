import {
  BoonCard,
  Card,
  DifficultyLevel,
  GameAction,
  GameScoreBreakdown,
  GameState,
} from './types.ts';
import { createAdventureDeck } from './deck.ts';
import { getAllBoons } from './boons.ts';
import { createRng, shuffle } from './rng.ts';

/**
 * Creates the initial game state with shuffled decks and deals the first 4 cards.
 */
export function createInitialGameState(
  seed: number,
  difficulty: DifficultyLevel = 'explorer'
): GameState {
  const rng = createRng(seed);

  const adventureDeck = shuffle(createAdventureDeck(), rng);
  const boonDeck =
    difficulty === 'cursed_idol' ? [] : shuffle(getAllBoons(), rng);

  const initialUndos =
    difficulty === 'explorer'
      ? 999
      : difficulty === 'adventurer'
      ? 3
      : 0;

  const baseState: GameState = {
    seed,
    roundNumber: 0,
    difficulty,
    adventureDeck,
    adventureDiscard: [],
    stacks: [[], [], [], []],
    boonDeck,
    boonDiscard: [],
    boonsInPlay: [],
    baseCampCard: null,
    discardsThisRound: 0,
    boonDrawnThisRound: false,
    perilActive: false,
    mapPeekCards: null,
    undosRemaining: initialUndos,
    history: [],
    isGameOver: false,
    gameOverReason: null,
    lastActionMessage: 'Expedition begins.',
  };

  // Automatically deal Round 1
  return applyAction(baseState, { type: 'DEAL' });
}

/**
 * Returns all currently legal card discards.
 * A top card can be discarded if another top card of the same suit has a higher value.
 */
export function getLegalDiscards(
  state: GameState
): { stackIndex: number; card: Card; higherCard: Card }[] {
  const legal: { stackIndex: number; card: Card; higherCard: Card }[] = [];

  // Collect top cards of all non-empty stacks
  const topCards: { stackIndex: number; card: Card }[] = [];
  state.stacks.forEach((stack, idx) => {
    if (stack.length > 0) {
      topCards.push({ stackIndex: idx, card: stack[stack.length - 1] });
    }
  });

  for (const item of topCards) {
    // Look for another top card of the same suit with a higher value
    const higher = topCards.find(
      (other) =>
        other.stackIndex !== item.stackIndex &&
        other.card.suit === item.card.suit &&
        other.card.value > item.card.value
    );

    if (higher) {
      legal.push({
        stackIndex: item.stackIndex,
        card: item.card,
        higherCard: higher.card,
      });
    }
  }

  return legal;
}

/**
 * Returns all currently legal moves of a top card into an empty stack.
 */
export function getLegalEmptyStackMoves(
  state: GameState
): { fromStackIndex: number; toStackIndex: number }[] {
  const emptyStackIndices: number[] = [];
  const nonEmptyStackIndices: number[] = [];

  state.stacks.forEach((stack, idx) => {
    if (stack.length === 0) {
      emptyStackIndices.push(idx);
    } else {
      nonEmptyStackIndices.push(idx);
    }
  });

  if (emptyStackIndices.length === 0 || nonEmptyStackIndices.length === 0) {
    return [];
  }

  const moves: { fromStackIndex: number; toStackIndex: number }[] = [];
  for (const from of nonEmptyStackIndices) {
    for (const to of emptyStackIndices) {
      moves.push({ fromStackIndex: from, toStackIndex: to });
    }
  }

  return moves;
}

/**
 * Check if the game has ended.
 * Ends when Adventure deck is empty and no more card discards are possible.
 */
export function checkGameOver(state: GameState): boolean {
  if (state.adventureDeck.length > 0) {
    return false;
  }

  const legalDiscards = getLegalDiscards(state);
  if (legalDiscards.length > 0) {
    return false;
  }

  // If there are empty stacks and cards can be moved into them,
  // could that enable a discard? We check if any empty stack move could enable a discard.
  const emptyMoves = getLegalEmptyStackMoves(state);
  for (const move of emptyMoves) {
    const clone = cloneGameState(state);
    const card = clone.stacks[move.fromStackIndex].pop()!;
    clone.stacks[move.toStackIndex].push(card);
    if (getLegalDiscards(clone).length > 0) {
      return false;
    }
  }

  // Check if player has playable boons in play that could discard
  if (state.boonsInPlay.some((b) => b.id === 'machete')) {
    // Machete can discard any non-idol top card
    const hasNonIdolTop = state.stacks.some((s) => s.length > 0 && !s[s.length - 1].isIdol);
    if (hasNonIdolTop) return false;
  }

  return true;
}

/**
 * Calculates the score breakdown at any point or game end.
 */
export function calculateScore(state: GameState): GameScoreBreakdown {
  const discardsCount = state.adventureDiscard.length;
  const discardsScore = discardsCount; // +1 each

  let idolsCount = 0;
  let skullCavesCount = 0;

  state.stacks.forEach((stack) => {
    if (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top.isIdol) {
        idolsCount += 1;
      }
      if (top.isSkullCave) {
        skullCavesCount += 1;
      }
    }
  });

  const idolsScore = idolsCount * 2; // +2 each
  const skullCavesPenalty = skullCavesCount; // -1 each

  let unusedBoonsCount = 0;
  let unusedBoonsPenalty = 0;

  if (state.difficulty === 'legend') {
    unusedBoonsCount = state.boonsInPlay.length + state.boonDeck.length;
    unusedBoonsPenalty = unusedBoonsCount; // -1 each
  }

  const totalScore =
    discardsScore + idolsScore - skullCavesPenalty - unusedBoonsPenalty;

  return {
    discardsCount,
    discardsScore,
    idolsCount,
    idolsScore,
    skullCavesCount,
    skullCavesPenalty,
    unusedBoonsCount,
    unusedBoonsPenalty,
    totalScore,
    isPerfect: totalScore === 44,
  };
}

/**
 * Deep clone of GameState for immutable transitions.
 */
export function cloneGameState(state: GameState): GameState {
  return {
    ...state,
    adventureDeck: state.adventureDeck.map((c) => ({ ...c })),
    adventureDiscard: state.adventureDiscard.map((c) => ({ ...c })),
    stacks: state.stacks.map((stack) => stack.map((c) => ({ ...c }))),
    boonDeck: state.boonDeck.map((b) => ({ ...b })),
    boonDiscard: state.boonDiscard.map((b) => ({ ...b })),
    boonsInPlay: state.boonsInPlay.map((b) => ({ ...b })),
    baseCampCard: state.baseCampCard ? { ...state.baseCampCard } : null,
    mapPeekCards: state.mapPeekCards ? state.mapPeekCards.map((c) => ({ ...c })) : null,
    history: state.history.map((h) => ({ ...h })),
    undoStack: state.undoStack ? state.undoStack.map((s) => cloneGameState(s)) : [],
  };
}

/**
 * Pure state reducer.
 */
export function applyAction(state: GameState, action: GameAction): GameState {
  if (state.isGameOver && action.type !== 'UNDO') {
    return state;
  }

  // Handle UNDO
  if (action.type === 'UNDO') {
    if (!state.undoStack || state.undoStack.length === 0 || state.undosRemaining <= 0) {
      return state;
    }
    const previous = state.undoStack[state.undoStack.length - 1];
    const newUndoStack = state.undoStack.slice(0, -1);
    return {
      ...previous,
      undosRemaining: state.undosRemaining - 1,
      undoStack: newUndoStack,
      lastActionMessage: 'Action undone.',
    };
  }

  // Capture current state for undo stack before modifying
  const next = cloneGameState(state);
  if (!next.undoStack) {
    next.undoStack = [];
  }
  // Store snapshot for undo (exclude deep undo stack to keep memory bounded)
  const snapshot = cloneGameState(state);
  delete snapshot.undoStack;
  next.undoStack.push(snapshot);
  if (next.undoStack.length > 20) {
    next.undoStack.shift();
  }

  switch (action.type) {
    // ----------------------------------------------------
    // DEAL
    // ----------------------------------------------------
    case 'DEAL': {
      if (next.adventureDeck.length === 0) {
        // Can't deal if deck is empty
        return state;
      }

      next.roundNumber += 1;
      next.discardsThisRound = 0;
      next.boonDrawnThisRound = false;
      next.perilActive = false;
      next.mapPeekCards = null;

      const countToDeal = Math.min(4, next.adventureDeck.length);
      const dealtCards: Card[] = [];

      for (let i = 0; i < countToDeal; i++) {
        const card = next.adventureDeck.pop()!;
        next.stacks[i].push(card);
        dealtCards.push(card);
      }

      // Check Peril!
      // If a single deal contains 4 Skull Cave cards:
      if (countToDeal === 4 && dealtCards.every((c) => c.isSkullCave)) {
        next.perilActive = true;
        // Immediately discard all Boon cards in play, except a Base Camp currently holding a card
        const keptBoons: BoonCard[] = [];
        for (const boon of next.boonsInPlay) {
          if (boon.id === 'base_camp' && next.baseCampCard !== null) {
            keptBoons.push(boon);
          } else {
            next.boonDiscard.push(boon);
          }
        }
        next.boonsInPlay = keptBoons;
        next.history.unshift({
          round: next.roundNumber,
          description: 'PERIL! Four Skull Caves dealt. Boons in play destroyed!',
          timestamp: Date.now(),
        });
        next.lastActionMessage = 'PERIL! 4 Skull Caves dealt!';
      } else {
        next.history.unshift({
          round: next.roundNumber,
          description: `Round ${next.roundNumber}: Dealt ${countToDeal} cards.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Round ${next.roundNumber} dealt.`;
      }

      if (checkGameOver(next)) {
        next.isGameOver = true;
        next.gameOverReason = 'Adventure deck exhausted with no legal moves remaining.';
        next.scoreBreakdown = calculateScore(next);
      }

      return next;
    }

    // ----------------------------------------------------
    // DISCARD CARD
    // ----------------------------------------------------
    case 'DISCARD_CARD': {
      const { stackIndex } = action;
      if (stackIndex < 0 || stackIndex >= 4) return state;

      const stack = next.stacks[stackIndex];
      if (stack.length === 0) return state;

      const topCard = stack[stack.length - 1];

      // Check legality: another top card of the same suit must have higher value
      const legal = getLegalDiscards(next);
      const isLegal = legal.some(
        (l) => l.stackIndex === stackIndex && l.card.id === topCard.id
      );

      if (!isLegal) {
        return state;
      }

      // Discard the card
      stack.pop();
      next.adventureDiscard.push(topCard);
      next.discardsThisRound += 1;

      next.history.unshift({
        round: next.roundNumber,
        description: `Discarded ${topCard.value} of ${topCard.suit}s.`,
        timestamp: Date.now(),
      });
      next.lastActionMessage = `Discarded ${topCard.value} of ${topCard.suit}s.`;

      // Boon reward: 4 or more discards in a round
      if (
        next.discardsThisRound >= 4 &&
        !next.boonDrawnThisRound &&
        next.difficulty !== 'cursed_idol'
      ) {
        // Can draw a boon
        let canDrawBoon = true;

        if (next.boonDeck.length === 0) {
          // If all Boons have been drawn but any are still unused / in play,
          // the player cannot draw another Boon.
          const boonsStillInPlay = next.boonsInPlay.length > 0 || next.baseCampCard !== null;
          if (next.difficulty !== 'legend' && !boonsStillInPlay && next.boonDiscard.length > 0) {
            // Reshuffle Boon discard into Boon deck
            const rng = createRng(next.seed + next.roundNumber * 100 + next.discardsThisRound);
            next.boonDeck = shuffle(next.boonDiscard, rng);
            next.boonDiscard = [];
          } else {
            canDrawBoon = false;
          }
        }

        if (canDrawBoon && next.boonDeck.length > 0) {
          const drawnBoon = next.boonDeck.pop()!;
          next.boonsInPlay.push(drawnBoon);
          next.boonDrawnThisRound = true;
          next.history.unshift({
            round: next.roundNumber,
            description: `4th Discard Reward: Drew Boon [${drawnBoon.name}]!`,
            timestamp: Date.now(),
          });
          next.lastActionMessage = `Boon rewarded: ${drawnBoon.name}!`;
        }
      }

      if (checkGameOver(next)) {
        next.isGameOver = true;
        next.gameOverReason = 'All cards resolved. Expedition concluded.';
        next.scoreBreakdown = calculateScore(next);
      }

      return next;
    }

    // ----------------------------------------------------
    // MOVE TO EMPTY STACK
    // ----------------------------------------------------
    case 'MOVE_TO_EMPTY_STACK': {
      const { fromStackIndex, toStackIndex } = action;
      if (
        fromStackIndex < 0 ||
        fromStackIndex >= 4 ||
        toStackIndex < 0 ||
        toStackIndex >= 4 ||
        fromStackIndex === toStackIndex
      ) {
        return state;
      }

      if (next.stacks[toStackIndex].length !== 0) return state;
      if (next.stacks[fromStackIndex].length === 0) return state;

      const card = next.stacks[fromStackIndex].pop()!;
      next.stacks[toStackIndex].push(card);

      next.history.unshift({
        round: next.roundNumber,
        description: `Moved ${card.value} of ${card.suit}s to empty Stack ${toStackIndex + 1}.`,
        timestamp: Date.now(),
      });
      next.lastActionMessage = `Moved card to Stack ${toStackIndex + 1}.`;

      return next;
    }

    // ----------------------------------------------------
    // USE BOON
    // ----------------------------------------------------
    case 'USE_BOON': {
      const { boonId, target } = action;
      const boonIndex = next.boonsInPlay.findIndex((b) => b.id === boonId);
      if (boonIndex === -1) return state;

      const boon = next.boonsInPlay[boonIndex];

      if (boonId === 'base_camp') {
        // Target must be a stack with a card
        if (!target || target.type !== 'card') return state;
        const stack = next.stacks[target.stackIndex];
        if (!stack || stack.length === 0) return state;
        if (next.baseCampCard !== null) return state; // already holding one

        const held = stack.pop()!;
        next.baseCampCard = held;
        // Base Camp stays in boonsInPlay while holding card!
        next.history.unshift({
          round: next.roundNumber,
          description: `Base Camp: Stashed ${held.value} of ${held.suit}s safely.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Base Camp holding ${held.value} of ${held.suit}s.`;
      } else if (boonId === 'machete') {
        if (!target || target.type !== 'card') return state;
        const stack = next.stacks[target.stackIndex];
        if (!stack || stack.length === 0) return state;
        const targetCard = stack[stack.length - 1];
        if (targetCard.isIdol) return state; // cannot discard Idol

        stack.pop();
        next.adventureDiscard.push(targetCard);
        next.discardsThisRound += 1;

        // Discard Machete
        next.boonsInPlay.splice(boonIndex, 1);
        next.boonDiscard.push(boon);

        next.history.unshift({
          round: next.roundNumber,
          description: `Machete: Sliced ${targetCard.value} of ${targetCard.suit}s to discard pile.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Machete discarded ${targetCard.value} of ${targetCard.suit}s.`;
      } else if (boonId === 'rope_bridge') {
        if (!target || target.type !== 'twoStacks') return state;
        const { stack1, stack2 } = target;
        if (stack1 === stack2 || !next.stacks[stack1] || !next.stacks[stack2]) return state;
        if (next.stacks[stack1].length === 0) return state;

        const moved = next.stacks[stack1].pop()!;
        next.stacks[stack2].push(moved);

        next.boonsInPlay.splice(boonIndex, 1);
        next.boonDiscard.push(boon);

        next.history.unshift({
          round: next.roundNumber,
          description: `Rope Bridge: Traversed ${moved.value} of ${moved.suit}s to Stack ${stack2 + 1}.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Rope Bridge moved card to Stack ${stack2 + 1}.`;
      } else if (boonId === 'map') {
        // Reveal next up to 4 cards of adventure deck
        const peek = next.adventureDeck.slice(-4).reverse();
        next.mapPeekCards = peek;

        next.boonsInPlay.splice(boonIndex, 1);
        next.boonDiscard.push(boon);

        next.history.unshift({
          round: next.roundNumber,
          description: `Map: Surveyed next ${peek.length} cards in Adventure deck.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Surveyed next ${peek.length} cards.`;
      } else if (boonId === 'lantern') {
        if (!target || target.type !== 'twoStacks') return state;
        const { stack1, stack2 } = target;
        if (stack1 === stack2 || !next.stacks[stack1] || !next.stacks[stack2]) return state;

        const temp = next.stacks[stack1];
        next.stacks[stack1] = next.stacks[stack2];
        next.stacks[stack2] = temp;

        next.boonsInPlay.splice(boonIndex, 1);
        next.boonDiscard.push(boon);

        next.history.unshift({
          round: next.roundNumber,
          description: `Lantern: Swapped positions of Stack ${stack1 + 1} and Stack ${stack2 + 1}.`,
          timestamp: Date.now(),
        });
        next.lastActionMessage = `Swapped Stack ${stack1 + 1} and Stack ${stack2 + 1}.`;
      }

      if (checkGameOver(next)) {
        next.isGameOver = true;
        next.gameOverReason = 'All cards resolved. Expedition concluded.';
        next.scoreBreakdown = calculateScore(next);
      }

      return next;
    }

    // ----------------------------------------------------
    // RETURN FROM BASE CAMP
    // ----------------------------------------------------
    case 'RETURN_FROM_BASE_CAMP': {
      const { toStackIndex } = action;
      if (toStackIndex < 0 || toStackIndex >= 4) return state;
      if (next.stacks[toStackIndex].length !== 0) return state; // must return to empty stack
      if (next.baseCampCard === null) return state;

      const returned = next.baseCampCard;
      next.stacks[toStackIndex].push(returned);
      next.baseCampCard = null;

      // Base Camp boon is now spent and discarded
      const baseCampIdx = next.boonsInPlay.findIndex((b) => b.id === 'base_camp');
      if (baseCampIdx !== -1) {
        const spent = next.boonsInPlay.splice(baseCampIdx, 1)[0];
        next.boonDiscard.push(spent);
      }

      next.history.unshift({
        round: next.roundNumber,
        description: `Retrieved ${returned.value} of ${returned.suit}s from Base Camp into Stack ${toStackIndex + 1}.`,
        timestamp: Date.now(),
      });
      next.lastActionMessage = `Retrieved card to Stack ${toStackIndex + 1}.`;

      return next;
    }

    // ----------------------------------------------------
    // END GAME (Voluntarily conclude when deck is empty)
    // ----------------------------------------------------
    case 'END_GAME': {
      next.isGameOver = true;
      next.gameOverReason = 'Player concluded expedition.';
      next.scoreBreakdown = calculateScore(next);
      return next;
    }
  }

  return next;
}
