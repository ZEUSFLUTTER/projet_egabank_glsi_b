import { bootstrapApplication } from '@angular/platform-browser'; // If standalone app
// Or keep as is, but fix:
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err: any) => console.error(err));