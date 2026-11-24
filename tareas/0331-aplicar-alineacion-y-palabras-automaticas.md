# 0331 — Feature 10 · `aplicarAlineacion` y palabras automáticas (si la prueba sirve)
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0330
- ADRs: 0028 §3.3, 0021
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 10)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura que combina la propuesta con la letra y las casillas; palabras `auto` pintadas.

## Criterios de aceptación
- [ ] Solo fines no hechos a mano, nunca inicios, nunca palabras manuales; umbrales de la prueba; salida «solo fines».
- [ ] Las palabras `auto` se pintan y pasan a `manual` al editarlas en el editor preciso.

- [ ] (Añadido el 2026-11-23, feature 3 de 0.2.3) Si la letra tiene voces a la vez, las líneas solapadas (`solapadas`, tarea 0358) se **excluyen** de la alineación y se dice, como en «Ajustar los silencios». `aplicarAlineacion` conserva `parte`.

## Pruebas de feedback
- Unitarias: `alineacion.test.ts`; `render.test.ts` con palabras `auto`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
