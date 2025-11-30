import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RegisterRequest} from '../interfaces/RegisterRequest';
import {RegisterResponse} from '../interfaces/RegisterResponse';

@Injectable({
  providedIn: 'root'
})
export class RegisterServiceService {
  private http = inject(HttpClient);
  private url = "http://localhost:8080/users/createUser";
  constructor() { };

  register(userData: RegisterRequest): Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(this.url, userData);
  }

}
