# 0351 — Feature 2 · Reproductor y ventana secundaria: la voz sube en los coros
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §1 y §3, 0011 §3
- Spec UX: docs/ux/07-reproductor.md#023--feature-2--voz-en-los-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Automatizar la ganancia de la voz en `MotorReproductor`.

## Criterios de aceptación
- [ ] Nivel `máx(vozGuiaEfectiva, envolvente(t))` programado en cada arranque, búsqueda, `fijarVoz`, `fijarCoros` y cambio de canción, con el mismo `when` que las fuentes (C2-R1, C2-R2, C2-R3, C2-R4).
- [ ] V no silencia los coros; indicador `rep.ind.vozsilenciada.coros` en canciones con coros y nivel > 0 (C2-R5).
- [ ] Ventana secundaria y cola, cada canción con su nivel (C2-R6).

## Pruebas de feedback
- Unitarias: `motorReproductor.test.ts` con `AudioContext` falso: cada criterio C2-R1 a C2-R6.
- E2E: Ninguna nueva; los críticos del reproductor siguen pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
