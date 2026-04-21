import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AchievementService } from '../services/achievement.service';
import { Achievement } from '../interfaces/Achievement';
import { Course } from '../interfaces/Course';
import { CourseLoaderServiceService } from '../services/course-loader-service.service';
import { StoreItem } from '../interfaces/StoreItem';
import { StoreService } from '../services/store.service';

type EntityType =
  | 'course'
  | 'unit'
  | 'lesson'
  | 'exercise'
  | 'achievement'
  | 'item';

type EntityStatus = 'draft' | 'published' | 'archived';

interface DataEntity {
  id: number;
  name: string;
  type: EntityType;
  parent: string;
  status: EntityStatus;
  updatedAt: string;
  description: string;
}

@Component({
  selector: 'app-admin-data-management',
  imports: [FormsModule],
  templateUrl: './admin-data-management.html',
  styleUrl: './admin-data-management.css',
})
export class AdminDataManagement implements OnInit {
  @Output() close = new EventEmitter<void>();

  private achievementService = inject(AchievementService);
  private courseService = inject(CourseLoaderServiceService);
  private storeService = inject(StoreService);
  allAchievements: Achievement[] = [];
  allCourses: Course[] = [];
  allStoreItems: StoreItem[] = [];

  entityTypes: { value: EntityType; label: string }[] = [
    { value: 'course', label: 'Kurzusok' },
    { value: 'unit', label: 'Egységek' },
    { value: 'lesson', label: 'Leckék' },
    { value: 'exercise', label: 'Feladatok' },
    { value: 'achievement', label: 'Teljesítmények' },
    { value: 'item', label: 'Tárgyak' },
  ];

  allEntities: DataEntity[] = [];

  searchResults: DataEntity[] = [];
  selectedEntity: DataEntity | null = null;

  selectedType: EntityType = 'course';
  searchField: 'name' | 'id' | 'parent' = 'name';
  searchQuery: string = '';
  filterStatus: 'all' | EntityStatus = 'all';
  sortField: 'name' | 'updatedAt' | 'status' = 'updatedAt';
  sortDirection: 'asc' | 'desc' = 'desc';

  editorMode: 'create' | 'edit' = 'create';
  formName: string = '';
  formType: EntityType = 'course';
  formParent: string = '';
  formStatus: EntityStatus = 'draft';
  formDescription: string = '';

  ngOnInit() {
    this.achievementService.getAllAchievements().subscribe((data) => {
      this.allAchievements = data;
      this.rebuildEntitiesFromFetchedData();
    });

    this.courseService.getAllCourses().subscribe((data) => {
      this.allCourses = data;
      this.rebuildEntitiesFromFetchedData();
    });

    this.storeService.getStoreItems().subscribe((data) => {
      this.allStoreItems = data;
      this.rebuildEntitiesFromFetchedData();
    });
  }

  search(): void {
    let results = this.allEntities.filter(
      (entity) => entity.type === this.selectedType,
    );

    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      results = results.filter((entity) => {
        if (this.searchField === 'name') {
          return entity.name.toLowerCase().includes(query);
        }
        if (this.searchField === 'id') {
          return String(entity.id).includes(query);
        }
        return entity.parent.toLowerCase().includes(query);
      });
    }

    if (this.filterStatus !== 'all') {
      results = results.filter((entity) => entity.status === this.filterStatus);
    }

    this.searchResults = this.applySort(results);
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.search();
  }

  openCreateForm(): void {
    this.editorMode = 'create';
    this.selectedEntity = null;
    this.formName = '';
    this.formType = this.selectedType;
    this.formParent = '';
    this.formStatus = 'draft';
    this.formDescription = '';
  }

  openEditForm(entity: DataEntity): void {
    this.editorMode = 'edit';
    this.selectedEntity = entity;
    this.formName = entity.name;
    this.formType = entity.type;
    this.formParent = entity.parent === '-' ? '' : entity.parent;
    this.formStatus = entity.status;
    this.formDescription = entity.description;
  }

  savePlaceholder(): void {
    const normalizedParent = this.formParent.trim() || '-';

    if (this.editorMode === 'create') {
      const nextId =
        this.allEntities.reduce(
          (max, current) => Math.max(max, current.id),
          0,
        ) + 1;
      this.allEntities.unshift({
        id: nextId,
        name: this.formName.trim() || 'Új elem (helyőrző)',
        type: this.formType,
        parent: normalizedParent,
        status: this.formStatus,
        updatedAt: new Date().toISOString().slice(0, 10),
        description: this.formDescription.trim() || 'Leírás helyőrző.',
      });
    } else if (this.selectedEntity) {
      this.selectedEntity.name =
        this.formName.trim() || this.selectedEntity.name;
      this.selectedEntity.type = this.formType;
      this.selectedEntity.parent = normalizedParent;
      this.selectedEntity.status = this.formStatus;
      this.selectedEntity.description =
        this.formDescription.trim() || this.selectedEntity.description;
      this.selectedEntity.updatedAt = new Date().toISOString().slice(0, 10);
    }

    this.search();
  }

  getStatusLabel(status: EntityStatus): string {
    if (status === 'published') return 'Publikált';
    if (status === 'draft') return 'Vázlat';
    return 'Archivált';
  }

  getStatusClasses(status: EntityStatus): string {
    if (status === 'published') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (status === 'draft') {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-gray-100 text-gray-600 border-gray-300';
  }

  getTypeLabel(type: EntityType): string {
    const match = this.entityTypes.find(
      (entityType) => entityType.value === type,
    );
    return match ? match.label : type;
  }

  private rebuildEntitiesFromFetchedData(): void {
    this.allEntities = [
      ...this.mapCoursesToEntities(this.allCourses),
      ...this.mapAchievementsToEntities(this.allAchievements),
      ...this.mapStoreItemsToEntities(this.allStoreItems),
    ];

    this.search();
  }

  private mapCoursesToEntities(courses: Course[]): DataEntity[] {
    const mapped: DataEntity[] = [];

    for (const course of courses ?? []) {
      const courseName = course.title || `Kurzus #${course.id}`;
      const courseStatus = this.resolveEntityStatus(course.isDeleted);

      mapped.push({
        id: course.id,
        name: courseName,
        type: 'course',
        parent: '-',
        status: courseStatus,
        updatedAt: this.normalizeDate(course.deletedAt ?? course.createdAt),
        description: course.description || 'Nincs leírás.',
      });

      for (const unit of course.units ?? []) {
        const unitName = unit.title || `Egység #${unit.id}`;
        const unitStatus = this.resolveEntityStatus(unit.isDeleted);

        mapped.push({
          id: unit.id,
          name: unitName,
          type: 'unit',
          parent: courseName,
          status: unitStatus,
          updatedAt: this.normalizeDate(unit.deletedAt ?? unit.createdAt),
          description: `${courseName} kurzus egysége.`,
        });

        for (const lesson of unit.lessons ?? []) {
          const lessonName = lesson.title || `Lecke #${lesson.id}`;
          const lessonStatus = this.resolveEntityStatus(lesson.isDeleted);

          mapped.push({
            id: lesson.id,
            name: lessonName,
            type: 'lesson',
            parent: unitName,
            status: lessonStatus,
            updatedAt: this.normalizeDate(lesson.deletedAt ?? lesson.createdAt),
            description: `Lecke típusa: ${lesson.type || 'nincs megadva'}`,
          });

          for (const exercise of lesson.exercises ?? []) {
            const exerciseStatus = this.resolveEntityStatus(exercise.isDeleted);
            const exerciseDescription =
              exercise.exerciseContent?.description || 'Nincs feladatleírás.';

            mapped.push({
              id: exercise.id,
              name: this.buildExerciseName(exercise.id, exercise.exerciseType),
              type: 'exercise',
              parent: lessonName,
              status: exerciseStatus,
              updatedAt: this.normalizeDate(
                exercise.deletedAt ?? exercise.createdAt,
              ),
              description: exerciseDescription,
            });
          }
        }
      }
    }

    return mapped;
  }

  private mapAchievementsToEntities(achievements: Achievement[]): DataEntity[] {
    return (achievements ?? []).map((achievement) => ({
      id: achievement.id,
      name: achievement.name,
      type: 'achievement',
      parent: '-',
      status: this.resolveEntityStatus(achievement.isDeleted),
      updatedAt: this.normalizeDate(
        achievement.deletedAt ?? achievement.createdAt,
      ),
      description: achievement.description || 'Nincs leírás.',
    }));
  }

  private mapStoreItemsToEntities(items: StoreItem[]): DataEntity[] {
    return (items ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      type: 'item',
      parent: '-',
      status: 'published',
      updatedAt: '-',
      description: `${item.description || 'Nincs leírás.'} (Típus: ${item.type}, Ár: ${item.price})`,
    }));
  }

  private buildExerciseName(id: number, exerciseType: string): string {
    const readableType = (exerciseType || 'feladat').replace(/_/g, ' ').trim();
    return `Feladat #${id} (${readableType})`;
  }

  private resolveEntityStatus(isDeleted: boolean): EntityStatus {
    return isDeleted ? 'archived' : 'published';
  }

  private normalizeDate(dateValue: string | null | undefined): string {
    if (!dateValue) return '-';
    return dateValue.length >= 10 ? dateValue.slice(0, 10) : dateValue;
  }

  private applySort(data: DataEntity[]): DataEntity[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return [...data].sort((a, b) => {
      const valueA =
        this.sortField === 'name'
          ? a.name
          : this.sortField === 'updatedAt'
            ? a.updatedAt
            : a.status;
      const valueB =
        this.sortField === 'name'
          ? b.name
          : this.sortField === 'updatedAt'
            ? b.updatedAt
            : b.status;

      return valueA < valueB ? -1 * dir : valueA > valueB ? 1 * dir : 0;
    });
  }
}
