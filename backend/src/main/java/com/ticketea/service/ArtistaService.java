package com.ticketea.service;

import com.ticketea.model.Artista;
import com.ticketea.model.Festival;
import com.ticketea.repository.ArtistaRepository;
import com.ticketea.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de Artista.
 * Contiene la lógica de negocio relacionada con los artistas.
 */
@Service
public class ArtistaService {

    @Autowired
    private ArtistaRepository artistaRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    public List<Artista> obtenerTodos() {
        return artistaRepository.findAll();
    }

    public List<Artista> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return artistaRepository.findAll();
        }
        return artistaRepository.findByNombreArtisticoContainingIgnoreCase(nombre);
    }

    public Optional<Artista> obtenerPorId(Long id) {
        return artistaRepository.findById(id);
    }

    public List<Artista> obtenerPorFestival(Long festivalId) {
        return artistaRepository.findByFestivalId(festivalId);
    }

    /**
     * Crear un artista.
     * El body del request debe incluir el ID del festival:
     * { "nombreArtistico": "Blur", "festival": { "id": 1 } }
     */
    public Optional<Artista> crear(Long festivalId, Artista artista) {
        return festivalRepository.findById(festivalId).map(festival -> {
            artista.setFestival(festival);
            return artistaRepository.save(artista);
        });
    }

    public Optional<Artista> actualizar(Long id, Artista artistaActualizado, Long festivalId) {
        return artistaRepository.findById(id).map(existente -> {
            existente.setNombreArtistico(artistaActualizado.getNombreArtistico());
            if (festivalId != null) {
                festivalRepository.findById(festivalId).ifPresent(existente::setFestival);
            }
            return artistaRepository.save(existente);
        });
    }

    public boolean eliminar(Long id) {
        if (artistaRepository.existsById(id)) {
            artistaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
