import {
  Component,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { HoverableWord } from '../interfaces/HoverableWord';
import { WordDefinition } from '../interfaces/WordDefinition';
import { WordDefinitionService } from '../services/word-definition-service';
import { NgForOf, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-hoverable-text-component',
  imports: [NgForOf, NgClass, NgIf],
  templateUrl: './hoverable-text-component.html',
  styleUrl: './hoverable-text-component.css',
})
export class HoverableTextComponent implements OnChanges {
  @Input() text: string = '';

  @Input() sourceLanguage: string = 'en';

  @Input() targetLanguage: string = 'hu';

  @Input() textClass: string = 'text-xl sm:text-2xl font-bold text-gray-800';

  private definitionService = inject(WordDefinitionService);

  words: HoverableWord[] = [];
  definitions = signal<Record<string, WordDefinition>>({});
  activeWord = signal<string | null>(null);
  tooltipPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text']) {
      this.parseText();
      this.prefetchDefinitions();
    }
  }

  private parseText(): void {
    if (!this.text) {
      this.words = [];
      return;
    }

    const tokens = this.text.match(/[\p{L}\p{N}'-]+|[^\p{L}\p{N}'-]+/gu) || [];
    this.words = tokens.map((token) => {
      // Strip non-word chars, then trim leading/trailing quotes and hyphens
      const clean = token
        .replace(/[^\p{L}\p{N}'-]/gu, '')
        .replace(/^['-]+|['-]+$/g, '')
        .toLowerCase();
      return {
        display: token,
        clean,
        isWord: clean.length > 0,
      };
    });
  }

  private prefetchDefinitions(): void {
    if (!this.text) return;

    console.log('[Hoverable] text:', this.text);
    console.log(
      '[Hoverable] words parsed:',
      this.words.map((w) => ({
        display: w.display,
        clean: w.clean,
        isWord: w.isWord,
      })),
    );

    this.definitionService
      .fetchDefinitionsForSentence(
        this.text,
        this.sourceLanguage,
        this.targetLanguage,
      )
      .subscribe({
        next: (defs) => {
          console.log('[Hoverable] definitions received:', defs);
          this.definitions.set(defs);
          this.mergeMultiWordTokens();

          // Check which words have definitions
          const matched = this.words.filter((w) => w.isWord && defs[w.clean]);
          const unmatched = this.words.filter(
            (w) => w.isWord && !defs[w.clean],
          );
          console.log(
            '[Hoverable] matched words:',
            matched.map((w) => w.clean),
          );
          console.log(
            '[Hoverable] unmatched words:',
            unmatched.map((w) => w.clean),
          );
        },
        error: (err) => {
          console.error('[Hoverable] fetch error:', err);
        },
      });
  }

  /**
   * After definitions arrive, merge consecutive word tokens that form
   * a known multi-word phrase (e.g. "software developer", "How are you").
   * Longest phrases are matched first to avoid partial overlaps.
   */
  private mergeMultiWordTokens(): void {
    const defs = this.definitions();
    const multiWordKeys = Object.keys(defs)
      .filter((k) => k.includes(' '))
      .sort((a, b) => b.split(' ').length - a.split(' ').length);

    if (multiWordKeys.length === 0) return;

    const merged: HoverableWord[] = [];
    let i = 0;

    while (i < this.words.length) {
      let matched = false;

      if (this.words[i].isWord) {
        for (const phrase of multiWordKeys) {
          const phraseWords = phrase.split(' ');

          if (this.words[i].clean !== phraseWords[0]) continue;

          let j = i + 1;
          let phraseIdx = 1;

          while (j < this.words.length && phraseIdx < phraseWords.length) {
            if (this.words[j].isWord) {
              if (this.words[j].clean === phraseWords[phraseIdx]) {
                phraseIdx++;
              } else {
                break;
              }
            }
            j++;
          }

          if (phraseIdx === phraseWords.length) {
            const display = this.words
              .slice(i, j)
              .map((w) => w.display)
              .join('');
            merged.push({ display, clean: phrase, isWord: true });
            i = j;
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        merged.push(this.words[i]);
        i++;
      }
    }

    this.words = merged;
  }

  onWordHover(word: HoverableWord, event: MouseEvent): void {
    if (!word.isWord) return;
    const key = word.clean.toLowerCase();
    if (this.definitions()[key]) {
      this.activeWord.set(key);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.tooltipPosition.set({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  }

  onWordLeave(): void {
    this.activeWord.set(null);
  }

  getDefinition(word: string): WordDefinition | null {
    return this.definitions()[word.toLowerCase()] ?? null;
  }

  hasDefinition(word: HoverableWord): boolean {
    return word.isWord && !!this.definitions()[word.clean];
  }
}
