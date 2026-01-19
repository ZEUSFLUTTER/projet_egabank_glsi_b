export interface User {
  token: string;
  role: string;
  email?: string;
  id?: number;
}


export interface Client {
  password?: string;
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaiss: string;
  nationalite: string;
  sexe: 'Masculin' | 'Féminin';
  // dateCreation : string;
}

export interface Compte {
  id?: number;
  numeroCompte: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  solde: number;
  statut: StatutCompte;
  dateCreation: string;
  client?: Client;
}

export interface Transaction {
  id: number;
  refTransaction: string;
  type: 'VIREMENT' | 'VERSEMENT' | 'RETRAIT';
  montant: number;
  dateTransaction: string;
  description: string;
  compteSource: Compte;
  compteDestination?: Compte;
}

export interface DemandeCompte {
  id: number;
  client?: Client;
  typeCompte: 'COURANT' | 'EPARGNE';
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  dateDemande: string;
  dateTraitement?: string;
  motifRejet?: string;
}

export interface DashboardStats {
  totalClients: number;
  demandesTraitees: number;
  volumeTransactions: number;
}

export enum StatutCompte {
  ACTIF = 'ACTIF',
  SUSPENDU = 'SUSPENDU',
  CLOTURE = 'CLOTURE'
}
export interface CreateCompteDto {
  clientId: number;
  typeCompte: 'COURANT' | 'EPARGNE';
}

