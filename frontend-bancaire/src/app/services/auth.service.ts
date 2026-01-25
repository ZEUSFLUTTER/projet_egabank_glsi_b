import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: any = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  async login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      console.log('AuthService: Tentative de login pour', credentials.email);
      // Appelle ton backend Spring Boot
      const response: any = await this.apiService.postData('auth/login', credentials).toPromise();

      console.log('AuthService: Réponse brute reçue:', response); // <--- LOG

      if (response && response.token) {
        console.log('AuthService: Token présent dans la réponse.'); // <--- LOG
        localStorage.setItem('token', response.token);

        // ✅ Récupère les vraies infos de l'utilisateur depuis la réponse
        console.log('AuthService: Valeur de response.client?.role:', response.client?.role); // <--- LOG IMPORTANT
        console.log('AuthService: Valeur de response.client?.prenom:', response.client?.prenom); // <--- LOG
        console.log('AuthService: Valeur de response.client?.nom:', response.client?.nom); // <--- LOG

        this.currentUser = {
          email: response.client?.email || credentials.email,
          firstName: response.client?.prenom || 'Utilisateur',
          lastName: response.client?.nom || 'Inconnu',
          role: response.client?.role || 'CLIENT' // <--- Lecture du rôle ici
        };

        console.log('AuthService: currentUser construit:', this.currentUser); // <--- LOG

        // ✅ Sauvegarde dans localStorage (optionnel, mais cohérent)
        const userToStore = {
          name: `${response.client.prenom} ${response.client.nom}`,
          email: response.client.email,
          role: response.client.role // <--- Stockage du rôle ici
        };
        console.log('AuthService: Objet utilisateur à stocker dans localStorage:', userToStore); // <--- LOG
        localStorage.setItem('user', JSON.stringify(userToStore));

        // ✅ REDIRECTION CONDITIONNELLE SELON LE ROLE
        if (userToStore.role === 'ADMIN') {
          this.router.navigate(['/admin']); // <--- REDIRIGER VERS DASHBOARD ADMIN
          console.log('AuthService: Navigation vers /admin effectuée (utilisateur admin).'); // <--- LOG
        } else {
          this.router.navigate(['/dashboard']); // <--- REDIRIGER VERS DASHBOARD CLIENT
          console.log('AuthService: Navigation vers /dashboard effectuée (utilisateur standard).'); // <--- LOG
        }

        return true;
      } else {
        console.warn('AuthService: Aucun token dans la réponse.'); // <--- LOG
        return false;
      }
    } catch (error: any) {
      console.error('AuthService: Erreur lors du login:', error);
      return false;
    }
  }

  async register(userData: { nom: string; prenom: string; email: string; password: string; role: string }): Promise<boolean> {
    try {
      const response: any = await this.apiService.postData('auth/register', userData).toPromise();

      if (response && response.message === 'Client enregistré avec succès') {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  // ✅ Méthode pour vérifier si l'utilisateur est admin
  // ✅ Mis à jour pour lire directement depuis localStorage
  isAdmin(): boolean {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        return parsedUser.role === 'ADMIN';
      } catch (e) {
        console.error('Erreur lors du parsing de l\'utilisateur depuis localStorage:', e);
        return false;
      }
    }
    return false;
  }
}