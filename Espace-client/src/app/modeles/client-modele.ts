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
  dateCreation?: string;
}

export interface InscriptionClientDTO {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'MASCULIN' | 'FEMININ';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  motDePasse: string;
}

export interface ConnexionClientDTO {
  courriel: string;
  motDePasse: string;
}

export interface AuthJetonDTO {
  jeton: string;
  client: ClientModele;
}