# 0346 — Feature 1 · Funciones › «Cantantes y coros»
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0342, 0343
- ADRs: 0029 §2–§3
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1)
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
La sección de Funciones para crear y nombrar cantantes y repartir.

## Criterios de aceptación
- [ ] Sin reparto: «Repartir entre varios cantantes» (crea Cantante 2 sin líneas y lleva el foco a su nombre) y la sugerencia «Marcarlas como coro» solo si `lineasEntreParentesis` no está vacía (un paso de deshacer).
- [ ] Con reparto: nombre editable por cantante (máx. 40), recuento por parte que selecciona sus líneas, «Quitar cantante» (sus líneas a Cantante 1, sin confirmación, un paso), «+ Añadir cantante» hasta 4.
- [ ] Deja el hueco del deslizador «Voz en los coros» para 0352 (no lo implementa).
- [ ] Textos y orden de la spec 06.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: «Marcarlas como coro» con la canción de ejemplo.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
