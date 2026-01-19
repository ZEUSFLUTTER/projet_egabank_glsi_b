import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot) {
        const expectedRole = route.data['role'];
        const userRole = this.authService.getUserRole();

        if (this.authService.isAuthenticated() && userRole === expectedRole) {
            return true;
        }

        // Rôle non autorisé, redirection vers le dashboard approprié si connecté
        if (this.authService.isAuthenticated()) {
            const redirectPath = userRole === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard';
            this.router.navigate([redirectPath]);
        } else {
            this.router.navigate(['/auth/login']);
        }

        return false;
    }
}
