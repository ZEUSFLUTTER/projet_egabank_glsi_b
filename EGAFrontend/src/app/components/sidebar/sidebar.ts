import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutDashboard,
  LucideAngularModule,
  Users,
  Wallet,
  ArrowLeftRight,
  Settings,
  LogOut,
  Building2 ,
  LucideShieldUser
} from 'lucide-angular';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {
  readonly Building2 = Building2;
  readonly LogOut = LogOut;
  adminData: any;
  menuItems: any[] = [];
  isModalOpen = false;

  ngOnInit() {
    this.adminData = this.authService.getUser();
    this.setupMenu();
  }

  constructor(private authService: AuthService) {}
  setupMenu() {
    this.menuItems = [
      { label: 'Tableau de bord', icon: LayoutDashboard, route: '/dashboard' },
      { label: 'Clients', icon: Users, route: '/client' },
      { label: 'Comptes', icon: Wallet, route: '/compte' },
      { label: 'Transactions', icon: ArrowLeftRight, route: '/transaction' },
      { label: 'Parametres', icon: Settings, route: '/parametres' },
    ];
    if (this.adminData?.role === 'SUPER_ADMIN') {
      this.menuItems.push(
        { label: 'Administrateurs', icon: LucideShieldUser, route: '/administrateur' },      
      );
    }
  }
  onLogout() {
    this.authService.logout();
  }
}