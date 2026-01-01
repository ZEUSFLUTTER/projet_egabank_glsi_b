export interface Client {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    dateNaissance: string;
    nationalite: string;
    sexe: 'M' | 'F';
}

export enum TypeCompte {
    COURANT = 'COURANT',
    EPARGNE = 'EPARGNE'
}

export interface Compte {
    id?: number;
    numeroCompte: string;
    solde: number;
    type: TypeCompte;
    dateCreation: string;
    clientId: number;
    clientNom?: string;
    clientPrenom?: string;
    tauxInteret?: number;
    decouvertAutorise?: number;
}

export enum TypeTransaction {
    DEPOT = 'DEPOT',
    RETRAIT = 'RETRAIT',
    VIREMENT = 'VIREMENT'
}

export interface Transaction {
    id?: number;
    montant: number;
    dateTransaction: string;
    typeTransaction: TypeTransaction;
    description: string;
    compteId: number;
    compteDestinataireId?: number;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    type: string;
    username: string;
    email: string;
    role: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    details?: string[];
}
