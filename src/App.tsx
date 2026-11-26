import React from 'react';
import { useGameStore } from './store/gameStore.ts';
import { TitleScreen } from './screens/TitleScreen.tsx';
import { GameScreen } from './screens/GameScreen.tsx';
import { EndScreen } from './screens/EndScreen.tsx';
import { RulesModal } from './components/RulesModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { StatsModal } from './components/StatsModal.tsx';

export const App: React.FC = () => {
  const {
    screen,
    gameState,
    activeModal,
    closeModal,
    difficulty,
    hintsEnabled,
    soundEnabled,
    volume,
    autoDiscard,
    colorblindMode,
    reducedMotion,
    animationSpeed,
    stats,
    setDifficulty,
    toggleHints,
    toggleSound,
    setVolume,
    toggleAutoDiscard,
    toggleColorblindMode,
    toggleReducedMotion,
    setAnimationSpeed,
  } = useGameStore();

  let mainContent: React.ReactNode;
  if (screen === 'title') {
    mainContent = <TitleScreen />;
  } else if (gameState.isGameOver || screen === 'game_over') {
    mainContent = <EndScreen />;
  } else {
    mainContent = <GameScreen />;
  }

  return (
    <>
      {mainContent}

      {/* Global Modals */}
      {activeModal === 'rules' && <RulesModal onClose={closeModal} />}

      {activeModal === 'settings' && (
        <SettingsModal
          difficulty={difficulty}
          hintsEnabled={hintsEnabled}
          soundEnabled={soundEnabled}
          volume={volume}
          autoDiscard={autoDiscard}
          colorblindMode={colorblindMode}
          reducedMotion={reducedMotion}
          animationSpeed={animationSpeed}
          cursedIdolUnlocked={stats.cursedIdolUnlocked}
          onSetDifficulty={setDifficulty}
          onToggleHints={toggleHints}
          onToggleSound={toggleSound}
          onSetVolume={setVolume}
          onToggleAutoDiscard={toggleAutoDiscard}
          onToggleColorblindMode={toggleColorblindMode}
          onToggleReducedMotion={toggleReducedMotion}
          onSetAnimationSpeed={setAnimationSpeed}
          onClose={closeModal}
        />
      )}

      {activeModal === 'stats' && (
        <StatsModal stats={stats} onClose={closeModal} />
      )}
    </>
  );
};

export default App;
