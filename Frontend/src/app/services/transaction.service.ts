import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:8081/api';

export interface Transaction {
  id?: number;
  dateOperation: string;
  montant: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  libelle: string;
  compteSource: any;
  compteDestination?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${API_URL}/transactions`);
  }

  getByPeriod(numeroCompte: string, dateDebut: string, dateFin: string): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<Transaction[]>(`${API_URL}/transactions/${numeroCompte}`, { params });
  }

  downloadReleve(numeroCompte: string, dateDebut: string, dateFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    
    return this.http.get(`${API_URL}/releves/${numeroCompte}`, {
      params: params,
      responseType: 'blob'
    }).pipe(
      tap((blob: Blob) => {
        // Créer un lien de téléchargement pour le PDF
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${numeroCompte}_${dateDebut}_${dateFin}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
    );
  }
}
