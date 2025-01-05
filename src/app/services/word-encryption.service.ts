import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordEncryptionService {
  encryptWord(word: string): string {
    return btoa(word.toUpperCase());
  }

  decryptWord(hash: string): string {
    try {
      return atob(hash).toUpperCase();
    } catch {
      return '';
    }
  }

  isValidWord(word: string): boolean {
    return /^[A-Z]{5}$/.test(word.toUpperCase());
  }
}
