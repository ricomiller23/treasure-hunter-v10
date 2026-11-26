import React from 'react';
import { motion } from 'framer-motion';
import { DifficultyLevel } from '../engine/types.ts';

export interface SettingsModalProps {
  difficulty: DifficultyLevel;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  volume: number;
  autoDiscard: boolean;
  colorblindMode: boolean;
  reducedMotion: boolean;
  animationSpeed: 'normal' | 'fast';
  cursedIdolUnlocked: boolean;
  onSetDifficulty: (diff: DifficultyLevel) => void;
  onToggleHints: () => void;
  onToggleSound: () => void;
  onSetVolume: (vol: number) => void;
  onToggleAutoDiscard: () => void;
  onToggleColorblindMode: () => void;
  onToggleReducedMotion: () => void;
  onSetAnimationSpeed: (speed: 'normal' | 'fast') => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  difficulty,
  hintsEnabled,
  soundEnabled,
  volume,
  autoDiscard,
  colorblindMode,
  reducedMotion,
  animationSpeed,
  cursedIdolUnlocked,
  onSetDifficulty,
  onToggleHints,
  onToggleSound,
  onSetVolume,
  onToggleAutoDiscard,
  onToggleColorblindMode,
  onToggleReducedMotion,
  onSetAnimationSpeed,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#142318] border-2 border-amber-600/70 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/50">
          <h2 className="text-2xl font-black text-amber-300 uppercase tracking-wider font-display">
            EXPEDITION SETTINGS
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-amber-200/60 hover:text-amber-200 text-xl font-bold px-2 py-1 rounded bg-black/40 hover:bg-black/60 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Options Body */}
        <div className="py-4 space-y-4 text-xs text-amber-100">
          {/* Difficulty Level */}
          <div>
            <label className="block text-amber-300 font-bold uppercase tracking-wider mb-1.5 font-mono">
              Expedition Rank
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'explorer', label: 'Explorer', sub: 'Standard + Assists' },
                  { id: 'adventurer', label: 'Adventurer', sub: '3 Undos, No hints' },
                  { id: 'legend', label: 'Legend', sub: '1 Boon/rnd, -1 unused' },
                  { id: 'cursed_idol', label: 'Cursed Idol', sub: 'No Boons allowed' },
                ] as const
              ).map((d) => {
                const isLocked = d.id === 'cursed_idol' && !cursedIdolUnlocked;
                const isSelected = difficulty === d.id;

                return (
                  <button
                    key={d.id}
                    disabled={isLocked}
                    onClick={() => onSetDifficulty(d.id)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-600 text-stone-950 border-amber-300 font-bold shadow'
                        : isLocked
                        ? 'bg-stone-900/50 text-stone-600 border-stone-800 cursor-not-allowed'
                        : 'bg-stone-900/70 text-amber-200/80 border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{d.label}</span>
                      {isLocked && <span className="text-[10px]">🔒</span>}
                    </div>
                    <div className="text-[9px] opacity-80">{d.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Volume */}
          <div className="p-2.5 rounded-lg bg-black/40 border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-300">Expedition Audio</span>
                <p className="text-[10px] text-amber-200/60">Jungle ambiance and card foley</p>
              </div>
              <button
                onClick={onToggleSound}
                className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                  soundEnabled
                    ? 'bg-emerald-600 text-white border-emerald-400'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                {soundEnabled ? 'ON' : 'MUTED'}
              </button>
            </div>

            {soundEnabled && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-[10px] font-mono text-amber-200/70">Vol</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onSetVolume(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] font-mono text-amber-300 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Legal Discard Hints */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-900/40">
            <div>
              <span className="font-bold text-amber-300">Removal Hints</span>
              <p className="text-[10px] text-amber-200/60">Glow highlight on legal card discards</p>
            </div>
            <button
              onClick={onToggleHints}
              className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                hintsEnabled
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {hintsEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Optional Auto-Discard */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-900/40">
            <div>
              <span className="font-bold text-amber-300">Auto-Discard</span>
              <p className="text-[10px] text-amber-200/60">Automatically discard when only 1 choice exists</p>
            </div>
            <button
              onClick={onToggleAutoDiscard}
              className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                autoDiscard
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {autoDiscard ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Colorblind Mode */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-900/40">
            <div>
              <span className="font-bold text-amber-300">Colorblind Assist</span>
              <p className="text-[10px] text-amber-200/60">Adds suit text abbreviations and high contrast labels</p>
            </div>
            <button
              onClick={onToggleColorblindMode}
              className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                colorblindMode
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {colorblindMode ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-900/40">
            <div>
              <span className="font-bold text-amber-300">Reduced Motion</span>
              <p className="text-[10px] text-amber-200/60">Minimize card animations</p>
            </div>
            <button
              onClick={onToggleReducedMotion}
              className={`px-3 py-1 rounded text-xs font-bold border cursor-pointer ${
                reducedMotion
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Animation Speed */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-900/40">
            <div>
              <span className="font-bold text-amber-300">Animation Speed</span>
              <p className="text-[10px] text-amber-200/60">Card transitions and dealing pace</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSetAnimationSpeed('normal')}
                className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                  animationSpeed === 'normal'
                    ? 'bg-amber-600 text-stone-950 border-amber-300'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onSetAnimationSpeed('fast')}
                className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                  animationSpeed === 'fast'
                    ? 'bg-amber-600 text-stone-950 border-amber-300'
                    : 'bg-stone-800 text-stone-400 border-stone-700'
                }`}
              >
                Fast
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-amber-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-200 text-xs font-bold border border-slate-600 cursor-pointer font-display tracking-wider"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
