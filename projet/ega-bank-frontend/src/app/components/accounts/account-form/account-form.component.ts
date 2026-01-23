import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { AccountService } from '../../../services/account.service';
import { ClientService } from '../../../services/client.service';
import { Account } from '../../../models/account.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  account: Account = {
    typeCompte: 'COMPTE_COURANT',
    proprietaireId: 0
  };

  clients: Client[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private accountService: AccountService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients', error);
        this.errorMessage = 'Erreur lors du chargement des clients';
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountService.createAccount(this.account).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: (error) => {
        console.error('Erreur lors de la création', error);
        this.errorMessage = error.error?.message || 'Erreur lors de la création du compte';
        this.isLoading = false;
      }
    });
  }
}
