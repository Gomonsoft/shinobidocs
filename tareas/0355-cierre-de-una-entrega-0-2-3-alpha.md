# 0355 — Cierre de cada entrega `0.2.3-alpha.N`
- Estado: Pendiente
- Paso del pipeline: 0
- Depende de: Las verificaciones de las features que entran en esa entrega (0349, 0354 y, si entra, 0361)
- ADRs: 0020, 0023
- Spec UX: docs/ux/09-descarga-e-instalacion.md
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Publicar una entrega preliminar con las features cerradas hasta ese momento.

## Criterios de aceptación
- [ ] Versión con `version:subir`, notas en `lanzamientos/notas/0.2.3/0.2.3-alpha.N.md` (incluida la pérdida del reparto si se guarda la canción con 0.2.1, que 0.2.2 lo conserva y, si entra la feature 3, qué ve 0.2.2 de una canción con solapes), ensayo del workflow y etiqueta.
- [ ] La entrega anterior avisa de esta (feature 3 de 0.2.2).

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Guía manual de las features de la entrega.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
