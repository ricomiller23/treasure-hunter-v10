import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.ts';
import { GameHUD } from '../components/GameHUD.tsx';
import { PilesRow } from '../components/PilesRow.tsx';
import { StackColumn } from '../components/StackColumn.tsx';
import { BoonTray } from '../components/BoonTray.tsx';
import { getLegalDiscards, getLegalEmptyStackMoves } from '../engine/rules.ts';

export const GameScreen: React.FC = () => {
  const {
    gameState,
    hintsEnabled,
    colorblindMode,
    activeBoon,
    targetingStack1,
    dealCards,
    discardCard,
    moveCardToEmptyStack,
    selectBoon,
    targetStackForBoon,
    returnFromBaseCamp,
    undo,
    toggleHints,
    openModal,
    endGameManually,
    setScreen,
  } = useGameStore();

  const [selectedStackForMove, setSelectedStackForMove] = useState<number | null>(null);

  const legalDiscards = hintsEnabled ? getLegalDiscards(gameState) : [];
  const emptyMoves = getLegalEmptyStackMoves(gameState);
  const canDeal = gameState.adventureDeck.length > 0;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'd' || e.key === 'D') {
        if (canDeal) dealCards();
      } else if (e.key === 'u' || e.key === 'U') {
        undo();
      } else if (e.key === 'h' || e.key === 'H') {
        toggleHints();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const stackIdx = parseInt(e.key, 10) - 1;
        handleStackClick(stackIdx);
      } else if (e.key === 'Escape') {
        selectBoon(null);
        setSelectedStackForMove(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, canDeal, activeBoon, selectedStackForMove]);

  const handleStackClick = (stackIdx: number) => {
    // 1. If currently targeting a Boon
    if (activeBoon) {
      targetStackForBoon(stackIdx);
      return;
    }

    // 2. If an empty stack move is staged
    if (selectedStackForMove !== null) {
      if (gameState.stacks[stackIdx].length === 0) {
        moveCardToEmptyStack(selectedStackForMove, stackIdx);
        setSelectedStackForMove(null);
        return;
      } else {
        // Change selection or deselect
        if (selectedStackForMove === stackIdx) {
          setSelectedStackForMove(null);
          return;
        }
        setSelectedStackForMove(stackIdx);
        return;
      }
    }

    // 3. Normal play on this stack
    const stack = gameState.stacks[stackIdx];
    if (stack.length === 0) {
      // Empty stack clicked
      // If base camp has a card, can return it here
      if (gameState.baseCampCard) {
        returnFromBaseCamp(stackIdx);
        return;
      }
      return;
    }

    // Check if legal discard
    const isLegal = getLegalDiscards(gameState).some((l) => l.stackIndex === stackIdx);
    if (isLegal) {
      discardCard(stackIdx);
      return;
    }

    // If there is an empty stack available, select this stack to move into it
    const hasEmptyStack = gameState.stacks.some((s) => s.length === 0);
    if (hasEmptyStack) {
      setSelectedStackForMove(stackIdx);
    }
  };

  const handleEmptyStackClick = (stackIdx: number) => {
    if (activeBoon) {
      targetStackForBoon(stackIdx);
      return;
    }

    if (selectedStackForMove !== null) {
      moveCardToEmptyStack(selectedStackForMove, stackIdx);
      setSelectedStackForMove(null);
      return;
    }

    if (gameState.baseCampCard) {
      returnFromBaseCamp(stackIdx);
      return;
    }

    // If only one non-empty stack exists, move from it directly
    const nonEmpty = gameState.stacks
      .map((s, idx) => ({ s, idx }))
      .filter((x) => x.s.length > 0);
    if (nonEmpty.length === 1) {
      moveCardToEmptyStack(nonEmpty[0].idx, stackIdx);
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-[#08120b] text-[#eadeca] flex flex-col justify-between overflow-x-hidden transition-all ${
        gameState.perilActive ? 'ring-8 ring-red-600/80' : ''
      }`}
    >
      {/* Top HUD */}
      <GameHUD
        state={gameState}
        hintsEnabled={hintsEnabled}
        canDeal={canDeal}
        onDeal={dealCards}
        onUndo={undo}
        onToggleHints={toggleHints}
        onOpenRules={() => openModal('rules')}
        onOpenSettings={() => openModal('settings')}
        onEndGame={endGameManually}
        onExit={() => setScreen('title')}
      />

      {/* Peril Alert Banner */}
      {gameState.perilActive && (
        <div className="bg-red-950 border-y-2 border-red-500 py-2 px-4 text-center text-xs font-bold text-red-200 flex items-center justify-center gap-2 animate-bounce">
          <span className="text-xl">🚨</span>
          <span>
            PERIL! Four Skull Caves dealt in a single round. All Boons in play lost!
          </span>
        </div>
      )}

      {/* Move Staged Banner */}
      {selectedStackForMove !== null && (
        <div className="bg-amber-950/80 border-b border-amber-400 py-1.5 px-4 text-center text-xs font-bold text-amber-300 flex items-center justify-center gap-2 animate-pulse">
          <span>Card from Stack {selectedStackForMove + 1} selected. Click any empty stack space to move it!</span>
          <button
            onClick={() => setSelectedStackForMove(null)}
            className="ml-2 text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-amber-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Center Table Area */}
      <main className="flex-1 flex flex-col justify-between py-2 max-w-6xl w-full mx-auto px-2">
        {/* Top Piles Row */}
        <section className="w-full my-1">
          <PilesRow
            adventureDeckCount={gameState.adventureDeck.length}
            adventureDiscard={gameState.adventureDiscard}
            boonDeckCount={gameState.boonDeck.length}
            boonDiscardCount={gameState.boonDiscard.length}
            mapPeekCards={gameState.mapPeekCards}
            canDeal={canDeal}
            onDealClick={dealCards}
          />
        </section>

        {/* 4 Stacks Center Columns */}
        <section className="flex-1 flex items-start justify-center gap-2 sm:gap-6 my-4 px-1 overflow-x-auto min-h-[300px]">
          {gameState.stacks.map((stack, idx) => {
            const isLegal = legalDiscards.some((l) => l.stackIndex === idx);
            const isTargeted =
              (activeBoon !== null && (targetingStack1 === idx || activeBoon.targeting === 'card')) ||
              selectedStackForMove === idx;
            const canReceive =
              stack.length === 0 &&
              (selectedStackForMove !== null ||
                gameState.baseCampCard !== null ||
                emptyMoves.some((m) => m.toStackIndex === idx));

            return (
              <StackColumn
                key={idx}
                stackIndex={idx}
                stack={stack}
                isLegalDiscard={isLegal}
                isTargetedForBoon={isTargeted}
                canReceiveCard={canReceive}
                colorblindMode={colorblindMode}
                onTopCardClick={() => handleStackClick(idx)}
                onEmptyStackClick={() => handleEmptyStackClick(idx)}
              />
            );
          })}
        </section>
      </main>

      {/* Bottom Boon Tray */}
      <footer className="w-full z-10">
        <BoonTray
          boonsInPlay={gameState.boonsInPlay}
          baseCampCard={gameState.baseCampCard}
          activeBoon={activeBoon}
          targetingStack1={targetingStack1}
          onSelectBoon={selectBoon}
          onBaseCampClick={() => {
            if (activeBoon && activeBoon.id === 'base_camp') {
              selectBoon(null);
            }
          }}
        />
      </footer>
    </div>
  );
};
