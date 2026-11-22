# 0354 — Feature 2 · Verificación e informe (Voz en los coros)
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0350–0353, 0365, 0366
- ADRs: 0030
- Spec UX: docs/ux/06-editor.md#023--feature-2--voz-en-los-coros, docs/ux/07-reproductor.md#023--feature-2--voz-en-los-coros y docs/ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cerrar la feature 2 de 0.2.3.

## Criterios de aceptación
- [ ] Capturas de C2-E8 y C2-V7 en `docs/ux/revisiones/0.2.3-feature-2/`.
- [ ] Informe `docs/versiones/0.2.3/informe-feature-2.md` con el CI del PR borrador, los criterios y los valores finales de las constantes de `coros.ts` si la guía manual pide cambiarlos (con nota en ADR 0030).
- [ ] Lo que pasa a la guía manual: chasquidos con 3 canciones (0, 50 y 100 % en el editor; sin voz guía y al 30 % en el reproductor), ventana secundaria, video con y sin la casilla en un reproductor externo, memoria del editor con 10 min.

## Pruebas de feedback
- Unitarias: —
- E2E: Spec opcional de capturas (`SHINOBI_CAPTURAS_023_2=1`).
- Críticos: sí
- Manual: Recoger el CI del PR borrador y la guía manual de QA; la regresión completa en local no es parte de la tarea.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
