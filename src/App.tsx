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
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [view, setView] = useState<'home'|'game'|'gameover'|'ranking'>('home');

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

  // Autenticação via Privy + Farcaster
  useEffect(() => {
    if (!ready || authenticated) return;
    (async () => {
      const { nonce } = await initLoginToFrame();
      const res: any = await sdk.actions.signIn({ nonce, acceptAuthAddress: true });
      if (res.message && res.signature) {
        await loginToFrame({ message: res.message, signature: res.signature });
      }
    })();
  }, [ready, authenticated, initLoginToFrame, loginToFrame]);

  // Espera o SDK ficar pronto
  useEffect(() => {
    sdk.actions.ready().then(() => setIsReady(true));
  }, []);

  // Muda para GameOver quando o jogo termina
  useEffect(() => {
    if (gameState.isGameOver && view === 'game') setView('gameover');
  }, [gameState.isGameOver, view]);

  // Função de Pay (botão “pagamento”)
  const handlePayScore = async () => {
    if (!user?.farcaster?.username) {
      alert('Você precisa estar logado no Farcaster.');
      return;
    }
    setIsPaying(true);
    try {
      await sdk.actions.pay({
        recipientAddress: '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a',
        token: 'eip155:8453/erc20:0xD9AA2b31bF8e1183D6B90524a11e8C0F16c4B348',
        amount: '100000' // 0.10 USDC
      });
      setPaySuccess(true);
      await setDoc(doc(db, 'rankings', user.farcaster.username), {
        username: user.farcaster.username,
        score: gameState.score,
        createdAt: serverTimestamp()
      });
      await sdk.actions.composeCast({
        text: `🚩 I scored ${gameState.score} points in FarFlag!`,
        embeds: ['https://farflag.vercel.app']
      });
    } catch (err: any) {
      console.error('Pay error:', err);
      alert('Pagamento falhou: ' + (err.message ?? err));
    } finally {
      setIsPaying(false);
    }
  };

  const handleShareScore = async () => {
    await sdk.actions.composeCast({
      text: `🚩 I scored ${gameState.score} points in FarFlag!`,
      embeds: ['https://farflag.vercel.app']
    });
  };

  // Caso não esteja pronto ou autenticado
  if (!ready || !authenticated || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          onClick={() => {
            initLoginToFrame()
              .then(({ nonce }: any) => sdk.actions.signIn({ nonce, acceptAuthAddress: true }))
              .then((res: any) => {
                if (res.message && res.signature) {
                  return loginToFrame({ message: res.message, signature: res.signature });
                }
              })
              .catch(console.error);
          }}
        >
          Login com Farcaster
        </button>
      </div>
    );
  }

  // Renderização das telas
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
        onMintScore={handlePayScore}
        onShareScore={handleShareScore}
        isMinting={isPaying}
        mintSuccess={paySuccess}
        correctAnswer={lastQuestion?.country}
        onViewRanking={() => setView('ranking')}
      />
    );
  }
  if (view === 'ranking') {
    return <RankingScreen onBack={() => setView('home')} />;
  }

  return null;
};
