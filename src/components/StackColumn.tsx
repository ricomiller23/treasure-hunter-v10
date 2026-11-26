import React from 'react';
import { Card } from '../engine/types.ts';
import { CardView } from './CardView.tsx';

export interface StackColumnProps {
  stackIndex: number;
  stack: Card[];
  isLegalDiscard: boolean;
  isTargetedForBoon: boolean;
  canReceiveCard: boolean; // true if empty and other stacks have cards
  colorblindMode: boolean;
  onTopCardClick: () => void;
  onEmptyStackClick: () => void;
}

export const StackColumn: React.FC<StackColumnProps> = ({
  stackIndex,
  stack,
  isLegalDiscard,
  isTargetedForBoon,
  canReceiveCard,
  colorblindMode,
  onTopCardClick,
  onEmptyStackClick,
}) => {
  if (stack.length === 0) {
    return (
      <div className="flex flex-col items-center min-w-[100px] sm:min-w-[120px]">
        {/* Column Header */}
        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/50 mb-1">
          Stack {stackIndex + 1}
        </span>

        {/* Empty Drop Slot */}
        <div
          onClick={canReceiveCard ? onEmptyStackClick : undefined}
          className={`w-24 h-36 sm:w-28 sm:h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all select-none ${
            canReceiveCard
              ? 'border-amber-400/80 bg-amber-950/20 hover:bg-amber-900/30 cursor-pointer shadow-lg animate-pulse ring-2 ring-amber-400/40'
              : 'border-stone-700/60 bg-stone-900/40 cursor-default'
          }`}
        >
          <span className="text-xl opacity-60">📥</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/80 mt-1">
            Empty Space
          </span>
          {canReceiveCard && (
            <span className="text-[9px] text-emerald-400 font-bold mt-0.5">
              Click to Move Top Card Here
            </span>
          )}
        </div>
      </div>
    );
  }

  // Non-empty stack fanned downwards
  return (
    <div className="flex flex-col items-center min-w-[100px] sm:min-w-[120px] relative">
      {/* Column Header */}
      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-200/50 mb-1">
        Stack {stackIndex + 1} ({stack.length})
      </span>

      {/* Vertical fanned cards container */}
      <div className="relative w-24 sm:w-28 min-h-[160px]">
        {stack.map((card, idx) => {
          const isTop = idx === stack.length - 1;
          const topOffset = idx * 28; // downward fan offset

          return (
            <div
              key={card.id}
              style={{
                position: idx === 0 ? 'relative' : 'absolute',
                top: `${topOffset}px`,
                zIndex: idx + 1,
              }}
            >
              <CardView
                card={card}
                isExposed={isTop}
                isLegalDiscard={isTop && isLegalDiscard}
                isTargeted={isTop && isTargetedForBoon}
                colorblindMode={colorblindMode}
                onClick={isTop ? onTopCardClick : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
