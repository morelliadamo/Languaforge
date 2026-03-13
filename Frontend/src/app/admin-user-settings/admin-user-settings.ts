import { LoginData } from './../interfaces/UserProfile';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';

@Component({
  selector: 'app-admin-user-settings',
  imports: [],
  templateUrl: './admin-user-settings.html',
  styleUrl: './admin-user-settings.css',
})
export class AdminUserSettings {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/logindata/';

  users: LoginData[] = [];
  latestUsers: LoginData[] = [];

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.getLatestLoginUsers();
  }

  private getLatestLoginUsers() {
    this.http.get<LoginData[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.users = data;
        this.latestUsers = this.getLatestPerUser(data);
      },
    });
  }

  private getLatestPerUser(data: LoginData[]): LoginData[] {
    const userMap = new Map<number, LoginData>();
    for (const entry of data) {
      const existing = userMap.get(entry.userId);
      if (
        !existing ||
        new Date(entry.loginTime) > new Date(existing.loginTime)
      ) {
        userMap.set(entry.userId, entry);
      }
    }
    return Array.from(userMap.values());
  }
}
