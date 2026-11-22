# 0343 — Feature 1 · Lista de líneas: chip, menú «¿Quién canta?», atajos y selección múltiple
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0342
- ADRs: 0029 §5
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Lista de líneas, Menú «¿Quién canta?», Atajos, Estados, Accesibilidad)
- Tamaño: L
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Asignar partes desde la lista, con ratón y con teclado.

## Criterios de aceptación
- [ ] Chip de parte con `inicial` (solo con reparto), texto del coro entre paréntesis dibujados en `texto-2`, chip en la lista minimizada (C1-E23).
- [ ] Menú «¿Quién canta?» con sus variantes (un cantante, dueto, 3 o más), abierto desde el chip, el menú contextual («¿Quién canta?… (C)») y la tecla C, con 1–4, T, C y A dentro; «+ Añadir cantante» crea y asigna en un paso (C1-E2, C1-E5, C1-E7).
- [ ] Selección múltiple: Ctrl/Cmd + clic, Mayús + clic y Mayús + ↑/↓ saltando pausas; `aria-multiselectable`, `aria-selected` y la principal con `aria-current`; tooltips de tiempos con `edi.partes.soloPrincipal` (C1-E3, C1-E20).
- [ ] `Alt + 1…4` por `KeyboardEvent.code` sin Ctrl ni Cmd, con `edi.partes.noExiste`; `Alt + ↑/↓` en la lista según el orden de los carriles visibles (pulsaciones en menos de 1 s = un paso) (C1-E6, C1-E2).
- [ ] Ningún atajo nuevo actúa en campos de texto, en el editor preciso, en el modo «Sincronizar al ritmo» ni con la sesión bloqueada; selección múltiple, menú y arrastre inactivos en el modo al ritmo (C1-E21).
- [ ] Chip de solo lectura en la barra de título del editor preciso y en la tarjeta de la revisión guiada; atajos nuevos en el diálogo de atajos.
- [ ] Anuncios `edi.partes.anuncio` y `edi.partes.anuncio.nuevo`; una canción sin reparto se ve igual que en 0.2.2 salvo el ítem del menú contextual (C1-E1).

## Pruebas de feedback
- Unitarias: Componentes con dobles: chip, menú (tres variantes), selección, atajos (Opción en macOS y AltGr simulados por `code`).
- E2E: `e2e/editor-reparto.spec.ts` (nueva): asignar con C › 2 tres líneas seleccionadas, deshacer y comprobar que se guarda.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
