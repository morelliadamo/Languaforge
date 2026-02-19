import { UserService } from './../services/user.service';
import { Component, inject } from '@angular/core';
import { FriendshipService } from '../services/friendship.service';
import { UtilService } from '../services/util.service';
import { User } from '../interfaces/User';

@Component({
  selector: 'app-friend-activity',
  standalone: true,
  templateUrl: './friend-activity.component.html',
  imports: [],
})
export class FriendActivityComponent {
  private friendshipService = inject(FriendshipService);

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
}
