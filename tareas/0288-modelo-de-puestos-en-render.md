# 0288 — Feature 1 · Modelo de puestos por tiempo en `render.ts`
- Estado: Hecha
- Paso del pipeline: 5
- Depende de: 0287
- ADRs: 0022, 0019, 0018
- Spec UX: docs/ux/07-reproductor.md (0.2.2 · Feature 1)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Sustituir `actual`/`siguiente` por la lista de líneas con `desde`, `hacia` y `avance` como función pura del tiempo.

## Criterios de aceptación
- [ ] `FotogramaLetra` de ADR 0022 §2 (con `actual` y `siguiente` derivados) y sucesos precalculados en `indicePara`.
- [ ] Relevo, dos tiempos, duración `mín(D, 60 %)`, mínimo 120 ms, curva `1 − (1 − x)³`, retirada a 2 s + 400 ms, aparición del bloque y `esperaAparicion`.
- [ ] `movimiento: 'reducido'` deja todas las duraciones en 0; `fotogramaEstatico` con la misma forma.
- [ ] Criterios F1-R1, R2, R6–R16 y R20 de la spec 07 cubiertos por tests del modelo.

## Pruebas de feedback
- Unitarias: `render.test.ts`: los casos de la spec (relevo de 100 ms, hueco de 1,3 s y de 8 s, líneas de 0,27/0,15/0,015 s, diez de 0,3 s a 60 FPS, 50 instantes al azar = reproducción, pausa, reducido) y la regresión con 2 líneas.
- E2E: Ninguna.
- Críticos: no (solo `renderer/`)
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
Hecho (solo modelo; no cambia lo que se ve: `PantallaLetra` sigue pintando `actual`/`siguiente`):
- `renderer/src/karaoke/render.ts`: `FotogramaLetra` nuevo con `lineas: LineaEnPantalla[]` (`desde`, `hacia`, `avance` con la curva `1 - (1 - x)^3`, `retirada`, `progreso`, `palabras` solo en la activa), `cambio`, `aparicion`, `esperaAparicion`, `claveLineas`. Se conservan `actual`, `siguiente` y `claveTransicion` **con la semántica de 0.2.1** (null en un hueco, también en un relevo), porque la vista aún los usa; no son «la línea con `hacia === 0`» como dice el ADR: esa derivación la decide la 0290 al retirar `claveTransicion`.
- Sucesos precalculados en `indicePara` (relevo, dos tiempos, `mín(D, 60 %)`, mínimo 120 ms, retirada a 2 s + 400 ms, cortes de «frase» tras un hueco > 2 s). Estado en reposo = línea activa u «ocupado/vacío»; el puesto sale de `puestoEn`. Búsqueda binaria por fotograma. `ctx` admite `pantalla` y `movimiento` (ausentes = predeterminado y completo, así los llamadores actuales no cambian); con `reducido` todas las duraciones valen 0. `fotogramaEstatico(letra, id, pantalla?)` con la misma forma.
- Cálculo de fines en O(1) por línea (trozos de lista hasta la siguiente con inicio) para no empeorar la prueba de 5000 líneas.
- Ajuste 0.2.3 (ADR 0029 §4 bis): `fotogramaEn` y `fotogramaEstatico` aceptan `Pick<Letra, 'lineas'>` y cachean el índice por la lista de líneas recibida; test de dos subsecuencias independientes.
- Ya cantadas de la frase anterior que siguen fundiéndose si la siguiente entrada llega entre 2,0 y 2,4 s tras el fin: se devuelven aparte con `desde = hacia`; durante esos 400 ms puede haber más de `N` líneas en reposo (caso límite no cubierto por la spec).
- `esperaAparicion` vale 0 sin espera, el avance de la salida durante una salida en dos tiempos y 1 en el resto (también en la primera entrada: ahí manda `aparicion`).

Pruebas: `render.test.ts` (relevo de 100 ms, hueco de 1,3 s y de 8 s, líneas de 0,27/0,15/0,015 s, diez de 0,3 s a 60 FPS, 50 instantes al azar, pausa, reducido, R1, R2, R7, subsecuencias, estático). Criterios F1-R1, R2, R6–R16, R20 cubiertos. E2E: ninguno. Críticos: no. Manual: —.
Deuda: la 0290 debe decidir qué hace con `claveTransicion` y con `actual`/`siguiente` derivados.
