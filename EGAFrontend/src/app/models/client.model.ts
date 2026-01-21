import { Compte } from "./compte.model";

export enum Sexe {
    Masculin = 'Masculin',
    Feminin = 'Feminin'
}

export interface Client {
    dateInscription: string|number|Date;
    id?: number;
    nom: string;
    prenom: string;
    dateNaissance: string|number|Date;
    nationalite: string;
    email: string;
    sexe: Sexe;
    telephone?: string;
    estSupprime: boolean;
    comptes: Compte[];
}