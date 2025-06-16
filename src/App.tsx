// src/App.tsx
import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const [ready, setReady] = useState(false);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(false);

  const {
    gameState,
    lastScore,
    startGame,
    selectAnswer,
    isTimerActive,
    timeLeft
  } = useGame();

  useEffect(() => {
    sdk.actions.ready().then(() => setReady(true));
  }, []);

  const handleMintScore = async () => {
    setMinting(true);
    try {
      const res = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestContext: true })
      });
      const txRequest = await res.json(); // { chainId, to, data }

      const provider = await sdk.wallet.getEthereumProvider();
      if (!provider) throw new Error('Provider não disponível');

      await provider.request({
        method: 'eth_sendTransaction',
        params: [ txRequest ],
      });

      const castText = `🚩 I scored ${gameState.score} points in FarFlag!`;
      await sdk.actions.composeCast({
        text: castText,
        embeds: ['https://farflag.vercel.app/']
      });

      setMinted(true);
    } catch (err: any) {
      console.error('Mint error:', err);
      alert(err.message || 'Mint failed');
    } finally {
      setMinting(false);
    }
  };

  const handleShare = async () => {
    const castText = `🚩 I scored ${gameState.score} points in FarFlag!`;
    await sdk.actions.composeCast({
      text: castText,
      embeds: ['https://farflag.vercel.app/']
    });
  };

  if (!ready) return null;
  if (!gameState.currentFlag && !gameState.isGameOver) {
    return <HomeScreen lastScore={lastScore} onStartGame={startGame} />;
  }
  if (gameState.isGameOver) {
    return (
      <GameOverScreen
        score={gameState.score}
        onPlayAgain={startGame}
        onMintScore={handleMintScore}
        onShareScore={handleShare}
        isMinting={minting}
        mintSuccess={minted}
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
