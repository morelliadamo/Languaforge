import { UserXCourse } from './../interfaces/UserProfileData';
import { CourseLoaderServiceService } from './course-loader-service.service';
import { routes } from './../app.routes';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class CourseLogicService {
  constructor(private http: HttpClient) {}
  private router = inject(Router);
  private authService = inject(AuthServiceService);
  private courseLoaderService = inject(CourseLoaderServiceService);

  enterCourse(courseId: number) {
    console.log(`Enrolling into course with ID: ${courseId}`);
    this.enrollCourse(courseId);
    console.log(`Entering course with ID: ${courseId}`);
    this.router.navigate([`/my/courses/${courseId}`]);
  }

  enrollCourse(courseId: number) {
    this.courseLoaderService
      .loadUserCoursesByUserId(Number(this.authService.getCurrentUserId()))
      .subscribe((userCourses: UserXCourse[]) => {
        for (const userCourse of userCourses) {
          if (userCourse.course.id == courseId) {
            alert(`Már beiratkozva: ${courseId}`);

            return;
          }
        }

        console.log(`Enrolling in course with ID: ${courseId}`);
        this.courseLoaderService.createUserXCourse(courseId);
      });
  }
}
