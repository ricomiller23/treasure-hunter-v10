import React from 'react';
import { calculateScore } from '../engine/rules.ts';
import { GameState } from '../engine/types.ts';

export interface GameHUDProps {
  state: GameState;
  hintsEnabled: boolean;
  canDeal: boolean;
  onDeal: () => void;
  onUndo: () => void;
  onToggleHints: () => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onEndGame: () => void;
  onExit: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  hintsEnabled,
  canDeal,
  onDeal,
  onUndo,
  onToggleHints,
  onOpenRules,
  onOpenSettings,
  onEndGame,
  onExit,
}) => {
  const projectedScore = calculateScore(state);
  const pips = Math.min(4, state.discardsThisRound);

  return (
    <header className="w-full bg-[#0d1a12] border-b border-amber-900/40 px-3 py-2 flex items-center justify-between shadow-md z-20">
      {/* Left: Navigation and Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onExit}
          className="text-xs font-bold text-amber-200/60 hover:text-amber-300 transition-colors cursor-pointer px-1.5 py-1 rounded bg-black/30 border border-amber-900/40"
        >
          ← Exit
        </button>

        <h1
          className="text-lg sm:text-2xl font-black text-amber-300 tracking-wider font-display uppercase"
        >
          TREASURE HUNTER
        </h1>

        <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-600/40 uppercase">
          {state.difficulty}
        </span>
      </div>

      {/* Center: Round & 4-Pip Boon Meter */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="text-center">
          <div className="text-[10px] uppercase font-mono text-amber-200/60">Round</div>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            #{state.roundNumber}
          </div>
        </div>

        {/* 4-Pip Boon Meter */}
        <div className="flex flex-col items-center">
          <div className="text-[9px] uppercase font-mono text-amber-200/60 flex items-center gap-1">
            <span>Boon Meter</span>
            {state.boonDrawnThisRound && <span className="text-emerald-400 font-bold">✓</span>}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-all ${
                  i <= pips
                    ? 'bg-amber-400 border-amber-200 shadow-sm shadow-amber-400'
                    : 'bg-stone-900 border-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Live Projected Score */}
        <div className="text-center">
          <div className="text-[10px] uppercase font-mono text-amber-200/60">Live Score</div>
          <div className="text-sm sm:text-base font-bold text-amber-300 font-mono">
            {projectedScore.totalScore}{' '}
            <span className="text-[10px] text-amber-200/50">/ 44</span>
          </div>
        </div>
      </div>

      {/* Right: Controls & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
        {/* Deal button */}
        {canDeal ? (
          <button
            onClick={onDeal}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold uppercase tracking-wider border border-amber-300 shadow cursor-pointer font-display text-sm animate-pulse"
          >
            🎴 Deal
          </button>
        ) : (
          <button
            onClick={onEndGame}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider border border-emerald-400 shadow cursor-pointer font-display text-sm"
          >
            🏆 Conclude
          </button>
        )}

        {/* Undo button */}
        <button
          disabled={state.undosRemaining <= 0 || !state.undoStack || state.undoStack.length === 0}
          onClick={onUndo}
          className={`px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold cursor-pointer text-[11px] ${
            state.undosRemaining <= 0 ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          title={`Undo last action (${state.undosRemaining} left)`}
        >
          ↩ Undo
        </button>

        {/* Hint toggle */}
        <button
          onClick={onToggleHints}
          className={`px-2 py-1 rounded border font-bold cursor-pointer text-[11px] ${
            hintsEnabled
              ? 'bg-amber-600 text-stone-950 border-amber-300 font-bold'
              : 'bg-slate-800 text-stone-300 border-slate-600'
          }`}
          title="Toggle legal discard highlights"
        >
          💡 Hint
        </button>

        <button
          onClick={onOpenRules}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold cursor-pointer text-[11px]"
          title="Illustrated rules and example play"
        >
          📖
        </button>

        <button
          onClick={onOpenSettings}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold cursor-pointer text-[11px]"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
};
