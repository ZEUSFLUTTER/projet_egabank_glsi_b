# 🔗 Guide d'Intégration Frontend

## 📱 Implémentation côté Frontend

Ce guide explique comment intégrer le système de session 3 minutes côté client.

---

## 🔧 Installation & Setup

### 1. Service d'Authentification (Angular)

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      this.getUserFromStorage()
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Login
  login(courriel: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      courriel,
      motDePasse
    }).pipe(
      tap(response => this.setTokens(response))
    );
  }

  // Register
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(response => this.setTokens(response))
    );
  }

  // Renouveler l'access token
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        this.setAccessToken(response.accessToken);
      })
    );
  }

  // Getter/Setter pour tokens
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(response: any): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('expiresIn', response.expiresIn);
    this.currentUserSubject.next(response);
  }

  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getUserFromStorage(): any {
    const token = localStorage.getItem('accessToken');
    return token ? { isLoggedIn: true } : null;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiresIn');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}
```

---

## 🛡️ HTTP Interceptor (Gestion du Token)

```typescript
// token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Ajouter le token à chaque requête
    const token = this.authService.getAccessToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // 2. Si erreur 401 (token expiré)
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // 3. Appeler l'endpoint de refresh
      return this.authService.refreshAccessToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);

          // 4. Renvoyer la requête originale avec le nouveau token
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    // Attendre le refresh et renvoyer
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => {
        return next.handle(this.addToken(request, token));
      })
    );
  }
}
```

---

## 📝 Enregistrer l'Interceptor

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
```

---

## 🔄 Gestion de Timeout Côté Client (Optionnel)

```typescript
// session-timeout.service.ts
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subject, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SessionTimeoutService {
  private destroy$ = new Subject<void>();
  private TIMEOUT_DURATION = 3 * 60 * 1000; // 3 minutes
  private timeoutWarning = 30 * 1000; // Avertissement à 30 sec

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  startWatchingSession(): void {
    this.ngZone.runOutsideAngular(() => {
      // Écouter l'activité utilisateur
      merge(
        fromEvent(document, 'mousedown'),
        fromEvent(document, 'keydown'),
        fromEvent(document, 'click')
      ).pipe(
        debounceTime(1000),
        switchMap(() => timer(this.TIMEOUT_DURATION)),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.ngZone.run(() => {
          console.log('Session timeout');
          this.authService.logout();
          this.router.navigate(['/login']);
        });
      });
    });
  }

  stopWatchingSession(): void {
    this.destroy$.next();
  }
}
```

---

## 🎯 Composant Login

```typescript
// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      courriel: ['admin@ega.com', [Validators.required, Validators.email]],
      motDePasse: ['admin123', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.authService.login(
      this.f['courriel'].value,
      this.f['motDePasse'].value
    ).subscribe(
      response => {
        console.log('Login succès', response);
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.error = error.error?.message || 'Erreur login';
        this.loading = false;
      }
    );
  }
}
```

---

## 🔒 Guard de Route

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.isLoggedIn();
    if (currentUser) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
```

---

## 🛣️ Configuration Routing

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 📊 Flux d'Exécution

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
    AuthService.login()
       │
       ├─ POST /api/auth/login
       │
       └─► localStorage: accessToken + refreshToken
       │
       ▼
    Navigate to /dashboard
       │
       ▼
┌──────────────────────────┐
│ TokenInterceptor Active  │
│ Ajoute Authorization     │
│ Header: Bearer <token>   │
└──────┬───────────────────┘
       │
       ▼
    GET /api/clients
       │
    ┌──┴──────────────────────┐
    │                         │
    ▼ 200 OK              ▼ 401 Unauthorized
  Afficher               Token Expiré
  données               │
                        ▼
              AuthService.refreshAccessToken()
                        │
                        ├─ POST /api/auth/refresh
                        │
                        └─► Nouveau accessToken
                        │
                        ▼
              Renvoyer requête avec nouveau token
                        │
                        ▼
                    200 OK - Données affichées ✅
```

---

## ✨ Avantages

- ✅ Token automatiquement ajouté à chaque requête
- ✅ Refresh automatique on 401 error
- ✅ Pas de redirection surprise
- ✅ Utilisateur reste connecté si actif
- ✅ Transparent pour le développeur

---

## 🧪 Test

```bash
# 1. Se connecter
POST http://localhost:4200/login
Courriel: admin@ega.com
Password: admin123

# 2. Faire plusieurs requêtes
- Click sur Comptes
- Click sur Clients
- Click sur Transactions

# 3. Attendre 3+ minutes sans activité
# 4. Faire une nouvelle requête
# ✅ Devrait refrescher auto et fonctionner
```

