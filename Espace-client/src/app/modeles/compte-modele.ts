export interface CompteModele {
  id?: number;
  numeroCompte: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  solde: number;
  dateCreation: string;
  proprietaire?: {
    id: number;
    nom: string;
    prenom: string;
    courriel: string;
  };
  decouvertAutorise?: number;
  tauxInteret?: number;
}

export interface OperationDTO {
  compteId: number;
  montant: number;
  description?: string;
}

export interface VirementDTO {
  compteSourceId: number;
  compteDestinationId?: number;
  numeroCompteDestination?: string;
  montant: number;
  description?: string;
}

export interface CreationCompteDTO {
  typeCompte: 'COURANT' | 'EPARGNE';
}