import Decimal from "decimal.js";
import { AccountType } from "../enums/AccountType";
import { Client } from "./Client";
import { User } from "./User";

export class Account {
    accountNumber? : string ;
    accountType? : AccountType ;
    balance? : Decimal ;
    client ? : Client ;
    user? : User ;

    constructor(data?: Partial<Account> ) {
        if (data) {
            Object.assign(this, data)
        }
    }
}