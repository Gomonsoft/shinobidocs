# 0308 — Feature 5 · `ServicioPreparacion`: cadena, elección automática y fines prudentes
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0307, 0298, 0306, 0302 (usa `metadatos.origen` para el álbum de LRCLIB)
- ADRs: 0025 §2–§3, 0024, 0018 §6
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Feature 5)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La máquina de estados por canción que lleva un borrador a «Lista para revisar».

## Criterios de aceptación
- [ ] Pasos y fallos de la tabla de ADR 0025 §2; elección automática con los cuatro criterios de §3.
- [ ] `shared/silencios.ts`: `proponerAjusteSilencios` gana los parámetros `soloIds`, `soloFinesAutomaticos` y `activarComodin` (ADR 0018, revisión 0.2.2); la preparación la usa con `soloFinesAutomaticos: true`, `activarComodin: false` y `origen_fin: "preparacion"`.
- [ ] Se detiene con cancelar, eliminar, edición del usuario o `EDICION_BLOQUEADA`; recuento de dudosas al terminar (si la tarea 0334 no está, 0).
- [ ] Canales `preparacion.previsualizar`, `preparar`, `cancelar` y evento `preparacion:cambio`.

## Pruebas de feedback
- Unitarias: Main con dobles (LRCLIB, gestor, picos): cada transición, ambigüedad, nunca sustituir una letra, `intacta`.
- E2E: Una secundaria: añadir un WAV con el doble de LRCLIB y el separador falso hasta «Lista para revisar».
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
