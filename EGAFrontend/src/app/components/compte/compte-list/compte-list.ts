import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../services/compte.service';
import { 
  LucideAngularModule, ArrowLeft, CreditCard, Plus, Wallet, 
  PiggyBank, ArrowUp, ArrowDown, Send, History, Trash2, X 
} from 'lucide-angular';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, 
    LucideAngularModule,
    MatSnackBarModule
  ],
  templateUrl: './compte-list.html'
})
export class CompteList implements OnInit {
  // Icônes Lucide
  readonly ArrowLeft = ArrowLeft; readonly CreditCard = CreditCard;
  readonly Plus = Plus; readonly Wallet = Wallet;
  readonly PiggyBank = PiggyBank; readonly ArrowUp = ArrowUp;
  readonly ArrowDown = ArrowDown; readonly Send = Send;
  readonly History = History; readonly Trash2 = Trash2; readonly X = X;

  // États (Signals)
  comptes: any[] = [];
  loading = signal(false);
  selectedCompte = signal<any>(null);
  
  // États des Modaux
  isDepositModalOpen = signal(false);
  isWithdrawModalOpen = signal(false);
  isTransferModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  // Formulaires
  depositForm: FormGroup;
  withdrawForm: FormGroup;
  transferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private compteService: CompteService,
    private transactionService: TransactionService
  ) {
    // Initialisation des formulaires
    this.depositForm = this.fb.group({ montant: ['', [Validators.required, Validators.min(100)]] });
    this.withdrawForm = this.fb.group({ montant: ['', [Validators.required, Validators.min(100)]] });
    this.transferForm = this.fb.group({
      compteDestination: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(100)]]
    });
  }

  ngOnInit(): void {
    this.loadAllAccounts();
  }

  loadAllAccounts(): void {
    this.loading.set(true);
    this.compteService.loadAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open("Erreur lors du chargement des comptes", "Fermer", { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  // --- LOGIQUE DÉPÔT ---
  openDepositModal(compte: any) { this.selectedCompte.set(compte); this.isDepositModalOpen.set(true); }
  closeDepositModal() { this.isDepositModalOpen.set(false); this.depositForm.reset(); }
  onConfirmDeposit() {
    if (this.depositForm.valid) {
      const montant = this.depositForm.value.montant;
      this.transactionService.deposer(this.selectedCompte().id, montant).subscribe(() => {
        this.snackBar.open("Dépôt effectué avec succès", "OK", { duration: 3000 });
        this.loadAllAccounts();
        this.closeDepositModal();
      });
    }
  }

  // --- LOGIQUE RETRAIT ---
  openWithdrawModal(compte: any) { this.selectedCompte.set(compte); this.isWithdrawModalOpen.set(true); }
  closeWithdrawModal() { this.isWithdrawModalOpen.set(false); this.withdrawForm.reset(); }
  onConfirmWithdraw() {
    if (this.withdrawForm.valid) {
      const montant = this.withdrawForm.value.montant;
      if (montant > this.selectedCompte().solde) {
        this.snackBar.open("Solde insuffisant", "Fermer", { duration: 3000 });
        return;
      }
      this.transactionService.retirer(this.selectedCompte().id, montant).subscribe(() => {
        this.snackBar.open("Retrait effectué", "OK", { duration: 3000 });
        this.loadAllAccounts();
        this.closeWithdrawModal();
      });
    }
  }

  // --- LOGIQUE VIREMENT ---
  openTransferModal(compte: any) { this.selectedCompte.set(compte); this.isTransferModalOpen.set(true); }
  closeTransferModal() { this.isTransferModalOpen.set(false); this.transferForm.reset(); }
  onConfirmTransfer() {
    if (this.transferForm.valid) {
      const { compteDestination, montant } = this.transferForm.value;
      this.transactionService.virement(this.selectedCompte().id, compteDestination, montant).subscribe({
        next: () => {
          this.snackBar.open("Virement effectué", "OK", { duration: 3000 });
          this.loadAllAccounts();
          this.closeTransferModal();
        },
        error: () => this.snackBar.open("Virement échoué (vérifiez l'IBAN)", "Fermer")
      });
    }
  }

  // --- LOGIQUE SUPPRESSION ---
  openDeleteModal(compte: any) { this.selectedCompte.set(compte); this.isDeleteModalOpen.set(true); }
  closeDeleteModal() { this.isDeleteModalOpen.set(false); }
  onConfirmDelete() {
    this.compteService.supprimerCompte(this.selectedCompte().id).subscribe(() => {
      this.snackBar.open("Compte supprimé", "OK", { duration: 3000 });
      this.loadAllAccounts();
      this.closeDeleteModal();
    });
  }
}