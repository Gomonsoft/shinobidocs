# 0322 — Feature 8 · Verificación e informe
- Estado: Hecha con reservas (guía manual pendiente del usuario; defectos en la pregunta 0321)
- Paso del pipeline: 6
- Depende de: 0318–0321, 0388
- ADRs: 0026
- Spec UX: docs/ux/02 y 10 (0.2.2 · Feature 8)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 8.

## Criterios de aceptación
- [x] Informe `docs/versiones/0.2.2/informe-feature-8.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-23. Informe: [informe-feature-8](../versiones/0.2.2/informe-feature-8.md). 24 criterios: 19 cubiertos, 5 parciales. 17 capturas en `docs/ux/revisiones/0.2.2-feature-8/`. Guía: [feature-8](../Test-manuales/0.2.2/feature-8-acciones-por-lotes.md). Defectos: el resultado de «Eliminar…» pierde los títulos y el recuento de «Preparar» no coincide (0321).
