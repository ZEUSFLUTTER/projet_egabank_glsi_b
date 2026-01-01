import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Compte, Transaction } from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = '/api';

    constructor(private http: HttpClient) { }

    // Clients
    getClients(): Observable<Client[]> {
        return this.http.get<Client[]>(`${this.baseUrl}/clients`);
    }

    getClientById(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.baseUrl}/clients/${id}`);
    }

    getClientByEmail(email: string): Observable<Client> {
        return this.http.get<Client>(`${this.baseUrl}/clients/email/${email}`);
    }

    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(`${this.baseUrl}/clients`, client);
    }

    updateClient(id: number, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.baseUrl}/clients/${id}`, client);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
    }

    getClientAccounts(id: number): Observable<Compte[]> {
        return this.http.get<Compte[]>(`${this.baseUrl}/clients/${id}/comptes`);
    }

    // Comptes
    getComptes(): Observable<Compte[]> {
        return this.http.get<Compte[]>(`${this.baseUrl}/comptes`);
    }

    getCompteById(id: number): Observable<Compte> {
        return this.http.get<Compte>(`${this.baseUrl}/comptes/${id}`);
    }

    getCompteByNumero(numero: string): Observable<Compte> {
        return this.http.get<Compte>(`${this.baseUrl}/comptes/numero/${numero}`);
    }

    createCompteEpargne(clientId: number, tauxInteret?: number): Observable<Compte> {
        return this.http.post<Compte>(`${this.baseUrl}/comptes/epargne`, { clientId, tauxInteret });
    }

    createCompteCourant(clientId: number, decouvertAutorise?: number): Observable<Compte> {
        return this.http.post<Compte>(`${this.baseUrl}/comptes/courant`, { clientId, decouvertAutorise });
    }

    deleteCompte(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/comptes/${id}`);
    }

    // Transactions
    getTransactionsByCompte(compteId: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/compte/${compteId}`);
    }

    effectuerDepot(compteId: number, montant: number, description: string): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.baseUrl}/transactions/depot`, { compteId, montant, description });
    }

    effectuerRetrait(compteId: number, montant: number, description: string): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.baseUrl}/transactions/retrait`, { compteId, montant, description });
    }

    effectuerVirement(compteSourceId: number, compteDestinationId: number, montant: number, description: string): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.baseUrl}/transactions/virement`, { compteSourceId, compteDestinationId, montant, description });
    }

    // Relevés
    getReleveMensuel(compteId: number, annee: number, mois: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/releves/${compteId}/mensuel`, {
            params: { annee, mois }
        });
    }

    getReleveAnnuel(compteId: number, annee: number): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/releves/${compteId}/annuel`, {
            params: { annee }
        });
    }

    getRelevePeriode(compteId: number, dateDebut: string, dateFin: string): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.baseUrl}/releves/${compteId}`, {
            params: { dateDebut, dateFin }
        });
    }

    // Téléchargement PDF des relevés
    downloadReleveMensuelPdf(compteId: number, annee: number, mois: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/releves/${compteId}/mensuel/pdf`, {
            params: { annee, mois },
            responseType: 'blob'
        });
    }

    downloadReleveAnnuelPdf(compteId: number, annee: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/releves/${compteId}/annuel/pdf`, {
            params: { annee },
            responseType: 'blob'
        });
    }

    downloadRelevePeriodePdf(compteId: number, dateDebut: string, dateFin: string): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/releves/${compteId}/pdf`, {
            params: { dateDebut, dateFin },
            responseType: 'blob'
        });
    }
}
