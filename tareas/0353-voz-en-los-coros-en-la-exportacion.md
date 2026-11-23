# 0353 — Feature 2 · Exportación: envolvente en main y mezcla en el worker
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0350
- ADRs: 0030 §5, 0019 §3–§4, 0026 §5
- Spec UX: docs/ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Llevar la voz de los coros al video cuando se pide.

## Criterios de aceptación
- [x] Main calcula los puntos desde la instantánea (una canción o cada una del lote, con su nivel) cuando `coros` es `true`, `audio` es `instrumental`, hay voz separada y la canción tiene coros con nivel > 0, y los pasa como `audio.voz_envolvente` (C2-V2, C2-V5, lado main).
- [x] Worker: `mezclar` con envolvente (`np.interp`) antes de la normalización de pico; `_validar` rechaza puntos inválidos; sin envolvente, el audio es idéntico al de 0.2.2 (C2-V2, C2-V3).

## Pruebas de feedback
- Unitarias: pytest de `mezclar` (tono al 50 % ± 1 dB en los coros, silencio a > 450 ms) y `_validar`; Vitest del servicio de exportación (puntos = `tramosCoro`; lote con niveles 20 % y 70 % y canciones sin coros).
- E2E: `exportacion.spec.ts` sigue pasando.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo** (solo main y worker; la casilla es la 0366).
- `main/exportacion/servicio.ts`: `iniciar` e `iniciarLote` leen `coros` (ausente = `false`; el lote lo guarda en `Lote.coros` y `reintentarLote` lo conserva). `leerCancion` calcula `envolvente(tramosCoro(instantanea.letra, duracion), vozEnCoros(letra))` de la instantánea solo con `coros`, `audio: 'instrumental'`, voz utilizable y puntos no vacíos (nivel > 0 y coros con inicio). Entonces `rutas.voz` es la pista de voz y se pasa `audio.voz_envolvente`; en cualquier otro caso los argumentos del worker son exactamente los de 0.2.2 (test `toStrictEqual`).
- `worker/shinobi_worker/exportar.py`: `mezclar(instrumental, voz, ganancia_db, envolvente=None)` con `np.interp` sobre el tramo cubierto por los puntos, antes de la normalización de pico; sin envolvente el código es el de siempre (test de igualdad exacta). `_validar_envolvente`: 1–10 000 puntos `[ms, nivel]`, números finitos, `ms` ≥ 0 y estrictamente crecientes, nivel 0–1, y exige `audio.voz`; `ARGUMENTOS_NO_VALIDOS` si no.

**Archivos.** `main/exportacion/servicio.ts` (+ test), `worker/shinobi_worker/exportar.py` (+ `tests/test_exportar.py`).

**Cómo probarlo.** `npx vitest run src/main/exportacion`; `cd worker && uv run pytest tests/test_exportar.py && uv run ruff check . && uv run ruff format --check .`.

**Manual (guía de QA).** Video «Solo instrumental» con y sin la casilla en una canción con coros: oír la voz solo dentro de los coros y sin chasquidos en las rampas.

**Deuda.** `exportacion.spec.ts` no se ejecutó (la corre el lote de render); no se tocó. Hasta la 0366 la interfaz no envía `coros`.
