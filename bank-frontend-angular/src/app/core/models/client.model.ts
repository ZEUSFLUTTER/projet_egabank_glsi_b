export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  dateCreation?: string;
  nombreComptes?: number;
}

export interface Compte {
  id?: number;
  numeroCompte: string;
  typeCompte: 'COURANT' | 'EPARGNE';
  dateCreation: string;
  solde: number;
  proprietaireId: number;
  proprietaireNom?: string;
  proprietairePrenom?: string;
  proprietaireCourriel?: string;
  nombreTransactions?: number;
}

// DTO pour la création de compte
export interface CreateCompteDto {
  proprietaireId: number;
  typeCompte: 'COURANT' | 'EPARGNE';
  solde?: number;
}

// Interface étendue pour l'affichage avec les informations du propriétaire
export interface CompteAvecProprietaire extends Compte {
  proprietaire: {
    id: number;
    nom: string;
    prenom: string;
  };
}

export interface Transaction {
  id?: number;
  typeTransaction: 'DEPOT' | 'VERSEMENT' | 'RETRAIT' | 'VIREMENT_SORTANT' | 'VIREMENT_ENTRANT';
  montant: number;
  dateTransaction: string;
  description?: string;
  compteId: number;
  numeroCompte: string;
  compteDestinataire?: string;
  soldeAvant: number;
  soldeApres: number;
  proprietaireNom?: string;
  proprietairePrenom?: string;
}

// Interface étendue pour l'affichage avec les informations du compte
export interface TransactionAvecCompte extends Transaction {
  compte: {
    numeroCompte: string;
    proprietaire: {
      nom: string;
      prenom: string;
    };
  };
}

export interface OperationDto {
  numeroCompte: string;
  montant: number;
  description?: string;
}

// DTO pour les opérations client-centriques (sans numeroCompte car passé en URL)
export interface OperationClientDto {
  montant: number;
  description?: string;
}

export interface VirementDto {
  compteSource: string;
  compteDestinataire: string;
  montant: number;
  description?: string;
}