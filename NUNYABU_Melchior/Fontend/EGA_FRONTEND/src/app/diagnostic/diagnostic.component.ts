import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagnosticService } from '../core/services/diagnostic.service';

@Component({
  selector: 'app-diagnostic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">🔍 Diagnostic Communication Frontend-Backend</h1>

        <!-- Test 1: Ping -->
        <div class="bg-white p-6 rounded-lg shadow mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-700">Test 1: Ping Backend (Public)</h2>
            <button (click)="testPing()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Tester
            </button>
          </div>
          <div *ngIf="pingResult" [ngClass]="pingResult.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'" 
               class="mt-4 p-4 rounded border-2">
            <p class="text-gray-800">{{ pingResult.message }}</p>
            <pre class="text-xs text-gray-600 mt-2">{{ pingResult.data | json }}</pre>
          </div>
        </div>

        <!-- Test 2: Check Token -->
        <div class="bg-white p-6 rounded-lg shadow mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-700">Test 2: Vérifier Token JWT (Protégé)</h2>
            <button (click)="testCheckToken()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Tester
            </button>
          </div>
          <div *ngIf="tokenResult" [ngClass]="tokenResult.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'" 
               class="mt-4 p-4 rounded border-2">
            <p class="text-gray-800">{{ tokenResult.message }}</p>
            <pre class="text-xs text-gray-600 mt-2">{{ tokenResult.data | json }}</pre>
          </div>
        </div>

        <!-- Test 3: Test Connection POST -->
        <div class="bg-white p-6 rounded-lg shadow mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-700">Test 3: POST avec données</h2>
            <button (click)="testPostConnection()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Tester
            </button>
          </div>
          <div *ngIf="postResult" [ngClass]="postResult.success ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'" 
               class="mt-4 p-4 rounded border-2">
            <p class="text-gray-800">{{ postResult.message }}</p>
            <pre class="text-xs text-gray-600 mt-2">{{ postResult.data | json }}</pre>
          </div>
        </div>

        <!-- Résumé -->
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-gray-700 mb-4">📊 Résumé</h2>
          <div class="grid grid-cols-3 gap-4">
            <div [ngClass]="pingResult?.success ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'" 
                 class="p-4 rounded border-2">
              <p class="text-sm text-gray-600">Public API</p>
              <p class="text-2xl font-bold" [ngClass]="pingResult?.success ? 'text-green-600' : 'text-gray-400'">
                {{ pingResult?.success ? '✅' : '⚪' }}
              </p>
            </div>
            <div [ngClass]="tokenResult?.success ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'" 
                 class="p-4 rounded border-2">
              <p class="text-sm text-gray-600">JWT Token</p>
              <p class="text-2xl font-bold" [ngClass]="tokenResult?.success ? 'text-green-600' : 'text-gray-400'">
                {{ tokenResult?.success ? '✅' : '⚪' }}
              </p>
            </div>
            <div [ngClass]="postResult?.success ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'" 
                 class="p-4 rounded border-2">
              <p class="text-sm text-gray-600">POST Request</p>
              <p class="text-2xl font-bold" [ngClass]="postResult?.success ? 'text-green-600' : 'text-gray-400'">
                {{ postResult?.success ? '✅' : '⚪' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DiagnosticComponent implements OnInit {
  private diagnosticService = inject(DiagnosticService);

  pingResult: any = null;
  tokenResult: any = null;
  postResult: any = null;

  ngOnInit() {
    // Auto-tests au chargement
    this.testPing();
  }

  testPing() {
    this.diagnosticService.ping().subscribe({
      next: (data: any) => {
        this.pingResult = { success: true, message: data.message, data };
      },
      error: (err: any) => {
        this.pingResult = { success: false, message: `Erreur: ${err.error?.message || err.statusText}`, data: err };
      }
    });
  }

  testCheckToken() {
    this.diagnosticService.checkToken().subscribe({
      next: (data: any) => {
        this.tokenResult = { success: true, message: data.message, data };
      },
      error: (err: any) => {
        this.tokenResult = { success: false, message: `Erreur: ${err.error?.message || err.statusText}`, data: err };
      }
    });
  }

  testPostConnection() {
    this.diagnosticService.testConnection({ test: 'data', timestamp: new Date() }).subscribe({
      next: (data: any) => {
        this.postResult = { success: true, message: data.message, data };
      },
      error: (err: any) => {
        this.postResult = { success: false, message: `Erreur: ${err.error?.message || err.statusText}`, data: err };
      }
    });
  }
}
