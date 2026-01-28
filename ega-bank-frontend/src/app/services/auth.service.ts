import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Role, Client } from '../models/models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth_token';
  private roleKey = 'user_role';
  private emailKey = 'user_email';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentRoleSubject = new BehaviorSubject<Role | null>(this.getStoredRole());
  public currentRole$ = this.currentRoleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(courriel: string, password: string): Observable<any> {
    const loginRequest = {
      courriel: courriel,
      password: password
    };

    return this.http.post<any>(
      `${this.apiUrl}/login`,
      loginRequest,
      { 
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).pipe(
      tap(response => {
        console.log('🔐 Réponse de login:', response);
        if (response && response.token && response.role) {
          this.setToken(response.token);
          this.extractAndStoreUserInfo(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  register(client: Client): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/register`,
      client,
      { responseType: 'text' as 'json' }
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.emailKey);
    this.isAuthenticatedSubject.next(false);
    this.currentRoleSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  getRole(): Role | null {
    return this.getStoredRole();
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  isAdmin(): boolean {
    return this.getRole() === Role.ADMIN;
  }

  isClient(): boolean {
    return this.getRole() === Role.CLIENT;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return exp ? Date.now() >= exp * 1000 : false;
    } catch {
      return true;
    }
  }

  isAuthenticated(): boolean {
    return this.hasToken() && !this.isTokenExpired();
  }

  private extractAndStoreUserInfo(token: string): void {
    try {
      // Vérifier que le token a 3 parties (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT invalide: format incorrect');
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log('🔍 Payload JWT décodé:', payload);

      const role = payload.role as Role;
      const email = payload.sub;

      if (!role || !email) {
        throw new Error('Token JWT invalide: claims manquants');
      }

      // Vérifier l'expiration
      const exp = payload.exp;
      if (exp && Date.now() >= exp * 1000) {
        throw new Error('Token JWT expiré');
      }

      localStorage.setItem(this.roleKey, role);
      localStorage.setItem(this.emailKey, email);
      this.currentRoleSubject.next(role);

      console.log('✅ Informations utilisateur stockées:', { email, role });
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction des informations du token:', error);
      // Nettoyer le localStorage en cas d'erreur
      this.logout();
      throw error;
    }
  }

  private getStoredRole(): Role | null {
    const role = localStorage.getItem(this.roleKey);
    return role as Role | null;
  }
}
