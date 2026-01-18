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
    public isAdmin = computed(() => this.userSignal()?.role === 'ROLE_ADMIN');
    public isClient = computed(() => this.userSignal()?.role === 'ROLE_USER');

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
        const usernameClean = credentials.username.trim();
        const passwordClean = credentials.password.trim();

        // Détecter si c'est une connexion client
        const userIsAccount = this.isAccountNumber(usernameClean);
        const passIsAccount = this.isAccountNumber(passwordClean);

        if (userIsAccount || passIsAccount) {
            // Extraire le nom et le numéro de compte (sans espaces pour le compte)
            const nom = userIsAccount ? passwordClean : usernameClean;
            const numeroCompte = (userIsAccount ? usernameClean : passwordClean).replace(/\s+/g, '');

            const clientLoginData = {
                nom: nom,
                numeroCompte: numeroCompte
            };
            return this.http.post<AuthResponse>('/api/auth/client-login', clientLoginData).pipe(
                tap(response => {
                    this.userSignal.set(response);
                    localStorage.setItem('ega_user', JSON.stringify(response));
                    localStorage.setItem('ega_token', response.token);
                })
            );
        } else {
            // Connexion admin normale
            return this.http.post<AuthResponse>('/api/auth/login', {
                username: usernameClean,
                password: passwordClean
            }).pipe(
                tap(response => {
                    this.userSignal.set(response);
                    localStorage.setItem('ega_user', JSON.stringify(response));
                    localStorage.setItem('ega_token', response.token);
                })
            );
        }
    }

    /**
     * Détecte si une chaîne ressemble à un numéro de compte (IBAN)
     */
    private isAccountNumber(value: string): boolean {
        if (!value) return false;
        // Supprimer tous les espaces pour la détection
        const cleanValue = value.replace(/\s+/g, '').toUpperCase();
        // Un numéro de compte commence par 2 lettres (ex: FR) et fait au moins 10 char
        return /^[A-Z]{2}[0-9A-Z]+$/.test(cleanValue) && cleanValue.length >= 10;
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
