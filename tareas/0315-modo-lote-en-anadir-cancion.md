# 0315 — Feature 7 · Modo lote en «Añadir canción»
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0314, 0304
- ADRs: 0026
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Tabla editable, acciones de columna, resumen y confirmación.

## Criterios de aceptación
- [ ] Criterios de la spec 03 · Feature 7 (teclado y lectores de pantalla incluidos).
- [ ] Texto nuevo de `URL_NO_SOPORTADA` (`add.error.URL_NO_SOPORTADA` de la spec 03: «Este enlace no se puede usar. Los directos, los canales y las mezclas automáticas…») en `shared/avisos.ts`, `vistas/progreso/textos.ts` y `vistas/biblioteca/textosError.ts`, en el mismo cambio que admite las listas (pregunta 0166 §6; antes diría algo falso).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: La de 0314.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
