export interface AuthRequest {
  courriel: string;
  motDePasse: string;
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN'
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  courriel: string;
  role: Role;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  courriel: string;
  motDePasse: string;
  dateNaissance: string;
  sexe: string;
  adresse: string;
  telephone: string;
  nationalite: string;
}

