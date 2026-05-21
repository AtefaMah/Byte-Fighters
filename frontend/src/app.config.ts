import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación Angular 21.
 *
 * En Angular 21 ya NO se usa AppModule.
 * En su lugar se usa esta configuración con "providers" directamente.
 *
 * provideRouter(routes)  → activa el sistema de rutas
 * provideHttpClient()    → activa HttpClient para llamadas HTTP
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
