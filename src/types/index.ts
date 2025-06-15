export interface Flag {
  id: string;
  country: string;
  imageUrl: string;
  alternatives: string[];
}

export interface GameState {
  score: number;
  currentQuestion: number;
  timeLeft: number;
  isGameOver: boolean;
  currentFlag: Flag | null;
}

export interface GameSettings {
  initialTime: number;
  minTime: number;
  pointsPerCorrect: number;
  timeReductionRate: number;
}

export interface MintData {
  score: number;
  timestamp: number;
  transactionHash?: string;
}

export interface User {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}




