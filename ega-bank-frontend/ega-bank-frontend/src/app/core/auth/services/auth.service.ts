import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { TokenService } from './token.service';
import { AuthStateService } from './auth-state.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private authStateService: AuthStateService,
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, payload).pipe(
      tap((response) => {
        // 1. Sauvegarde du token JWT
        this.tokenService.setToken(response.token);

        // 2. Construction de l’utilisateur frontend
        const user: User = {
          email: response.email,
          role: response.role,
          clientId: response.clientId,
        };

        // 3. Hydratation de l’état global
        this.authStateService.setUser(user);

        // 4. Redirection automatique selon le rôle
        this.redirectByRole(user.role);
      }),
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.authStateService.clearUser();
    this.router.navigate(['/login']);
  }

  private redirectByRole(role: 'CLIENT' | 'AGENT' | 'ADMIN'): void {
    switch (role) {
      case 'CLIENT':
        this.router.navigate(['/client/dashboard']);
        break;
      case 'AGENT':
        this.router.navigate(['/agent/dashboard']);
        break;
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
    }
  }
}