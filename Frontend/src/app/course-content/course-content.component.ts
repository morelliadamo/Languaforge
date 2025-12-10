import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UnitCardComponent } from '../unit-card/unit-card.component';

@Component({
  selector: 'app-course-content',
  imports: [HeaderComponent, FooterComponent, UnitCardComponent],
  templateUrl: './course-content.component.html',
  styleUrl: './course-content.component.css',
})
export class CourseContentComponent {
  courseTitle: string = 'Course Name Here';
  courseDescription: string =
    'Course Description Here Course Description Here Course Description Here';
}
