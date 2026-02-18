import { UserService } from './../services/user.service';
import { Component, inject } from '@angular/core';
import { Friendship } from '../interfaces/Friendship';
import { FriendshipService } from '../services/friendship.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-friend-activity',
  standalone: true,
  templateUrl: './friend-activity.component.html',
})
export class FriendActivityComponent {
  private friendshipService = inject(FriendshipService);
  private userService = inject(UserService);
  utilService = inject(UtilService);

  friends: Friendship[] = [];

  ngOnInit() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      console.log(userId);

      this.friendshipService.loadFriendshipsByUserId(Number(userId)).subscribe({
        next: (friends) => {
          this.friends = friends;
          console.log('Loaded friendships:', this.friends);

          for (const friend of this.friends) {
            this.loadFriendName(friend.user1_id);
            this.loadFriendName(friend.user2_id);
          }

          console.log('adsasd' + this.friends);
        },

        error: (err) => {
          console.error('Error loading friendships', err);
        },
      });
    }
  }

  private loadFriendName(friendId: number) {
    this.userService.loadUsernameByUserId(friendId).subscribe({
      next: (response) => {
        console.log('Username response:', response);
      },
      error: (err) => {
        console.error('Error loading username', err);
      },
    });
  }
}
