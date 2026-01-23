// src/app/models/client.model.ts
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'MASCULIN' | 'FEMININ' | 'AUTRE';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  dateCreation?: string;
}

