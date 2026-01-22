import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FinancialStats {
  totalIncome: number;
  totalExpenses: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  balance: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalAccounts: number;
  totalTransactions: number;
  totalCategories: number;
  totalCredits: number;
  totalDebits: number;
  monthlyEarnings: number;
  monthlyExpenses: number;
  creditCount: number;
  debitCount: number;
  // Champs spécifiques pour les admins
  totalClients?: number;
  activeClients?: number;
  activeAccounts?: number;
  newAccountsThisMonth?: number;
  newClientsThisMonth?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getAdminDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin/stats`);
  }

  getFinancialStats(): Observable<FinancialStats> {
    return this.http.get<FinancialStats>(`${this.apiUrl}/financial-stats`);
  }
}