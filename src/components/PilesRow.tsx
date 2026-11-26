import React from 'react';
import { Card } from '../engine/types.ts';
import { CardView } from './CardView.tsx';

export interface PilesRowProps {
  adventureDeckCount: number;
  adventureDiscard: Card[];
  boonDeckCount: number;
  boonDiscardCount: number;
  mapPeekCards: Card[] | null;
  canDeal: boolean;
  onDealClick: () => void;
}

export const PilesRow: React.FC<PilesRowProps> = ({
  adventureDeckCount,
  adventureDiscard,
  boonDeckCount,
  boonDiscardCount,
  mapPeekCards,
  canDeal,
  onDealClick,
}) => {
  const topDiscard =
    adventureDiscard.length > 0
      ? adventureDiscard[adventureDiscard.length - 1]
      : undefined;

  return (
    <div className="flex items-start justify-center gap-4 sm:gap-8 py-2 px-3 bg-[#0d1a12]/80 border-b border-amber-900/30 rounded-2xl max-w-4xl mx-auto shadow-lg backdrop-blur-sm">
      {/* 1. Adventure Draw Deck */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/60 mb-1">
          Adventure Deck
        </span>
        <div className="relative">
          {adventureDeckCount > 0 ? (
            <CardView
              isFaceDown={true}
              onClick={canDeal ? onDealClick : undefined}
              className={
                canDeal
                  ? 'hover:ring-2 hover:ring-amber-400 cursor-pointer shadow-lg'
                  : 'cursor-default opacity-90'
              }
            />
          ) : (
            <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl border border-dashed border-stone-700 bg-stone-900/40 flex items-center justify-center text-xs text-stone-500 font-mono">
              Empty
            </div>
          )}

          {/* Badge count */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-950 border border-amber-600/50 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow">
            {adventureDeckCount} left
          </div>

          {/* Map Peek Preview flyout */}
          {mapPeekCards && mapPeekCards.length > 0 && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-amber-950/95 border border-amber-400 p-1.5 rounded-lg shadow-2xl flex items-center gap-1 z-30 whitespace-nowrap animate-bounce">
              <span className="text-[9px] font-bold text-amber-300 mr-1">🗺️ Next:</span>
              {mapPeekCards.map((c) => (
                <span
                  key={c.id}
                  className="text-[10px] font-mono font-bold px-1 rounded bg-black/50 text-amber-200"
                >
                  {c.value} {c.suit.slice(0, 1).toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Adventure Discard Pile */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/60 mb-1">
          Discard Pile
        </span>
        <div className="relative">
          {topDiscard ? (
            <CardView card={topDiscard} isExposed={false} />
          ) : (
            <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl border border-dashed border-stone-700 bg-stone-900/40 flex items-center justify-center text-xs text-stone-500 font-mono">
              Empty
            </div>
          )}

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-950 border border-stone-600 text-stone-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow">
            {adventureDiscard.length} discarded
          </div>
        </div>
      </div>

      {/* 3. Boon Draw Deck */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/60 mb-1">
          Boon Deck
        </span>
        <div className="relative">
          {boonDeckCount > 0 ? (
            <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl bg-[#2a1d0f] border-2 border-amber-600 shadow-card p-2 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-xl">✨</span>
              <span className="font-display font-black text-amber-300 text-xs mt-1 uppercase">
                BOON
              </span>
            </div>
          ) : (
            <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl border border-dashed border-stone-700 bg-stone-900/40 flex items-center justify-center text-xs text-stone-500 font-mono">
              Depleted
            </div>
          )}

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-950 border border-amber-600/50 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow">
            {boonDeckCount}
          </div>
        </div>
      </div>

      {/* 4. Boon Discard Pile */}
      <div className="flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/60 mb-1">
          Spent Boons
        </span>
        <div className="relative">
          <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl border border-dashed border-amber-900/50 bg-stone-900/40 flex flex-col items-center justify-center text-xs text-stone-500 font-mono">
            <span className="text-lg opacity-40">🪦</span>
          </div>

          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-stone-950 border border-stone-700 text-stone-400 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shadow">
            {boonDiscardCount}
          </div>
        </div>
      </div>
    </div>
  );
};
