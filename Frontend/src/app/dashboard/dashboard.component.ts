import { AuthServiceService } from './../services/auth-service.service';
import { Component, inject } from '@angular/core';
import { FriendActivityComponent } from '../friend-activity/friend-activity.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserProfileDataService } from '../services/user-profile-data.service';
import {
  Achievement,
  Course as UserProfileCourse,
  UserXCourse,
} from '../interfaces/UserProfile';
import { Course as LoadedCourse } from '../interfaces/Course';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { UtilService } from '../services/util.service';
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { LessonProgressService } from '../services/lesson-progress.service';

// Heatmap interfaces
interface HeatmapDay {
  date: Date;
  count: number;
  dateString: string;
}

interface HeatmapWeek {
  weekIndex: number;
  days: HeatmapDay[];
}

interface HeatmapMonth {
  name: string;
  startWeek: number;
  endWeek: number;
  index: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    FriendActivityComponent,
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  isLoading: boolean = true;
  private userProfileDataService = inject(UserProfileDataService);
  private authService = inject(AuthServiceService);
  private courseService = inject(CourseLoaderServiceService);
  private utilService = inject(UtilService);
  private lessonProgressService = inject(LessonProgressService);

  private username = this.authService.getUserName();

  welcomeMessage: string = '';
  welcomeMessageList: string[] = [
    `Üdv újra, ${this.username}!`,
    `Szia, ${this.username}, készen állsz a tanulásra?`,
    `Már vártunk, ${this.username}! 😺`,
    `Helló tudás-kovács, ${this.username}!`,
    `Most tudás lesz a fejedbe verve! 💫🔨`,
    `Örülünk, hogy itt vagy, ${this.username}!`,
    `Kezdődjön az agytorna! 🧠`,
    `Új nap, új tudás, ${this.username}!`,
    `Vágjunk bele, ${this.username}! 🚀`,
    `A tudás útja most folytatódik, ${this.username}…`,
    `Készen áll az elméd, ${this.username}? 🤓`,
    `Tanulás mód: BE 🔛`,
    `Helló, ${this.username}! Ma is okosabbak leszünk!`,
    `Csapjunk bele a tudásba, ${this.username}! ⚡`,
    `Jó látni téged újra, ${this.username}!`,
    `Indulhat az észcsata, ${this.username}! 🧩`,
    `Friss aggyal érkeztél, ${this.username}? Akkor hajrá!`,
    `A tudás nem vár, ${this.username}! 😉`,
  ];

  currentStreak: string = '';
  longestStreak: string = '';
  completedCourses: UserProfileCourse[] = [];
  achievements: Achievement[] = [];

  isCourseInProgress: boolean = true;
  scrollPosition: number = 0;
  scrollPositionInProgress: number = 0;

  availableCoursesToStart: LoadedCourse[] = [];
  startedCourses: LoadedCourse[] = [];

  // heatmap data
  heatmapData: HeatmapWeek[] = [];
  heatmapMonths: HeatmapMonth[] = [];
  weekDays: string[] = ['Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo', 'Va'];
  activityData: Map<string, number> = new Map();

  // delay to ensure loading overlay appears

  async ngOnInit() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.isLoading = false;
    // profile data
    this.userProfileDataService
      .getUserProfileData(Number(localStorage.getItem('user_id')))
      .subscribe((data) => {
        this.currentStreak = String(data.currentStreak);
        this.longestStreak = String(data.longestStreak);
        this.completedCourses = data.completedCourses;
        this.achievements = data.achievements;
      });

    //courses available to start
    this.courseService.loadAllCourses().subscribe((data) => {
      data.forEach((element) => {
        if (element.id < 10) {
          element.difficulty = 'Easy';
        } else if (element.id > 10 && element.id < 50) {
          element.difficulty = 'Intermediate';
        } else {
          element.difficulty = 'Hard';
        }

        element.reviews = this.availableCoursesToStart.push(element);
        element.color = this.utilService.stringToColor(element.title);
      });
    });

    //started courses
    this.courseService
      .loadUserXCoursesByUserId(Number(localStorage.getItem('user_id')))
      .subscribe((userXCourses) => {
        console.log(userXCourses);

        this.startedCourses = userXCourses.map((userXCourse) => {
          const course: LoadedCourse = {
            ...userXCourse.course,
            units: [],
            progress: userXCourse.progress * 100,
            difficulty: null,
            reviews: null,
            color: null,
          };

          // set difficulty based on course ID
          if (course.id < 10) {
            course.difficulty = 'Easy';
          } else if (course.id > 10 && course.id < 50) {
            course.difficulty = 'Intermediate';
          } else {
            course.difficulty = 'Hard';
          }

          course.color = this.utilService.stringToColor(course.title);

          return course;
        });
      });

    // Initialize heatmap structure
    this.generateHeatmapStructure();

    // Load activity data from lesson progress API
    this.loadActivityData();

    //randomized welcome message
    this.welcomeMessage =
      this.welcomeMessageList[
        Math.floor(Math.random() * this.welcomeMessageList.length)
      ];
  }

  scrollLeft(): void {
    const container = document.querySelector(
      '.course-scroll-content',
    ) as HTMLElement;
    if (container) {
      const cardWidth = window.innerWidth <= 640 ? 280 : 320;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      this.scrollPosition = Math.max(0, this.scrollPosition - scrollAmount);
      container.style.transform = `translateX(-${this.scrollPosition}px)`;
    }
  }

  scrollRight(): void {
    const container = document.querySelector(
      '.course-scroll-content',
    ) as HTMLElement;
    if (container) {
      const cardWidth = window.innerWidth <= 640 ? 280 : 320;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      const maxScroll =
        scrollAmount * this.availableCoursesToStart.length - scrollAmount;

      this.scrollPosition = Math.min(
        maxScroll,
        this.scrollPosition + scrollAmount,
      );
      container.style.transform = `translateX(-${this.scrollPosition}px)`;
    }
  }

  scrollLeftInProgress(): void {
    const container = document.querySelector(
      '.progress-scroll-content',
    ) as HTMLElement;
    if (container) {
      const cardWidth = window.innerWidth <= 640 ? 320 : 450;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      this.scrollPositionInProgress = Math.max(
        0,
        this.scrollPositionInProgress - scrollAmount,
      );
      container.style.transform = `translateX(-${this.scrollPositionInProgress}px)`;
    }
  }

  scrollRightInProgress(): void {
    const container = document.querySelector(
      '.progress-scroll-content',
    ) as HTMLElement;
    if (container) {
      const cardWidth = window.innerWidth <= 640 ? 320 : 450;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      const maxScroll =
        scrollAmount * this.startedCourses.length - scrollAmount;

      this.scrollPositionInProgress = Math.min(
        maxScroll,
        this.scrollPositionInProgress + scrollAmount,
      );
      container.style.transform = `translateX(-${this.scrollPositionInProgress}px)`;
    }
  }

  // Heatmap methods
  generateHeatmapStructure(): void {
    const weeks: HeatmapWeek[] = [];
    const months: HeatmapMonth[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);

    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let currentMonth = -1;
    let monthStartWeek = 0;

    while (currentDate <= today) {
      const week: HeatmapDay[] = [];

      for (let i = 0; i < 7; i++) {
        const dateString = this.formatDate(currentDate);
        const count = this.activityData.get(dateString) || 0;

        week.push({
          date: new Date(currentDate),
          count: count,
          dateString: dateString,
        });

        // Track months for labels
        const month = currentDate.getMonth();
        if (month !== currentMonth) {
          if (currentMonth !== -1) {
            months.push({
              name: this.getMonthName(currentMonth),
              startWeek: monthStartWeek,
              endWeek: weekIndex - 1,
              index: currentMonth,
            });
          }
          currentMonth = month;
          monthStartWeek = weekIndex;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push({
        weekIndex: weekIndex,
        days: week,
      });

      weekIndex++;
    }

    // Add the last month
    if (currentMonth !== -1) {
      months.push({
        name: this.getMonthName(currentMonth),
        startWeek: monthStartWeek,
        endWeek: weekIndex - 1,
        index: currentMonth,
      });
    }

    this.heatmapData = weeks;
    this.heatmapMonths = months;
  }

  formatDate(date: Date): string {
    return this.utilService.formatDate(date);
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Jan',
      'Feb',
      'Már',
      'Ápr',
      'Máj',
      'Jún',
      'Júl',
      'Aug',
      'Szep',
      'Okt',
      'Nov',
      'Dec',
    ];
    return months[monthIndex];
  }

  getHeatmapCellClass(count: number): string {
    if (count === 0) {
      return 'bg-gray-100 border border-gray-200';
    } else if (count <= 2) {
      return 'bg-sky-200';
    } else if (count <= 5) {
      return 'bg-sky-400';
    } else if (count <= 10) {
      return 'bg-sky-600';
    } else {
      return 'bg-sky-800';
    }
  }

  getHeatmapTooltip(day: HeatmapDay): string {
    const dateStr = day.date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (day.count === 0) {
      return `${dateStr}: Nincs aktivitás`;
    } else if (day.count === 1) {
      return `${dateStr}: 1 tevékenység`;
    } else {
      return `${dateStr}: ${day.count} tevékenység`;
    }
  }

  getTotalActivityCount(): number {
    let total = 0;
    this.activityData.forEach((count) => {
      total += count;
    });
    return total;
  }

  loadActivityData(): void {
    const userId = Number(localStorage.getItem('user_id'));

    this.lessonProgressService.loadLessonProgressesByUserId(userId).subscribe({
      next: (lessonProgresses) => {
        console.log('Loaded lesson progresses:', lessonProgresses);

        this.activityData =
          this.utilService.aggregateLessonProgressByDate(lessonProgresses);

        this.generateHeatmapStructure();
      },
      error: (error) => {
        console.error('Error loading lesson progress data:', error);
      },
    });
  }

  isFirstWeekOfMonth(weekIndex: number): boolean {
    return this.heatmapMonths.some((month) => month.startWeek === weekIndex);
  }

  getMonthForWeek(weekIndex: number): string {
    const month = this.heatmapMonths.find(
      (month) => month.startWeek === weekIndex,
    );
    return month ? month.name : '';
  }
}
