package com.ticketea.controller;

import com.ticketea.model.Cliente;
import com.ticketea.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST de Cliente.
 */
@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "http://localhost:4200")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /** GET /api/clientes o /api/clientes?nombre=ana */
    @GetMapping
    public ResponseEntity<List<Cliente>> listar(
            @RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(clienteService.buscarPorNombre(nombre));
    }

    /** GET /api/clientes/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> detalle(@PathVariable Long id) {
        return clienteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/clientes?festivalId=1
     *
     * Body JSON:
     * {
     *   "nombre": "Ana",
     *   "apellidos": "García",
     *   "correo": "ana@email.com",
     *   "telefono": "612345678"
     * }
     */
    @PostMapping
    public ResponseEntity<?> crear(
            @RequestParam Long festivalId,
            @Valid @RequestBody Cliente cliente) {
        return clienteService.crear(festivalId, cliente)
                .map(creado -> ResponseEntity.status(HttpStatus.CREATED).body(creado))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    /** PUT /api/clientes/{id}?festivalId=2 (festivalId opcional) */
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Cliente cliente,
            @RequestParam(required = false) Long festivalId) {
        return clienteService.actualizar(id, cliente, festivalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/clientes/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (clienteService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
