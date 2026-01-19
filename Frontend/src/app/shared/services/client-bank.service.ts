import { Injectable } from '@angular/core';
import { Observable, map, switchMap, of, forkJoin, catchError } from 'rxjs';
import { Client, Compte, Releve, Transaction } from '../models/bank.models';
import { ClientService } from './client.service';
import { CompteService } from './compte.service';
import { TransactionService } from './transaction.service';
import { ReleveService } from './releve.service';

@Injectable({ providedIn: 'root' })
export class ClientBankService {

    constructor(
        private clientService: ClientService,
        private compteService: CompteService,
        private transactionService: TransactionService,
        private releveService: ReleveService
    ) { }

    // Profil du client connecté
    getProfile(): Observable<Client> {
        return this.clientService.getClientMe();
    }

    // Mes comptes bancaires
    getAccounts(): Observable<Compte[]> {
        return this.compteService.getMyAccounts();
    }

    // Détail d'un compte par ID
    getAccountById(id: string): Observable<Compte> {
        return this.compteService.getCompteById(id);
    }

    // Trouver un compte par son numéro IBAN
    getAccountByNumero(numeroCompte: string): Observable<Compte | undefined> {
        return this.compteService.getCompteByNumero(numeroCompte);
    }

    // Historique des transactions (par compte ou global pour le client)
    getTransactions(filters?: {
        type?: string;
        dateDebut?: string;
        dateFin?: string;
        compteId?: string
    }): Observable<Transaction[]> {
        // Si un compte spécifique est demandé
        if (filters?.compteId) {
            return this.transactionService.getTransactions(filters);
        }

        // Sinon, pour un client, on doit récupérer l'historique de TOUS ses comptes
        // car il n'a pas accès à l'endpoint global /transactions/history (réservé ADMIN)
        return this.getAccounts().pipe(
            switchMap(accounts => {
                if (!accounts || accounts.length === 0) {
                    return of([]);
                }

                // Créer un appel pour chaque compte
                const requests = accounts.map(acc =>
                    this.transactionService.getTransactions({
                        ...filters,
                        compteId: acc.numeroCompte // Utiliser le numéro de compte (IBAN)
                    }).pipe(
                        // En cas d'erreur sur un compte, on retourne une liste vide pour ne pas bloquer tout
                        catchError(() => of([]))
                    )
                );

                // Exécuter tous les appels en parallèle
                return forkJoin(requests).pipe(
                    map(results => {
                        // Aplatir le tableau de tableaux [[t1, t2], [t3]] -> [t1, t2, t3]
                        const allTransactions = results.flat();

                        // Trier par date décroissante
                        return allTransactions.sort((a, b) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        );
                    })
                );
            })
        );
    }

    // Effectuer un virement
    // Le formulaire envoie: compteSource, compteDestination, montant, description
    // Le backend attend: accountNumber, targetAccountNumber, amount, description
    // Le backend retourne: string "Virement effectué avec succès"
    performTransfer(transferData: {
        compteSource: string;
        compteDestination: string;
        montant: number;
        description: string;
    }): Observable<string> {
        return this.transactionService.transfer(
            transferData.compteSource,          // accountNumber
            transferData.compteDestination,     // targetAccountNumber
            transferData.montant,               // amount
            transferData.description            // description
        );
    }

    // Générer un relevé de compte
    generateReleve(numeroCompte: string, start: Date | string, end: Date | string): Observable<Releve> {
        return this.releveService.generateReleve(numeroCompte, start, end);
    }
}

