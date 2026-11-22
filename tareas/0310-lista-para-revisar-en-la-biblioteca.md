# 0310 — Feature 5 · «Lista para revisar», bandeja de pendientes y «Probar» en la Biblioteca
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0306, 0308
- ADRs: 0025
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Insignia, línea de paso, bandeja, «Preparar» de una canción, «Probar» y avisos de reanudación.

## Criterios de aceptación
- [ ] Criterios de la spec 02 · Feature 5.
- [ ] «Probar» abre el reproductor local con la canción guardada (ADR 0025 §1).

## Pruebas de feedback
- Unitarias: Componentes con la semilla ampliada.
- E2E: Ampliar `biblioteca.spec.ts` con la semilla nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
