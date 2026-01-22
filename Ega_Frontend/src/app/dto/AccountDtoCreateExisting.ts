import { AccountType } from "../enums/AccountType";

export interface AccountDtoCreateExisting {

    accountType: AccountType;
    client: {
      email: string;
    };
}