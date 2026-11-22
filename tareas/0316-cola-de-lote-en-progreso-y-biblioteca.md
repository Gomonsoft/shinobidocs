# 0316 — Feature 7 · Cola de preparación de un lote en el progreso y la Biblioteca
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0309, 0315
- ADRs: 0026, 0025 §5
- Spec UX: docs/ux/04-progreso-pipeline.md y 02-biblioteca.md (0.2.2 · Feature 7)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Tanda, pausa, paradas y «Reintentar las fallidas» en la interfaz.

## Criterios de aceptación
- [ ] Criterios de esas secciones.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
