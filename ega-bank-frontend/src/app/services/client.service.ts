import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClientDTO {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance?: string;
  sexe?: string;
  nationalite?: string;
  password?: string;
  typeCompte?: 'COURANT' | 'EPARGNE';
  dateCreation?: string;
  role?: string;
  comptes?: CompteInfo[];
}

export interface CompteInfo {
  id: number;
  numeroCompte: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  solde: number;
  dateCreation: string;
  proprietaire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
}

export interface TransactionInfo {
  id: number;
  montant: number;
  typeTransaction: string;
  dateTransaction: string;
  description?: string;
  statut: string;
  compteSource?: CompteInfo;
  compteDestination?: CompteInfo;
}

export interface DashboardStats {
  totalClients: number;
  totalComptes: number;
  soldeTotal: number;
  totalTransactions: number;
}

export interface SoldeResponse {
  solde: number;
  iban: string;
}

export interface VirementRequest {
  ibanDestinataire: string;
  montant: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Client endpoints
  getSolde(): Observable<SoldeResponse> {
    return this.http.get<SoldeResponse>(`${this.API_URL}/clients/me/solde`);
  }

  effectuerVirement(virement: VirementRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/clients/virement`, virement);
  }

  // Admin endpoints
  getAllClients(): Observable<ClientDTO[]> {
    return this.http.get<ClientDTO[]>(`${this.API_URL}/admin/clients`);
  }

  getClientById(id: number): Observable<ClientDTO> {
    return this.http.get<ClientDTO>(`${this.API_URL}/admin/clients/${id}`);
  }

  createClient(client: ClientDTO): Observable<ClientDTO> {
    return this.http.post<ClientDTO>(`${this.API_URL}/admin/clients`, client);
  }

  updateClient(id: number, client: ClientDTO): Observable<ClientDTO> {
    return this.http.put<ClientDTO>(`${this.API_URL}/admin/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/clients/${id}`);
  }

  getClientComptes(clientId: number): Observable<CompteInfo[]> {
    return this.http.get<CompteInfo[]>(`${this.API_URL}/admin/clients/${clientId}/comptes`);
  }

  getClientTransactions(clientId: number): Observable<TransactionInfo[]> {
    return this.http.get<TransactionInfo[]>(`${this.API_URL}/admin/clients/${clientId}/transactions`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/admin/dashboard/stats`);
  }

  // Profile endpoints
  getMyProfile(): Observable<ClientDTO> {
    return this.http.get<ClientDTO>(`${this.API_URL}/clients/me/profile`);
  }

  updateMyProfile(profile: any): Observable<ClientDTO> {
    return this.http.put<ClientDTO>(`${this.API_URL}/clients/me/profile`, profile);
  }

  // Transactions endpoints
  getAllTransactions(): Observable<TransactionInfo[]> {
    return this.http.get<TransactionInfo[]>(`${this.API_URL}/admin/transactions`);
  }
}