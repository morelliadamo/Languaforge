import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friendship } from '../interfaces/Friendship';
import { User } from '../interfaces/User';
import { UserAsFriendSearchResultDTO } from '../interfaces/UserAsFriendSearchResultDTO';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:8080/users';

  loadUsernameByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<String>(`${this.apiUrl}/${userId}/name`, {
      headers,
    });
  }

  countUsers() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<number>(`${this.apiUrl}/count`, {
      headers,
    });
  }

  findUsersByUsernameLike(username: string) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserAsFriendSearchResultDTO[]>(
      `${this.apiUrl}/searchByUsernameLike?username=${username}`,
      {
        headers,
      },
    );
  }

  getUserByIdAsFriendDTO(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserAsFriendSearchResultDTO>(
      `${this.apiUrl}/getUserByIdAsFriendDTO/${userId}`,
      { headers },
    );
  }
}
