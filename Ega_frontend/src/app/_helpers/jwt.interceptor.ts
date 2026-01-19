import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Récupérer le user stocké en local
  const storedUser = localStorage.getItem('currentUser');

  if (storedUser) {
    const user = JSON.parse(storedUser);

    // 2. Si un token existe, on clone la requête pour l'ajouter au Header
    if (user.token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
      return next(cloned);
    }
  }

  // 3. Sinon, on laisse passer la requête telle quelle (ex: login)
  return next(req);
};
