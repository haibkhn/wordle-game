import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordService } from '../services/word.service';
import { HttpClientModule } from '@angular/common/http';
import { GameOverModalComponent } from '../components/game-over-modal/game-over-modal.component';
import { GameBoardComponent } from '../components/game-board/game-board.component';
import { VirtualKeyboardComponent } from '../components/virtual-keyboard/virtual-keyboard.component';
import { NotificationComponent } from '../components/notification/notification.component';
import { WordEncryptionService } from '../services/word-encryption.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameHeaderComponent } from '../components/game-header/game-header.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    GameOverModalComponent,
    GameBoardComponent,
    VirtualKeyboardComponent,
    NotificationComponent,
    RouterLink,
    GameHeaderComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements OnInit {
  // Game state
  word = '';
  guesses: string[] = Array(6).fill('');
  currentGuess = '';
  currentRow = 0;
  gameOver = false;
  loading = false;

  // UI state
  showNotification = false;
  shakingRow: number | null = null;
  notificationMessage = '';
  showGameOverModal = false;
  isWin = false;

  // Game configuration
  flipStates: boolean[][] = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => false)
  );

  keyboard: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  keyboardLetterStates: { [key: string]: string } = {};

  constructor(
    private wordService: WordService,
    private wordEncryption: WordEncryptionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        // Custom word mode
        const decryptedWord = this.wordEncryption.decryptWord(params['id']);
        if (decryptedWord) {
          this.word = decryptedWord;
          this.loading = false;
        } else {
          this.showError('Invalid game link');
        }
      } else {
        // Random word mode
        this.initializeGame();
      }
    });
  }

  async initializeGame() {
    this.loading = true;
    try {
      this.word = await this.wordService.getRandomWord();
      console.log('Word to guess:', this.word);
    } catch (error) {
      console.error('Error getting random word:', error);
      this.showError('Error loading game');
    } finally {
      this.loading = false;
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

  onKeyPress(key: string) {
    if (this.gameOver) return;

    if (key === '⌫') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
      this.submitGuess();
    } else if (this.currentGuess.length < 5) {
      this.currentGuess += key;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.gameOver || this.isSpecialKey(event)) return;

    if (event.key === 'Enter') {
      this.submitGuess();
    } else if (event.key === 'Backspace') {
      this.currentGuess = this.currentGuess.slice(0, -1);
    } else if (this.currentGuess.length < 5 && /^[a-zA-Z]$/.test(event.key)) {
      this.currentGuess += event.key.toUpperCase();
    }
  }

  private isSpecialKey(event: KeyboardEvent): boolean {
    return (
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.key.startsWith('F') ||
      [
        'Tab',
        'CapsLock',
        'Shift',
        'Control',
        'Alt',
        'Meta',
        'Delete',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
      ].includes(event.key)
    );
  }

  async submitGuess() {
    if (this.currentGuess.length !== 5) {
      this.showError('Not enough letters');
      return;
    }

    // If it's the correct custom word, accept it immediately
    if (this.route.snapshot.params['id'] && this.currentGuess === this.word) {
      this.processValidGuess();
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

  private processValidGuess() {
    this.guesses[this.currentRow] = this.currentGuess;
    this.updateKeyboardStates();
    this.animateGuess();
  }

  private animateGuess() {
    // Add small initial delay before starting animations
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.flipStates[this.currentRow][i] = true;
        }, i * 300);
      }

      setTimeout(() => {
        this.checkGameState();
      }, 1500);
    }, 50); // Small initial delay
  }

  private checkGameState() {
    if (this.currentGuess === this.word) {
      this.gameOver = true;
      this.isWin = true;
      this.showGameOverModal = true;
    } else if (this.currentRow === 5) {
      this.gameOver = true;
      this.showGameOverModal = true;
      this.isWin = false;
    } else {
      this.currentRow++;
      this.currentGuess = '';
    }
  }

  updateKeyboardStates() {
    const currentGuess = this.guesses[this.currentRow];
    for (let i = 0; i < currentGuess.length; i++) {
      const letter = currentGuess[i];
      const color = this.getLetterColor(i);
      this.updateLetterState(letter, color);
    }
  }

  private getLetterColor(position: number): string {
    const letter = this.currentGuess[position];
    if (letter === this.word[position]) return '#6ca965';

    const letterCount = this.getRemainingLetterCount(letter);
    return letterCount > 0 ? '#c8b653' : '#3a3a3c'; // Changed to #3a3a3c for unused letters
  }

  private getRemainingLetterCount(letter: string): number {
    const targetLetters = [...this.word];
    const currentGuess = [...this.currentGuess];

    // Remove exact matches
    for (let i = 0; i < 5; i++) {
      if (currentGuess[i] === targetLetters[i]) {
        targetLetters[i] = '*';
        currentGuess[i] = '#';
      }
    }

    return targetLetters.filter((l) => l === letter).length;
  }

  private updateLetterState(letter: string, color: string) {
    if (
      !this.keyboardLetterStates[letter] ||
      (this.keyboardLetterStates[letter] === '#3a3a3c' &&
        color !== '#3a3a3c') ||
      (this.keyboardLetterStates[letter] === '#c8b653' && color === '#6ca965')
    ) {
      this.keyboardLetterStates[letter] = color;
    }
  }

  onPlayAgain() {
    if (this.route.snapshot.params['id']) {
      // If it's a custom game, just reset the state but keep the same word
      this.resetGameState();
    } else {
      // For random word game, get new word
      this.restartGame();
    }
  }

  async restartGame() {
    this.resetGameState();
    await this.getNewWord();
  }

  private resetGameState() {
    this.currentGuess = '';
    this.currentRow = 0;
    this.gameOver = false;
    this.showGameOverModal = false;
    this.isWin = false;
    this.guesses = Array(6).fill('');
    this.flipStates = Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => false)
    );
    this.keyboardLetterStates = {};
  }

  private async getNewWord() {
    try {
      this.word = await this.wordService.getRandomWord();
      console.log('New word to guess:', this.word);
    } catch (error) {
      console.error('Error getting new word:', error);
      this.showError('Error starting new game');
    }
  }
}
