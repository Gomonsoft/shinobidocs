# 0337 — Feature 11 · Verificación, calibración e informe
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0334–0336, 0370
- ADRs: 0024
- Spec UX: docs/ux/06 y 02 (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 11.

## Criterios de aceptación
- [ ] Calibración con `calibrar-dudosas.ts` sobre las canciones del usuario (≤ 10 % en las revisadas).
- [ ] Informe `docs/versiones/0.2.2/informe-feature-11.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
