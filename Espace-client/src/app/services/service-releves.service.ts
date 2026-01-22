import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReleveDTO } from '../modeles/transaction-modele';

@Injectable({
  providedIn: 'root'
})
export class ServiceReleves {
  private readonly urlApi = 'http://localhost:8081/api/releves-client';

  constructor(private http: HttpClient) {}

  genererReleve(releve: ReleveDTO): Observable<Blob> {
    return this.http.post(`${this.urlApi}/generer`, releve, {
      responseType: 'blob'
    });
  }

  telechargerReleve(releve: ReleveDTO, nomFichier: string): void {
    this.genererReleve(releve).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const lien = document.createElement('a');
        lien.href = url;
        lien.download = nomFichier;
        lien.click();
        window.URL.revokeObjectURL(url);
      },
      error: (erreur) => {
        console.error('Erreur lors du téléchargement du relevé:', erreur);
      }
    });
  }
}