import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artista, Cliente } from '../models/models';

// ============================================================
// SERVICIO DE ARTISTA
// ============================================================

@Injectable({ providedIn: 'root' })
export class ArtistaService {

  private readonly apiUrl = 'http://localhost:8080/api/artistas';

  constructor(private http: HttpClient) {}

  /** GET /api/artistas o /api/artistas?nombre=blur */
  getAll(nombre?: string): Observable<Artista[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    return this.http.get<Artista[]>(this.apiUrl, { params });
  }

  /** GET /api/artistas/:id */
  getById(id: number): Observable<Artista> {
    return this.http.get<Artista>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST /api/artistas?festivalId=1
   * El festivalId es obligatorio para asociar al artista con un festival.
   */
  create(artista: Artista, festivalId: number): Observable<Artista> {
    const params = new HttpParams().set('festivalId', festivalId.toString());
    return this.http.post<Artista>(this.apiUrl, artista, { params });
  }

  /** PUT /api/artistas/:id?festivalId=2 */
  update(id: number, artista: Artista, festivalId?: number): Observable<Artista> {
    let params = new HttpParams();
    if (festivalId) params = params.set('festivalId', festivalId.toString());
    return this.http.put<Artista>(`${this.apiUrl}/${id}`, artista, { params });
  }

  /** DELETE /api/artistas/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// ============================================================
// SERVICIO DE CLIENTE
// ============================================================

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private readonly apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  /** GET /api/clientes o /api/clientes?nombre=ana */
  getAll(nombre?: string): Observable<Cliente[]> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    return this.http.get<Cliente[]>(this.apiUrl, { params });
  }

  /** GET /api/clientes/:id */
  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST /api/clientes?festivalId=1
   */
  create(cliente: Cliente, festivalId: number): Observable<Cliente> {
    const params = new HttpParams().set('festivalId', festivalId.toString());
    return this.http.post<Cliente>(this.apiUrl, cliente, { params });
  }

  /** PUT /api/clientes/:id */
  update(id: number, cliente: Cliente, festivalId?: number): Observable<Cliente> {
    let params = new HttpParams();
    if (festivalId) params = params.set('festivalId', festivalId.toString());
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, { params });
  }

  /** DELETE /api/clientes/:id */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
