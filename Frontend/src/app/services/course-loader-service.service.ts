import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Unit } from '../interfaces/Unit';
import { Observable } from 'rxjs';
import { Lesson } from '../interfaces/Lesson';
import { Course } from '../interfaces/Course';
import { UserXCourse } from '../interfaces/UserProfile';
import { AuthServiceService } from './auth-service.service';
import { LessonProgress } from '../interfaces/LessonProgress';
import { Exercise } from '../interfaces/Exercise';

@Injectable({
  providedIn: 'root',
})
export class CourseLoaderServiceService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:8080/userXcourses';
  private apiUrl2 = 'http://localhost:8080/lessonprogresses';
  private authService = inject(AuthServiceService);

  getLessonProgressesByUserId(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<LessonProgress[]>(`${this.apiUrl2}/user/${userId}`, {
      headers,
    });
  }

  loadUserCourses(username: string) {
    console.log('Loading courses for user:', username);
    console.log(`${this.apiUrl}/user/${username}`);
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`, { headers });
  }

  getCourseById(courseId: number) {
    return this.http.get<Course>(`http://localhost:8080/courses/${courseId}`);
  }

  getCourseWithMostUsers() {
    return this.http.get<Course>(
      'http://localhost:8080/courses/courseWith/mostUsers',
    );
  }

  getCourseWithBestReviews() {
    return this.http.get<Course>(
      'http://localhost:8080/courses/courseWith/bestReviews',
    );
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
    return this.http.post(
      `${this.apiUrl}/enroll/${courseId}/user/${this.authService.getCurrentUserId()}`,
      requestBody,
      { headers },
    );
  }

  createUserXCourseForUser(courseId: number, userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const requestBody = {
      courseId: courseId,
      userId: userId,
      progress: 0,
      enrolledAt: new Date().toISOString(),
      completedAt: null,
    };
    return this.http.post(
      `${this.apiUrl}/enroll/${courseId}/user/${userId}`,
      requestBody,
      { headers },
    );
  }

  deleteUserXCourse(userXCourseId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.apiUrl}/delete/${userXCourseId}`, {
      headers,
    });
  }

  countCourses() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<number>('http://localhost:8080/courses/count', {
      headers,
    });
  }

  getAllCourses() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>('http://localhost:8080/courses/', {
      headers,
    });
  }

  //-------------------Course------------------
  updateCourse(id: number, body: Partial<Course>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(
      `http://localhost:8080/courses/updateCourse/${id}`,
      body,
      { headers },
    );
  }
  createCourse(body: Partial<Course>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`http://localhost:8080/courses/createCourse`, body, {
      headers,
    });
  }

  softDeleteCourse(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/courses/softDeleteCourse/${id}`,
      null,
      { headers },
    );
  }

  restoreCourse(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/courses/restoreCourse/${id}`,
      null,
      { headers },
    );
  }

  //-------------------Unit------------------
  updateUnit(id: number, body: Partial<Unit>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`http://localhost:8080/units/updateUnit/${id}`, body, {
      headers,
    });
  }

  createUnit(body: Partial<Unit>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`http://localhost:8080/units/createUnit`, body, {
      headers,
    });
  }

  softDeleteUnit(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/units/softDeleteUnit/${id}`,
      null,
      {
        headers,
      },
    );
  }

  restoreUnit(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/units/restoreUnit/${id}`,
      null,
      {
        headers,
      },
    );
  }

  //-------------------Lesson------------------
  updateLesson(id: number, body: Partial<Lesson>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(
      `http://localhost:8080/lessons/updateLesson/${id}`,
      body,
      { headers },
    );
  }

  createLesson(body: Partial<Lesson>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`http://localhost:8080/lessons/createLesson`, body, {
      headers,
    });
  }

  softDeleteLesson(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/lessons/softDeleteLesson/${id}`,
      null,
      { headers },
    );
  }

  restoreLesson(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/lessons/restoreLesson/${id}`,
      null,
      { headers },
    );
  }

  //-------------------Exercise----------------------------
  updateExercise(id: number, body: Partial<Exercise>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(
      `http://localhost:8080/exercises/updateExercise/${id}`,
      body,
      { headers },
    );
  }

  createExercise(body: Partial<Exercise>) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(
      `http://localhost:8080/exercises/createExercise`,
      body,
      {
        headers,
      },
    );
  }

  softDeleteExercise(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/exercises/softDeleteExercise/${id}`,
      null,
      { headers },
    );
  }

  restoreExercise(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.patch(
      `http://localhost:8080/exercises/restoreExercise/${id}`,
      null,
      { headers },
    );
  }
}
