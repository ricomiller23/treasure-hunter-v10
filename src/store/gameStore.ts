import { create } from 'zustand';
import {
  BoonCard,
  DifficultyLevel,
  GameState,
} from '../engine/types.ts';
import {
  createInitialGameState,
  applyAction,
  getLegalDiscards,
  getLegalEmptyStackMoves,
  calculateScore,
} from '../engine/rules.ts';
import { soundManager } from '../audio/soundManager.ts';

export interface DifficultyStats {
  gamesPlayed: number;
  bestScore: number;
  totalScore: number;
  perfectExpeditions: number;
  currentStreak: number;
}

export interface PlayerStats {
  byDifficulty: Record<DifficultyLevel, DifficultyStats>;
  cursedIdolUnlocked: boolean;
}

const STATS_KEY = 'treasure_hunter_stats_v1';
const SAVE_GAME_KEY = 'treasure_hunter_saved_game_v1';

function getDefaultStats(): PlayerStats {
  const defaultDiff: DifficultyStats = {
    gamesPlayed: 0,
    bestScore: 0,
    totalScore: 0,
    perfectExpeditions: 0,
    currentStreak: 0,
  };
  return {
    byDifficulty: {
      explorer: { ...defaultDiff },
      adventurer: { ...defaultDiff },
      legend: { ...defaultDiff },
      cursed_idol: { ...defaultDiff },
    },
    cursedIdolUnlocked: false,
  };
}

function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return getDefaultStats();
}

function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export interface GameStoreState {
  gameState: GameState;
  screen: 'title' | 'game' | 'game_over';
  activeModal: 'none' | 'rules' | 'settings' | 'stats';
  difficulty: DifficultyLevel;

  // Boon activation workflow
  activeBoon: BoonCard | null;
  targetingStack1: number | null;

  // Settings
  hintsEnabled: boolean;
  soundEnabled: boolean;
  volume: number;
  autoDiscard: boolean;
  colorblindMode: boolean;
  reducedMotion: boolean;
  animationSpeed: 'normal' | 'fast';

  // Stats
  stats: PlayerStats;

  // Actions
  startNewGame: (seed?: number, difficulty?: DifficultyLevel) => void;
  setScreen: (screen: 'title' | 'game' | 'game_over') => void;
  openModal: (modal: 'rules' | 'settings' | 'stats') => void;
  closeModal: () => void;
  setDifficulty: (diff: DifficultyLevel) => void;

  // Gameplay actions
  dealCards: () => void;
  discardCard: (stackIndex: number) => void;
  moveCardToEmptyStack: (fromIndex: number, toIndex: number) => void;
  selectBoon: (boon: BoonCard | null) => void;
  targetStackForBoon: (stackIndex: number) => void;
  returnFromBaseCamp: (toStackIndex: number) => void;
  undo: () => void;
  endGameManually: () => void;

  // Settings actions
  toggleHints: () => void;
  toggleSound: () => void;
  setVolume: (vol: number) => void;
  toggleAutoDiscard: () => void;
  toggleColorblindMode: () => void;
  setAnimationSpeed: (speed: 'normal' | 'fast') => void;
  toggleReducedMotion: () => void;
  handleGameFinished: (finalState: GameState) => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  gameState: createInitialGameState(Date.now(), 'explorer'),
  screen: 'title',
  activeModal: 'none',
  difficulty: 'explorer',

  activeBoon: null,
  targetingStack1: null,

  hintsEnabled: true,
  soundEnabled: true,
  volume: 0.7,
  autoDiscard: false,
  colorblindMode: false,
  reducedMotion: false,
  animationSpeed: 'normal',

  stats: loadPlayerStats(),

  startNewGame: (seed = Date.now(), diff = get().difficulty) => {
    soundManager.startAmbiance();
    soundManager.playDeal();

    const initialState = createInitialGameState(seed, diff);

    set({
      gameState: initialState,
      screen: 'game',
      difficulty: diff,
      activeBoon: null,
      targetingStack1: null,
      activeModal: 'none',
      hintsEnabled: diff === 'explorer',
    });

    try {
      localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(initialState));
    } catch {
      // ignore
    }
  },

  setScreen: (screen) => set({ screen }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: 'none' }),
  setDifficulty: (difficulty) => set({ difficulty }),

  dealCards: () => {
    const { gameState } = get();
    if (gameState.adventureDeck.length === 0) return;

    soundManager.playDeal();
    const next = applyAction(gameState, { type: 'DEAL' });

    if (next.perilActive) {
      soundManager.playPeril();
    }

    if (next.isGameOver) {
      get().handleGameFinished(next);
    }

    set({
      gameState: next,
      activeBoon: null,
      targetingStack1: null,
    });
  },

  discardCard: (stackIndex: number) => {
    const { gameState, autoDiscard } = get();
    const legal = getLegalDiscards(gameState);
    const isLegal = legal.some((l) => l.stackIndex === stackIndex);

    if (!isLegal) {
      soundManager.playInvalid();
      return;
    }

    soundManager.playDiscard();
    let next = applyAction(gameState, { type: 'DISCARD_CARD', stackIndex });

    if (next.boonDrawnThisRound && !gameState.boonDrawnThisRound) {
      soundManager.playBoon();
    }

    // Auto-discard if enabled and exactly one choice exists
    if (autoDiscard && !next.isGameOver) {
      const remainingLegal = getLegalDiscards(next);
      if (remainingLegal.length === 1) {
        setTimeout(() => {
          get().discardCard(remainingLegal[0].stackIndex);
        }, 300);
      }
    }

    if (next.isGameOver) {
      get().handleGameFinished(next);
    }

    set({ gameState: next });
  },

  moveCardToEmptyStack: (fromIndex: number, toIndex: number) => {
    const { gameState } = get();
    const legalMoves = getLegalEmptyStackMoves(gameState);
    const isLegal = legalMoves.some(
      (m) => m.fromStackIndex === fromIndex && m.toStackIndex === toIndex
    );

    if (!isLegal) {
      soundManager.playInvalid();
      return;
    }

    soundManager.playDeal();
    const next = applyAction(gameState, {
      type: 'MOVE_TO_EMPTY_STACK',
      fromStackIndex: fromIndex,
      toStackIndex: toIndex,
    });

    set({ gameState: next });
  },

  selectBoon: (boon) => {
    if (!boon) {
      set({ activeBoon: null, targetingStack1: null });
      return;
    }

    if (boon.targeting === 'none') {
      // Instant cast like Map
      soundManager.playBoon();
      const next = applyAction(get().gameState, {
        type: 'USE_BOON',
        boonId: boon.id,
      });
      set({ gameState: next, activeBoon: null, targetingStack1: null });
      return;
    }

    set({ activeBoon: boon, targetingStack1: null });
  },

  targetStackForBoon: (stackIndex: number) => {
    const { activeBoon, targetingStack1, gameState } = get();
    if (!activeBoon) return;

    if (activeBoon.targeting === 'card') {
      // Base Camp or Machete
      soundManager.playBoon();
      const next = applyAction(gameState, {
        type: 'USE_BOON',
        boonId: activeBoon.id,
        target: { type: 'card', stackIndex },
      });
      set({ gameState: next, activeBoon: null, targetingStack1: null });
      return;
    }

    if (activeBoon.targeting === 'twoStacks') {
      // Rope Bridge or Lantern
      if (targetingStack1 === null) {
        // Selected first stack
        set({ targetingStack1: stackIndex });
      } else {
        // Selected second stack
        if (targetingStack1 === stackIndex) {
          // Deselect
          set({ targetingStack1: null });
          return;
        }

        soundManager.playBoon();
        const next = applyAction(gameState, {
          type: 'USE_BOON',
          boonId: activeBoon.id,
          target: { type: 'twoStacks', stack1: targetingStack1, stack2: stackIndex },
        });

        set({ gameState: next, activeBoon: null, targetingStack1: null });
      }
    }
  },

  returnFromBaseCamp: (toStackIndex: number) => {
    const { gameState } = get();
    if (gameState.baseCampCard === null) return;
    if (gameState.stacks[toStackIndex].length !== 0) {
      soundManager.playInvalid();
      return;
    }

    soundManager.playDeal();
    const next = applyAction(gameState, {
      type: 'RETURN_FROM_BASE_CAMP',
      toStackIndex,
    });

    set({ gameState: next });
  },

  undo: () => {
    const { gameState } = get();
    if (gameState.undosRemaining <= 0 || !gameState.undoStack || gameState.undoStack.length === 0) {
      soundManager.playInvalid();
      return;
    }

    soundManager.playDeal();
    const next = applyAction(gameState, { type: 'UNDO' });
    set({ gameState: next, activeBoon: null, targetingStack1: null });
  },

  endGameManually: () => {
    const { gameState } = get();
    const next = applyAction(gameState, { type: 'END_GAME' });
    get().handleGameFinished(next);
    set({ gameState: next, screen: 'game_over' });
  },

  handleGameFinished: (finalState: GameState) => {
    const score = calculateScore(finalState);
    const { stats, difficulty } = get();
    const currentDiffStats = stats.byDifficulty[difficulty];

    const nextDiffStats: DifficultyStats = {
      gamesPlayed: currentDiffStats.gamesPlayed + 1,
      bestScore: Math.max(currentDiffStats.bestScore, score.totalScore),
      totalScore: currentDiffStats.totalScore + score.totalScore,
      perfectExpeditions: score.isPerfect
        ? currentDiffStats.perfectExpeditions + 1
        : currentDiffStats.perfectExpeditions,
      currentStreak: score.totalScore >= 30 ? currentDiffStats.currentStreak + 1 : 0,
    };

    const nextStats: PlayerStats = {
      ...stats,
      byDifficulty: {
        ...stats.byDifficulty,
        [difficulty]: nextDiffStats,
      },
      cursedIdolUnlocked:
        stats.cursedIdolUnlocked ||
        (difficulty === 'legend' && score.totalScore >= 30),
    };

    savePlayerStats(nextStats);
    set({ stats: nextStats });
  },

  toggleHints: () => set((s) => ({ hintsEnabled: !s.hintsEnabled })),
  toggleSound: () => {
    const nextMuted = soundManager.toggleMute();
    set({ soundEnabled: !nextMuted });
  },
  setVolume: (volume: number) => {
    soundManager.setVolume(volume);
    set({ volume });
  },
  toggleAutoDiscard: () => set((s) => ({ autoDiscard: !s.autoDiscard })),
  toggleColorblindMode: () => set((s) => ({ colorblindMode: !s.colorblindMode })),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
}));

if (typeof window !== 'undefined') {
  (window as unknown as { __gameStore: typeof useGameStore }).__gameStore = useGameStore;
}
