export interface Compte {
  id?: number;
  numCompte?: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  dateCreation?: string;
  solde?: number;
  clientId: number;
}

