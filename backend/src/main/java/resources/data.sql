-- ============================================
-- DATOS DE EJEMPLO PARA TICKETEA
-- Este fichero se carga automáticamente al
-- arrancar la aplicación Spring Boot.
-- ============================================

-- FESTIVALES (3 registros)
INSERT INTO festival (id, nombre, promotora, fecha_inicio, fecha_fin, cantidad_asistentes)
VALUES
  (1, 'Primavera Sound', 'Primavera Sound SL', '2025-05-29', '2025-06-02', 220000),
  (2, 'Mad Cool Festival', 'Mad Cool Events SL', '2025-07-09', '2025-07-12', 180000),
  (3, 'Sonar Barcelona', 'Advanced Music SL', '2025-06-19', '2025-06-21', 120000);

-- ARTISTAS (10 registros repartidos entre los festivales)
INSERT INTO artista (id, nombre_artistico, festival_id)
VALUES
  (1,  'The Cure',            1),
  (2,  'Massive Attack',      1),
  (3,  'Blur',                1),
  (4,  'Arcade Fire',         1),
  (5,  'Nine Inch Nails',     2),
  (6,  'Portishead',          2),
  (7,  'LCD Soundsystem',     2),
  (8,  'Aphex Twin',          3),
  (9,  'Bicep',               3),
  (10, 'Charlotte de Witte',  3);

-- CLIENTES (20 registros repartidos entre los festivales)
INSERT INTO cliente (id, nombre, apellidos, correo, telefono, festival_id)
VALUES
  (1,  'Ana',      'García López',      'ana.garcia@email.com',      '612345678', 1),
  (2,  'Carlos',   'Martínez Pérez',    'carlos.mp@email.com',       '623456789', 1),
  (3,  'Lucía',    'Fernández Ruiz',    'lucia.fr@email.com',        '634567890', 1),
  (4,  'Miguel',   'Sánchez Torres',    'miguel.st@email.com',       '645678901', 1),
  (5,  'Sara',     'López Jiménez',     'sara.lj@email.com',         '656789012', 1),
  (6,  'David',    'González Moreno',   'david.gm@email.com',        '667890123', 1),
  (7,  'Elena',    'Rodríguez Muñoz',   'elena.rm@email.com',        '678901234', 1),
  (8,  'Pablo',    'Díaz Álvarez',      'pablo.da@email.com',        '689012345', 2),
  (9,  'Laura',    'Moreno Romero',     'laura.mr@email.com',        '690123456', 2),
  (10, 'Javier',   'Jiménez Serrano',   'javier.js@email.com',       '601234567', 2),
  (11, 'Carmen',   'Álvarez Blanco',    'carmen.ab@email.com',       '612345679', 2),
  (12, 'Raúl',     'Romero Molina',     'raul.rm@email.com',         '623456780', 2),
  (13, 'Marta',    'Torres Ortega',     'marta.to@email.com',        '634567891', 2),
  (14, 'Sergio',   'Blanco Castro',     'sergio.bc@email.com',       '645678902', 3),
  (15, 'Nuria',    'Castro Ramos',      'nuria.cr@email.com',        '656789013', 3),
  (16, 'Alberto',  'Ramos Gil',         'alberto.rg@email.com',      '667890124', 3),
  (17, 'Patricia', 'Gil Vargas',        'patricia.gv@email.com',     '678901235', 3),
  (18, 'Andrés',   'Vargas Reyes',      'andres.vr@email.com',       '689012346', 3),
  (19, 'Beatriz',  'Reyes Santos',      'beatriz.rs@email.com',      '690123457', 3),
  (20, 'Iván',     'Santos Herrera',    'ivan.sh@email.com',         '601234568', 3);
