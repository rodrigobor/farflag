import React from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const {
    gameState,
    lastScore,
    startGame,
    selectAnswer,
    endGame,
    isTimerActive,
    timeLeft
  } = useGame();

  // Placeholder functions até implementar a lógica real
  const handleMintScore = async () => {
    console.log('Minting not implemented yet');
    return;
  };

  const handleShareScore = () => {
    console.log('Sharing not implemented yet');
  };

  if (!gameState.currentFlag && !gameState.isGameOver) {
    return <HomeScreen lastScore={lastScore} onStartGame={startGame} />;
  }

  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        score={gameState.score}
        onPlayAgain={startGame}
        onMintScore={handleMintScore}
        onShareScore={handleShareScore}
      />
    );
  }

  return (
    <GameScreen
  gameState={gameState}
  onSelectAnswer={selectAnswer}
  isTimerActive={isTimerActive}
  timeLeft={timeLeft}
/>

  );
}
