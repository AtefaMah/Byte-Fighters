import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Componente raíz de la aplicación.
 *
 * standalone: true → componente StandAlone (no necesita NgModule)
 * imports → importa directamente lo que necesita (RouterOutlet, RouterLink)
 *
 * Este componente actúa como "shell" de la aplicación:
 * - Muestra la barra de navegación
 * - El <router-outlet> es el lugar donde Angular renderiza el componente
 *   correspondiente a la ruta activa
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="navbar-brand">
        <span class="logo">🎪</span>
        <span class="brand-name">TicketEA</span>
      </div>
      <nav class="navbar-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          Inicio
        </a>
        <a routerLink="/festivales" routerLinkActive="active">Festivales</a>
        <a routerLink="/artistas" routerLinkActive="active">Artistas</a>
        <a routerLink="/clientes" routerLinkActive="active">Clientes</a>
      </nav>
    </header>

    <main class="main-content">
      <router-outlet />
    </main>

    <footer class="footer">
      <p>TicketEA — Proyecto Final FP Dual NTT Data 2025</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1a1a2e;
      padding: 0 2rem;
      height: 64px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo { font-size: 1.5rem; }

    .brand-name {
      color: #e94560;
      font-size: 1.4rem;
      font-weight: 800;
      letter-spacing: 1px;
    }

    .navbar-nav {
      display: flex;
      gap: 1.5rem;
    }

    .navbar-nav a {
      color: #a0a0b0;
      text-decoration: none;
      font-weight: 500;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .navbar-nav a:hover,
    .navbar-nav a.active {
      color: #fff;
      background: #e94560;
    }

    .main-content {
      flex: 1;
      background: #f5f5f7;
      padding: 2rem;
    }

    .footer {
      background: #1a1a2e;
      color: #a0a0b0;
      text-align: center;
      padding: 1rem;
      font-size: 0.85rem;
    }
  `]
})
export class AppComponent {}
