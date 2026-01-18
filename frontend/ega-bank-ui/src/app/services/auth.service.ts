import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppStore } from '../stores/app.store';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private api: ApiService,
    private router: Router,
    private store: AppStore
  ) { }

  register(payload: any): Observable<any> {
    return this.api.post('/auth/register', payload).pipe(
      tap((res: any) => {
        if (res?.accessToken) localStorage.setItem('accessToken', res.accessToken);
        if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
        // Sauvegarder les infos utilisateur
        if (res?.username) localStorage.setItem('username', res.username);
        if (res?.email) localStorage.setItem('email', res.email);
        if (res?.role) localStorage.setItem('role', res.role);
      })
    );
  }

  login(payload: any): Observable<any> {
    return this.api.post('/auth/login', payload).pipe(
      tap((res: any) => {
        if (res?.accessToken) localStorage.setItem('accessToken', res.accessToken);
        if (res?.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
        // Sauvegarder les infos utilisateur
        if (res?.username) localStorage.setItem('username', res.username);
        if (res?.email) localStorage.setItem('email', res.email);
        if (res?.role) localStorage.setItem('role', res.role);
      })
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.api.post(`/auth/refresh?refreshToken=${encodeURIComponent(refreshToken)}`, null);
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('role');

    // Réinitialiser le store pour nettoyer l'état
    this.store.reset();

    this.router.navigateByUrl('/login');
  }

  /**
   * Vérifie si l'utilisateur est authentifié en validant:
   * 1. La présence d'un token
   * 2. La validité du token (non expiré)
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    // Vérifier si le token n'est pas expiré
    return !this.isTokenExpired(token);
  }

  /**
   * Vérifie si un token JWT est expiré
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return true; // Si pas d'expiration, considérer comme expiré
      }

      // exp est en secondes, Date.now() en millisecondes
      const expirationDate = payload.exp * 1000;
      const now = Date.now();

      // Ajouter une marge de 30 secondes pour éviter les problèmes de timing
      return now >= (expirationDate - 30000);
    } catch {
      return true; // En cas d'erreur de décodage, considérer comme expiré
    }
  }

  /**
   * Décode le payload d'un token JWT
   */
  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      // Décoder le Base64URL en Base64 standard
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Récupère les informations de l'utilisateur depuis le token et le localStorage
   */
  getUserInfo(): { username: string; email: string; exp: number } | null {
    // Priorité au localStorage pour username et email (plus fiable)
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username && email) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = this.decodeToken(token);
        return {
          username: username,
          email: email,
          exp: payload?.exp || 0,
        };
      }
    }

    // Fallback sur le token si pas dans localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (!payload) return null;

    return {
      username: payload.sub || '',
      email: payload.sub || '', // Le sub contient généralement le username
      exp: payload.exp || 0,
    };
  }

  /**
   * Vérifie si un refresh token est disponible
   */
  hasRefreshToken(): boolean {
    return !!localStorage.getItem('refreshToken');
  }

  /**
   * Récupère le rôle de l'utilisateur connecté
   */
  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }

  /**
   * Vérifie si l'utilisateur est un admin
   */
  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  /**
   * Vérifie si l'utilisateur est un client
   */
  isClient(): boolean {
    return this.hasRole('ROLE_USER');
  }
}
