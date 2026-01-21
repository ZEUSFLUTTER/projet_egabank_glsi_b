import { Client } from './client.model';

export enum TypeCompte {
    Courant = 'Courant',
    Epargne = 'Epargne'
}

export interface Compte {
    id: string;
    solde: number;
    type: TypeCompte;
    estSupprime: boolean;
    client?: Client;
    dateCreation?: string;
}