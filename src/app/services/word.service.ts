// word.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private apiUrl = 'https://api.datamuse.com/words?sp=?????'; // Will get 5-letter words

  constructor(private http: HttpClient) {}

  async getRandomWord(): Promise<string> {
    try {
      // Get a list of 5-letter words from Datamuse API
      const response = await firstValueFrom(
        this.http.get<Array<{ word: string }>>(this.apiUrl)
      );

      // Pick a random word from the response
      const randomIndex = Math.floor(Math.random() * response.length);
      const randomWord = response[randomIndex].word.toUpperCase();

      return randomWord;
    } catch (error) {
      console.error('Error fetching random word:', error);
      throw error;
    }
  }

  checkWord(word: string): Observable<boolean> {
    // Use Datamuse API to check if word exists
    return this.http
      .get<Array<{ word: string }>>(
        `https://api.datamuse.com/words?sp=${word.toLowerCase()}&max=1`
      )
      .pipe(
        map((response) => {
          // If we get a match, it's a valid word
          return (
            response.length > 0 &&
            response[0].word.toLowerCase() === word.toLowerCase()
          );
        }),
        catchError(() => of(false))
      );
  }
}
