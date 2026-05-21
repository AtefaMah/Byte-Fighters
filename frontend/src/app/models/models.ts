/**
 * MODELOS TYPESCRIPT — TicketEA
 *
 * Estos interfaces definen la forma de los datos que llegan desde el backend.
 * Los nombres de los campos DEBEN coincidir exactamente con el JSON del backend.
 */

/** Modelo de Festival */
export interface Festival {
  id?: number;
  nombre: string;
  promotora: string;
  fechaInicio: string;   // LocalDate de Java → string en JSON (ej: "2025-05-29")
  fechaFin: string;
  cantidadAsistentes: number;
  artistas?: Artista[];  // Relación 1:M (opcional, puede no venir siempre)
  clientes?: Cliente[];  // Relación 1:M (opcional)
}

/** Modelo de Artista */
export interface Artista {
  id?: number;
  nombreArtistico: string;
  festival?: Festival;   // La referencia al festival padre (puede venir simplificada)
}

/** Modelo de Cliente */
export interface Cliente {
  id?: number;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
  festival?: Festival;
}
