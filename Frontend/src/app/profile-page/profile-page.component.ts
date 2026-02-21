import { UtilService } from './../services/util.service';
import { Component, inject, OnInit } from '@angular/core';
import { NgClass, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { User } from '../interfaces/User';
import { UserProfileDataService } from '../services/user-profile-data.service';
import { FriendshipService } from '../services/friendship.service';
import { AuthServiceService } from '../services/auth-service.service';

interface AchievementDisplay {
  icon: string;
  name: string;
  description: string;
  earnedAt: string | null;
}

@Component({
  selector: 'app-profile-page',
  imports: [HeaderComponent, FooterComponent, NgClass, FormsModule, DatePipe],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  utilService = inject(UtilService);
  private authService = inject(AuthServiceService);
  private userProfileDataService = inject(UserProfileDataService);
  private friendshipService = inject(FriendshipService);

  isEditing = false;
  activeTab: 'achievements' | 'friends' = 'achievements';
  isUploadingAvatar = false;
  avatarError: string | null = null;

  username = this.authService.getUserName();
  userId: number | null = this.authService.getCurrentUserId();

  editName = '';
  editEmail = '';
  editBio = '';

  profile = {
    name: this.username,
    bio: '',
    avatar: this.utilService.getAvatarUrl(this.username!),
    streak: 0,
    achievementCount: 0,
    friendCount: 0,
  };

  achievements: AchievementDisplay[] = [];
  friends: User[] = [];

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    if (this.userId) {
      this.userProfileDataService
        .getUserProfileData(this.userId)
        .subscribe((data) => {
          this.profile.streak = data.currentStreak;
          this.profile.achievementCount = data.achievementCount;
          this.profile.bio = data.bio ?? '';
          this.profile.name = data.username ?? this.username;

          if (data.avatarUrl && data.avatarUrl.trim() !== '') {
            this.profile.avatar = data.avatarUrl;
          } else {
            this.profile.avatar = this.utilService.getAvatarUrl(this.username!);
          }

          if (data.achievements?.length > 0) {
            this.achievements = data.achievements.map((a: any) => ({
              icon: a.iconUrl ?? '🏆',
              name: a.name,
              description: a.description,
              earnedAt: a.createdAt,
            }));
          }
        });

      this.friendshipService
        .loadFriendsAsUsersById(this.userId)
        .subscribe((friends) => {
          this.friends = friends;
          this.profile.friendCount = friends.length;

          friends.forEach((friend, index) => {
            this.userProfileDataService
              .getUserProfileData(friend.id!)
              .subscribe((data) => {
                this.friends[index] = {
                  ...this.friends[index],
                  avatarUrl: data.avatarUrl ?? undefined,
                };
              });
          });
        });
    }
  }

  toggleEdit() {
    this.editName = this.profile.name!;
    this.editBio = this.profile.bio;
    this.avatarError = null;
    this.isEditing = true;
  }

  cancelEdit() {
    this.avatarError = null;
    this.isEditing = false;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !this.userId) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.avatarError = 'Csak JPG, PNG, WEBP vagy GIF fájl tölthető fel.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.avatarError = 'A fájl mérete maximum 2MB lehet.';
      return;
    }

    this.avatarError = null;
    this.isUploadingAvatar = true;

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.avatar = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.userProfileDataService.uploadAvatar(this.userId!, file).subscribe({
      next: (res) => {
        if (res.avatarUrl && res.avatarUrl.trim() !== '') {
          this.profile.avatar = res.avatarUrl;
        }
        this.isUploadingAvatar = false;
      },
      error: (err) => {
        this.avatarError =
          err?.error?.error ?? 'A feltöltés sikertelen. Kérjük, próbáld újra.';
        this.isUploadingAvatar = false;
        this.profile.avatar = this.utilService.getAvatarUrl(this.username!);
      },
    });
  }

  saveChanges() {
    if (!this.userId) {
      return;
    }

    this.userProfileDataService
      .updateProfile(this.userId, {
        username: this.editName,
        bio: this.editBio,
      })
      .subscribe({
        next: () => {
          this.profile.name = this.editName;
          this.profile.bio = this.editBio;
          this.isEditing = false;
        },
        error: () => {
          this.profile.name = this.editName;
          this.profile.bio = this.editBio;
          this.isEditing = false;
        },
      });
  }

  setTab(tab: 'achievements' | 'friends') {
    this.activeTab = tab;
  }

  getFriendAvatar(friend: User): string {
    return friend.avatarUrl && friend.avatarUrl.trim() !== ''
      ? friend.avatarUrl
      : this.utilService.getAvatarUrl(friend.username ?? 'U');
  }

  onFriendAvatarError(event: Event, username: string) {
    (event.target as HTMLImageElement).src =
      this.utilService.getAvatarUrl(username ?? 'U');
  }
}
