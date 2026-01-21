import { CompteModele } from './compte-modele';

export interface TransactionModele {
  id?: number;
  dateOperation: string;
  montant: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  libelle: string;

  compteSource?: CompteModele;
  compteDestination?: CompteModele;
}
