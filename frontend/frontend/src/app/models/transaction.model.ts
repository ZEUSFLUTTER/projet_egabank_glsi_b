export interface Transaction {
  id?: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'TRANSFERT';
  montant: number;
  dateTransaction: string;
  compteSourceId: number;
  compteDestinationId?: number;
  description?: string;
}

