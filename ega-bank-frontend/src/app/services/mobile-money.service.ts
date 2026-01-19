import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MobileMoneyRequest {
  provider: 'T_MONEY' | 'FLOOZ';
  phoneNumber: string;
  amount: number;
  type: 'DEPOT' | 'RETRAIT';
}

export interface MobileMoneyResponse {
  success: boolean;
  message: string;
  nouveauSolde?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MobileMoneyService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  processTransaction(request: MobileMoneyRequest): Observable<MobileMoneyResponse> {
    const endpoint = request.type === 'DEPOT' ? 'depot' : 'retrait';
    
    const payload = {
      telephone: request.phoneNumber,
      montant: request.amount,
      provider: request.provider
    };
    
    return this.http.post<MobileMoneyResponse>(`${this.API_URL}/clients/mobile-money/${endpoint}`, payload);
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Méthode pour appeler le vrai endpoint si disponible
  realProcessTransaction(request: MobileMoneyRequest): Observable<MobileMoneyResponse> {
    return this.http.post<MobileMoneyResponse>(`${this.API_URL}/mobile-money/process`, request);
  }
}