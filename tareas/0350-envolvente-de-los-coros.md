# 0350 — Feature 2 · `shared/coros.ts`: tramos y envolvente de la voz en los coros
- Estado: Hecha
- Paso del pipeline: 4–6
- Depende de: 0340
- ADRs: 0030 §2
- Spec UX: — (ADR 0030 §2); valores en docs/ux/06-editor.md#023--feature-2--voz-en-los-coros (Concepto)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Una función pura del tiempo que comparten el reproductor, el editor y la exportación.

## Criterios de aceptación
- [x] `tramosCoro`, `envolvente` y `nivelEn` con las reglas y constantes de ADR 0030 §2 (offset, `finEfectivo`, unión de tramos a menos de 1 s, rampas de 150 ms); es el test compartido que citan C2-R4 y C2-V2.

## Pruebas de feedback
- Unitarias: `coros.test.ts`: offset, unión (800 ms frente a 1,2 s, C2-R2), recorte, líneas sin inicio, nivel 0, rampas.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `shared/coros.ts` (puro): `tramosCoro(letra, duracionMs)`, `envolvente(tramos, nivel)`, `nivelEn(puntos, ms)` y las constantes `CORO_ANTES_MS=150`, `CORO_DESPUES_MS=300`, `CORO_UNIR_MS=1000`, `CORO_RAMPA_MS=150`. Los tramos usan `parteDe(linea, letra) === 'coro'`, `finEfectivo` y `offset_ms`.

Decisiones: la unión mira el hueco entre **tramos ya ampliados** (800 ms entre tramos se une, 1,2 s no); un tramo de menos de 300 ms usa rampas de la mitad (y los de menos de 2 ms se ignoran) para que los `ms` sean estrictamente crecientes (el worker los exige); `nivelEn` vale 0 fuera de los puntos.

**Archivos.** `shared/coros.ts`, `shared/coros.test.ts` (10 tests: offset, unión, recorte, sin inicio, fin efectivo, rampas, nivel 0, `ms` crecientes).

**Cómo probarlo.** `npx vitest run src/shared/coros.test.ts`.

**Deuda.** Constantes provisionales (ajuste a oído en la guía manual).
