import { UserService } from './../services/user.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { User } from '../interfaces/User';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FriendshipService } from '../services/friendship.service';
import { UserAsFriendSearchResultDTO } from '../interfaces/UserAsFriendSearchResultDTO';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-search-for-friends',
  imports: [FormsModule, NgClass],
  templateUrl: './search-for-friends.html',
  styleUrl: './search-for-friends.css',
})
export class SearchForFriends {
  @Output() close = new EventEmitter<void>();

  searchQuery: string = '';
  searchResults: UserAsFriendSearchResultDTO[] = [];
  isSearching = false;
  hasSearched = false;
  sentRequests = new Set<number>();
  acceptedRequests = new Set<number>();
  private authService = inject(AuthServiceService);
  private userService = inject(UserService);
  private friendshipService = inject(FriendshipService);

  private currentUserId = this.authService.getCurrentUserId();
  friendsOfCurrentUser: User[] = [];
  private friendIdsOfCurrentUser: number[] = [];
  sentFriendRequests: User[] = [];
  private sentFriendRequestIds: number[] = [];
  receivedFriendRequests: User[] = [];
  private receivedFriendRequestIds: number[] = [];

  ngOnInit() {
    this.friendshipService
      .loadAcceptedFriendshipsByUserId(this.currentUserId!)
      .subscribe({
        next: (friendships) => {
          console.log(friendships);
          const currentUserId = this.currentUserId!;
          for (const friendship of friendships) {
            if (friendship.user1Id === currentUserId) {
              console.log(friendship.user1Id);
              this.friendIdsOfCurrentUser.push(Number(friendship.user2Id));
            } else {
              console.log(friendship.user2Id);
              this.friendIdsOfCurrentUser.push(Number(friendship.user1Id));
            }
          }
          console.log(this.friendIdsOfCurrentUser);
        },
        error: (err) => {
          console.error(err);
        },
      });

    this.friendshipService
      .loadPendingFriendshipsByUserId(this.currentUserId!)
      .subscribe({
        next: (friendships) => {
          console.log(friendships);
          const currentUserId = this.currentUserId!;
          for (const friendship of friendships) {
            if (friendship.user1Id === currentUserId) {
              console.log(friendship.user1Id);
              this.sentFriendRequestIds.push(Number(friendship.user2Id));
            } else {
              console.log(friendship.user2Id);
              this.receivedFriendRequestIds.push(Number(friendship.user1Id));
            }
          }
          console.log(
            'sent:' + this.sentFriendRequestIds,
            'received:' + this.receivedFriendRequestIds,
          );
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.isSearching = true;
    this.hasSearched = false;
    this.userService.findUsersByUsernameLike(query).subscribe({
      next: (users) => {
        for (const user of users) {
          if (user.id === this.currentUserId) {
            users = users.filter((u) => u.id !== user.id);
          }
          if (this.friendIdsOfCurrentUser.includes(user.id!)) {
            user.isAlreadyFriend = true;
          }
          if (this.sentFriendRequestIds.includes(user.id!)) {
            user.isRequestSentToThem = true;
          }
          if (this.receivedFriendRequestIds.includes(user.id!)) {
            user.isRequestReceivedFromThem = true;
          }
        }
        this.searchResults = users;
        this.isSearching = false;
        this.hasSearched = true;
      },
      error: () => {
        this.searchResults = [];
        this.isSearching = false;
        this.hasSearched = true;
      },
    });
  }

  onBackdropClick() {
    this.close.emit();
  }

  sendFriendRequest(userId: number) {
    this.friendshipService
      .sendFriendRequest(this.currentUserId!, userId)
      .subscribe({
        next: () => {
          this.sentRequests.add(userId);
        },
        error: (err) => {
          console.error('Failed to send friend request', err);
        },
      });
  }

  acceptFriendRequest(userId: number) {
    this.friendshipService
      .acceptFriendRequest(this.currentUserId!, userId)
      .subscribe({
        next: () => {
          this.acceptedRequests.add(userId);
        },
        error: (err) => {
          console.error('Failed to accept friend request', err);
        },
      });
  }

  isRequestSent(userId: number): boolean {
    return this.sentRequests.has(userId);
  }

  getAvatar(user: UserAsFriendSearchResultDTO): string {
    return (
      user.avatarUrl ||
      'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(user.username) +
        '&background=0ea5e9&color=fff'
    );
  }
}
