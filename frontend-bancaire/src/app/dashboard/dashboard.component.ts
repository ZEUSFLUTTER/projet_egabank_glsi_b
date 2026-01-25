import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  userName = '';
  accounts: any[] = [];
  showNoAccountMessage = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const user = this.authService.currentUser;
    this.userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur';
    this.loadAccounts();
  }

  loadAccounts() {
    this.apiService.getMyAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
      }
    });
  }

  async goToAccounts() {
    console.log("goToAccounts appelé");
    const response = await this.apiService.getMyAccounts().toPromise();
    const accounts = response || [];
    
    if (accounts.length === 0) {
      this.showNoAccountMessage = true;
    } else {
      this.router.navigate(['/accounts']);
    }
  }

  async goToTransactions() {
    console.log("goToTransactions appelé");
    const response = await this.apiService.getMyAccounts().toPromise();
    const accounts = response || [];
    
    if (accounts.length === 0) {
      this.showNoAccountMessage = true;
    } else {
      this.router.navigate(['/transactions']);
    }
  }

  async goToTransfer() {
    console.log("goToTransfer appelé");
    const response = await this.apiService.getMyAccounts().toPromise();
    const accounts = response || [];
    
    if (accounts.length === 0) {
      this.showNoAccountMessage = true;
    } else {
      this.router.navigate(['/transfer']);
    }
  }

  async goToVersement() {
    console.log("goToVersement appelé");
    const response = await this.apiService.getMyAccounts().toPromise();
    const accounts = response || [];
    
    if (accounts.length === 0) {
      this.showNoAccountMessage = true;
    } else {
      this.router.navigate(['/deposit']);
    }
  }

  async goToWithdraw() {
    console.log("goToWithdraw appelé");
    const response = await this.apiService.getMyAccounts().toPromise();
    const accounts = response || [];
    
    if (accounts.length === 0) {
      this.showNoAccountMessage = true;
    } else {
      this.router.navigate(['/withdraw']);
    }
  }

  closeMessage() {
    this.showNoAccountMessage = false;
  }

  redirectToCreateAccount() {
    this.router.navigate(['/first-account']);
  }

  logout() {
    this.authService.logout();
  }
}