import { Component, OnInit } from '@angular/core';
import { CompteService } from 'src/app/core/services/compte.service';
import { Compte } from 'src/app/core/models/compte.model';

@Component({
  selector: 'app-comptes-list',
  templateUrl: './comptes-list.component.html',
  styleUrls: ['./comptes-list.component.scss']
})
export class ComptesListComponent implements OnInit {
  comptes: Compte[] = [];

  constructor(private compteService: CompteService) {}

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe(
      (data: Compte[]) => {
        this.comptes = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des comptes', error);
      }
    );
  }

  deleteCompte(id: number): void {
    this.compteService.deleteCompte(id).subscribe(
      () => {
        this.comptes = this.comptes.filter(compte => compte.id !== id);
      },
      (error) => {
        console.error('Erreur lors de la suppression du compte', error);
      }
    );
  }
}