import { UserService } from './../services/user.service';
import { Component, inject } from '@angular/core';
import { FriendshipService } from '../services/friendship.service';
import { UtilService } from '../services/util.service';
import { User } from '../interfaces/User';
import { UserProfileDataService } from '../services/user-profile-data.service';

@Component({
  selector: 'app-friend-activity',
  standalone: true,
  templateUrl: './friend-activity.component.html',
  imports: [],
})
export class FriendActivityComponent {
  private friendshipService = inject(FriendshipService);
  private userProfileDataService = inject(UserProfileDataService);

  utilService = inject(UtilService);

  friends: User[] = [];

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.friendshipService
        .loadFriendsAsUsersById(Number(userId))
        .subscribe((friends) => {
          this.friends = friends;
        });
    }
  }

  getAvatar(friend: User): string {
    return friend.avatarUrl && friend.avatarUrl.trim() !== ''
      ? friend.avatarUrl
      : this.utilService.getAvatarUrl(friend.username ?? 'U');
  }

  onAvatarError(event: Event, username: string) {
    (event.target as HTMLImageElement).src = this.utilService.getAvatarUrl(
      username ?? 'U',
    );
  }
}
