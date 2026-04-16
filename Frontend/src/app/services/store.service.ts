import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreItem } from '../interfaces/StoreItem';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserXItem } from '../interfaces/UserXItem';
import { User } from '../interfaces/User';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/storeItems/';
  private apiUrl2 = 'http://localhost:8080/userXitems/';

  itemChanged = new Subject<{ type: string; changedBy: number }>();

  getStoreItems() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<StoreItem[]>(`${this.apiUrl}`, {
      headers: headers,
    });
  }

  getUserItems(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl2}user/${userId}`, {
      headers: headers,
    });
  }

  getUserHearts(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserXItem>(`${this.apiUrl2}user/${userId}/item/1`, {
      headers: headers,
    });
  }

  getUserHints(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<UserXItem>(`${this.apiUrl2}user/${userId}/item/2`, {
      headers: headers,
    });
  }

  incrementUserItem(userId: number, type: string, incrementBy: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .patch(
        `${this.apiUrl2}user/${userId}/incrementUserXItemQuantity/${type}/${incrementBy}`,
        null,
        { headers },
      )
      .pipe(tap(() => this.itemChanged.next({ type, changedBy: incrementBy })));
  }

  decrementUserItem(userId: number, type: string, decrementBy: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .patch(
        `${this.apiUrl2}user/${userId}/decrementUserXItemQuantity/${type}/${decrementBy}`,
        null,
        { headers },
      )
      .pipe(
        tap(() => this.itemChanged.next({ type, changedBy: -decrementBy })),
      );
  }
}
