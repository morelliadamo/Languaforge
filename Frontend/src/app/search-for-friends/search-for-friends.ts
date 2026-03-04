import { UserService } from './../services/user.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { User } from '../interfaces/User';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { FriendshipService } from '../services/friendship.service';
import { UserAsFriendSearchResultDTO } from '../interfaces/UserAsFriendSearchResultDTO';

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

  private userService = inject(UserService);
  private friendshipService = inject(FriendshipService);

  onSearch() {
    const query = this.searchQuery.trim();
    if (!query) return;

    this.isSearching = true;
    this.hasSearched = false;
    this.userService.findUsersByUsernameLike(query).subscribe({
      next: (users) => {
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
    this.sentRequests.add(userId);
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
