import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreItem } from '../interfaces/StoreItem';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  private apiUrl = 'http://localhost:8080/storeItems/';

  getStoreItems() {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<StoreItem[]>(`${this.apiUrl}`, {
      headers: headers,
    });
  }
}
