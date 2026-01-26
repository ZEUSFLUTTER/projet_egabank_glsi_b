export interface Client {
  id: number;
  prenom: string;
  nom: string;
  sexe: string | null;
  nationalite: string | null;
  adresse: string | null;
  dateNaissance: string | null; // ISO string (LocalDate)
  email: string;
  telephone: string;
}