export type UserRole = 'ADMIN' | 'CLIENT';

export interface AuthUser {
    id: string;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    role: UserRole;
    token?: string;
}

export interface AuthResponse {
    user: AuthUser;
    token: string;
}
