import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowLeft, History, Search, ArrowUpRight, ArrowDownLeft, Repeat } from 'lucide-angular';
import { TransactionService } from '../../../services/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './transaction-list.html'
})
export class TransactionList implements OnInit {
  readonly ArrowLeft = ArrowLeft; readonly History = History;
  readonly Search = Search; readonly Repeat = Repeat;
  readonly ArrowUpRight = ArrowUpRight; readonly ArrowDownLeft = ArrowDownLeft;

  allTransactions = signal<any[]>([]);
  loading = signal(false);
  searchTerm = signal('');

  filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allTransactions().filter(t => 
      t.compteSource?.id.toLowerCase().includes(term) || 
      t.compteDestination?.id.toLowerCase().includes(term) ||
      t.compteSource?.client?.nom.toLowerCase().includes(term) ||
      t.compteDestination?.client?.nom.toLowerCase().includes(term)
    );
  });

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading.set(true);
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.allTransactions.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getTypeStyles(type: string): string {
    switch (type) {
      case 'Depot': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Retrait': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Virement': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }
}