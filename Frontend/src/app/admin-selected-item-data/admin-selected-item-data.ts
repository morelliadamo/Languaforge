import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Achievement } from './../interfaces/Achievement';
import { FormsModule } from '@angular/forms';
import { Course } from '../interfaces/Course';
import { Unit } from '../interfaces/Unit';
import { Lesson } from '../interfaces/Lesson';
import { Exercise } from '../interfaces/Exercise';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';

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
  private courseService = inject(CourseLoaderServiceService);

  @Input() selectedItem: Achievement | Course | null = null;
  @Output() saved = new EventEmitter<Achievement | Course>();
  selectedItemConverted: SelectedItem | null = null;

  editingExercise: Exercise | null = null;
  private originalExercise: Exercise | null = null;

  editingUnit: Unit | null = null;
  private originalUnit: Unit | null = null;

  editingLesson: Lesson | null = null;
  private originalLesson: Lesson | null = null;

  expandedUnitIds = new Set<number>();
  expandedLessonIds = new Set<number>();

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
      this.expandedUnitIds.clear();
      this.expandedLessonIds.clear();
    }
  }

  toggleUnit(unitId: number) {
    if (this.expandedUnitIds.has(unitId)) {
      this.expandedUnitIds.delete(unitId);
    } else {
      this.expandedUnitIds.add(unitId);
    }
  }

  toggleLesson(lessonId: number) {
    if (this.expandedLessonIds.has(lessonId)) {
      this.expandedLessonIds.delete(lessonId);
    } else {
      this.expandedLessonIds.add(lessonId);
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
    this.originalExercise = exercise;
    this.editingExercise = JSON.parse(JSON.stringify(exercise));
  }

  discardExerciseChanges() {
    this.editingExercise = null;
    this.originalExercise = null;
  }

  saveExerciseChanges() {
    if (!this.editingExercise || !this.originalExercise) return;
    const exercise = this.editingExercise;
    const original = this.originalExercise;
    const statusChanged = original.isDeleted !== exercise.isDeleted;

    const updateFields$ = this.courseService.updateExercise(exercise.id, {
      exerciseContent: exercise.exerciseContent,
    });

    const applyUpdate = (updated: Exercise) => {
      if (this.selectedItemConverted) {
        for (const unit of this.selectedItemConverted.units) {
          for (const lesson of unit.lessons) {
            const idx = lesson.exercises.findIndex((e) => e.id === updated.id);
            if (idx !== -1) {
              lesson.exercises[idx] = updated;
            }
          }
        }
      }
      Object.assign(original, updated);
      this.editingExercise = null;
      this.originalExercise = null;
    };

    if (statusChanged) {
      const statusCall$ = exercise.isDeleted
        ? this.courseService.softDeleteExercise(exercise.id)
        : this.courseService.restoreExercise(exercise.id);
      statusCall$.subscribe(() => updateFields$.subscribe(applyUpdate as any));
    } else {
      updateFields$.subscribe(applyUpdate as any);
    }
  }

  toggleExerciseDeleted() {
    if (this.editingExercise) {
      this.editingExercise.isDeleted = !this.editingExercise.isDeleted;
    }
  }

  openEditUnitModal(unit: Unit) {
    this.originalUnit = unit;
    this.editingUnit = JSON.parse(JSON.stringify(unit));
  }

  discardUnitChanges() {
    this.editingUnit = null;
    this.originalUnit = null;
  }

  saveUnitChanges() {
    if (!this.editingUnit || !this.originalUnit) return;
    const unit = this.editingUnit;
    const original = this.originalUnit;
    const statusChanged = original.isDeleted !== unit.isDeleted;

    const updateFields$ = this.courseService.updateUnit(unit.id, {
      title: unit.title,
    });

    const applyUpdate = (updated: Unit) => {
      if (this.selectedItemConverted) {
        const idx = this.selectedItemConverted.units.findIndex(
          (u) => u.id === updated.id,
        );
        if (idx !== -1) {
          const lessons = this.selectedItemConverted.units[idx].lessons;
          this.selectedItemConverted.units[idx] = { ...updated, lessons };
        }
      }
      Object.assign(original, updated);
      this.editingUnit = null;
      this.originalUnit = null;
    };

    if (statusChanged) {
      const statusCall$ = unit.isDeleted
        ? this.courseService.softDeleteUnit(unit.id)
        : this.courseService.restoreUnit(unit.id);
      statusCall$.subscribe(() => updateFields$.subscribe(applyUpdate as any));
    } else {
      updateFields$.subscribe(applyUpdate as any);
    }
  }

  toggleUnitDeleted() {
    if (this.editingUnit) {
      this.editingUnit.isDeleted = !this.editingUnit.isDeleted;
    }
  }

  openEditLessonModal(lesson: Lesson) {
    this.originalLesson = lesson;
    this.editingLesson = JSON.parse(JSON.stringify(lesson));
  }

  discardLessonChanges() {
    this.editingLesson = null;
    this.originalLesson = null;
  }

  saveLessonChanges() {
    if (!this.editingLesson || !this.originalLesson) return;
    const lesson = this.editingLesson;
    const original = this.originalLesson;
    const statusChanged = original.isDeleted !== lesson.isDeleted;

    const updateFields$ = this.courseService.updateLesson(lesson.id, {
      title: lesson.title,
    });

    const applyUpdate = (updated: Lesson) => {
      if (this.selectedItemConverted) {
        for (const unit of this.selectedItemConverted.units) {
          const idx = unit.lessons.findIndex((l) => l.id === updated.id);
          if (idx !== -1) {
            const exercises = unit.lessons[idx].exercises;
            unit.lessons[idx] = { ...updated, exercises };
          }
        }
      }
      Object.assign(original, updated);
      this.editingLesson = null;
      this.originalLesson = null;
    };

    if (statusChanged) {
      const statusCall$ = lesson.isDeleted
        ? this.courseService.softDeleteLesson(lesson.id)
        : this.courseService.restoreLesson(lesson.id);
      statusCall$.subscribe(() => updateFields$.subscribe(applyUpdate as any));
    } else {
      updateFields$.subscribe(applyUpdate as any);
    }
  }

  toggleLessonDeleted() {
    if (this.editingLesson) {
      this.editingLesson.isDeleted = !this.editingLesson.isDeleted;
    }
  }
}
