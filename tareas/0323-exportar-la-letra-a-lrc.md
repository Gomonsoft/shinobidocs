# 0323 — Feature 9 · Exportar la letra a `.lrc`
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0296
- ADRs: 0027 §4, 0005
- Spec UX: docs/ux/06-editor.md y 02-biblioteca.md (0.2.2 · Feature 9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura, canales y entradas en el editor y en el menú ⋯.

## Criterios de aceptación
- [ ] `exportarLrc` con las reglas de ADR 0027 §4; `letras.exportarLrc({ cancionId })` y `letras.exportarLrcVarias({ ids })` abren el diálogo del sistema dentro de la llamada (`null` si se cancela) y `letras.mostrarEnCarpeta({ ubicacionId })` para el toast (ADR 0027, revisión 2026-11-22; pregunta 0166 §4).
- [ ] Ida y vuelta con el importador.

## Pruebas de feedback
- Unitarias: `lrc.test.ts`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
