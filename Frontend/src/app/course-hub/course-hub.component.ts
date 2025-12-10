import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-hub',
  imports: [FooterComponent, HeaderComponent, CourseCardComponent],
  templateUrl: './course-hub.component.html',
  styleUrl: './course-hub.component.css',
})
export class CourseHubComponent {}
