import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Client } from '../models/bank.models';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private clients: Client[] = [
        {
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
        },
        {
            id: '2',
            nom: 'Watkins',
            prenom: 'Dorothy',
            dateNaissance: new Date(1985, 10, 22),
            sexe: 'F',
            adresse: '45 High Street, London',
            telephone: '+33 7 88 99 00 11',
            email: 'dorothy@bank.com',
            nationalite: 'Britannique',
            dateInscription: new Date(2023, 2, 10),
            statut: 'Actif'
        }
    ];

    getClients(): Observable<Client[]> {
        return of(this.clients).pipe(delay(500));
    }

    getClientById(id: string): Observable<Client | undefined> {
        return of(this.clients.find(c => c.id === id)).pipe(delay(300));
    }

    searchClients(term: string): Observable<Client[]> {
        const lowerTerm = term.toLowerCase();
        return of(this.clients.filter(c =>
            c.nom.toLowerCase().includes(lowerTerm) ||
            c.prenom.toLowerCase().includes(lowerTerm) ||
            c.email.toLowerCase().includes(lowerTerm)
        )).pipe(delay(300));
    }

    createClient(client: Omit<Client, 'id' | 'dateInscription' | 'statut'>): Observable<Client> {
        const newClient: Client = {
            ...client,
            id: Math.random().toString(36).substr(2, 9),
            dateInscription: new Date(),
            statut: 'Actif'
        };
        this.clients.push(newClient);
        return of(newClient).pipe(delay(500));
    }

    updateClient(id: string, clientData: Partial<Client>): Observable<Client> {
        const index = this.clients.findIndex(c => c.id === id);
        if (index !== -1) {
            this.clients[index] = { ...this.clients[index], ...clientData };
            return of(this.clients[index]).pipe(delay(500));
        }
        throw new Error('Client not found');
    }

    deleteClient(id: string): Observable<boolean> {
        this.clients = this.clients.filter(c => c.id !== id);
        return of(true).pipe(delay(500));
    }
}
