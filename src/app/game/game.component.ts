import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Injectable } from '@angular/core';
import { WordService } from '../services/word.service';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { GameOverModalComponent } from '../components/game-over-modal/game-over-modal.component';
import { GameState } from '../models/game-state';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-game',
  imports: [CommonModule, HttpClientModule, GameOverModalComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  standalone: true,
})
export class GameComponent implements OnInit {
  word = '';
  guesses: string[] = Array(6).fill('');
  currentGuess = '';
  currentRow = 0;
  gameOver = false;
  invalidGuess = false;
  loading = false;

  // More explicit initialization
  flipStates: boolean[][] = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => false)
  );

  keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  keyboardLetterStates: { [key: string]: string } = {};

  showNotification = false;
  shakingRow: number | null = null;
  notificationMessage = '';

  showGameOverModal = false;
  isWin = false;

  constructor(private wordService: WordService) {}

  shouldShake(row: number): boolean {
    return this.shakingRow === row;
  }

  ngOnInit() {
    this.initializeGame();
  }

  async initializeGame() {
    this.loading = true;
    try {
      this.word = await this.wordService.getRandomWord();
      console.log('Word to guess:', this.word); // For testing
    } catch (error) {
      console.error('Error getting random word:', error);
      this.showError('Error loading game');
    } finally {
      this.loading = false;
    }
  }

  onKeyup(event: KeyboardEvent) {
    // console.log(this.currentGuess);
    if (this.gameOver) {
      return;
    }

    if (event.key === 'Enter') {
      this.submitGuess();
    } else if (event.key === 'Backspace') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (this.currentGuess.length < 5 && event.key.match(/[a-zA-Z]/)) {
      this.currentGuess += event.key.toUpperCase();
    }
  }

  private showError(message: string) {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 1500);

    this.shakingRow = this.currentRow;
    setTimeout(() => {
      this.shakingRow = null;
    }, 500);
  }

  async submitGuess() {
    if (this.currentGuess.length !== 5) {
      this.showError('Not enough letters');
      return;
    }

    this.wordService.checkWord(this.currentGuess).subscribe((isValid) => {
      if (!isValid) {
        this.showError('Not in word list');
        return;
      }
      this.processValidGuess();
    });
  }

  private showInvalidGuess() {
    this.invalidGuess = true;
    setTimeout(() => {
      this.invalidGuess = false;
    }, 500);
  }

  private processValidGuess() {
    this.guesses[this.currentRow] = this.currentGuess;
    this.updateKeyboardStates();

    // Trigger sequential flip with delay
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.flipStates[this.currentRow][i] = true;
      }, i * 300);
    }

    // Check game state after animations
    setTimeout(() => {
      if (this.currentGuess === this.word) {
        this.gameOver = true;
        // alert('You won!');
        this.isWin = true;
        this.showGameOverModal = true;
      } else if (this.currentRow === 5) {
        this.gameOver = true;
        this.showGameOverModal = true;
        this.isWin = false;
        // alert('Game Over! The word was ' + this.word);
      } else {
        this.currentRow++;
        this.currentGuess = '';
      }
    }, 1500);
  }

  getBackgroundColor(row: number, col: number): string {
    if (this.guesses[row].length !== 5) return 'white';

    const guess = this.guesses[row];
    const letter = guess[col];

    // First check for green to match exact Wordle behavior
    if (letter === this.word[col]) {
      return '#6ca965';
    }

    // Count remaining occurrences in target word AFTER removing green matches
    const targetLetters = [...this.word];
    const currentGuess = [...guess];

    // Remove all green matches first
    for (let i = 0; i < 5; i++) {
      if (currentGuess[i] === targetLetters[i]) {
        targetLetters[i] = '*'; // Mark as used
        currentGuess[i] = '#'; // Mark as matched
      }
    }

    // Count remaining occurrences of this letter in target
    const remainingInTarget = targetLetters.filter((l) => l === letter).length;

    // Count yellow matches up to this position
    const yellowsSoFar = currentGuess
      .slice(0, col)
      .filter((l) => l === letter).length;

    // If we still have remaining occurrences, show yellow
    if (remainingInTarget > yellowsSoFar && targetLetters.includes(letter)) {
      return '	#c8b653';
    }

    return '	#787c7f';
  }

  shouldFlip(row: number, col: number): boolean {
    return this.flipStates[row][col];
  }

  onKeyPress(key: string) {
    if (key === '⌫') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
      this.submitGuess();
    } else if (this.currentGuess.length < 5) {
      this.currentGuess += key;
    }
  }

  updateKeyboardStates() {
    const currentGuess = this.guesses[this.currentRow];
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      const color = this.getBackgroundColor(this.currentRow, i);

      // Used but not in word - make it darker gray
      if (color === '	#787c7f') {
        this.keyboardLetterStates[letter] = '#787c7e'; // darker gray
      }
      // Only update other colors if it's more important (green > yellow > gray)
      else if (
        !this.keyboardLetterStates[letter] ||
        (this.keyboardLetterStates[letter] === '#787c7e' &&
          (color === '	#c8b653' || color === '#6ca965')) ||
        (this.keyboardLetterStates[letter] === '	#c8b653' && color === '#6ca965')
      ) {
        this.keyboardLetterStates[letter] = color;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Return early if game is over or if it's a special key event
    if (
      this.gameOver ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.key.startsWith('F') || // Blocks F1-F12
      event.key === 'Tab' ||
      event.key === 'CapsLock' ||
      event.key === 'Shift' ||
      event.key === 'Control' ||
      event.key === 'Alt' ||
      event.key === 'Meta' ||
      event.key === 'Delete' ||
      event.key === 'Home' ||
      event.key === 'End' ||
      event.key === 'PageUp' ||
      event.key === 'PageDown' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      return;
    }

    if (event.key === 'Enter') {
      this.submitGuess();
    } else if (event.key === 'Backspace') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (this.currentGuess.length < 5 && /^[a-zA-Z]$/.test(event.key)) {
      this.currentGuess += event.key.toUpperCase();
    }
  }

  onPlayAgain() {
    this.restartGame();
  }

  async restartGame() {
    // Reset all game states
    this.currentGuess = '';
    this.currentRow = 0;
    this.gameOver = false;
    this.showGameOverModal = false;
    this.isWin = false;
    this.guesses = Array(6).fill('');

    // Reset flip states for tiles
    this.flipStates = Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => false)
    );

    // Reset keyboard colors
    this.keyboardLetterStates = {};

    // Get new word
    try {
      this.word = await this.wordService.getRandomWord();
      console.log('New word to guess:', this.word); // For testing
    } catch (error) {
      console.error('Error getting new word:', error);
      this.showError('Error starting new game');
    }
  }
}
