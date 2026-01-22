import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../../models/Client";
import { Account } from "../../models/Account";
import { ACCOUNT_CLIENT_DETAIL2_ENDPOINT, ACCOUNT_LIST_ACTIVE_ENDPOINT, ACCOUNT_LIST_INACTIVE_ENDPOINT, CREATE_ACCOUNT_EXISTING_CLIENT_ENDPOINT, CREATE_ACCOUNT_NEW_ENDPOINT, DELETE_ACCOUNT_ENDPOINT, DETAIL_CLIENT_ENDPOINT } from "../../utils/constantes";
import { CreateAccountRequestDto } from "../../dto/CreateAccountRequestDto";
import { AccountDtoCreateExisting } from "../../dto/AccountDtoCreateExisting";
import { AccountListDto2 } from "../../dto/AccountListDto2";

@Injectable({providedIn: 'root'})
export class AccountService{
    
    readonly http = inject(HttpClient);

    /*
    public createAccountNew(
        firstName: string, 
        lastName: string, 
        dateOfbirth: Date,
        gender: string,
        address: string,
        phoneNumber: string,
        email: string,
        nationality: string,
        accountType: string,
    ): Observable<Account> {
        const account = {
            firstName, 
            lastName, 
            dateOfbirth,
            gender,
            address,
            phoneNumber,
            email,
            nationality,
            accountType,
        };
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<Account>(CREATE_ACCOUNT_NEW_ENDPOINT, account, { headers } );
    } */


    // methode pour creer le compte pour un nouveau client
    public createAccountNew(dto: CreateAccountRequestDto): Observable<Account> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<Account>(CREATE_ACCOUNT_NEW_ENDPOINT, dto, { headers } );
    }

    //methode pour creer le compte pour un client existant
    public createAccountExistingClient(accountDto: AccountDtoCreateExisting): Observable<Account> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.post<Account>(CREATE_ACCOUNT_EXISTING_CLIENT_ENDPOINT, accountDto, { headers });
    }


    //detail d'un client pour le caissier
        public getAccountClientDetail2(accountNumber: string): Observable<AccountListDto2> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<AccountListDto2>(
            ACCOUNT_CLIENT_DETAIL2_ENDPOINT(accountNumber), 
            { headers }
        );
    }

    //service  lister les comptes actifs
    public listActiveAccounts(): Observable<AccountListDto2[]> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<AccountListDto2[]>(ACCOUNT_LIST_ACTIVE_ENDPOINT, { headers });
    }

    //service  lister les comptes inactifs
    public listInactiveAccounts(): Observable<AccountListDto2[]> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<AccountListDto2[]>(ACCOUNT_LIST_INACTIVE_ENDPOINT, { headers });
    }

    //service pour supprimer un compte 
    public deleteAccount(accountNumber: string): Observable<string> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.put<string>(DELETE_ACCOUNT_ENDPOINT(accountNumber), {}, { headers });
    }


}