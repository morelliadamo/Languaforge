import { AuthServiceService } from './../services/auth-service.service';
import { Component, inject } from '@angular/core';
import { FriendActivityComponent } from '../friend-activity/friend-activity.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserProfileDataService } from '../services/user-profile-data.service';
import {
  Achievement,
  Course as UserProfileCourse,
} from '../interfaces/UserProfile';
import { Course as LoadedCourse } from '../interfaces/Course';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [FriendActivityComponent, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private userProfileDataService = inject(UserProfileDataService);
  private authService = inject(AuthServiceService);
  private courseService = inject(CourseLoaderServiceService);

  welcomeMessage: string = '';
  welcomeMessageList: string[] = [
    'Üdv újra!',
    'Szia, készen állsz a tanulásra?',
    'Már vártunk! 😺',
    'Helló tudás-kovács!',
    'Most tudás lesz a fejedbe verve! 💫🔨',
  ];

  currentStreak: string = '';
  longestStreak: string = '';
  completedCourses: UserProfileCourse[] = [];
  achievements: Achievement[] = [];

  isLessonInProgress: boolean = false;
  scrollPosition: number = 0;

  availableCoursesToStart: LoadedCourse[] = [];

  ngOnInit() {
    console.log(this.authService.getCurrentUserId());

    this.userProfileDataService
      .getUserProfileData(Number(localStorage.getItem('user_id')))
      .subscribe((data) => {
        this.currentStreak = String(data.currentStreak);
        this.longestStreak = String(data.longestStreak);
        this.completedCourses = data.completedCourses;
        this.achievements = data.achievements;

        console.log(this.achievements.length);

        console.log(data);
      });

    this.courseService.loadAllCourses().subscribe((data) => {
      data.forEach((element) => {
        if (element.id < 10) {
          element.difficulty = 'Easy';
        } else if (element.id > 10 && element.id < 50) {
          element.difficulty = 'Intermediate';
        } else {
          element.difficulty = 'Hard';
        }
        this.availableCoursesToStart.push(element);

        console.log(element);
        console.log(this.availableCoursesToStart);
      });
    });

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
}
