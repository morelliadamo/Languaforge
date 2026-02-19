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
}
