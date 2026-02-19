import { UserService } from './../services/user.service';
import { Component, inject } from '@angular/core';
import { Friendship } from '../interfaces/Friendship';
import { FriendshipService } from '../services/friendship.service';
import { UtilService } from '../services/util.service';
import { User } from '../interfaces/User';

@Component({
  selector: 'app-friend-activity',
  standalone: true,
  templateUrl: './friend-activity.component.html',
})
export class FriendActivityComponent {
  private friendshipService = inject(FriendshipService);
  private userService = inject(UserService);
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

    for (let friend of this.friends) {
      if (friend.id == Number(userId)) {
        this.friends.splice(this.friends.indexOf(friend), 1);
      }
    }
    console.log('________________' + this.friends);
  }
}
