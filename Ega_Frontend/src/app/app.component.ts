import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Ega_Frontend';
  isAuthenticated = false;
  userRole: string | null = null;
  userName: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Vérification initiale
    this.checkAuthentication();

    // 🔥 Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthentication();
      });
  }

  checkAuthentication(): void {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const name = localStorage.getItem('userName');
    
    this.isAuthenticated = !!token;
    this.userRole = role;
    this.userName = name;
  }

  logout(): void {
    if (confirm('Êtes-vous sûr de vouloir vous déconnexter ?')) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      
      this.isAuthenticated = false;
      this.userRole = null;
      this.userName = null;
      
      this.router.navigate(['/login']);
    }
  }

  hasRole(role: string): boolean {
    return this.userRole === role;
  }
}