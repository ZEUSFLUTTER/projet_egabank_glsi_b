export interface Account {
  id?: number;
  numeroCompte?: string;
  typeCompte: 'COMPTE_EPARGNE' | 'COMPTE_COURANT';
  dateCreation?: string;
  solde?: number;
  proprietaireId: number;
  proprietaireNom?: string;
}
