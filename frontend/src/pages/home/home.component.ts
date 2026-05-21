import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Página de inicio — componente StandAlone.
 *
 * Muestra una bienvenida y accesos rápidos a las secciones principales.
 * Este es el componente más sencillo de la aplicación.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <div class="hero">
        <h1>🎪 Bienvenido a <span class="accent">TicketEA</span></h1>
        <p class="subtitle">Gestión de festivales, artistas y asistentes</p>
      </div>

      <div class="cards">
        <a routerLink="/festivales" class="card">
          <span class="card-icon">🎡</span>
          <h2>Festivales</h2>
          <p>Consulta y gestiona los festivales disponibles</p>
        </a>
        <a routerLink="/artistas" class="card">
          <span class="card-icon">🎸</span>
          <h2>Artistas</h2>
          <p>Explora los artistas que actúan en cada festival</p>
        </a>
        <a routerLink="/clientes" class="card">
          <span class="card-icon">🎟️</span>
          <h2>Clientes</h2>
          <p>Registro de asistentes y sus entradas</p>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .home { max-width: 900px; margin: 0 auto; }

    .hero {
      text-align: center;
      padding: 3rem 0 2rem;
    }

    .hero h1 {
      font-size: 2.5rem;
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .accent { color: #e94560; }

    .subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-color: #e94560;
    }

    .card-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

    .card h2 {
      color: #1a1a2e;
      margin-bottom: 0.5rem;
    }

    .card p { color: #888; font-size: 0.9rem; }
  `]
})
export class HomeComponent {}
