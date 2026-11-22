# 0321 — Feature 8 · Diálogo y actividad de «Exportar varias canciones»
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0319, 0320
- ADRs: 0026 §5
- Spec UX: docs/ux/10-exportacion.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Diálogo con carpeta, fila única en actividad y resultado.

## Criterios de aceptación
- [ ] Criterios de la spec 10 · Feature 8.

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: Ampliar `exportacion.spec.ts`: 2 canciones a 640 × 480 a una carpeta temporal.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
