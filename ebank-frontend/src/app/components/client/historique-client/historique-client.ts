import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-historique-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-client.html',
  styleUrl: './historique-client.scss'
})
export class HistoriqueClientComponent implements OnInit {
  myAccounts: any[] = [];
  selectedAccount: string = "";
  transactions: any[] = [];
  loading = false;

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit(): void {
    //  On récupère d'abord ses propres comptes
    this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe({
      next: (data) => {
        this.myAccounts = data;
        if (data.length > 0) {
          this.selectedAccount = data[0].numCompte;
          this.loadHistory();
        }
      }
    });
  }

  loadHistory() {
    if (!this.selectedAccount) return;
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/api/operations/historique/${this.selectedAccount}`).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error("Erreur historique", err);
      }
    });
  }
}