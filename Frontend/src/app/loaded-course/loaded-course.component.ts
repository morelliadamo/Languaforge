import { CourseLoaderServiceService } from './../services/course-loader-service.service';
import { Component, inject } from '@angular/core';
import { CourseLogicService } from '../services/course-logic.service';
import { Course } from '../interfaces/Course';
import { Unit } from '../interfaces/Unit';
import { Lesson } from '../interfaces/Lesson';
import { Exercise } from '../interfaces/Exercise';
import { AuthServiceService } from '../services/auth-service.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { UtilService } from '../services/util.service';
import { LoadedLessonComponent } from '../loaded-lesson/loaded-lesson.component';
import { InlineSvgDirective } from '../directives/inline-svg.directive';
import { LessonProgressService } from '../services/lesson-progress.service';
import { LessonProgress } from '../interfaces/LessonProgress';

@Component({
  selector: 'app-loaded-course',
  imports: [
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
    LoadedLessonComponent,
  ],
  templateUrl: './loaded-course.component.html',
  styleUrl: './loaded-course.component.css',
})
export class LoadedCourseComponent {
  courseLogicService = inject(CourseLogicService);
  courseLoaderService = inject(CourseLoaderServiceService);
  authService = inject(AuthServiceService);
  private route = inject(ActivatedRoute);
  private utilService = inject(UtilService);
  private lessonProgressService = inject(LessonProgressService);

  isLoading: boolean = true;
  progressLoaded: boolean = false;
  course: Course | null = null;
  units: Unit[] = [];
  lessons: Lesson[] = [];
  exercises: Exercise[] = [];
  expandedUnitIds: Set<number> = new Set();
  courseActivated: boolean = true;
  lessonActivated: boolean = false;
  activatedLesson: Lesson | null = null;
  lessonProgresses: LessonProgress[] = [];

  toggleUnit(unitId: number): void {
    if (this.expandedUnitIds.has(unitId)) {
      this.expandedUnitIds.delete(unitId);
    } else {
      this.expandedUnitIds.add(unitId);
    }
  }

  isUnitExpanded(unitId: number): boolean {
    return this.expandedUnitIds.has(unitId);
  }

  ngOnInit() {
    const userId = Number(this.authService.getCurrentUserId());
    const courseId = Number(this.route.snapshot.paramMap.get('courseId'));

    if (isNaN(userId) || isNaN(courseId) || courseId === 0) {
      console.error('Invalid userId or courseId', { userId, courseId });
      return;
    }

    this.courseLoaderService
      .loadCourseByUserIdAndCourseId(userId, courseId)
      .subscribe((data: any) => {
        if (!data || !data.course) {
          console.error('Course data not found', { userId, courseId });
          this.isLoading = false;
          return;
        }
        const course = data.course;
        course.color = this.utilService.stringToColor(
          course?.title ?? 'Course',
        );
        this.course = course;
        this.units = course.units ?? [];

        this.lessonProgressService
          .loadLessonProgressesByUserId(userId)
          .subscribe((progresses) => {
            this.lessonProgresses = progresses;
            this.progressLoaded = true;
            this.isLoading = false;
          });
      });
  }

  isLessonUnlocked(unit: Unit, lessonIndex: number): boolean {
    if (lessonIndex === 0) return true;

    const previousLesson = unit.lessons[lessonIndex - 1];
    const progress = this.lessonProgresses.find(
      (p) => p.lessonId === previousLesson.id,
    );
    return !!progress && progress.completedExercises >= progress.exerciseCount;
  }

  isLessonCompleted(lessonId: number): boolean {
    const progress = this.lessonProgresses.find((p) => p.lessonId === lessonId);
    return !!progress && progress.completedExercises >= progress.exerciseCount;
  }

  isUnitCompleted(unit: Unit): boolean {
    if (!unit.lessons || unit.lessons.length === 0) return false;

    return unit.lessons.every((lesson) => this.isLessonCompleted(lesson.id));
  }

  startLesson(lessonId: number) {
    this.lessonActivated = true;
    this.courseActivated = false;
    this.activatedLesson =
      this.units
        .flatMap((unit) => unit.lessons)
        .find((lesson) => lesson.id === lessonId) ?? null;
  }

  closeLessonView() {
    this.lessonActivated = false;
    this.courseActivated = true;
    this.activatedLesson = null;
    this.progressLoaded = false;

    const userId = Number(this.authService.getCurrentUserId());
    this.lessonProgressService
      .loadLessonProgressesByUserId(userId)
      .subscribe((progresses) => {
        this.lessonProgresses = progresses;
        this.progressLoaded = true;
      });
  }

  // getLessonIconSrc(lessonId: number): string {
  //   return `LessonIcons/${lessonId}.svg`;
  // }
}
