import { AccountType } from "../enums/AccountType";

export interface CreateAccountRequestDto {
  accountType: AccountType;
  client: {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // yyyy-MM-dd
    gender: string;
    address: string;
    phoneNumber: string;
    email: string;
    nationality: string;
  };
}
