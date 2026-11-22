# 0356 — Feature 3 · Prueba técnica de voces a la vez
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0340 (puede empezar en cuanto exista; no toca código de producción)
- ADRs: 0029 §7, 0022, 0006
- Spec UX: — (ADR 0029 §7); diseño condicionado en docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto y docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Decidir con un criterio cerrado de antemano si las voces a la vez entran en 0.2.3.

## Criterios de aceptación
- [ ] Todo en `docs/spikes/0029-voces-a-la-vez/` (sin código de producción y **sin letras reales**: letra inventada; un dúo real solo si el usuario lo anota y aporta, y en el informe solo van cifras).
- [ ] Criterio 1 de ADR 0029 §7: la regla «inicios crecientes en toda la letra + fin por parte» con los tres patrones de las referencias; las pruebas existentes no cambian sin solapes.
- [ ] Criterio 2: captura de un fotograma de exportación a 1920 × 1080 con 3 zonas activas ≤ 1,25 × la de 0.2.2 con 5 líneas; además, a 60 FPS con 4 zonas no se pierden fotogramas en el equipo de referencia (C1S-R3).
- [ ] Criterio 3: comportamiento definido y probado con solapes de «Ajustar los silencios», encaje, dudosas, alineación y `.lrc`.
- [ ] Resultado en ADR 0029 («Resultado de la prueba técnica de voces a la vez») con «sirve» o «no sirve» y, si sirve, ajustes a 0357–0360.

## Pruebas de feedback
- Unitarias: Las del prototipo, dentro de `docs/spikes/`.
- E2E: Ninguna.
- Críticos: no
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
