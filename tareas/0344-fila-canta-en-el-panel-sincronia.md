# 0344 — Feature 1 · Panel Sincronía y riel: fila «Canta» y selección múltiple
- Estado: Hecha
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
**Qué se hizo.** Fila «Canta» y selección múltiple en el panel Sincronía y chip en el riel.
- `BotonCanta.tsx`: botón de menú (`aria-haspopup="menu"`, `aria-expanded`, nombre «Canta: {parte}») con el chip, el nombre y un chevron; en el riel del panel minimizado es solo el chip (con tooltip), bajo «Fin». Sin `abrir` (al ritmo, sesión bloqueada) queda `aria-disabled`.
- `PanelSincronia.tsx`: con reparto, fila «Canta» bajo el texto de la línea. Con varias seleccionadas, el encabezado pasa a «N líneas seleccionadas», la fila muestra el chip común o «Varias» y aparece `edi.partes.seleccion.ayuda` con el número de la principal; los controles de abajo son los de la principal. Sin reparto no hay fila (sí el encabezado y la ayuda de la selección múltiple).
- `RielPanel.tsx`: prop `canta`. Pulsar de nuevo el botón que abrió el menú lo cierra; al elegir, el foco vuelve al botón.

**Archivos clave.** `vistas/editor/BotonCanta.tsx`, `PanelSincronia.tsx`, `RielPanel.tsx`, `editor.module.css`, `Editor.reparto.test.tsx`, `Rieles.reparto.test.tsx`. E2E escrita sin ejecutar: segundo caso de `app/e2e/editor-reparto.spec.ts`.

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/{Editor.reparto,Rieles.reparto}`.

**Deuda.** Medir a 300 px de ancho del panel que no se parte ni hay scroll horizontal (C1-E23): CSS con `min-width: 0` y elipsis, sin comprobar en pantalla.
