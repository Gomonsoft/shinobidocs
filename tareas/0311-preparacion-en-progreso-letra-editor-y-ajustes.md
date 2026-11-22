# 0311 — Feature 5 · Progreso, vista Letra, editor y Ajustes
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0308, 0307
- ADRs: 0025
- Spec UX: docs/ux/04-progreso-pipeline.md, 05-letra.md, 06-editor.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Lo que cuentan la vista de progreso, la vista Letra, el banner y el bloque «Preparación automática» del editor, y el interruptor de Ajustes.

## Criterios de aceptación
- [ ] Criterios de esas secciones; «Quitar esos fines» y «Quitar la corrección».

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna nueva (la de 0308).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
