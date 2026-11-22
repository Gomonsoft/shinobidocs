# 0347 — Feature 1 · Estilo: «Colores de los cantantes» y avisos de contraste por parte
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0340
- ADRs: 0029 §4, 0022 §4–§5, 0016
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea (Panel Estilo › «Colores de los cantantes» y Aviso de contraste) y docs/ux/sistema-visual.md#023--varios-cantantes-y-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Elegir el color de cada ranura en el tema y avisar de contrastes malos.

## Criterios de aceptación
- [ ] Subsección «Colores de los cantantes» en D1–D4 según la spec (Cantante 1 como enlace, «Más colores», plegada en D3 sin reparto, resumen en D1/D4); cada cambio es un paso de estilo y se ve en < 100 ms (C1-E17).
- [ ] `colores_partes` con la herencia de temas; un tema sin el campo usa los predeterminados y no se reescribe (C1-E18).
- [ ] `evaluarContraste` con las tres comprobaciones del sistema visual solo para partes en uso, «Sugerir un color» (el sugerido de mayor contraste que no se parezca a otra parte en uso) y el ⓘ sin punto en la pestaña (C1-E19).
- [ ] Con los predeterminados y el tema «Shinobi» no hay ningún ⚠; si lo hubiera, propuesta al diseñador y nota en ADR 0029.

## Pruebas de feedback
- Unitarias: `contraste.test.ts` (cada regla, solo partes en uso, sugerencia), `temas.test.ts` (herencia y congelación con `colores_partes`).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
