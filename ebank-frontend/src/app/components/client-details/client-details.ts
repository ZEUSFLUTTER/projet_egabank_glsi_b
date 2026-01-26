import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Ajoute ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss'
})
export class ClientDetailsComponent implements OnInit {
  client: any;
  clientId!: number;

  
  constructor(
    private route: ActivatedRoute, 
    private clientService: ClientService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    this.loadClientData();
  }

  loadClientData() {
    this.clientService.getClient(this.clientId).subscribe({
      next: (data: any) => {
        console.log("Détails du client chargés :", data);
        this.client = data; 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        console.error("Erreur lors du chargement :", err);
      }
    });
  }
}