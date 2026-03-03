import { inject, Injectable } from '@angular/core';
import { WordDefinition } from '../interfaces/WordDefinition';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, forkJoin, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordDefinitionService {
  private apiUrl = 'http://localhost:8080/wordDefinitions';
  private http = inject(HttpClient);

  private cache = new Map<string, WordDefinition>();

  fetchDefinitionsForSentence(
    sentence: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Observable<Record<string, WordDefinition>> {
    const terms = this.extractTerms(sentence);
    const uncached = terms.filter(
      (w) => !this.cache.has(this.cacheKey(w, sourceLanguage, targetLanguage)),
    );

    if (uncached.length === 0) {
      const result: Record<string, WordDefinition> = {};
      terms.forEach((w) => {
        const key = this.cacheKey(w, sourceLanguage, targetLanguage);
        if (this.cache.has(key)) {
          result[w.toLowerCase()] = this.cache.get(key)!;
        }
      });
      return of(result);
    }

    return this.http
      .post<WordDefinition[] | Record<string, WordDefinition>>(
        `${this.apiUrl}/bulk`,
        {
          words: uncached,
          sourceLanguage,
          targetLanguage,
        },
      )
      .pipe(
        map((response) => this.normalizeResponse(response)),
        tap((definitions) => {
          Object.entries(definitions).forEach(([word, def]) => {
            this.cache.set(
              this.cacheKey(word, sourceLanguage, targetLanguage),
              def,
            );
          });
        }),
        catchError(() =>
          this.fallbackIndividualLookup(
            uncached,
            sourceLanguage,
            targetLanguage,
          ),
        ),
      );
  }

  lookupWord(
    word: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Observable<WordDefinition> {
    const key = this.cacheKey(word, sourceLanguage, targetLanguage);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }
    return this.http
      .get<WordDefinition>(`${this.apiUrl}/lookup`, {
        params: { word, source: sourceLanguage, target: targetLanguage },
      })
      .pipe(tap((def) => this.cache.set(key, def)));
  }

  private normalizeResponse(
    response: WordDefinition[] | Record<string, WordDefinition>,
  ): Record<string, WordDefinition> {
    const result: Record<string, WordDefinition> = {};

    const addDef = (def: WordDefinition) => {
      if (!def?.word) return;
      const key = def.word.toLowerCase();
      result[key] = def;
      const cleanKey = key.replace(/[^\p{L}\p{N}\s'-]/gu, '').trim();
      if (cleanKey && cleanKey !== key) {
        result[cleanKey] = def;
      }
    };

    if (Array.isArray(response)) {
      response.forEach(addDef);
    } else {
      Object.values(response).forEach(addDef);
    }

    return result;
  }

  private fallbackIndividualLookup(
    words: string[],
    sourceLanguage: string,
    targetLanguage: string,
  ): Observable<Record<string, WordDefinition>> {
    if (words.length === 0) return of({});

    const lookups = words.map((word) =>
      this.lookupWord(word, sourceLanguage, targetLanguage).pipe(
        catchError(() => of(null as WordDefinition | null)),
      ),
    );

    return forkJoin(lookups).pipe(
      map((results) => {
        const record: Record<string, WordDefinition> = {};
        results.forEach((def) => {
          if (def) {
            record[def.word.toLowerCase()] = def;
          }
        });
        return record;
      }),
    );
  }

  private extractTerms(text: string): string[] {
    const rawTokens = text.split(/\s+/).filter((t) => t.length > 0);
    const cleanTokens = rawTokens.map((t) =>
      t
        .replace(/[^\p{L}\p{N}'-]/gu, '')
        .replace(/^['-]+|['-]+$/g, '')
        .toLowerCase(),
    );

    const terms = new Set<string>();

    cleanTokens.forEach((w) => {
      if (w.length > 0) terms.add(w);
    });

    for (let n = 2; n <= 4 && n <= cleanTokens.length; n++) {
      for (let i = 0; i <= cleanTokens.length - n; i++) {
        const parts = cleanTokens.slice(i, i + n).filter((w) => w.length > 0);
        if (parts.length === n) {
          terms.add(parts.join(' '));
        }
      }
    }

    for (let n = 2; n <= 4 && n <= rawTokens.length; n++) {
      for (let i = 0; i <= rawTokens.length - n; i++) {
        const rawNgram = rawTokens
          .slice(i, i + n)
          .map((t) => t.toLowerCase())
          .join(' ');
        terms.add(rawNgram);
      }
    }

    return [...terms];
  }

  private extractWords(text: string): string[] {
    return text
      .replace(/[^\p{L}\p{N}\s'-]/gu, '')
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .map((w) => w.toLowerCase());
  }

  private cacheKey(word: string, source: string, target: string): string {
    return `${word.toLowerCase()}:${source}:${target}`;
  }
}
