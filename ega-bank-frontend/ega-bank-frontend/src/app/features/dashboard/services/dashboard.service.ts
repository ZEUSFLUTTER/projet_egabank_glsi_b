import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminDashboard } from '../models/admin-dashboard.model';
import { AgentDashboard } from '../models/agent-dashboard.model';
import { ClientDashboard } from '../models/client-dashboard.model';
import { AuthStateService } from '../../../core/auth/services/auth-state.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:8080/api/dashboard';

  constructor(
    private http: HttpClient,
    private authState: AuthStateService,
  ) {}

  // ADMIN
  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.API_URL}/admin`);
  }

  // AGENT
  getAgentDashboard(): Observable<AgentDashboard> {
    return this.http.get<AgentDashboard>(`${this.API_URL}/agent`);
  }

  // CLIENT
  getClientDashboard(): Observable<ClientDashboard> {
    const user = this.authState.getUser();

    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    return this.http.get<ClientDashboard>(`${this.API_URL}/client/${user.clientId}`);
  }
}