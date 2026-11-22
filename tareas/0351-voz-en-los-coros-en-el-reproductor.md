# 0351 — Feature 2 · Reproductor y ventana secundaria: la voz sube en los coros
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §1 y §3, 0011 §3
- Spec UX: docs/ux/07-reproductor.md (0.2.3 · Feature 2)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Automatizar la ganancia de la voz en `MotorReproductor`.

## Criterios de aceptación
- [ ] Nivel `máx(vozGuiaEfectiva, envolvente(t))` programado con `cancelScheduledValues`, `setValueAtTime` y `linearRampToValueAtTime` en cada arranque, búsqueda, `fijarVoz`, `fijarCoros` y cambio de canción, con el mismo `when` que las fuentes.
- [ ] Silenciar la voz guía no silencia los coros; indicador de V con el texto de la spec en canciones con coros.
- [ ] Igual en la ventana secundaria y en la cola de la sesión, con el nivel de cada canción.

## Pruebas de feedback
- Unitarias: `motorReproductor.test.ts` con `AudioContext` falso: sucesos al arrancar, al buscar dentro de un coro, con voz guía silenciada y al 100 %.
- E2E: Ninguna nueva; los críticos del reproductor siguen pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
