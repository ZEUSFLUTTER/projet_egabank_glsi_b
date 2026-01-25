import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-first-account',
  imports: [FormsModule, RouterModule],
  templateUrl: './first-account.html',
  styleUrl: './first-account.scss',
})
export class FirstAccountComponent implements OnInit {
  newAccountType = 'courant';
  newAccountBalance = '0';
  userName = '';

  constructor(
    
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    // Récupère le nom de l'utilisateur depuis localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{"name": "Utilisateur"}');
    this.userName = user.name;
  }

  createFirstAccount() {
    const accountData = {
      type: this.newAccountType.toUpperCase(), // ✅ Majuscule
      solde: parseFloat(this.newAccountBalance),
    };

    this.apiService.createMyAccount(accountData).subscribe({
      next: (response) => {
        // ✅ Redirige vers le dashboard après création
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte:', err);
      }
    });
  }

  skip() {
    // ✅ Redirige vers le dashboard sans créer de compte
    this.router.navigate(['/dashboard']);
  }
}