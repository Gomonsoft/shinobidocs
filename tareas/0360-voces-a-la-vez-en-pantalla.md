# 0360 — Feature 3 · Voces a la vez en pantalla y en el video
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0357, 0364
- ADRs: 0029 §4 bis y §7, 0022
- Spec UX: docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Que cada zona barra su línea aunque otra zona también esté cantando.

## Criterios de aceptación
- [ ] Varias zonas al 100 % a la vez, cada una con sus tiempos; indicadores de espera solo cuando no suena ninguna (C1S-R1).
- [ ] Fuera de los solapes, el modelo es idéntico al de la feature 1 (C1S-R2); el anfitrión de exportación da el mismo modelo en los solapes (C1-V1).

## Pruebas de feedback
- Unitarias: `zonas.test.ts` y `PantallaLetra.test.tsx` con la letra de la prueba (10 instantes del solape).
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
