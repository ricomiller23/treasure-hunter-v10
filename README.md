# TREASURE HUNTER — Solo Edition

A solitaire card game faithfully implementing **Treasure Hunter** (© 2013 Tim Kings-Lynne) for personal play. Engineered with an expedition journal aesthetic, procedural SVG card illustrations, a synthesized Web Audio sound engine, and a framework-free rules engine.

---

## 1. Quick Start

```bash
cd /Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To run the Vitest test suite:
```bash
npm test
```

To build for production:
```bash
npm run build
npm run preview
```

---

## 2. How to Edit Boons (`src/engine/boons.ts`)

All Boon cards are defined in [`src/engine/boons.ts`](file:///Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/src/engine/boons.ts) in the `DEFAULT_BOONS` dictionary.

Each Boon entry adheres to this schema:
```typescript
export interface BoonCard {
  id: BoonId;
  name: string;
  flavorText: string;
  rulesText: string;
  targeting: 'none' | 'card' | 'stack' | 'twoStacks';
}
```

To modify rules text, names, or targeting behavior:
1. Open [`src/engine/boons.ts`](file:///Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/src/engine/boons.ts).
2. Edit the corresponding entry in `DEFAULT_BOONS`.
3. If changing action behavior, update the handler in [`src/engine/rules.ts`](file:///Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/src/engine/rules.ts) under `case 'USE_BOON':`.

---

## 3. How to Change Skull Cave Values (`src/engine/deck.ts`)

The Skull Cave card values are defined in [`src/engine/deck.ts`](file:///Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/src/engine/deck.ts) as a configuration constant:

```typescript
export const SKULL_CAVE_VALUES = [1, 3, 5, 7, 9];
```

To alter which card values count as Skull Caves (e.g. if testing alternative editions):
1. Open [`src/engine/deck.ts`](file:///Users/ericmiller/.gemini/antigravity/scratch/treasure-hunter/src/engine/deck.ts).
2. Change the array values (e.g. `export const SKULL_CAVE_VALUES = [1, 3, 5, 7, 9];`).
3. Re-run tests with `npm test` to confirm rule handling.

---

## 4. Game Rules Summary

- **Adventure Deck (40 cards)**: 4 suits (Skull, Gem, Dagger, Coin) with values 1 to 10.
  - Value 10: **Sacred Idols** (+2 points if exposed on top at game end; cannot be removed by standard rules).
  - Values 1, 3, 5, 7, 9: **Skull Caves** (-1 point if exposed on top at game end).
- **A Round**:
  - **Deal**: 4 cards dealt face up, one onto each of the 4 stacks (fanned downward).
  - **Play**: If two or more exposed top cards share a suit, discard any except the highest of that suit.
  - **Empty Stacks**: The top card of any other stack may be moved into an empty stack space.
  - **Boon Reward**: Discarding 4 or more cards in a single round immediately awards 1 Boon card.
  - **PERIL!**: If a deal contains 4 Skull Caves, all Boons in play are destroyed (except Base Camp holding a card).
- **Game End & Scoring**:
  - Ends when the Adventure deck is empty and no more discards are possible.
  - Score = `+1 per Discard` + `+2 per Exposed Idol` - `1 per Exposed Skull Cave` (- `1 per unused Boon in Legend`).
  - Maximum possible score = **44 points**. Achieving 44 triggers a "PERFECT EXPEDITION" celebration.

---

## 5. Difficulty Levels

1. **Explorer (Default)**: Standard rules, legal discard glows, hints, unlimited undo, tutorial assist.
2. **Adventurer**: Standard rules, no hints, 3 undos per game.
3. **Legend**: Max 1 Boon drawn per round, -1 penalty per unused Boon at game end, Boon deck does not reshuffle.
4. **Cursed Idol**: No Boon cards at all. Unlocked by scoring 30+ points on Legend rank.

---

## 6. Deliverables & Screenshots

All high-resolution screenshots have been exported to `~/Downloads` (`/Users/ericmiller/Downloads`):
- `treasure_hunter_01_title_screen.png` — Main menu with difficulty selector, seed inputs, and journal art.
- `treasure_hunter_02_midgame.png` — Active game table with 4 fanned stacks, live HUD, and discard piles.
- `treasure_hunter_03_peril_event.png` — Dramatic Peril event screen with red alert border and destruction of boons.
- `treasure_hunter_04_mobile_viewport.png` — Mobile phone layout tested at 390x844 iPhone dimensions.
- `treasure_hunter_05_end_screen.png` — Official Tally Sheet debriefing with line-item score breakdown and star rating.
