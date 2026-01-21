import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { TransactionModele } from '../modeles/transaction-modele';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ServiceTransactions {
  private URL_API = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  listerParPeriode(
    numeroCompte: string,
    dateDebut: string,
    dateFin: string
  ): Observable<TransactionModele[]> {

    const params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);

    return this.http.get<TransactionModele[]>(
      `${this.URL_API}/${encodeURIComponent(numeroCompte)}`,
      { params }
    );
  }

  lister(): Observable<TransactionModele[]> {
      return this.http.get<TransactionModele[]>(this.URL_API)
        .pipe(catchError(() => throwError(() => 'Erreur du chargement des transactions')));
  }
}
