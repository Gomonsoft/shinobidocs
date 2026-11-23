# 0351 — Feature 2 · Reproductor y ventana secundaria: la voz sube en los coros
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §1 y §3, 0011 §3
- Spec UX: docs/ux/07-reproductor.md#023--feature-2--voz-en-los-coros
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Automatizar la ganancia de la voz en `MotorReproductor`.

## Criterios de aceptación
- [x] Nivel `máx(vozGuiaEfectiva, envolvente(t))` programado en cada arranque, búsqueda, `fijarVoz`, `fijarCoros` y cambio de canción, con el mismo `when` que las fuentes (C2-R1, C2-R2, C2-R3, C2-R4).
- [x] V no silencia los coros; indicador `rep.ind.vozsilenciada.coros` en canciones con coros y nivel > 0 (C2-R5).
- [x] Ventana secundaria y cola, cada canción con su nivel (C2-R6).

## Pruebas de feedback
- Unitarias: `motorReproductor.test.ts` con `AudioContext` falso: cada criterio C2-R1 a C2-R6.
- E2E: Ninguna nueva; los críticos del reproductor siguen pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.**
- `karaoke/motorReproductor.ts`: `fijarCoros(puntos)` y `programarVoz`: la ganancia de la voz es `máx(voz guía efectiva, envolvente)`: `cancelScheduledValues` + `setValueAtTime` con el nivel del instante + `linearRampToValueAtTime` a cada punto futuro, con el anclaje de las fuentes (mismo `when`). Se reprograma en cada `arrancar` (reproducir, buscar, repetir), en `fijarVoz` y en `fijarCoros`. Sin coros (`[]`) la ganancia es el `.value` fijo de siempre y no se programa nada (test de regresión).
- `vistas/reproductor/Reproductor.tsx`: calcula `envolvente(tramosCoro(letra, duración), vozEnCoros(letra))` de la letra de la canción y se lo da al motor solo si hay puntos; como la ventana secundaria y la cola montan un `Reproductor` por entrada (`key`), cada canción usa su nivel (C2-R6). V no silencia los coros; el indicador y el anuncio dicen `rep.ind.vozsilenciada.coros` («Voz silenciada · coros al {n} %») en canciones con coros y nivel > 0 (`modelo.ts`, `textos.ts`).

**Criterios.** C2-R1 a C2-R4 en `motorReproductor.test.ts` (evalúa la curva programada del doble: 0,5 en el centro, 0 a > 450 ms, rampas lineales de 150 ms, 800 ms une / 1,2 s no, voz guía al 30 % y 80 %, buscar a mitad de un coro y pausar/reanudar, silencio previo). C2-R5 y C2-R6 en `Reproductor.test.tsx`.

**Cómo probarlo.** `npx vitest run src/renderer/src/karaoke/motorReproductor.test.ts src/renderer/src/vistas/reproductor`.

**Manual (guía de QA).** Chasquidos al entrar y salir de un coro con 3 canciones, voz guía silenciada y al 30 %; ventana secundaria con dos canciones de niveles distintos.

**Deuda.** Los tests de la secundaria usan el mismo `Reproductor`; no hay un test propio de `AppSecundaria` con coros.
