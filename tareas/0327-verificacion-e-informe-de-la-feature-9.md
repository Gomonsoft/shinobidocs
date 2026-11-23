# 0327 — Feature 9 · Verificación e informe
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0323–0326, 0376
- ADRs: 0027
- Spec UX: docs/ux/02, 06 y 08 (0.2.2 · Feature 9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 9.

## Criterios de aceptación
- [ ] Informe `docs/versiones/0.2.2/informe-feature-9.md`, incluida la decisión legal del paquete con audio.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
