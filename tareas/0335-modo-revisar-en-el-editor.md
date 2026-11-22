# 0335 — Feature 11 · Modo «Revisar» en el editor
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0334
- ADRs: 0024
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 11)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Recorrido, marcas fuera del recorrido, «Está bien», «Fin al final de la voz» y fin del recorrido.

## Criterios de aceptación
- [ ] Criterios de la spec 06 · Feature 11; «Está bien» entra en el historial; «Fin al final de la voz» con `soloIds`.

## Pruebas de feedback
- Unitarias: Reducer y componentes.
- E2E: Ampliar `editor.spec.ts` con una canción con dos líneas dudosas.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
