import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { Client } from '../../../models/Client';
import { ClientService } from '../../../core/services/client.service';
import { AccountDtoCreateExisting } from '../../../dto/AccountDtoCreateExisting';

@Component({
  selector: 'app-create-account-existing-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-account-old.component.html',
  styleUrl: './create-account-old.component.scss'
})
export class CreateAccountExistingClientComponent implements OnInit{

  // Formulaires
  public searchForm!: FormGroup;
  public createAccountForm!: FormGroup;

  // États
  public clientFound = false;
  public isSearching = false;
  public client: Client | null = null;
  public searchError = '';

  // Services
  private readonly accountService: AccountService = inject(AccountService);
  private readonly clientService: ClientService = inject(ClientService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Formulaire de recherche
    this.searchForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulaire de création de compte
    this.createAccountForm = this.fb.group({
      accountType: ['', [Validators.required]]
    });
  }

  /**
   * Recherche le client par email
   */
  onSearchClient(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.isSearching = true;
    this.searchError = '';
    const email = this.searchForm.value.email;

    this.clientService.findClientByEmail(email).subscribe({
      next: (client) => {
        console.log('Client trouvé :', client);
        this.client = client;
        this.clientFound = true;
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche du client :', err);
        this.isSearching = false;
        
        if (err.status === 404) {
          this.searchError = "Aucun client trouvé avec cet email.";
        } else if (err.status === 401) {
          this.searchError = 'Session expirée. Veuillez vous reconnecter.';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.searchError = 'Une erreur est survenue lors de la recherche.';
        }
      }
    });
  }

  /**
   * Crée le compte pour le client trouvé
   */

  /*
  onSubmit(): void {
    if (this.createAccountForm.invalid || !this.client) {
      this.createAccountForm.markAllAsTouched();
      return;
    }

    const formValue = this.createAccountForm.value;

    console.log('Création du compte pour :', {
      email: this.client.email,
      accountType: formValue.accountType
    });

    this.accountService.createAccountExistingClient(this.client.email!, formValue.accountType).subscribe({
      next: (response) => {
        console.log('Compte créé avec succès :', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erreur lors de la création du compte :', err);
        // Vous pouvez ajouter une gestion d'erreur ici
      }
    });
  }

  */

  onSubmit(): void {
  if (this.createAccountForm.invalid || !this.client) {
    this.createAccountForm.markAllAsTouched();
    return;
  }

  const formValue = this.createAccountForm.value;

  const accountDto: AccountDtoCreateExisting = {
    accountType: formValue.accountType,
    client: { email: this.client.email! }
  };

  console.log('Création du compte pour :', accountDto);

  this.accountService.createAccountExistingClient(accountDto).subscribe({
    next: (response) => {
      console.log('Compte créé avec succès :', response);
      this.createAccountForm.reset();
      this.router.navigate(['/']);
    },
    error: (err) => {
      console.error('Erreur lors de la création du compte :', err);
    }
  });
}
  /**
   * Réinitialise la recherche pour chercher un autre client
   */
  resetSearch(): void {
    this.clientFound = false;
    this.client = null;
    this.searchError = '';
    this.searchForm.reset();
    this.createAccountForm.reset();
  }
}