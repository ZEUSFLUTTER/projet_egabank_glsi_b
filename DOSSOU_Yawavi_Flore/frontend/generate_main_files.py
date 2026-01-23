#!/usr/bin/env python3
import os
import json

BASE_DIR = "/home/claude/ega-bank-app"

# Tous les fichiers à créer
files_to_create = {
    # Main files
    f"{BASE_DIR}/src/main.ts": """import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS, provideHttpClient as provideHttpClientLegacy, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/core/interceptors/jwt.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClientLegacy(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
""",
    
    f"{BASE_DIR}/src/index.html": """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>EGA Bank</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body class="bg-gray-100">
  <app-root></app-root>
</body>
</html>
""",

    f"{BASE_DIR}/src/app/app.component.ts": """import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {}
""",

    f"{BASE_DIR}/src/app/app.routes.ts": """import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { RoleType } from './shared/models/user.model';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.ADMIN] }
      },
      {
        path: 'clients',
        loadComponent: () => import('./features/clients/clients.component').then(m => m.ClientsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      },
      {
        path: 'accounts',
        loadComponent: () => import('./features/accounts/accounts.component').then(m => m.AccountsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      },
      {
        path: 'transactions',
        loadComponent: () => import('./features/transactions/transactions.component').then(m => m.TransactionsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.CAISSIERE] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: [RoleType.GESTIONNAIRE] }
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
""",

    f"{BASE_DIR}/.gitignore": """# See http://help.github.com/ignore-files/ for more about ignoring files.

# Compiled output
/dist
/tmp
/out-tsc
/bazel-out

# Node
/node_modules
npm-debug.log
yarn-error.log

# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
.DS_Store
Thumbs.db
""",

    f"{BASE_DIR}/README.md": """# EGA Bank Application

Application de gestion bancaire développée avec Angular 17 et TailwindCSS.

## Fonctionnalités

### Pour ADMIN
- Créer des gestionnaires et caissières
- Gérer les utilisateurs (activer/désactiver)

### Pour GESTIONNAIRE
- Gérer les clients (créer, modifier, supprimer)
- Gérer les comptes bancaires
- Générer des relevés PDF
- Consulter l'historique des transactions

### Pour CAISSIERE
- Effectuer des dépôts
- Effectuer des retraits
- Effectuer des transferts

## Installation

1. Installer les dépendances:
```bash
npm install
```

2. Configurer l'URL de l'API dans les services (actuellement: http://localhost:8080)

3. Lancer l'application:
```bash
npm start
```

L'application sera accessible sur http://localhost:4200

## Connexion par défaut

Utilisez les identifiants de l'administrateur définis dans votre backend:
- Username: administrateur
- Password: 96118586

## Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         # Guards d'authentification et de rôles
│   │   ├── interceptors/   # Intercepteur JWT
│   │   └── services/       # Services API
│   ├── features/
│   │   ├── auth/          # Connexion
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── users/         # Gestion utilisateurs
│   │   ├── clients/       # Gestion clients
│   │   ├── accounts/      # Gestion comptes
│   │   ├── transactions/  # Transactions
│   │   └── reports/       # Rapports et relevés
│   └── shared/
│       ├── components/    # Composants réutilisables
│       └── models/        # Modèles TypeScript
```

## Technologies utilisées

- Angular 17 (Standalone Components)
- TailwindCSS
- FontAwesome
- RxJS
- TypeScript

## Build pour production

```bash
npm run build
```

Les fichiers de build seront dans le répertoire `dist/`.
"""
}

# Créer tous les fichiers
for filepath, content in files_to_create.items():
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Créé: {filepath}")

print("\n✓ Fichiers principaux créés avec succès!")
