export interface Client {
  id: number;
  user_id: number;
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: 'M' | 'F';
  adresse: string;
  telephone: string;
  email: string;
  nationalite: string;
  createdAt: Date;
}