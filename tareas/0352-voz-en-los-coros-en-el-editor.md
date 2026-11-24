# 0352 — Feature 2 · Editor: pista «instrumental con coros» en el motor de audio
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0350
- ADRs: 0030 §4, 0010
- Spec UX: docs/ux/06-editor.md#023--feature-2--voz-en-los-coros (Pista derivada en el editor)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Oír en la vista previa con «Instrumental» lo que oirá el público.

## Criterios de aceptación
- [x] Pista derivada `instrumental_coros` calculada en un Web Worker (`Float32Array` transferidos), recalculada 300 ms después del último cambio sin cortar el audio; solo vale la última petición (C2-E6).
- [x] `MotorAudio` la usa con «Escuchar: Instrumental» si hay coros y nivel > 0; bucle, velocidades y tono conservado funcionan igual; «Original» y «Voz» no cambian (C2-E3, C2-E4).
- [x] Estados: «Preparando los coros…» si el cálculo pasa de 500 ms (medido por el cliente) y, con error, instrumental solo y `edi.coros.error` una vez por visita (C2-E6).
- [x] `maxBuffers` a 3 mientras existe la pista; memoria medida con una canción de 4 y de 10 min en las notas.

## Pruebas de feedback
- Unitarias: `motorAudio.test.ts` (selección de pista, LRU, bucle y velocidad con la pista derivada), test de la mezcla derivada con señales sintéticas (± 1 dB), fallo simulado del worker.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo** (solo el motor; la interfaz de Funciones es la 0365 y el cableado en `Editor.tsx` es del lote del editor).
- `karaoke/mezclaCoros.ts` (pura: `instrumental + voz × nivel(t)`, con pico escalado a 0,999 como la exportación), `mezclaCoros.worker.ts` y `mezclaCorosCliente.ts` (Web Worker con `Float32Array` transferidos, cancelable con `AbortSignal`).
- `karaoke/motorAudio.ts`: `fijarCoros(puntos)`, `prepararCoros()` y `reproducir({ conCoros })`. Con «Instrumental» y puntos, el motor usa la pista derivada (`bufferDe()`) en lugar del instrumental; con «Original» y «Voz» no calcula ni cambia nada. El cálculo empieza 300 ms después del último cambio (la primera vez al elegir «Instrumental»), una petición nueva aborta la anterior y solo vale la última; mientras tanto suena la mezcla anterior o el instrumental. Si el cálculo pasa de 500 ms el estado trae `corosPreparando: true`; si falla (voz ilegible, error del worker), `corosError: true`, vuelve al instrumental solo y el estado solo pasa de falso a verdadero una vez hasta que una mezcla salga bien (la interfaz avisa en esa transición, una vez por visita). `corosListos` dice si existe la mezcla. Al cambiar la mezcla mientras suena hay un relevo en el mismo punto (como al cambiar de pista). Bucle, velocidades y tono conservado usan la pista derivada (el estirado se clava al buffer que suena).
- `karaoke/useMotorAudio.ts`: opción `coros` (puntos) para el hook; el editor solo tiene que pasarle `envolvente(tramosCoro(letra, duración), vozEnCoros(letra))`.
- Memoria: la derivada va aparte del LRU (que sigue en 2): como mucho 2 pistas + la derivada (el «3» del ADR). La voz se decodifica solo para mezclar y no se guarda (se vuelve a leer en cada recálculo). Cifras **calculadas** (estéreo, float32, 48 kHz; no hay medición real porque no se ejecuta la aplicación): la derivada ocupa ≈ 92 MB con 4 min y ≈ 230 MB con 10 min; en el cálculo hay además las copias de instrumental y voz transferidas al worker (≈ 184 MB con 4 min, ≈ 460 MB con 10 min) que se liberan al terminar. A medir en la guía manual.

**Criterios.** C2-E3 y C2-E4 en `motorAudio.coros.test.ts` y `mezclaCoros.test.ts` (señales sintéticas: ± 1 dB en el coro, idéntico fuera, rampas lineales, mono, pico); C2-E6: 300 ms, última petición, «preparando» a 500 ms, fallo simulado y error una sola vez.

**Cómo probarlo.** `npx vitest run src/renderer/src/karaoke/motorAudio src/renderer/src/karaoke/mezclaCoros.test.ts`.

**Para la 0365 y el cableado del editor.** Llamar a `motor.fijarCoros(puntos)` (o pasar `coros` a `useMotorAudio`) con los puntos de la letra del historial y el nivel; mostrar `edi.coros.preparando` con `estado.corosPreparando` y el toast `edi.coros.error` cuando `estado.corosError` pase a verdadero. «Escuchar un coro»: `await motor.prepararCoros()` y `motor.reproducir({ desdeMs, hastaMs, conCoros: true })` (no cambia la pista elegida; sin voz separada `prepararCoros()` da `false`).

**Deuda.** El cableado en `Editor.tsx` (no tocado: es del lote del editor). No se probó el Worker real (Vitest usa una mezcla inyectada).
