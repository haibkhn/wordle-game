import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameTileComponent } from '../game-tile/game-tile.component';

@Component({
  selector: 'app-game-board',
  imports: [CommonModule, GameTileComponent],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css',
  standalone: true,
})
export class GameBoardComponent {
  @Input() guesses: string[] = [];
  @Input() currentGuess: string = '';
  @Input() currentRow: number = 0;
  @Input() flipStates: boolean[][] = [];
  @Input() shakingRow: number | null = null;
  @Input() word: string = '';
  @Input() doNotPop: boolean = false;

  getBackgroundColor(row: number, col: number): string {
    if (this.guesses[row].length !== 5) return 'transparent'; // Changed from white to transparent

    const guess = this.guesses[row];
    const letter = guess[col];

    if (letter === this.word[col]) {
      return '#6ca965';
    }

    const targetLetters = [...this.word];
    const currentGuess = [...guess];

    for (let i = 0; i < 5; i++) {
      if (currentGuess[i] === targetLetters[i]) {
        targetLetters[i] = '*';
        currentGuess[i] = '#';
      }
    }

    const remainingInTarget = targetLetters.filter((l) => l === letter).length;
    const yellowsSoFar = currentGuess
      .slice(0, col)
      .filter((l) => l === letter).length;

    if (remainingInTarget > yellowsSoFar && targetLetters.includes(letter)) {
      return '#c8b653';
    }

    return '#3a3a3c'; // Changed to #3a3a3c for unused letters
  }

  shouldPop(row: number, col: number): boolean {
    if (row !== this.currentRow) return false;
    if (col !== this.currentGuess.length - 1) return false; // Current letter being typed
    if (this.currentGuess[col] === undefined) return false;
    if (this.flipStates[row][col]) return false;
    if (this.shakingRow === row) return false;
    if (this.doNotPop) return false; // Prevent pop during animations

    return true;
  }
}
