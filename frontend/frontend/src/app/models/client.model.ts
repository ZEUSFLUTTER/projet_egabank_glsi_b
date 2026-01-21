export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  courriel: string;
  adresse: string;
  numTelephone: string;
  nationalite: string;
  password?: string; // Mot de passe généré (uniquement lors de la création)
}

