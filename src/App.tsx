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
    timeLeft,
  } = useGame();

  const { ready, authenticated, user } = usePrivy();
  const { initLoginToFrame, loginToFrame } = useLoginToFrame();

  // Autenticação via Privy + Farcaster
  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      (async () => {
        try {
          const { nonce } = await initLoginToFrame();
          const res = await sdk.actions.signIn({ nonce, acceptAuthAddress: true });

          console.log('signIn result:', res);
          if (!res?.message || !res?.signature) {
            throw new Error('signIn retornou mensagem ou assinatura inválida');
          }

          await loginToFrame({ message: res.message, signature: res.signature });
        } catch (err) {
          console.error('Erro no signIn/loginToFrame:', err);
        }
      })();
    }
  }, [ready, authenticated, initLoginToFrame, loginToFrame]);

  // Inicialização do frame-sdk
  useEffect(() => {
    sdk.actions.ready().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
  if (gameState.isGameOver && view === 'game') {
    setView('gameover');
  }
}, [gameState.isGameOver, view]);

  const handleMintScore = async () => {
    if (!user?.farcaster?.username) {
      alert('Você precisa estar logado no Farcaster.');
      return;
    }

    setIsMinting(true);
    try {
      await sdk.actions.sendToken({
        token: 'eip155:8453/erc20:0xD9AA2b31bF8e1183D6B90524a11e8C0F16c4B348',
        amount: '100000',
        recipientAddress: '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a',
      });
      setMintSuccess(true);

      const username = user.farcaster.username;

      await setDoc(doc(db, 'rankings', username), {
        username,
        score: gameState.score,
        createdAt: serverTimestamp(),
      });

      await sdk.actions.composeCast({
        text: `🚩 I scored ${gameState.score} points in FarFlag!`,
        embeds: ['https://farflag.vercel.app'],
      });
    } catch (err: any) {
      console.error('Mint error:', err);
      alert('Mint failed: ' + (err.message ?? err));
    } finally {
      setIsMinting(false);
    }
  };

  const handleShareScore = async () => {
    await sdk.actions.composeCast({
      text: `🚩 I scored ${gameState.score} points in FarFlag!`,
      embeds: ['https://farflag.vercel.app'],
    });
  };

  // Se não estiver autenticado ou sdk não pronto
  if (!ready || !authenticated || !isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          onClick={() => {
            // inicia login manual
            initLoginToFrame()
              .then(({ nonce }) => sdk.actions.signIn({ nonce, acceptAuthAddress: true }))
              .then(res => {
                if (res?.message && res?.signature) {
                  return loginToFrame({ message: res.message, signature: res.signature });
                } else {
                  throw new Error('signIn inválido');
                }
              })
              .catch(err => console.error('Login manual falhou:', err));
          }}
        >
          Login with Farcaster
        </button>
      </div>
    );
  }

  // Render conforme a view
  if (view === 'home') {
    return (
      <HomeScreen
        lastScore={lastScore}
        onStartGame={() => {
          startGame();
          setView('game');
        }}
      />
    );
  }

  if (view === 'game') {
    return (
      <GameScreen
        gameState={gameState}
        onSelectAnswer={selectAnswer}
        isTimerActive={isTimerActive}
        timeLeft={timeLeft}
      />
    );
  }

  if (view === 'gameover') {
    return (
      <GameOverScreen
        score={gameState.score}
        onPlayAgain={() => {
          startGame();
          setView('game');
        }}
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
