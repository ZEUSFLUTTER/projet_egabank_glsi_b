import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

/* =======================
   TYPES
======================= */

export interface TokenPayload {
  sub: string;        // username / email
  exp: number;        // expiration (timestamp)
  iat: number;        // issued at
  clientId?: number; // optionnel (si backend l'ajoute plus tard)
  role?: string;      // CLIENT ou ADMIN
}

/* =======================
   SERVICE
======================= */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8081/api/auth';
  private readonly TOKEN_KEY = 'access_token';

  constructor(private http: HttpClient) { }

  /* =======================
     AUTH API
  ======================= */

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        username,
        password
      })
      .pipe(
        map(response => {
          this.saveToken(response.token);
          if (response.role) {
            localStorage.setItem('user_role', response.role);
          }
          return response;
        })
      );
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        map(response => {
          this.saveToken(response.token);
          if (response.role) {
            localStorage.setItem('user_role', response.role);
          }
          return response;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('user_role');
  }

  /* =======================
     TOKEN MANAGEMENT
  ======================= */

  private saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  /* =======================
     AUTH STATUS
  ======================= */

  isLoggedIn(): boolean {
    const payload = this.decodeToken();
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      this.logout(); // token expiré → nettoyage
      return false;
    }

    return true;
  }

  /* =======================
     USER INFO
  ======================= */

  getUsername(): string | null {
    return this.decodeToken()?.sub ?? null;
  }

  getClientId(): number | null {
    return this.decodeToken()?.clientId ?? null;
  }

  getRole(): string | null {
    const token = this.decodeToken();
    return token?.role || localStorage.getItem('user_role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isClient(): boolean {
    return this.getRole() === 'CLIENT';
  }
}

export interface LoginResponse {
  token: string;
  role?: string;
  client?: any;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  username: string;
  password: string;
  telephone?: string;
  adresse?: string;
  sexe?: string;
  nationalite?: string;
  dateNaissance?: string;
}
