import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { AuthUser, UserRole } from './auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<AuthUser | null>;
    public currentUser$: Observable<AuthUser | null>;

    constructor() {
        // Vérification de l'existence de localStorage pour le SSR
        const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
        const savedUser = isBrowser ? localStorage.getItem('currentUser') : null;

        this.currentUserSubject = new BehaviorSubject<AuthUser | null>(savedUser ? JSON.parse(savedUser) : null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string): Observable<AuthUser> {
        return of(null).pipe(
            delay(1000),
            tap(() => {
                let user: AuthUser | null = null;

                if (username === 'admin' && password === 'admin123') {
                    user = {
                        id: '1',
                        username: 'admin',
                        nom: 'Direction',
                        prenom: 'Admin',
                        email: 'admin@egabank.com',
                        role: 'ADMIN',
                        token: 'mock-jwt-token-admin'
                    };
                } else if (username === 'client' && password === 'client123') {
                    user = {
                        id: '2',
                        username: 'client',
                        nom: 'Rahman',
                        prenom: 'Sajibur',
                        email: 'sajibur@bank.com',
                        role: 'CLIENT',
                        token: 'mock-jwt-token-client'
                    };
                }

                if (user) {
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                    this.currentUserSubject.next(user);
                } else {
                    throw new Error('Identifiants incorrects');
                }
            }),
            map(() => this.currentUserValue!)
        );
    }

    register(userData: any): Observable<AuthUser> {
        return of(null).pipe(
            delay(1500),
            tap(() => {
                const newUser: AuthUser = {
                    id: Math.random().toString(36).substr(2, 9),
                    username: userData.username,
                    nom: userData.nom,
                    prenom: userData.prenom,
                    email: userData.email,
                    role: 'CLIENT',
                    token: 'mock-jwt-token-new-client'
                };
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                }
                this.currentUserSubject.next(newUser);
            }),
            map(() => this.currentUserValue!)
        );
    }

    logout() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('currentUser');
        }
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserValue;
    }

    getUserRole(): UserRole | null {
        return this.currentUserValue ? this.currentUserValue.role : null;
    }

    getToken(): string | null {
        return this.currentUserValue ? this.currentUserValue.token || null : null;
    }
}
