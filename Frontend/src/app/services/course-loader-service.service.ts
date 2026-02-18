import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Unit } from '../interfaces/Unit';
import { Observable } from 'rxjs';
import { Lesson } from '../interfaces/Lesson';
import { Course } from '../interfaces/Course';

@Injectable({
  providedIn: 'root',
})
export class CourseLoaderServiceService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8080/userxcourses';

  loadUserCourses(username: string) {
    console.log('Loading courses for user:', username);
    console.log(`${this.apiUrl}/user/${username}`);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`, { headers });
  }

  loadCourseUnits(username: string, courseId: number) {
    console.log(
      'Loading course units for user:',
      username,
      'and courseId:',
      courseId,
    );
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Unit[]>(
      `${this.apiUrl}/user/${username}/course/${courseId}`,
      { headers },
    );
  }

  loadAllCourses() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Course[]>('http://localhost:8080/courses/', {
      headers,
    });
  }

  loadUnitLessons(
    username: string,
    courseId: number,
    unitId: number,
  ): Observable<Unit> {
    console.log(
      'Loading unit lessons for user:',
      username,
      'and unitId:',
      unitId,
    );
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Unit>(
      `${this.apiUrl}/user/${username}/course/${courseId}/unit/${unitId}`,
      { headers },
    );
  }
}
