import { Achievement } from './../interfaces/Achievement';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { AchievementService } from '../services/achievement.service';
import { Course } from '../interfaces/Course';
import { AdminSelectedItemData } from '../admin-selected-item-data/admin-selected-item-data';

@Component({
  selector: 'app-admin-data-management',
  imports: [FormsModule, AdminSelectedItemData],
  templateUrl: './admin-data-management.html',
  styleUrl: './admin-data-management.css',
})
export class AdminDataManagement {
  @Output() close = new EventEmitter<void>();

  private courseService = inject(CourseLoaderServiceService);
  private achievementService = inject(AchievementService);

  allAchievements: Achievement[] = [];
  allCourses: Course[] = [];

  selectedCategory: 'achievements' | 'courses' = 'achievements';
  selectedStatus: 'all' | 'active' | 'inactive' = 'all';
  searchField: 'name' | 'id' = 'name';
  searchTerm: string = '';

  selectedItem: Achievement | Course | null = null;

  get filteredAchievements(): Achievement[] {
    let items = this.allAchievements;
    if (this.selectedStatus === 'active')
      items = items.filter((a) => !a.isDeleted);
    else if (this.selectedStatus === 'inactive')
      items = items.filter((a) => a.isDeleted);
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      if (this.searchField === 'id')
        items = items.filter((a) => a.id.toString() === term);
      else items = items.filter((a) => a.name.toLowerCase().includes(term));
    }
    return items;
  }

  get filteredCourses(): Course[] {
    let items = this.allCourses;
    if (this.selectedStatus === 'active')
      items = items.filter((c) => !c.isDeleted);
    else if (this.selectedStatus === 'inactive')
      items = items.filter((c) => c.isDeleted);
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      if (this.searchField === 'id')
        items = items.filter((c) => c.id.toString() === term);
      else items = items.filter((c) => c.title.toLowerCase().includes(term));
    }
    return items;
  }

  selectItem(selected: Achievement | Course) {
    this.selectedItem = selected;

    document.getElementById('edit-panel')?.classList.remove('hidden');

    this.scrollToEdit();
  }

  scrollToEdit(): void {
    document
      .getElementById('edit-panel')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  onSave(item: Achievement | Course) {
    if ('iconUrl' in item) {
      const original = this.selectedItem as Achievement;
      const statusChanged = original.isDeleted !== item.isDeleted;
      const updateFields$ = this.achievementService.updateAchievement(
        item.id,
        item as any,
      );

      const applyUpdate = (updated: Achievement) => {
        this.allAchievements = this.allAchievements.map((a) =>
          a.id === updated.id ? updated : a,
        );
        this.selectedItem = { ...updated };
      };

      if (statusChanged) {
        const statusCall$ = item.isDeleted
          ? this.achievementService.softDeleteAchievement(item.id)
          : this.achievementService.restoreAchievement(item.id);
        statusCall$.subscribe(() =>
          updateFields$.subscribe(applyUpdate as any),
        );
      } else {
        updateFields$.subscribe(applyUpdate as any);
      }
    } else {
      const original = this.selectedItem as Course;
      const statusChanged = original.isDeleted !== item.isDeleted;
      const updateFields$ = this.courseService.updateCourse(
        item.id,
        item as Course,
      );

      const applyUpdate = (updated: Course) => {
        this.allCourses = this.allCourses.map((c) =>
          c.id === updated.id ? updated : c,
        );
        this.selectedItem = { ...updated };
      };

      if (statusChanged) {
        const statusCall$ = item.isDeleted
          ? this.courseService.softDeleteCourse(item.id)
          : this.courseService.restoreCourse(item.id);
        statusCall$.subscribe(() =>
          updateFields$.subscribe(applyUpdate as any),
        );
      } else {
        updateFields$.subscribe(applyUpdate as any);
      }
    }
  }

  ngOnInit() {
    this.achievementService.getAllAchievements().subscribe((achievements) => {
      this.allAchievements = achievements;
    });

    this.courseService.getAllCourses().subscribe((courses) => {
      this.allCourses = courses;
    });
  }
}
