import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Streak } from '../interfaces/UserProfile';

@Injectable({
  providedIn: 'root',
})
export class StreakService {
  private readonly apiUrl = 'http://localhost:8080/streaks';

  constructor(private http: HttpClient) {}

  incrementOrCreateStreak(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Streak>(
      `${this.apiUrl}/user/${userId}/incrementOrCreateStreak`,
      {},
      { headers },
    );
  }

  fixStreakByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.patch<Streak>(
      `${this.apiUrl}/fixStreak/${userId}`,

      { headers },
    );
  }

  getStreakByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Streak>(`${this.apiUrl}/user/${userId}`, {
      headers,
    });
  }
}
