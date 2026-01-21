import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard as DashboardDTO } from '../../models/dashboard.model';

import { 
  LucideAngularModule, 
  Users, 
  CreditCard, 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown,
  Wallet, 
  PiggyBank, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-angular';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboard?: DashboardDTO;
  loading = signal(true);

  readonly Users = Users;
  readonly CreditCard = CreditCard;
  readonly ArrowLeftRight = ArrowLeftRight;
  readonly TrendingUp = TrendingUp;
  readonly Wallet = Wallet;
  readonly PiggyBank = PiggyBank
  readonly ArrowDownLeft = ArrowDownLeft;
  readonly ArrowUpRight = ArrowUpRight;
  readonly TrendingDown = TrendingDown;

  readonly typeConfig: Record<string, any> = {
    'Depot': {
      icon: ArrowDownLeft,
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
      label: 'Dépôt',
      isPositive: true
    },
    'Retrait': {
      icon: ArrowUpRight,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-500',
      label: 'Retrait',
      isPositive: false
    },
    'Virement': {
      icon: ArrowLeftRight,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
      label: 'Virement',
      isPositive: false
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading.set(false);
        console.log('Dashboard data loaded:', data);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}