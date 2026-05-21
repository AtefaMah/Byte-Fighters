package com.ticketea.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Cliente — representa un asistente que compra entrada a un festival.
 *
 * Relación con Festival: Muchos clientes asisten a un festival (N:1)
 */
@Entity
@Table(name = "cliente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Column(nullable = false)
    private String apellidos;

    /** Email del cliente — validado con @Email */
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    @Column(nullable = false, unique = true)
    private String correo;

    @Column
    private String telefono;

    /**
     * Relación N:1 → Muchos clientes asisten a UN festival
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id", nullable = false)
    @JsonIgnoreProperties({"artistas", "clientes"})
    @NotNull(message = "El festival es obligatorio")
    private Festival festival;
}
