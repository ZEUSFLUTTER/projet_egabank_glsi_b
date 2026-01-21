import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransactionService } from '../../../services/transaction.service';
import { CompteService } from '../../../services/compte.service';
import { Operation, Virement } from '../../../models/transaction.model';
import { Compte } from '../../../models/compte.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  comptes: Compte[] = [];
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService,
    private router: Router
  ) {
    this.transactionForm = this.fb.group({
      transactionType: ['depot', Validators.required],
      compteId: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAll().subscribe({
      next: data => this.comptes = data
    });
  }

  onTypeChange(): void {
    const type = this.transactionForm.get('transactionType')?.value;
    if (type === 'virement') {
      this.transactionForm.addControl('compteDestinationId', this.fb.control('', Validators.required));
    } else {
      if (this.transactionForm.contains('compteDestinationId')) {
        this.transactionForm.removeControl('compteDestinationId');
      }
    }
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) return;

    const type = this.transactionForm.get('transactionType')?.value;

    if (type === 'virement') {
      const virement: Virement = {
        compteSourceId: this.transactionForm.value.compteId,
        compteDestinationId: this.transactionForm.value.compteDestinationId,
        montant: this.transactionForm.value.montant,
        description: this.transactionForm.value.description
      };
      this.transactionService.faireVirement(virement).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: err => this.errorMessage = err.error?.message || 'Erreur lors du virement'
      });
    } else {
      const operation: Operation = {
        compteId: this.transactionForm.value.compteId,
        montant: this.transactionForm.value.montant,
        description: this.transactionForm.value.description
      };
      const serviceCall = type === 'depot'
        ? this.transactionService.faireDepot(operation)
        : this.transactionService.faireRetrait(operation);

      serviceCall.subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: err => this.errorMessage = err.error?.message || 'Erreur lors de l\'opération'
      });
    }
  }
}
