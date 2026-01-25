import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deposit',
  imports: [FormsModule, CommonModule],
  templateUrl: './deposit.html',
  styleUrl: './deposit.scss',
})
export class DepositComponent implements OnInit {
  accountId = '';
  amount = '';
  message = '';
  messageType: 'success' | 'error' = 'success';
  loading = false; // <--- Propriété ajoutée

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    console.log('Dépôt component créé');
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.accountId = params['accountId'] || '';
      console.log('ID du compte reçu:', this.accountId);
    });

    console.log('Component initialisé');
  }

  // ✅ Méthode pour valider le montant dans le template
  isAmountInvalid(): boolean {
    const montantNumerique = parseFloat(this.amount);
    return isNaN(montantNumerique) || montantNumerique <= 0;
  }

  onDeposit() {
    console.log('=== Début de la fonction onDeposit ===');
    console.log('Valeur de accountId:', this.accountId);
    console.log('Valeur de amount:', this.amount);

    if (!this.accountId || !this.amount) {
      console.log('Condition remplie - message d\'erreur');
      this.message = 'Veuillez remplir tous les champs';
      this.messageType = 'error';
      return;
    }

    const montantNumerique = parseFloat(this.amount);
    if (isNaN(montantNumerique) || montantNumerique <= 0) {
      this.message = 'Le montant doit être un nombre positif.';
      this.messageType = 'error';
      return;
    }

    this.loading = true; // <--- Active l'indicateur
    this.message = ''; // Réinitialise le message précédent

    console.log('Envoi de la requête de dépôt...');
    this.apiService.makeDeposit(this.accountId, montantNumerique).subscribe({
      next: (response) => {
        console.log('Réponse reçue:', response);
        this.message = response.message || 'Dépôt effectué avec succès';
        this.messageType = 'success';
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 2000);
      },
      error: (err) => {
        console.log('Erreur interceptée par ErrorInterceptor:', err);
        this.message = 'Erreur lors du dépôt. Voir notification.';
        this.messageType = 'error';
      },
      complete: () => {
        this.loading = false; // <--- Désactive l'indicateur
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}