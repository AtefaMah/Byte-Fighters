import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArtistaService } from '../../services/artista-cliente.service';
import { FestivalService } from '../../services/festival.service';
import { Artista, Festival } from '../../models/models';

/**
 * Componente Lista de Artistas.
 * Permite crear, editar y eliminar artistas.
 * El formulario incluye selección de festival (relación 1:M).
 */
@Component({
  selector: 'app-artistas-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🎸 Artistas</h1>
        <button class="btn btn-primary" (click)="toggleFormulario()">
          {{ mostrarFormulario() ? '✕ Cancelar' : '+ Nuevo Artista' }}
        </button>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="🔍 Buscar artista..." (input)="onBuscar($event)" class="input-search" />
      </div>

      @if (mostrarFormulario()) {
        <div class="card form-card">
          <h2>{{ editando() ? 'Editar Artista' : 'Nuevo Artista' }}</h2>
          <form [formGroup]="artistaForm" (ngSubmit)="guardar()">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre artístico *</label>
                <input formControlName="nombreArtistico" type="text" placeholder="Ej: The Cure" />
                @if (artistaForm.get('nombreArtistico')?.invalid && artistaForm.get('nombreArtistico')?.touched) {
                  <span class="error">El nombre artístico es obligatorio</span>
                }
              </div>
              <div class="form-group">
                <label>Festival *</label>
                <select formControlName="festivalId">
                  <option value="">-- Selecciona festival --</option>
                  @for (f of festivales(); track f.id) {
                    <option [value]="f.id">{{ f.nombre }}</option>
                  }
                </select>
                @if (artistaForm.get('festivalId')?.invalid && artistaForm.get('festivalId')?.touched) {
                  <span class="error">Debes seleccionar un festival</span>
                }
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="artistaForm.invalid">
                {{ editando() ? 'Guardar' : 'Crear artista' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="toggleFormulario()">Cancelar</button>
            </div>
          </form>
        </div>
      }

      @if (mensaje()) {
        <div class="toast" [class.error]="esError()">{{ mensaje() }}</div>
      }

      @if (cargando()) {
        <p class="loading">Cargando artistas...</p>
      } @else {
        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre artístico</th>
                <th>Festival</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (artista of artistasFiltrados(); track artista.id) {
                <tr>
                  <td>{{ artista.id }}</td>
                  <td><strong>{{ artista.nombreArtistico }}</strong></td>
                  <td><span class="badge">{{ artista.festival?.nombre }}</span></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-warning" (click)="editar(artista)">Editar</button>
                    <button class="btn btn-sm btn-danger" (click)="eliminar(artista)">Borrar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="4" class="empty">No se encontraron artistas.</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1000px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; color: #1a1a2e; }
    .search-bar { margin-bottom: 1.5rem; }
    .input-search { width: 100%; padding: 0.6rem 1rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
    .input-search:focus { outline: none; border-color: #e94560; }
    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
    .table-card { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a2e; color: white; padding: 0.8rem 1rem; text-align: left; font-size: 0.9rem; }
    td { padding: 0.8rem 1rem; border-bottom: 1px solid #f0f0f0; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .actions { display: flex; gap: 0.4rem; }
    .badge { background: #1a1a2e; color: white; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .form-group label { font-weight: 600; font-size: 0.9rem; color: #444; }
    .form-group input, .form-group select { padding: 0.5rem 0.8rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #e94560; }
    .error { color: #e94560; font-size: 0.8rem; }
    .form-actions { display: flex; gap: 1rem; }
    .toast { background: #2ecc71; color: white; padding: 0.8rem 1.2rem; border-radius: 8px; margin-bottom: 1rem; }
    .toast.error { background: #e74c3c; }
    .btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.85; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #eee; color: #333; }
    .btn-warning { background: #f39c12; color: white; }
    .btn-danger { background: #e74c3c; color: white; }
    .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; }
    .loading, .empty { text-align: center; color: #888; padding: 2rem; }
    .form-card h2 { margin-top: 0; color: #1a1a2e; }
  `]
})
export class ArtistasListaComponent implements OnInit {

  artistas = signal<Artista[]>([]);
  festivales = signal<Festival[]>([]);
  textoBusqueda = signal<string>('');
  cargando = signal<boolean>(true);
  mostrarFormulario = signal<boolean>(false);
  editando = signal<Artista | null>(null);
  mensaje = signal<string>('');
  esError = signal<boolean>(false);

  artistasFiltrados = computed(() => {
    const texto = this.textoBusqueda().toLowerCase();
    if (!texto) return this.artistas();
    return this.artistas().filter(a =>
      a.nombreArtistico.toLowerCase().includes(texto) ||
      a.festival?.nombre.toLowerCase().includes(texto)
    );
  });

  artistaForm!: FormGroup;

  constructor(
    private artistaService: ArtistaService,
    private festivalService: FestivalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.artistaForm = this.fb.group({
      nombreArtistico: ['', Validators.required],
      festivalId: ['', Validators.required]
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.artistaService.getAll().subscribe({
      next: (data) => { this.artistas.set(data); this.cargando.set(false); },
      error: () => { this.mostrarMsg('Error cargando artistas', true); this.cargando.set(false); }
    });
    this.festivalService.getAll().subscribe({
      next: (data) => this.festivales.set(data)
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.editando.set(null);
      this.artistaForm.reset();
    }
  }

  editar(artista: Artista): void {
    this.editando.set(artista);
    this.mostrarFormulario.set(true);
    this.artistaForm.patchValue({
      nombreArtistico: artista.nombreArtistico,
      festivalId: artista.festival?.id
    });
  }

  guardar(): void {
    if (this.artistaForm.invalid) return;
    const { nombreArtistico, festivalId } = this.artistaForm.value;
    const artista: Artista = { nombreArtistico };
    const ed = this.editando();

    if (ed?.id) {
      this.artistaService.update(ed.id, artista, festivalId).subscribe({
        next: (actualizado) => {
          this.artistas.update(lista => lista.map(a => a.id === actualizado.id ? actualizado : a));
          this.mostrarMsg('Artista actualizado ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMsg('Error al actualizar', true)
      });
    } else {
      this.artistaService.create(artista, festivalId).subscribe({
        next: (creado) => {
          this.artistas.update(lista => [...lista, creado]);
          this.mostrarMsg('Artista creado ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMsg('Error al crear', true)
      });
    }
  }

  eliminar(artista: Artista): void {
    if (!confirm(`¿Eliminar a "${artista.nombreArtistico}"?`)) return;
    this.artistaService.delete(artista.id!).subscribe({
      next: () => {
        this.artistas.update(lista => lista.filter(a => a.id !== artista.id));
        this.mostrarMsg('Artista eliminado');
      },
      error: () => this.mostrarMsg('Error al eliminar', true)
    });
  }

  onBuscar(event: Event): void {
    this.textoBusqueda.set((event.target as HTMLInputElement).value);
  }

  mostrarMsg(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error);
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}
