// components/create-game/create-game.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WordEncryptionService } from '../../services/word-encryption.service';

@Component({
  selector: 'app-create-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css'],
})
export class CreateGameComponent {
  customWord = '';
  gameLink = '';
  error = '';
  isValidWord = false;
  showCopied = false;

  constructor(
    private wordEncryption: WordEncryptionService,
    private router: Router
  ) {}

  onWordInput() {
    this.customWord = this.customWord.toUpperCase();
    this.isValidWord = this.wordEncryption.isValidWord(this.customWord);
    this.error = this.isValidWord ? '' : 'Please enter a 5-letter word';
    this.gameLink = '';
  }

  createGame() {
    if (!this.isValidWord) return;
    const hash = this.wordEncryption.encryptWord(this.customWord);
    this.gameLink = `${window.location.origin}/play/${hash}`;
  }

  copyLink() {
    navigator.clipboard.writeText(this.gameLink).then(() => {
      this.showCopied = true;
      setTimeout(() => (this.showCopied = false), 2000);
    });
  }

  playGame() {
    const hash = this.wordEncryption.encryptWord(this.customWord);
    this.router.navigate(['/play', hash]);
  }
}
