# 0343 — Feature 1 · Lista de líneas: chip, menú «¿Quién canta?», atajos y selección múltiple
- Estado: Hecha
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
**Qué se hizo.** Asignar partes desde la lista, con ratón y con teclado.
- Lista: `ListaLineas.tsx` con chip de parte (`ChipParte.tsx`: inicial, «( )» o icono `users`, borde de 2 px en el color de la parte; solo con `tieneReparto`), texto del coro entre paréntesis y en `texto-2`, `aria-multiselectable`, `aria-selected` en todas las seleccionadas y `aria-current` en la principal (con varias), nombre de fila con «Canta: {parte}», Ctrl/Cmd + clic, Mayús + clic y Mayús + ↑/↓, ítem «¿Quién canta?… (C)» tras «Editor preciso» del menú contextual. Clic secundario sobre una fila ya seleccionada conserva la selección (pregunta 0340).
- Menú: `MenuQuienCanta.tsx` (propio, no `MenuContextual`, porque 1–4, T, C y A son teclas de elección y no de búsqueda por letra) con las variantes de un cantante, dueto (Todos al final, tras separador) y 3 o más (Todos junto a los cantantes), ✓ con la parte común (`menuitemradio`), «+ Añadir cantante» (crea y asigna en un paso) y «Nombres de los cantantes…» (solo abre Funciones). Lo abren el chip, el menú contextual, la tecla C y la fila «Canta».
- Atajos: `atajos.ts` suma C, Alt + 1…4 por `KeyboardEvent.code` (sin Ctrl ni Cmd: AltGr no cuenta; Opción en macOS cambia `key`), Alt + ↑/↓ (foco en lista o región) y `mover_seleccion` con `extender`. No actúan en campos de texto, en el editor preciso, al ritmo ni con la sesión bloqueada (`useSesion().edicionBloqueada`). Anuncios `edi.partes.anuncio`, `.nuevo` y `.noExiste` en la región `aria-live` del editor.
- Chip de solo lectura en la barra de título del editor preciso (`EditorPreciso.tsx`, prop `chipParte`; `preciso/` no era de este lote pero la tarea lo pide), en la tarjeta de la revisión y en el riel de la lista minimizada; tooltips de tiempos con `edi.partes.soloPrincipal` (cabecera de la lista y riel); diálogo de atajos con las filas nuevas.
- `partes.ts` reúne los textos `edi.partes.*` (`P`) y los cálculos puros (`etiquetaParte`, `partesEnOrden`, `parteVecina`, `parteComun`).

**Archivos clave.** `vistas/editor/`: `ListaLineas.tsx`, `ChipParte.tsx`, `MenuQuienCanta.tsx`, `partes.ts`, `atajos.ts`, `Editor.tsx`, `DialogoAtajos.tsx`, `RielLista.tsx`, `revision/TarjetaRevision.tsx`, `preciso/EditorPreciso.tsx`, `editor.module.css`. E2E escrita **sin ejecutar**: `app/e2e/editor-reparto.spec.ts` (necesita que main 0341 escriba `parte` y `partes`).

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/{Editor.reparto,MenuQuienCanta,Rieles.reparto,atajos,estado.reparto}`. A mano: abrir una canción con reparto (`npm run semilla -- --reparto`), seleccionar tres líneas con Mayús + clic, C › 2, deshacer; Alt + 1…4 con teclado español y estadounidense y Opción en macOS; el menú con lector de pantalla.

**Para 0345 (carriles).** `data-foco-editor="region"` es el valor que `atajos.ts` ya reconoce (`FocoEditor`) para que Alt + ↑/↓ y Mayús + ↑/↓ actúen con el foco en una región; hoy las regiones de `PistaSincronia` llevan `segmentado`. `abrirMenuPartes(ancla, origen)` y `asignarParte(parte, agrupar)` viven en `Editor.tsx`: pasarlas a la pista como props. Orden de Alt + ↑/↓: `partesEnOrden(letra)`. Esc: dejar el hueco del arrastre antes de «solo principal» en el caso `escapar` de `Editor.tsx`. Las etiquetas de carril reutilizan `ChipParte`.

**Para 0346 (Funciones).** «Nombres de los cantantes…» llama hoy a `expandirEnFunciones()`; falta llevar el foco al nombre del primer cantante de la selección. Textos `edi.partes.*` ya en `partes.ts` (faltan los propios de la sección: recuento, quitar, máximo, sugerencia de coro). `estilo/ChipParte.tsx` (lote de Estilo) duplica en parte a `ChipParte.tsx`.

**Deuda.** Chip de la lista como `<span aria-hidden>` con clic (pregunta 0340, punto 1). Anchos a 256 px (lista) y 300 px (panel) sin medir (C1-E23): CSS preparado (columna del chip de 40 px, `min-width: 0` y elipsis), sin comprobar en pantalla.
