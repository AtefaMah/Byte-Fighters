import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FestivalService } from '../../services/festival.service';
import { Festival, Artista, Cliente } from '../../models/models';

/**
 * Componente Detalle de Festival.
 *
 * Muestra la relación 1:M del enunciado:
 *  - Un festival tiene MUCHOS artistas
 *  - Un festival tiene MUCHOS clientes
 *
 * Lee el :id de la URL con ActivatedRoute.
 */
@Component({
  selector: 'app-festival-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <a routerLink="/festivales" class="back-link">← Volver a festivales</a>

      @if (cargando()) {
        <p class="loading">Cargando...</p>
      } @else if (festival()) {
        <div class="festival-hero">
          <h1>🎡 {{ festival()!.nombre }}</h1>
          <div class="meta">
            <span class="badge">{{ festival()!.promotora }}</span>
            <span>📅 {{ festival()!.fechaInicio }} — {{ festival()!.fechaFin }}</span>
            <span>👥 {{ festival()!.cantidadAsistentes | number }} asistentes</span>
          </div>
        </div>

        <div class="tabs">
          <button
            class="tab"
            [class.active]="tabActiva() === 'artistas'"
            (click)="tabActiva.set('artistas')">
            🎸 Artistas ({{ artistas().length }})
          </button>
          <button
            class="tab"
            [class.active]="tabActiva() === 'clientes'"
            (click)="tabActiva.set('clientes')">
            🎟️ Clientes ({{ clientes().length }})
          </button>
        </div>

        <!-- TAB ARTISTAS -->
        @if (tabActiva() === 'artistas') {
          <div class="tab-content">
            @if (artistas().length === 0) {
              <p class="empty">Este festival no tiene artistas registrados.</p>
            }
            <div class="list">
              @for (artista of artistas(); track artista.id) {
                <div class="list-item">
                  <span class="list-icon">🎸</span>
                  <span>{{ artista.nombreArtistico }}</span>
                </div>
              }
            </div>
          </div>
        }

        <!-- TAB CLIENTES -->
        @if (tabActiva() === 'clientes') {
          <div class="tab-content">
            @if (clientes().length === 0) {
              <p class="empty">Este festival no tiene clientes registrados.</p>
            }
            <div class="list">
              @for (cliente of clientes(); track cliente.id) {
                <div class="list-item">
                  <span class="list-icon">🎟️</span>
                  <div>
                    <strong>{{ cliente.nombre }} {{ cliente.apellidos }}</strong>
                    <small>{{ cliente.correo }} · {{ cliente.telefono }}</small>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      } @else {
        <p class="error">Festival no encontrado.</p>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 900px; margin: 0 auto; }
    .back-link { color: #e94560; text-decoration: none; font-weight: 600; }
    .back-link:hover { text-decoration: underline; }

    .festival-hero { background: #1a1a2e; color: white; padding: 2rem; border-radius: 12px; margin: 1.5rem 0; }
    .festival-hero h1 { margin: 0 0 1rem; }
    .meta { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: center; color: #ccc; }
    .badge { background: #e94560; color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; }

    .tabs { display: flex; gap: 0; border-bottom: 2px solid #ddd; margin-bottom: 1.5rem; }
    .tab { padding: 0.8rem 1.5rem; border: none; background: none; cursor: pointer; font-size: 1rem; font-weight: 600; color: #888; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tab.active { color: #e94560; border-bottom-color: #e94560; }
    .tab:hover { color: #e94560; }

    .tab-content { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .list { display: flex; flex-direction: column; gap: 0.8rem; }
    .list-item { display: flex; align-items: center; gap: 1rem; padding: 0.8rem 1rem; border: 1px solid #eee; border-radius: 8px; }
    .list-item small { display: block; color: #888; font-size: 0.8rem; }
    .list-icon { font-size: 1.5rem; }

    .loading, .empty, .error { text-align: center; color: #888; padding: 2rem; }
    .error { color: #e74c3c; }
  `]
})
export class FestivalDetalleComponent implements OnInit {

  festival = signal<Festival | null>(null);
  artistas = signal<Artista[]>([]);
  clientes = signal<Cliente[]>([]);
  cargando = signal<boolean>(true);
  tabActiva = signal<'artistas' | 'clientes'>('artistas');

  constructor(
    private route: ActivatedRoute,
    private festivalService: FestivalService
  ) {}

  ngOnInit(): void {
    // ActivatedRoute nos da los parámetros de la URL (:id)
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.festivalService.getById(id).subscribe({
      next: (f) => {
        this.festival.set(f);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });

    // Cargar artistas del festival (relación 1:M)
    this.festivalService.getArtistas(id).subscribe({
      next: (data) => this.artistas.set(data)
    });

    // Cargar clientes del festival (relación 1:M)
    this.festivalService.getClientes(id).subscribe({
      next: (data) => this.clientes.set(data)
    });
  }
}
