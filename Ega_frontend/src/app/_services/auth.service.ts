import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/auth';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private getStoredUser(): AuthResponse | null {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : null;
  }

  login(loginData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData).pipe(
      map(res => {
        // Le backend renvoie { token, role, username, id }
        // On stocke TOUT l'objet dans 'auth', y compris l'ID
        localStorage.clear();
        localStorage.setItem('auth', JSON.stringify(res));
        localStorage.setItem('token', res.token);

        this.currentUserSubject.next(res);
        return res;
      })
    );
  }

  register(clientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, clientData, { responseType: 'text' as 'json' });
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
}
