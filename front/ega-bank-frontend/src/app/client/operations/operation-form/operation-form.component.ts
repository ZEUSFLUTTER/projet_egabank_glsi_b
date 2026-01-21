import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/core/services/transaction.service';
import { CompteService } from 'src/app/core/services/compte.service';
import { Operation } from 'src/app/core/models/operation.model';
import { Compte } from 'src/app/core/models/compte.model';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss']
})
export class OperationFormComponent implements OnInit {
  operationForm: FormGroup;
  comptes: Compte[] = [];
  operation: Operation;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private compteService: CompteService
  ) {
    this.operationForm = this.fb.group({
      compteId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getComptes().subscribe(comptes => {
      this.comptes = comptes;
    });
  }

  onSubmit(): void {
    if (this.operationForm.valid) {
      this.operation = this.operationForm.value;
      this.transactionService.createOperation(this.operation).subscribe(() => {
        // Handle successful operation creation (e.g., navigate back or show a success message)
      });
    }
  }
}