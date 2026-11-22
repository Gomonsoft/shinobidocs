# 0346 — Feature 1 · Funciones › «Cantantes y coros»
- Estado: Pendiente
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
(las rellena el programador al terminar)
