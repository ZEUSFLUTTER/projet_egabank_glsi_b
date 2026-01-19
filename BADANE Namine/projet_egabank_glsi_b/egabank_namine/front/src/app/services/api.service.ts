import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = 'http://localhost:8088/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Auth
  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${BASE_URL}/auth/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${BASE_URL}/auth/register`, user);
  }

  // Clients
  getClients(): Observable<any> {
    return this.http.get(`${BASE_URL}/clients`);
  }

  getClient(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/clients/${id}`);
  }

  createClient(client: any): Observable<any> {
    return this.http.post(`${BASE_URL}/clients`, client);
  }

  updateClient(id: number, client: any): Observable<any> {
    return this.http.put(`${BASE_URL}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/clients/${id}`);
  }

  // Accounts
  getAccounts(): Observable<any> {
    return this.http.get(`${BASE_URL}/accounts`);
  }

  getAccount(id: number): Observable<any> {
    return this.http.get(`${BASE_URL}/accounts/${id}`);
  }

  getAccountsByClient(clientId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/accounts/client/${clientId}`);
  }

  createAccount(account: any): Observable<any> {
    return this.http.post(`${BASE_URL}/accounts`, account);
  }

  updateAccount(id: number, account: any): Observable<any> {
    return this.http.put(`${BASE_URL}/accounts/${id}`, account);
  }

  deleteAccount(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/accounts/${id}`);
  }

  // Transactions
  deposit(data: {compteId: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/transactions/depot`, data);
  }

  withdrawal(data: {compteId: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/transactions/retrait`, data);
  }

  transfer(data: {compteSourceId: number, compteDestinationId: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/transactions/virement`, data);
  }

  getTransactionsByAccount(accountId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/transactions/compte/${accountId}`);
  }

  // Bank operations (procedures)
  depositProcedure(data: {compteId: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/bank/depot`, data);
  }

  withdrawProcedure(data: {compteId: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/bank/retrait`, data);
  }

  transferProcedure(data: {source: number, destination: number, montant: number}): Observable<any> {
    return this.http.post(`${BASE_URL}/bank/virement`, data);
  }

  // Views
  getClientsComptesView(): Observable<any> {
    return this.http.get(`${BASE_URL}/bank/vues/clients-comptes`);
  }

  getTransactionsDetailView(): Observable<any> {
    return this.http.get(`${BASE_URL}/bank/vues/transactions-detail`);
  }

  getTransactionsParJourView(): Observable<any> {
    return this.http.get(`${BASE_URL}/bank/vues/transactions-jour`);
  }

  getVirementsView(): Observable<any> {
    return this.http.get(`${BASE_URL}/bank/vues/virements`);
  }

  getSoldeClientView(clientId: number): Observable<any> {
    return this.http.get(`${BASE_URL}/bank/vues/solde-client/${clientId}`);
  }
  getComptes(clientId: number) {
    return this.http.get(`${this.baseUrl}/accounts/client/${clientId}`);
  }

  getProfile(username: string) {
    return this.http.get(`${this.baseUrl}/clients/me?username=${username}`);
  }

  getTransactions(accountId: number, startDate?: string, endDate?: string) {
    let url = `${this.baseUrl}/transactions/compte/${accountId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get(url);
  }
}