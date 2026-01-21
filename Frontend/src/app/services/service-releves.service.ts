import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceReleves {
  private URL_API = `${environment.apiUrl}/releves`;

  constructor(private http: HttpClient) {}

  telechargerPdf(numeroCompte: string, dateDebut: string, dateFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('dateDebut', dateDebut) 
      .set('dateFin', dateFin);

    return this.http.get(
      `${this.URL_API}/${encodeURIComponent(numeroCompte)}`,
      { params, responseType: 'blob' }
    );
  }
}
