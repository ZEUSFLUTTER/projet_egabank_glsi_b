import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from './account.service';
import { AuthService } from './auth.service';

export const dashboardResolver: ResolveFn<any> = (route, state) => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);
  const user = authService.currentUserValue;

  if (!user || !user.id) {
    return of(null);
  }

  return forkJoin({
    comptes: accountService.getComptesByClient(user.id),
    clientInfos: accountService.getClientInfo(user.id)
  }).pipe(
    catchError(err => {
      console.error("Erreur dans le resolver (Backend HS ?)", err);
      return of({ comptes: [], clientInfos: null });
    })
  );
};
