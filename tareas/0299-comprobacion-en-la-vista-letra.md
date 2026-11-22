# 0299 — Feature 4 · Comprobación en la vista Letra
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0298
- ADRs: 0024
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Mostrar el veredicto por candidato, aplicar la corrección al elegir y los estados de los picos.

## Criterios de aceptación
- [ ] Todo lo de la spec 05 · Feature 4 con su microcopy, con el desfase mínimo de 0,5 s y 5 líneas (ADR 0024; ver nota de la pregunta 0153).
- [ ] Al elegir un candidato `desfasada`, la letra se guarda con la corrección.

## Pruebas de feedback
- Unitarias: Componentes con dobles (los cinco veredictos, generando, error).
- E2E: Escenario de la tarea 0298.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
