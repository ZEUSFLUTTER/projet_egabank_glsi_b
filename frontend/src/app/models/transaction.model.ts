export enum TypeTransaction {
  DEPOT = 'DEPOT',
  RETRAIT = 'RETRAIT',
  VIREMENT_ENTRANT = 'VIREMENT_ENTRANT',
  VIREMENT_SORTANT = 'VIREMENT_SORTANT'
}

export interface Transaction {
  id?: number;
  typeTransaction: TypeTransaction;
  montant: number;
  dateTransaction?: string;
  compteId: number;
  compteNumero?: string;
  compteDestinationId?: number;
  compteDestinationNumero?: string;
  description?: string;
}

export interface Operation {
  compteId: number;
  montant: number;
  description?: string;
}

export interface Virement {
  compteSourceId: number;
  compteDestinationId: number;
  montant: number;
  description?: string;
}
