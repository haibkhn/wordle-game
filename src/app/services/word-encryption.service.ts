import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordEncryptionService {
  encryptWord(word: string): string {
    const encrypted = btoa(word.toUpperCase());
    console.log('Encrypting:', word, 'to:', encrypted);
    return encrypted;
  }

  decryptWord(hash: string): string {
    try {
      const decrypted = atob(hash).toUpperCase();
      console.log('Decrypting:', hash, 'to:', decrypted);
      return decrypted;
    } catch {
      console.error('Failed to decrypt:', hash);
      return '';
    }
  }

  isValidWord(word: string): boolean {
    return /^[A-Z]{5}$/.test(word.toUpperCase());
  }
}
