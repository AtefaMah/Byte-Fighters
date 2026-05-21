package com.ticketea;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Clase principal de la aplicación TicketEA.
 * El @SpringBootApplication activa toda la configuración automática de Spring Boot.
 */
@SpringBootApplication
public class TicketeaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TicketeaApplication.class, args);
    }
}
