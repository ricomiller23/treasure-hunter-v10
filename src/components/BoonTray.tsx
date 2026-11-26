import React from 'react';
import { motion } from 'framer-motion';
import { BoonCard, Card } from '../engine/types.ts';
import { BoonGraphic } from '../art/cardArt.tsx';
import { CardView } from './CardView.tsx';

export interface BoonTrayProps {
  boonsInPlay: BoonCard[];
  baseCampCard: Card | null;
  activeBoon: BoonCard | null;
  targetingStack1: number | null;
  onSelectBoon: (boon: BoonCard | null) => void;
  onBaseCampClick: () => void;
}

export const BoonTray: React.FC<BoonTrayProps> = ({
  boonsInPlay,
  baseCampCard,
  activeBoon,
  targetingStack1,
  onSelectBoon,
  onBaseCampClick,
}) => {
  const hasBaseCampInPlay = boonsInPlay.some((b) => b.id === 'base_camp');

  return (
    <div className="w-full bg-[#0a140d]/95 border-t border-amber-900/40 p-2 sm:p-3 shadow-2xl relative backdrop-blur-md">
      {/* Targeting Instructions Banner */}
      {activeBoon && (
        <div className="mb-2 p-2 rounded-xl bg-amber-950/90 border border-amber-400 flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base">✨</span>
            <span className="text-amber-200">
              <strong>{activeBoon.name}:</strong>{' '}
              {activeBoon.id === 'base_camp'
                ? 'Select any exposed card on the board to stash here.'
                : activeBoon.id === 'machete'
                ? 'Select any exposed non-Idol card to discard.'
                : activeBoon.id === 'rope_bridge'
                ? targetingStack1 === null
                  ? 'Select the stack to move the top card FROM.'
                  : `Moving from Stack ${targetingStack1 + 1} — select destination stack.`
                : activeBoon.id === 'lantern'
                ? targetingStack1 === null
                  ? 'Select the FIRST stack to swap.'
                  : `Stack ${targetingStack1 + 1} selected — select the SECOND stack to swap.`
                : 'Targeting active.'}
            </span>
          </div>

          <button
            onClick={() => onSelectBoon(null)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs font-bold border border-slate-600 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Tray Header */}
      <div className="flex items-center justify-between px-2 mb-1.5 text-xs text-amber-200/70 font-mono">
        <span className="font-bold uppercase tracking-wider text-amber-300">
          EXPEDITION GEAR & BOONS IN PLAY
        </span>
        <span className="text-[11px]">
          {boonsInPlay.length} boon{boonsInPlay.length !== 1 ? 's' : ''} active
        </span>
      </div>

      {/* Cards Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 px-1 scrollbar-thin scrollbar-thumb-amber-800/40">
        {/* Base Camp Dedicated Slot */}
        {hasBaseCampInPlay && (
          <div className="flex-shrink-0 flex flex-col items-center">
            {baseCampCard ? (
              <div className="relative group">
                <CardView
                  card={baseCampCard}
                  isExposed={true}
                  onClick={onBaseCampClick}
                  className="hover:ring-2 hover:ring-amber-400 cursor-pointer"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-950 border border-amber-400 text-amber-200 text-[8px] font-bold uppercase px-1 rounded shadow">
                  IN BASE CAMP
                </div>
              </div>
            ) : (
              <CardView
                isBaseCampSlot={true}
                onClick={onBaseCampClick}
              />
            )}
          </div>
        )}

        {/* Other Boons in play */}
        {boonsInPlay
          .filter((b) => b.id !== 'base_camp')
          .map((boon) => {
            const isSelected = activeBoon?.id === boon.id;

            return (
              <motion.button
                key={boon.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectBoon(isSelected ? null : boon)}
                className={`w-28 sm:w-32 h-36 sm:h-40 rounded-xl p-2 flex flex-col justify-between text-left relative overflow-hidden transition-all flex-shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-950 border-amber-300 ring-4 ring-amber-400 shadow-xl'
                    : 'bg-[#1b261b] hover:bg-[#253526] border-amber-600/50 shadow-md'
                }`}
              >
                {/* Header */}
                <div className="z-10">
                  <span className="font-display font-black text-amber-300 text-sm tracking-wide block uppercase leading-tight">
                    {boon.name}
                  </span>
                  <span className="text-[9px] text-amber-200/60 font-mono block">
                    {boon.targeting === 'none' ? 'Instant' : 'Targeted'}
                  </span>
                </div>

                {/* Graphic */}
                <div className="flex-1 my-1 flex items-center justify-center relative">
                  <BoonGraphic boonId={boon.id} className="w-full h-full object-contain" />
                </div>

                {/* Rules preview */}
                <div className="z-10 bg-black/40 p-1 rounded border border-amber-900/40">
                  <p className="text-[9px] text-amber-100/90 leading-tight line-clamp-2">
                    {boon.rulesText}
                  </p>
                </div>
              </motion.button>
            );
          })}

        {boonsInPlay.length === 0 && (
          <div className="py-8 w-full text-center text-amber-200/40 text-xs italic font-serif">
            No Boons in play. Discard 4 cards in a single round to earn a Boon!
          </div>
        )}
      </div>
    </div>
  );
};
