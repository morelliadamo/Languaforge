import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Unit } from '../interfaces/Unit';
import { Observable } from 'rxjs';
import { Lesson } from '../interfaces/Lesson';
import { Course } from '../interfaces/Course';
import { UserXCourse } from '../interfaces/UserProfile';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class CourseLoaderServiceService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8080/userXcourses';
  private authService = inject(AuthServiceService);

  loadUserCourses(username: string) {
    console.log('Loading courses for user:', username);
    console.log(`${this.apiUrl}/user/${username}`);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`, { headers });
  }

  loadUserCoursesByUserId(id: number) {
    console.log('Loading courses for user ID:', id);
    console.log(`${this.apiUrl}/user/${id}`);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${id}/courses`, {
      headers,
    });
  }

  loadUserXCoursesByUserId(userId: number) {
    console.log('Loading userXCourses for user ID:', userId);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserXCourse[]>(`${this.apiUrl}/userId/${userId}`, {
      headers,
    });
  }

  loadCourseByUserIdAndCourseId(userId: number, courseId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Course>(
      `${this.apiUrl}/user/${userId}/courses/${courseId}`,
      { headers },
    );
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

  createUserXCourse(courseId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const requestBody = {
      courseId: courseId,
      userId: Number(this.authService.getCurrentUserId()),
      progress: 0,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
    };
    this.http
      .post(
        `${this.apiUrl}/enroll/${courseId}/user/${this.authService.getCurrentUserId()}`,
        requestBody,
        { headers },
      )
      .subscribe(
        (response) => {
          console.log('Successfully enrolled in course:', response);
        },
        (error) => {
          console.error('Error enrolling in course:', error);
        },
      );
  }
}
