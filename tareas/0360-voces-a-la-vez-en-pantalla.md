# 0360 — Feature 3 · Voces a la vez en pantalla y en el video
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0357, 0348
- ADRs: 0029 §4 bis y §7, 0022
- Spec UX: docs/ux/07-reproductor.md y docs/ux/sistema-visual.md (0.2.3 · Voces a la vez, sección condicionada)
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Que cada zona barra su línea aunque otra zona también esté cantando.

## Criterios de aceptación
- [ ] Una línea activa por zona a la vez, cada una con su barrido; indicadores de espera por zona; criterios de la sección condicionada de la spec 07.
- [ ] Tiempo de fotograma de la exportación dentro del criterio 2 de la prueba.

## Pruebas de feedback
- Unitarias: `zonas.test.ts` y `PantallaLetra.test.tsx` con la letra de la prueba.
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
