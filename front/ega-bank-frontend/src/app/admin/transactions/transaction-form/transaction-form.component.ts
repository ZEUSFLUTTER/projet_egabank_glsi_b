import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { CompteService } from 'src/app/core/services/compte.service';
import { Operation } from 'src/app/core/models/operation.model';
import { Compte } from 'src/app/core/models/compte.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm: FormGroup;
  comptes: Compte[] = [];
  isEditMode: boolean = false;
  transactionId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {
    this.transactionForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      compteId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComptes();
    this.checkEditMode();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe(comptes => {
      this.comptes = comptes;
    });
  }

  checkEditMode(): void {
    // Logic to check if we are in edit mode and load the transaction details
    if (this.transactionId) {
      this.isEditMode = true;
      this.transactionService.getTransactionById(this.transactionId).subscribe(transaction => {
        this.transactionForm.patchValue(transaction);
      });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const transaction: Operation = this.transactionForm.value;
      if (this.isEditMode) {
        this.transactionService.updateTransaction(this.transactionId!, transaction).subscribe(() => {
          // Handle successful update
        });
      } else {
        this.transactionService.createTransaction(transaction).subscribe(() => {
          // Handle successful creation
        });
      }
    }
  }
}