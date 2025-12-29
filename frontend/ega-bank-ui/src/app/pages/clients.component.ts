import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientResponse } from '../models/client.model';
import { ClientService } from '../services/client.service';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule],
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {
  clients: ClientResponse[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private router: Router, private clientService: ClientService) { }

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.isLoading = true;
    this.clientService.getAll(0, 100).subscribe({
      next: (response) => {
        this.clients = response.content || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load clients', err);
        this.errorMessage = 'Failed to load clients. Please try again.';
        this.isLoading = false;
      },
    });
  }

  viewAccounts(clientId: number) {
    this.router.navigate(['/accounts'], { queryParams: { clientId } });
  }

  viewDetails(clientId: number) {
    this.router.navigate(['/clients', clientId]);
  }
}
