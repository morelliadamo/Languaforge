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

  isLoading: boolean = true;
  course: Course | null = null;
  units: Unit[] = [];
  lessons: Lesson[] = [];
  exercises: Exercise[] = [];
  expandedUnitIds: Set<number> = new Set();
  courseActivated: boolean = true;
  lessonActivated: boolean = false;
  activatedLesson: Lesson | null = null;

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

    console.log('userId:', userId, 'courseId:', courseId);

    if (isNaN(userId) || isNaN(courseId) || courseId === 0) {
      console.error('Invalid userId or courseId', { userId, courseId });
      return;
    }

    this.courseLoaderService
      .loadCourseByUserIdAndCourseId(userId, courseId)
      .subscribe((data: any) => {
        console.log('raw response:', JSON.stringify(data));

        const course = data.course;

        console.log('course:', course);
        console.log('units:', course.units);

        data.course.color = this.utilService.stringToColor(
          this.course?.title ?? 'Course',
        );
        this.course = course;
        this.units = course.units ?? [];
        this.isLoading = false;
      });
  }

  startLesson(lessonId: number) {
    console.log(`Starting lesson with ID: ${lessonId}`);
    this.lessonActivated = true;
    this.courseActivated = false;
    this.activatedLesson =
      this.units
        .flatMap((unit) => unit.lessons)
        .find((lesson) => lesson.id === lessonId) ?? null;

    console.log(this.activatedLesson);
  }

  closeLessonView() {
    this.lessonActivated = false;
    this.courseActivated = true;
    this.activatedLesson = null;
  }
}
