# 0346 — Feature 1 · Funciones › «Cantantes y coros»
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0342, 0343
- ADRs: 0029 §2–§3
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Funciones › «Cantantes y coros»)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
La sección de Funciones para crear, nombrar y quitar cantantes y sugerir coros.

## Criterios de aceptación
- [ ] Sección tras «Ajustar los silencios» en el orden de la spec; con un cantante, «Repartir entre varios cantantes» (crea el Cantante 2 sin líneas y lleva el foco a su nombre) (C1-E8).
- [ ] Con varios: nombre (40 caracteres, contador desde 30, Esc devuelve el anterior, un paso por edición), recuento que selecciona y lleva a la vista, [✕] con toast `edi.partes.quitado` y [Deshacer], «+ Añadir cantante» y `edi.partes.maximo` con 4 (C1-E9, C1-E10, C1-E11).
- [ ] «Marcarlas como coro» solo con líneas enteras entre paréntesis sin marcar; un paso; la sugerencia desaparece (C1-E12).
- [ ] Deja el sitio de «Voz en los coros» para 0365; a 300 px no se parte (C1-E23).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: «Marcarlas como coro» con la canción de ejemplo.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** Sección `SeccionCantantes.tsx` en Funciones, tras «Ajustar los silencios» (`PanelFunciones.tsx`, prop `cantantes`).
- Un cantante: ayuda, «Repartir entre varios cantantes» (crea el Cantante 2 sin líneas y enfoca su nombre) y la sugerencia de coros. Varios: una fila por parte (chip, nombre de 40 caracteres con contador desde 30 —Intro o salir guarda, Esc devuelve—, recuento que selecciona las líneas y lleva la primera a la vista, [✕] con toast `edi.partes.quitado` y [Deshacer]), Todos (con 3 o más, o con líneas), Coro, «+ Añadir cantante» o `edi.partes.maximo`. «Marcarlas como coro» solo con líneas enteras entre paréntesis sin marcar; un paso.
- «Nombres de los cantantes…» del menú ya enfoca el nombre del primer cantante de la selección (pregunta 0340 n.º 6; foco por `pedirFocoNombre` en `Editor.tsx`).
- **Sitio de «Voz en los coros» (0365)**: la prop `vozEnCoros?: ReactNode` de `SeccionCantantes` se pinta al final de la sección (tras una separación); hoy no se pasa nada. Debe mostrarse solo si hay coros (`recuentoPorParte(letra).coro > 0`) y tras un separador cuando haya varios cantantes.
- Deuda de la tanda anterior: `estilo/ChipParte.tsx` eliminado; `ChipParte.tsx` admite `color` explícito y lo usan `PanelEstilo.tsx` y `estilo/SeccionColoresPartes.tsx`.

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/Editor.reparto`. E2E sin ejecutar: «Marcarlas como coro» en `e2e/editor-reparto.spec.ts`.

**Deuda.** Anchos a 300 px sin medir en pantalla (CSS con `minmax(0, 1fr)`).
