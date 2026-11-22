# 0352 — Feature 2 · Editor: pista «instrumental con coros», deslizador y «Escuchar»
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0350, 0346
- ADRs: 0030 §4, 0010
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 2)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Oír en la vista previa lo que oirá el público y ajustar el nivel por canción.

## Criterios de aceptación
- [ ] Pista derivada `instrumental_coros` calculada en un Web Worker con `Float32Array` transferidos, recalculada 300 ms después del último cambio; `MotorAudio` la usa con «Escuchar: Instrumental» si hay coros y nivel > 0; bucle, velocidad y tono conservado funcionan sin cambios.
- [ ] `maxBuffers` a 3 mientras existe la pista derivada; memoria medida con una canción de 4 y de 10 min y anotada en las notas.
- [ ] Deslizador «Voz en los coros» (0–100 % en pasos de 5, un paso de deshacer por ráfaga) y [▶ Escuchar] en Funciones › «Cantantes y coros», con los textos de la spec (incluido el límite de la voz principal).

## Pruebas de feedback
- Unitarias: `motorAudio.test.ts` (selección de pista y LRU), test de la mezcla derivada con señales sintéticas, componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: el deslizador guarda el nivel.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
