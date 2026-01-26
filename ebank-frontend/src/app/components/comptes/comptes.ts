import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompteService } from '../../services/compte';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comptes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './comptes.html'
})
export class ComptesComponent implements OnInit {
  accounts: any[] = [];
  filteredAccounts: any[] = [];
  keyword: string = "";

  constructor(private compteService: CompteService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.compteService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.searchAccounts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  searchAccounts() {
    this.filteredAccounts = this.accounts.filter(a => 
      a.numCompte.toLowerCase().includes(this.keyword.toLowerCase()) ||
      a.client.nom.toLowerCase().includes(this.keyword.toLowerCase())
    );
  }
}