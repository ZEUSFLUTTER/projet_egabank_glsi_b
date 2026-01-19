import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compte, Transaction, Client, DemandeCompte } from '../_models/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api';

  // --- LECTURE ---
  getComptesByClient(clientId: number) {
    return this.http.get<Compte[]>(`${this.apiUrl}/comptes/client/${clientId}`);
  }

  getHistorique(numeroCompte: string) {
    return this.http.get<Transaction[]>(`${this.apiUrl}/operations/historique/${numeroCompte}`);
  }

  getClientInfo(clientId: number) {
    return this.http.get<Client>(`${this.apiUrl}/clients/${clientId}`);
  }
  getMesDemandes(clientId: number) {
    return this.http.get<DemandeCompte[]>(`${this.apiUrl}/demandes/client/${clientId}`);
  }
  // --- PDF ---
  downloadRib(numeroCompte: string) {
    return this.http.get(`${this.apiUrl}/reports/rib/${numeroCompte}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  downloadReleve(numeroCompte: string, dateDebut: string, dateFin: string) {
    return this.http.get(
      `${this.apiUrl}/reports/releve/${numeroCompte}?debut=${dateDebut}&fin=${dateFin}`,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  // --- ÉCRITURE (Correspondance stricte avec tes DTOs Java) ---

  // 1. VERSEMENT (OperationDto: numeroCompte, montant)
  effectuerVersement(numeroCompte: string, montant: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/operations/versement`, {
      numeroCompte,
      montant,
    });
  }

  // 2. RETRAIT (OperationDto: numeroCompte, montant)
  effectuerRetrait(numeroCompte: string, montant: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/operations/retrait`, {
      numeroCompte,
      montant,
    });
  }

  // 3. DEMANDE COMPTE (DemandeCreationDto: clientId, typeCompte)
  creerDemandeCompte(clientId: number, typeCompte: string): Observable<DemandeCompte> {
    return this.http.post<DemandeCompte>(`${this.apiUrl}/demandes`, {
      clientId,
      typeCompte,
    });
  }
  effectuerVirement(compteEmetteur: string, compteBeneficiaire: string, montant: number): Observable<void> {
    const data = {
      compteEmetteur: compteEmetteur,       // Doit correspondre exactement au champ Java
      compteBeneficiaire: compteBeneficiaire, // Doit correspondre exactement au champ Java
      montant: montant,
      // description: description
    };

    return this.http.post<void>(`${this.apiUrl}/operations/virement`, data);
  }
}
