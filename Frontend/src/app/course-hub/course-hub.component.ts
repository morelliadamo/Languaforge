import {Component, inject} from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CourseCardComponent } from '../course-card/course-card.component';
import {CourseLoaderServiceService} from '../services/course-loader-service.service';
import {AuthServiceService} from '../services/auth-service.service';
import {UserCourse} from '../interfaces/UserXCourse';
import {NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-course-hub',
  imports: [FooterComponent, HeaderComponent, CourseCardComponent, NgForOf, RouterLink],
  templateUrl: './course-hub.component.html',
  styleUrl: './course-hub.component.css',
})
export class CourseHubComponent {
  private authService = inject(AuthServiceService);
  private courseLoader = inject(CourseLoaderServiceService);

  userCourses: UserCourse[] = [];


  ngOnInit() {
    this.courseLoader.loadUserCourses(this.authService.getUserName() || "").subscribe({
      next: (courses) => {
        console.log("Courses loaded:", courses);
        this.userCourses.push(...courses);
      },
      error: (err) => {
        console.error("Error loading courses:", err);
      }
    });
  }

}
