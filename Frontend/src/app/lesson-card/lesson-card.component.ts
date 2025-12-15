import {Component, Input} from '@angular/core';
import {Lesson} from '../interfaces/Lesson';

@Component({
  selector: 'app-lesson-card',
  imports: [],
  templateUrl: './lesson-card.component.html',
  styleUrl: './lesson-card.component.css'
})
export class LessonCardComponent {
    @Input() lesson!: Lesson;
}
