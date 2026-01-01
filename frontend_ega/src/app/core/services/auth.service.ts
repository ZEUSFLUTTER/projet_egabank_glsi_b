import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse, RegisterRequest } from '../models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private userSignal = signal<AuthResponse | null>(null);

    public user = computed(() => this.userSignal());
    public isAuthenticated = computed(() => !!this.userSignal());

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        const savedUser = localStorage.getItem('ega_user');
        if (savedUser) {
            this.userSignal.set(JSON.parse(savedUser));
        }
    }

    login(credentials: AuthRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/login', credentials).pipe(
            tap(response => {
                this.userSignal.set(response);
                localStorage.setItem('ega_user', JSON.stringify(response));
                localStorage.setItem('ega_token', response.token);
            })
        );
    }

    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/auth/register', userData).pipe(
            tap(response => {
                this.userSignal.set(response);
                localStorage.setItem('ega_user', JSON.stringify(response));
                localStorage.setItem('ega_token', response.token);
            })
        );
    }

    logout() {
        this.userSignal.set(null);
        localStorage.removeItem('ega_user');
        localStorage.removeItem('ega_token');
        this.router.navigate(['/login'], { replaceUrl: true });
    }

    getToken(): string | null {
        return localStorage.getItem('ega_token');
    }
}
