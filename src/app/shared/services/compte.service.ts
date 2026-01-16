import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Compte } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class CompteService {
    private comptes: Compte[] = [
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

    getComptes(): Observable<Compte[]> {
        return of(this.comptes).pipe(delay(500));
    }

    getComptesByClientId(clientId: string): Observable<Compte[]> {
        return of(this.comptes.filter(c => c.clientId === clientId)).pipe(delay(300));
    }

    getCompteById(id: string): Observable<Compte | undefined> {
        return of(this.comptes.find(c => c.id === id)).pipe(delay(300));
    }

    createCompte(clientId: string, clientNom: string, type: 'COURANT' | 'EPARGNE'): Observable<Compte> {
        const newCompte: Compte = {
            id: 'C' + Math.floor(Math.random() * 1000),
            numeroCompte: 'FR76 ' + Math.floor(Math.random() * 10000000000000000),
            solde: 0,
            type,
            dateCreation: new Date(),
            clientId,
            clientNom,
            devise: 'EUR',
            statut: 'ACTIF'
        };
        this.comptes.push(newCompte);
        return of(newCompte).pipe(delay(600));
    }

    updateSolde(compteId: string, montant: number): Observable<Compte> {
        const index = this.comptes.findIndex(c => c.id === compteId);
        if (index !== -1) {
            this.comptes[index].solde += montant;
            return of(this.comptes[index]).pipe(delay(300));
        }
        throw new Error('Compte non trouvé');
    }
}
