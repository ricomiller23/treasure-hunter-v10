import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore.ts';
import { calculateScore } from '../engine/rules.ts';

export const EndScreen: React.FC = () => {
  const { gameState, startNewGame, setScreen } = useGameStore();
  const score = calculateScore(gameState);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (score.isPerfect) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#c9a227', '#fde047', '#ef4444', '#15803d'],
      });
    }
  }, [score.isPerfect]);

  const handleShare = () => {
    const text = `🧭 TREASURE HUNTER SOLITAIRE\nRank: ${gameState.difficulty.toUpperCase()}\nScore: ${score.totalScore}/44\n💀 Discards: ${score.discardsCount} | 👑 Idols: ${score.idolsCount} | 🌋 Caves: ${score.skullCavesCount}\nSeed: ${gameState.seed}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const stars = score.totalScore >= 36 ? 3 : score.totalScore >= 25 ? 2 : score.totalScore >= 12 ? 1 : 0;

  return (
    <div className="min-h-screen w-full bg-[#08120b] text-[#eadeca] flex flex-col justify-between p-4 sm:p-6 overflow-y-auto">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto text-center pt-4"
      >
        <span className="text-xs uppercase tracking-widest font-mono text-amber-400">
          EXPEDITION DEBRIEFING
        </span>

        <h1
          className={`text-5xl sm:text-7xl font-black uppercase tracking-wider leading-none mt-1 font-display ${
            score.isPerfect ? 'text-amber-300 drop-shadow-lg' : 'text-amber-200'
          }`}
        >
          {score.isPerfect
            ? 'PERFECT EXPEDITION!'
            : score.totalScore >= 30
            ? 'LEGENDARY DISCOVERY!'
            : score.totalScore >= 15
            ? 'EXPEDITION CONCLUDED'
            : 'CURSED EXPEDITION'}
        </h1>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 text-2xl my-3">
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= stars ? 'text-amber-400 animate-pulse' : 'text-stone-700'}>
              ★
            </span>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-amber-100/80 max-w-md mx-auto italic font-serif">
          {gameState.gameOverReason || 'The cursed temple yields its relics.'}
        </p>
      </motion.div>

      {/* Score Breakdown Journal Parchment Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg mx-auto my-4 bg-[#f7f1e1] text-[#292524] rounded-2xl p-6 shadow-2xl border-4 border-[#c9a227] relative overflow-hidden"
      >
        {/* Parchment background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#eadeca_1px,transparent_1px)] [background-size:12px_12px] opacity-30 pointer-events-none" />

        <div className="text-center pb-3 border-b-2 border-stone-800/20 mb-4">
          <h3 className="font-display font-black text-2xl tracking-wide uppercase text-stone-900">
            Official Tally Sheet
          </h3>
          <span className="text-[10px] font-mono uppercase text-stone-600 font-bold">
            Rank: {gameState.difficulty} • Seed #{gameState.seed}
          </span>
        </div>

        {/* Line Items */}
        <div className="space-y-3 font-mono text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🎴</span> Adventure Discards ({score.discardsCount})
            </span>
            <strong className="text-emerald-700">+{score.discardsScore}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>👑</span> Sacred Idols Preserved ({score.idolsCount})
            </span>
            <strong className="text-amber-700">+{score.idolsScore}</strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>🌋</span> Exposed Skull Caves ({score.skullCavesCount})
            </span>
            <strong className="text-red-700">-{score.skullCavesPenalty}</strong>
          </div>

          {score.unusedBoonsPenalty > 0 && (
            <div className="flex items-center justify-between text-red-800">
              <span className="flex items-center gap-1.5">
                <span>✨</span> Unused Boons ({score.unusedBoonsCount})
              </span>
              <strong>-{score.unusedBoonsPenalty}</strong>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-3 border-t-2 border-stone-800/30 flex items-center justify-between text-base sm:text-lg font-black font-display text-stone-950">
            <span>TOTAL SCORE:</span>
            <span className="text-2xl text-amber-700">
              {score.totalScore}{' '}
              <span className="text-xs text-stone-600 font-mono font-normal">/ 44 max</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3 py-4 z-10">
        <button
          onClick={() => startNewGame()}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-sm uppercase tracking-wider shadow-lg border border-amber-300 transition-all hover:scale-102 cursor-pointer font-display"
        >
          🔄 New Expedition
        </button>

        <button
          onClick={() => startNewGame(gameState.seed)}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#142318] hover:bg-[#1e3424] text-amber-200 font-bold text-xs uppercase tracking-wider border border-amber-600/50 transition-all hover:scale-102 cursor-pointer"
        >
          Replay Seed
        </button>

        <button
          onClick={handleShare}
          className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase tracking-wider border border-amber-900/50 transition-all cursor-pointer"
        >
          {copied ? '✓ Copied' : '📤 Share'}
        </button>

        <button
          onClick={() => setScreen('title')}
          className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 font-bold text-xs uppercase tracking-wider border border-stone-700 cursor-pointer"
        >
          Menu
        </button>
      </div>
    </div>
  );
};
