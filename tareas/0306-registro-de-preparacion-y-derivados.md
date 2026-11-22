# 0306 — Feature 5 · `cancion.preparacion`, estado derivado y resumen
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0296
- ADRs: 0025 §1
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 5)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Esquema del registro de preparación y el estado derivado «Lista para revisar».

## Criterios de aceptación
- [ ] `preparacion` opcional con la forma de ADR 0025 §1; `estadoPreparacion` en `shared/derivados.ts`.
- [ ] Resumen de la Biblioteca con `preparacion` y recuentos de la bandeja.
- [ ] `revisada` se pone en los casos de la spec; `eleccion.por` pasa a `usuario` si el usuario elige otra letra.

## Pruebas de feedback
- Unitarias: `derivados.test.ts`, esquema con copia congelada del de 0.2.1, resumen.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
