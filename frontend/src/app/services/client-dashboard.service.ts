import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  totalSolde: number;
  nombreComptes: number;
  nombreNotifications: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientDashboardService {
  private apiUrl = 'http://localhost:8080/api/client';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  getComptes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comptes`);
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transactions`);
  }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  marquerNotificationLue(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/notifications/${id}/lu`, {});
  }

  effectuerRetrait(compteId: number, montant: number, description?: string): Observable<any> {
    const params: any = { compteId, montant };
    if (description) params.description = description;
    return this.http.post<any>(`${this.apiUrl}/transactions/retrait`, null, { params });
  }

  effectuerVirement(compteSourceId: number, compteDestinationId: number, montant: number, description?: string): Observable<any> {
    const params: any = { compteSourceId, compteDestinationId, montant };
    if (description) params.description = description;
    return this.http.post<any>(`${this.apiUrl}/transactions/virement`, null, { params });
  }
}
