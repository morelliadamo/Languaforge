import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-unit-card',
  imports: [],
  templateUrl: './unit-card.component.html',
  styleUrl: './unit-card.component.css',
})
export class UnitCardComponent {
  @Input() unitTitle: string = 'Unit Title Here';
  @Input() unitDescription: string = 'Unit Description Here';
  @Input() unitDifficulty: string = 'Beginner';
  @Input() unitProgress: number = 0;
  @Input() unitColor: string = '#4A90E2';
  @Input() unitIcon: string = '';
  @Input() unitTaskCount: number = 10;
}
