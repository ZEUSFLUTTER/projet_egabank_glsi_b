import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

interface TokenPayload {
  id?: string;
  sub?: string;
  userId?: string;
  username?: string;
  email?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private baseUrl = 'http://localhost:9090/api/auth';
  private tokenKey = 'jwtToken';
  private userIdKey = 'userId';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  // Vérifier si on est en navigateur
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (this.isBrowser()) {
            if (response.token) {
              localStorage.setItem(this.tokenKey, response.token);
            }
            if (response.id) {
              localStorage.setItem(this.userIdKey, response.id);
            }
          }
        })
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Décoder le JWT et récupérer le payload
   */
  private decodeToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Erreur décodage JWT:', error);
      return null;
    }
  }

  /**
   * Récupère l'ID de l'utilisateur connecté (depuis localStorage)
   */
  getUserId(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.userIdKey);
  }

  /**
   * Récupère le username de l'utilisateur
   */
  getUsername(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;
    return payload.sub || payload.username || payload.email || null;
  }

  /**
   * Récupère l'email de l'utilisateur
   */
  getEmail(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;
    return payload.email || null;
  }

  /**
   * Récupère le payload complet du JWT
   */
  getTokenPayload(): TokenPayload | null {
    return this.decodeToken();
  }

  /**
   * Vérifie si le token est expiré
   */
  isTokenExpired(): boolean {
    const payload = this.decodeToken();
    if (!payload || !payload['exp']) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload['exp'] < currentTime;
  }

  /**
   * Récupère le rôle de l'utilisateur
   */
  getRole(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;
    return payload['role'] || null;
  }

  /**
   * Vérifie si l'utilisateur est admin
   */
  isAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN';
  }

  /**
   * Vérifie si l'utilisateur est client
   */
  isClient(): boolean {
    const role = this.getRole();
    return role === 'CLIENT';
  }
}
