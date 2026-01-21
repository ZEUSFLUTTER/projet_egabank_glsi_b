export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_AGENT = 'ROLE_AGENT'
}

export interface AuthRequest {
  courriel: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  dateNaissance: string; 
  sexe: string;
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  motDePasse: string;
  role?: Role;
}

export interface AuthResponse {
  accessToken: string;      
  refreshToken: string;     
  type: string;             
  userId: number;
  courriel: string;
  role: Role;
  expiresIn: number;
}
