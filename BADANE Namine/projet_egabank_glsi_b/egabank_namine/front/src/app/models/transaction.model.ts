export interface Transaction {
  id: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction: Date;
  compteSourceId: number;
  compteDestinationId: number;
  description: string;
}