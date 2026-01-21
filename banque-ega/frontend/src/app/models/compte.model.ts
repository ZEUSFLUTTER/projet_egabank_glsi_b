export enum TypeCompte {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE'
}

export interface Compte {
  id?: number;
  numeroCompte?: string;
  typeCompte: TypeCompte;
  dateCreation?: string;
  solde?: number;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
}

