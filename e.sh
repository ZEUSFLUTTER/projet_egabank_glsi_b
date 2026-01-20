#!/bin/bash

set -e

ROOT="ega-bank-frontend"

echo "📁 Création du projet $ROOT"

# Dossiers principaux
mkdir -p $ROOT/src/app/{components,services,guards,interceptors}
mkdir -p $ROOT/src/assets

# Components - Login
mkdir -p $ROOT/src/app/components/login
touch \
  $ROOT/src/app/components/login/login.component.ts \
  $ROOT/src/app/components/login/login.component.html \
  $ROOT/src/app/components/login/login.component.css

# Components - Admin
mkdir -p \
  $ROOT/src/app/components/admin/dashboard \
  $ROOT/src/app/components/admin/client-list \
  $ROOT/src/app/components/admin/compte-list

touch \
  $ROOT/src/app/components/admin/dashboard/admin-dashboard.component.ts \
  $ROOT/src/app/components/admin/dashboard/admin-dashboard.component.html \
  $ROOT/src/app/components/admin/dashboard/admin-dashboard.component.css \
  $ROOT/src/app/components/admin/client-list/client-list.component.ts \
  $ROOT/src/app/components/admin/client-list/client-list.component.html \
  $ROOT/src/app/components/admin/client-list/client-list.component.css \
  $ROOT/src/app/components/admin/compte-list/compte-list.component.ts \
  $ROOT/src/app/components/admin/compte-list/compte-list.component.html \
  $ROOT/src/app/components/admin/compte-list/compte-list.component.css

# Components - Client
mkdir -p \
  $ROOT/src/app/components/client/dashboard \
  $ROOT/src/app/components/client/mes-comptes \
  $ROOT/src/app/components/client/operations \
  $ROOT/src/app/components/client/transactions

touch \
  $ROOT/src/app/components/client/dashboard/client-dashboard.component.ts \
  $ROOT/src/app/components/client/dashboard/client-dashboard.component.html \
  $ROOT/src/app/components/client/dashboard/client-dashboard.component.css \
  $ROOT/src/app/components/client/mes-comptes/mes-comptes.component.ts \
  $ROOT/src/app/components/client/mes-comptes/mes-comptes.component.html \
  $ROOT/src/app/components/client/mes-comptes/mes-comptes.component.css \
  $ROOT/src/app/components/client/operations/operations.component.ts \
  $ROOT/src/app/components/client/operations/operations.component.html \
  $ROOT/src/app/components/client/operations/operations.component.css \
  $ROOT/src/app/components/client/transactions/transactions.component.ts \
  $ROOT/src/app/components/client/transactions/transactions.component.html \
  $ROOT/src/app/components/client/transactions/transactions.component.css

# Components - Navbar
mkdir -p $ROOT/src/app/components/navbar
touch \
  $ROOT/src/app/components/navbar/navbar.component.ts \
  $ROOT/src/app/components/navbar/navbar.component.html \
  $ROOT/src/app/components/navbar/navbar.component.css

# Services
touch \
  $ROOT/src/app/services/auth.service.ts \
  $ROOT/src/app/services/client.service.ts \
  $ROOT/src/app/services/compte.service.ts \
  $ROOT/src/app/services/transaction.service.ts

# Guards
touch $ROOT/src/app/guards/auth.guard.ts

# Interceptors
touch $ROOT/src/app/interceptors/jwt.interceptor.ts

# Fichiers Angular racine app
touch \
  $ROOT/src/app/app-routing.module.ts \
  $ROOT/src/app/app.module.ts \
  $ROOT/src/app/app.component.ts \
  $ROOT/src/app/app.component.html

# Fichiers src
touch \
  $ROOT/src/index.html \
  $ROOT/src/main.ts \
  $ROOT/src/styles.css

# Fichiers racine projet
touch \
  $ROOT/angular.json \
  $ROOT/package.json \
  $ROOT/tsconfig.json

echo "✅ Arborescence Angular générée avec succès."
