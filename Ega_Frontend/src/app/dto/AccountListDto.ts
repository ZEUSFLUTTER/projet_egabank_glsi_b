import { AccountType } from "../enums/AccountType";

export interface AccountListDto {
  accountNumber: string;
  accountType: AccountType;   
  createdAt: Date;            
  balance: number;     
}