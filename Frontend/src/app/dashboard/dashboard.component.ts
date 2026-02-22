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
import { ActivityHeatmapComponent } from '../activity-heatmap/activity-heatmap.component';
import { CourseLogicService } from '../services/course-logic.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    FriendActivityComponent,
    HeaderComponent,
    FooterComponent,
    LoadingOverlayComponent,
    ActivityHeatmapComponent,
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
  courseLogicService = inject(CourseLogicService);

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
      console.log(data);

      data.forEach((element) => {
        if (element.difficulty == null) {
          element.difficulty = 'Kezdő';
        } else if (element.difficulty == 0) {
          element.difficulty = 'Középhaladó';
        } else if (element.difficulty == 1) {
          element.difficulty = 'Haladó';
        } else if (element.difficulty == 2) {
          element.difficulty = 'Szakértő';
        }

        element.reviews = element.reviews || [];
        element.color = this.utilService.stringToColor(element.title);
        console.log(element);
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

          if (course.difficulty == null) {
            course.difficulty = 'Kezdő';
          } else if (course.difficulty == 0) {
            course.difficulty = 'Középhaladó';
          } else if (course.difficulty == 1) {
            course.difficulty = 'Haladó';
          } else if (course.difficulty == 2) {
            course.difficulty = 'Szakértő';
          }

          course.color = this.utilService.stringToColor(course.title);

          return course;
        });
      });

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
}
