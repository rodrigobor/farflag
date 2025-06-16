import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { ethers } from 'ethers';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGame } from './hooks/useGame';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
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
      await sdk.actions.ready();
      setIsReady(true);
    })();
  }, []);

  const handleMintScore = async () => {
    setIsMinting(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const usdcAddress = '0xD9AA2b31bF8e1183D6B90524a11e8C0F16c4B348';
      const recipient = '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a';
      const erc20Abi = ['function transfer(address to, uint256 amount) returns (bool)'];
      const usdc = new ethers.Contract(usdcAddress, erc20Abi, signer);
      const tx = await usdc.transfer(recipient, ethers.parseUnits('0.10', 6));
      await tx.wait();
      setMintSuccess(true);
    } catch (err) {
      console.error('Mint error:', err);
    } finally {
      setIsMinting(false);
    }
  };

  const handleShareScore = async () => {
    const castText = `🚩 I scored ${gameState.score} points in FarFlag! Try it now 👇`;
    await sdk.actions.composeCast({
      text: castText,
      embeds: ['https://farflag.vercel.app']
    });
  };

  if (!isReady) return null;

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
        isMinting={isMinting}
        mintSuccess={mintSuccess}
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