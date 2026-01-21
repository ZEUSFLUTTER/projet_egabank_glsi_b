import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanqueService } from '../../services/banque.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  totalClients: number = 0;
  soldeTotal: number = 0;
  chart: any;

  constructor(private banqueService: BanqueService) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques() {
    this.banqueService.getClients().subscribe(clients => {
      this.totalClients = clients.length;
      this.soldeTotal = clients.reduce((sum, c) => sum + Number(c.solde || 0), 0);
    });

    this.banqueService.getAllTransactions().subscribe(transactions => {
      this.genererGraphiqueParCompte(transactions);
    });
  }

  genererGraphiqueParCompte(transactions: any[]) {
    if (!transactions || transactions.length === 0) return;

    // 1. Tri chronologique
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const labels: string[] = [];
    const datasetsMap = new Map<string, any[]>();

    // 2. Extraire les noms des propriétaires de manière sécurisée
    const proprietaires = [...new Set(transactions.map(t => {
      // On teste plusieurs chemins possibles pour trouver le nom
      const nom = t.nomClient ||
                  t.compte?.client?.nom ||
                  t.client?.nom ||
                  (t.compte?.numeroCompte ? `Compte ${t.compte.numeroCompte}` : `Compte #${t.id}`);
      return nom;
    }))];

    proprietaires.forEach(p => datasetsMap.set(p, []));

    // 3. Remplir les données
    transactions.forEach((t) => {
      const dateObj = new Date(t.date);
      const label = dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) +
                    ' ' + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      labels.push(label);

      const proprioActuel = t.nomClient ||
                            t.compte?.client?.nom ||
                            t.client?.nom ||
                            (t.compte?.numeroCompte ? `Compte ${t.compte.numeroCompte}` : `Compte #${t.id}`);

      const montantNet = t.type === 'VERSEMENT' ? t.montant : -t.montant;

      proprietaires.forEach(p => {
        if (p === proprioActuel) {
          datasetsMap.get(p)?.push(montantNet);
        } else {
          datasetsMap.get(p)?.push(null);
        }
      });
    });

    // 4. Couleurs et style
    const couleurs = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2'];
    const datasets = proprietaires.map((proprio, index) => ({
      label: proprio,
      data: datasetsMap.get(proprio),
      borderColor: couleurs[index % couleurs.length],
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 6,
      spanGaps: true
    }));

    this.renderChart(labels, datasets);
  }

  renderChart(labels: string[], datasets: any[]) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: {
              // Personnalisation de l'infobulle (Tooltip)
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ' : ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            title: { display: true, text: 'Montant (FCFA)' },
            beginAtZero: false
          }
        }
      }
    });
  }
}
