export interface User {
  id?: number;
  matricule: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  role?: Role;
}

export interface Role {
  id: number;
  label: RoleType;
}

export enum RoleType {
  ADMIN = 'ADMIN',
  GESTIONNAIRE = 'GESTIONNAIRE',
  CAISSIERE = 'CAISSIERE'
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
