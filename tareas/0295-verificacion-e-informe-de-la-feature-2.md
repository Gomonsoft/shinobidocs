# 0295 — Feature 2 · Verificación, capturas e informe
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0293, 0294
- ADRs: 0022
- Spec UX: docs/ux/07-reproductor.md (F2-R9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 2.

## Criterios de aceptación
- [ ] Capturas F2-R9.
- [ ] Informe `docs/versiones/0.2.2/informe-feature-2.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
