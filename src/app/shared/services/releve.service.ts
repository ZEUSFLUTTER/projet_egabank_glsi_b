import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Releve, Transaction } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class ReleveService {
    generateReleve(compteId: string, dateDebut: Date, dateFin: Date, transactions: Transaction[]): Observable<Releve> {
        const filteredTransactions = transactions.filter(t =>
            t.date >= dateDebut && t.date <= dateFin &&
            (t.compteSource === compteId || t.compteDestination === compteId)
        );

        const releve: Releve = {
            id: 'REL' + Math.floor(Math.random() * 1000),
            compteId,
            dateDebut,
            dateFin,
            soldeInitial: 2000, // Mock
            soldeFinal: 2500,  // Mock
            transactions: filteredTransactions
        };

        return of(releve).pipe(delay(800));
    }
}
