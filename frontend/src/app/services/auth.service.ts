import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest, Role } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private currentUser: AuthResponse | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem(this.tokenKey);
    const role = localStorage.getItem(this.roleKey);
    if (token && role) {
      this.currentUser = {
        accessToken: token,
        refreshToken: '',
        type: 'Bearer',
        userId: 1,
        courriel: '',
        role: role as Role,
        expiresIn: 0
      };
    }
  }

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, authRequest)
      .pipe(tap(response => this.setAuthData(response)));
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(tap(response => this.setAuthData(response)));
  }

  private setAuthData(response: AuthResponse): void {
    this.currentUser = response;
    localStorage.setItem(this.tokenKey, response.accessToken);
    if (response.role) {
      localStorage.setItem(this.roleKey, response.role);
    }
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): Role | null {
    const role = localStorage.getItem(this.roleKey);
    return role ? (role as Role) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === Role.ROLE_ADMIN;
  }

  isAgent(): boolean {
    return this.getRole() === Role.ROLE_AGENT;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUser;
  }
}
