import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], 
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  isCollapsed: boolean = false;

  //  passage en PUBLIC pour que le HTML puisse lire authService
  constructor(public authService: AuthService, private router: Router) {}

  toggleSidebar() { this.isCollapsed = !this.isCollapsed; }

  handleLogout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}