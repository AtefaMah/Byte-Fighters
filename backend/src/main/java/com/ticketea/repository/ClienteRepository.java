package com.ticketea.repository;

import com.ticketea.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio de Cliente.
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Obtener todos los clientes de un festival concreto.
     * Equivale a: SELECT * FROM cliente WHERE festival_id = ?
     */
    List<Cliente> findByFestivalId(Long festivalId);

    /**
     * Buscar clientes por nombre o apellidos.
     */
    List<Cliente> findByNombreContainingIgnoreCaseOrApellidosContainingIgnoreCase(
        String nombre, String apellidos
    );

    /**
     * Comprobar si ya existe un cliente con ese correo (para evitar duplicados).
     */
    boolean existsByCorreo(String correo);
}
