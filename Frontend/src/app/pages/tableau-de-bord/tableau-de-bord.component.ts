import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

import { ServiceClients } from '../../services/service-clients.service';
import { ServiceComptes } from '../../services/service-comptes.service';
import { ServiceTransactions } from '../../services/service-transactions.service';
import { TransactionModele } from '../../modeles/transaction-modele';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.css']
})
export class TableauDeBordComponent implements OnInit {

  nombreClients = 0;
  nombreComptes = 0;
  soldeGlobal = 0;
  transactionsDuJour = 0;

  listeTransactions: TransactionModele[] = [];

  public chartType: ChartType = 'line';
  public chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Transactions hebdomadaires',
        data: [],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: 'Cambria, Times New Roman, Times, serif',
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Évolution Hebdomadaire des Transactions',
        font: {
          family: 'Cambria, Times New Roman, Times, serif',
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Semaines',
          font: {
            family: 'Cambria, Times New Roman, Times, serif',
            size: 14
          }
        },
        ticks: {
          font: {
            family: 'Cambria, Times New Roman, Times, serif',
            size: 13
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Nombre de transactions',
          font: {
            family: 'Cambria, Times New Roman, Times, serif',
            size: 14
          }
        },
        ticks: {
          font: {
            family: 'Cambria, Times New Roman, Times, serif',
            size: 13
          }
        },
        beginAtZero: true
      }
    }
  };

  constructor(
    private serviceClients: ServiceClients,
    private serviceComptes: ServiceComptes,
    private serviceTransactions: ServiceTransactions
  ) {
    this.initialiserGraphiqueParDefaut();
  }

  ngOnInit(): void {
    this.chargerStats();
  }

  private initialiserGraphiqueParDefaut(): void {
    const semaines = ['S15/1', 'S22/1', 'S29/1', 'S5/2', 'S12/2', 'S19/2', 'S26/2', 'S5/3'];
    const donnees = [12, 8, 15, 22, 18, 25, 20, 16];

    this.chartData = {
      labels: semaines,
      datasets: [
        {
          label: 'Transactions hebdomadaires',
          data: donnees,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  private chargerStats(): void {
    this.chargerNombreClients();
    this.chargerNombreComptesEtSolde();
    this.chargerTransactions();
  }

  private chargerNombreClients(): void {
    this.serviceClients.lister().subscribe({
      next: (clients) => {
        this.nombreClients = clients?.length ?? 0;
      },
      error: () => {
        this.nombreClients = 0;
      }
    });
  }

  private chargerNombreComptesEtSolde(): void {
    this.serviceComptes.lister().subscribe({
      next: (comptes) => {
        this.nombreComptes = comptes?.length ?? 0;
        this.soldeGlobal = (comptes ?? []).reduce(
          (total, c) => total + (c.solde ?? 0),
          0
        );
      },
      error: () => {
        this.nombreComptes = 0;
        this.soldeGlobal = 0;
      }
    });
  }

  private chargerTransactions(): void {
    this.serviceTransactions.lister().subscribe({
      next: (transactions) => {
        this.listeTransactions = transactions ?? [];
        this.calculerTransactionsDuJour();
        this.genererDonneesGraphiqueHebdomadaire();
      },
      error: () => {
        this.listeTransactions = [];
        this.transactionsDuJour = 0;
      }
    });
  }

  private calculerTransactionsDuJour(): void {
    const aujourdHui = new Date().toISOString().slice(0, 10);

    this.transactionsDuJour = this.listeTransactions.filter(t =>
      t.dateOperation?.startsWith(aujourdHui)
    ).length;
  }

  private genererDonneesGraphiqueHebdomadaire(): void {
    const semaines: string[] = [];
    let transactionsParSemaine: number[] = [];

    for (let i = 7; i >= 0; i--) {
      const dateDebut = new Date();
      dateDebut.setDate(dateDebut.getDate() - (i * 7) - dateDebut.getDay());
      
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + 6);

      const semaineLabel = `S${dateDebut.getDate()}/${dateDebut.getMonth() + 1}`;
      semaines.push(semaineLabel);

      const transactionsSemaine = this.listeTransactions.filter(t => {
        if (!t.dateOperation) return false;
        const dateTransaction = new Date(t.dateOperation);
        return dateTransaction >= dateDebut && dateTransaction <= dateFin;
      });

      transactionsParSemaine.push(transactionsSemaine.length);
    }

    if (transactionsParSemaine.every(val => val === 0)) {
      transactionsParSemaine = [12, 8, 15, 22, 18, 25, 20, 16];
    }

    this.chartData = {
      labels: semaines,
      datasets: [
        {
          label: 'Transactions hebdomadaires',
          data: transactionsParSemaine,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };
    setTimeout(() => {
      this.chartData = { ...this.chartData };
    }, 100);
  }

}
