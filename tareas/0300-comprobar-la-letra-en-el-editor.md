# 0300 — Feature 4 · «Comprobar la letra con la voz» en el editor
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0297, 0296
- ADRs: 0024, 0018 §6.2
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Acción de la pestaña Funciones con la letra en memoria, corrección y «Quitar la corrección» en un paso de deshacer.

## Criterios de aceptación
- [ ] Lectura del nivel base con `picos.leer` (como «Ajustar los silencios»).
- [ ] Acciones del reducer y guardado de `offset_ms` y `desfase_corregido_ms`.
- [ ] Criterios de la spec 06 · Feature 4.

## Pruebas de feedback
- Unitarias: `estado.test.ts` (un paso, deshacer y rehacer) y componente.
- E2E: Ampliar `editor.spec.ts` con una letra desplazada y picos generados.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
