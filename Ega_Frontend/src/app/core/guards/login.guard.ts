import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * Guard qui empêche l'accès à la page de login si l'utilisateur est déjà connecté
 * Si connecté → redirige vers sa page d'accueil selon son rôle
 * Si non connecté → autorise l'accès à /login
 */
export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  // Si l'utilisateur est déjà connecté
  if (token && userRole) {
    console.log('⚠️ Utilisateur déjà connecté - Redirection vers sa page d\'accueil');
    
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
        // Si rôle inconnu, déconnecter
        localStorage.clear();
        return true; // Autoriser l'accès à /login
    }
    
    return false; // ❌ Bloquer l'accès à /login
  }

  // Si non connecté, autoriser l'accès à /login
  console.log('✅ Utilisateur non connecté - Accès à /login autorisé');
  return true;
};