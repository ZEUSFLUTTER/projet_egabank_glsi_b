import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Skip guard on server-side rendering
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        if (this.authService.isAuthenticated()) {
            return true;
        }

        // Non connecté, redirection vers login avec l'URL de retour
        console.log('AuthGuard: User not authenticated, redirecting to login');
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
