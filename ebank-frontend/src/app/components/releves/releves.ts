import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CompteService } from '../../services/compte'; 
import { OperationService } from '../../services/operation';
import { AuthService } from '../../services/auth'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-releves',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './releves.html',
  styleUrl: './releves.scss'
})
export class RelevesComponent implements OnInit {
  accounts: any[] = [];
  viewMode: 'LIST' | 'PREVIEW' = 'LIST';
  loading: boolean = false;
  
  selectedAccount: any = null;
  statementData: any = null;
  
  today: Date = new Date();
  fin: string = new Date().toISOString().split('T')[0];
  debut: string = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

  constructor(
    private opService: OperationService,
    private compteService: CompteService,
    public authService: AuthService, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.loading = true;
    if (this.authService.isAdmin()) {
      this.compteService.getAllAccounts().subscribe({
        next: (data: any[]) => {
          this.accounts = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erreur', 'Impossible de charger les comptes', 'error');
        }
      });
    } else {
      this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe({
        next: (data: any[]) => {
          this.accounts = data;
          this.loading = false;
          this.cdr.detectChanges(); 
        },
        error: () => {
          this.loading = false;
          Swal.fire('Erreur', 'Impossible de charger vos comptes', 'error');
        }
      });
    }
  }

  selectAccount(account: any) {
    this.selectedAccount = account;
    this.generatePreview();
  }

  generatePreview() {
    this.loading = true;
    // Utilisation du typage explicite (ops: any[]) pour éviter l'erreur TS7006
    this.opService.getHistory(this.selectedAccount.numCompte).subscribe({
      next: (ops: any[]) => {
        this.statementData = {
          account: this.selectedAccount,
          operations: ops,
          period: { start: this.debut, end: this.fin }
        };
        this.viewMode = 'PREVIEW';
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        this.loading = false;
        console.error("Erreur historique:", err);
        Swal.fire('Erreur', 'Impossible de charger l\'historique', 'error');
      }
    });
  }

  filterByDate() {
    this.loading = true;
    this.opService.getHistoryByPeriod(this.selectedAccount.numCompte, this.debut, this.fin).subscribe({
      next: (ops: any[]) => {
        this.statementData.operations = ops;
        this.loading = false;
        this.cdr.detectChanges(); 
      },
      error: () => {
        this.loading = false;
        Swal.fire('Erreur', 'Filtrage impossible', 'error');
      }
    });
  }

  backToList() {
    this.viewMode = 'LIST';
    this.statementData = null;
  }

  downloadPdf(printDirectly: boolean = false) {
    if (!this.selectedAccount) return;
    this.loading = true;

    this.opService.downloadReleve(this.selectedAccount.numCompte, this.debut, this.fin).subscribe({
      next: (blob: Blob) => {
        this.loading = false;
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(pdfBlob);

        if (printDirectly) {
          window.open(url, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = url;
          link.download = `Releve_${this.selectedAccount.numCompte}.pdf`;
          link.click();
        }
        setTimeout(() => window.URL.revokeObjectURL(url), 5000);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status !== 0) {
          Swal.fire('Erreur', 'Le serveur n\'a pas pu générer le PDF', 'error');
        }
      }
    });
  }

  printPage() {
    window.print();
  }
}