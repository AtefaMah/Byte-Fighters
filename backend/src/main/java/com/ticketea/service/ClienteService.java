package com.ticketea.service;

import com.ticketea.model.Cliente;
import com.ticketea.repository.ClienteRepository;
import com.ticketea.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de Cliente.
 */
@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private FestivalRepository festivalRepository;

    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }

    public List<Cliente> buscarPorNombre(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            return clienteRepository.findAll();
        }
        return clienteRepository.findByNombreContainingIgnoreCaseOrApellidosContainingIgnoreCase(
            nombre, nombre
        );
    }

    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    public Optional<Cliente> crear(Long festivalId, Cliente cliente) {
        // Verificar que el correo no exista ya
        if (clienteRepository.existsByCorreo(cliente.getCorreo())) {
            return Optional.empty(); // El controller lo interpreta como conflicto
        }
        return festivalRepository.findById(festivalId).map(festival -> {
            cliente.setFestival(festival);
            return clienteRepository.save(cliente);
        });
    }

    public Optional<Cliente> actualizar(Long id, Cliente clienteActualizado, Long festivalId) {
        return clienteRepository.findById(id).map(existente -> {
            existente.setNombre(clienteActualizado.getNombre());
            existente.setApellidos(clienteActualizado.getApellidos());
            existente.setCorreo(clienteActualizado.getCorreo());
            existente.setTelefono(clienteActualizado.getTelefono());
            if (festivalId != null) {
                festivalRepository.findById(festivalId).ifPresent(existente::setFestival);
            }
            return clienteRepository.save(existente);
        });
    }

    public boolean eliminar(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
