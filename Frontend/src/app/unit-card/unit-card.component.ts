import { Component, Input } from '@angular/core';
import {RouterLink} from '@angular/router';
import {Unit} from '../interfaces/Unit';

@Component({
  selector: 'app-unit-card',
  imports: [
    RouterLink
  ],
  templateUrl: './unit-card.component.html',
  styleUrl: './unit-card.component.css',
})
export class UnitCardComponent {
  @Input() courseId: number = 0;
  @Input() unit!: Unit;
  @Input() unitId: number = 0;
  @Input() unitTitle: string = 'Unit Title Here';
  @Input() unitDescription: string = 'Unit Description Here';
  @Input() unitDifficulty: string = 'Beginner';
  @Input() unitProgress: number = 0;
  @Input() unitColor: string = '#4A90E2';
  @Input() unitIcon: string = '';
  @Input() unitLessonsCount: number = 0;
}
