# 0362 — Feature 1 · Vista Letra: aviso al sustituir y resumen con reparto
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0341
- ADRs: 0029 §2
- Spec UX: docs/ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Que la vista Letra no pierda el reparto sin decirlo.

## Criterios de aceptación
- [ ] Con reparto, el diálogo de sustituir la letra añade `let.dialogo.sustituir.reparto` y el resumen de C la línea `let.actual.reparto` (C1-L2, interfaz).
- [ ] En una canción sin reparto, el diálogo y el resumen no cambian (C1-L3).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
