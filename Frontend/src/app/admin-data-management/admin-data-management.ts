import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { AchievementService } from '../services/achievement.service';
import { Achievement } from '../interfaces/Achievement';
import { Course } from '../interfaces/Course';

@Component({
  selector: 'app-admin-data-management',
  imports: [FormsModule],
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

  ngOnInit() {
    this.achievementService.getAllAchievements().subscribe((achievements) => {
      this.allAchievements = achievements;
    });

    this.courseService.getAllCourses().subscribe((courses) => {
      this.allCourses = courses;
    });
  }

  scrollToEdit(): void {
    document
      .getElementById('edit-panel')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}
