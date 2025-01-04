export interface GameState {
  word: string;
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  gameOver: boolean;
  isWin: boolean;
  flipStates: boolean[][];
  keyboardLetterStates: { [key: string]: string };
}
