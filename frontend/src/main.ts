import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Punto de entrada de la aplicación Angular.
 * Arranca la app usando el componente raíz AppComponent
 * con la configuración definida en app.config.ts
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
