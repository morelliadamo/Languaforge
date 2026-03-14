import { LoginData, LoginDataUser } from './../interfaces/UserProfile';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/User';
import { EditUser } from '../edit-user/edit-user';

@Component({
  selector: 'app-admin-user-settings',
  imports: [FormsModule, EditUser],
  templateUrl: './admin-user-settings.html',
  styleUrl: './admin-user-settings.css',
})
export class AdminUserSettings {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/logindata/';

  users: LoginData[] = [];
  allUsers: User[] = [];
  latestUsers: LoginData[] = [];
  searchResults: LoginData[] = [];
  selectedUser: LoginData | null = null;

  searchField: string = 'username';
  searchQuery: string = '';
  filterStatus: string = 'all';
  filterRole: string = 'all';
  filterDeleted: string = 'all';
  sortField: string = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';

  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    this.getUserLogins();
    this.getAllUsers();
  }

  private getUserLogins() {
    this.http.get<LoginData[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log(data);

        this.users = data;
        this.latestUsers = this.getLatestPerUser(data);
      },
    });
  }

  private getAllUsers() {
    this.http.get<User[]>('http://localhost:8080/users/').subscribe({
      next: (data) => {
        console.log(data);

        this.allUsers = data;
      },
    });
  }

  search() {
    const latestPerUser = this.getLatestPerUser(this.users);
    const loggedInUserIds = new Set(latestPerUser.map((l) => l.userId));

    const neverLoggedIn: LoginData[] = this.allUsers
      .filter((u) => !loggedInUserIds.has(u.id))
      .map((u) => ({
        id: 0,
        userId: u.id,
        user: {
          activationToken: null,
          anonymized: false,
          anonymizedAt: null,
          avatarUrl: u.avatarUrl ?? null,
          bio: u.bio,
          createdAt: u.createdAt ?? '',
          deleted: u.deleted ?? false,
          deletedAt: u.deletedAt ?? null,
          email: u.email,
          hibernateLazyInitializer: {},
          id: u.id,
          isActive: u.isActive ?? !u.deleted,
          lastLogin: u.lastLogin ?? '',
          passwordHash: '',
          role: u.role ?? { name: u.roleId === 2 ? 'admin' : 'user' },
          roleId: u.roleId,
          username: u.username,
        },
        loginTime: u.lastLogin ?? '',
        deviceInfo: null,
        ipAddress: null,
        sessionToken: null,
        expiresAt: null,
        isAnonymized: false,
        anonymizedAt: null,
        isDeleted: u.deleted ?? false,
        deletedAt: u.deletedAt ?? null,
      }));

    const combined = [...latestPerUser, ...neverLoggedIn];
    let results = this.applySearchQuery(combined);
    results = this.applyFilters(results);
    results = this.applySort(results);
    this.searchResults = results;
  }

  private applySearchQuery(data: LoginData[]): LoginData[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return data;

    return data.filter((entry) => {
      switch (this.searchField) {
        case 'username':
          return entry.user.username.toLowerCase().includes(query);
        case 'email':
          return entry.user.email.toLowerCase().includes(query);
        case 'role':
          return entry.user.role?.name?.toLowerCase().includes(query);
        case 'ipAddress':
          return entry.ipAddress?.toLowerCase().includes(query) ?? false;
        case 'deviceInfo':
          return entry.deviceInfo?.toLowerCase().includes(query) ?? false;
        default:
          return false;
      }
    });
  }

  private applyFilters(data: LoginData[]): LoginData[] {
    return data.filter((entry) => {
      if (this.filterStatus === 'active' && !entry.user.isActive) return false;
      if (this.filterStatus === 'inactive' && entry.user.isActive) return false;

      if (this.filterRole !== 'all') {
        const roleName = entry.user.role?.name?.toLowerCase();
        if (this.filterRole === 'admin' && roleName !== 'admin') return false;
        if (this.filterRole === 'user' && roleName === 'admin') return false;
      }

      if (this.filterDeleted === 'notDeleted' && entry.user.deleted)
        return false;
      if (this.filterDeleted === 'deleted' && !entry.user.deleted) return false;

      return true;
    });
  }

  private applySort(data: LoginData[]): LoginData[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;

    return [...data].sort((a, b) => {
      let valA: string;
      let valB: string;

      switch (this.sortField) {
        case 'username':
          valA = a.user.username.toLowerCase();
          valB = b.user.username.toLowerCase();
          break;
        case 'email':
          valA = a.user.email.toLowerCase();
          valB = b.user.email.toLowerCase();
          break;
        case 'createdAt':
          valA = a.user.createdAt;
          valB = b.user.createdAt;
          break;
        case 'lastLogin':
          valA = a.loginTime;
          valB = b.loginTime;
          break;
        case 'role':
          valA = a.user.role?.name?.toLowerCase() ?? '';
          valB = b.user.role?.name?.toLowerCase() ?? '';
          break;
        default:
          return 0;
      }

      return valA < valB ? -1 * dir : valA > valB ? 1 * dir : 0;
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
