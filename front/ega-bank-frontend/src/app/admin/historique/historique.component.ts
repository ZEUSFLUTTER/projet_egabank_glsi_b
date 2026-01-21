import { Component, OnInit } from '@angular/core';
import { HistoriqueService } from 'src/app/core/services/historique.service';
import { Operation } from 'src/app/core/models/operation.model';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  operations: Operation[] = [];

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.loadHistorique();
  }

  loadHistorique(): void {
    this.historiqueService.getHistorique().subscribe(
      (data: Operation[]) => {
        this.operations = data;
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'historique', error);
      }
    );
  }
}