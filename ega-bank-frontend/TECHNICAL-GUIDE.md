# Guide Technique - EGA Bank Frontend

## 🏗️ Architecture Technique

### Structure du Projet
```
src/
├── app/
│   ├── components/          # Composants UI
│   │   ├── login/          # Page de connexion
│   │   ├── dashboard/      # Dashboard client
│   │   ├── admin/          # Interface admin
│   │   ├── mobile-money/   # Composant Mobile Money
│   │   └── toast/          # Notifications
│   ├── services/           # Services métier
│   │   ├── auth.service.ts
│   │   ├── client.service.ts
│   │   ├── mobile-money.service.ts
│   │   └── toast.service.ts
│   ├── guards/             # Protection des routes
│   │   └── auth.guard.ts
│   ├── interceptors/       # Intercepteurs HTTP
│   │   └── jwt.interceptor.ts
│   └── environments/       # Configuration
├── styles.css              # Styles globaux Tailwind
└── index.html
```

## 🔧 Technologies Utilisées

### Frontend Stack
- **Angular 17+** : Framework principal avec Standalone Components
- **Tailwind CSS 3.4** : Framework CSS utilitaire
- **TypeScript** : Langage de développement
- **RxJS** : Programmation réactive
- **Angular Router** : Navigation et routing
- **Angular HTTP Client** : Communication API

### Fonctionnalités Angular
- **Standalone Components** : Architecture moderne sans modules
- **Reactive Forms** : Gestion des formulaires
- **HTTP Interceptors** : Injection automatique JWT
- **Route Guards** : Protection des routes
- **Services** : Logique métier centralisée
- **Observables** : Gestion d'état réactive

## 🔐 Sécurité

### Authentification JWT
```typescript
// Stockage sécurisé du token
localStorage.setItem('ega_bank_token', token);

// Injection automatique dans les headers
Authorization: Bearer <token>
```

### Protection des Routes
```typescript
// Guards par rôle
authGuard: Authentification requise
adminGuard: Accès admin uniquement
clientGuard: Accès client uniquement
```

### Gestion SSR
```typescript
// Vérification plateforme pour localStorage
if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem(key, value);
}
```

## 📡 Communication API

### Endpoints Backend
```typescript
// Authentification
POST /api/auth/login

// Client
GET /api/clients/me/solde
POST /api/clients/virement

// Admin
GET /api/admin/clients
POST /api/admin/clients
```

### Gestion des Erreurs
```typescript
// Intercepteur d'erreurs global
catchError((error: HttpErrorResponse) => {
  this.toastService.error('Erreur', error.message);
  return throwError(error);
})
```

## 🎨 Design System

### Classes Tailwind Personnalisées
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500;
}

.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

### Palette de Couleurs
```javascript
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
}
```

## 🔄 Gestion d'État

### Services Réactifs
```typescript
// AuthService - État utilisateur
private currentUserSubject = new BehaviorSubject<User | null>(null);
public currentUser$ = this.currentUserSubject.asObservable();

// ToastService - Notifications
private toastsSubject = new BehaviorSubject<Toast[]>([]);
public toasts$ = this.toastsSubject.asObservable();
```

### Patterns Utilisés
- **Observer Pattern** : Observables RxJS
- **Singleton Pattern** : Services injectés
- **Guard Pattern** : Protection des routes
- **Interceptor Pattern** : Middleware HTTP

## 📱 Mobile Money Simulation

### Fonctionnement
```typescript
// Simulation avec délai de 2 secondes
processTransaction(request: MobileMoneyRequest): Observable<MobileMoneyResponse> {
  const response = {
    success: true,
    message: `${request.type} de ${request.amount} FCFA via ${request.provider} réussi`,
    transactionId: this.generateTransactionId()
  };
  
  return of(response).pipe(delay(2000));
}
```

### Providers Supportés
- **T-Money** : Service mobile Togocom
- **Flooz** : Service mobile Moov

## 🚀 Déploiement

### Build de Production
```bash
ng build --configuration=production
```

### Variables d'Environnement
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.egabank.tg/api',
  features: {
    mobileMoneySimulation: false,
    realTimeNotifications: true
  }
};
```

## 🧪 Tests

### Tests Unitaires
```bash
ng test
```

### Tests E2E
```bash
ng e2e
```

## 📊 Performance

### Optimisations
- **Lazy Loading** : Chargement différé des modules
- **OnPush Strategy** : Détection de changement optimisée
- **Tree Shaking** : Élimination du code mort
- **Bundle Splitting** : Division des bundles

### Métriques
- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Bundle Size** : < 500KB (gzipped)

## 🔍 Debugging

### Outils de Développement
```bash
# Serveur de développement
ng serve --open

# Mode debug
ng serve --source-map

# Analyse des bundles
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

### Logs
```typescript
// Service de logging
console.log('[AUTH]', 'User logged in:', user);
console.error('[API]', 'Request failed:', error);
```

## 📚 Ressources

### Documentation
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [RxJS Guide](https://rxjs.dev)

### Outils
- [Angular DevTools](https://angular.dev/tools/devtools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

---
**Développé avec ❤️ pour EGA Bank Togo**