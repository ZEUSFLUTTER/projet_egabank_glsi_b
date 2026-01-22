export interface Transaction {
  id?: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction?: string;
  numeroCompte: string;
  compteDestination?: string;
  description?: string;
}

export interface DepotRequest {
  numeroCompte: string;
  montant: number;
  description?: string;
}

export interface RetraitRequest {
  numeroCompte: string;
  montant: number;
  description?: string;
}

export interface VirementRequest {
  numeroCompteSource: string;
  numeroCompteDestination: string;
  montant: number;
  description?: string;
}

export interface TransactionFilter {
  numeroCompte: string;
  dateDebut: string;
  dateFin: string;
}
