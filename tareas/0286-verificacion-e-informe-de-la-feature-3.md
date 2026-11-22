# 0286 — Feature 3 · Verificación, capturas e informe
- Estado: Pendiente
- Paso del pipeline: 0
- Depende de: 0284, 0285
- ADRs: 0023
- Spec UX: docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 3)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 3.

## Criterios de aceptación
- [ ] Criterios de aceptación de las specs 08 y 09 (Feature 3) comprobados o anotados.
- [ ] Capturas que pida la spec, si las pide.
- [ ] Informe en `docs/versiones/0.2.2/informe-feature-3.md` con el resultado del CI y lo que pasa a la guía manual.
- [ ] Pregunta 0037 enlazada como cerrada.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
