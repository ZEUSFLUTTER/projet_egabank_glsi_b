import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, AccountDto, AccountDtoCreateOld } from '../../shared/models/account.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly API_URL = 'http://localhost:8080/api/account';

  constructor(private http: HttpClient) {}

  createAccountForNewClient(accountDto: AccountDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/newAccountClient`, accountDto);
  }

  createAccountForExistingClient(accountDto: AccountDtoCreateOld): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/oldAccountClient`, accountDto);
  }

  getAccountDetails(accountNumber: string): Observable<Account> {
    return this.http.get<Account>(`${this.API_URL}/detail/${accountNumber}`);
  }

  getAccountDetails2(accountNumber: string): Observable<Account> {
    return this.http.get<Account>(`${this.API_URL}/detail2/${accountNumber}`);
  }

  getAllActiveAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/findAllActif`);
  }

  getAllInactiveAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/findAllInActif`);
  }

  deleteAccount(accountNumber: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/delete/${accountNumber}`, {});
  }

  getActiveAccountsByClient(clientEmail: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/clientAccountActif/${clientEmail}`);
  }

  getInactiveAccountsByClient(clientEmail: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.API_URL}/clientAccountInActif/${clientEmail}`);
  }
}
