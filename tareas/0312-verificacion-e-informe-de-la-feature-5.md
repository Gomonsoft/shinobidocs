# 0312 — Feature 5 · Verificación e informe
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0306–0311
- ADRs: 0025
- Spec UX: docs/ux/02, 04, 05, 06 y 08 (0.2.2 · Feature 5)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 5.

## Criterios de aceptación
- [ ] Con la biblioteca del usuario: `npm run calibrar:encaje -- <carpeta> --variantes` (tarea 0371) y decisión sobre los fines prudentes con el criterio de la pregunta 0222, anotada en el informe y en ADR 0025. También el número de canciones que caen en «Elige la letra» en una preparación real.
- [ ] Incluye F6-N7 y F6-N8 de la spec 03 (álbum desde LRCLIB y aviso de búsqueda automática en «Añadir canción»), que pasaron de la feature 6 (pregunta 0220).
- [ ] Preparar los 5 borradores reales del usuario (guía).
- [ ] Informe `docs/versiones/0.2.2/informe-feature-5.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
