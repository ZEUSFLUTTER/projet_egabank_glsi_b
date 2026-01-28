import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('🔒 AuthGuard - Vérification d\'accès');
    console.log('Route demandée:', state.url);
    console.log('Rôle requis:', route.data['role']);
    
    if (this.authService.isAuthenticated()) {
      console.log('✅ Utilisateur authentifié');
      
      const requiredRole = route.data['role'];
      const userRole = this.authService.getRole();
      
      console.log('Rôle utilisateur:', userRole);
      console.log('Rôle requis:', requiredRole);
      
      if (requiredRole) {
        if (userRole === requiredRole) {
          console.log('✅ Rôle autorisé - accès accordé');
          return true;
        } else {
          console.log('❌ Rôle non autorisé - redirection vers unauthorized');
          this.router.navigate(['/unauthorized']);
          return false;
        }
      }
      
      console.log('✅ Pas de rôle spécifique requis - accès accordé');
      return true;
    }

    console.log('❌ Utilisateur non authentifié - redirection vers login');
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
