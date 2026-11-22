# 0318 — Feature 8 · Operaciones por lotes en main
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0308
- ADRs: 0026 §4, 0016 §7, 0017
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`editarDatosVarias`, `eliminarVarias`, `colaAnadirVarias` y `colaQuitarVarias` con el patrón de «Aplicar tema».

## Criterios de aceptación
- [ ] Previsualizar con `version`, ejecutar con progreso y `CONFIRMACION_OBSOLETA`, resultado por canción.
- [ ] Eliminar cancela trabajos, preparación y exportación antes de la papelera; `EDICION_BLOQUEADA` por canción.

## Pruebas de feedback
- Unitarias: Servicios con dobles: todos los motivos.
- E2E: Ampliar `biblioteca-acciones.spec.ts`: «Eliminar…» con 3 canciones.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
