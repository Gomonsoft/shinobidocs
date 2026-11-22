# 0301 — Feature 4 · Verificación, calibración e informe
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0297–0300
- ADRs: 0024
- Spec UX: docs/ux/05-letra.md y 06-editor.md (0.2.2 · Feature 4)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 4 y repetir la calibración.

## Criterios de aceptación
- [ ] Script de solo lectura (fuera del repositorio o en `app/scripts/`, sin letras en el repositorio) que repite la tabla de ADR 0024 con las canciones del usuario y negativos fabricados; constantes ajustadas si hace falta, con nota en el ADR.
- [ ] Informe `docs/versiones/0.2.2/informe-feature-4.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
