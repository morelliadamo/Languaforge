import { UserXCourse } from './../interfaces/UserProfile';
import { CourseLoaderServiceService } from './course-loader-service.service';
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
    const userId = Number(this.authService.getCurrentUserId());

    this.courseLoaderService
      .loadUserXCoursesByUserId(userId)
      .subscribe((userCourses: UserXCourse[]) => {
        const alreadyEnrolled = userCourses.some(
          (uxc) => uxc.course?.id == courseId,
        );

        if (alreadyEnrolled) {
          console.log(`Already enrolled in course ${courseId}, navigating...`);
          this.router.navigate([`/my/courses/${courseId}`]);
        } else {
          console.log(`Enrolling in course with ID: ${courseId}`);
          this.courseLoaderService.createUserXCourse(courseId).subscribe({
            next: () => {
              console.log(
                `Successfully enrolled, navigating to course ${courseId}`,
              );
              this.router.navigate([`/my/courses/${courseId}`]);
            },
            error: (err) => {
              console.error('Error enrolling in course:', err);
            },
          });
        }
      });
  }
}
