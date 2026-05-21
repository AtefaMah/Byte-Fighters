# BYTE-FIGHTERS — Guía Completa del Proyecto

---

## Índice

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Arquitectura y tecnologías](#2-arquitectura-y-tecnologías)
3. [Modelo de datos](#3-modelo-de-datos)
4. [API REST — Endpoints](#4-api-rest--endpoints)
5. [Estructura de carpetas](#5-estructura-de-carpetas)
6. [Guía de arranque — Backend](#6-guía-de-arranque--backend)
7. [Guía de arranque — Frontend](#7-guía-de-arranque--frontend)
8. [División del trabajo (4 personas)](#8-división-del-trabajo-4-personas)
9. [Problemas comunes y soluciones](#9-problemas-comunes-y-soluciones)

---

## 1. Descripción del proyecto

**TicketEA** es una aplicación de gestión de festivales de música al estilo Ticketea/Ticketmaster. Permite:

- Ver festivales disponibles con sus fechas, promotoras y aforo.
- Consultar los artistas que actúan en cada festival.
- Registrar clientes (asistentes) a cada festival.
- Buscar, filtrar, editar y borrar registros.

---

## 2. Arquitectura y tecnologías

```
┌─────────────────────────────────┐
│        NAVEGADOR (Angular 21)   │
│  Componentes StandAlone         │
│  Signals + Formularios React.   │
│  Servicios con Observables      │
└────────────┬────────────────────┘
             │ HTTP (puerto 4200)
             ▼
┌─────────────────────────────────┐
│    SPRING BOOT (puerto 8080)    │
│  Controllers REST               │
│  Services + Repositories (JPA)  │
│  Base de datos H2 en memoria    │
└─────────────────────────────────┘
```

## 3. Modelo de datos

### Relaciones

```
FESTIVAL (1) ──────── (M) ARTISTA
FESTIVAL (1) ──────── (M) CLIENTE
```

### Tabla: FESTIVAL

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long (PK) | Identificador único |
| `nombre` | String | Nombre del festival |
| `promotora` | String | Empresa organizadora |
| `fechaInicio` | LocalDate | Fecha de inicio |
| `fechaFin` | LocalDate | Fecha de fin |
| `cantidadAsistentes` | Integer | Aforo máximo |

### Tabla: ARTISTA

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long (PK) | Identificador único |
| `nombreArtistico` | String | Nombre artístico |
| `festival_id` | Long (FK) | Festival al que pertenece |

### Tabla: CLIENTE

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | Long (PK) | Identificador único |
| `nombre` | String | Nombre del cliente |
| `apellidos` | String | Apellidos del cliente |
| `correo` | String | Email de contacto |
| `telefono` | String | Teléfono de contacto |
| `festival_id` | Long (FK) | Festival al que asiste |

---

## 4. API REST — Endpoints

### Festivales

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/festivales` | Listar todos los festivales |
| GET | `/api/festivales/{id}` | Ver detalle de un festival |
| GET | `/api/festivales/{id}/artistas` | Artistas de un festival |
| GET | `/api/festivales/{id}/clientes` | Clientes de un festival |
| POST | `/api/festivales` | Crear un festival |
| PUT | `/api/festivales/{id}` | Editar un festival |
| DELETE | `/api/festivales/{id}` | Borrar un festival |

### Artistas

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/artistas` | Listar todos los artistas |
| GET | `/api/artistas/{id}` | Ver detalle de un artista |
| POST | `/api/artistas` | Crear un artista |
| PUT | `/api/artistas/{id}` | Editar un artista |
| DELETE | `/api/artistas/{id}` | Borrar un artista |

### Clientes

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/clientes` | Listar todos los clientes |
| GET | `/api/clientes/{id}` | Ver detalle de un cliente |
| POST | `/api/clientes` | Crear un cliente |
| PUT | `/api/clientes/{id}` | Editar un cliente |
| DELETE | `/api/clientes/{id}` | Borrar un cliente |

---

## 5. Estructura de carpetas

```
ticketea/
├── README.md
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/ticketea/
│       │   ├── TicketeaApplication.java
│       │   ├── controller/
│       │   │   ├── FestivalController.java
│       │   │   ├── ArtistaController.java
│       │   │   └── ClienteController.java
│       │   ├── model/
│       │   │   ├── Festival.java
│       │   │   ├── Artista.java
│       │   │   └── Cliente.java
│       │   ├── repository/
│       │   │   ├── FestivalRepository.java
│       │   │   ├── ArtistaRepository.java
│       │   │   └── ClienteRepository.java
│       │   └── service/
│       │       ├── FestivalService.java
│       │       ├── ArtistaService.java
│       │       └── ClienteService.java
│       └── resources/
│           ├── application.properties
│           └── data.sql
└── frontend/
    └── src/app/
        ├── app.config.ts
        ├── app.routes.ts
        ├── models/
        │   ├── festival.model.ts
        │   ├── artista.model.ts
        │   └── cliente.model.ts
        ├── services/
        │   ├── festival.service.ts
        │   ├── artista.service.ts
        │   └── cliente.service.ts
        └── pages/
            ├── home/
            ├── festivales/
            ├── artistas/
            └── clientes/
```

---

## 6. Guía de arranque — Backend

### Requisitos previos

- Java 17 o superior → [https://adoptium.net](https://adoptium.net)
- Maven 3.8+ (o usar el wrapper `mvnw` incluido)
- IntelliJ IDEA (recomendado) o VS Code con extensión Java

### Pasos

```bash
# 1. Entrar en la carpeta backend
cd ticketea/backend

# 2. Compilar y arrancar
./mvnw spring-boot:run
# En Windows: mvnw.cmd spring-boot:run

# 3. Verificar que funciona
# Abrir en el navegador: http://localhost:8080/api/festivales
# Consola H2: http://localhost:8080/h2-console
#   JDBC URL: jdbc:h2:mem:ticketeadb
#   User: sa | Password: (vacío)
```

### Posibles errores

- **Puerto 8080 ocupado**: Cambiar en `application.properties` → `server.port=8081`
- **Java no encontrado**: Asegurarse de tener JAVA_HOME configurado

---

## 7. Guía de arranque — Frontend

### Requisitos previos

- Node.js 20 o superior → [https://nodejs.org](https://nodejs.org)
- Angular CLI 21 → `npm install -g @angular/cli`

### Pasos

```bash
# 1. Entrar en la carpeta frontend
cd ticketea/frontend

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor de desarrollo
ng serve

# 4. Abrir en el navegador
# http://localhost:4200
```

### Posibles errores

- **CORS error**: El backend debe tener CORS configurado para `http://localhost:4200` (ya incluido en el código)
- **Puerto 4200 ocupado**: `ng serve --port 4201`
- **node_modules faltantes**: Borrar la carpeta y ejecutar `npm install` de nuevo

---

## 8. División del trabajo

### Persona 1 — Frontend: Festivales - Paula Núñez Ramos

- `festival.model.ts`
- `festival.service.ts`
- `pages/festivales/` (lista + formulario crear/editar)
- `pages/home/` (página de inicio)

### Persona 2 — Frontend: Artistas y Clientes - Atefa Mahmoodi

- `artista.model.ts` + `cliente.model.ts`
- `artista.service.ts` + `cliente.service.ts`
- `pages/artistas/` + `pages/clientes/`
- Componentes de detalle y formularios

### Persona 3 — Backend: Modelo y Repositorios - Luis Enrique Limones Bernabé

- `Festival.java`, `Artista.java`, `Cliente.java`
- `FestivalRepository.java`, `ArtistaRepository.java`, `ClienteRepository.java`
- `data.sql` (datos de ejemplo)
- `application.properties`

### Persona 4 — Backend: Servicios y Controladores - María de los Ángeles Osorio Lucas

- `FestivalService.java`, `ArtistaService.java`, `ClienteService.java`
- `FestivalController.java`, `ArtistaController.java`, `ClienteController.java`
- Configuración CORS
- `pom.xml`

---

## 9. Problemas comunes y soluciones

| Problema | Solución |
|---|---|
| CORS bloqueado en el navegador | Añadir `@CrossOrigin` en los controllers o configuración global en `WebConfig.java` |
| H2 no guarda datos al reiniciar | Es por diseño (en memoria). Para persistir, cambiar a `jdbc:h2:file:./ticketeadb` |
| Angular no encuentra módulos | Ejecutar `npm install` en la carpeta `frontend` |
| Error 404 al llamar a la API | Verificar que el backend esté arrancado en el puerto 8080 |
| Campos null en el JSON | Revisar que los nombres de los campos en el modelo TypeScript coincidan con los del backend |
| `@ManyToOne` lanza error circular | Añadir `@JsonIgnoreProperties` en el modelo Java |
