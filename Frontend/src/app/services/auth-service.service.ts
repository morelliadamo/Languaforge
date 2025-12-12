import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {LoginRequest} from '../interfaces/LoginRequest';
import {AuthResponse} from '../interfaces/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly accessTokenKey = "access_token";
  private readonly refreshTokenKey = "refresh_token";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => this.storeTokens(response)));
  }

  refreshToken(): Observable<AuthResponse>{
    const refreshToken = this.getRefreshToken();
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(tap(response => this.storeTokens(response)));
  }

  logout(): void{
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  getAccesToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.accessTokenKey);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
