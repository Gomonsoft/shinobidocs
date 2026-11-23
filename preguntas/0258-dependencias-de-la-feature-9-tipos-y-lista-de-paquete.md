# 0258 — Dependencias de la feature 9: tipos de desarrollo y lista de dependencias permitidas en el paquete (0.2.2)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

ADR 0027 §7 acepta `yazl` y `yauzl` (MIT). Instaladas: `yazl` 3.3.1 y `yauzl` 3.4.0 en `dependencies` (con `buffer-crc32` 1.0.0 y `pend` 1.2.0, ambas MIT y sin dependencias nativas); `npm run licencias` actualizó `THIRD_PARTY_NOTICES.md` y `licencias:comprobar` pasa. Dos consecuencias que el ADR no menciona:

1. Ninguna de las dos trae tipos propios: hacen falta `@types/yazl` y `@types/yauzl` como `devDependencies` (MIT, de DefinitelyTyped; no se distribuyen).
2. `app/scripts/verificar-paquete.mjs` solo admite `yaml` y `zod` en `node_modules` del `app.asar` y haría fallar `paquete:verificar`.

## Pregunta

¿Se confirman las dos cosas?

## Opción provisional tomada (si no bloquea)

Sí: los dos `@types/*` como `devDependencies` y `DEPENDENCIAS_PERMITIDAS = yaml, zod, yazl, yauzl, buffer-crc32, pend` en el script (el test del script sigue pasando; `react` o `scheduler` siguen rechazadas).

## Respuesta

Arquitecto, 2026-11-22. **Confirmado; es coherente con ADR 0027 §7 y con la política de ADR 0012.**
- `@types/yazl` y `@types/yauzl` (MIT) son de desarrollo: no se distribuyen y no van a `THIRD_PARTY_NOTICES.md`.
- `DEPENDENCIAS_PERMITIDAS` del `app.asar` pasa a `yaml, zod, yazl, yauzl, buffer-crc32, pend`. Las cuatro nuevas son MIT, de JavaScript puro y sin dependencias nativas, y ya están en las notas de terceros.
- Lo anoto en la revisión de ADR 0027. Cualquier dependencia nueva del paquete tiene que pasar por esa lista y por `licencias:comprobar`.
