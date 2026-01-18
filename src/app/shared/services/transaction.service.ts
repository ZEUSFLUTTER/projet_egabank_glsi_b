import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Transaction, mapTransactionFromBackend } from '../models/bank.models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private apiUrl = `${environment.apiUrl}/transactions`;

    constructor(private http: HttpClient) { }

    // Helper: Formater une date en ISO pour le backend
    private formatDateForBackend(date: string | Date | undefined): string {
        if (!date) {
            return '';
        }
        if (typeof date === 'string') {
            // Si c'est déjà au format YYYY-MM-DD, ajouter l'heure
            if (date.length === 10) {
                return `${date}T00:00:00`;
            }
            return date;
        }
        return date.toISOString().slice(0, 19); // Format sans timezone
    }

    // ADMIN: Liste globale de toutes les transactions
    // Endpoint: GET /api/transactions/history
    getAllTransactions(): Observable<Transaction[]> {
        console.log('[TransactionService] Fetching ALL transactions (admin)');
        return this.http.get<any[]>(`${this.apiUrl}/history`).pipe(
            map(items => {
                console.log('[TransactionService] Raw response:', items);
                return (items || []).map(mapTransactionFromBackend);
            })
        );
    }

    // Méthode flexible pour admin ou client avec filtres
    getTransactions(filters?: { compteId?: string; type?: string; dateDebut?: string; dateFin?: string; start?: string; end?: string }): Observable<Transaction[]> {
        console.log('[TransactionService] getTransactions called with filters:', filters);

        if (filters?.compteId) {
            // Utilise l'historique par IBAN si un compte est spécifié
            const start = filters.start || filters.dateDebut;
            const end = filters.end || filters.dateFin;
            return this.getHistoryByAccount(filters.compteId, start, end).pipe(
                map(transactions => {
                    // Filtrer par type si spécifié
                    if (filters.type) {
                        return transactions.filter(t => t.type === filters.type);
                    }
                    return transactions;
                })
            );
        }

        // ADMIN: Liste globale via GET /api/transactions/history
        return this.getAllTransactions().pipe(
            map(transactions => {
                // Filtrer par type si spécifié
                if (filters?.type) {
                    return transactions.filter(t => t.type === filters.type);
                }
                return transactions;
            })
        );
    }

    // Client/Admin: Historique par numéro de compte (IBAN)
    // Endpoint: GET /api/transactions/history/{accountNumber}?start=...&end=...
    getHistoryByAccount(accountNumber: string, start?: string, end?: string): Observable<Transaction[]> {
        console.log('[TransactionService] Fetching history for account:', accountNumber);

        // Dates par défaut si non fournies
        let effectiveStart = start;
        let effectiveEnd = end;

        if (!effectiveStart) {
            // Par défaut : depuis 3 mois (au lieu de 5 ans pour éviter les réponses JSON trop volumineuses)
            const d = new Date();
            d.setMonth(d.getMonth() - 3);
            effectiveStart = d.toISOString().split('T')[0];
        }

        if (!effectiveEnd) {
            // Par défaut : demain (pour inclure aujourd'hui)
            const d = new Date();
            d.setDate(d.getDate() + 1);
            effectiveEnd = d.toISOString().split('T')[0];
        }

        const startFormatted = this.formatDateForBackend(effectiveStart);
        const endFormatted = this.formatDateForBackend(effectiveEnd);

        const url = `${this.apiUrl}/history/${encodeURIComponent(accountNumber)}?start=${encodeURIComponent(startFormatted)}&end=${encodeURIComponent(endFormatted)}`;

        console.log('[TransactionService] Request URL:', url);

        return this.http.get<any[]>(url).pipe(
            map(items => {
                console.log('[TransactionService] History response:', items);
                return (items || []).map(mapTransactionFromBackend);
            })
        );
    }

    // Alias pour compatibilité
    getHistory(iban: string, start?: string, end?: string): Observable<Transaction[]> {
        return this.getHistoryByAccount(iban, start, end);
    }

    // Admin: Dépôt
    // Endpoint: POST /transactions/deposit
    // Réponse API: string "Dépôt effectué avec succès"
    deposit(accountNumber: string, amount: number, description: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/deposit`, {
            accountNumber,
            amount,
            description
        }, { responseType: 'text' });
    }

    // Admin: Retrait
    // Endpoint: POST /transactions/withdraw
    // Réponse API: string "Retrait effectué avec succès"
    withdraw(accountNumber: string, amount: number, description: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/withdraw`, {
            accountNumber,
            amount,
            description
        }, { responseType: 'text' });
    }

    // Client/Admin: Virement
    // Endpoint: POST /transactions/transfer
    // Réponse API: string "Virement effectué avec succès"
    transfer(accountNumber: string, targetAccountNumber: string, amount: number, description: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/transfer`, {
            accountNumber,
            targetAccountNumber,
            amount,
            description
        }, { responseType: 'text' });
    }

    // Pour compatibilité avec l'ancien code
    // Retourne Observable<string> car les endpoints retournent des messages texte
    createTransaction(t: any): Observable<string> {
        if (t.type === 'DEPOT' || t.type === 'DEPOSIT') {
            return this.deposit(t.accountNumber || t.compteSource, t.amount || t.montant, t.description);
        }
        if (t.type === 'RETRAIT' || t.type === 'WITHDRAWAL') {
            return this.withdraw(t.accountNumber || t.compteSource, t.amount || t.montant, t.description);
        }
        return this.transfer(
            t.accountNumber || t.compteSource,
            t.targetAccountNumber || t.compteDestination,
            t.amount || t.montant,
            t.description
        );
    }
}

