import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseLoaderServiceService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/userxcourses';


  loadUserCourses(username: string) {
    console.log('Loading courses for user:', username);
    console.log(`${this.apiUrl}/user/${username}`);
    return this.http.get<any[]>(`${this.apiUrl}/user/${username}`);
  }
}
