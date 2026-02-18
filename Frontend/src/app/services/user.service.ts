import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Friendship } from '../interfaces/Friendship';

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
}
