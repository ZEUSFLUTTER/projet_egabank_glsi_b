import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Service helper pour générer les routes selon le rôle de l'utilisateur
 */
@Injectable({ providedIn: 'root' })
export class RouteHelperService {

  constructor(private authService: AuthService) {}

  /**
   * Retourne le préfixe de route selon le rôle (admin ou client)
   */
  getRoutePrefix(): string {
    return this.authService.isAdmin() ? '/admin' : '/client';
  }

  /**
   * Génère une route complète avec le bon préfixe
   */
  getRoute(path: string): string {
    const prefix = this.getRoutePrefix();
    // Enlever le / au début du path s'il existe
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${prefix}/${cleanPath}`;
  }

  // Routes communes
  getDashboardRoute(): string {
    return this.getRoute('dashboard');
  }

  getAccountsRoute(): string {
    return this.getRoute('accounts');
  }

  getTransactionsRoute(): string {
    return this.getRoute('transactions');
  }

  getSettingsRoute(): string {
    return this.getRoute('settings');
  }

  // Routes admin uniquement
  getClientsRoute(): string {
    return this.getRoute('clients');
  }

  getNewClientRoute(): string {
    return this.getRoute('clients/new');
  }

  getNewAccountRoute(): string {
    return this.getRoute('accounts/new');
  }

  getNewTransactionRoute(): string {
    return this.getRoute('transactions/new');
  }
}
