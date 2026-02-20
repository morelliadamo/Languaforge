import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LessonProgress } from '../interfaces/LessonProgress';

@Injectable({
  providedIn: 'root',
})
export class LessonProgressService {
  constructor(private http: HttpClient) {}
  private readonly apiUrl = 'http://localhost:8080/lessonprogresses';

  loadLessonProgressesByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<LessonProgress[]>(`${this.apiUrl}/user/${userId}`, {
      headers,
    });
  }
}
