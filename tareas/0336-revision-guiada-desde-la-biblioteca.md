# 0336 — Feature 11 · Revisión guiada desde la Biblioteca
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0334, 0335, 0310
- ADRs: 0024
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
«Revisar» desde la tarjeta, la vista de progreso y los toasts; marcar como lista desde la Biblioteca.

## Criterios de aceptación
- [ ] Parámetro de navegación `revisar: true`; `biblioteca.marcarLista` desde el menú ⋯ y el toast tras «Probar».

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: Ninguna nueva.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
