import { Card, Suit } from './types.ts';

// Config constant: odd-numbered cards 1, 3, 5, 7, 9
export const SKULL_CAVE_VALUES = [1, 3, 5, 7, 9];

export const SUITS: Suit[] = ['skull', 'gem', 'dagger', 'coin'];

export function createAdventureDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (let value = 1; value <= 10; value++) {
      const isIdol = value === 10;
      const isSkullCave = SKULL_CAVE_VALUES.includes(value);
      cards.push({
        id: `${suit}-${value}`,
        suit,
        value,
        isIdol,
        isSkullCave,
      });
    }
  }
  return cards;
}

export function isSkullCaveCard(card: Card): boolean {
  return card.isSkullCave;
}

export function isIdolCard(card: Card): boolean {
  return card.isIdol;
}
