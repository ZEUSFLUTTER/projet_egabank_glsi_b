import { Component, OnInit } from '@angular/core';
import { HistoriqueService } from 'src/app/core/services/historique.service';
import { Operation } from 'src/app/core/models/operation.model';

@Component({
  selector: 'app-operations-historique',
  templateUrl: './operations-historique.component.html',
  styleUrls: ['./operations-historique.component.scss']
})
export class OperationsHistoriqueComponent implements OnInit {
  operations: Operation[] = [];

  constructor(private historiqueService: HistoriqueService) {}

  ngOnInit(): void {
    this.loadOperations();
  }

  loadOperations(): void {
    this.historiqueService.getOperations().subscribe(
      (data: Operation[]) => {
        this.operations = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des opérations', error);
      }
    );
  }
}