export type Suit = 'skull' | 'gem' | 'dagger' | 'coin';

export interface Card {
  id: string; // e.g. "coin-10", "skull-3"
  suit: Suit;
  value: number; // 1 to 10
  isSkullCave: boolean;
  isIdol: boolean;
}

export type BoonId = 'base_camp' | 'machete' | 'rope_bridge' | 'map' | 'lantern';

export type BoonTargeting = 'none' | 'card' | 'stack' | 'twoStacks';

export interface BoonCard {
  id: BoonId;
  name: string;
  flavorText: string;
  rulesText: string;
  targeting: BoonTargeting;
}

export type DifficultyLevel = 'explorer' | 'adventurer' | 'legend' | 'cursed_idol';

export interface BoonTargetCard {
  type: 'card';
  stackIndex: number;
}

export interface BoonTargetStack {
  type: 'stack';
  stackIndex: number;
}

export interface BoonTargetTwoStacks {
  type: 'twoStacks';
  stack1: number;
  stack2: number;
}

export type BoonTarget = BoonTargetCard | BoonTargetStack | BoonTargetTwoStacks;

export interface GameLogEntry {
  round: number;
  description: string;
  timestamp: number;
}

export interface GameScoreBreakdown {
  discardsCount: number;
  discardsScore: number; // +1 each
  idolsCount: number;
  idolsScore: number; // +2 each
  skullCavesCount: number;
  skullCavesPenalty: number; // -1 each
  unusedBoonsCount: number;
  unusedBoonsPenalty: number; // -1 each (Legend difficulty only)
  totalScore: number;
  isPerfect: boolean; // totalScore === 44
}

export interface GameState {
  seed: number;
  roundNumber: number;
  difficulty: DifficultyLevel;

  // Deck zones
  adventureDeck: Card[]; // face down draw pile
  adventureDiscard: Card[]; // face up discard pile

  // 4 main card stacks (0 to 3)
  stacks: Card[][];

  // Boon zones
  boonDeck: BoonCard[];
  boonDiscard: BoonCard[];
  boonsInPlay: BoonCard[];
  baseCampCard: Card | null; // holds any 1 card safely

  // Round metrics
  discardsThisRound: number;
  boonDrawnThisRound: boolean;
  perilActive: boolean; // true if current deal had 4 skull cave cards

  // Temporary boon effects
  mapPeekCards: Card[] | null;

  // Assists & History
  undosRemaining: number;
  history: GameLogEntry[];
  undoStack?: GameState[];

  // Game over state
  isGameOver: boolean;
  gameOverReason: string | null;
  scoreBreakdown?: GameScoreBreakdown;
  lastActionMessage: string | null;
}

export type GameAction =
  | { type: 'DEAL' }
  | { type: 'DISCARD_CARD'; stackIndex: number }
  | { type: 'MOVE_TO_EMPTY_STACK'; fromStackIndex: number; toStackIndex: number }
  | { type: 'USE_BOON'; boonId: BoonId; target?: BoonTarget }
  | { type: 'RETURN_FROM_BASE_CAMP'; toStackIndex: number }
  | { type: 'END_GAME' }
  | { type: 'UNDO' };
