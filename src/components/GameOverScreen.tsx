// src/components/GameOverScreen.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
  onMintScore: () => Promise<void>;
  onShareScore: () => void;
  isMinting?: boolean;
  mintSuccess?: boolean;
  correctAnswer?: string;
  onViewRanking: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onPlayAgain,
  onMintScore,
  onShareScore,
  isMinting = false,
  mintSuccess = false,
  correctAnswer,
  onViewRanking
}) => {
  const { t } = useTranslation();
  const [mintError, setMintError] = useState<string | null>(null);

  const handleMintClick = async () => {
    setMintError(null);
    try {
      await onMintScore();
    } catch (err: any) {
      setMintError(err.message || 'Fail payment.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold mb-4">{t('GAME OVER')}</h1>
      <p className="text-2xl font-semibold mb-4">{t('Final Score')}: {score}</p>

      {correctAnswer && (
        <p className="mb-4 text-yellow-600">{t('Correct Answer')}: <strong>{correctAnswer}</strong></p>
      )}

      <button
        onClick={onShareScore}
        className="w-full mb-4 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg"
      >
        {t('Share on Farcaster')}
      </button>

      {!mintSuccess && (
        <button
          onClick={handleMintClick}
          disabled={isMinting}
          className="w-full mb-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-3 rounded-lg"
        >
          {isMinting ? t('minting') : `${t('mint')} (0.10 USDC)`}
        </button>
      )}

      {mintError && <p className="text-red-500 mb-4">{mintError}</p>}

      <button
        onClick={onViewRanking}
        className="w-full mb-4 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg"
      >
        {t('View Ranking')}
      </button>

      <button
        onClick={onPlayAgain}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
      >
        {t('Play Again')}
      </button>
    </div>
  );
};
