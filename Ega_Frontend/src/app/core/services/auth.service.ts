import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../models/User";
import { ACTIVATE_USERS_ENDPOINT, ACTIVE_USERS_ENDPOINT, DESACTIVATE_USERS_ENDPOINT, INACTIVE_USERS_ENDPOINT, LOGIN_ENDPOINT, REGISTER_CAISSIER_ENDPOINT, REGISTER_GESTIONNAIRE_ENDPOINT } from "../../utils/constantes";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  sub: string;       
  role: string;       
  nom: string;        
  iat: number;        
  exp: number;        
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    

    readonly http = inject(HttpClient);
/*
    //service poue la connexion 
    public login(username: string, password: string) {

        return this.http.post<{}>(LOGIN_ENDPOINT, { username, password });
    }
*/

    public login(username: string, password: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(LOGIN_ENDPOINT,{ username, password });
    }


    // service d'inscription d'un caissier
    public registerCaissier(firstName: string, lastName: string, username: string, password: string, email: string, phoneNumber: string): Observable<User> {
        const user = { firstName, lastName, username, password, email, phoneNumber };
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<User>(REGISTER_CAISSIER_ENDPOINT, user, { headers });
    }

    

    // service d'inscription d'un gestionnaire
    public registerGestionnaire(firstName: string, lastName: string, username: string, password: string, email: string, phoneNumber: string): Observable<User> {
        const user = { firstName, lastName, username, password, email, phoneNumber };
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<User>(REGISTER_GESTIONNAIRE_ENDPOINT, user, { headers });
    }

    // service pour afficher les utilisateurs actifs
    public getActiveUsers(): Observable<User[]> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<User[]>(ACTIVE_USERS_ENDPOINT, { headers });
    }

    // service pour afficher les utilisateurs inactifs
    public getInactiveUsers(): Observable<User[]> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<User[]> (INACTIVE_USERS_ENDPOINT, { headers });
    }

    //service pour la deconnexion 
    public logout(): void {
        localStorage.removeItem('authToken');
    }

    //service pour desactiver un utilisateur
    public deactivateUser(matricule: string): Observable<void> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<void>(DESACTIVATE_USERS_ENDPOINT(matricule),{}, { headers });
    }

    //service pour activer un utilisateur
    public activateUser(matricule: string): Observable<void> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<void>(ACTIVATE_USERS_ENDPOINT(matricule),{}, { headers });
    }



    getRoles(): string[] {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('Aucun token trouvé');
      return [];
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log('Token décodé:', decoded);
      
      // Le rôle est dans decoded.role
      if (decoded.role) {
        return [decoded.role];
      }
      
      console.warn('Aucun rôle trouvé dans le token');
      return [];
      
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return [];
    }
  }
}
