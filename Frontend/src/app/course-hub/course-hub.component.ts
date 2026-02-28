import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { AuthServiceService } from '../services/auth-service.service';
import { CourseLogicService } from '../services/course-logic.service';
import { UtilService } from '../services/util.service';
import { Course } from '../interfaces/Course';
import { UserXCourse } from '../interfaces/UserProfile';

@Component({
  selector: 'app-course-hub',
  imports: [FooterComponent, HeaderComponent, LoadingOverlayComponent],
  templateUrl: './course-hub.component.html',
  styleUrl: './course-hub.component.css',
})
export class CourseHubComponent implements OnInit {
  private authService = inject(AuthServiceService);
  private courseLoader = inject(CourseLoaderServiceService);
  private utilService = inject(UtilService);
  courseLogicService = inject(CourseLogicService);

  isLoading = true;
  maxCourseSlots = 1; //course slot system to be implemented later
  startedCourses: Course[] = [];
  completedCourses: Course[] = [];
  allCourses: Course[] = [];

  get startedCount(): number {
    return this.startedCourses.length;
  }

  get availableSlots(): number {
    return Math.max(0, this.maxCourseSlots - this.startedCount);
  }

  get availableCourses(): Course[] {
    const enrolledIds = new Set([
      ...this.startedCourses.map((c) => c.id),
      ...this.completedCourses.map((c) => c.id),
    ]);
    return this.allCourses.filter((c) => !enrolledIds.has(c.id));
  }

  ngOnInit() {
    const userId = Number(this.authService.getCurrentUserId());

    let startedLoaded = false;
    let allLoaded = false;
    const checkDone = () => {
      if (startedLoaded && allLoaded) this.isLoading = false;
    };

    this.courseLoader
      .loadUserXCoursesByUserId(userId)
      .subscribe((userXCourses: UserXCourse[]) => {
        const mapped = userXCourses.map((uxc) => {
          const course: Course = {
            ...uxc.course,
            units: [],
            progress: Math.floor(uxc.progress * 100),
            difficulty: null,
            reviews: null,
            color: null,
          };
          course.difficulty = this.mapDifficulty(course.difficulty);
          course.color = this.utilService.stringToColor(course.title);
          return course;
        });
        this.completedCourses = mapped.filter((c) => c.progress >= 100);
        this.startedCourses = mapped.filter((c) => c.progress < 100);
        startedLoaded = true;
        checkDone();
      });

    this.courseLoader.loadAllCourses().subscribe((courses) => {
      this.allCourses = courses.map((c) => {
        c.difficulty = this.mapDifficulty(c.difficulty);
        c.color = this.utilService.stringToColor(c.title);
        return c;
      });
      allLoaded = true;
      checkDone();
    });
  }

  // Scroll positions
  scrollPositionStarted = 0;
  scrollPositionCompleted = 0;
  scrollPositionAvailable = 0;

  private scrollSection(
    selector: string,
    direction: 'left' | 'right',
    currentPos: number,
    itemCount: number,
    cardWidth: number,
    mobileCardWidth: number,
  ): number {
    const container = document.querySelector(selector) as HTMLElement;
    if (!container) return currentPos;
    const width = window.innerWidth <= 640 ? mobileCardWidth : cardWidth;
    const gap = 24;
    const scrollAmount = width + gap;
    let pos = currentPos;
    if (direction === 'left') {
      pos = Math.max(0, pos - scrollAmount);
    } else {
      const maxScroll = scrollAmount * itemCount - scrollAmount;
      pos = Math.min(maxScroll, pos + scrollAmount);
    }
    container.style.transform = `translateX(-${pos}px)`;
    return pos;
  }

  scrollStartedLeft(): void {
    this.scrollPositionStarted = this.scrollSection(
      '.started-scroll-content',
      'left',
      this.scrollPositionStarted,
      this.startedCourses.length,
      450,
      320,
    );
  }
  scrollStartedRight(): void {
    this.scrollPositionStarted = this.scrollSection(
      '.started-scroll-content',
      'right',
      this.scrollPositionStarted,
      this.startedCourses.length,
      450,
      320,
    );
  }

  scrollCompletedLeft(): void {
    this.scrollPositionCompleted = this.scrollSection(
      '.completed-scroll-content',
      'left',
      this.scrollPositionCompleted,
      this.completedCourses.length,
      450,
      320,
    );
  }
  scrollCompletedRight(): void {
    this.scrollPositionCompleted = this.scrollSection(
      '.completed-scroll-content',
      'right',
      this.scrollPositionCompleted,
      this.completedCourses.length,
      450,
      320,
    );
  }

  scrollAvailableLeft(): void {
    this.scrollPositionAvailable = this.scrollSection(
      '.course-scroll-content',
      'left',
      this.scrollPositionAvailable,
      this.availableCourses.length,
      320,
      280,
    );
  }
  scrollAvailableRight(): void {
    this.scrollPositionAvailable = this.scrollSection(
      '.course-scroll-content',
      'right',
      this.scrollPositionAvailable,
      this.availableCourses.length,
      320,
      280,
    );
  }

  private mapDifficulty(val: number | string | null): string {
    if (val == null) return 'Kezdő';
    if (val === 0 || val === '0') return 'Középhaladó';
    if (val === 1 || val === '1') return 'Haladó';
    if (val === 2 || val === '2') return 'Szakértő';
    if (typeof val === 'string' && val.length > 0) return val;
    return 'Kezdő';
  }
}
