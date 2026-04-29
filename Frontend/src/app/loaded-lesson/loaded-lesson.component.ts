import { Exercise } from '../interfaces/Exercise';
import { LessonProgress } from '../interfaces/LessonProgress';
import { AuthServiceService } from '../services/auth-service.service';
import {
  ExerciseLogicService,
  SpeechEvalResult,
} from '../services/exercise-logic.service';
import { LessonProgressService } from '../services/lesson-progress.service';
import { StreakService } from '../services/streak-service';
import {
  StreakEvent,
  StreakChangedComponent,
} from '../streak-changed/streak-changed';
import { Lesson } from './../interfaces/Lesson';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HoverableTextComponent } from '../hoverable-text-component/hoverable-text-component';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-loaded-lesson',
  imports: [StreakChangedComponent, HoverableTextComponent, FormsModule],
  templateUrl: './loaded-lesson.component.html',
  styleUrl: './loaded-lesson.component.css',
})
export class LoadedLessonComponent {
  @Input() lesson: Lesson | null = null;
  @Input() courseColor: string = '#0ea5e9';
  @Output() lessonClosed = new EventEmitter<void>();

  private lessonProgressService = inject(LessonProgressService);
  private authService = inject(AuthServiceService);
  private streakService = inject(StreakService);

  lessonContent: Exercise[] = [];
  currentIndex: number = 0;
  selectedAnswer: string | null = null;
  isAnswered: boolean = false;
  isLessonComplete: boolean = false;

  originalExerciseCount: number = 0;

  correctUniqueCount: number = 0;

  // --- Fill-in state ---
  fillInAnswer: string = '';

  // --- Typing state ---
  typingAnswer: string = '';

  // --- Match state ---
  shuffledRight: string[] = [];
  matchSelectedLeft: string | null = null;
  matchSelectedRight: string | null = null;
  matchedPairs: { left: string; right: string }[] = [];
  matchIncorrectPair: { left: string; right: string } | null = null;
  matchComplete: boolean = false;
  matchFailed: boolean = false;

  // --- Speech state ---
  speechRecording: boolean = false;
  speechSubmitting: boolean = false;
  speechResult: SpeechEvalResult | null = null;
  speechPassed: boolean = false;
  speechHintRevealed: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private speechChunks: BlobPart[] = [];
  protected speechBlob: Blob | null = null;

  private previousStreakValue = signal<number>(0);

  streakEvent = signal<StreakEvent | null>(null);

  private correctExerciseIds: Set<number> = new Set();
  private lessonProgress: LessonProgress | null = null;
  private alreadyCompleted: boolean = false;

  private storeService = inject(StoreService);
  private destroyRef = inject(DestroyRef);
  private exerciseLogicService = inject(ExerciseLogicService);

  numberOfHearts: number = 0;
  outOfHearts: boolean = false;
  numberOfHints: number = 0;

  get currentExercise(): Exercise | null {
    return this.lessonContent[this.currentIndex] ?? null;
  }

  get isFirst(): boolean {
    return this.currentIndex === 0;
  }

  get isLast(): boolean {
    return this.currentIndex === this.lessonContent.length - 1;
  }

  get progressPercent(): number {
    if (this.originalExerciseCount === 0) return 0;
    return Math.round(
      (this.correctUniqueCount / this.originalExerciseCount) * 100,
    );
  }

  get progressLabel(): string {
    return `${this.correctUniqueCount} / ${this.originalExerciseCount}`;
  }

  ngOnInit() {
    if (this.lesson) {
      this.lessonContent = [...(this.lesson.exercises ?? [])];
      this.originalExerciseCount = this.lessonContent.length;
      this.initProgress();

      if (this.currentExercise?.exerciseType === 'match') {
        this.initMatchExercise();
      }
    }

    const userId = Number(this.authService.getCurrentUserId());
    this.storeService.getUserHearts(userId).subscribe((item) => {
      this.numberOfHearts = item.amount;
    });

    this.storeService.getUserHints(userId).subscribe((item) => {
      this.numberOfHints = item.amount;
    });

    this.storeService.itemChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ type, changedBy }) => {
        if (type === 'hearts') this.numberOfHearts += changedBy;
        if (type === 'hints') this.numberOfHints += changedBy;
      });
  }

  private initProgress() {
    if (!this.lesson) return;
    const userId = Number(this.authService.getCurrentUserId());
    const lessonId = this.lesson.id;

    this.streakService.getStreakByUserId(userId).subscribe({
      next: (streak) => this.previousStreakValue.set(streak.currentStreak),
      error: () => this.previousStreakValue.set(0),
    });

    this.lessonProgressService
      .loadLessonProgressesByUserId(userId)
      .subscribe((progresses) => {
        const existing = progresses.find((p) => p.lessonId === lessonId);
        if (existing) {
          this.lessonProgress = existing;
          if (existing.completedExercises >= existing.exerciseCount) {
            this.alreadyCompleted = true;
            this.currentIndex = 0;
            this.correctUniqueCount = 0;
            this.correctExerciseIds.clear();
          } else {
            this.alreadyCompleted = false;
            this.currentIndex = 0;
            this.correctUniqueCount = 0;
            this.correctExerciseIds.clear();
          }
        } else {
          this.alreadyCompleted = false;
          this.lessonProgressService
            .createLessonProgress(userId, lessonId)
            .subscribe((created) => {
              this.lessonProgress = created;
            });
        }
      });
  }

  private saveProgress(completedCount: number) {
    if (!this.lessonProgress) return;
    if (this.alreadyCompleted) return;
    if (completedCount <= this.lessonProgress.completedExercises) return;

    this.lessonProgressService
      .updateLessonProgress(this.lessonProgress.id, completedCount)
      .subscribe({
        next: (updated) => {
          this.lessonProgress = updated;

          if (updated.completedExercises >= updated.exerciseCount) {
            this.isLessonComplete = true;
            this.checkAndShowStreak();
          }
        },
      });
  }

  private showPositiveStreak(data: {
    currentStreak: number;
    longestStreak: number;
  }) {
    const event: StreakEvent = {
      currentStreak: data.currentStreak,
      longestStreak: data.longestStreak,
      isReset: false,
      message: '',
    };
    this.streakEvent.set(event);
    console.log('[STREAK POSITIVE] Event created:', event);

    setTimeout(() => {
      this.streakEvent.set(null);
    }, 6000);
  }

  private forceSaveProgress(completedCount: number) {
    if (!this.lessonProgress) return;
    if (this.alreadyCompleted) return;

    this.lessonProgressService
      .updateLessonProgress(this.lessonProgress.id, completedCount)
      .subscribe((updated) => {
        this.lessonProgress = updated;
        this.checkAndShowStreak();
      });
  }

  private checkAndShowStreak() {
    const userId = Number(this.authService.getCurrentUserId());

    this.streakService.getStreakByUserId(userId).subscribe({
      next: (latestStreak) => {
        const newValue = latestStreak.currentStreak;

        if (newValue > this.previousStreakValue()) {
          this.showPositiveStreak({
            currentStreak: newValue,
            longestStreak: latestStreak.longestStreak,
          });
        }

        this.previousStreakValue.set(newValue);
      },
      error: (err) => console.error('Failed to refresh streak:', err),
    });
  }

  selectAnswer(answer: string) {
    if (this.isAnswered) return;
    this.selectedAnswer = answer;
    this.isAnswered = true;

    this.handleAnswerResult(this.isCorrect(answer));
  }

  isCorrect(answer: string): boolean {
    return answer === this.currentExercise?.exerciseContent.correctAnswer;
  }

  nextExercise() {
    console.log(this.currentExercise);

    if (!this.isLast) {
      this.currentIndex++;
      this.resetSelection();
      if (this.currentExercise?.exerciseType === 'match') {
        this.initMatchExercise();
      }
    }
  }

  previousExercise() {
    console.log(this.currentExercise);

    if (!this.isFirst) {
      this.currentIndex--;
      this.resetSelection();
      if (this.currentExercise?.exerciseType === 'match') {
        this.initMatchExercise();
      }
    }
  }

  goBack() {
    this.lessonClosed.emit();
  }

  private resetSelection() {
    this.selectedAnswer = null;
    this.isAnswered = false;
    this.fillInAnswer = '';
    this.typingAnswer = '';
    this.matchSelectedLeft = null;
    this.matchSelectedRight = null;
    this.matchedPairs = [];
    this.matchIncorrectPair = null;
    this.matchComplete = false;
    this.matchFailed = false;
    // Speech
    if (this.mediaRecorder?.state === 'recording') {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;
    this.speechRecording = false;
    this.speechSubmitting = false;
    this.speechResult = null;
    this.speechPassed = false;
    this.speechHintRevealed = false;
    this.speechBlob = null;
    this.speechChunks = [];
  }

  closeLesson() {
    this.lessonClosed.emit();
  }

  onHintUsed(): void {
    if (this.numberOfHints <= 0) return;
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;
    this.storeService.decrementUserItem(Number(userId), 'hints', 1).subscribe();
  }

  // ─── Exercise type helpers ───

  get exerciseTypeLabel(): string {
    switch (this.currentExercise?.exerciseType) {
      case 'choice':
        return 'Feleletválasztós';
      case 'fill_in':
        return 'Kiegészítős';
      case 'match':
        return 'Párosítós';
      case 'typing':
        return 'Begépelős';
      case 'listening':
        return 'Hallgatós';
      case 'reading':
        return 'Olvasós';
      case 'speech':
        return 'Kiejtési';
      default:
        return this.currentExercise?.exerciseType ?? '';
    }
  }

  get isCurrentAnswerCorrect(): boolean {
    if (this.currentExercise?.exerciseType === 'match') {
      return this.matchComplete;
    }
    if (this.currentExercise?.exerciseType === 'speech') {
      return this.speechPassed;
    }
    return this.selectedAnswer !== null && this.isCorrect(this.selectedAnswer);
  }

  // ─── Fill-in ───

  submitFillIn(): void {
    if (this.isAnswered || !this.fillInAnswer.trim()) return;
    this.selectedAnswer = this.fillInAnswer.trim();
    this.isAnswered = true;
    this.handleAnswerResult(
      this.fillInAnswer.trim().toLowerCase() ===
        this.currentExercise?.exerciseContent.correctAnswer?.toLowerCase(),
    );
  }

  get fillInSentenceParts(): string[] {
    const sentence =
      this.currentExercise?.exerciseContent.sentence ??
      this.currentExercise?.exerciseContent.description ??
      '';
    return sentence.split('__');
  }

  // ─── Typing ───

  submitTyping(): void {
    if (this.isAnswered || !this.typingAnswer.trim()) return;
    this.selectedAnswer = this.typingAnswer.trim();
    this.isAnswered = true;
    this.handleAnswerResult(
      this.typingAnswer.trim().toLowerCase() ===
        this.currentExercise?.exerciseContent.correctAnswer?.toLowerCase(),
    );
  }

  // ─── Match ───

  initMatchExercise(): void {
    const pairs = this.currentExercise?.exerciseContent.pairs ?? [];
    this.shuffledRight = [...pairs.map((p) => p[1])].sort(
      () => Math.random() - 0.5,
    );
    this.matchedPairs = [];
    this.matchSelectedLeft = null;
    this.matchSelectedRight = null;
    this.matchIncorrectPair = null;
    this.matchComplete = false;
    this.matchFailed = false;
  }

  selectMatchLeft(word: string): void {
    if (this.isAnswered || this.isMatchLeftMatched(word)) return;
    this.matchSelectedLeft = word;
    this.matchIncorrectPair = null;
    if (this.matchSelectedRight) {
      this.tryMatch();
    }
  }

  selectMatchRight(word: string): void {
    if (this.isAnswered || this.isMatchRightMatched(word)) return;
    this.matchSelectedRight = word;
    this.matchIncorrectPair = null;
    if (this.matchSelectedLeft) {
      this.tryMatch();
    }
  }

  private tryMatch(): void {
    const pairs = this.currentExercise?.exerciseContent.pairs ?? [];
    const left = this.matchSelectedLeft!;
    const right = this.matchSelectedRight!;
    const isCorrectPair = pairs.some((p) => p[0] === left && p[1] === right);

    if (isCorrectPair) {
      this.matchedPairs.push({ left, right });
      this.matchSelectedLeft = null;
      this.matchSelectedRight = null;
      this.matchIncorrectPair = null;

      if (this.matchedPairs.length === pairs.length) {
        this.matchComplete = true;
        this.isAnswered = true;
        this.handleAnswerResult(true);
      }
    } else {
      this.matchIncorrectPair = { left, right };
      this.matchFailed = true;
      this.isAnswered = true;
      this.handleAnswerResult(false);
    }
  }

  // ─── Listening ───

  get listeningAudioPath(): string {
    const match =
      this.currentExercise?.exerciseContent.description.match(/@([^@]+)@/);
    return match ? match[1] : '';
  }

  get listeningDescription(): string {
    return (this.currentExercise?.exerciseContent.description ?? '')
      .replace(/@[^@]+@/g, '')
      .trim();
  }

  playListeningAudio(): void {
    const path = this.listeningAudioPath;
    if (!path) return;
    const audio = new Audio(path);
    audio.play().catch(() => {});
  }

  // ─── Reading ───

  get readingParts(): { type: 'text' | 'reading'; content: string }[] {
    const desc = this.currentExercise?.exerciseContent.description ?? '';
    const parts: { type: 'text' | 'reading'; content: string }[] = [];
    const segments = desc.split(/@([^@]+)@/);
    for (let i = 0; i < segments.length; i++) {
      const content = segments[i].trim();
      if (!content) continue;
      parts.push({ type: i % 2 === 1 ? 'reading' : 'text', content });
    }
    return parts;
  }

  isMatchLeftSelected(word: string): boolean {
    return this.matchSelectedLeft === word;
  }

  isMatchRightSelected(word: string): boolean {
    return this.matchSelectedRight === word;
  }

  isMatchLeftMatched(word: string): boolean {
    return this.matchedPairs.some((p) => p.left === word);
  }

  isMatchRightMatched(word: string): boolean {
    return this.matchedPairs.some((p) => p.right === word);
  }

  isMatchLeftIncorrect(word: string): boolean {
    return this.matchIncorrectPair?.left === word;
  }

  isMatchRightIncorrect(word: string): boolean {
    return this.matchIncorrectPair?.right === word;
  }

  // ─── Speech ───

  async startRecording(): Promise<void> {
    if (this.speechRecording || this.isAnswered) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.speechChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.speechChunks.push(e.data);
      };
      this.mediaRecorder.onstop = () => {
        const webmBlob = new Blob(this.speechChunks, { type: 'audio/webm' });
        this.convertToWav(webmBlob).then((wav) => (this.speechBlob = wav));
        stream.getTracks().forEach((t) => t.stop());
      };
      this.mediaRecorder.start();
      this.speechRecording = true;
    } catch {
      console.error('Microphone access denied or not available.');
    }
  }

  stopRecording(): void {
    if (!this.speechRecording || !this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.speechRecording = false;
  }

  private async convertToWav(blob: Blob): Promise<Blob> {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new AudioContext();
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    await audioCtx.close();
    return new Blob([this.audioBufferToWav(decoded)], { type: 'audio/wav' });
  }

  private audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
    const numSamples = buffer.length;
    const sampleRate = buffer.sampleRate;
    const dataSize = numSamples * 2; // 16-bit mono
    const ab = new ArrayBuffer(44 + dataSize);
    const view = new DataView(ab);
    const w = (off: number, s: string) =>
      [...s].forEach((c, i) => view.setUint8(off + i, c.charCodeAt(0)));
    w(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    w(8, 'WAVE');
    w(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    w(36, 'data');
    view.setUint32(40, dataSize, true);
    const ch = buffer.getChannelData(0);
    let offset = 44;
    for (let i = 0; i < numSamples; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, ch[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return ab;
  }

  submitSpeech(): void {
    if (!this.speechBlob || this.speechSubmitting || this.isAnswered) return;
    const expectedText =
      this.currentExercise?.exerciseContent.correctAnswer ?? '';
    this.speechSubmitting = true;
    this.exerciseLogicService
      .evaluateSpeech(expectedText, this.speechBlob)
      .subscribe({
        next: (result) => {
          this.speechResult = result;
          this.speechSubmitting = false;

          // Try evaluation.score / evaluation.accuracy, then parse from feedback string.
          // Backend may use different field names or locale-formatted percentages (e.g. "100,0%").
          let raw: number | null =
            ((result.evaluation as Record<string, unknown>)?.[
              'score'
            ] as number) ??
            ((result.evaluation as Record<string, unknown>)?.[
              'accuracy'
            ] as number) ??
            null;

          if (raw === null || raw === undefined || isNaN(raw)) {
            const match = result.feedback?.match(/(\d+[,.]?\d*)\s*%/);
            if (match) raw = parseFloat(match[1].replace(',', '.'));
          }

          const normalized = (raw ?? 0) > 1 ? (raw ?? 0) / 100 : (raw ?? 0);
          this.speechPassed = normalized >= 0.8;
          this.isAnswered = true;
          this.handleAnswerResult(this.speechPassed);
        },
        error: () => {
          this.speechSubmitting = false;
        },
      });
  }

  onSpeechHintUsed(): void {
    if (this.numberOfHints <= 0 || this.isAnswered) return;
    this.speechHintRevealed = true;
    this.onHintUsed();
  }

  // ─── Shared answer handling ───

  private handleAnswerResult(correct: boolean): void {
    const exercise = this.currentExercise;
    if (!exercise) return;

    if (correct) {
      if (!this.correctExerciseIds.has(exercise.id)) {
        this.correctExerciseIds.add(exercise.id);
        this.correctUniqueCount++;

        if (this.correctUniqueCount >= this.originalExerciseCount) {
          this.isLessonComplete = true;
          this.forceSaveProgress(this.correctUniqueCount);
        } else {
          this.saveProgress(this.correctUniqueCount);
        }
      }
    } else {
      this.storeService
        .decrementUserItem(this.authService.getCurrentUserId()!, 'hearts', 1)
        .subscribe(() => {
          if (this.numberOfHearts <= 0) {
            this.outOfHearts = true;
          }
        });
      this.lessonContent.push(exercise);
    }
  }
}
