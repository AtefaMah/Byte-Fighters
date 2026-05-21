package com.ticketea.controller;

import com.ticketea.model.Artista;
import com.ticketea.model.Cliente;
import com.ticketea.model.Festival;
import com.ticketea.service.FestivalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST de Festival.
 *
 * @RestController → combina @Controller + @ResponseBody (responde JSON automáticamente)
 * @RequestMapping → URL base para todos los endpoints de este controller
 * @CrossOrigin    → permite peticiones desde el frontend Angular (localhost:4200)
 */
@RestController
@RequestMapping("/api/festivales")
@CrossOrigin(origins = "http://localhost:4200")
public class FestivalController {

    @Autowired
    private FestivalService festivalService;

    /**
     * GET /api/festivales
     * GET /api/festivales?nombre=primavera
     *
     * Devuelve todos los festivales, con búsqueda opcional por nombre.
     */
    @GetMapping
    public ResponseEntity<List<Festival>> listar(
            @RequestParam(required = false) String nombre) {
        List<Festival> festivales = festivalService.buscarPorNombre(nombre);
        return ResponseEntity.ok(festivales);
    }

    /**
     * GET /api/festivales/{id}
     * Devuelve el detalle de un festival. Si no existe, devuelve 404.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Festival> detalle(@PathVariable Long id) {
        return festivalService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/festivales/{id}/artistas
     * Devuelve todos los artistas que actúan en ese festival.
     * Este endpoint muestra la relación 1:M (Festival → Artistas)
     */
    @GetMapping("/{id}/artistas")
    public ResponseEntity<List<Artista>> artistas(@PathVariable Long id) {
        List<Artista> artistas = festivalService.obtenerArtistasDeFestival(id);
        return ResponseEntity.ok(artistas);
    }

    /**
     * GET /api/festivales/{id}/clientes
     * Devuelve todos los clientes que asisten a ese festival.
     * Este endpoint muestra la relación 1:M (Festival → Clientes)
     */
    @GetMapping("/{id}/clientes")
    public ResponseEntity<List<Cliente>> clientes(@PathVariable Long id) {
        List<Cliente> clientes = festivalService.obtenerClientesDeFestival(id);
        return ResponseEntity.ok(clientes);
    }

    /**
     * POST /api/festivales
     * Crea un nuevo festival. @Valid activa las validaciones del modelo.
     * Devuelve 201 Created con el festival creado.
     */
    @PostMapping
    public ResponseEntity<Festival> crear(@Valid @RequestBody Festival festival) {
        Festival creado = festivalService.crear(festival);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    /**
     * PUT /api/festivales/{id}
     * Actualiza un festival existente. Devuelve 404 si no existe.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Festival> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Festival festival) {
        return festivalService.actualizar(id, festival)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/festivales/{id}
     * Elimina un festival. Devuelve 204 No Content si se eliminó, 404 si no existía.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (festivalService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
