export interface Transaction {
  id?: number;
  transactionId: string;
  transactionType: TransactionType;
  transactionDate: string;
  amount: number;
  description: string;
}

export enum TransactionType {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  TRANSFERT_ENTRANT = 'TRANSFERT_ENTRANT',
  TRANSFERT_SORTANT = 'TRANSFERT_SORTANT'
}

export interface TransactionDepWithDto {
  amount: number;
  accountNumber: {
    accountNumber: string;
  };
}

export interface TransferDto {
  amount: number;
  compteSource: {
    accountNumber: string;
  };
  compteDest: {
    accountNumber: string;
  };
}

export interface HistoriqueTransactionDto {
  transactionDate: string;
  transactionType: TransactionType;
  amount: number;
  description: string;
  accountNumber: {
    accountNumber: string;
  };
}

export interface DemandeHistoriqueDto {
  dateDebut: string;
  dateFin: string;
  accountNumberDto: {
    accountNumber: string;
  };
}
