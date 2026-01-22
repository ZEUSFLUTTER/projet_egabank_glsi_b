import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  username: string = 'Utilisateur';
  usernameInitial: string = 'U';
  isOpen = false;
  isAdmin: boolean = false;

  constructor(private router: Router, private auth: Auth) {}

  ngOnInit(): void {
    const username = this.auth.getUsername();
    if (username) {
      this.username = username;
      this.usernameInitial = username.charAt(0).toUpperCase();
    }
    this.isAdmin = this.auth.isAdmin();
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.auth.logout();
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}

