import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../engine/types.ts';
import {
  SUIT_COLORS,
  SuitIcon,
  SkullCaveScene,
  IdolScene,
  StandardCardScene,
} from '../art/cardArt.tsx';

export interface CardViewProps {
  card?: Card;
  isFaceDown?: boolean;
  isExposed?: boolean;
  isLegalDiscard?: boolean;
  isTargeted?: boolean;
  isBaseCampSlot?: boolean;
  colorblindMode?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFaceDown = false,
  isExposed = true,
  isLegalDiscard = false,
  isTargeted = false,
  isBaseCampSlot = false,
  colorblindMode = false,
  onClick,
  className = '',
  style,
}) => {
  // If rendering empty Base Camp slot placeholder
  if (isBaseCampSlot && !card) {
    return (
      <div
        onClick={onClick}
        style={style as any}
        className={`w-24 h-36 sm:w-28 sm:h-40 rounded-xl border-2 border-dashed border-amber-600/50 bg-[#162319]/80 flex flex-col items-center justify-center p-2 text-center select-none cursor-pointer hover:border-amber-400 transition-colors ${className}`}
      >
        <span className="text-xl">⛺</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mt-1">
          Base Camp
        </span>
        <span className="text-[9px] text-amber-200/60 leading-tight mt-0.5">
          Hold 1 card safely
        </span>
      </div>
    );
  }

  // Face-down card back
  if (isFaceDown || !card) {
    return (
      <motion.div
        whileHover={onClick ? { scale: 1.03, y: -2 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        style={style as any}
        className={`w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-[#142318] border-2 border-[#c9a227]/70 shadow-card p-2 flex flex-col items-center justify-center relative overflow-hidden select-none cursor-pointer ${className}`}
      >
        {/* Intricate decorative border */}
        <div className="absolute inset-1 border border-[#c9a227]/30 rounded-lg flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-[#c9a227]/40 flex items-center justify-center rotate-45">
            <div className="w-10 h-10 border border-[#c9a227]/30" />
          </div>
        </div>

        {/* Center compass seal */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#0a130d] border border-[#c9a227] flex items-center justify-center text-[#c9a227] text-sm shadow">
            🧭
          </div>
          <span
            className="text-[#fef08a] font-black tracking-widest text-[10px] mt-1.5 uppercase font-display"
          >
            EXPEDITION
          </span>
        </div>
      </motion.div>
    );
  }

  const colors = SUIT_COLORS[card.suit];

  return (
    <motion.div
      whileHover={isExposed && onClick ? { scale: 1.04, y: -4 } : undefined}
      whileTap={isExposed && onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      style={style as any}
      className={`w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-[#f7f1e1] border-2 shadow-card flex flex-col justify-between p-1.5 relative select-none cursor-pointer transition-shadow ${
        card.isSkullCave
          ? 'border-red-600/80 shadow-card-red-glow'
          : card.isIdol
          ? 'border-amber-500 shadow-card-glow ring-1 ring-amber-400/50'
          : 'border-stone-400'
      } ${
        isLegalDiscard
          ? 'ring-4 ring-emerald-500 shadow-lg shadow-emerald-500/40 animate-pulse'
          : ''
      } ${
        isTargeted
          ? 'ring-4 ring-amber-400 shadow-xl shadow-amber-400/50'
          : ''
      } ${className}`}
    >
      {/* Parchment texture background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#eadeca_1px,transparent_1px)] [background-size:12px_12px] opacity-40 rounded-xl pointer-events-none" />

      {/* Top Left Rank & Suit */}
      <div className="flex items-center gap-1 z-10 px-1 pt-0.5">
        <span
          className="font-black text-base sm:text-lg leading-none"
          style={{ color: colors.primary }}
        >
          {card.value}
        </span>
        <SuitIcon suit={card.suit} className="w-3.5 h-3.5" />
        {colorblindMode && (
          <span className="text-[8px] font-bold uppercase text-stone-600 ml-0.5">
            {card.suit.slice(0, 3)}
          </span>
        )}
      </div>

      {/* Center Illustration */}
      <div className="flex-1 my-0.5 rounded overflow-hidden relative flex items-center justify-center bg-stone-900/5">
        {card.isIdol ? (
          <IdolScene suit={card.suit} className="w-full h-full object-cover" />
        ) : card.isSkullCave ? (
          <SkullCaveScene suit={card.suit} className="w-full h-full object-cover" />
        ) : (
          <StandardCardScene card={card} className="w-full h-full" />
        )}
      </div>

      {/* Bottom Right Rank & Suit (Inverted) */}
      <div className="flex items-center justify-end gap-1 z-10 px-1 pb-0.5 rotate-180">
        <span
          className="font-black text-base sm:text-lg leading-none"
          style={{ color: colors.primary }}
        >
          {card.value}
        </span>
        <SuitIcon suit={card.suit} className="w-3.5 h-3.5" />
      </div>

      {/* Glowing Idol indicator tag */}
      {card.isIdol && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 font-black text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-amber-300 shadow z-20">
          IDOL +2
        </div>
      )}

      {/* Skull Cave warning tag */}
      {card.isSkullCave && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-800 text-red-100 font-black text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-full border border-red-500 shadow z-20">
          CAVE -1
        </div>
      )}
    </motion.div>
  );
};
