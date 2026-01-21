import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BanqueService {
  // Définition de l'adresse du serveur unique pour tout le fichier
  private host: string = "http://localhost:8080";

  private banqueUrl = `${this.host}/api/banque`;
  private clientUrl = `${this.host}/api/clients`;

  constructor(private http: HttpClient) { }

  // --- GESTION DES CLIENTS ---

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.clientUrl);
  }

  getClientById(id: any): Observable<any> {
    return this.http.get<any>(`${this.clientUrl}/${id}`);
  }

  ajouterClient(nouveau: any): Observable<any> {
    return this.http.post<any>(this.clientUrl, nouveau);
  }

  updateClient(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${this.clientUrl}/${id}`, data);
  }

  supprimerClient(id: any): Observable<any> {
    return this.http.delete<any>(`${this.clientUrl}/${id}`);
  }

  // --- GESTION DES COMPTES ---

  ouvrirCompte(compte: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.banqueUrl}/ouvrir`, compte, { headers });
  }

  // --- GESTION DES OPÉRATIONS ---

  verser(numero: string, montant: number): Observable<any> {
    return this.http.post(`${this.banqueUrl}/verser/${numero}`, { montant });
  }

  retirer(numero: string, montant: number): Observable<any> {
    return this.http.post(`${this.banqueUrl}/retirer/${numero}`, { montant });
  }

  /**
   * Récupère les transactions liées à un client spécifique (Historique)
   */
  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.banqueUrl}/transactions`);
  }

  /**
   * NOUVEAU : Récupère TOUTES les transactions de la banque
   * pour le graphique du Dashboard.
   * Cette fonction appelle l'endpoint ajouté dans ClientController.java
   */
  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clientUrl}/transactions`);
  }
}
