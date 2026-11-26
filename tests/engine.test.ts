import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  applyAction,
  getLegalDiscards,
  getLegalEmptyStackMoves,
  calculateScore,
} from '../src/engine/rules.ts';
import { SKULL_CAVE_VALUES } from '../src/engine/deck.ts';
import { Card, GameState } from '../src/engine/types.ts';

describe('Deck Configuration', () => {
  it('has the specified Skull Cave values [1, 3, 5, 7, 9]', () => {
    expect(SKULL_CAVE_VALUES).toEqual([1, 3, 5, 7, 9]);
  });

  it('initializes with 40 adventure cards and 5 boons in standard game', () => {
    const state = createInitialGameState(12345, 'explorer');

    // Total adventure cards = deck + stacks + discard
    const totalAdventureCards =
      state.adventureDeck.length +
      state.stacks.reduce((sum, s) => sum + s.length, 0) +
      state.adventureDiscard.length;

    expect(totalAdventureCards).toBe(40);
    // After automatic Round 1 deal, 4 cards are in stacks, 36 left in deck
    expect(state.adventureDeck.length).toBe(36);
    expect(state.stacks.every((s) => s.length === 1)).toBe(true);

    // Total boons in explorer = 5
    expect(state.boonDeck.length + state.boonsInPlay.length).toBe(5);
  });
});

describe('Discard Legality', () => {
  it('allows discarding a lower card when a higher card of the same suit is exposed', () => {
    const state = createInitialGameState(100, 'explorer');

    // Force stack top cards
    state.stacks = [
      [{ id: 'coin-3', suit: 'coin', value: 3, isSkullCave: true, isIdol: false }],
      [{ id: 'coin-7', suit: 'coin', value: 7, isSkullCave: true, isIdol: false }],
      [{ id: 'gem-5', suit: 'gem', value: 5, isSkullCave: true, isIdol: false }],
      [{ id: 'skull-2', suit: 'skull', value: 2, isSkullCave: false, isIdol: false }],
    ];

    const legal = getLegalDiscards(state);
    // Coin 3 should be legal to discard because Coin 7 is showing
    expect(legal.some((l) => l.card.id === 'coin-3')).toBe(true);
    // Coin 7 should NOT be legal to discard
    expect(legal.some((l) => l.card.id === 'coin-7')).toBe(false);

    // Perform discard
    const next = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 0 });
    expect(next.stacks[0].length).toBe(0);
    expect(next.adventureDiscard.length).toBe(1);
    expect(next.adventureDiscard[0].id).toBe('coin-3');
    expect(next.discardsThisRound).toBe(1);
  });

  it('never permits an Idol (10) to be discarded via standard removal', () => {
    const state = createInitialGameState(200, 'explorer');

    state.stacks = [
      [{ id: 'coin-10', suit: 'coin', value: 10, isSkullCave: false, isIdol: true }],
      [{ id: 'coin-9', suit: 'coin', value: 9, isSkullCave: true, isIdol: false }],
      [],
      [],
    ];

    const legal = getLegalDiscards(state);
    expect(legal.some((l) => l.card.id === 'coin-10')).toBe(false);
    expect(legal.some((l) => l.card.id === 'coin-9')).toBe(true);
  });
});

describe('Empty Stack Moves', () => {
  it('allows moving the top card of any stack into an empty space', () => {
    const state = createInitialGameState(300, 'explorer');

    state.stacks = [
      [{ id: 'gem-4', suit: 'gem', value: 4, isSkullCave: false, isIdol: false }],
      [],
      [{ id: 'skull-8', suit: 'skull', value: 8, isSkullCave: false, isIdol: false }],
      [],
    ];

    const emptyMoves = getLegalEmptyStackMoves(state);
    expect(emptyMoves.length).toBe(4); // 2 non-empty * 2 empty

    const next = applyAction(state, {
      type: 'MOVE_TO_EMPTY_STACK',
      fromStackIndex: 0,
      toStackIndex: 1,
    });

    expect(next.stacks[0].length).toBe(0);
    expect(next.stacks[1].length).toBe(1);
    expect(next.stacks[1][0].id).toBe('gem-4');
    // Moving to an empty space is not a discard and does not increment discardsThisRound
    expect(next.discardsThisRound).toBe(0);
  });
});

describe('Boon Reward (4-Discard Rule)', () => {
  it('awards a Boon card immediately upon the 4th discard in a single round', () => {
    let state = createInitialGameState(400, 'explorer');
    expect(state.boonsInPlay.length).toBe(0);

    // Setup 4 discards
    state.stacks = [
      [
        { id: 'coin-2', suit: 'coin', value: 2, isSkullCave: false, isIdol: false },
        { id: 'coin-1', suit: 'coin', value: 1, isSkullCave: true, isIdol: false },
      ],
      [{ id: 'coin-10', suit: 'coin', value: 10, isSkullCave: false, isIdol: true }],
      [
        { id: 'gem-2', suit: 'gem', value: 2, isSkullCave: false, isIdol: false },
        { id: 'gem-1', suit: 'gem', value: 1, isSkullCave: true, isIdol: false },
      ],
      [{ id: 'gem-10', suit: 'gem', value: 10, isSkullCave: false, isIdol: true }],
    ];

    // Discard 1: Coin 1
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 0 });
    expect(state.discardsThisRound).toBe(1);
    expect(state.boonsInPlay.length).toBe(0);

    // Discard 2: Coin 2
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 0 });
    expect(state.discardsThisRound).toBe(2);
    expect(state.boonsInPlay.length).toBe(0);

    // Discard 3: Gem 1
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 2 });
    expect(state.discardsThisRound).toBe(3);
    expect(state.boonsInPlay.length).toBe(0);

    // Discard 4: Gem 2 -> Triggers Boon reward!
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 2 });
    expect(state.discardsThisRound).toBe(4);
    expect(state.boonDrawnThisRound).toBe(true);
    expect(state.boonsInPlay.length).toBe(1);
  });
});

describe('Peril Event & Base Camp Immunity', () => {
  it('destroys unheld boons when 4 Skull Caves are dealt, but spares Base Camp holding a card', () => {
    let state = createInitialGameState(500, 'explorer');

    // Give player Base Camp holding a card and Machete
    state.boonsInPlay = [
      {
        id: 'base_camp',
        name: 'Base Camp',
        flavorText: '',
        rulesText: '',
        targeting: 'card',
      },
      {
        id: 'machete',
        name: 'Machete',
        flavorText: '',
        rulesText: '',
        targeting: 'card',
      },
    ];
    state.baseCampCard = {
      id: 'coin-6',
      suit: 'coin',
      value: 6,
      isSkullCave: false,
      isIdol: false,
    };

    // Prepare top 4 cards of adventure deck to all be Skull Caves
    state.adventureDeck = [
      { id: 'skull-1', suit: 'skull', value: 1, isSkullCave: true, isIdol: false },
      { id: 'skull-3', suit: 'skull', value: 3, isSkullCave: true, isIdol: false },
      { id: 'gem-1', suit: 'gem', value: 1, isSkullCave: true, isIdol: false },
      { id: 'coin-5', suit: 'coin', value: 5, isSkullCave: true, isIdol: false },
    ];

    state = applyAction(state, { type: 'DEAL' });

    expect(state.perilActive).toBe(true);
    // Base Camp holding a card was spared
    expect(state.boonsInPlay.some((b) => b.id === 'base_camp')).toBe(true);
    expect(state.baseCampCard).not.toBeNull();
    // Machete was discarded
    expect(state.boonsInPlay.some((b) => b.id === 'machete')).toBe(false);
    expect(state.boonDiscard.some((b) => b.id === 'machete')).toBe(true);
  });
});

describe('Scoring Logic', () => {
  it('calculates standard scoring and handles the 44-point maximum', () => {
    const state = createInitialGameState(600, 'explorer');

    // Simulated perfect end game:
    // 36 cards discarded, only 4 Idols remaining on top of stacks, 0 skull caves
    state.adventureDiscard = Array.from({ length: 36 }, (_, i) => ({
      id: `c-${i}`,
      suit: 'coin',
      value: 1,
      isSkullCave: false,
      isIdol: false,
    }));

    state.stacks = [
      [{ id: 'coin-10', suit: 'coin', value: 10, isSkullCave: false, isIdol: true }],
      [{ id: 'gem-10', suit: 'gem', value: 10, isSkullCave: false, isIdol: true }],
      [{ id: 'dagger-10', suit: 'dagger', value: 10, isSkullCave: false, isIdol: true }],
      [{ id: 'skull-10', suit: 'skull', value: 10, isSkullCave: false, isIdol: true }],
    ];

    const score = calculateScore(state);
    // 36 discards (+36) + 4 idols (+8) - 0 skull caves (-0) = 44
    expect(score.totalScore).toBe(44);
    expect(score.isPerfect).toBe(true);
  });
});

describe('Difficulty Rule Changes', () => {
  it('disables Boons in Cursed Idol difficulty', () => {
    const state = createInitialGameState(700, 'cursed_idol');
    expect(state.boonDeck.length).toBe(0);
    expect(state.boonsInPlay.length).toBe(0);
  });

  it('penalizes unused boons in Legend difficulty', () => {
    const state = createInitialGameState(800, 'legend');
    state.adventureDiscard = Array.from({ length: 20 }, (_, i) => ({
      id: `c-${i}`,
      suit: 'coin',
      value: 2,
      isSkullCave: false,
      isIdol: false,
    }));
    state.stacks = [[], [], [], []];
    // In Legend, unused boons in boonDeck or boonsInPlay cost -1 each
    const score = calculateScore(state);
    expect(score.unusedBoonsCount).toBe(5);
    expect(score.unusedBoonsPenalty).toBe(5);
    expect(score.totalScore).toBe(20 - 5);
  });
});
