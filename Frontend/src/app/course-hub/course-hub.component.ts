import {Component, inject, OnInit} from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import {CourseLoaderServiceService} from '../services/course-loader-service.service';
import {AuthServiceService} from '../services/auth-service.service';
import {UserCourse} from '../interfaces/UserXCourse';
import {NgForOf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Unit} from '../interfaces/Unit';
import {Lesson} from '../interfaces/Lesson';
import {Exercise} from '../interfaces/Exercise';

@Component({
  selector: 'app-course-hub',
  imports: [FooterComponent, HeaderComponent, CourseCardComponent, NgForOf, RouterLink],
  templateUrl: './course-hub.component.html',
  styleUrl: './course-hub.component.css',
})
export class CourseHubComponent implements OnInit {
  private authService = inject(AuthServiceService);
  private courseLoader = inject(CourseLoaderServiceService);
  private router = inject(Router);

  userCourses: UserCourse[] = [];
  userCourseUnits: Unit[] = [];
  userCourseUnitLessons: Lesson[] = [];
  userCourseUnitLessonExercises: Exercise[] = [];

  ngOnInit() {
    this.courseLoader.loadUserCourses(this.authService.getUserName() || "").subscribe({

      next: (courses) => {
        console.log("Courses loaded:", courses);
        this.userCourses.push(...courses);
          this.userCourses.forEach(course => {
            this.userCourseUnits.push(...course.course.units);
            console.log("Units loaded for course", course.id, ":", course.course.units);
            console.log(this.userCourseUnits)
            course.course.units.forEach(unit => {
              this.userCourseUnitLessons.push(...unit.lessons);
              unit.lessons.forEach(lesson => {
                  this.userCourseUnitLessonExercises.push(...lesson.exercises);
            });
          });
        });
      },

      error: (err) => {
        console.error("Error loading courses:", err);
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        else {
          alert("An error occurred while loading your courses. Please try again later.");
        }
      }
    });
  }
}

