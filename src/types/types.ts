export interface GameState {
  score: number;
  currentQuestion: number;
  currentFlag: {
    imageUrl: string;
    alternatives: string[];
  } | null;
  timeLeft: number;
}
