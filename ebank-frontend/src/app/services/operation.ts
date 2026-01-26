import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationService {
  
  private apiUrl = 'http://localhost:8080/api/operations';

  constructor(private http: HttpClient) {}

  getHistory(numCompte: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historique/${numCompte}`);
  }

  versement(numCompte: string, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/versement`, { numCompte, montant, description });
  }

  retrait(numCompte: string, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/retrait`, { numCompte, montant, description });
  }

  virement(numCompte: string, numCompteDest: string, montant: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/virement`, { numCompte, numCompteDest, montant, description });
  }

  getHistoryByPeriod(numCompte: string, debut: string, fin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historique-periode/${numCompte}`, {
      params: { debut, fin }
    });
  }

  downloadReleve(numCompte: string, debut: string, fin: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/imprimer-releve/${numCompte}`, {
      params: { debut, fin },
      responseType: 'blob' 
    });
  }
}