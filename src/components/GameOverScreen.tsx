import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
  onMintScore: () => Promise<void>;
  onShareScore: () => void;
  isMinting?: boolean;
  mintSuccess?: boolean;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onPlayAgain,
  onMintScore,
  onShareScore,
  isMinting = false,
  mintSuccess = false
}) => {
  const { t } = useTranslation();
  const [mintError, setMintError] = useState<string | null>(null);

  const handleMint = async () => {
    setMintError(null);
    try {
      await onMintScore();
    } catch (error: any) {
      setMintError(error.message || 'Mint failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6">
      {/* Título e pontuação final */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('gameOver')}</h1>
        <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-2">{t('finalScore')}</p>
          <p className="text-4xl font-bold">{score}</p>
        </div>
      </div>

      {/* Botão de mint */}
      {!mintSuccess && (
        <div className="bg-white/10 rounded-lg p-6 mb-6 backdrop-blur-sm text-center w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-2">{t('mintScore')}</h3>
          <p className="text-sm opacity-80 mb-4">{t('mintDescription')}</p>
          
          {mintError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-sm">
              {mintError}
            </div>
          )}
          
          <button
            onClick={handleMint}
            disabled={isMinting}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
          >
            {isMinting ? t('minting') : `${t('mint')} (0.10 USDC)`}
          </button>
          
          <p className="text-xs opacity-60 mt-2">Requires USDC on BASE network</p>
        </div>
      )}

      {/* Botão de compartilhar no Farcaster */}
      {mintSuccess && (
        <div className="bg-white/10 rounded-lg p-6 mb-6 backdrop-blur-sm text-center w-full max-w-sm">
          <div className="text-green-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-semibold">{t('mintSuccessful')}</p>
          </div>
          <button
            onClick={onShareScore}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full"
          >
            {t('shareOnFarcaster')}
          </button>
        </div>
      )}

      {/* Botão de jogar novamente */}
      <div className="space-y-3 w-full max-w-sm">
        <button
          onClick={onPlayAgain}
          className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          {t('playAgain')}
        </button>
      </div>

      {/* Estatísticas finais */}
      <div className="mt-8 text-center text-sm opacity-70">
        <p>{t('questionsAnswered')}: {Math.floor(score / 10)}</p>
        <p>{t('accuracy')}: 100%</p>
      </div>
    </div>
  );
};
