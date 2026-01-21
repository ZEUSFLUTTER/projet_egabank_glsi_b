export enum TypeCompte {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE'
}

export interface Compte {
  id?: number;
  numeroCompte: string;
  clientId: number;
  clientNom?: string;
  clientPrenom?: string;
  typeCompte: TypeCompte;
  solde: number;
  actif: boolean;
}
