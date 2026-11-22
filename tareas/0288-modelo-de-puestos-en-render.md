# 0288 — Feature 1 · Modelo de puestos por tiempo en `render.ts`
- Estado: Pendiente
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
(las rellena el programador al terminar)
