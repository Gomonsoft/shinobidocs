# 0325 — Feature 9 · Leer, importar y restaurar
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0324
- ADRs: 0027 §3
- Spec UX: docs/ux/02-biblioteca.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 9)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`copias.leer` e `importar` con validación, conflictos, temas y canciones sin audio.

## Criterios de aceptación
- [ ] Solo entradas declaradas; `validateFileName`/`validateEntrySizes`; `.importando/` y `rename`.
- [ ] Conflictos, temas y ajustes de ADR 0027 §3; borrador con fuente pendiente sin audio.
- [ ] Códigos `PAQUETE_*` y `CANCION_MAS_NUEVA`.

## Pruebas de feedback
- Unitarias: Ida y vuelta y cada caso de error de ADR 0027 §8.
- E2E: Ninguna (la de 0326).
- Críticos: sí
- Manual: Restaurar la biblioteca real en otro usuario del sistema.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
