import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';
import { Dashboard} from '../models/dashboard.model';


@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = `${env.apiUrl}`;
  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard`);
  }
} 