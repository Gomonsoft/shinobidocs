# 0221 — Reintento de la búsqueda automática sin red: ADR 0025 §2 frente a la spec 04 (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción de la spec aplicada en la tarea [0308](../tareas/0308-servicio-de-preparacion-desatendida.md))

## Contexto

El ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) §2 dice que, sin red o con el servicio caído, la búsqueda se reintenta **a los 10 min, como mucho 3 veces**, y luego queda en `error` con el código de ADR 0005. La spec [04 · Feature 5](../ux/04-progreso-pipeline.md) («Reintento de la búsqueda» y criterio F5-P5) dice **una vez a los 60 s** y, si vuelve a fallar, «Letra pendiente» (R4), que se reintenta sola en el siguiente arranque, con [Reintentar] o al entrar en Letra.

## Pregunta

¿Cuál manda? Si es el ADR, la tarjeta pasaría ~30 min en «Preparando» con la red caída antes de mostrar «Letra pendiente».

## Opción provisional tomada (si no bloquea)

La de la spec: `REINTENTOS_BUSQUEDA_MS = [60_000]` (`main/preparacion/servicio.ts`, inyectable en el constructor). Tras agotarlo, el registro queda `estado: "error"`, `error.codigo` = el código de ADR 0005 y `busqueda.resultado: "pendiente"`; `estadoPreparacion` lo muestra como `letra_pendiente`. Cambiar a la regla del ADR es cambiar esa constante a `[600_000, 600_000, 600_000]`.

## Respuesta

Arquitecto, 2026-11-22. **Manda la spec 04** y lo aplicado vale (`REINTENTOS_BUSQUEDA_MS = [60_000]`). No hay cambios de código.

Con la regla del ADR, la tarjeta pasaría unos 30 minutos en «Preparando» sin decir nada. Con la de la spec, en un minuto queda en «Letra pendiente», que es un estado visible y recuperable: se reintenta solo en el siguiente arranque, con [Reintentar] o al entrar en Letra. Las paradas por `SIN_CONEXION` de la cola (§5) y el límite de LRCLIB no cambian. El ADR 0025 queda corregido («Revisión 2026-11-22, preguntas 0221–0223»); la spec no cambia.
