import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/artista-cliente.service';
import { FestivalService } from '../../services/festival.service';
import { Cliente, Festival } from '../../models/models';

/**
 * Componente Lista de Clientes.
 * Formulario con validaciones completas (email, teléfono, campos obligatorios).
 */
@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>🎟️ Clientes</h1>
        <button class="btn btn-primary" (click)="toggleFormulario()">
          {{ mostrarFormulario() ? '✕ Cancelar' : '+ Nuevo Cliente' }}
        </button>
      </div>

      <div class="search-bar">
        <input type="text" placeholder="🔍 Buscar cliente por nombre..." (input)="onBuscar($event)" class="input-search" />
        <span class="result-count">{{ clientesFiltrados().length }} clientes</span>
      </div>

      @if (mostrarFormulario()) {
        <div class="card form-card">
          <h2>{{ editando() ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
          <form [formGroup]="clienteForm" (ngSubmit)="guardar()">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input formControlName="nombre" type="text" placeholder="Ej: Ana" />
                @if (clienteForm.get('nombre')?.invalid && clienteForm.get('nombre')?.touched) {
                  <span class="error">El nombre es obligatorio</span>
                }
              </div>
              <div class="form-group">
                <label>Apellidos *</label>
                <input formControlName="apellidos" type="text" placeholder="Ej: García López" />
                @if (clienteForm.get('apellidos')?.invalid && clienteForm.get('apellidos')?.touched) {
                  <span class="error">Los apellidos son obligatorios</span>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Correo electrónico *</label>
                <input formControlName="correo" type="email" placeholder="ana@email.com" />
                @if (clienteForm.get('correo')?.hasError('required') && clienteForm.get('correo')?.touched) {
                  <span class="error">El correo es obligatorio</span>
                }
                @if (clienteForm.get('correo')?.hasError('email') && clienteForm.get('correo')?.touched) {
                  <span class="error">El formato del correo no es válido</span>
                }
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input formControlName="telefono" type="tel" placeholder="612345678" />
                @if (clienteForm.get('telefono')?.hasError('pattern') && clienteForm.get('telefono')?.touched) {
                  <span class="error">El teléfono debe tener 9 dígitos</span>
                }
              </div>
            </div>

            <div class="form-group">
              <label>Festival *</label>
              <select formControlName="festivalId">
                <option value="">-- Selecciona festival --</option>
                @for (f of festivales(); track f.id) {
                  <option [value]="f.id">{{ f.nombre }}</option>
                }
              </select>
              @if (clienteForm.get('festivalId')?.invalid && clienteForm.get('festivalId')?.touched) {
                <span class="error">Debes seleccionar un festival</span>
              }
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="clienteForm.invalid">
                {{ editando() ? 'Guardar cambios' : 'Registrar cliente' }}
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
        <p class="loading">Cargando clientes...</p>
      } @else {
        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Festival</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (cliente of clientesFiltrados(); track cliente.id) {
                <tr>
                  <td>{{ cliente.id }}</td>
                  <td><strong>{{ cliente.nombre }} {{ cliente.apellidos }}</strong></td>
                  <td>{{ cliente.correo }}</td>
                  <td>{{ cliente.telefono }}</td>
                  <td><span class="badge">{{ cliente.festival?.nombre }}</span></td>
                  <td class="actions">
                    <button class="btn btn-sm btn-warning" (click)="editar(cliente)">Editar</button>
                    <button class="btn btn-sm btn-danger" (click)="eliminar(cliente)">Borrar</button>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="6" class="empty">No se encontraron clientes.</td></tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .page-header h1 { margin: 0; color: #1a1a2e; }
    .search-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .input-search { flex: 1; padding: 0.6rem 1rem; border: 2px solid #ddd; border-radius: 8px; font-size: 1rem; }
    .input-search:focus { outline: none; border-color: #e94560; }
    .result-count { color: #888; font-size: 0.9rem; white-space: nowrap; }
    .card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 1.5rem; }
    .form-card h2 { margin-top: 0; color: #1a1a2e; }
    .table-card { padding: 0; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a1a2e; color: white; padding: 0.8rem 1rem; text-align: left; font-size: 0.85rem; }
    td { padding: 0.7rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #fafafa; }
    .actions { display: flex; gap: 0.4rem; }
    .badge { background: #1a1a2e; color: white; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.75rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 0.8rem; }
    .form-group label { font-weight: 600; font-size: 0.9rem; color: #444; }
    .form-group input, .form-group select { padding: 0.5rem 0.8rem; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #e94560; }
    .error { color: #e94560; font-size: 0.8rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
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
  `]
})
export class ClientesListaComponent implements OnInit {

  clientes = signal<Cliente[]>([]);
  festivales = signal<Festival[]>([]);
  textoBusqueda = signal<string>('');
  cargando = signal<boolean>(true);
  mostrarFormulario = signal<boolean>(false);
  editando = signal<Cliente | null>(null);
  mensaje = signal<string>('');
  esError = signal<boolean>(false);

  clientesFiltrados = computed(() => {
    const texto = this.textoBusqueda().toLowerCase();
    if (!texto) return this.clientes();
    return this.clientes().filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.apellidos.toLowerCase().includes(texto) ||
      c.correo.toLowerCase().includes(texto)
    );
  });

  clienteForm!: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private festivalService: FestivalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre:     ['', Validators.required],
      apellidos:  ['', Validators.required],
      correo:     ['', [Validators.required, Validators.email]],
      telefono:   ['', [Validators.pattern(/^\d{9}$/)]],
      festivalId: ['', Validators.required]
    });
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.clienteService.getAll().subscribe({
      next: (data) => { this.clientes.set(data); this.cargando.set(false); },
      error: () => { this.mostrarMsg('Error cargando clientes', true); this.cargando.set(false); }
    });
    this.festivalService.getAll().subscribe({
      next: (data) => this.festivales.set(data)
    });
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.editando.set(null);
      this.clienteForm.reset();
    }
  }

  editar(cliente: Cliente): void {
    this.editando.set(cliente);
    this.mostrarFormulario.set(true);
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      apellidos: cliente.apellidos,
      correo: cliente.correo,
      telefono: cliente.telefono,
      festivalId: cliente.festival?.id
    });
  }

  guardar(): void {
    if (this.clienteForm.invalid) return;
    const { festivalId, ...datos } = this.clienteForm.value;
    const ed = this.editando();

    if (ed?.id) {
      this.clienteService.update(ed.id, datos, festivalId).subscribe({
        next: (actualizado) => {
          this.clientes.update(lista => lista.map(c => c.id === actualizado.id ? actualizado : c));
          this.mostrarMsg('Cliente actualizado ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMsg('Error al actualizar', true)
      });
    } else {
      this.clienteService.create(datos, festivalId).subscribe({
        next: (creado) => {
          this.clientes.update(lista => [...lista, creado]);
          this.mostrarMsg('Cliente registrado ✅');
          this.toggleFormulario();
        },
        error: () => this.mostrarMsg('El correo ya está registrado u otro error', true)
      });
    }
  }

  eliminar(cliente: Cliente): void {
    if (!confirm(`¿Eliminar a "${cliente.nombre} ${cliente.apellidos}"?`)) return;
    this.clienteService.delete(cliente.id!).subscribe({
      next: () => {
        this.clientes.update(lista => lista.filter(c => c.id !== cliente.id));
        this.mostrarMsg('Cliente eliminado');
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
    setTimeout(() => this.mensaje.set(''), 3500);
  }
}
