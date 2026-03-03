import { Exercise, MatchPair } from '../interfaces/Exercise';
import { LessonProgress } from '../interfaces/LessonProgress';
import { AuthServiceService } from '../services/auth-service.service';
import { LessonProgressService } from '../services/lesson-progress.service';
import { StreakService } from '../services/streak-service';
import {
  StreakEvent,
  StreakChangedComponent,
} from '../streak-changed/streak-changed';
import { Lesson } from './../interfaces/Lesson';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { HoverableTextComponent } from '../hoverable-text-component/hoverable-text-component';
import { FormsModule } from '@angular/forms';

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

  private previousStreakValue = signal<number>(0);

  streakEvent = signal<StreakEvent | null>(null);

  private correctExerciseIds: Set<number> = new Set();
  private lessonProgress: LessonProgress | null = null;
  private alreadyCompleted: boolean = false;

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

    if (this.currentExercise?.exerciseType === 'match') {
      this.initMatchExercise();
    }
  }

  closeLesson() {
    this.lessonClosed.emit();
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
      default:
        return this.currentExercise?.exerciseType ?? '';
    }
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
    this.shuffledRight = pairs
      .map((p) => p.right)
      .sort(() => Math.random() - 0.5);
    this.matchedPairs = [];
    this.matchSelectedLeft = null;
    this.matchSelectedRight = null;
    this.matchIncorrectPair = null;
    this.matchComplete = false;
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
    const isCorrectPair = pairs.some(
      (p) => p.left === left && p.right === right,
    );

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
      setTimeout(() => {
        this.matchIncorrectPair = null;
        this.matchSelectedLeft = null;
        this.matchSelectedRight = null;
      }, 600);
    }
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
      this.lessonContent.push(exercise);
    }
  }
}
