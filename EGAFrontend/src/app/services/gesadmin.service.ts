import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { env } from '../../env/env';

@Injectable({
  providedIn: 'root',
})
export class GesadminService {
  // Remplacez par votre URL de base Spring Boot
  private readonly apiUrl = `${env.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Récupérer la liste complète des administrateurs
   */
  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`);
  }

  /**
   * Mettre à jour les informations de base d'un admin
   */
  updateAdmin(id: number, adminDetails: User): Observable<string> {
    return this.http.put(`${this.apiUrl}/update/${id}`, adminDetails, {
      responseType: 'text' // Car votre backend renvoie un String simple
    });
  }

  /**
   * Mettre à jour le mot de passe et déclencher l'envoi d'email
   */
  updatePassword(id: number, password: string): Observable<string> {
    return this.http.put(`${this.apiUrl}/update-password/${id}`, { password }, {
      responseType: 'text'
    });
  }

  /**
   * Suppression définitive d'un compte admin
   */
  deleteAdmin(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    });
  }

  /**
   * Réinitialiser le mot de passe d'un admin
   */
  resetAdminPassword(id: number): Observable<string> {
    return this.http.put(`${this.apiUrl}/update-password/${id}`, {}, { responseType: 'text' });
  }

  /**
   * Créer un nouvel administrateur
   */
  createAdmin(user: User): Observable<string> {
    return this.http.post(`${this.apiUrl}/signup`, user, { responseType: 'text' });
  }

  /**   
   * Mettre à jour les informations de l'utilisateur connecté
   */
  updateSelf(userData: any): Observable<string> {
    return this.http.put(`${this.apiUrl}/update-me`, userData, { 
      responseType: 'text' 
    });
  }

  /**   
   * Changer le mot de passe de l'utilisateur connecté
   */
  changePassword(passwords: any): Observable<string> {
    return this.http.put(`${this.apiUrl}change-password`, passwords, { 
      responseType: 'text' 
    });
  }
}