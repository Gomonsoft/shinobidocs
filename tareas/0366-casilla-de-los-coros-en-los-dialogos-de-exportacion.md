# 0366 — Feature 2 · Casilla «Incluir la voz en los coros» en los diálogos de una y de varias canciones
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0353
- ADRs: 0030 §5
- Spec UX: docs/ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que el usuario decida si el video «Solo instrumental» lleva los coros.

## Criterios de aceptación
- [ ] Formulario A: casilla solo con «Solo instrumental», coros, nivel > 0 y voz separada, marcada la primera vez y recordada en `config.exportacion.coros`; con nivel 0, `exp.coros.cero` sin casilla (C2-V1, C2-V4).
- [ ] Lote (G): casilla con `exp.lote.coros` si alguna canción tiene coros (k), nota `exp.lote.nota.coros` en «Ver cuáles» (C2-V5).
- [ ] Líneas de opciones de B, C, D y H con `exp.audio.coros` cuando aplica (C2-V6).

## Pruebas de feedback
- Unitarias: Componentes de los diálogos con dobles.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
