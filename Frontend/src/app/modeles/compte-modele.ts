import { ClientModele } from './client-modele';

export interface CompteModele {
  id?: number;
  numeroCompte: string;
  solde: number;
  dateCreation: string;
  typeCompte: 'COURANT' | 'EPARGNE';

  proprietaire?: ClientModele;

  decouvertAutorise?: number;
  tauxInteret?: number;
}
