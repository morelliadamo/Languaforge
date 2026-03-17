import { AchievementService } from './../services/achievement.service';
import { CourseLoaderServiceService } from './../services/course-loader-service.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgClass, DatePipe, KeyValuePipe } from '@angular/common';
import {
  Achievement,
  AchievementOfUser,
  LoginData,
  Streak,
  UserXCourse,
} from '../interfaces/UserProfile';
import { AdminEditedByDTO } from '../interfaces/AdminEditedByDTO';
import { User } from '../interfaces/User';
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LessonProgress } from '../interfaces/LessonProgress';
import { LessonProgressService } from '../services/lesson-progress.service';
import { Course } from '../interfaces/Course';
import { forkJoin, timeout } from 'rxjs';
import { FriendshipService } from '../services/friendship.service';
import { Friendship } from '../interfaces/Friendship';
import { UserAsFriendSearchResultDTO } from '../interfaces/UserAsFriendSearchResultDTO';
import { InventoryComponent } from '../inventory/inventory.component';
import { UserXItemInventory } from '../interfaces/UserXItem';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-edit-user',
  imports: [NgClass, FormsModule, ReactiveFormsModule, DatePipe, KeyValuePipe],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {
  @Input() user!: LoginData;
  @Output() close = new EventEmitter<void>();

  private userService = inject(UserService);
  private courseLoaderService = inject(CourseLoaderServiceService);
  private lessonProgressService = inject(LessonProgressService);
  private achievementService = inject(AchievementService);
  private friendshipService = inject(FriendshipService);
  private storeService = inject(StoreService);

  activeTab: 'summary' | 'edit' | 'manage' = 'summary';

  username: string = '';
  email: string = '';
  bio: string = '';
  achievementsOfUser: AchievementOfUser[] | null = null;
  coursesOfUser: UserXCourse[] | null = null;
  lessonProgressesOfUser: LessonProgress[] | null = null;
  streakOFUser: Streak | null = null;
  reviewsOfUser: any | null = null;
  friendsOfUser: Friendship[] | null = null;
  friendsAsUsersOfUser: User[] | null = null;
  itemsOfUser: UserXItemInventory[] | null = null;

  heartCount: number = 0;
  hintCount: number = 0;
  freezeCount: number = 0;
  courseSlotCount: number = 0;

  saveButtonText: string = 'Adatok mentése';

  editedBy: AdminEditedByDTO | null = null;

  removedCourseIds: Set<number> = new Set();
  removedProgressIds: Set<number> = new Set();
  editedProgresses: Map<number, Partial<LessonProgress>> = new Map();

  allCourses: Course[] = [];
  showCourseDropdown: boolean = false;
  savingCourses: boolean = false;

  unearnedAchievements: Achievement[] = [];
  showAchievementDropdown: boolean = false;

  lessonCourseMap: Map<number, { courseTitle: string; lessonTitle: string }> =
    new Map();
  progressesByCourse: Map<string, LessonProgress[]> = new Map();

  setTab(tab: 'summary' | 'edit' | 'manage') {
    this.activeTab = tab;
  }

  onBackdropClick() {
    this.close.emit();
  }

  onAvatarError(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(this.user.user.username) +
      '&background=e0f2fe&color=0284c7&size=128';
  }

  ngOnInit() {
    this.userService.getUserById(this.user.user.id).subscribe({
      next: (user) => {
        this.username = user.username;
        this.email = user.email;
        this.bio = user.bio || '';
        this.achievementsOfUser = user.achievementsOfUser || null;
        this.coursesOfUser = user.userXCourses || null;
        this.streakOFUser = user.streak || null;
        this.reviewsOfUser = user.reviews;
        this.buildLessonCourseMap();
        this.groupProgressesByCourse();
        this.getFriendsOfUser();
        this.getUserItems();
      },
      error: (err) => {
        console.error('Error loading user details:', err);
      },
    });

    this.courseLoaderService
      .getLessonProgressesByUserId(this.user.user.id)
      .subscribe({
        next: (progresses) => {
          this.lessonProgressesOfUser = progresses;
          this.groupProgressesByCourse();
        },
        error: (err) => {
          console.error('Error loading lesson progresses:', err);
        },
      });
  }

  buildLessonCourseMap() {
    this.lessonCourseMap.clear();
    if (!this.coursesOfUser) return;
    for (const uxc of this.coursesOfUser) {
      const courseTitle = uxc.course.title;
      const units = uxc.course.units;
      if (!units) continue;
      for (const unit of units) {
        if (!unit.lessons) continue;
        for (const lesson of unit.lessons) {
          this.lessonCourseMap.set(lesson.id, {
            courseTitle,
            lessonTitle: lesson.title,
          });
        }
      }
    }
  }

  groupProgressesByCourse() {
    this.progressesByCourse.clear();
    if (!this.lessonProgressesOfUser) return;
    for (const progress of this.lessonProgressesOfUser) {
      const info = this.lessonCourseMap.get(progress.lessonId);
      const groupKey = info?.courseTitle ?? 'Ismeretlen kurzus';
      if (!this.progressesByCourse.has(groupKey)) {
        this.progressesByCourse.set(groupKey, []);
      }
      this.progressesByCourse.get(groupKey)!.push(progress);
    }
  }

  getLessonTitle(progress: LessonProgress): string {
    return (
      this.lessonCourseMap.get(progress.lessonId)?.lessonTitle ??
      progress.lesson?.title ??
      'Lecke #' + progress.lessonId
    );
  }

  getCourseForProgress(progress: LessonProgress): string {
    return (
      this.lessonCourseMap.get(progress.lessonId)?.courseTitle ??
      'Ismeretlen kurzus'
    );
  }

  editingProgressId: number | null = null;
  editExerciseCount: number = 0;
  editCompletedExercises: number = 0;
  editLessonCompleted: boolean = false;

  saveChanges() {
    this.saveButtonText = 'Mentés...';

    const updatedData: Partial<User> = {
      username: this.username,
      email: this.email,
      bio: this.bio,
      roleId: this.user.user.roleId,
    };
    this.userService.updateUser(this.user.user.id, updatedData).subscribe({
      next: (updatedUser) => {
        this.user.user.username = updatedUser.username;
        this.user.user.email = updatedUser.email;
        this.user.user.bio = updatedUser.bio;
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
    setTimeout(() => {
      this.saveButtonText = 'Adatok mentése';
    }, 500);
  }

  saveCourseChanges() {
    const operations: any[] = [];

    for (const courseId of this.removedCourseIds) {
      operations.push(this.courseLoaderService.deleteUserXCourse(courseId));
    }

    for (const progressId of this.removedProgressIds) {
      operations.push(
        this.lessonProgressService.deleteLessonProgress(progressId),
      );
    }

    for (const [progressId, changes] of this.editedProgresses) {
      operations.push(
        this.lessonProgressService.updateLessonProgress(
          progressId,
          changes.completedExercises!,
        ),
      );
    }

    if (operations.length === 0) {
      return;
    }

    this.savingCourses = true;
    forkJoin(operations).subscribe({
      next: () => {
        this.removedCourseIds.clear();
        this.removedProgressIds.clear();
        this.editedProgresses.clear();
        this.savingCourses = false;
      },
      error: (err) => {
        console.error('Error saving course changes:', err);
        this.savingCourses = false;
      },
    });
  }

  removeCourse(courseId: number) {
    if (this.coursesOfUser) {
      this.removedCourseIds.add(courseId);
      this.coursesOfUser = this.coursesOfUser.filter((c) => c.id !== courseId);
    }
  }

  removeProgress(progressId: number) {
    if (this.lessonProgressesOfUser) {
      this.removedProgressIds.add(progressId);
      this.lessonProgressesOfUser = this.lessonProgressesOfUser.filter(
        (p) => p.id !== progressId,
      );
      this.groupProgressesByCourse();
    }
  }

  removeAchievement(userXAchievementId: number) {
    this.achievementService
      .hardDeleteUserXAchievement(userXAchievementId)
      .subscribe({
        next: () => {
          if (this.achievementsOfUser) {
            this.achievementsOfUser = this.achievementsOfUser.filter(
              (a) => a.id !== userXAchievementId,
            );
          }
        },
        error: (err) => {
          console.error('Error removing achievement:', err);
        },
      });
  }

  startEditProgress(progress: LessonProgress) {
    this.editingProgressId = progress.id;
    this.editExerciseCount = progress.exerciseCount;
    this.editCompletedExercises = progress.completedExercises;
    this.editLessonCompleted = progress.lessonCompleted;
  }

  cancelEditProgress() {
    this.editingProgressId = null;
  }

  saveEditProgress(progress: LessonProgress) {
    progress.exerciseCount = this.editExerciseCount;
    progress.completedExercises = this.editCompletedExercises;
    progress.lessonCompleted = this.editLessonCompleted;
    this.editedProgresses.set(progress.id, {
      completedExercises: this.editCompletedExercises,
    });
    this.editingProgressId = null;
  }

  toggleLessonCompleted(progress: LessonProgress) {
    progress.lessonCompleted = !progress.lessonCompleted;
    if (progress.lessonCompleted) {
      progress.completedExercises = progress.exerciseCount;
      progress.completedAt = new Date().toISOString();
    } else {
      progress.completedAt = null;
    }
    this.editedProgresses.set(progress.id, {
      completedExercises: progress.completedExercises,
    });
  }

  toggleCourseDropdown() {
    this.showCourseDropdown = !this.showCourseDropdown;
    if (this.showCourseDropdown && this.allCourses.length === 0) {
      this.courseLoaderService.loadAllCourses().subscribe({
        next: (courses) => {
          this.allCourses = courses;
        },
        error: (err) => {
          console.error('Error loading courses:', err);
        },
      });
    }
  }

  toggleAchievementDropdown() {
    this.showAchievementDropdown = !this.showAchievementDropdown;
    if (this.showAchievementDropdown) {
      this.achievementService
        .loadUnearnedAchievements(this.user.user.id)
        .subscribe({
          next: (achievements) => {
            this.unearnedAchievements = achievements;
          },
          error: (err) => {
            console.error('Error loading unearned achievements:', err);
          },
        });
    }
  }

  addAchievementToUser(achievement: Achievement) {
    this.achievementService
      .createUserXAchievement(this.user.user.id, achievement.id)
      .subscribe({
        next: (newUxa: AchievementOfUser) => {
          if (!this.achievementsOfUser) {
            this.achievementsOfUser = [];
          }
          this.achievementsOfUser.push(newUxa);
          this.unearnedAchievements = this.unearnedAchievements.filter(
            (a) => a.id !== achievement.id,
          );
          this.showAchievementDropdown = false;
        },
        error: (err) => {
          console.error('Error adding achievement to user:', err);
        },
      });
  }

  getAvailableCourses(): Course[] {
    const enrolledCourseIds = new Set(
      this.coursesOfUser?.map((uxc) => uxc.course.id) ?? [],
    );
    return this.allCourses.filter((c) => !enrolledCourseIds.has(c.id));
  }

  addCourseToUser(course: Course) {
    this.courseLoaderService
      .createUserXCourseForUser(course.id, this.user.user.id)
      .subscribe({
        next: (newUxc: any) => {
          if (!this.coursesOfUser) {
            this.coursesOfUser = [];
          }
          this.coursesOfUser.push(newUxc);
          this.buildLessonCourseMap();
          this.showCourseDropdown = false;
        },
        error: (err) => {
          console.error('Error adding course to user:', err);
        },
      });
  }

  getFriendsOfUser() {
    this.friendshipService
      .loadFriendshipsByUserId(this.user.user.id)
      .subscribe({
        next: (friendships) => {
          console.log('Friendships loaded:', friendships);
          this.friendsOfUser = friendships;
          this.getFriendsAsUsersOfUserById();
        },

        error: (err) => {
          console.error('Error loading friendships:', err);
        },
      });
  }

  getFriendsAsUsersOfUserById() {
    if (!this.friendsOfUser) return;
    const friendIds: number[] = this.friendsOfUser.map((f) =>
      f.user1Id === this.user.user.id ? f.user2Id : f.user1Id,
    );

    this.userService.getUsersByIds(friendIds).subscribe({
      next: (users) => {
        console.log(users);

        this.friendsAsUsersOfUser = users;
      },
      error: (err) => {
        console.error('Error loading friend user details:', err);
      },
    });
  }

  showFriendSearch: boolean = false;
  friendSearchQuery: string = '';
  friendSearchResults: UserAsFriendSearchResultDTO[] = [];
  friendSearching: boolean = false;

  toggleFriendSearch() {
    this.showFriendSearch = !this.showFriendSearch;
    if (!this.showFriendSearch) {
      this.friendSearchQuery = '';
      this.friendSearchResults = [];
    }
  }

  searchFriends() {
    const query = this.friendSearchQuery.trim();
    if (!query) return;

    this.friendSearching = true;
    this.userService.findUsersByUsernameLike(query).subscribe({
      next: (users) => {
        this.friendSearchResults = users.filter(
          (u) => u.id !== this.user.user.id,
        );
        this.friendSearching = false;
      },
      error: (err) => {
        console.error('Error searching users:', err);
        this.friendSearching = false;
      },
    });
  }

  isAlreadyFriend(userId: number): boolean {
    return !!this.friendsOfUser?.some(
      (f) => f.user1Id === userId || f.user2Id === userId,
    );
  }

  addFriend(targetUserId: number) {
    this.friendshipService
      .sendFriendRequest(this.user.user.id, targetUserId)
      .subscribe({
        next: () => {
          this.getFriendsOfUser();
          this.showFriendSearch = false;
          this.friendSearchQuery = '';
          this.friendSearchResults = [];
        },
        error: (err) => {
          console.error('Error sending friend request:', err);
        },
      });
  }

  removeFriendship(friendship: Friendship) {
    this.friendshipService
      .removeFriend(friendship.user1Id, friendship.user2Id)
      .subscribe({
        next: () => {
          this.friendsOfUser =
            this.friendsOfUser?.filter((f) => f.id !== friendship.id) ?? null;
          this.friendsAsUsersOfUser =
            this.friendsAsUsersOfUser?.filter(
              (u) => u.id !== friendship.user1Id && u.id !== friendship.user2Id,
            ) ?? null;
        },
        error: (err) => {
          console.error('Error removing friendship:', err);
        },
      });
  }

  changeFriendshipStatus(
    friendship: Friendship,
    newStatus: 'accepted' | 'rejected',
  ) {
    const obs =
      newStatus === 'accepted'
        ? this.friendshipService.acceptFriendRequest(
            friendship.user2Id,
            friendship.user1Id,
          )
        : this.friendshipService.rejectFriendRequest(
            friendship.user2Id,
            friendship.user1Id,
          );

    obs.subscribe({
      next: () => {
        friendship.status = newStatus;
      },
      error: (err) => {
        console.error('Error changing friendship status:', err);
      },
    });
  }

  getFriendName(friendship: Friendship): string {
    const otherUserId =
      friendship.user1Id === this.user.user.id
        ? friendship.user2Id
        : friendship.user1Id;
    const friendUser = this.friendsAsUsersOfUser?.find(
      (u) => u.id === otherUserId,
    );
    if (friendUser) return friendUser.username;
    if (friendship.user1Id === this.user.user.id) {
      return friendship.user2Name ?? `#${otherUserId}`;
    }
    return friendship.user1Name ?? `#${otherUserId}`;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Elfogadva';
      case 'pending':
        return 'Függőben';
      case 'rejected':
        return 'Elutasítva';
      default:
        return status;
    }
  }

  getUserItems() {
    this.storeService.getUserItems(this.user.user.id).subscribe({
      next: (items) => {
        this.itemsOfUser = items.map((i) => ({
          id: i.id,
          itemId: i.itemId,
          userId: i.userId,
          amount: this.getItemAmount(i.storeItem.type),
          emoji: this.getItemEmoji(i.storeItem.type),
          label: this.getItemLabel(i.storeItem.type),
        }));
        this.computeItemCounts();
      },
      error: (err) => {
        console.error('Error loading user items:', err);
      },
    });
  }

  computeItemCounts() {
    this.heartCount = 0;
    this.hintCount = 0;
    this.freezeCount = 0;
    this.courseSlotCount = 0;
    if (!this.itemsOfUser) return;
    for (const item of this.itemsOfUser) {
      switch (item.label) {
        case 'Szív':
          this.heartCount += item.amount;
          break;
        case 'Tipp':
          this.hintCount += item.amount;
          break;
        case 'Fagyasztás':
          this.freezeCount += item.amount;
          break;
        case 'Kurzushely':
          this.courseSlotCount += item.amount;
          break;
      }
    }
  }

  incrementItem(category: 'heart' | 'hint' | 'freeze' | 'courseSlot') {
    switch (category) {
      case 'heart':
        this.heartCount += 5;
        this.storeService
          .incrementUserItem(this.user.user.id, 'hearts', 1)
          .subscribe();
        break;
      case 'hint':
        this.hintCount += 5;
        this.storeService
          .incrementUserItem(this.user.user.id, 'hints', 1)
          .subscribe();
        break;
      case 'freeze':
        this.freezeCount++;
        this.storeService
          .incrementUserItem(this.user.user.id, 'freezes', 1)
          .subscribe();
        break;
      case 'courseSlot':
        this.courseSlotCount++;
        this.storeService
          .incrementUserItem(this.user.user.id, 'course_slots', 1)
          .subscribe();
        break;
    }
  }

  decrementItem(category: 'heart' | 'hint' | 'freeze' | 'courseSlot') {
    switch (category) {
      case 'heart':
        if (this.heartCount > 0) this.heartCount -= 5;
        this.storeService
          .decrementUserItem(this.user.user.id, 'hearts', 1)
          .subscribe();
        break;
      case 'hint':
        if (this.hintCount > 0) this.hintCount -= 5;
        this.storeService
          .decrementUserItem(this.user.user.id, 'hints', 1)
          .subscribe();
        break;
      case 'freeze':
        if (this.freezeCount > 0) this.freezeCount--;
        this.storeService
          .decrementUserItem(this.user.user.id, 'freezes', 1)
          .subscribe();
        break;
      case 'courseSlot':
        if (this.courseSlotCount > 0) this.courseSlotCount--;
        this.storeService
          .decrementUserItem(this.user.user.id, 'course_slots', 1)
          .subscribe();

        break;
    }
  }

  getItemEmoji(type: string): string {
    const map: Record<string, string> = {
      hearts5: '❤️',
      hearts10: '❤️',
      hearts25: '❤️',
      hints5: '💡',
      hints10: '💡',
      hints25: '💡',
      freeze: '🧊',
      course_slot: '📦',
    };
    return map[type] || '';
  }

  getItemLabel(type: string): string {
    const map: Record<string, string> = {
      hearts5: 'Szív',
      hearts10: 'Szív',
      hearts25: 'Szív',
      hints5: 'Tipp',
      hints10: 'Tipp',
      hints25: 'Tipp',
      freeze: 'Fagyasztás',
      course_slot: 'Kurzushely',
    };
    return map[type] || '';
  }

  getItemAmount(type: string): number {
    const map: Record<string, number> = {
      hearts5: 5,
      hearts10: 10,
      hearts25: 25,
      hints5: 5,
      hints10: 10,
      hints25: 25,
      freeze: 1,
      course_slot: 1,
    };
    return map[type] || 0;
  }
}
