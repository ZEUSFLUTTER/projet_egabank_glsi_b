export interface TransactionModele {
  id?: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateOperation: string;
  libelle?: string;
  compteSource?: {
    id: number;
    numeroCompte: string;
    proprietaire?: {
      nom: string;
      prenom: string;
    };
  };
  compteDestination?: {
    id: number;
    numeroCompte: string;
    proprietaire?: {
      nom: string;
      prenom: string;
    };
  };
}

export interface ReleveDTO {
  compteId: number;
  dateDebut: string;
  dateFin: string;
}