import {Component, Input} from '@angular/core';
import {UserCourse} from '../interfaces/UserXCourse';

@Component({
  selector: 'app-course-card',
  imports: [],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.css'
})
export class CourseCardComponent {
  @Input() userCourse!: UserCourse;

}
