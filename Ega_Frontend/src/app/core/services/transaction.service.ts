import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DEPOSIT_ENDPOINT, TELECHARGE_RELEVEE_ENDPOINT, TRANSACTION_HISTORY_ENDPOINT, TRANSFER_ENDPOINT, WITHDRAWAL_ENDPOINT } from "../../utils/constantes";
import { DemandeHistoriqueDto, HistoriqueTransactionDto } from "../../dto/Transaction";

@Injectable({providedIn: 'root'})
export class TransactionService {

    readonly http = inject(HttpClient);

    //Service pour faire un dépôt
    public deposit(amount: number, accountNumber: string): Observable<any> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        const payload = {amount: amount,accountNumber: {accountNumber: accountNumber}}; 
        return this.http.post(DEPOSIT_ENDPOINT, payload, { headers });
    }


    //Service pour faire un retrait

    public withdrawal(amount: number, accountNumber: string): Observable<any> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        
        const payload = {
            amount: amount,
            accountNumber: {
                accountNumber: accountNumber
            }
        };
        
        return this.http.post(WITHDRAWAL_ENDPOINT, payload, { headers });
    }


    // Service pour faire un transfert

    public transfer(amount: number, compteSource: string, compteDest: string): Observable<any> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        
        const payload = {
            amount: amount,
            compteSource: {
                accountNumber: compteSource
            },
            compteDest: {
                accountNumber: compteDest
            }
        };
        
        return this.http.post(TRANSFER_ENDPOINT, payload, { headers });
    }

    

    //service pour recuperer lhistorique des transactions d'un compte
        public getHistoriqueTransactions(demandeHistorique: DemandeHistoriqueDto): Observable<HistoriqueTransactionDto[]> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        
        return this.http.post<HistoriqueTransactionDto[]>(TRANSACTION_HISTORY_ENDPOINT,  demandeHistorique,  { headers } );
    }


    /*public telechargerRelevePdf(accountNumber: string, dateDebut: string, dateFin: string): Observable<Blob> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        
        // Construction des paramètres de requête
        const params = new HttpParams()
            .set('accountNumber', accountNumber)
            .set('dateDebut', dateDebut)
            .set('dateFin', dateFin);

        return this.http.post(TELECHARGE_RELEVEE_ENDPOINT, null,{ headers, params,responseType: 'blob' });
    }
        */


        public telechargerRelevePdf(accountNumber: string, dateDebut: string, dateFin: string): Observable<Blob> {
        const token = localStorage.getItem("authToken");
        const headers = { Authorization: `Bearer ${token}` };
        
        const params = new HttpParams()
            .set('accountNumber', accountNumber)
            .set('dateDebut', dateDebut)
            .set('dateFin', dateFin);
        
        return this.http.post(
            TELECHARGE_RELEVEE_ENDPOINT, 
            null, 
            { 
                headers, 
                params,
                responseType: 'blob' as 'json' 
            }
        ) as Observable<Blob>;
    }


    public downloadPdfFile(blob: Blob, accountNumber: string, dateDebut: string, dateFin: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${accountNumber}_${dateDebut}_${dateFin}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

}