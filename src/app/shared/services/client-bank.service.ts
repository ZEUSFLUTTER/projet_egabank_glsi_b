import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Client, Compte, Transaction, Releve } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class ClientBankService {
    // Simule l'utilisateur connecté (Sajibur Rahman, ID: 1)
    private currentClientId = '1';

    private mockClient: Client = {
        id: '1',
        nom: 'Rahman',
        prenom: 'Sajibur',
        dateNaissance: new Date(1990, 5, 15),
        sexe: 'M',
        adresse: '123 Avenue de Paris, 75001 Paris',
        telephone: '+33 6 12 34 56 78',
        email: 'sajibur@bank.com',
        nationalite: 'Française',
        dateInscription: new Date(2023, 0, 1),
        statut: 'Actif'
    };

    private mockAccounts: Compte[] = [
        {
            id: 'C1',
            numeroCompte: 'FR76 1234 5678 9012 3456',
            solde: 2500.50,
            type: 'COURANT',
            dateCreation: new Date(2023, 0, 1),
            clientId: '1',
            clientNom: 'Rahman Sajibur',
            devise: 'EUR',
            statut: 'ACTIF'
        },
        {
            id: 'C2',
            numeroCompte: 'FR76 8888 7777 6666 5555',
            solde: 15400.00,
            type: 'EPARGNE',
            dateCreation: new Date(2023, 1, 15),
            clientId: '1',
            clientNom: 'Rahman Sajibur',
            devise: 'EUR',
            statut: 'ACTIF'
        }
    ];

    private mockTransactions: Transaction[] = [
        { id: 'T1', date: new Date(), type: 'DEPOT', montant: 500, description: 'Dépôt espèce guichet', compteDestination: 'C1', statut: 'SUCCESS' },
        { id: 'T2', date: new Date(Date.now() - 86400000), type: 'VIREMENT', montant: 120, description: 'Virement loyer', compteSource: 'C1', compteDestination: 'C99', statut: 'SUCCESS' },
        { id: 'T3', date: new Date(Date.now() - 172800000), type: 'RETRAIT', montant: 50, description: 'Retrait ATM', compteSource: 'C1', statut: 'SUCCESS' },
        { id: 'T4', date: new Date(Date.now() - 259200000), type: 'DEPOT', montant: 3500, description: 'Salaire Janvier', compteDestination: 'C1', statut: 'SUCCESS' },
    ];

    getProfile(): Observable<Client> {
        return of(this.mockClient).pipe(delay(400));
    }

    getAccounts(): Observable<Compte[]> {
        return of(this.mockAccounts).pipe(delay(500));
    }

    getAccountById(id: string): Observable<Compte | undefined> {
        return of(this.mockAccounts.find(a => a.id === id)).pipe(delay(300));
    }

    getTransactions(filters?: { type?: string; dateDebut?: string; dateFin?: string }): Observable<Transaction[]> {
        let filtered = [...this.mockTransactions];
        if (filters) {
            if (filters.type) filtered = filtered.filter(t => t.type === filters.type);
            // Logique simplifiée pour les dates
            if (filters.dateDebut) {
                const start = new Date(filters.dateDebut);
                filtered = filtered.filter(t => t.date >= start);
            }
            if (filters.dateFin) {
                const end = new Date(filters.dateFin);
                filtered = filtered.filter(t => t.date <= end);
            }
        }
        return of(filtered.sort((a, b) => b.date.getTime() - a.date.getTime())).pipe(delay(600));
    }

    performTransfer(transferData: any): Observable<Transaction> {
        const newTransaction: Transaction = {
            id: 'T' + Math.floor(Math.random() * 10000),
            date: new Date(),
            type: 'VIREMENT',
            montant: transferData.montant,
            description: transferData.description,
            compteSource: transferData.compteSource,
            compteDestination: transferData.compteDestination,
            statut: 'SUCCESS'
        };

        // Simuler la mise à jour des soldes
        const srcAcc = this.mockAccounts.find(a => a.id === transferData.compteSource);
        if (srcAcc) srcAcc.solde -= transferData.montant;

        // Si c'est un virement interne
        const dstAcc = this.mockAccounts.find(a => a.id === transferData.compteDestination);
        if (dstAcc) dstAcc.solde += transferData.montant;

        this.mockTransactions.unshift(newTransaction);
        return of(newTransaction).pipe(delay(800));
    }

    generateReleve(compteId: string, start: Date, end: Date): Observable<Releve> {
        const transactions = this.mockTransactions.filter(t =>
            (t.compteSource === compteId || t.compteDestination === compteId) &&
            t.date >= start && t.date <= end
        );

        const releve: Releve = {
            id: 'REL-' + Math.floor(Math.random() * 1000),
            compteId,
            dateDebut: start,
            dateFin: end,
            soldeInitial: 2120, // Mock
            soldeFinal: 2500.5, // Mock
            transactions
        };
        return of(releve).pipe(delay(1000));
    }
}
