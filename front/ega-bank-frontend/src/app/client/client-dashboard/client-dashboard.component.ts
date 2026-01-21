import { Component, OnInit } from '@angular/core';
import { CompteService } from 'src/app/core/services/compte.service';
import { ClientService } from 'src/app/core/services/client.service';
import { Compte } from 'src/app/core/models/compte.model';
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  comptes: Compte[] = [];
  clients: Client[] = [];

  constructor(private compteService: CompteService, private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadComptes();
    this.loadClients();
  }

  loadComptes(): void {
    this.compteService.getComptes().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      error => {
        console.error('Error loading comptes', error);
      }
    );
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data: Client[]) => {
        this.clients = data;
      },
      error => {
        console.error('Error loading clients', error);
      }
    );
  }
}