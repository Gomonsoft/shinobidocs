# 0359 — Feature 3 · Editor: regiones solapadas en carriles distintos
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0357, 0345
- ADRs: 0029 §7
- Spec UX: docs/ux/06-editor.md (0.2.3 · Voces a la vez, sección condicionada)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Editar tiempos de líneas que se solapan con otra parte.

## Criterios de aceptación
- [ ] Regiones de carriles distintos pueden solaparse; los tiradores respetan solo a las vecinas de su carril; «Juntar carriles» las dibuja de forma que se distingan (spec).
- [ ] La lista sigue en orden de inicio; el modo «Sincronizar al ritmo» no cambia; criterios de la sección condicionada de la spec 06.

## Pruebas de feedback
- Unitarias: Componentes de la pista con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: alargar el fin de una línea sobre el inicio de la de otra parte.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
