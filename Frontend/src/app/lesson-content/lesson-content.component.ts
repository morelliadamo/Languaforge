import { Component, inject, OnInit } from '@angular/core';
import { Lesson } from '../interfaces/Lesson';
import { Exercise } from '../interfaces/Exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgFor, NgIf } from '@angular/common';
@Component({
  selector: 'app-lesson-content',
  imports: [HeaderComponent, FooterComponent, NgFor, NgIf],
  templateUrl: './lesson-content.component.html',
  styleUrl: './lesson-content.component.css',
})
export class LessonContentComponent implements OnInit {
  lesson: any;
  exercises: any[] = [];
  currentExerciseIndex = 0;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.lesson = navigation.extras.state['lesson'];
      this.exercises = navigation.extras.state['exercises'];
    }
  }

  ngOnInit(): void {}

  getCurrentExercise(): any {
    return this.exercises[this.currentExerciseIndex];
  }

  nextExercise(): void {
    if (this.currentExerciseIndex < this.exercises.length - 1) {
      this.currentExerciseIndex++;
    }
  }

  previousExercise(): void {
    if (this.currentExerciseIndex > 0) {
      this.currentExerciseIndex--;
    }
  }

  isLastExercise(): boolean {
    return this.currentExerciseIndex === this.exercises.length - 1;
  }

  isFirstExercise(): boolean {
    return this.currentExerciseIndex === 0;
  }
}
