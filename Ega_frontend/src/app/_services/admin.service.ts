import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemandeCompte, StatutCompte, Compte, Client } from '../_models/models'; // Assurez-vous que le modèle existe

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api';

  // --- KPI / STATS ---
  getDashboardStats() {
    // Endpoint fictif ou à créer côté back pour récupérer les compteurs (100 Clients, 50 Demandes...)
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  // --- GESTION DEMANDES ---
  getDemandesEnAttente(): Observable<DemandeCompte[]> {
    return this.http.get<DemandeCompte[]>(`${this.apiUrl}/demandes/attente`);
  }

  validerDemande(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/demandes/${id}/valider`, {});
  }

  rejeterDemande(id: number, motif: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/demandes/${id}/rejeter?motif=${motif}`, {});
  }
  // --- CLIENTS ---
  getAllClients(): Observable<any[]> { // Remplacer any par Client[]
    return this.http.get<any[]>(`${this.apiUrl}/clients`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client);
  }
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  toggleClientStatus(clientId: number, status: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/clients/${clientId}/status`, { active: status });
  }

  // --- COMPTES ---
  getAllComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.apiUrl}/comptes`);
  }

  // Utilisation du PATCH comme défini dans votre backend
  changerStatutCompte(numeroCompte: string, statut: StatutCompte): Observable<Compte> {
    return this.http.patch<Compte>(
      `${this.apiUrl}/comptes/${numeroCompte}/statut?statut=${statut}`,
      {}
    );
  }

  creerCompte(clientId: number, typeCompte: string): Observable<Compte> {
    const payload = {
      clientId: clientId,
      typeCompte: typeCompte
    };
    return this.http.post<Compte>(`${this.apiUrl}/comptes`, payload);
  }

  // --- TRANSACTIONS ---
  getAllTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/operations/historique`);
  }


  effectuerDepot(numeroCompte: string, montant: number): Observable<void> {
    const payload = { numeroCompte, montant };
    return this.http.post<void>(`${this.apiUrl}/operations/versement`, payload);
  }

  // --- DOCUMENTS (Recherche) ---
  searchClientByCompte(numeroCompte: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/compte/search?compte=${numeroCompte}`);
  }
}
