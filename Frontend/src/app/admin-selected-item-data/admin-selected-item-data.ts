import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Achievement } from './../interfaces/Achievement';
import { FormsModule } from '@angular/forms';
import { Course } from '../interfaces/Course';
import { Unit } from '../interfaces/Unit';
import { Exercise } from '../interfaces/Exercise';

interface SelectedItem {
  id: number;
  name: string | null; //only on achievement
  title: string | null; //only on course
  description: string;
  iconUrl: string; //only on achievement
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  earnCondition: {
    //only on achievement
    condition: string; //only on achievement
    value: string; //only on achievement
  } | null; //only on achievement
  difficulty: number | string | null; //only on course
  units: Unit[]; //only on course
  color: string | null; //only on course
  progress: number; //only on course
  reviews: any[] | null; //only on course
}

@Component({
  selector: 'app-admin-selected-item-data',
  imports: [FormsModule],
  templateUrl: './admin-selected-item-data.html',
  styleUrl: './admin-selected-item-data.css',
})
export class AdminSelectedItemData implements OnChanges {
  @Input() selectedItem: Achievement | Course | null = null;
  @Output() saved = new EventEmitter<Achievement | Course>();
  selectedItemConverted: SelectedItem | null = null;

  editingExercise: Exercise | null = null;

  checkType(item: Achievement | Course): 'achievement' | 'course' {
    if ('iconUrl' in item) return 'achievement';
    return 'course';
  }

  get asSelectedItem(): SelectedItem | null {
    if (!this.selectedItem) return null;

    if (this.checkType(this.selectedItem) === 'achievement') {
      const a = this.selectedItem as Achievement;
      return {
        id: a.id,
        name: a.name,
        title: null,
        description: a.description,
        iconUrl: a.iconUrl,
        createdAt: a.createdAt,
        isDeleted: a.isDeleted,
        deletedAt: a.deletedAt,
        earnCondition: a.earnCondition,
        difficulty: null,
        units: [],
        color: null,
        progress: 0,
        reviews: null,
      };
    } else {
      const c = this.selectedItem as Course;
      return {
        id: c.id,
        name: null,
        title: c.title,
        description: c.description,
        iconUrl: '',
        createdAt: c.createdAt,
        isDeleted: c.isDeleted,
        deletedAt: c.deletedAt,
        earnCondition: null,
        difficulty: c.difficulty,
        units: c.units,
        color: c.color,
        progress: c.progress,
        reviews: c.reviews,
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItem']) {
      this.selectedItemConverted = this.asSelectedItem;
    }
  }

  save() {
    if (!this.selectedItemConverted || !this.selectedItem) return;
    const c = this.selectedItemConverted;
    if (this.checkType(this.selectedItem) === 'achievement') {
      const updated: Achievement = {
        ...(this.selectedItem as Achievement),
        name: c.name!,
        description: c.description,
        iconUrl: c.iconUrl,
        isDeleted: c.isDeleted,
        earnCondition: c.earnCondition,
      };
      this.saved.emit(updated);
    } else {
      const updated: Course = {
        ...(this.selectedItem as Course),
        title: c.title!,
        description: c.description,
        isDeleted: c.isDeleted,
      };
      this.saved.emit(updated);
    }
  }

  openEditExerciseModal(exercise: Exercise) {
    this.editingExercise = exercise;
    console.log(exercise);
  }
}
