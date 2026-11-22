# 0357 — Feature 3 · Fin por parte en las reglas de la letra
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0356 (si sirve), 0341
- ADRs: 0029 §7, 0006, 0021
- Spec UX: — (ADR 0029 §7); docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: M–L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Permitir que líneas de partes distintas se solapen sin tocar el orden de inicios.

## Criterios de aceptación
- [ ] `validarInvariantesLetra`, `finEfectivo`, `validarPalabras`/`palabrasVisibles` y los límites del fin con la regla de ADR 0029 §7 («Todos» cuenta como de todos los cantantes); main la valida al escribir (C1S-E4, invariantes).
- [ ] Una letra sin solapes da exactamente los mismos resultados que antes en todas las pruebas existentes (C1S-E5).
- [ ] `revisada` deja de valer en las líneas cuyo fin automático cambia, sin reescribir nada al abrir.
- [ ] Qué ve 0.2.2 de una canción con solapes (líneas cortadas en el inicio de la otra parte), documentado para las notas, sin marcarla como dañada.

## Pruebas de feedback
- Unitarias: `letra.test.ts`, `tiempos.test.ts` con la letra de la prueba; copia congelada del esquema de 0.2.2.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
