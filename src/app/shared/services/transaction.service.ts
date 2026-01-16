import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Transaction } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    private transactions: Transaction[] = [
        {
            id: 'T1',
            date: new Date(),
            type: 'DEPOT',
            montant: 500,
            description: 'Dépôt espèce guichet',
            compteDestination: 'C1',
            statut: 'SUCCESS'
        },
        {
            id: 'T2',
            date: new Date(Date.now() - 86400000),
            type: 'VIREMENT',
            montant: 120,
            description: 'Virement loyer',
            compteSource: 'C1',
            compteDestination: 'C99',
            statut: 'SUCCESS'
        }
    ];

    getTransactions(filters?: any): Observable<Transaction[]> {
        let filtered = [...this.transactions];
        if (filters) {
            if (filters.type) filtered = filtered.filter(t => t.type === filters.type);
            if (filters.compteId) {
                filtered = filtered.filter(t => t.compteSource === filters.compteId || t.compteDestination === filters.compteId);
            }
        }
        return of(filtered.sort((a, b) => b.date.getTime() - a.date.getTime())).pipe(delay(500));
    }

    createTransaction(t: Omit<Transaction, 'id' | 'date' | 'statut'>): Observable<Transaction> {
        const newTransaction: Transaction = {
            ...t,
            id: 'T' + Math.floor(Math.random() * 10000),
            date: new Date(),
            statut: 'SUCCESS'
        };
        this.transactions.push(newTransaction);
        return of(newTransaction).pipe(delay(500));
    }
}
