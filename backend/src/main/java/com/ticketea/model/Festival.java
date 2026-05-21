package com.ticketea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

/**
 * Entidad Festival — representa un festival de música en la base de datos.
 *
 * @Entity  → indica a JPA que esta clase es una tabla en la BD
 * @Table   → nombre de la tabla en H2
 * @Data    → Lombok genera getters, setters, toString, equals, hashCode
 * @NoArgsConstructor / @AllArgsConstructor → constructores automáticos
 */
@Entity
@Table(name = "festival")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Festival {

    /** Clave primaria generada automáticamente */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Nombre del festival, no puede estar vacío */
    @NotBlank(message = "El nombre del festival es obligatorio")
    @Column(nullable = false)
    private String nombre;

    /** Empresa promotora que organiza el festival */
    @NotBlank(message = "La promotora es obligatoria")
    @Column(nullable = false)
    private String promotora;

    /** Fecha de inicio del festival */
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    /** Fecha de fin del festival */
    @NotNull(message = "La fecha de fin es obligatoria")
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    /** Cantidad máxima de asistentes (aforo) */
    @Positive(message = "La cantidad de asistentes debe ser positiva")
    @Column(name = "cantidad_asistentes")
    private Integer cantidadAsistentes;

    /**
     * Relación 1:M → Un festival tiene MUCHOS artistas
     * mappedBy = "festival" indica que el campo "festival" en Artista es la FK
     * @JsonIgnoreProperties evita bucles infinitos al serializar a JSON
     */
    @OneToMany(mappedBy = "festival", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("festival")
    private List<Artista> artistas;

    /**
     * Relación 1:M → Un festival tiene MUCHOS clientes
     */
    @OneToMany(mappedBy = "festival", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("festival")
    private List<Cliente> clientes;
}
