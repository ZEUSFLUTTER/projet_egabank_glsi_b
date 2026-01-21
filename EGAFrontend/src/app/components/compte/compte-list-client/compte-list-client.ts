import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { Compte as CompteModel } from '../../../models/compte.model';
import { Client as ClientModel } from '../../../models/client.model';
import { LucideAngularModule, PiggyBank, Wallet, ArrowLeft, CreditCard, ChevronRight, ArrowUp, ArrowDown, Send, Trash2, Plus, X, History } from 'lucide-angular';
import { DecimalPipe, UpperCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompteService } from '../../../services/compte.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from '../../../services/transaction.service';
import { CdkAriaLive } from "../../../../../node_modules/@angular/cdk/types/_a11y-module-chunk";
@Component({
  selector: 'app-compte-list-client',
  imports: [LucideAngularModule, RouterLink, DecimalPipe, UpperCasePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './compte-list-client.html',
  styleUrls: ['./compte-list-client.css'],
})
export class CompteListClient implements OnInit {
  comptes: CompteModel[] = [];
  client: ClientModel | null = null;
  loading = signal(true);
  readonly PiggyBank = PiggyBank;
  readonly Wallet = Wallet;
  readonly ArrowLeft = ArrowLeft;
  readonly CreditCard = CreditCard;
  readonly ChevronRight = ChevronRight;
  readonly ArrowUp = ArrowUp;
  readonly ArrowDown = ArrowDown
  readonly Send = Send;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly X = X;
  readonly History = History;
  isModalOpen = signal(false);
  accountForm: FormGroup;

  isDepositModalOpen = signal(false);
  selectedCompte = signal<CompteModel | null>(null);
  depositForm: FormGroup;
  isWithdrawModalOpen = signal(false);
  withdrawForm: FormGroup;
  isTransferModalOpen = signal(false);
  transferForm: FormGroup;
  isDeleteModalOpen = signal(false);

  openAddAccountModal() {
    this.isModalOpen.set(true);
  }

  closeAddAccountModal() {
    this.isModalOpen.set(false);
  }

constructor(
  private fb: FormBuilder, 
  private compteService: CompteService,
  private transactionService: TransactionService,
  private route: ActivatedRoute, 
  private clientService: ClientService,
  private snack: MatSnackBar
) {
  this.accountForm = this.fb.group({
    typeCompte: ['Courant', Validators.required]
  });
  this.depositForm = this.fb.group({
      montant: [null, [Validators.required, Validators.min(500)]] 
  });
  this.withdrawForm = this.fb.group({
      montant: [null, [Validators.required, Validators.min(500)]] 
  });
  this.transferForm = this.fb.group({
      montant: [null, [Validators.required, Validators.min(500)]],
      compteDestination: [null, Validators.required]
  });
}

  onSubmitAccount() {
    if (this.accountForm.valid && this.client?.id) {
      const typeChoisi = this.accountForm.value.typeCompte;
      const clientId = this.client.id;

      this.compteService.creerCompte(clientId, typeChoisi).subscribe({
        next: (nouveauCompte) => {
          this.comptes = [...this.comptes, nouveauCompte];
          this.closeAddAccountModal();
          this.snack.open('Compte crée avec succès', 'X', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });      },
        error: (err) => {
          console.error("Erreur lors de la création :", err);
        }
      });
    }
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.clientService.getClientById(id).subscribe(data => {
      this.client = data
      this.comptes = data.comptes;
      console.log(this.client);
      console.log(this.comptes);
      this.loading.set(false);
    });
  }

  openDepositModal(compte: CompteModel) {
    this.selectedCompte.set(compte);
    this.isDepositModalOpen.set(true);
  }

  closeDepositModal() {
    this.isDepositModalOpen.set(false);
    this.depositForm.reset();
    this.selectedCompte.set(null);
  }

  onConfirmDeposit() {
    if (this.depositForm.valid && this.selectedCompte()) {
      const numeroCompte = this.selectedCompte()!.id;
      const montant = this.depositForm.value.montant;

      this.transactionService.deposer(numeroCompte, montant).subscribe({
        next: (response) => {
          this.comptes = this.comptes.map(c => {
            if (c.id === numeroCompte) {
              return { ...c, solde: c.solde + montant };
            }
            return c;
          });

          this.snack.open(response, 'X', { 
            duration: 3000,
            panelClass: ['success-snackbar'] 
          });
          
          this.closeDepositModal();
        },
        error: (err) => {
          console.error("Erreur dépôt:", err);
          this.snack.open('Erreur lors du dépôt', 'X', { duration: 3000 });
        }
      });
    }
  }

  openWithdrawModal(compte: CompteModel) {
    this.selectedCompte.set(compte);
    this.isWithdrawModalOpen.set(true);
  }

  closeWithdrawModal() {
    this.isWithdrawModalOpen.set(false);
    this.withdrawForm.reset();
    this.selectedCompte.set(null);
  }

  onConfirmWithdraw() {
    if (this.withdrawForm.valid && this.selectedCompte()) {
      const compte = this.selectedCompte()!;
      const montant = this.withdrawForm.value.montant;
      if (montant > compte.solde) {
        this.snack.open('Solde insuffisant pour ce retrait', 'X', { duration: 3000 });
        return;
      }
      this.transactionService.retirer(compte.id, montant).subscribe({
        next: (response) => {
          this.comptes = this.comptes.map(c => 
            c.id === compte.id ? { ...c, solde: c.solde - montant } : c
          );
          this.snack.open(response, 'Fermer', { duration: 3000 });
          this.closeWithdrawModal();
        },
        error: (err) => {
          this.snack.open('Erreur lors du retrait', 'X', { duration: 3000 });
        }
      });
    }
  }

  openTransferModal(compte: CompteModel) {
    this.selectedCompte.set(compte);
    this.isTransferModalOpen.set(true);
  }

  closeTransferModal() {
    this.isTransferModalOpen.set(false);
    this.transferForm.reset();
  }

  onConfirmTransfer() {
    if (this.transferForm.valid && this.selectedCompte()) {
      const source = this.selectedCompte()!.id;
      const destination = this.transferForm.value.compteDestination;
      const montant = this.transferForm.value.montant;

      if (montant > this.selectedCompte()!.solde) {
        this.snack.open('Solde insuffisant', 'X', { duration: 3000 });
        return;
      }

      this.transactionService.virement(source, destination, montant).subscribe({
        next: (res) => {
          this.comptes = this.comptes.map(c => 
            c.id === source ? { ...c, solde: c.solde - montant } : c
          );
          this.comptes = this.comptes.map(c => 
            c.id === destination ? { ...c, solde: c.solde + montant } : c
          );

          this.snack.open(res, 'Fermer', { duration: 3000 });
          this.closeTransferModal();
        },
        error: () => this.snack.open('Erreur : Vérifiez l\'IBAN destination', 'X')
      });
    }
  }

  openDeleteModal(compte: CompteModel) {
    this.selectedCompte.set(compte);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
    this.selectedCompte.set(null);
  }

  onConfirmDelete() {
    const compteASupprimer = this.selectedCompte();
    
    if (compteASupprimer) {
      this.compteService.supprimerCompte(compteASupprimer.id).subscribe({
        next: (message) => {
          this.comptes = this.comptes.filter(c => c.id !== compteASupprimer.id);
        
          this.snack.open(message, 'X', { 
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error("Erreur suppression:", err);
          this.snack.open("Erreur lors de la suppression du compte", "X", { duration: 3000 });
          this.closeDeleteModal();
        }
      });
    }
  }
}