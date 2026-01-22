  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, of } from 'rxjs';
  import { catchError } from 'rxjs/operators';
  import { Account, AccountCreateRequest } from '../models/auth.model';

  @Injectable({
    providedIn: 'root'
  })
  export class AccountService {
    private apiUrl = 'http://localhost:8080/api/accounts';

    constructor(private http: HttpClient) {}

    // Pour admin : récupérer tous les comptes
    getAccountsAll(): Observable<Account[]> {
      return this.http.get<Account[]>(`${this.apiUrl}`).pipe(
        catchError((err) => {
          console.error('[AccountService] getAccountsAll failed:', err);
          return of([] as Account[]);
        })
      );
    }

    getAccounts(): Observable<Account[]> {
      return this.http.get<Account[]>(`${this.apiUrl}/user`).pipe(
        catchError((err) => {
          console.error('[AccountService] getAccounts failed:', err);
          return of([] as Account[]);
        })
      );
    }

    getAccountById(id: number): Observable<Account> {
      return this.http.get<Account>(`${this.apiUrl}/${id}`);
    }

    createAccount(account: AccountCreateRequest): Observable<Account> {
      return this.http.post<Account>(`${this.apiUrl}`, account);
    }

    updateAccount(id: number, account: Partial<Account>): Observable<Account> {
      return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
    }

    deleteAccount(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getAccountBalance(accountId: number): Observable<{ balance: number }> {
      return this.http.get<{ balance: number }>(`${this.apiUrl}/${accountId}/balance`);
    }

    getAccountsByOwnerId(ownerId: number): Observable<Account[]> {
      return this.http.get<Account[]>(`${this.apiUrl}/owner/${ownerId}`);
    }
  }
