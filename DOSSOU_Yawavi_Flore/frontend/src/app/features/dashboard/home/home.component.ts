import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faUsers, faUserTie, faCreditCard, faExchangeAlt,
  faMoneyBillWave, faArrowUp, faArrowDown, faSpinner,
  faChartLine, faWallet, faUserCheck, faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ClientService } from '../../../core/services/client.service';
import { AccountService } from '../../../core/services/account.service';
import { RoleType } from '../../../shared/models/user.model';
import { forkJoin } from 'rxjs';

interface StatCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
  loading?: boolean;
  trend?: string;
  trendIcon?: any;
  trendColor?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FaIconComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  currentUser: any;
  loading = true;
  RoleType = RoleType;
  currentDate = new Date();

  // Icons
  faUsers = faUsers;
  faUserTie = faUserTie;
  faCreditCard = faCreditCard;
  faExchangeAlt = faExchangeAlt;
  faMoneyBillWave = faMoneyBillWave;
  faSpinner = faSpinner;
  faChartLine = faChartLine;
  faWallet = faWallet;
  faUserCheck = faUserCheck;
  faBuildingColumns = faBuildingColumns;

  stats: StatCard[] = [];
  totalBalance = 0;
  activeAccountsCount = 0;
  inactiveAccountsCount = 0;

  // Données pour les graphiques et activités
  recentActivities: any[] = [];

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private clientService: ClientService,
      private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.loadDashboardData();
    });
  }

  loadDashboardData(): void {
    this.loading = true;

    // Créer les requêtes en fonction du rôle
    const requests: any = {};

    if (this.hasRole(RoleType.ADMIN)) {
      requests.activeUsers = this.userService.getAllActiveUsers();
      requests.inactiveUsers = this.userService.getAllInactiveUsers();
    }

    if (this.hasRole(RoleType.GESTIONNAIRE)) {
      requests.activeClients = this.clientService.getAllActiveClients();
      requests.inactiveClients = this.clientService.getAllInactiveClients();
      requests.activeAccounts = this.accountService.getAllActiveAccounts();
      requests.inactiveAccounts = this.accountService.getAllInactiveAccounts();
    }

    if (this.hasRole(RoleType.CAISSIERE)) {
      requests.activeAccounts = this.accountService.getAllActiveAccounts();
    }

    // Charger toutes les données en parallèle
    forkJoin(requests).subscribe({
      next: (results: any) => {
        this.processStatistics(results);
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.setDefaultStats();
        this.loading = false;
      }
    });
  }

  processStatistics(data: any): void {
    this.stats = [];

    if (this.hasRole(RoleType.ADMIN)) {
      const totalUsers = (data.activeUsers?.length || 0) + (data.inactiveUsers?.length || 0);
      this.stats.push({
        title: 'Utilisateurs Actifs',
        value: data.activeUsers?.length.toString() || '0',
        icon: this.faUsers,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500',
        trend: `${totalUsers} total`,
        trendColor: 'text-gray-600'
      });

      this.stats.push({
        title: 'Utilisateurs Inactifs',
        value: data.inactiveUsers?.length.toString() || '0',
        icon: this.faUserCheck,
        color: 'text-gray-600',
        bgColor: 'bg-gray-500',
        trend: 'Désactivés',
        trendColor: 'text-gray-600'
      });
    }

    if (this.hasRole(RoleType.GESTIONNAIRE)) {
      const totalClients = (data.activeClients?.length || 0) + (data.inactiveClients?.length || 0);

      this.stats.push({
        title: 'Clients Actifs',
        value: data.activeClients?.length.toString() || '0',
        icon: this.faUserTie,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        trend: `${totalClients} total`,
        trendColor: 'text-gray-600'
      });

      // Calculer le solde total et le nombre de comptes
      const activeAccounts = data.activeAccounts || [];
      this.activeAccountsCount = activeAccounts.length;
      this.inactiveAccountsCount = data.inactiveAccounts?.length || 0;
      this.totalBalance = activeAccounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);

      this.stats.push({
        title: 'Comptes Actifs',
        value: this.activeAccountsCount.toString(),
        icon: this.faCreditCard,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500',
        trend: `${this.activeAccountsCount + this.inactiveAccountsCount} total`,
        trendColor: 'text-gray-600'
      });

      this.stats.push({
        title: 'Solde Total',
        value: this.formatCurrency(this.totalBalance),
        icon: this.faWallet,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
        trend: 'FCFA',
        trendColor: 'text-gray-600'
      });

      // Calculer le solde moyen
      const averageBalance = this.activeAccountsCount > 0
          ? this.totalBalance / this.activeAccountsCount
          : 0;

      this.stats.push({
        title: 'Solde Moyen',
        value: this.formatCurrency(averageBalance),
        icon: this.faChartLine,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-500',
        trend: 'par compte',
        trendColor: 'text-gray-600'
      });
    }

    if (this.hasRole(RoleType.CAISSIERE)) {
      const activeAccounts = data.activeAccounts || [];
      const totalBalance = activeAccounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);

      this.stats.push({
        title: 'Comptes Disponibles',
        value: activeAccounts.length.toString(),
        icon: this.faCreditCard,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500',
        trend: 'Actifs',
        trendColor: 'text-green-600'
      });

      this.stats.push({
        title: 'Solde Total Géré',
        value: this.formatCurrency(totalBalance),
        icon: this.faMoneyBillWave,
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        trend: 'FCFA',
        trendColor: 'text-gray-600'
      });
    }
  }

  setDefaultStats(): void {
    if (this.hasRole(RoleType.ADMIN)) {
      this.stats = [
        { title: 'Utilisateurs Actifs', value: '0', icon: this.faUsers, color: 'text-blue-600', bgColor: 'bg-blue-500' },
        { title: 'Utilisateurs Inactifs', value: '0', icon: this.faUserCheck, color: 'text-gray-600', bgColor: 'bg-gray-500' }
      ];
    } else if (this.hasRole(RoleType.GESTIONNAIRE)) {
      this.stats = [
        { title: 'Clients', value: '0', icon: this.faUserTie, color: 'text-green-600', bgColor: 'bg-green-500' },
        { title: 'Comptes', value: '0', icon: this.faCreditCard, color: 'text-purple-600', bgColor: 'bg-purple-500' },
        { title: 'Solde Total', value: '0', icon: this.faWallet, color: 'text-yellow-600', bgColor: 'bg-yellow-500' }
      ];
    } else if (this.hasRole(RoleType.CAISSIERE)) {
      this.stats = [
        { title: 'Comptes', value: '0', icon: this.faCreditCard, color: 'text-blue-600', bgColor: 'bg-blue-500' },
        { title: 'Solde Total', value: '0', icon: this.faMoneyBillWave, color: 'text-green-600', bgColor: 'bg-green-500' }
      ];
    }
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(0);
  }

  hasRole(role: RoleType): boolean {
    return this.currentUser?.role === role;
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}