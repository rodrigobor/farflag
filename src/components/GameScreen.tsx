import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameState, Flag } from '../types';

interface GameScreenProps {
  gameState: {
    currentFlag: Flag | null;
    score: number;
    isGameOver: boolean;
  };
  onSelectAnswer: (answer: string) => void;
  isTimerActive: boolean;
  timeLeft: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  gameState,
  onSelectAnswer,
  isTimerActive,
  timeLeft
}) => {
  const { t } = useTranslation();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Som de acerto/erro
  const correctSound = new Audio('/sounds/correct.mp3');
  const wrongSound = new Audio('/sounds/wrong.mp3');

  useEffect(() => {
    setSelectedAnswer(null); // limpa o estado ao trocar de pergunta
  }, [gameState.currentFlag?.id]);

  if (!gameState.currentFlag) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const currentFlag = gameState.currentFlag!; // Safe cast (garante que não é null)
  const progressPercentage = (timeLeft / 10) * 100;

  const handleAnswerClick = (option: string) => {
    if (!isTimerActive || selectedAnswer) return;

    setSelectedAnswer(option);

    if (option === currentFlag.country) {
      correctSound.play();
    } else {
      wrongSound.play();
    }

    setTimeout(() => {
      onSelectAnswer(option);
    }, 1000);
  };

  return (
    <div
        key={currentFlag.id}
        className="flex flex-col min-h-screen bg-white text-black animate-fade-in"
      >

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-white/20">
        <div className="text-lg font-semibold">
          {t('score')}: {gameState.score}
        </div>
        <div className="text-lg font-semibold">Question</div>
      </div>

      {/* Timer */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">{t('timeLeft')}</span>
          <span className="text-lg font-bold">{timeLeft}s</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft <= 3 ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Flag */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <img
            src={currentFlag.imageUrl}
            alt={`Flag of ${currentFlag.country}`}
            className="w-64 h-40 object-cover rounded border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.src =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDI1NiAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggODBMMTQ0IDk2TDEyOCAxMTJMMTEyIDk2TDEyOCA4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc=';
            }}
          />
        </div>

        {/* Answer Options */}
<div className="w-full max-w-md space-y-4">
  {currentFlag.alternatives.map((option, index) => {
    let bgClass = 'bg-white/20 hover:bg-white/30 text-white';
    if (selectedAnswer) {
      if (option === currentFlag.country) {
        bgClass = 'bg-green-600 text-white shadow-lg border border-green-800';
      } else if (option === selectedAnswer) {
        bgClass = 'bg-red-600 text-white shadow-lg border border-red-800';
      } else {
        bgClass = 'bg-white/10 text-white/50 border border-white/10';
      }
    }

    return (
      <button
        key={index}
        onClick={() => handleAnswerClick(option)}
        className={`w-full py-4 px-6 min-h-[56px] text-lg font-medium rounded-xl border text-white transition-colors text-center ${bgClass}`}
        disabled={!isTimerActive || !!selectedAnswer}
      >
        {option}
      </button>

    );
  })}
</div>


      </div>
    </div>
  );
};
