# 0354 — Feature 2 · Verificación e informe (Voz en los coros)
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0350–0353
- ADRs: 0030
- Spec UX: docs/ux/06-editor.md, 07-reproductor.md y 10-exportacion.md (0.2.3 · Feature 2)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cerrar la feature 2 de 0.2.3.

## Criterios de aceptación
- [ ] Informe `docs/versiones/0.2.3/informe-feature-2.md` con el CI del PR borrador, los criterios y los valores finales de las constantes de `coros.ts` si la guía manual pide cambiarlos (con nota en el ADR 0030).
- [ ] Lo que pasa a la guía manual: chasquidos con 3 canciones con coros, voz guía silenciada y al 100 %, buscar a mitad de un coro, ventana secundaria, video «Solo instrumental» con y sin la casilla, memoria del editor con una canción de 10 min.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Recoger el resultado del CI del PR borrador y la guía manual de QA; la regresión completa en local no es parte de la tarea.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
