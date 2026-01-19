import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { jwtInterceptor } from './_helpers/jwt.interceptor';
import { authInterceptor } from './_helpers/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    //  Activer HTTP Client avec notre Interceptor JWT
    provideHttpClient(withInterceptors([jwtInterceptor])),
     provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
