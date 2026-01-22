import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VirementService {

  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:9090/api/comptes';

  getVirements(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  effectuerVirement(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/virement`, payload);
  }

  getStatistiques(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }
}
