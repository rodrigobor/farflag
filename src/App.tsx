import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
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
    lastQuestion, // ✅ Importado do hook
    startGame,
    selectAnswer,
    endGame,
    isTimerActive,
    timeLeft
  } = useGame();

  useEffect(() => {
    sdk.actions.ready().then(() => setIsReady(true));
  }, []);

  const handleMintScore = async () => {
    setIsMinting(true);
    try {
      // Executa envio via Frame: envia 0.10 USDC na rede Base
      await sdk.actions.sendToken({
        token: 'eip155:8453/erc20:0xD9AA2b31bF8e1183D6B90524a11e8C0F16c4B348',
        amount: '100000', // 0.10 USDC = 0.10 * 1e6
        recipientAddress: '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a'
      });

      setMintSuccess(true);

      // Após, publica o cast com pontuação
      const castText = `🚩 I scored ${gameState.score} points in FarFlag!`;
      await sdk.actions.composeCast({
        text: castText,
        embeds: ['https://farflag.vercel.app']
      });

    } catch (err: any) {
      console.error('Mint error:', err);
      alert('Mint failed: ' + (err.message ?? err));
    } finally {
      setIsMinting(false);
    }
  };

  const handleShareScore = async () => {
    const castText = `🚩 I scored ${gameState.score} points in FarFlag!`;
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
        correctAnswer={lastQuestion?.country} // ✅ Passando a resposta correta
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
