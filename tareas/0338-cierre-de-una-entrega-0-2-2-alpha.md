# 0338 — Cierre de cada entrega `0.2.2-alpha.N`
- Estado: Pendiente
- Paso del pipeline: 0
- Depende de: Las verificaciones de las features que entran en esa entrega
- ADRs: 0020, 0023
- Spec UX: docs/ux/09-descarga-e-instalacion.md
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Publicar una entrega preliminar con las features cerradas hasta ese momento (cortes en el backlog).

## Criterios de aceptación
- [ ] Versión con `version:subir`, notas en `docs/versiones/0.2.2/notas/0.2.2-alpha.N.md` (incluida la pérdida al abrir con 0.2.1 y el cambio a 5 líneas), ensayo del workflow y etiqueta.
- [ ] Con la feature 3 dentro, comprobar que la entrega anterior avisa de esta.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Guía manual de las features de la entrega.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
