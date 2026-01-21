import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReleveService {

  private apiUrl = 'http://localhost:8080/api/releves';

  constructor(private http: HttpClient) {}

  generateRelevePdf(
    compteId: number,
    dateDebut: string,
    dateFin: string
  ): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/${compteId}?dateDebut=${dateDebut}&dateFin=${dateFin}`,
      { responseType: 'blob' }
    );
  }

  downloadPdf(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  printPdf(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
  }
}
