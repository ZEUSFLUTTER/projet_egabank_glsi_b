import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const API_URL = 'http://localhost:8081/api';

export interface LoginRequest {
  nomUtilisateur: string;
  motDePasse: string;
}

export interface LoginResponse {
  jeton: string;
}

export interface RegisterRequest {
  nomUtilisateur: string;
  motDePasse: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'jwt_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('Tentative de connexion pour:', credentials.nomUtilisateur);
    return this.http.post<LoginResponse>(`${API_URL}/auth/connexion`, credentials)
      .pipe(
        tap(response => {
          console.log('Réponse de connexion reçue:', response);
          if (response.jeton) {
            localStorage.setItem(this.tokenKey, response.jeton);
            console.log('Token sauvegardé dans localStorage');
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${API_URL}/auth/inscription`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
