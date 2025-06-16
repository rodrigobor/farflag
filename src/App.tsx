import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk'; // 1
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const {
    gameState,
    lastScore,
    startGame,
    selectAnswer,
    endGame,
    isTimerActive,
    timeLeft
  } = useGame();

  useEffect(() => {
    (async () => {
      await sdk.actions.ready(); // 2
      setIsReady(true);
    })();
  }, []);

  if (!isReady) return null;

  // Placeholder de funções
  const handleMintScore = async () => console.log('Minting not implemented');
  const handleShareScore = () => console.log('Sharing not implemented');

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
