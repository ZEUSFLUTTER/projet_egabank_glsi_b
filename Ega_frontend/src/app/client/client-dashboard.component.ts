import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // <-- Ajouter ActivatedRoute
import { AuthService } from '../_services/auth.service';
import { AccountService } from '../_services/account.service';
import { User, Compte, Transaction, Client } from '../_models/models';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './client-dashboard.component.html',
  styles: [`
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background-color: #CBD5E1; border-radius: 20px; }
  `]
})
export class ClientDashboardComponent implements OnInit {
  authService = inject(AuthService);
  accountService = inject(AccountService);
  router = inject(Router);
  route = inject(ActivatedRoute); // <-- Ajouter cette ligne

  isSidebarOpen = false;
  user: User | null = null;
  client: Client | null = null;
  comptes: Compte[] = [];
  transactions: Transaction[] = [];

  soldeTotal = 0;
  epargneTotal = 0;
  comptePrincipal: Compte | null = null;

  isLoading = true;

  ngOnInit() {
    console.log('Dashboard - Initialisation...');
    this.user = this.authService.currentUserValue;
    console.log('Utilisateur connecté:', this.user);

    if (this.user && this.user.id) {
      this.loadAllData(this.user.id);
    } else {
      console.log('Aucun utilisateur connecté, redirection...');
      this.isLoading = false;
      this.router.navigate(['/login']);
    }
  }

  loadAllData(clientId: number) {
    console.log('Chargement des données pour client ID:', clientId);
    this.isLoading = true;

    // MODIFICATION: Utiliser le resolver comme dans accounts.component
    this.route.data.subscribe(data => {
      const resolvedData = data['donnees'];
      console.log('Données résolues par le resolver:', resolvedData);

      if (resolvedData) {
        this.comptes = resolvedData.comptes || [];
        this.client = resolvedData.clientInfos;

        console.log('Client chargé via resolver:', this.client);
        console.log('Comptes chargés via resolver:', this.comptes);

        this.calculerStats();

        if (this.comptes.length > 0) {
          this.comptePrincipal = this.comptes[0];
          console.log('Compte principal:', this.comptePrincipal);
          this.loadAllTransactions();
        } else {
          console.log('Aucun compte trouvé pour ce client');
          this.transactions = [];
          this.isLoading = false;
        }
      } else {
        // Si le resolver ne fournit pas de données, charger directement via l'API
        console.log('Aucune donnée résolue, chargement direct via API');
        this.loadDataViaApi(clientId);
      }
    });
  }

  // Méthode pour charger les données directement via l'API si le resolver échoue
  loadDataViaApi(clientId: number) {
    forkJoin({
      client: this.accountService.getClientInfo(clientId).pipe(
        catchError(err => {
          console.error('Erreur chargement client:', err);
          return of(null);
        })
      ),
      comptes: this.accountService.getComptesByClient(clientId).pipe(
        catchError(err => {
          console.error('Erreur chargement comptes:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (results) => {
        console.log('Données API reçues:', results);
        this.client = results.client;
        this.comptes = results.comptes || [];

        console.log('Client:', this.client);
        console.log('Nombre de comptes:', this.comptes.length);

        this.calculerStats();

        if (this.comptes.length > 0) {
          this.comptePrincipal = this.comptes[0];
          console.log('Compte principal:', this.comptePrincipal);
          this.loadAllTransactions();
        } else {
          console.log('Aucun compte trouvé pour ce client');
          this.transactions = [];
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Erreur dans loadDataViaApi:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllTransactions() {
    console.log('Chargement des transactions pour', this.comptes.length, 'comptes');
    if (this.comptes.length === 0) {
      this.isLoading = false;
      return;
    }

    const historiqueRequests = this.comptes.map(compte =>
      this.accountService.getHistorique(compte.numeroCompte).pipe(
        catchError(err => {
          console.error(`Erreur pour le compte ${compte.numeroCompte}:`, err);
          return of([]);
        })
      )
    );

    forkJoin(historiqueRequests).subscribe({
      next: (allTransactions) => {
        console.log('Toutes les transactions reçues:', allTransactions);

        let mergedTransactions: Transaction[] = [];

        allTransactions.forEach((transactions, index) => {
          console.log(`Transactions du compte ${index}:`, transactions);
          if (transactions && transactions.length > 0) {
            mergedTransactions.push(...transactions);
          }
        });

        console.log('Transactions fusionnées:', mergedTransactions);

        // Filtrer et trier
        this.transactions = mergedTransactions
          .filter(tr => ['VERSEMENT', 'RETRAIT', 'VIREMENT'].includes(tr.type))
          .sort((a, b) => new Date(b.dateTransaction).getTime() - new Date(a.dateTransaction).getTime());

        console.log('Transactions filtrées et triées:', this.transactions);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des transactions:', err);
        this.isLoading = false;
      }
    });
  }

  calculerStats() {
    console.log('Calcul des statistiques...');
    this.soldeTotal = 0;
    this.epargneTotal = 0;
    this.comptes.forEach(c => {
      this.soldeTotal += c.solde;
      if (c.typeCompte === 'EPARGNE') this.epargneTotal += c.solde;
    });
    console.log('Solde total:', this.soldeTotal, 'Épargne:', this.epargneTotal);
  }

  isCredit(t: Transaction): boolean {
    if (!this.comptePrincipal) return false;
    if (t.type === 'VERSEMENT') return true;
    if (t.type === 'RETRAIT') return false;
    if (t.type === 'VIREMENT') {
      return t.compteDestination?.numeroCompte === this.comptePrincipal.numeroCompte;
    }
    return false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
