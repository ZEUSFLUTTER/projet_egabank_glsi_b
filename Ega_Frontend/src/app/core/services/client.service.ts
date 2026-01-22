import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../../models/Client";
import { ACTIVE_CLIENTS_ENDPOINT, DELETE_CLIENT_ENDPOINT, DETAIL_CLIENT_ENDPOINT, INACTIVE_CLIENTS_ENDPOINT, MODIFIY_CLIENT_ENDPOINT } from "../../utils/constantes";
import { ClientUpdateDto } from "../../dto/ClientUpdateDto";


@Injectable({providedIn: 'root'})
export class ClientService {
    
    readonly http = inject(HttpClient);

    //Méthode pour trouver un client par son email
    public findClientByEmail(email: string): Observable<Client> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<Client>(DETAIL_CLIENT_ENDPOINT(email), { headers });
    }

    //Service pour lister les clients actifs
    public listActiveClients(): Observable<any> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any>(ACTIVE_CLIENTS_ENDPOINT, { headers });
    }

    //Service pour lister les clients inactifs
    public listInactiveClients(): Observable<any> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.get<any>(INACTIVE_CLIENTS_ENDPOINT, { headers });
    }

    //Service pour supprimer un client (soft delete)
    public deleteClient(codeClient: string): Observable<string> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.put<string>(DELETE_CLIENT_ENDPOINT(codeClient), {}, { headers });
    }

    //Service pour modifier un client
    public modifyClient(codeClient: string, clientData: ClientUpdateDto): Observable<string> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        return this.http.put<string>(MODIFIY_CLIENT_ENDPOINT(codeClient), clientData, { headers });
    }
}