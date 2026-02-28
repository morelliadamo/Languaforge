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

  loadLessonProgressesByUserIdAndCourseId(userId: number, courseId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<LessonProgress[]>(
      `${this.apiUrl}/user/${userId}/course/${courseId}`,
      {
        headers,
      },
    );
  }

  createLessonProgress(userId: number, lessonId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = { userId, lessonId, completedExercises: 0 };
    return this.http.post<LessonProgress>(
      `${this.apiUrl}/createLessonProgress`,
      body,
      {
        headers,
      },
    );
  }

  updateLessonProgress(lessonProgressId: number, completedExercises: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const body = { completedExercises };
    return this.http.put<LessonProgress>(
      `${this.apiUrl}/updateLessonProgress/${lessonProgressId}`,
      body,
      {
        headers,
      },
    );
  }

  countCompletedLessons() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<number>(`${this.apiUrl}/count/completed`, {
      headers,
    });
  }

  getEligibleForStreak(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<boolean>(
      `${this.apiUrl}/user/${userId}/hasCompletedToday`,
      { headers },
    );
  }
}
