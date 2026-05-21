package com.ticketea.repository;

import com.ticketea.model.Artista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de Artista.
 * Igual que FestivalRepository, hereda todas las operaciones CRUD de JpaRepository.
 */
@Repository
public interface ArtistaRepository extends JpaRepository<Artista, Long> {

    /**
     * Obtener todos los artistas de un festival concreto.
     * Equivale a: SELECT * FROM artista WHERE festival_id = ?
     */
    List<Artista> findByFestivalId(Long festivalId);

    /**
     * Búsqueda por nombre artístico (para filtros en el frontend).
     */
    List<Artista> findByNombreArtisticoContainingIgnoreCase(String nombre);
}
