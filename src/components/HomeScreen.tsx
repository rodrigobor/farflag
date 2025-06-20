import React from 'react';
import { useTranslation } from 'react-i18next';

interface HomeScreenProps {
  lastScore: number;
  onStartGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ lastScore, onStartGame }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🚩 FarFlag</h1>
        <p className="text-lg opacity-90">Flag Quiz Game</p>
      </div>

      {lastScore > 0 && (
        <div className="bg-white/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
          <p className="text-sm opacity-80">{t('Last score:')} {lastScore}</p>
          <p className="text-2xl font-bold">{lastScore}</p>
        </div>
      )}

      <button
  onClick={onStartGame}
  className="min-w-[240px] min-h-[100px] py-5 px-10 bg-blue-600 text-white text-3xl font-bold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
>
  Start Game
</button>



      <div className="mt-8 text-center text-sm opacity-70">
        <p>Identify the country by its flag!</p>
        <p>+10 points per correct answer</p>
      </div>
    </div>
  );
};

