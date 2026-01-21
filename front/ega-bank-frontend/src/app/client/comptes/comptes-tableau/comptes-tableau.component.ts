import { Component, OnInit } from '@angular/core';
import { CompteService } from 'src/app/core/services/compte.service';
import { Compte } from 'src/app/core/models/compte.model';

@Component({
  selector: 'app-comptes-tableau',
  templateUrl: './comptes-tableau.component.html',
  styleUrls: ['./comptes-tableau.component.scss']
})
export class ComptesTableauComponent implements OnInit {
  comptes: Compte[] = []; // Array to hold the list of accounts
  loading: boolean = true; // Loading state for the accounts

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes(); // Load accounts on component initialization
  }

  // Method to load accounts from the service
  loadComptes(): void {
    this.compteService.getComptes().subscribe({
      next: (data) => {
        this.comptes = data; // Assign the fetched accounts to the local array
        this.loading = false; // Set loading to false after data is fetched
      },
      error: (err) => {
        console.error('Error fetching accounts', err); // Log any errors
        this.loading = false; // Set loading to false on error
      }
    });
  }
}