export enum AdminType {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
}

export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    username: string;
    numero: string;
    role: AdminType;
    dateCreation: Date;
}