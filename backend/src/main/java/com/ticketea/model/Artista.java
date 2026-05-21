package com.ticketea.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Artista — representa un artista que actúa en un festival.
 *
 * Relación con Festival: Muchos artistas pertenecen a un festival (N:1)
 */
@Entity
@Table(name = "artista")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Artista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre artístico (nombre con el que actúa) */
    @NotBlank(message = "El nombre artístico es obligatorio")
    @Column(name = "nombre_artistico", nullable = false)
    private String nombreArtistico;

    /**
     * Relación N:1 → Muchos artistas pertenecen a UN festival
     *
     * @ManyToOne → muchos artistas → un festival
     * @JoinColumn → nombre de la columna FK en la tabla artista
     * @JsonIgnore → evita bucle infinito JSON ignorando el festival en la respuesta
     */
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    @NotNull(message = "El festival es obligatorio")
    private Festival festival;
}