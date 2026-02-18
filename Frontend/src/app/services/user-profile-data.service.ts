import { UserProfileData } from './../interfaces/UserProfileData';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserProfile } from '../interfaces/UserProfile';

@Injectable({
  providedIn: 'root',
})
export class UserProfileDataService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/users/';

  getUserProfileData(id: number): Observable<UserProfileData> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserProfile>(`${this.apiUrl}${id}`, { headers }).pipe(
      map((userProfile) => ({
        currentStreak: userProfile.streak.currentStreak,
        longestStreak: userProfile.streak.longestStreak,
        completedCourses: userProfile.userXCourses
          .filter((uxc) => uxc.completedAt !== null)
          .map((uxc) => uxc.course),
        achievements: userProfile.achievementsOfUser
          .filter((a) => !a.isDeleted)
          .map((a) => a.achievement),
        achievementCount: userProfile.achievementsOfUser.filter(
          (a) => !a.isDeleted,
        ).length,
      })),
    );
  }
}
