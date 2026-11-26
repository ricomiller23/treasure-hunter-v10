import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.ts';
import { DifficultyLevel } from '../engine/types.ts';
import { getDailySeed } from '../engine/rng.ts';

export const TitleScreen: React.FC = () => {
  const {
    startNewGame,
    difficulty,
    setDifficulty,
    openModal,
    stats,
  } = useGameStore();

  const [seedInput, setSeedInput] = useState<string>('');

  const handleStart = (customSeed?: number) => {
    const seed = customSeed ?? (seedInput ? parseInt(seedInput, 10) || Date.now() : Date.now());
    startNewGame(seed, difficulty);
  };

  const handleDaily = () => {
    const daily = getDailySeed();
    startNewGame(daily, difficulty);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08120b] text-[#eadeca] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden">
      {/* Background Ambience & Foliage Silhouettes */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-stone-950/60 to-[#08120b]" />

      {/* Drifting Fireflies particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { top: '20%', left: '15%', delay: 0 },
          { top: '35%', left: '80%', delay: 1.2 },
          { top: '65%', left: '25%', delay: 0.8 },
          { top: '75%', left: '70%', delay: 2.1 },
          { top: '50%', left: '45%', delay: 1.6 },
        ].map((f, i) => (
          <div
            key={i}
            style={{ top: f.top, left: f.left, animationDelay: `${f.delay}s` }}
            className="absolute w-2 h-2 rounded-full bg-amber-300/80 shadow-md shadow-amber-300 blur-[1px] animate-pulse"
          />
        ))}
      </div>

      {/* Top Header Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] uppercase tracking-widest font-mono text-amber-200/70">
            JUNGLE SOLITAIRE • 2013
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => openModal('rules')}
            className="px-3 py-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-amber-900/50 font-bold transition-all cursor-pointer text-amber-200"
          >
            📖 Rules
          </button>
          <button
            onClick={() => openModal('stats')}
            className="px-3 py-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-amber-900/50 font-bold transition-all cursor-pointer text-amber-200"
          >
            🏆 Records
          </button>
          <button
            onClick={() => openModal('settings')}
            className="px-3 py-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-amber-900/50 font-bold transition-all cursor-pointer text-amber-200"
          >
            ⚙️ Options
          </button>
        </div>
      </header>

      {/* Main Journal Cover / Hero */}
      <main className="flex flex-col items-center text-center z-10 my-auto max-w-2xl px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2 text-xs uppercase tracking-[0.3em] text-amber-400 font-bold font-mono">
            <span>⚜️</span>
            <span>TIM KINGS-LYNNE'S</span>
            <span>⚜️</span>
          </div>

          <h1
            className="text-6xl sm:text-8xl md:text-9xl font-black text-amber-300 tracking-wider leading-none drop-shadow-2xl font-display uppercase"
          >
            TREASURE
            <br />
            HUNTER
          </h1>

          <p className="text-sm sm:text-base text-amber-100/80 max-w-lg mx-auto mt-3 font-serif italic">
            Excavate 4 Sacred Idols hidden deep within the cursed temple. Avoid the Skull Caves and
            survive the Peril of the jungle.
          </p>
        </motion.div>

        {/* Difficulty Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 w-full max-w-lg"
        >
          <label className="block text-xs uppercase tracking-widest font-bold text-amber-300/70 mb-2 font-mono">
            EXPEDITION DIFFICULTY (RANK)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'explorer', name: 'Explorer', badge: 'Default' },
                { id: 'adventurer', name: 'Adventurer', badge: '3 Undos' },
                { id: 'legend', name: 'Legend', badge: 'Hardcore' },
                { id: 'cursed_idol', name: 'Cursed', badge: 'No Boons' },
              ] as const
            ).map((d) => {
              const isLocked = d.id === 'cursed_idol' && !stats.cursedIdolUnlocked;
              const isSelected = difficulty === d.id;

              return (
                <button
                  key={d.id}
                  disabled={isLocked}
                  onClick={() => setDifficulty(d.id as DifficultyLevel)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-stone-950 border-amber-300 font-bold shadow-lg shadow-amber-600/30 scale-102 font-display text-sm'
                      : isLocked
                      ? 'bg-stone-900/40 text-stone-600 border-stone-800 cursor-not-allowed'
                      : 'bg-stone-900/70 text-amber-200/80 border-amber-900/40 hover:border-amber-700 hover:bg-stone-800'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-center gap-1">
                    <span>{d.name}</span>
                    {isLocked && <span className="text-[10px]">🔒</span>}
                  </div>
                  <div className="text-[9px] opacity-75 mt-0.5">{d.badge}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
        >
          <button
            onClick={() => handleStart()}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xl uppercase tracking-wider shadow-2xl shadow-amber-500/30 border border-amber-300 transition-all hover:scale-102 cursor-pointer font-display"
          >
            🧭 EMBARK ON EXPEDITION
          </button>

          <button
            onClick={handleDaily}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#142318] hover:bg-[#1f3524] text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-600/50 shadow transition-all cursor-pointer whitespace-nowrap"
          >
            ☀️ Daily Expedition
          </button>
        </motion.div>

        {/* Seed Input Accordion / Replay */}
        <div className="mt-4 flex items-center gap-2 text-xs text-amber-200/60 font-mono">
          <span>Seed:</span>
          <input
            type="text"
            placeholder="Random"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            className="bg-black/40 border border-amber-900/40 rounded px-2 py-1 text-amber-300 text-xs w-28 text-center"
          />
          {seedInput && (
            <button
              onClick={() => handleStart(parseInt(seedInput, 10))}
              className="text-amber-400 hover:text-amber-300 underline font-bold"
            >
              Play Seed
            </button>
          )}
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="w-full max-w-4xl text-center text-[11px] text-amber-200/40 z-10 pt-4 border-t border-amber-900/30 font-serif">
        Treasure Hunter © 2013 Tim Kings-Lynne • Digital Solitaire Edition
      </footer>
    </div>
  );
};
