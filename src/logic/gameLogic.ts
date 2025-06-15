import { GameSettings } from '../types/';

export const GAME_SETTINGS: GameSettings = {
  initialTime: 10,
  minTime: 2,
  pointsPerCorrect: 10,
  timeReductionRate: 100 // Reduce 1 second every 100 points
};

export const MINT_CONFIG = {
  cost: 0.1, // USDC
  network: 'base',
  recipientAddress: '0x8eD01cfedAF6516A783815d67b3fd5Dedc31E18a'
};

export const calculateTimeLimit = (score: number): number => {
  const reduction = Math.floor(score / GAME_SETTINGS.timeReductionRate);
  const newTime = GAME_SETTINGS.initialTime - reduction;
  return Math.max(newTime, GAME_SETTINGS.minTime);
};

