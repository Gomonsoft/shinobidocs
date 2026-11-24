# 0356 — Feature 3 · Prueba técnica de voces a la vez
- Estado: Hecha (falta el paso del arquitecto: escribir el resultado en ADR 0029)
- Paso del pipeline: 4–6
- Depende de: 0340 (puede empezar en cuanto exista; no toca código de producción)
- ADRs: 0029 §7, 0022, 0006
- Spec UX: — (ADR 0029 §7); diseño condicionado en docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto y docs/ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Decidir con un criterio cerrado de antemano si las voces a la vez entran en 0.2.3.

## Criterios de aceptación
- [x] Todo en `docs/spikes/0029-voces-a-la-vez/` (sin código de producción y **sin letras reales**: letra inventada; un dúo real solo si el usuario lo anota y aporta, y en el informe solo van cifras).
- [x] Criterio 1 de ADR 0029 §7: la regla «inicios crecientes en toda la letra + fin por parte» con los tres patrones de las referencias; las pruebas existentes no cambian sin solapes.
- [x] Criterio 2: captura de un fotograma de exportación a 1920 × 1080 con 3 zonas activas ≤ 1,25 × la de 0.2.2 con 5 líneas; además, a 60 FPS con 4 zonas no se pierden fotogramas en el equipo de referencia (C1S-R3).
- [x] Criterio 3: comportamiento definido y probado con solapes de «Ajustar los silencios», encaje, dudosas, alineación y `.lrc`.
- [ ] Resultado en ADR 0029 («Resultado de la prueba técnica de voces a la vez») con «sirve» o «no sirve» y, si sirve, ajustes a 0357–0360.

## Pruebas de feedback
- Unitarias: Las del prototipo, dentro de `docs/spikes/`.
- E2E: Ninguna.
- Críticos: no
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** La prueba completa en `docs/spikes/0029-voces-a-la-vez/` (informe en `informe.md`, cómo repetirla en `README.md`). Sin tocar `app/` ni `worker/`: la regla nueva se aplica en memoria con un plugin de Vite (5 archivos, +52 −13 líneas) y las medidas usaron una instantánea `git archive` del commit `552fbb2`.

**Veredicto: sirve con condiciones.**
- Criterio 1: los tres patrones caben con un único desvío de 1 ms; 908 pruebas existentes (51 archivos: `letra`, `render`, `pantalla`, `encaje`, `dudosas`, `silencios`, `lrc`, `palabras`, `tiempos`…) dan lo mismo con y sin parche; 2 000 letras aleatorias sin solapes, idénticas sin partes. Hallazgo importante: `letraSchema` valida los invariantes al leer, así que 0.2.2 y 0.2.1 rechazarían la canción entera si tiene solapes (pregunta 0365).
- Criterio 2: razón 1,01 con 3 zonas y 1,02 con 4 (≤ 1,25); 60 FPS con 4 zonas, 1 800 fotogramas, 0 sin asentar. Prototipo de zonas sobre el `AppExportacion` real, no la 0364 (que estaba en obras).
- Criterio 3: silencios, dudosas y alineación excluyen las solapadas, el encaje las fusiona, el `.lrc` escribe una sola marca vacía por grupo; 0 falsos positivos (sin adaptador: 4, 1, 1 y 2). `shared/alineacion.ts` no existe aún: solo se probó el predicado.

**Preguntas** (con la opción conservadora aplicada): 0365 (0.2.2 rechaza la canción con solapes), 0366 (el fin automático sigue yendo a la siguiente línea de cualquier parte; qué «choca»), 0367 (excluir, fusionar, una marca vacía por grupo), 0368 (el texto debe ir en orden de inicio).

**Pendiente del arquitecto**: escribir «Resultado de la prueba técnica de voces a la vez» en ADR 0029 (texto propuesto en el §7 del informe) y ajustar 0357–0360 con el §4 del informe (0357 pasa de M–L a M, 0360 de S–M a S; 0359 sigue en M con riesgo porque no se prototipó). Esta tarea no podía tocar el ADR.

**Cómo probarlo.** Ver `README.md` del spike: `npx vitest run --config ../docs/spikes/0029-voces-a-la-vez/vitest.config.mts` (30 pruebas) y `bash ../docs/spikes/0029-voces-a-la-vez/regresion.sh <dir>`.

**No comprobado** (detalle en el §6 del informe): la 0364 real, la interfaz del editor (0359), un dúo real, voz real, otros equipos o 4K, y las pruebas de componente del editor con el parche (las corre el CI).

**Deuda.** Ninguna en `app/`. Para la guía manual: ninguna (no hay nada visible).
