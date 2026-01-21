// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:8080/auth/';

  constructor(private http: HttpClient) {}

login(credentials: any): Observable<any> {
  return this.http.post(this.API_URL + 'signin', credentials).pipe(
    tap({
      next: (response: any) => {
        if (response && response.token) {
          localStorage.setItem('auth-token', response.token);
          localStorage.setItem('auth-user', JSON.stringify(response));
        }
      },
      error: (err) => {
        console.error("Erreur lors de la requête :", err);
      }
    })
  );
}

  getUserInfo() {
    const user = localStorage.getItem('auth-user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth-token');
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth-token');
  }

  getUser() {
    const user = localStorage.getItem('auth-user');
    return user ? JSON.parse(user) : null;
  }
}
