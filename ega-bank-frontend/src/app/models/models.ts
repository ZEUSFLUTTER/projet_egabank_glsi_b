// Enums
export enum Role {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum Sexe {
  MASCULIN = 'MASCULIN',
  FEMININ = 'FEMININ'
}

export enum TypeCompte {
  EPARGNE = 'EPARGNE',
  COURANT = 'COURANT'
}

export enum TypeOperation {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  VIREMENT = 'VIREMENT'
}

// Interfaces
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: Sexe;
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  role: Role;
  password?: string;
  comptes?: Compte[];
}

export interface Compte {
  id?: number;
  numeroCompte: string;
  type: TypeCompte;
  dateCreation: string;
  solde: number;
}

export interface CompteAdmin extends Compte {
  proprietaire?: Client;
}

export interface Transaction {
  id?: number;
  type: TypeOperation;
  montant: number;
  dateOperation: string;
  compteSource?: Compte;
  compteDestination?: Compte;
  client?: Client;
  description?: string;
  clientNom?: string;
}

// DTOs
export interface ClientRequest {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: Sexe;
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  password?: string;
}

export interface AdminRequest extends ClientRequest {
  password: string;
}

export interface CompteRequestClient {
  type: TypeCompte;
  soldeInitial?: number;
}

export interface CompteRequestAdmin {
  type: TypeCompte;
  proprietaireId: number;
  soldeInitial?: number;
}

export interface OperationRequest {
  type: TypeOperation;
  montant: number;
  numeroCompteSource: string;
  numeroCompteDestination?: string;
  description?: string;
}

export interface ReleveResponse {
  numeroCompte: string;
  debut: string;
  fin: string;
  soldeInitial: number;
  soldeFinal: number;
  transactions: Transaction[];
}

export interface LoginRequest {
  courriel: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
  courriel: string;
}

// Interfaces spécifiques au dashboard admin
export interface ClientResponse {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: Sexe;
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  role: Role;
  nombreComptes: number;
}

export interface CompteResponse {
  id: number;
  numeroCompte: string;
  type: TypeCompte;
  dateCreation: string;
  solde: number;
  clientNom?: string;
  clientPrenom?: string;
}

export interface DashboardStats {
  totalClients: number;
  totalComptes: number;
  totalTransactions: number;
  soldeTotal: number;
}

export interface NewClientForm {
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  password: string;
}

export interface NewCompteForm {
  type: string;
  soldeInitial: number;
}

export interface LoginResponse {
  token: string;
  role: string;
  message?: string;
}
