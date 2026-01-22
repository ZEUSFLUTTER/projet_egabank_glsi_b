import { AccountType } from '../enums/AccountType';
import { ClientListDto } from './ClientListDto';

export interface AccountListDto2 {
  accountNumber: string;
  accountType: AccountType;
  client: ClientListDto;
}