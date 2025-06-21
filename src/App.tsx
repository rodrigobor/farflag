// src/App.tsx
import React, { useEffect, useState } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import { usePrivy } from '@privy-io/react-auth';
import { useLoginToFrame } from '@privy-io/react-auth/farcaster';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { RankingScreen } from './components/RankingScreen';
import { useGame } from './hooks/useGame';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [view, setView] = useState<'home' | 'game' | 'gameover' | 'ranking'>('home');

  const {
    gameState,
    lastScore,
    lastQuestion,
    startGame,
    selectAnswer,
    isTimerActive,
    timeLeft
  } = useGame();

  const { ready, authenticated, user } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();

  useEffect(() => {
    if (!ready || authenticated) return;
    (async () => {
      try {
        const { nonce } = await initLoginToFrame();
        const res = await sdk.actions.signIn({ nonce, acceptAuthAddress: true });
        if (!res.message || !res.signature) throw new Error('signIn inválido');
        await loginToFrame({ message: res.message, signature: res.signature });
      } catch (err: any) {
        console.error('Erro no signIn/loginToFrame:', err);
      }
    })();
  }, [ready, authenticated, initLoginToFrame, loginToFrame]);

  useEffect(() => {
    sdk.actions.ready().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (gameState.isGameOver && view === 'game') setView('gameover');
  }, [gameState.isGameOver, view]);

  const handleMintScore = async () => {
    if (!user?.farcaster?.username) {
      alert('Você precisa estar logado no Farcaster.');
      return;
    }

    setIsMinting(true);
    try {
      await sdk.actions.sendToken({
        recipientAddress: '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a',
        token: 'eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        amount: '100000'
      });
      setMintSuccess(true);

      const username = user.farcaster.username;
      await setDoc(doc(db, 'rankings', username), {
        username,
        score: gameState.score,
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      console.error('Erro no pagamento:', err);
      alert('Pagamento falhou: ' + (err.message ?? err));
    } finally {
      setIsMinting(false);
    }
  };

  const handleShareScore = async () => {
    await sdk.actions.composeCast({
      text: `🚩 I scored ${gameState.score} points in FarFlag!`,
      embeds: ['https://farflag.vercel.app']
    });
  };

  if (!ready || !authenticated || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <span className="text-lg">Carregando…</span>
      </div>
    );
  }

  if (view === 'home') {
    return <HomeScreen lastScore={lastScore} onStartGame={() => { startGame(); setView('game'); }} />;
  }
  if (view === 'game') {
    return <GameScreen gameState={gameState} onSelectAnswer={selectAnswer} isTimerActive={isTimerActive} timeLeft={timeLeft} />;
  }
  if (view === 'gameover') {
    return (
      <GameOverScreen
        score={gameState.score}
        onPlayAgain={() => { startGame(); setView('game'); }}
        onMintScore={handleMintScore}
        onShareScore={handleShareScore}
        isMinting={isMinting}
        mintSuccess={mintSuccess}
        correctAnswer={lastQuestion?.country}
        onViewRanking={() => setView('ranking')}
      />
    );
  }
  if (view === 'ranking') {
    return <RankingScreen onBack={() => setView('home')} />;
  }

  return null;
}
