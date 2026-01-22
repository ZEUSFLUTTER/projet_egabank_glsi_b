import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RoleType } from '../../shared/models/user.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { 
  faHome, faUsers, faUserTie, faBuilding, faCreditCard, 
  faExchangeAlt, faFileAlt, faSignOutAlt, faBars, faTimes,
  faChartLine, faUserPlus, faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FaIconComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  sidebarOpen = true;
  RoleType = RoleType;

  // Icons
  faHome = faHome;
  faUsers = faUsers;
  faUserTie = faUserTie;
  faBuilding = faBuilding;
  faCreditCard = faCreditCard;
  faExchangeAlt = faExchangeAlt;
  faFileAlt = faFileAlt;
  faSignOutAlt = faSignOutAlt;
  faBars = faBars;
  faTimes = faTimes;
  faChartLine = faChartLine;
  faUserPlus = faUserPlus;
  faMoneyBillWave = faMoneyBillWave;

  menuItems = [
    {
      label: 'Tableau de bord',
      icon: this.faHome,
      route: '/dashboard/home',
      roles: [RoleType.ADMIN, RoleType.GESTIONNAIRE, RoleType.CAISSIERE]
    },
    {
      label: 'Utilisateurs',
      icon: this.faUsers,
      route: '/dashboard/users',
      roles: [RoleType.ADMIN]
    },
    {
      label: 'Clients',
      icon: this.faUserTie,
      route: '/dashboard/clients',
      roles: [RoleType.GESTIONNAIRE]
    },
    {
      label: 'Comptes',
      icon: this.faCreditCard,
      route: '/dashboard/accounts',
      roles: [RoleType.GESTIONNAIRE]
    },
    {
      label: 'Transactions',
      icon: this.faExchangeAlt,
      route: '/dashboard/transactions',
      roles: [RoleType.CAISSIERE]
    },
    {
      label: 'Rapports',
      icon: this.faFileAlt,
      route: '/dashboard/reports',
      roles: [RoleType.GESTIONNAIRE]
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  hasAccess(roles: RoleType[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  logout(): void {
    this.authService.logout();
  }
}
