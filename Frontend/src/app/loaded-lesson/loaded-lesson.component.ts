import { Exercise } from '../interfaces/Exercise';
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

@Component({
  selector: 'app-loaded-lesson',
  imports: [StreakChangedComponent],
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
    }
  }

  private initProgress() {
    if (!this.lesson) return;
    const userId = Number(this.authService.getCurrentUserId());
    const lessonId = this.lesson.id;

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

    const exercise = this.currentExercise;
    if (!exercise) return;

    if (this.isCorrect(answer)) {
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

  isCorrect(answer: string): boolean {
    return answer === this.currentExercise?.exerciseContent.correctAnswer;
  }

  nextExercise() {
    if (!this.isLast) {
      this.currentIndex++;
      this.resetSelection();
    }
  }

  previousExercise() {
    if (!this.isFirst) {
      this.currentIndex--;
      this.resetSelection();
    }
  }

  goBack() {
    this.lessonClosed.emit();
  }

  private resetSelection() {
    this.selectedAnswer = null;
    this.isAnswered = false;
  }

  closeLesson() {
    this.lessonClosed.emit();
  }
}
