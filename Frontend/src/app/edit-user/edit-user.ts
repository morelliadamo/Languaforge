import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import {
  AchievementOfUser,
  LoginData,
  Streak,
  UserXCourse,
} from '../interfaces/UserProfile';
import { AdminEditedByDTO } from '../interfaces/AdminEditedByDTO';
import { User } from '../interfaces/User';
import { UserService } from '../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  imports: [NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {
  @Input() user!: LoginData;
  @Output() close = new EventEmitter<void>();

  private userService = inject(UserService);

  activeTab: 'summary' | 'edit' | 'manage' = 'summary';

  username: string = '';
  email: string = '';
  bio: string = '';
  achievementsOfUser: AchievementOfUser[] | null | undefined = null;
  coursesOfUser: UserXCourse[] | null = null;
  streakOFUser: Streak | null = null;
  reviewsOfUser: any | null = null;

  editedBy: AdminEditedByDTO | null = null;

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
        this.achievementsOfUser = user.achievementsOfUser || null || undefined;
        this.coursesOfUser = user.userXCourses || null;
        this.streakOFUser = user.streak || null;
        this.reviewsOfUser = user.reviews;
      },
      error: (err) => {
        console.error('Error loading user details:', err);
      },
    });
  }

  saveChanges() {
    const updatedData: Partial<User> = {
      username: this.username,
      email: this.email,
      bio: this.bio,
    };
    this.userService.updateUser(this.user.user.id, updatedData).subscribe({
      next: (updatedUser) => {
        this.user.user.username = updatedUser.username;
        this.user.user.email = updatedUser.email;
        this.user.user.bio = updatedUser.bio;
        this.setTab('summary');
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
  }
}
