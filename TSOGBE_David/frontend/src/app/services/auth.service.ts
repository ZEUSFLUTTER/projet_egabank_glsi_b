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
  ) {}

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, authRequest)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  private setAuthData(response: AuthResponse): void {
    this.currentUser = response;
    localStorage.setItem(this.tokenKey, response.token);
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

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getRole(): Role | null {
    const role = localStorage.getItem(this.roleKey);
    if (!role) {
      return null;
    }
    // Convertir la chaîne en enum Role
    return role as Role;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const role = this.getRole();
    return role === Role.ROLE_ADMIN;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUser;
  }
}

