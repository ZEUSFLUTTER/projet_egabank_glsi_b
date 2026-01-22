import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:9090/api/comptes'; // adapter au backend

  getDepots(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  creerDepot(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/depot`, payload);
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }
}
