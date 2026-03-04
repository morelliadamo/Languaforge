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
import { LoadingOverlayComponent } from '../loading-overlay/loading-overlay.component';
import { InventoryComponent } from '../inventory/inventory.component';
import { SearchForFriends } from '../search-for-friends/search-for-friends';
import { UserService } from '../services/user.service';
import { forkJoin } from 'rxjs';

interface AchievementDisplay {
  icon: string;
  name: string;
  description: string;
  earnedAt: string | null;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    HeaderComponent,
    FooterComponent,
    NgClass,
    FormsModule,
    DatePipe,
    LoadingOverlayComponent,
    InventoryComponent,
    SearchForFriends,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  utilService = inject(UtilService);
  private authService = inject(AuthServiceService);
  private userProfileDataService = inject(UserProfileDataService);
  private friendshipService = inject(FriendshipService);
  private userService = inject(UserService);

  isLoading = true;
  isEditing = false;
  activeTab: 'achievements' | 'friends' = 'achievements';
  activeFriendsSubTab: 'list' | 'requests' = 'list';
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

  sentRequests: { friendshipId: number; userId: number; username: string }[] =
    [];
  receivedRequests: {
    friendshipId: number;
    userId: number;
    username: string;
  }[] = [];

  noFriendsMessage = '';
  noFriendsMessageList = [
    'Még nincsenek barátaid... Ez egy kicsit szomorú.',
    'Úgy tűnik, még nincsenek barátaid. Ideje új kapcsolatokat építeni!',
    'Üres belül, pont mint én...',
    'A barátok nélküli az élet olyan, mint egy vas nélküli kohó!',
  ];
  showSearchForFriendsModal: boolean = false;

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

      forkJoin({
        friends: this.friendshipService.loadFriendsAsUsersById(this.userId),
        pending: this.friendshipService.loadPendingFriendshipsByUserId(
          this.userId,
        ),
      }).subscribe(({ friends, pending }) => {
        // Build pending user ID set first
        const pendingUserIds = new Set<number>();
        const currentId = this.userId!;

        for (const f of pending) {
          if (f.user1Id === currentId) {
            const entry = {
              friendshipId: f.id,
              userId: f.user2Id,
              username: f.user2Name ?? '',
            };
            this.sentRequests.push(entry);
            pendingUserIds.add(f.user2Id);
            if (!entry.username) {
              this.userService.loadUsernameByUserId(f.user2Id).subscribe({
                next: (name) => (entry.username = name as unknown as string),
              });
            }
          } else {
            const entry = {
              friendshipId: f.id,
              userId: f.user1Id,
              username: f.user1Name ?? '',
            };
            this.receivedRequests.push(entry);
            pendingUserIds.add(f.user1Id);
            if (!entry.username) {
              this.userService.loadUsernameByUserId(f.user1Id).subscribe({
                next: (name) => (entry.username = name as unknown as string),
              });
            }
          }
        }

        // Filter out pending users from friends list
        this.friends = friends.filter((f) => !pendingUserIds.has(f.id!));
        this.profile.friendCount = this.friends.length;

        // Load avatars for accepted friends
        this.friends.forEach((friend, index) => {
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

      this.noFriendsMessage =
        this.noFriendsMessageList[
          Math.floor(Math.random() * this.noFriendsMessageList.length)
        ];

      //delay to show loading overlay
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
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

  setFriendsSubTab(tab: 'list' | 'requests') {
    this.activeFriendsSubTab = tab;
  }

  acceptRequest(req: {
    friendshipId: number;
    userId: number;
    username: string;
  }) {
    this.friendshipService
      .acceptFriendRequest(this.userId!, req.userId)
      .subscribe({
        next: () => {
          this.receivedRequests = this.receivedRequests.filter(
            (r) => r.friendshipId !== req.friendshipId,
          );
          this.friends.push({
            id: req.userId,
            username: req.username,
            email: '',
            roleId: 0,
            avatarUrl: null,
            bio: null,
          });
          this.profile.friendCount = this.friends.length;
        },
        error: (err) => console.error('Failed to accept', err),
      });
  }

  rejectRequest(req: {
    friendshipId: number;
    userId: number;
    username: string;
  }) {
    this.friendshipService
      .rejectFriendRequest(this.userId!, req.userId)
      .subscribe({
        next: () => {
          this.receivedRequests = this.receivedRequests.filter(
            (r) => r.friendshipId !== req.friendshipId,
          );
        },
        error: (err) => console.error('Failed to reject', err),
      });
  }

  cancelSentRequest(req: {
    friendshipId: number;
    userId: number;
    username: string;
  }) {
    this.friendshipService.removeFriend(this.userId!, req.userId).subscribe({
      next: () => {
        this.sentRequests = this.sentRequests.filter(
          (r) => r.friendshipId !== req.friendshipId,
        );
      },
      error: (err) => console.error('Failed to cancel request', err),
    });
  }

  removeFriend(friend: User) {
    this.friendshipService.removeFriend(this.userId!, friend.id!).subscribe({
      next: () => {
        this.friends = this.friends.filter((f) => f.id !== friend.id);
        this.profile.friendCount = this.friends.length;
      },
      error: (err) => console.error('Failed to remove friend', err),
    });
  }

  getFriendAvatar(friend: User): string {
    return friend.avatarUrl && friend.avatarUrl.trim() !== ''
      ? friend.avatarUrl
      : this.utilService.getAvatarUrl(friend.username || 'U');
  }

  onFriendAvatarError(event: Event, username: string) {
    (event.target as HTMLImageElement).src = this.utilService.getAvatarUrl(
      username || 'U',
    );
  }

  findFriends() {
    console.log('Barátok keresése');
    this.showSearchForFriendsModal = true;
  }
}
