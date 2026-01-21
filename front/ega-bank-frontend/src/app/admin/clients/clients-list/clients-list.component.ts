import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.scss']
})
export class ClientsListComponent implements OnInit {
  clients: Client[] = []; // Array to hold the list of clients
  loading: boolean = true; // Loading state for the component

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients(); // Load clients when the component initializes
  }

  // Method to load clients from the service
  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data; // Assign the fetched clients to the local array
        this.loading = false; // Set loading to false after data is fetched
      },
      error: (err) => {
        console.error('Error fetching clients', err); // Log any errors
        this.loading = false; // Set loading to false in case of error
      }
    });
  }

  // Method to delete a client
  deleteClient(clientId: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          this.loadClients(); // Reload clients after deletion
        },
        error: (err) => {
          console.error('Error deleting client', err); // Log any errors
        }
      });
    }
  }
}