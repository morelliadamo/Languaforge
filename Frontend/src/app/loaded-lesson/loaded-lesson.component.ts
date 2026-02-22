import { Exercise } from '../interfaces/Exercise';
import { Lesson } from './../interfaces/Lesson';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-loaded-lesson',
  imports: [],
  templateUrl: './loaded-lesson.component.html',
  styleUrl: './loaded-lesson.component.css',
})
export class LoadedLessonComponent {
  @Input() lesson: Lesson | null = null;
  @Input() courseColor: string = '#0ea5e9';
  @Output() lessonClosed = new EventEmitter<void>();

  lessonContent: Exercise[] = [];
  currentIndex: number = 0;
  selectedAnswer: string | null = null;
  isAnswered: boolean = false;

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
    if (this.lessonContent.length === 0) return 0;
    return Math.round(
      ((this.currentIndex + 1) / this.lessonContent.length) * 100,
    );
  }

  ngOnInit() {
    if (this.lesson) {
      this.lessonContent = this.lesson.exercises ?? [];
    }
  }

  selectAnswer(answer: string) {
    if (this.isAnswered) return;
    this.selectedAnswer = answer;
    this.isAnswered = true;
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
}
