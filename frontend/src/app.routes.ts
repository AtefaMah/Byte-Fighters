import { Routes } from '@angular/router';

/**
 * Definición de rutas de la aplicación.
 * Cada ruta carga su componente de forma lazy (loadComponent) para mejor rendimiento.
 *
 * URL base: http://localhost:4200
 *   /            → Página de inicio
 *   /festivales  → Lista de festivales
 *   /festivales/:id → Detalle de un festival
 *   /artistas    → Lista de artistas
 *   /clientes    → Lista de clientes
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'festivales',
    loadComponent: () =>
      import('./pages/festivales/festivales-lista.component').then(m => m.FestivalesListaComponent)
  },
  {
    path: 'festivales/:id',
    loadComponent: () =>
      import('./pages/festivales/festival-detalle.component').then(m => m.FestivalDetalleComponent)
  },
  {
    path: 'artistas',
    loadComponent: () =>
      import('./pages/artistas/artistas-lista.component').then(m => m.ArtistasListaComponent)
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./pages/clientes/clientes-lista.component').then(m => m.ClientesListaComponent)
  },
  {
    // Ruta comodín: cualquier URL desconocida redirige al inicio
    path: '**',
    redirectTo: ''
  }
];
