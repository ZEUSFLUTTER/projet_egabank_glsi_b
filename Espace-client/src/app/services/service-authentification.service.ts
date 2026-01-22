import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConnexionClientDTO, InscriptionClientDTO, ClientModele, AuthJetonDTO } from '../modeles/client-modele';
import { StockageJeton } from '../coeur/stockage-jeton';

interface ChangementMotDePasseDTO {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceAuthentification {
  private readonly urlApi = 'http://localhost:8081/api/auth-client';
  private clientConnecteSubject = new BehaviorSubject<ClientModele | null>(StockageJeton.obtenirClient());
  
  public clientConnecte$ = this.clientConnecteSubject.asObservable();

  constructor(private http: HttpClient) {}

  connecter(donnees: ConnexionClientDTO): Observable<AuthJetonDTO> {
    return this.http.post<AuthJetonDTO>(`${this.urlApi}/connexion`, donnees).pipe(
      tap((reponse: AuthJetonDTO) => {
        if (reponse.jeton) {
          StockageJeton.sauvegarderJeton(reponse.jeton);
          StockageJeton.sauvegarderClient(reponse.client);
          this.clientConnecteSubject.next(reponse.client);
        }
      })
    );
  }

  deconnecter(): void {
    StockageJeton.supprimerJeton();
    this.clientConnecteSubject.next(null);
  }

  obtenirClientConnecte(): ClientModele | null {
    return StockageJeton.obtenirClient();
  }

  estConnecte(): boolean {
    return StockageJeton.estConnecte();
  }

  rafraichirProfil(): Observable<ClientModele> {
    return this.http.get<ClientModele>(`${this.urlApi}/profil`).pipe(
      tap((client: ClientModele) => {
        StockageJeton.sauvegarderClient(client);
        this.clientConnecteSubject.next(client);
      })
    );
  }

  changerMotDePasse(donnees: ChangementMotDePasseDTO): Observable<any> {
    return this.http.post(`${this.urlApi}/changer-mot-de-passe`, donnees);
  }
}