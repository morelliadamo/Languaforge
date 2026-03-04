import { Injectable } from '@angular/core';
import { Friendship } from '../interfaces/Friendship';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:8080/friendships';

  loadFriendshipsByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Friendship[]>(`${this.apiUrl}/user/${userId}`, {
      headers,
    });
  }

  loadAcceptedFriendshipsByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Friendship[]>(
      `${this.apiUrl}/user/${userId}/accepted`,
      {
        headers,
      },
    );
  }

  loadPendingFriendshipsByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Friendship[]>(
      `${this.apiUrl}/user/${userId}/pending`,
      {
        headers,
      },
    );
  }

  loadRejectedFriendshipsByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Friendship[]>(
      `${this.apiUrl}/user/${userId}/rejected`,
      {
        headers,
      },
    );
  }

  loadFriendsAsUsersById(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User[]>(
      `${this.apiUrl}/user/${userId}/friendsAsUsers`,
      {
        headers,
      },
    );
  }

  sendFriendRequest(fromUserId: number, toUserId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(
      `${this.apiUrl}/sendRequest?user1Id=${fromUserId}&user2Id=${toUserId}`,
      { user1Id: fromUserId, user2Id: toUserId },
      { headers },
    );
  }

  acceptFriendRequest(currentUserId: number, fromUserId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch(
      `${this.apiUrl}/accept?user1Id=${fromUserId}&user2Id=${currentUserId}`,
      null,
      { headers },
    );
  }

  rejectFriendRequest(currentUserId: number, fromUserId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch(
      `${this.apiUrl}/reject?user1Id=${fromUserId}&user2Id=${currentUserId}`,
      null,
      { headers },
    );
  }

  removeFriend(currentUserId: number, friendUserId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    try {
      return this.http.delete(
        `${this.apiUrl}/remove?user1Id=${currentUserId}&user2Id=${friendUserId}`,
        { headers },
      );
    } catch (error) {
      return this.http.delete(
        `${this.apiUrl}/remove?user1Id=${friendUserId}&user2Id=${currentUserId}`,
        { headers },
      );
    }
  }
}
