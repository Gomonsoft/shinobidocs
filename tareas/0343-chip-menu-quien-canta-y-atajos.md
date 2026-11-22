# 0343 — Feature 1 · Lista de líneas: chip, menú «¿Quién canta?», tecla C y selección múltiple
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0342
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Asignar partes desde la lista, con ratón y con teclado.

## Criterios de aceptación
- [ ] Criterios de la spec 06 · 0.2.3 · Feature 1 para la lista: chip de parte (solo con reparto), texto del coro entre paréntesis dibujados, menú «¿Quién canta?» desde el chip, el menú contextual («¿Quién canta?… (C)») y la tecla C, con 1–4, T y C dentro del menú.
- [ ] Selección múltiple: Ctrl/Cmd + clic, Mayús + clic y Mayús + ↑/↓ (saltando pausas); `aria-multiselectable` y la principal con `aria-current`.
- [ ] `Alt + 1…4` por `KeyboardEvent.code` sin Ctrl ni Cmd; ningún atajo nuevo actúa en campos de texto ni en la ventana del editor preciso.
- [ ] Anuncio por asignación y foco de vuelta en la fila principal.
- [ ] Una canción sin reparto se ve igual que en 0.2.2 (salvo el ítem del menú contextual).

## Pruebas de feedback
- Unitarias: Componentes con dobles: chip, menú, atajos (incluidos Opción en macOS y AltGr simulados por `code`).
- E2E: `e2e/editor-reparto.spec.ts` (nueva): con la canción de ejemplo, asignar con C › 2 tres líneas seleccionadas, deshacer, y comprobar que se guarda.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
