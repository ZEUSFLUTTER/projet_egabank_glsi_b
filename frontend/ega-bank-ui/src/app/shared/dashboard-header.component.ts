import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  standalone: true,
  selector: 'dashboard-header',
  imports: [CommonModule, FormsModule],
  template: `
    <header style="height:64px;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;padding:0 16px;background:white;position:sticky;top:0;z-index:40;">
      <!-- Spacer to center search -->
      <div style="flex:1;"></div>

      <!-- Centered Search -->
      <div style="max-width:480px;width:100%;position:relative;">
        <div style="position:relative;">
            <input 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="onSearch()"
                placeholder="Search clients or accounts..." 
                style="width:100%;padding:10px 16px 10px 40px;border-radius:24px;border:1px solid #e5e7eb;background:#f9fafb;outline:none;transition:all 0.2s;"
                (focus)="showSearch = true"
            />
            <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9ca3af;">🔍</span>
        </div>

        <!-- Search Results Dropdown -->
        <div *ngIf="showSearch && searchQuery.length > 1" class="search-results">
            <div *ngIf="isSearching" class="p-4 text-center text-gray-400 text-sm">Searching...</div>
            
            <div *ngIf="!isSearching">
                <!-- Clients -->
                <div *ngIf="foundClients.length > 0">
                    <div class="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">Clients</div>
                    <div *ngFor="let client of foundClients" (click)="goToClient(client.id)" class="search-item">
                        <div class="font-medium">{{client.prenom}} {{client.nom}}</div>
                        <div class="text-xs text-gray-500">{{client.courriel}}</div>
                    </div>
                </div>

                <!-- Accounts -->
                 <div *ngIf="foundAccounts.length > 0">
                    <div class="px-3 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">Accounts</div>
                    <div *ngFor="let account of foundAccounts" (click)="goToAccount(account.numeroCompte)" class="search-item">
                        <div class="font-medium">{{account.numeroCompte}}</div>
                        <div class="text-xs text-gray-500">{{account.typeCompte}} • {{account.solde | currency:'XOF':'symbol':'1.0-0'}}</div>
                    </div>
                </div>

                <div *ngIf="foundClients.length === 0 && foundAccounts.length === 0" class="p-4 text-center text-gray-500 text-sm">
                    No results found.
                </div>
            </div>
        </div>
      </div>

      <!-- Right Actions -->
      <div style="flex:1;display:flex;justify-content:flex-end;align-items:center;gap:12px;">
        <!-- Notifications -->
        <div style="position:relative;">
            <button (click)="toggleNotifications()" class="btn-icon">🔔</button>
            <span *ngIf="unreadNotifications" class="notification-badge"></span>
            
            <div *ngIf="showNotifications" class="dropdown-menu" style="width:280px;">
                 <div class="px-4 py-2 border-b font-bold text-sm">Notifications</div>
                 <div class="max-h-[300px] overflow-y-auto">
                    <div class="p-3 border-b hover:bg-gray-50 cursor-pointer text-sm">
                        <div class="font-medium">New login</div>
                        <div class="text-xs text-gray-500">Security alert from system</div>
                    </div>
                    <div class="p-3 border-b hover:bg-gray-50 cursor-pointer text-sm">
                        <div class="font-medium">System update</div>
                        <div class="text-xs text-gray-500">Maintenance scheduled tonight</div>
                    </div>
                 </div>
                 <div class="p-2 text-center text-xs text-primary cursor-pointer">Mark all read</div>
            </div>
        </div>

        <!-- User Profile -->
        <div style="position:relative;">
           <button (click)="toggleProfile()" style="background:transparent;border:0;cursor:pointer;display:flex;align-items:center;gap:8px;">
             <div style="width:36px;height:36px;border-radius:50%;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#4b5563;font-weight:600;border:1px solid #e5e7eb;">
               A
             </div>
           </button>

           <div *ngIf="showProfile" class="dropdown-menu">
               <div class="px-4 py-3 border-b">
                   <div class="font-medium text-sm">Admin User</div>
                   <div class="text-xs text-gray-500">admin@egabank.com</div>
               </div>
               <a class="dropdown-item">⚙️ Settings</a>
               <a class="dropdown-item">👤 Profile</a>
               <div class="divider" style="margin:4px 0;"></div>
               <a (click)="logout()" class="dropdown-item text-danger">🚪 Logout</a>
           </div>
        </div>
      </div>
    </header>
    
    <!-- Click overlay to close dropdowns -->
    <div *ngIf="showSearch || showNotifications || showProfile" (click)="closeAll()" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:30;"></div>
  `,
})
export class DashboardHeader {
  searchQuery = '';
  showSearch = false;
  isSearching = false;
  foundClients: any[] = [];
  foundAccounts: any[] = [];

  showNotifications = false;
  showProfile = false;
  unreadNotifications = true;

  constructor(
    private auth: AuthService,
    private router: Router,
    private clientService: ClientService,
    private accountService: AccountService
  ) { }

  onSearch() {
    if (this.searchQuery.length < 2) {
      this.foundClients = [];
      this.foundAccounts = [];
      return;
    }

    this.isSearching = true;

    // Search Clients
    this.clientService.search(this.searchQuery).subscribe({
      next: (res) => {
        this.foundClients = res.content || [];
        this.isSearching = false;
      },
      error: () => this.isSearching = false
    });

    // Simple account search (filtering by ID/number if possible, or just mock for now as backend search might be separate)
    // Assuming accountService has no search, we might skip or use getByNumber if query looks like number
    if (this.searchQuery.length > 5) {
      this.accountService.getByNumber(this.searchQuery).subscribe({
        next: (acc) => this.foundAccounts = [acc],
        error: () => this.foundAccounts = []
      });
    }
  }

  goToClient(id: number) {
    this.router.navigate(['/clients'], { queryParams: { id } }); // Or details page if exists
    this.closeAll();
  }

  goToAccount(num: string) {
    this.router.navigate(['/transactions'], { queryParams: { accountId: num } });
    this.closeAll();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showProfile = false;
    this.showSearch = false;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.showNotifications = false;
    this.showSearch = false;
  }

  closeAll() {
    this.showSearch = false;
    this.showNotifications = false;
    this.showProfile = false;
  }

  logout() {
    this.auth.logout();
  }
}
