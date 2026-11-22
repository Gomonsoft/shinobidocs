# 0344 — Feature 1 · Panel Sincronía y riel: fila «Canta» y selección múltiple
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0343
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Mostrar y cambiar la parte de la línea desde el panel.

## Criterios de aceptación
- [ ] Fila «Canta» con el chip y su menú bajo el texto de la línea (solo con reparto); con varias seleccionadas, el panel de selección múltiple de la spec («Varias» o el chip común, y la nota de que los tiempos son de la principal).
- [ ] Riel del panel minimizado con el chip bajo «Fin».
- [ ] Sin cambios en el panel de una canción sin reparto.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts` si la spec lo pide.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
