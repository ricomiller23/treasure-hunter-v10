import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayerStats } from '../store/gameStore.ts';
import { DifficultyLevel } from '../engine/types.ts';

export interface StatsModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const [selectedDiff, setSelectedDiff] = useState<DifficultyLevel>('explorer');
  const dStats = stats.byDifficulty[selectedDiff];

  const avgScore =
    dStats.gamesPlayed > 0
      ? (dStats.totalScore / dStats.gamesPlayed).toFixed(1)
      : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#142318] border-2 border-amber-600/70 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
          <h2 className="text-2xl font-black text-amber-300 uppercase tracking-wider font-display">
            EXPEDITION SERVICE RECORD
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-amber-200/60 hover:text-amber-200 text-xl font-bold px-2 py-1 rounded bg-black/40 hover:bg-black/60 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Difficulty Tab Filter */}
        <div className="grid grid-cols-4 gap-1 my-3">
          {(
            [
              { id: 'explorer', label: 'Explorer' },
              { id: 'adventurer', label: 'Adventurer' },
              { id: 'legend', label: 'Legend' },
              { id: 'cursed_idol', label: 'Cursed' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedDiff(t.id)}
              className={`py-1 px-1 text-[10px] sm:text-xs font-bold uppercase rounded border transition-all cursor-pointer ${
                selectedDiff === t.id
                  ? 'bg-amber-600 text-stone-950 border-amber-300 shadow font-display'
                  : 'bg-stone-900/60 text-amber-200/70 border-stone-800 hover:bg-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="py-2 space-y-3 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30">
              <span className="text-2xl font-mono font-black text-amber-400">
                {dStats.gamesPlayed}
              </span>
              <p className="text-[10px] uppercase font-bold text-amber-200/60 mt-0.5">
                Expeditions
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30">
              <span className="text-2xl font-mono font-black text-emerald-400">
                {dStats.bestScore}
                <span className="text-xs text-amber-200/50"> / 44</span>
              </span>
              <p className="text-[10px] uppercase font-bold text-amber-200/60 mt-0.5">
                Personal Best
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30">
              <span className="text-2xl font-mono font-black text-amber-300">
                {avgScore}
              </span>
              <p className="text-[10px] uppercase font-bold text-amber-200/60 mt-0.5">
                Average Score
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30">
              <span className="text-2xl font-mono font-black text-[#fbbf24]">
                {dStats.perfectExpeditions}
              </span>
              <p className="text-[10px] uppercase font-bold text-amber-200/60 mt-0.5">
                Perfect Runs (44)
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-amber-900/30 flex items-center justify-between text-xs text-amber-100">
            <span>Current High-Score Streak (≥ 30):</span>
            <strong className="text-amber-400 font-mono text-sm">
              {dStats.currentStreak}
            </strong>
          </div>

          {/* Cursed Idol Unlock Banner */}
          <div className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 text-[11px] text-amber-200/80 flex items-center justify-between">
            <span>Cursed Idol Mode:</span>
            {stats.cursedIdolUnlocked ? (
              <span className="text-emerald-400 font-bold">UNLOCKED ✓</span>
            ) : (
              <span className="text-amber-400/70 font-mono text-[10px]">
                Score 30+ on Legend to unlock
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold border border-slate-600 cursor-pointer font-display"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
