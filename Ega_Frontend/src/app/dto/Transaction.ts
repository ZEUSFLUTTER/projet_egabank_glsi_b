// ========== DTOs pour les transactions ==========

// DTO pour le numéro de compte dans l'historique
export interface HistoriqueTransAccountDto {
  accountNumber: string;
}

// DTO pour une transaction dans l'historique
export interface HistoriqueTransactionDto {
  transactionDate: string;
  transactionType: 'DEPOT' | 'RETRAIT' | 'TRANSFERT';
  amount: number;
  description: string;
  accountNumber: HistoriqueTransAccountDto;
}

// DTO pour demander l'historique
export interface DemandeHistoriqueDto {
  dateDebut: string; // Format: YYYY-MM-DD
  dateFin: string;   // Format: YYYY-MM-DD
  accountNumberDto: HistoriqueTransAccountDto;
}

// DTO pour le relevé PDF (paramètres de requête)
export interface RelevePdfParams {
  accountNumber: string;
  dateDebut: string; // Format: YYYY-MM-DD
  dateFin: string;   // Format: YYYY-MM-DD
}