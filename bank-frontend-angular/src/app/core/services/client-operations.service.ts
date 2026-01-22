import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Client, Compte, Transaction, OperationClientDto, VirementDto } from '../models/client.model';
import { environment } from '../../../environments/environment';

/**
 * Service pour les opérations bancaires spécifiques au client connecté
 * Conforme au cahier des charges : "possibilités pour un client de..."
 */
@Injectable({
  providedIn: 'root'
})
export class ClientOperationsService {
  private readonly API_URL = `${environment.apiUrl}/client`;

  constructor(private http: HttpClient) {}

  /**
   * Obtenir le profil du client connecté
   */
  getMonProfil(): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/mon-profil`);
  }

  /**
   * Obtenir tous les comptes du client connecté
   */
  getMesComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.API_URL}/mes-comptes`);
  }

  /**
   * Faire un versement sur son compte
   */
  effectuerDepotSurMonCompte(numeroCompte: string, operation: OperationClientDto): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}/mes-comptes/${numeroCompte}/depot`, operation);
  }

  /**
   * Faire un retrait sur son compte si le solde le permet
   */
  effectuerRetraitSurMonCompte(numeroCompte: string, operation: OperationClientDto): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.API_URL}/mes-comptes/${numeroCompte}/retrait`, operation);
  }

  /**
   * Faire un virement d'un compte à un autre
   */
  effectuerVirementEntreComptes(virement: VirementDto): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.API_URL}/mes-comptes/virement`, virement);
  }

  /**
   * Afficher toutes les transactions effectuées sur un compte au cours d'une période donnée
   */
  getTransactionsDeMonCompte(numeroCompte: string, dateDebut?: string, dateFin?: string): Observable<Transaction[]> {
    let url = `${this.API_URL}/mes-comptes/${numeroCompte}/transactions`;
    const params: string[] = [];
    
    if (dateDebut) {
      params.push(`dateDebut=${dateDebut}`);
    }
    if (dateFin) {
      params.push(`dateFin=${dateFin}`);
    }
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    return this.http.get<Transaction[]>(url);
  }

  /**
   * Imprimer le relevé du client
   */
  imprimerMonReleve(numeroCompte: string, dateDebut: string, dateFin: string): Observable<string> {
    const url = `${this.API_URL}/mes-comptes/${numeroCompte}/releve?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    return this.http.get(url, { responseType: 'text' });
  }

  /**
   * Télécharger le relevé du client
   */
  telechargerMonReleve(numeroCompte: string, dateDebut: string, dateFin: string): Observable<Blob> {
    const url = `${this.API_URL}/mes-comptes/${numeroCompte}/releve?dateDebut=${dateDebut}&dateFin=${dateFin}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}