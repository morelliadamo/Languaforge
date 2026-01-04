import { Component, inject, OnInit } from '@angular/core';
import { Lesson } from '../interfaces/Lesson';
import { AuthServiceService } from '../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { LessonCardComponent } from '../lesson-card/lesson-card.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import { NgForOf } from '@angular/common';
import { Unit } from '../interfaces/Unit';
import { Exercise } from '../interfaces/Exercise';

@Component({
  selector: 'app-lesson-hub',
  imports: [FooterComponent, HeaderComponent, LessonCardComponent, NgForOf],
  templateUrl: './lesson-hub.component.html',
  styleUrl: './lesson-hub.component.css',
})
export class LessonHubComponent implements OnInit {
  lessons: Lesson[] = [];
  courseId = 0;
  unitId = 0;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseLoader = inject(CourseLoaderServiceService);
  private authService = inject(AuthServiceService);

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseId = +params['courseId']; // Get courseId from route
      this.unitId = +params['unitId']; // Get unitId from route
      this.loadLessons();
    });
  }

  loadLessons() {
    const username = this.authService.getUserName() || '';
    this.courseLoader
      .loadUnitLessons(username, this.courseId, this.unitId)
      .subscribe({
        next: (unit: Unit) => {
          console.log('Lessons loaded:', unit.lessons);
          this.lessons = unit.lessons;
        },
        error: (err) => {
          console.error('Error loading lessons:', err);
          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  onLessonClick(lesson: Lesson, exercises: Exercise[]) {
    console.log('Lesson clicked:', lesson);
    this.router.navigate(
      [
        '/my/courses',
        this.courseId,
        'units',
        this.unitId,
        'lessons',
        lesson.id,
      ],
      {
        state: {
          lesson: lesson,
          exercises: exercises,
        },
      }
    );
  }
}
