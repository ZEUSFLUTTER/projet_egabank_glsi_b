import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // For *ngIf
import { RouterOutlet } from '@angular/router'; // For router-outlet

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  currentPage = 'dashboard';

  constructor(private router: Router) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = JSON.parse(userStr);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  navigateTo(page: string) {
    this.currentPage = page;
    this.router.navigate([`/dashboard/${page}`]);
  }

  isAdminOrAgent(): boolean {
    return this.user?.role === 'ADMIN' || this.user?.role === 'AGENT';
  }

  getPageTitle(): string {
    const titles: { [key: string]: string } = {
      'dashboard': 'Tableau de bord',
      'compte': 'Mes comptes',
      'depot': 'Dépôt',
      'retrait': 'Retrait',
      'virement': 'Virement',
      'transactions': 'Historique des transactions',
      'profile': 'Mon profil',
      // 'clients': 'Gestion des clients', etc.
    };
    return titles[this.currentPage] || 'EgaBank';
  }
}