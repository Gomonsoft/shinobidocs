# 0353 — Feature 2 · Exportación: voz en los coros en el video «Solo instrumental»
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §5, 0019 §3–§4, 0026 §5
- Spec UX: docs/ux/10-exportacion.md (0.2.3 · Feature 2)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Llevar la voz de los coros al video cuando el usuario lo pide.

## Criterios de aceptación
- [ ] Main calcula los puntos desde la instantánea (una canción o cada una del lote) cuando `coros` es `true`, `audio` es `instrumental` y la canción tiene coros con nivel > 0, y los pasa como `audio.voz_envolvente`.
- [ ] Worker: `mezclar` con envolvente (`np.interp`) antes de la normalización de pico; `_validar` rechaza puntos inválidos (máx. 10 000, `ms` crecientes, nivel 0–1).
- [ ] Casilla «Incluir la voz en los coros ({n} %)» en el diálogo de una canción y en el de varias, solo cuando aplica, marcada por defecto y recordada en `config.exportacion.coros`.

## Pruebas de feedback
- Unitarias: pytest de `mezclar` y `_validar`; Vitest del servicio de exportación (puntos en la instantánea, lote con canciones con y sin coros); componentes del diálogo con dobles.
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
