import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { ageRangeValidator, noFutureDate } from '../../../validator/date.validator';
import { AccountType } from '../../../enums/AccountType';
import { CreateAccountRequestDto } from '../../../dto/CreateAccountRequestDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-account-new',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-account-new.component.html',
  styleUrl: './create-account-new.component.scss'
})
export class CreateAccountNewComponent implements OnInit{

  public create_account_newForm! : FormGroup;

  private readonly accountService : AccountService = inject(AccountService);

  constructor(
    private fb : FormBuilder,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.create_account_newForm = this.fb.group({
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/)]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/)]],
      dateOfBirth: [null as Date | null, [Validators.required,  noFutureDate(), ageRangeValidator(1, 120)]],
      gender : ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+228\d{8}|\+228\s\d{2}\s\d{2}\s\d{2}\s\d{2})$/)]],

      //pour empecher les (Chiffres,Symboles (@#!$)Emojis)
      nationality: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/)]],
      accountType: ['', [Validators.required]]
    });
  }

   getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onCreateAccountNewSubmit(): void {
    if(this.create_account_newForm.invalid){
      this.create_account_newForm.markAllAsTouched();
      return;
    }

    const formValue = this.create_account_newForm.value;

    const dto: CreateAccountRequestDto = {
  accountType: formValue.accountType as AccountType,
  client: {
    firstName: formValue.firstName,
    lastName: formValue.lastName,
    dateOfBirth: formValue.dateOfBirth,
    gender: formValue.gender,
    address: formValue.address,
    phoneNumber: formValue.phoneNumber,
    email: formValue.email,
    nationality: formValue.nationality
  }
};

console.log('DTO envoyé :', dto);

    this.accountService.createAccountNew(dto).subscribe({
      next: (response) => {
        console.log('Réponse du serveur :', response);
        this.router.navigate(['/']);
        this.create_account_newForm.reset();
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte :', err);
      }
    });
  }
}
