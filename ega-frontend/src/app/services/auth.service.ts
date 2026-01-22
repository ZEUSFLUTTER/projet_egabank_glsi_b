import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        if (response.token) {
          this.setToken(response.token);
          // Extraire le rôle et le stocker
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          if (payload.role) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('userRole', payload.role);
            }
          }
        }
        return response;
      })
    );
  }

  register(userData: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem('userRole');
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérification basique de l'expiration du token JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  }

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    if (!token) return new Observable(observer => observer.error('No token found'));
    
    // Appeler l'endpoint /api/auth/me pour obtenir les informations complètes de l'utilisateur
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      map(response => {
        // Traiter la réponse pour extraire le rôle principal
        const role = response.roles && response.roles.length > 0 
          ? response.roles[0].replace('ROLE_', '') 
          : null;
        
        return {
          id: response.id,
          username: response.username,
          email: response.email,
          role: role,
          roles: response.roles
        };
      })
    );
  }

  updateUserRole(userId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}/role`, { role });
  }
}
