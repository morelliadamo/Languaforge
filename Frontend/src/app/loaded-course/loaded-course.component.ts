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

const LESSON_COLORS: Record<number, string> = {
  // Course 1 – Magyar-Angol alapok
  1: '#e11d48', // Colors & Numbers  – red/rose
  2: '#16a34a', // Animals           – green
  3: '#2563eb', // Objects           – blue
  4: '#f59e0b', // Greetings         – amber
  5: '#0ea5e9', // Introductions     – sky blue
  6: '#dc2626', // Food              – red
  7: '#7c3aed', // Drinks            – purple
  // Course 2 – Utazás és közlekedés
  110: '#ea580c', // Vehicles          – orange
  111: '#0d9488', // Directions        – teal
  112: '#4f46e5', // At the Station    – indigo
  113: '#0284c7', // At the Airport    – sky blue
  114: '#7c3aed', // Hotel             – purple
  115: '#16a34a', // Landmarks         – green
  // Course 3 – Vásárlás és pénzügyek
  120: '#db2777', // In the Shop       – pink
  121: '#9333ea', // Clothes           – purple
  122: '#d97706', // Sizes and Colours – amber
  123: '#ca8a04', // Currency          – yellow/gold
  124: '#059669', // Paying            – emerald
  125: '#dc2626', // Ordering Food     – red
  // Course 5 – Család és kapcsolatok
  140: '#2563eb', // Immediate Family  – blue
  141: '#0891b2', // Extended Family   – cyan
  142: '#db2777', // Friendship        – pink
  143: '#f59e0b', // Emotions          – amber
  144: '#7c3aed', // Describing People – purple
  145: '#e11d48', // Celebrations      – rose
  // Course 6 – Technológia és internet
  150: '#0369a1', // Hardware          – dark sky blue
  151: '#7c3aed', // Software          – purple
  152: '#0284c7', // Browsing          – sky blue
  153: '#8b5cf6', // Social Media      – violet
  154: '#059669', // Online Safety     – emerald
  155: '#0ea5e9', // Messaging         – light blue
  // Course 4 – Munka és karrier
  130: '#0f766e', // Job Titles        – teal
  131: '#0369a1', // Office Vocabulary – blue
  132: '#7c3aed', // Emails            – purple
  133: '#dc2626', // CV & Cover Letter – red
  134: '#d97706', // Job Interview     – amber
  135: '#2563eb', // Meetings & Presentations – blue
};

const LOCKED_COLOR = '#9ca3af';

@Component({
  selector: 'app-loaded-course',
  imports: [
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
    LoadedLessonComponent,
    InlineSvgDirective,
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
        const course = data.course;
        data.course.color = this.utilService.stringToColor(
          course?.title ?? 'Course',
        );
        this.course = course;
        this.units = course.units ?? [];

        // Load progresses before marking as done
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

  getLessonIconSrc(lessonId: number): string {
    return `LessonIcons/${lessonId}.svg`;
  }

  getLessonIconStyle(
    lessonId: number,
    locked: boolean = false,
  ): Record<string, string> {
    const color = locked
      ? LOCKED_COLOR
      : (LESSON_COLORS[lessonId] ?? '#6b7280');
    return { color: color };
  }

  getLessonIconColor(lessonId: number, locked: boolean = false): string {
    return locked ? LOCKED_COLOR : (LESSON_COLORS[lessonId] ?? '#6b7280');
  }
}
