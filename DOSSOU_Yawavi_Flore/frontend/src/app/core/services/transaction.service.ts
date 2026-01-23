import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  TransactionDepWithDto, 
  TransferDto, 
  HistoriqueTransactionDto, 
  DemandeHistoriqueDto 
} from '../../shared/models/transaction.model';
import { ApiResponse } from '../../shared/models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = 'http://localhost:8080/api/transaction';

  constructor(private http: HttpClient) {}

  deposit(transaction: TransactionDepWithDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/depot`, transaction);
  }

  withdraw(transaction: TransactionDepWithDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/retrait`, transaction);
  }

  transfer(transferDto: TransferDto): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/transfert`, transferDto);
  }

  getTransactionHistory(demandeDto: DemandeHistoriqueDto): Observable<HistoriqueTransactionDto[]> {
    return this.http.post<HistoriqueTransactionDto[]>(`${this.API_URL}/historique`, demandeDto);
  }
}
