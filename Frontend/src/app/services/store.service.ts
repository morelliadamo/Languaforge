import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoreItem } from '../interfaces/StoreItem';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/storeItems/';
  private apiUrl2 = 'http://localhost:8080/userXitems/';

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

  incrementUserItem(userId: number, type: string, incrementBy: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(
      `${this.apiUrl2}user/${userId}/incrementUserXItemQuantity/${type}/${incrementBy}`,
      null,
      { headers },
    );
  }

  decrementUserItem(userId: number, type: string, decrementBy: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch(
      `${this.apiUrl2}user/${userId}/decrementUserXItemQuantity/${type}/${decrementBy}`,
      null,
      { headers },
    );
  }
}
