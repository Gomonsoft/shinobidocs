# 0332 — Feature 10 · «Sincronizar con la voz» en el editor, Ajustes y la preparación (si la prueba sirve)
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0331, 0308
- ADRs: 0028
- Spec UX: docs/ux/06-editor.md, 08-ajustes-y-acerca.md y 04-progreso-pipeline.md (0.2.2 · Feature 10)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Flujo completo de la spec con sus tres salidas y el paso de la preparación.

## Criterios de aceptación
- [ ] Criterios de esas secciones.

## Pruebas de feedback
- Unitarias: Componentes y reducer (un paso de deshacer, propuesta obsoleta).
- E2E: Ampliar `editor.spec.ts` con el doble del comando.
- Críticos: sí
- Manual: Una canción real lenta y la rápida.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
