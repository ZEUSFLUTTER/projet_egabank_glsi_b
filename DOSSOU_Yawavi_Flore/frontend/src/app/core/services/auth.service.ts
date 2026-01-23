import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDto, LoginResponse, RoleType } from '../../shared/models/user.model';
// Note: installer jwt-decode avec: npm install jwt-decode
// import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = this.getToken();
    if (token) {
      this.setCurrentUserFromToken(token);
    }
  }

  login(loginDto: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginDto).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.setCurrentUserFromToken(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setCurrentUserFromToken(token: string): void {
    try {
      // Décoder le JWT manuellement (simple alternative à jwt-decode)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decoded: any = JSON.parse(jsonPayload);
      this.currentUserSubject.next({
        username: decoded.sub,
        role: decoded.role,
        nom: decoded.nom
      });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasRole(role: RoleType): boolean {
    const user = this.getCurrentUser();
    return user && user.role === role;
  }

  hasAnyRole(roles: RoleType[]): boolean {
    const user = this.getCurrentUser();
    return user && roles.includes(user.role);
  }
}
