import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Add this
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DepotComponent } from './components/depot/depot.component';
import { RetraitComponent } from './components/retrait/retrait.component';
import { VirementComponent } from './components/virement/virement.component';
import { CompteComponent } from './components/comptes/compte.component'; // Add if file created
import { TransactionsComponent } from './components/transactions/transactions.component'; // Add if created
import { ProfileComponent } from './components/profile/profile.component'; // Add if created
// Remove or comment out admin components if not implementing:
// import { AdminClientsComponent } from './components/admin-clients/admin-clients.component';
// etc.

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DepotComponent,
    RetraitComponent,
    VirementComponent,
    CompteComponent,
    TransactionsComponent,
    ProfileComponent,
    CommonModule,  // <-- AJOUTER
    FormsModule    // <-- AJOUTER
    // AdminClientsComponent, etc. (comment out)
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule, // Add this
    RouterModule // Add to recognize router-outlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }