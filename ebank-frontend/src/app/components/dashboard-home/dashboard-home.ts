import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.scss'
})
export class DashboardHomeComponent implements OnInit {
  
  // Boutons d'actions pour le client
  quickActions = [
    { label: 'Virement', icon: 'bi-send', colorClass: 'text-primary bg-primary-subtle', link: '/admin/virement-client' },
    { label: 'Mon Relevé', icon: 'bi-file-earmark-text', colorClass: 'text-danger bg-danger-subtle', link: '/admin/releves' },
    { label: 'Mes Comptes', icon: 'bi-wallet2', colorClass: 'text-success bg-success-subtle', link: '/admin/mes-comptes' }
  ];

  myAccounts: any[] = [];
  summaryCards: any[] = [];
  recentTransactions: any[] = [];

  constructor(public authService: AuthService, private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.authService.isAdmin()) {
      this.loadAdminData();
    } else {
      this.loadClientData();
    }
  }

  loadAdminData() {
    this.http.get<any>("http://localhost:8080/api/dashboard/stats").subscribe({
      next: (data) => {
        this.summaryCards = [
          { title: 'Clients enregistrés', value: data.totalClients, icon: 'bi-people', bgClass: 'bg-primary' },
          { title: 'Comptes actifs', value: data.totalComptes, icon: 'bi-credit-card', bgClass: 'bg-success' },
          { title: 'Solde Total (CFA)', value: new Intl.NumberFormat('fr-FR').format(data.totalSolde), icon: 'bi-wallet2', bgClass: 'bg-info' }
        ];
        this.recentTransactions = data.recentTransactions || [];
         this.cdr.detectChanges();
      },
      error: (err) => console.error("Erreur Dashboard Admin", err)
    });
  }

  loadClientData() {
  const token = this.authService.getToken();
  if (!token) return;

  // 1. Charger les comptes du client
  this.http.get<any[]>("http://localhost:8080/api/comptes/me").subscribe({
    next: (accounts) => {
      this.myAccounts = accounts;
      
      // 2. Charger l'historique du premier compte s'il existe
      if(accounts.length > 0) {
        const num = accounts[0].numCompte;
        this.http.get<any[]>(`http://localhost:8080/api/operations/historique/${num}`).subscribe({
          next: (ops) => {
            this.recentTransactions = ops.slice(0, 5);
            this.cdr.detectChanges();
          },
          error: (err) => console.error("Erreur historique client", err)
        });
      }
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error("Erreur 403 détectée sur /me :", err);
      
    }
  });
}


  
  
}