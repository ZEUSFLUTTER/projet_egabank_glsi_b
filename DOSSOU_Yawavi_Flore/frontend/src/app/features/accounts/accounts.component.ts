import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ClientService } from '../../core/services/client.service';
import { Account, AccountType, AccountDto, AccountDtoCreateOld } from '../../shared/models/account.model';
import { Client } from '../../shared/models/client.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FaIconComponent],
  templateUrl: './accounts.component.html'
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  showNewClientModal = false;
  showExistingClientModal = false;
  newClientForm: FormGroup;
  existingClientForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  filterStatus: 'active' | 'inactive' = 'active';
  searchTerm = '';
  AccountType = AccountType;
  
  faPlus = faPlus;
  faTrash = faTrash;
  faSearch = faSearch;
  faEye = faEye;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private clientService: ClientService
  ) {
    this.newClientForm = this.fb.group({
      accountType: [AccountType.COURANT, Validators.required],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nationality: ['', Validators.required]
    });

    this.existingClientForm = this.fb.group({
      accountType: [AccountType.COURANT, Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    const service = this.filterStatus === 'active' 
      ? this.accountService.getAllActiveAccounts()
      : this.accountService.getAllInactiveAccounts();

    service.subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredAccounts = this.accounts.filter(account => {
      const search = this.searchTerm.toLowerCase();
      return account.accountNumber.toLowerCase().includes(search);
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.loadAccounts();
  }

  openNewClientModal(): void {
    this.showNewClientModal = true;
    this.newClientForm.reset({ accountType: AccountType.COURANT });
  }

  openExistingClientModal(): void {
    this.showExistingClientModal = true;
    this.existingClientForm.reset({ accountType: AccountType.COURANT });
  }

  closeModals(): void {
    this.showNewClientModal = false;
    this.showExistingClientModal = false;
  }

  createAccountNewClient(): void {
    if (this.newClientForm.valid) {
      this.loading = true;
      const formValue = this.newClientForm.value;
      const accountDto: AccountDto = {
        accountType: formValue.accountType,
        client: {
          lastName: formValue.lastName,
          firstName: formValue.firstName,
          dateOfBirth: formValue.dateOfBirth,
          gender: formValue.gender,
          address: formValue.address,
          phoneNumber: formValue.phoneNumber,
          email: formValue.email,
          nationality: formValue.nationality
        }
      };

      this.accountService.createAccountForNewClient(accountDto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  createAccountExistingClient(): void {
    if (this.existingClientForm.valid) {
      this.loading = true;
      const formValue = this.existingClientForm.value;
      const accountDto: AccountDtoCreateOld = {
        accountType: formValue.accountType,
        client: { email: formValue.clientEmail }
      };

      this.accountService.createAccountForExistingClient(accountDto).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.loading = false;
          setTimeout(() => {
            this.closeModals();
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la création';
          this.loading = false;
        }
      });
    }
  }

  deleteAccount(account: Account): void {
    if (confirm(`Supprimer le compte ${account.accountNumber} ?`)) {
      this.accountService.deleteAccount(account.accountNumber).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          setTimeout(() => {
            this.successMessage = '';
            this.loadAccounts();
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
}
