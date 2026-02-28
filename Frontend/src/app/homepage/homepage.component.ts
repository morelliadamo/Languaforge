import { LessonProgressService } from './../services/lesson-progress.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { UserService } from '../services/user.service';
import { Course } from '../interfaces/Course';

@Component({
  selector: 'app-homepage',
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  private lessonProgressService = inject(LessonProgressService);
  private courseService = inject(CourseLoaderServiceService);
  private userService = inject(UserService);

  numberOfUsers: number | string = 0;
  numberOfCourses: number = 0;
  numberOfCompletedLessons: number | string = 0;

  courseWithMostUsers: Course | null = null;
  courseWithBestReviews: Course | null = null;
  recommendedFirstCourse: Course | null = null;

  ngOnInit() {
    this.courseService.getCourseById(14).subscribe((course) => {
      this.recommendedFirstCourse = course;
    });

    this.courseService.getCourseWithMostUsers().subscribe((course) => {
      this.courseWithMostUsers = course;
    });

    this.courseService.getCourseWithBestReviews().subscribe((course) => {
      this.courseWithBestReviews = course;
    });

    this.lessonProgressService.countCompletedLessons().subscribe((stats) => {
      if (stats > 1000000) {
        this.numberOfCompletedLessons = Math.round(stats / 100000) / 10 + 'M+';
      } else {
        this.numberOfCompletedLessons = stats;
      }
    });

    this.userService.countUsers().subscribe((stats) => {
      if (stats > 1000000) {
        this.numberOfUsers = Math.round(stats / 100000) / 10 + 'M+';
      } else {
        this.numberOfUsers = stats;
      }
    });

    this.courseService.countCourses().subscribe((stats) => {
      this.numberOfCourses = stats;
    });
  }
}
