import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Only run in browser environment
        if (!isPlatformBrowser(this.platformId)) {
            return next.handle(req);
        }

        // Get the token from AuthService (which stores it in currentUser)
        const token = this.authService.getToken();

        // Clone the request and add the authorization header if token exists
        let authReq = req;
        if (token) {
            authReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                // Check if it's an auth endpoint - don't redirect for login/register errors
                const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

                if ((error.status === 401 || error.status === 403) && !isAuthEndpoint) {
                    // Token expired or invalid - logout and redirect to login
                    // Only if we were actually authenticated (to prevent redirect loops)
                    if (this.authService.isAuthenticated()) {
                        console.log('AuthInterceptor: Token invalid/expired, logging out...');
                        this.authService.logout();
                        this.router.navigate(['/auth/login']);
                    }
                }

                // Re-throw the error so component can handle it
                return throwError(() => error);
            })
        );
    }
}
