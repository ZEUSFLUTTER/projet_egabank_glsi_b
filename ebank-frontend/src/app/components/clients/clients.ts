import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  pagedClients: any[] = []; 
  
  keyword: string = "";
  pageSize: number = 10;
  currentPage: number = 1;

  constructor(private clientService: ClientService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.handleGetClients();
  }

  handleGetClients() {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.applyFilterAndPagination();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilterAndPagination() {
    const searchResult = this.clients.filter(c =>
      c.nom.toLowerCase().includes(this.keyword.toLowerCase()) ||
      c.prenom.toLowerCase().includes(this.keyword.toLowerCase()) ||
      c.email.toLowerCase().includes(this.keyword.toLowerCase())
    );
    this.filteredClients = searchResult;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedClients = searchResult.slice(startIndex, startIndex + this.pageSize);
    this.cdr.detectChanges();
  }

  handleDeleteClient(c: any) {
    Swal.fire({
      title: 'Supprimer ce client ?',
      text: `Voulez-vous vraiment désactiver le compte de ${c.nom} ${c.prenom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(c.id).subscribe({
          next: () => {
            Swal.fire('Supprimé !', 'Le client a été retiré de la liste.', 'success');
            this.handleGetClients(); // Recharge la liste
          },
          error: () => Swal.fire('Erreur', 'Impossible de supprimer ce client', 'error')
        });
      }
    });
  }

  onPageChange(page: number) { this.currentPage = page; this.applyFilterAndPagination(); }
  onPageSizeChange() { this.currentPage = 1; this.applyFilterAndPagination(); }
}