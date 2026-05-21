package com.ticketea.controller;

import com.ticketea.model.Artista;
import com.ticketea.service.ArtistaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST de Artista.
 */
@RestController
@RequestMapping("/api/artistas")
@CrossOrigin(origins = "http://localhost:4200")
public class ArtistaController {

    @Autowired
    private ArtistaService artistaService;

    /** GET /api/artistas o /api/artistas?nombre=blur */
    @GetMapping
    public ResponseEntity<List<Artista>> listar(
            @RequestParam(required = false) String nombre) {
        return ResponseEntity.ok(artistaService.buscarPorNombre(nombre));
    }

    /** GET /api/artistas/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<Artista> detalle(@PathVariable Long id) {
        return artistaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/artistas?festivalId=1
     *
     * El festivalId se pasa como parámetro de URL para indicar a qué festival pertenece.
     * Body JSON: { "nombreArtistico": "Blur" }
     */
    @PostMapping
    public ResponseEntity<?> crear(
            @RequestParam Long festivalId,
            @Valid @RequestBody Artista artista) {
        return artistaService.crear(festivalId, artista)
                .map(creado -> ResponseEntity.status(HttpStatus.CREATED).body(creado))
                .orElse(ResponseEntity.badRequest().build());
    }

    /** PUT /api/artistas/{id}?festivalId=2 */
    @PutMapping("/{id}")
    public ResponseEntity<Artista> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody Artista artista,
            @RequestParam(required = false) Long festivalId) {
        return artistaService.actualizar(id, artista, festivalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/artistas/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (artistaService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
