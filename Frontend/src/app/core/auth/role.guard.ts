import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // Skip guard on server-side rendering
        if (!isPlatformBrowser(this.platformId)) {
            return true;
        }

        const expectedRole = route.data['role'];
        const userRole = this.authService.getUserRole();

        console.log('RoleGuard: Expected role:', expectedRole, 'User role:', userRole);

        if (this.authService.isAuthenticated() && userRole === expectedRole) {
            return true;
        }

        // Rôle non autorisé, redirection vers le dashboard approprié si connecté
        if (this.authService.isAuthenticated()) {
            console.log('RoleGuard: User authenticated but wrong role, redirecting...');
            const redirectPath = userRole === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard';
            this.router.navigate([redirectPath]);
        } else {
            console.log('RoleGuard: User not authenticated, redirecting to login');
            this.router.navigate(['/auth/login']);
        }

        return false;
    }
}
