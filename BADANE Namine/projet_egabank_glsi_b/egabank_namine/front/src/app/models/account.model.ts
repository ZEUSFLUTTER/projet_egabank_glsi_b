export interface Account {
  id: number;
  numeroCompte: string;
  typeCompte: 'EPARGNE' | 'COURANT';
  solde: number;
  dateCreation: Date;
  client_id: number;
  actif: boolean;
}