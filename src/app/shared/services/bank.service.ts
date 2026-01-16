import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Transaction } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class BankService {
    getDashboardStats() {
        return of([
            { label: 'Total Clients', value: '1,250' },
            { label: 'Total Comptes', value: '3,420' },
            { label: 'Total Transactions', value: '84,849' },
            { label: 'Revenue Mensuel', value: '15,490 €' }
        ]).pipe(delay(300));
    }

    getRecentTransactions(): Observable<Transaction[]> {
        const transactions: Transaction[] = [
            { id: 'T1', type: 'DEPOT', montant: 2500, date: new Date(), description: 'Salaire', statut: 'SUCCESS' },
            { id: 'T2', type: 'VIREMENT', montant: 102.99, date: new Date(), description: 'Netflix & Spotify', statut: 'SUCCESS' },
            { id: 'T3', type: 'RETRAIT', montant: 80, date: new Date(), description: 'ATM Paris', statut: 'SUCCESS' }
        ];
        return of(transactions).pipe(delay(400));
    }
}
