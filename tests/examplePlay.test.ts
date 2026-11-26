import { describe, it, expect } from 'vitest';
import { createInitialGameState, applyAction, getLegalDiscards } from '../src/engine/rules.ts';
import { Card } from '../src/engine/types.ts';

describe("Rulebook Example Play Regression", () => {
  it("faithfully executes the exact rulebook play sequence and awards a Boon on 4th discard", () => {
    let state = createInitialGameState(999, 'explorer');

    // Cards involved in the play:
    const card3Coins: Card = { id: 'coin-3', suit: 'coin', value: 3, isSkullCave: true, isIdol: false };
    const card4Coins: Card = { id: 'coin-4', suit: 'coin', value: 4, isSkullCave: false, isIdol: false };
    const card8Coins: Card = { id: 'coin-8', suit: 'coin', value: 8, isSkullCave: false, isIdol: false };
    const card10Gems: Card = { id: 'gem-10', suit: 'gem', value: 10, isSkullCave: false, isIdol: true };
    const card9Gems: Card = { id: 'gem-9', suit: 'gem', value: 9, isSkullCave: true, isIdol: false };
    const card10Daggers: Card = { id: 'dagger-10', suit: 'dagger', value: 10, isSkullCave: false, isIdol: true };
    const card8Daggers: Card = { id: 'dagger-8', suit: 'dagger', value: 8, isSkullCave: false, isIdol: false };

    // Initial board setup:
    // Stack 0: [10 of Gems (bottom), 8 of Coins (middle), 3 of Coins (top)]
    // Stack 1: [4 of Coins (top)]
    // Stack 2: [10 of Daggers (bottom), 9 of Gems (top)]
    // Stack 3: [8 of Daggers (top)]
    state.stacks = [
      [card10Gems, card8Coins, card3Coins],
      [card4Coins],
      [card10Daggers, card9Gems],
      [card8Daggers],
    ];
    state.discardsThisRound = 0;
    state.boonsInPlay = [];
    state.boonDrawnThisRound = false;

    // Check exposed tops match rulebook description:
    // 3 of Coins, 4 of Coins, 9 of Gems, 8 of Daggers, with 8 of Coins beneath 3 of Coins.
    expect(state.stacks[0][state.stacks[0].length - 1].id).toBe('coin-3');
    expect(state.stacks[1][state.stacks[1].length - 1].id).toBe('coin-4');
    expect(state.stacks[2][state.stacks[2].length - 1].id).toBe('gem-9');
    expect(state.stacks[3][state.stacks[3].length - 1].id).toBe('dagger-8');

    // 1. Remove 3 of Coins (legal because 4 of Coins is showing)
    let legal = getLegalDiscards(state);
    expect(legal.some((l) => l.card.id === 'coin-3')).toBe(true);
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 0 });
    expect(state.discardsThisRound).toBe(1);
    expect(state.adventureDiscard[state.adventureDiscard.length - 1].id).toBe('coin-3');
    // Top of Stack 0 is now 8 of Coins
    expect(state.stacks[0][state.stacks[0].length - 1].id).toBe('coin-8');

    // 2. Remove 4 of Coins (legal because 8 of Coins is showing)
    legal = getLegalDiscards(state);
    expect(legal.some((l) => l.card.id === 'coin-4')).toBe(true);
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 1 });
    expect(state.discardsThisRound).toBe(2);
    expect(state.adventureDiscard[state.adventureDiscard.length - 1].id).toBe('coin-4');
    // Stack 1 is now empty!
    expect(state.stacks[1].length).toBe(0);

    // 3. Move 8 of Coins into the emptied Stack 1
    state = applyAction(state, {
      type: 'MOVE_TO_EMPTY_STACK',
      fromStackIndex: 0,
      toStackIndex: 1,
    });
    expect(state.stacks[1].length).toBe(1);
    expect(state.stacks[1][0].id).toBe('coin-8');
    // Card uncovered in Stack 0 is 10 of Gems
    expect(state.stacks[0][state.stacks[0].length - 1].id).toBe('gem-10');

    // 4. Remove 9 of Gems (legal because 10 of Gems is showing)
    legal = getLegalDiscards(state);
    expect(legal.some((l) => l.card.id === 'gem-9')).toBe(true);
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 2 });
    expect(state.discardsThisRound).toBe(3);
    expect(state.adventureDiscard[state.adventureDiscard.length - 1].id).toBe('gem-9');
    // Card uncovered in Stack 2 is 10 of Daggers
    expect(state.stacks[2][state.stacks[2].length - 1].id).toBe('dagger-10');

    // 5. Remove 8 of Daggers (legal because 10 of Daggers is showing)
    legal = getLegalDiscards(state);
    expect(legal.some((l) => l.card.id === 'dagger-8')).toBe(true);
    state = applyAction(state, { type: 'DISCARD_CARD', stackIndex: 3 });
    expect(state.discardsThisRound).toBe(4);
    expect(state.adventureDiscard[state.adventureDiscard.length - 1].id).toBe('dagger-8');

    // Assert: Exactly 4 discards achieved in this round, and a Boon was rewarded!
    expect(state.boonDrawnThisRound).toBe(true);
    expect(state.boonsInPlay.length).toBe(1);
  });
});
