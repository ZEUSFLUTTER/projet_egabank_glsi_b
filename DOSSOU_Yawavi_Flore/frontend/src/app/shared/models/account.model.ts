import { Client } from './client.model';

export interface Account {
  id?: number;
  accountNumber: string;
  accountType: AccountType;
  createdAt: string;
  balance: number;
  deleted?: boolean;
  client?: Client;
}

export enum AccountType {
  COURANT = 'COURANT',
  EPARGNE = 'EPARGNE'
}

export interface AccountDto {
  accountType: AccountType;
  client: Client;
}

export interface AccountDtoCreateOld {
  accountType: AccountType;
  client: {
    email: string;
  };
}
