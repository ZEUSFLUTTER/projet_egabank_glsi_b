import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  
  // 1️⃣ Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    console.warn('❌ Non authentifié - Redirection vers /login');
    router.navigate(['/login']);
    return false;
  }

  // 2️⃣ Vérifier le rôle si spécifié dans la route
  const requiredRole = route.data['role'];
  
  if (requiredRole && userRole !== requiredRole) {
    console.warn(`❌ Accès refusé - Rôle requis: ${requiredRole}, Rôle actuel: ${userRole}`);
    
    // Rediriger vers la page appropriée selon le rôle
    switch (userRole) {
      case 'ADMIN':
        router.navigate(['/users/list']);
        break;
      case 'GESTIONNAIRE':
        router.navigate(['/accounts/list']);
        break;
      case 'CAISSIERE':
        router.navigate(['/transactions/operations']);
        break;
      default:
        router.navigate(['/login']);
    }
    return false;
  }

  console.log('✅ Accès autorisé');
  return true;
};