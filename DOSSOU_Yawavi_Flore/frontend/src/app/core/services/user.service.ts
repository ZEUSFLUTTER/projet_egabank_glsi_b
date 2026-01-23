import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, CreateUserDto } from '../../shared/models/user.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  createGestionnaire(user: CreateUserDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/gestionnaire`, user);
  }

  createCaissiere(user: CreateUserDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/caissier`, user);
  }

  getAllActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/userActif`);
  }

  getAllInactiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/userInactif`);
  }

  deactivateUser(matricule: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/desactive/${matricule}`, {});
  }

  activateUser(matricule: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/active/${matricule}`, {});
  }
}
