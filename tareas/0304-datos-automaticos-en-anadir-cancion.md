# 0304 — Feature 6 · Datos automáticos en «Añadir canción»
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0303
- ADRs: 0025 §6
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 6)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Autocompletado, unificación «¿Te refieres a…?» y procedencia bajo cada campo.

## Criterios de aceptación
- [ ] Criterios de la spec 03 · Feature 6.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `importar-archivo.spec.ts` con un archivo etiquetado.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
