# 0361 — Feature 3 · Verificación e informe (Voces a la vez, o cierre sin ella)
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0356 y, si sirve, 0357–0360
- ADRs: 0029 §7
- Spec UX: docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto y docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cerrar la feature 3 de 0.2.3.

## Criterios de aceptación
- [ ] Si la prueba no sirve: informe `docs/versiones/0.2.3/informe-feature-3.md` con el resultado y la propuesta 037 pasada a «Aplazada».
- [ ] Si sirve (es el caso, 2026-11-23): capturas en `docs/ux/revisiones/0.2.3-feature-3/`, informe con el CI del PR borrador y lo que pasa a la guía manual (dúo real con frases cruzadas, en el reproductor y en el video).
- [ ] El informe incluye el texto para las notas de la versión sobre la compatibilidad (pregunta 0365: una canción con solapes se ve dañada en versiones anteriores, sin perder nada) y el resultado de la medida repetida con la 0364 real (0360).

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Recoger el CI del PR borrador y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
