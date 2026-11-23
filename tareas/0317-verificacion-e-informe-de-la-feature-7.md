# 0317 — Feature 7 · Verificación e informe
- Estado: Hecha con reservas (guía manual y decisión legal de las listas pendientes del usuario; 0390 sin hacer)
- Paso del pipeline: 1
- Depende de: 0313–0316, 0375, 0384, 0390
- ADRs: 0026
- Spec UX: docs/ux/03, 04 y 02 (0.2.2 · Feature 7)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 7.

## Criterios de aceptación
- [x] Informe `docs/versiones/0.2.2/informe-feature-7.md`, incluida la decisión legal de las listas.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-23. Informe: [informe-feature-7](../versiones/0.2.2/informe-feature-7.md). 33 criterios: 26 cubiertos, 4 parciales, 1 solo manual (F7-P9), 2 sin cubrir (F7-N14, F7-B3). 21 capturas en `docs/ux/revisiones/0.2.2-feature-7/`. Guía: [feature-7](../Test-manuales/0.2.2/feature-7-importacion-por-lotes.md). Preguntas: 0321 y 0323. La decisión legal de las listas queda pendiente del usuario (0159). La ruta de `filaLoteSchema` y la parada por `RUNTIME_NO_DISPONIBLE` esperan a la [0390](0390-ruta-fuera-del-contrato-del-lote-y-parada-solo-de-separaciones.md).
