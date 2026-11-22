# 0317 — Feature 7 · Verificación e informe
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0313–0316
- ADRs: 0026
- Spec UX: docs/ux/03, 04 y 02 (0.2.2 · Feature 7)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 7.

## Criterios de aceptación
- [ ] Informe `docs/versiones/0.2.2/informe-feature-7.md`, incluida la decisión legal de las listas.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
