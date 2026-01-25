import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdraw',
  imports: [FormsModule, CommonModule],
  templateUrl: './withdraw.html',
  styleUrl: './withdraw.scss',
})
export class WithdrawComponent {
  accountId = '';
  amount = '';
  message = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    // ✅ Récupération de l'ID du compte depuis les paramètres de route
    this.route.queryParams.subscribe(params => {
      this.accountId = params['accountId'] || '';
    });
  }

  onWithdraw() {
    if (!this.accountId || !this.amount) {
      this.message = 'Veuillez remplir tous les champs';
      return;
    }

    // ✅ Envoie le montant comme paramètre de requête
    this.apiService.postData(`compte/${this.accountId}/retrait?montant=${this.amount}`, {}).subscribe({
      next: (response) => {
        this.message = 'Retrait effectué avec succès';
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 2000);
      },
      error: (err) => {
        this.message = 'Erreur lors du retrait';
        console.error(err);
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}