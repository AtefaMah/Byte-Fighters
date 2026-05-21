import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FestivalService } from '../../app/services/festival.service';
import { Festival } from '../../app/models/models';

/**
 * Componente Lista de Festivales.
 *
 * Demuestra todos los requisitos del enunciado:
 *  ✅ Componente StandAlone (standalone: true)
 *  ✅ Signals (signal, computed)
 *  ✅ Formularios reactivos (ReactiveFormsModule, FormBuilder)
 *  ✅ Llamadas a API REST (FestivalService)
 *  ✅ Observables (subscribe en ngOnInit)
 */
@Component({
  selector: 'app-festivales-lista',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🎡 Festivales</h1>
        <button class="btn btn-primary" (click)="toggleFormulario()">
          {{ mostrarFormulario() ? '✕ Cancelar' : '+ Nuevo Festival' }}
        </button>
      </div>

      <!-- BUSCADOR -->
      <div class="search-bar">
        <input
          type="text"
          placeholder="🔍 Buscar festival por nombre..."
          (input)="onBuscar($event)"
          class="input-search"
        />
        <span class="result-count">{{ festivalesFiltrados().length }} resultado(s)</span>
      </div>

      <!-- FORMULARIO CREAR / EDITAR (reactivo) -->
      @if (mostrarFormulario()) {
        <div class="card form-card">
          <h2>{{ festivalEditando() ? 'Editar Festival' : 'Nuevo Festival' }}</h2>
          <form [formGroup]="festivalForm" (ngSubmit)="guardar()">

            <div class="form-row">
              <div class="form-group">
                <label>Nombre del festival *</label>
                <input formControlName="nombre" type="text" placeholder="Ej: Primavera Sound" />
                @if (festivalForm.get('nombre')?.invalid && festivalForm.get('nombre')?.touched) {
                  <span class="error">El nombre es obligatorio</span>
                }
              </div>
              <div class="form-group">
                <label>Promotora *</label>
                <input formControlName="promotora" type="text" placeholder="Ej: Live Nation" />
                @if (festivalForm.get('promotora')?.invalid && festivalForm.get('promotora')?.touched) {
                  <span class="error">La promotora es obligatoria</span>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de inicio *</label>
                <input formControlName="fechaInicio" type="date" />
              </div>
              <div class="form-group">
                <label>Fecha de fin *</label>
                <input formControlName="fechaFin" type="date" />
              </div>
              <div class="form-group">
                <label>Aforo (asistentes)</label>
                <input formControlName="cantidadAsistentes" type="number" min="0" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="festivalForm.invalid">
                {{ festivalEditando() ? 'Guardar cambios' : 'Crear festival' }}
              </button>
              <button type="button" class="btn btn-secondary" (click)="toggleFormulario()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      <!-- MENSAJE FEEDBACK -->
      @if (mensaje()) {
        <div class="toast" [class.error]="esError()">
          {{ mensaje() }}
        </div>
      }

      <!-- LISTA DE FESTIVALES -->
      @if (cargando()) {
        <p class="loading">Cargando festivales...</p>
      } @else {
        <div class="grid">
          @for (festival of festivalesFiltrados(); track festival.id) {
            <div class="card festival-card">
              <div class="card-header">
                <h3>{{ festival.nombre }}</h3>
                <span class="badge">{{ festival.promotora }}</span>
              </div>
              <div class="card-body">
                <p>📅 {{ festival.fechaInicio }} → {{ festival.fechaFin }}</p>
                <p>👥 {{ festival.cantidadAsistentes | number }} asistentes</p>
              </div>
              <div class="card-footer">
                <a [routerLink]="['/festivales', festival.id]" class="btn btn-sm">Ver detalle</a>
                <button class="btn btn-sm btn-warning" (click)="editar(festival)">Editar</button>
                <button class="btn btn-sm btn-danger" (click)="confirmarEliminar(festival)">Borrar</button>
              </div>
            </div>
          } @empty {
            <p class="empty">No se encontraron festivales.</p>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1100px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; color: #1a1a2e; }

    .search-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .input-search {
      flex: 1; padding: 0.6rem 1rem; border: 2px solid #ddd;
      border-radius: 8px; font-size: 1rem; outline: none;
      transition: border-color 0.2s;
    }
    .input-search:focus { border-color: #e94560; }
    .result-count { color: #888; font-size: 0.9rem; white-space: nowrap; }

    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
    .form-card h2 { margin-top: 0; color: #1a1a2e; }

    .form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; }
    .form-group label { font-weight: 600; font-size: 0.9rem; color: #444; }
    .form-group input {
      padding: 0.5rem 0.8rem; border: 2px solid #ddd; border-radius: 6px;
      font-size: 1rem; transition: border-color 0.2s;
    }
    .form-group input:focus { outline: none; border-color: #e94560; }
    .error { color: #e94560; font-size: 0.8rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }

    .toast {
      background: #2ecc71; color: white; padding: 0.8rem 1.2rem;
      border-radius: 8px; margin-bottom: 1rem; font-weight: 500;
    }
    .toast.error { background: #e74c3c; }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

    .festival-card { padding: 0; overflow: hidden; }
    .card-header { background: #1a1a2e; color: white; padding: 1rem 1.2rem; display: flex; justify-content: space-between; align-items: center; }
    .card-header h3 { margin: 0; font-size: 1.1rem; }
    .badge { background: #e94560; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; }
    .card-body { padding: 1rem 1.2rem; }
    .card-body p { margin: 0.3rem 0; color: #555; font-size: 0.9rem; }
    .card-footer { padding: 0.8rem 1.2rem; background: #f9f9f9; display: flex; gap: 0.5rem; border-top: 1px solid #eee; }

    .btn { padding: 0.5rem 1rem; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.85; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: #e94560; color: white; }
    .btn-secondary { background: #eee; color: #333; }
    .btn-warning { background: #f39c12; color: white; }
    .btn-danger { background: #e74c3c; color: white; }
    .btn-sm { padding: 0.3rem 0.7rem; font-size: 0.8rem; }
    a.btn { text-decoration: none; }

    .loading, .empty { text-align: center; color: #888; padding: 2rem; }
  `]
})
export class FestivalesListaComponent implements OnInit {

  // ── SIGNALS ──────────────────────────────────────────────
  /** Lista completa de festivales (viene del backend) */
  festivales = signal<Festival[]>([]);

  /** Texto de búsqueda introducido por el usuario */
  textoBusqueda = signal<string>('');

  /** Estado de carga */
  cargando = signal<boolean>(true);

  /** Si se muestra el formulario o no */
  mostrarFormulario = signal<boolean>(false);

  /** Festival que se está editando (null = crear nuevo) */
  festivalEditando = signal<Festival | null>(null);

  /** Mensaje de feedback al usuario */
  mensaje = signal<string>('');
  esError = signal<boolean>(false);

  /**
   * Lista filtrada — se recalcula automáticamente cuando cambia
   * `festivales` o `textoBusqueda`. Esto es la potencia de los computed signals.
   */
  festivalesFiltrados = computed(() => {
    const texto = this.textoBusqueda().toLowerCase();
    if (!texto) return this.festivales();
    return this.festivales().filter(f =>
      f.nombre.toLowerCase().includes(texto) ||
      f.promotora.toLowerCase().includes(texto)
    );
  });

  // ── FORMULARIO REACTIVO ───────────────────────────────────
  festivalForm!: FormGroup;

  constructor(
    private festivalService: FestivalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarFestivales();
  }

  /** Inicializa el formulario reactivo con sus validaciones */
  inicializarFormulario(): void {
    this.festivalForm = this.fb.group({
      nombre:             ['', [Validators.required, Validators.minLength(2)]],
      promotora:          ['', Validators.required],
      fechaInicio:        ['', Validators.required],
      fechaFin:           ['', Validators.required],
      cantidadAsistentes: [0, Validators.min(0)]
    });
  }

  /** Carga los festivales desde el backend usando el Observable del servicio */
  cargarFestivales(): void {
    this.cargando.set(true);
    // subscribe() se llama cuando llegan los datos del Observable
    this.festivalService.getAll().subscribe({
      next: (data) => {
        this.festivales.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando festivales:', err);
        this.mostrarMensaje('Error al cargar festivales. ¿Está el backend arrancado?', true);
        this.cargando.set(false);
      }
    });
  }

  onBuscar(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.textoBusqueda.set(valor);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.festivalEditando.set(null);
      this.festivalForm.reset({ cantidadAsistentes: 0 });
    }
  }

  /** Rellenar el formulario para editar un festival existente */
  editar(festival: Festival): void {
    this.festivalEditando.set(festival);
    this.mostrarFormulario.set(true);
    this.festivalForm.patchValue(festival);
  }

  /** Guardar — crea o actualiza según si estamos editando */
  guardar(): void {
    if (this.festivalForm.invalid) return;

    const datos: Festival = this.festivalForm.value;
    const editando = this.festivalEditando();

    if (editando?.id) {
      // EDITAR
      this.festivalService.update(editando.id, datos).subscribe({
        next: (actualizado) => {
          this.festivales.update(lista =>
            lista.map(f => f.id === actualizado.id ? actualizado : f)
          );
          this.mostrarMensaje('Festival actualizado correctamente ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMensaje('Error al actualizar el festival', true)
      });
    } else {
      // CREAR
      this.festivalService.create(datos).subscribe({
        next: (creado) => {
          this.festivales.update(lista => [...lista, creado]);
          this.mostrarMensaje('Festival creado correctamente ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMensaje('Error al crear el festival', true)
      });
    }
  }

  /** Pide confirmación antes de borrar */
  confirmarEliminar(festival: Festival): void {
    if (!confirm(`¿Seguro que quieres eliminar "${festival.nombre}"?`)) return;
    this.festivalService.delete(festival.id!).subscribe({
      next: () => {
        this.festivales.update(lista => lista.filter(f => f.id !== festival.id));
        this.mostrarMensaje('Festival eliminado correctamente');
      },
      error: () => this.mostrarMensaje('Error al eliminar el festival', true)
    });
  }

  /** Muestra un mensaje de toast durante 3 segundos */
  mostrarMensaje(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error);
    setTimeout(() => this.mensaje.set(''), 3000);
  }
}
