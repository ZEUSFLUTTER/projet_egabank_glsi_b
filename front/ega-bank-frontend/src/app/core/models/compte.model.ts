export interface Compte {
  id: number; // Identifiant unique du compte
  balance: number; // Solde du compte
  clientId: number; // Identifiant du client associé à ce compte
  createdAt: Date; // Date de création du compte
  updatedAt: Date; // Date de la dernière mise à jour du compte
}