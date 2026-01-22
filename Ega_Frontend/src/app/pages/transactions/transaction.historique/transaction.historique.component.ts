import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DemandeHistoriqueDto, HistoriqueTransactionDto } from '../../../dto/Transaction';
import { TransactionService } from '../../../core/services/transaction.service';
import { noFutureDate } from '../../../validator/date.validator';

@Component({
  selector: 'app-transaction-historique',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction.historique.component.html',
  styleUrls: ['./transaction.historique.component.scss'],
})
export class TransactionHistoriqueComponent implements OnInit {
  historiqueForm!: FormGroup;
  transactions: HistoriqueTransactionDto[] = [];
  loading = false;
  loadingPdf = false;
  error: string | null = null;
  successMessage: string | null = null;
  noData = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Initialisation du formulaire avec des valeurs par défaut
   * Date de début : Premier jour du mois en cours
   * Date de fin : Aujourd'hui
   */
  initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split('T')[0];

    this.historiqueForm = this.fb.group({
      accountNumber: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.pattern(/^[A-Z0-9]+$/) // Seulement lettres majuscules et chiffres
      ]],
      dateDebut: [firstDayOfMonth, [
        Validators.required,
        noFutureDate() // Pas de date future
      ]],
      dateFin: [today, [
        Validators.required,
        noFutureDate() // Pas de date future
      ]]
    }, {
      validators: this.dateRangeValidator // Validation que dateDebut <= dateFin
    });
  }

  /**
   * Validateur pour vérifier que dateDebut <= dateFin
   */
  dateRangeValidator(form: FormGroup) {
    const dateDebut = form.get('dateDebut')?.value;
    const dateFin = form.get('dateFin')?.value;

    if (dateDebut && dateFin && dateDebut > dateFin) {
      return { dateRange: true };
    }
    return null;
  }

  /**
   * Soumission du formulaire pour récupérer l'historique
   */
  onSubmit(): void {
    // Marquer tous les champs comme touchés pour afficher les erreurs
    if (this.historiqueForm.invalid) {
      this.historiqueForm.markAllAsTouched();
      
      // Afficher un message d'erreur spécifique
      if (this.historiqueForm.get('dateDebut')?.errors?.['futureDate']) {
        this.error = 'La date de début ne peut pas être dans le futur';
      } else if (this.historiqueForm.get('dateFin')?.errors?.['futureDate']) {
        this.error = 'La date de fin ne peut pas être dans le futur';
      } else if (this.historiqueForm.errors?.['dateRange']) {
        this.error = 'La date de début doit être antérieure ou égale à la date de fin';
      } else {
        this.error = 'Veuillez remplir correctement tous les champs';
      }
      
      setTimeout(() => this.error = null, 5000);
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;
    this.noData = false;
    this.transactions = [];

    const formValue = this.historiqueForm.value;
    
    // Création du payload selon le format attendu par le backend
    const payload: DemandeHistoriqueDto = {
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin,
      accountNumberDto: {
        accountNumber: formValue.accountNumber.trim().toUpperCase()
      }
    };

    console.log('📤 Envoi de la requête:', payload);

    this.transactionService.getHistoriqueTransactions(payload)
      .subscribe({
        next: (data) => {
          console.log('Données reçues:', data);
          
          this.transactions = data;
          this.loading = false;
          this.noData = data.length === 0;
          
          if (data.length > 0) {
            this.successMessage = `${data.length} transaction(s) trouvée(s) pour le compte ${formValue.accountNumber}`;
            setTimeout(() => this.successMessage = null, 4000);
          }
        },
        error: (err) => {
          console.error('Erreur:', err);
          
          this.loading = false;
          this.transactions = [];
          
          // Gestion détaillée des erreurs
          if (err.status === 404) {
            this.error = 'Compte introuvable. Vérifiez le numéro de compte saisi.';
          } else if (err.status === 400) {
            this.error = err.error?.message || 'Le compte n\'existe pas ou les données sont invalides.';
          } else if (err.status === 403) {
            this.error = 'Accès refusé. Vous devez avoir le rôle GESTIONNAIRE pour accéder à cette fonctionnalité.';
          } else if (err.status === 401) {
            this.error = 'Session expirée. Veuillez vous reconnecter.';
          } else if (err.status === 0) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
          } else {
            this.error = err.error?.message || 'Erreur lors de la récupération de l\'historique. Veuillez réessayer.';
          }
          
          // Auto-effacement du message d'erreur après 8 secondes
          setTimeout(() => this.error = null, 8000);
        }
      });
  }

  /**
   * Téléchargement du relevé PDF
   */
  telechargerReleve(): void {
    if (this.historiqueForm.invalid) {
      this.historiqueForm.markAllAsTouched();
      this.error = 'Veuillez remplir correctement tous les champs avant de télécharger le relevé';
      setTimeout(() => this.error = null, 5000);
      return;
    }

    this.loadingPdf = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.historiqueForm.value;
    const accountNumber = formValue.accountNumber.trim().toUpperCase();

    console.log('📄 Demande de téléchargement PDF:', {
      accountNumber,
      dateDebut: formValue.dateDebut,
      dateFin: formValue.dateFin
    });

    this.transactionService.telechargerRelevePdf(
      accountNumber,
      formValue.dateDebut,
      formValue.dateFin
    ).subscribe({
      next: (blob) => {
        console.log('PDF reçu, taille:', blob.size, 'bytes');
        
        this.loadingPdf = false;
        
        // Vérifier que le blob n'est pas vide
        if (blob.size === 0) {
          this.error = 'Le fichier PDF est vide. Aucune transaction à afficher.';
          return;
        }
        
        // Utilisation de la méthode utilitaire du service pour télécharger
        this.transactionService.downloadPdfFile(
          blob,
          accountNumber,
          formValue.dateDebut,
          formValue.dateFin
        );
        
        this.successMessage = `Relevé PDF téléchargé avec succès pour le compte ${accountNumber} !`;
        setTimeout(() => this.successMessage = null, 4000);
      },
      error: (err) => {
        console.error('Erreur PDF:', err);
        
        this.loadingPdf = false;
        
        // Gestion des erreurs spécifiques au PDF
        if (err.status === 404) {
          this.error = 'Compte introuvable. Impossible de générer le relevé.';
        } else if (err.status === 403) {
          this.error = 'Accès refusé. Vous n\'avez pas l\'autorisation de télécharger ce relevé.';
        } else if (err.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
        } else if (err.status === 500) {
          this.error = 'Erreur serveur lors de la génération du PDF. Veuillez réessayer.';
        } else if (err.status === 0) {
          this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        } else {
          this.error = 'Erreur lors du téléchargement du relevé PDF. Veuillez réessayer.';
        }
        
        setTimeout(() => this.error = null, 8000);
      }
    });
  }

  /**
   * Récupère la couleur associée à un type de transaction
   */
  getTransactionColor(type: string): string {
    switch (type) {
      case 'DEPOT':
        return 'success';
      case 'RETRAIT':
        return 'danger';
      case 'TRANSFERT':
        return 'info';
      default:
        return '';
    }
  }

  /**
   * Récupère l'icône associée à un type de transaction
   */
  getTransactionIcon(type: string): string {
    switch (type) {
      case 'DEPOT':
        return '↓';
      case 'RETRAIT':
        return '↑';
      case 'TRANSFERT':
        return '⇄';
      default:
        return '•';
    }
  }

  /**
   * Calcule le total des dépôts
   */
  getTotalDepots(): number {
    return this.transactions
      .filter(t => t.transactionType === 'DEPOT')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  /**
   * Calcule le total des retraits
   */
  getTotalRetraits(): number {
    return this.transactions
      .filter(t => t.transactionType === 'RETRAIT')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  /**
   * Calcule le total des transferts
   */
  getTotalTransferts(): number {
    return this.transactions
      .filter(t => t.transactionType === 'TRANSFERT')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }

  /**
   * Compte le nombre de transactions par type
   */
  getCountByType(type: string): number {
    return this.transactions.filter(t => t.transactionType === type).length;
  }

  /**
   * Réinitialise le formulaire et les données
   */
  reset(): void {
    this.historiqueForm.reset();
    this.transactions = [];
    this.error = null;
    this.successMessage = null;
    this.noData = false;
    this.loading = false;
    this.loadingPdf = false;
    
    // Réinitialiser avec les valeurs par défaut
    this.initForm();
    
    console.log('Formulaire réinitialisé');
  }
}