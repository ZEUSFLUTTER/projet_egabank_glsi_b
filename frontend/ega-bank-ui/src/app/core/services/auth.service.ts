import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'ega_access_token';
    private readonly REFRESH_KEY = 'ega_refresh_token';
    private readonly USER_KEY = 'ega_user';

    isAuthenticated = signal(this.hasValidToken());
    currentUser = signal<AuthResponse | null>(this.getStoredUser());

    constructor(private http: HttpClient, private router: Router) { }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
            .pipe(tap(response => this.handleAuthSuccess(response)));
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
            .pipe(tap(response => this.handleAuthSuccess(response)));
    }

    refreshToken(): Observable<AuthResponse> {
        const refreshToken = localStorage.getItem(this.REFRESH_KEY);
        return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, null, {
            params: { refreshToken: refreshToken || '' }
        }).pipe(tap(response => this.handleAuthSuccess(response)));
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private handleAuthSuccess(response: AuthResponse): void {
        localStorage.setItem(this.TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_KEY, response.refreshToken);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response));
        this.isAuthenticated.set(true);
        this.currentUser.set(response);
    }

    private hasValidToken(): boolean {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }

    private getStoredUser(): AuthResponse | null {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    }
}
