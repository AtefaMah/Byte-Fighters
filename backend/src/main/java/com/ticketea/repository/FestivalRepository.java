package com.ticketea.repository;

import com.ticketea.model.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de Festival.
 *
 * Al extender JpaRepository, Spring Data JPA nos da GRATIS:
 *   - findAll()         → SELECT * FROM festival
 *   - findById(id)      → SELECT * FROM festival WHERE id = ?
 *   - save(festival)    → INSERT o UPDATE
 *   - deleteById(id)    → DELETE FROM festival WHERE id = ?
 *   - existsById(id)    → comprueba si existe un registro con ese id
 *
 * No necesitamos escribir ningún SQL a mano para las operaciones básicas.
 */
@Repository
public interface FestivalRepository extends JpaRepository<Festival, Long> {

    /**
     * Búsqueda por nombre (ignorando mayúsculas/minúsculas).
     * Spring Data JPA genera el SQL automáticamente a partir del nombre del método:
     * → SELECT * FROM festival WHERE LOWER(nombre) LIKE LOWER('%nombre%')
     */
    List<Festival> findByNombreContainingIgnoreCase(String nombre);
}
