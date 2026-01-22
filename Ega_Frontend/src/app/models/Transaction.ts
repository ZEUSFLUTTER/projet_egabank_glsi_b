import Decimal from "decimal.js";
import { TransactionType } from "../enums/TransactionType";
import { Account } from "./Account";
import { User } from "./User";

export class Transaction{
    transactionId? : string ;
    transactionType? : TransactionType ;
    amount? : Decimal ;
    account?: Account ;
    user? : User;

    constructor(data?: Partial<Transaction>){
        if(data){
            Object.assign(this, data)
        }
    }
}