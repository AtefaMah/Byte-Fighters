package com.ticketea.service;

import com.ticketea.model.Artista;
import com.ticketea.model.Cliente;
import com.ticketea.model.Festival;
import com.ticketea.repository.ArtistaRepository;
import com.ticketea.repository.ClienteRepository;
import com.ticketea.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de Festival.
 *
 * El @Service indica a Spring que esta clase contiene la lógica de negocio.
 * Los Controllers llaman al Service, y el Service llama al Repository.
 * Esto separa responsabilidades: Controller (HTTP) → Service (lógica) → Repository (BD)
 */
@Service
public class FestivalService {

    /** Inyección de dependencias: Spring crea e inyecta el repositorio automáticamente */
    @Autowired
    private FestivalRepository festivalRepository;

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    /** Obtener todos los festivales */
    public List<Festival> obtenerTodos() {
        return festivalRepository.findAll();
    }

    /** Obtener todos los festivales filtrados por nombre (opcional) */
    public List<Festival> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return festivalRepository.findAll();
        }
        return festivalRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /** Obtener un festival por ID. Devuelve Optional para manejar "no encontrado" */
    public Optional<Festival> obtenerPorId(Long id) {
        return festivalRepository.findById(id);
    }

    /** Crear un nuevo festival */
    public Festival crear(Festival festival) {
        return festivalRepository.save(festival);
    }

    /**
     * Actualizar un festival existente.
     * Si no existe, devuelve Optional.empty() y el Controller responde 404.
     */
    public Optional<Festival> actualizar(Long id, Festival festivalActualizado) {
        return festivalRepository.findById(id).map(festivalExistente -> {
            festivalExistente.setNombre(festivalActualizado.getNombre());
            festivalExistente.setPromotora(festivalActualizado.getPromotora());
            festivalExistente.setFechaInicio(festivalActualizado.getFechaInicio());
            festivalExistente.setFechaFin(festivalActualizado.getFechaFin());
            festivalExistente.setCantidadAsistentes(festivalActualizado.getCantidadAsistentes());
            return festivalRepository.save(festivalExistente);
        });
    }

    /** Eliminar un festival por ID */
    public boolean eliminar(Long id) {
        if (festivalRepository.existsById(id)) {
            festivalRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /** Obtener los artistas de un festival concreto */
    public List<Artista> obtenerArtistasDeFestival(Long festivalId) {
        return artistaRepository.findByFestivalId(festivalId);
    }

    /** Obtener los clientes de un festival concreto */
    public List<Cliente> obtenerClientesDeFestival(Long festivalId) {
        return clienteRepository.findByFestivalId(festivalId);
    }
}
