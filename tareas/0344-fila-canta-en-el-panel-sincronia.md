# 0344 — Feature 1 · Panel Sincronía y riel: fila «Canta» y selección múltiple
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0343
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Panel Sincronía)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Mostrar y cambiar la parte de la línea desde el panel.

## Criterios de aceptación
- [ ] Fila «Canta» (botón de menú, `aria-haspopup="menu"`) con el chip y el menú, solo con reparto (C1-E2).
- [ ] Panel de selección múltiple: `edi.partes.seleccion`, «Varias» o el chip común y `edi.partes.seleccion.ayuda`.
- [ ] Riel del panel minimizado con el chip bajo «Fin».
- [ ] A 300 px de ancho del panel no se parte ni hay scroll horizontal (C1-E23).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: asignar desde la fila «Canta».
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
