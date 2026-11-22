# 0353 — Feature 2 · Exportación: envolvente en main y mezcla en el worker
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §5, 0019 §3–§4, 0026 §5
- Spec UX: docs/ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Llevar la voz de los coros al video cuando se pide.

## Criterios de aceptación
- [ ] Main calcula los puntos desde la instantánea (una canción o cada una del lote, con su nivel) cuando `coros` es `true`, `audio` es `instrumental`, hay voz separada y la canción tiene coros con nivel > 0, y los pasa como `audio.voz_envolvente` (C2-V2, C2-V5, lado main).
- [ ] Worker: `mezclar` con envolvente (`np.interp`) antes de la normalización de pico; `_validar` rechaza puntos inválidos; sin envolvente, el audio es idéntico al de 0.2.2 (C2-V2, C2-V3).

## Pruebas de feedback
- Unitarias: pytest de `mezclar` (tono al 50 % ± 1 dB en los coros, silencio a > 450 ms) y `_validar`; Vitest del servicio de exportación (puntos = `tramosCoro`; lote con niveles 20 % y 70 % y canciones sin coros).
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
