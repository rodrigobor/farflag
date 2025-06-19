import { useEffect, useState, useRef } from 'react';
import { getRandomQuestion } from '../logic/flags';
import { Flag } from '../types/index';

interface GameState {
  currentFlag: Flag | null;
  score: number;
  isGameOver: boolean;
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentFlag: null,
    score: 0,
    isGameOver: false
  });

  const [lastScore, setLastScore] = useState(0);
  const [lastQuestion, setLastQuestion] = useState<Flag | null>(null); // ✅ NOVO
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [questionTime, setQuestionTime] = useState(10);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Atualiza o tempo de pergunta com base na pontuação
  useEffect(() => {
    const dynamicTime = Math.max(2, 10 - Math.floor(gameState.score / 100));
    setQuestionTime(dynamicTime);
  }, [gameState.score]);

  // Controle do timer
  useEffect(() => {
    if (!isTimerActive || gameState.isGameOver) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setLastQuestion(gameState.currentFlag); // ✅ Salva a pergunta antes de terminar
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, gameState.currentFlag?.id]);

  const startGame = () => {
    const firstFlag = getRandomQuestion();
    setGameState({ currentFlag: firstFlag, score: 0, isGameOver: false });
    const initialTime = 10;
    setTimeLeft(initialTime);
    setQuestionTime(initialTime);
    setIsTimerActive(true);
    setLastQuestion(null); // ✅ limpa pergunta anterior ao iniciar novo jogo
  };

  const selectAnswer = (answer: string) => {
    if (!gameState.currentFlag) return;

    if (answer === gameState.currentFlag.country) {
      const newScore = gameState.score + 10;
      setLastQuestion(gameState.currentFlag); // ✅ salva pergunta atual
      const nextFlag = getRandomQuestion(gameState.currentFlag.id);
      const newTime = Math.max(2, 10 - Math.floor(newScore / 100));

      setGameState(prev => ({
        ...prev,
        score: newScore,
        currentFlag: nextFlag
      }));

      setTimeLeft(newTime);
      setQuestionTime(newTime);
    } else {
      setLastQuestion(gameState.currentFlag); // ✅ salva pergunta antes de encerrar
      endGame();
    }
  };

  const endGame = () => {
    setGameState(prev => ({ ...prev, isGameOver: true }));
    setIsTimerActive(false);
    setLastScore(gameState.score);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return {
    gameState,
    lastScore,
    lastQuestion, // ✅ exporta
    startGame,
    selectAnswer,
    endGame,
    isTimerActive,
    timeLeft,
    questionTime
  };
};
