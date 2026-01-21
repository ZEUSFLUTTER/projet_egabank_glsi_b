import { CompteModele } from './compte-modele';

export interface ClientModele {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'MASCULIN' | 'FEMININ';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  motDePasse?: string;

  comptes?: CompteModele[];
}
