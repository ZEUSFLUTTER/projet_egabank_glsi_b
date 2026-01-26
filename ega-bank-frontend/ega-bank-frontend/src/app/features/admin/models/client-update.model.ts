export interface ClientUpdate {
  prenom: string;
  nom: string;
  dateNaissance: string; // LocalDate → string ISO
  sexe: string;
  adresse: string;
  nationalite: string;
  telephone: string;
}