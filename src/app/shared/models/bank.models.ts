export interface Client {
    id: string;
    nom: string;
    prenom: string;
    dateNaissance: Date;
    sexe: 'M' | 'F';
    adresse: string;
    telephone: string;
    email: string;
    nationalite: string;
    dateInscription: Date;
    statut: 'Actif' | 'Suspendu';
}

export interface Compte {
    id: string;
    numeroCompte: string;
    solde: number;
    type: 'COURANT' | 'EPARGNE';
    dateCreation: Date;
    clientId: string;
    clientNom?: string; // Facilité pour l'affichage
    devise: string;
    statut: 'ACTIF' | 'BLOQUE';
}

export interface Transaction {
    id: string;
    type: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
    montant: number;
    date: Date;
    description: string;
    compteSource?: string;
    compteDestination?: string;
    statut: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Releve {
    id: string;
    compteId: string;
    dateDebut: Date;
    dateFin: Date;
    soldeInitial: number;
    soldeFinal: number;
    transactions: Transaction[];
}

// Models pour le Dashboard Client (S'assure de la compatibilité)
export interface ClientUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: Date;
}

export interface ClientAccount {
    id: string;
    accountNumber: string;
    label: string;
    balance: number;
    currency: string;
    type: 'CHECKING' | 'SAVINGS';
}

export interface BankTransaction {
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    status: 'COMPLETED' | 'PENDING';
}
