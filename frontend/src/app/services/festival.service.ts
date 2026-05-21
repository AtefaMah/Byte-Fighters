import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Festival, Artista, Cliente } from '../models/models';

/**
 * Servicio de Festival.
 *
 * @Injectable({ providedIn: 'root' }) → este servicio es un Singleton disponible
 * en toda la aplicación sin necesidad de declararlo en ningún módulo.
 *
 * Todos los métodos devuelven Observable<T> para que los componentes
 * puedan subscribirse y reaccionar cuando lleguen los datos del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class FestivalService {

  /** URL base de la API del backend */
  private readonly apiUrl = 'http://localhost:8080/api/festivales';

  /** HttpClient se inyecta automáticamente — permite hacer peticiones HTTP */
  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los festivales.
   * Opcionalmente filtra por nombre si se proporciona.
   *
   * Llama a: GET /api/festivales  o  GET /api/festivales?nombre=xxx
   */
  getAll(nombre?: string): Observable<Festival[]> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    return this.http.get<Festival[]>(this.apiUrl, { params });
  }

  /**
   * Obtener el detalle de un festival por ID.
   * Llama a: GET /api/festivales/:id
   */
  getById(id: number): Observable<Festival> {
    return this.http.get<Festival>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener los artistas de un festival (relación 1:M).
   * Llama a: GET /api/festivales/:id/artistas
   */
  getArtistas(id: number): Observable<Artista[]> {
    return this.http.get<Artista[]>(`${this.apiUrl}/${id}/artistas`);
  }

  /**
   * Obtener los clientes de un festival (relación 1:M).
   * Llama a: GET /api/festivales/:id/clientes
   */
  getClientes(id: number): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/${id}/clientes`);
  }

  /**
   * Crear un nuevo festival.
   * Llama a: POST /api/festivales
   * El body es un objeto Festival (sin id).
   */
  create(festival: Festival): Observable<Festival> {
    return this.http.post<Festival>(this.apiUrl, festival);
  }

  /**
   * Actualizar un festival existente.
   * Llama a: PUT /api/festivales/:id
   */
  update(id: number, festival: Festival): Observable<Festival> {
    return this.http.put<Festival>(`${this.apiUrl}/${id}`, festival);
  }

  /**
   * Eliminar un festival por ID.
   * Llama a: DELETE /api/festivales/:id
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
