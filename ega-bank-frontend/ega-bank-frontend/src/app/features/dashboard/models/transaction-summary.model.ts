export interface TransactionSummary {
  id: number;
  reference: string;
  type: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction: string;
  compteSource?: string;
  compteDestination?: string;
}