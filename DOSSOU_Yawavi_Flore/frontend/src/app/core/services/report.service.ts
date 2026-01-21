import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly API_URL = 'http://localhost:8080/api/doc';

  constructor(private http: HttpClient) {}

  generatePdfReport(accountNumber: string, dateDebut: string, dateFin: string): Observable<Blob> {
    const params = new HttpParams()
      .set('accountNumber', accountNumber)
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);

    return this.http.post(`${this.API_URL}/historique/pdf`, null, {
      params,
      responseType: 'blob'
    });
  }

  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
