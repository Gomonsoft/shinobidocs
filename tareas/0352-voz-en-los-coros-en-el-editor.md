# 0352 — Feature 2 · Editor: pista «instrumental con coros» en el motor de audio
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0350
- ADRs: 0030 §4, 0010
- Spec UX: docs/ux/06-editor.md#023--feature-2--voz-en-los-coros (Pista derivada en el editor)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Oír en la vista previa con «Instrumental» lo que oirá el público.

## Criterios de aceptación
- [ ] Pista derivada `instrumental_coros` calculada en un Web Worker (`Float32Array` transferidos), recalculada 300 ms después del último cambio sin cortar el audio; solo vale la última petición (C2-E6).
- [ ] `MotorAudio` la usa con «Escuchar: Instrumental» si hay coros y nivel > 0; bucle, velocidades y tono conservado funcionan igual; «Original» y «Voz» no cambian (C2-E3, C2-E4).
- [ ] Estados: «Preparando los coros…» si el cálculo pasa de 500 ms (medido por el cliente) y, con error, instrumental solo y `edi.coros.error` una vez por visita (C2-E6).
- [ ] `maxBuffers` a 3 mientras existe la pista; memoria medida con una canción de 4 y de 10 min en las notas.

## Pruebas de feedback
- Unitarias: `motorAudio.test.ts` (selección de pista, LRU, bucle y velocidad con la pista derivada), test de la mezcla derivada con señales sintéticas (± 1 dB), fallo simulado del worker.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
