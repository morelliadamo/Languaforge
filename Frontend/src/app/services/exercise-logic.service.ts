import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SpeechEvalResult {
  transcript: string;
  words: { text: string; start: number; end: number }[];
  evaluation: {
    score: number;
    [key: string]: unknown;
  };
  feedback: string;
  language: string;
}

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/exerciseLogic';

  evaluateSpeech(
    expectedText: string,
    audioBlob: Blob,
  ): Observable<SpeechEvalResult> {
    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'recording.wav');
    return this.http.post<SpeechEvalResult>(
      `${this.apiUrl}/evaluateSpeech?expectedText=${encodeURIComponent(expectedText)}`,
      formData,
    );
  }
}
