import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientRequest, AdminRequest, Compte, Transaction, ClientResponse, CompteResponse, OperationRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Admin registration
  registerAdmin(request: AdminRequest): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/register`, request);
  }

  // Client CRUD
  createClient(request: ClientRequest): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/clients`, request);
  }

  getAllClients(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(`${this.apiUrl}/clients`);
  }

  listClients(): Observable<ClientResponse[]> {
    return this.getAllClients();
  }

  countClients(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/clients/count`);
  }

  listAdmins(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/admins`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/clients/${id}`);
  }

  updateClient(id: number, request: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, request);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clients/${id}`);
  }

  // Comptes
  getComptesByClient(clientId: number): Observable<CompteResponse[]> {
    return this.http.get<CompteResponse[]>(`${this.apiUrl}/clients/${clientId}/comptes`);
  }

  getClientComptes(clientId: number): Observable<CompteResponse[]> {
    return this.getComptesByClient(clientId);
  }

  createCompteForClient(clientId: number, request: any): Observable<CompteResponse> {
    // Utiliser l'endpoint existant /api/comptes/admin
    const compteRequest = {
      ...request,
      proprietaireId: clientId
    };
    return this.http.post<CompteResponse>('http://localhost:8080/api/comptes/admin', compteRequest);
  }

  // Transactions récentes
  getRecentTransactions(): Observable<Transaction[]> {
    // Récupérer les transactions récentes (dernières 10)
    return this.http.get<Transaction[]>(`http://localhost:8080/api/transactions/recent`);
  }

  // Tous les comptes
  getAllAccounts(): Observable<CompteResponse[]> {
    return this.http.get<CompteResponse[]>(`${this.apiUrl}/comptes`);
  }

  // Statistiques du dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  // Export des données
  exportData(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    });
  }

  // Historique des transactions
  getHistoriqueClient(clientId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`http://localhost:8080/api/transactions/client/${clientId}`);
  }

  getHistoriqueClientPdf(clientId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/api/transactions/client/${clientId}/pdf`, {
      responseType: 'blob'
    });
  }

  // Transactions et historique
  getTransactionsByClient(clientId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/clients/${clientId}/transactions`);
  }

  // Créer une transaction
  createTransaction(request: any): Observable<Transaction> {
    return this.http.post<Transaction>('http://localhost:8080/api/transactions', request);
  }

  getTransactionsByClientAndPeriode(clientId: number, debut: string, fin: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/clients/${clientId}/transactions/periode`, {
      params: { debut, fin }
    });
  }

  getReleveClient(clientId: number, debut: string, fin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${clientId}/releve`, {
      params: { debut, fin }
    });
  }

  downloadReleveClientPdf(clientId: number, debut: string, fin: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/clients/${clientId}/releve/pdf`, {
      params: { debut, fin },
      responseType: 'blob'
    });
  }

  // Exécuter une opération pour un client (admin)
  executeOperationForClient(operation: OperationRequest): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/comptes/admin/operation', operation);
  }
}
