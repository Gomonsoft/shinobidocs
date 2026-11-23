# 0358 — Feature 3 · Funciones automáticas con voces a la vez
- Estado: Hecha
- Paso del pipeline: 3–4
- Depende de: 0357
- ADRs: 0029 §7, 0024, 0027 §4, 0028, 0018 §6
- Spec UX: — (ADR 0029 §7); docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto (fila «Funciones automáticas»)
- Tamaño: M (sin cambio tras la prueba)
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Prueba 0356: sirve** (2026-11-23). Pendiente de la confirmación del usuario (0165, fila 10). Dueño: lote F (`shared/solapes.ts` nuevo, con los adaptadores de las funciones). **No** toca `shared/alineacion.ts`, que no existe.

## Objetivo
Que las funciones de 0.2.2 no se equivoquen con líneas solapadas.

## Criterios de aceptación
- [x] `shared/solapes.ts`: `solapadas(letra, duracionMs)` (barrido por inicio sobre los tramos de `finEfectivo`) y `aplanarSolapes`, a partir de `docs/spikes/0029-voces-a-la-vez/prototipo/solapes.ts` (pregunta 0367).
- [x] **Excluyen** las solapadas, sin cambiar el código de la función, y lo dicen con `edi.partes.solapaExcluidas`: «Ajustar los silencios», «Fin al final de la voz», los fines prudentes de la preparación y de «Ajustar los fines…» (0386, 0389) y las líneas dudosas (salvo `sinInicio`). «Comprobar la letra» y el encaje de los candidatos y de la preparación las **fusionan**, con las guardas de ADR 0024 intactas. El `.lrc` (una y varias) escribe una sola marca vacía por grupo (C1S-E4).
- [x] Sincronizar con la voz (feature 10, si entra): la regla «excluye las solapadas» se anota en su tarea 0331 y no se implementa aquí.

## Pruebas de feedback
- Unitarias: `silencios.test.ts`, `encaje.test.ts`, `dudosas.test.ts`, `alineacion.test.ts`, `lrc.test.ts` con solapes.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** `shared/solapes.ts` (nuevo; preguntas 0367 y 0366): `solapadas(letra, duracionMs)` (barrido por inicio sobre los tramos de `finEfectivo`; tocarse no es solaparse), `gruposSolapados`, `aplanarSolapes` y adaptadores finos, sin cambiar el código de las funciones:
- **Excluyen** (`proponerAjusteSilenciosSinSolapes`, `detectarDudosasSinSolapes`, con `solapaExcluidas` para `edi.partes.solapaExcluidas`): «Ajustar los silencios», «Fin al final de la voz» (con `soloIds`, una solapada no hace nada), los fines prudentes de la preparación y de «Ajustar los fines…» y las líneas dudosas (salvo `sinInicio`). La función real recibe las solapadas marcadas como «con palabras hechas a mano», que ya salta, y sus líneas salen sin tocar.
- **Fusionan** (`evaluarEncajeSinSolapes`, `evaluarEncajeConPicosSinSolapes`): «Comprobar la letra» y la preparación; `encaje.ts` no cambia y las guardas de ADR 0024 siguen en él. El encaje de los candidatos de LRCLIB no se adapta (no pueden traer solapes).
- **`.lrc`** (`exportarLrc`, una y varias): una sola marca vacía por grupo, tras la última línea del grupo y en el fin que acaba la última (`gruposParaLrc`); orden temporal intacto y reimportar da las mismas líneas.
- Cableado en main: `main/letras/dudosas.ts`, `main/letras/comprobacion.ts`, `main/preparacion/servicio.ts` (los dos fines prudentes) y, en la vista Letra, `LetraElegida.tsx`.

**Regla de oro.** Sin solapes los adaptadores devuelven exactamente lo mismo que la función original: 200 letras aleatorias (la mitad con reparto) por función en `solapes.test.ts`, y las 923 pruebas existentes sin cambios (ver 0357). `solapadas` da vacío en 600 letras sin solapes.

**Criterio de la alineación (ADR 0028).** `shared/alineacion.ts` no existe: solo queda el predicado `solapadas` para su tarea. «Sincronizar con la voz» (feature 10): la regla «excluye las solapadas» va en su tarea 0331 (no la edité: fuera de mi encargo); si la 0331 llama a `proponerAjusteSilenciosSinSolapes` la cumple sola.

**Para la 0359 (editor).** Los puntos de llamada del editor **no** están cableados (son de `vistas/editor/**`): `silencios/useAjustarSilencios.ts` y `revision/useRevision.ts` (`proponerAjusteSilencios`, `detectarDudosas`) deben pasar a `proponerAjusteSilenciosSinSolapes` y `detectarDudosasSinSolapes` y mostrar `edi.partes.solapaExcluidas` con `solapaExcluidas`; `comprobar/calcular.ts` (`evaluarEncaje`) a `evaluarEncajeSinSolapes`. Todos con la misma firma que la función original más el contador.

**Cómo probarlo.** `npx vitest run src/shared/solapes.test.ts src/shared/letra.regla.test.ts src/main/letras/dudosas.test.ts`.

**Deuda.** Con voz real habrá más exclusiones que con la sintética; una canción con muchos solapes recibirá poca ayuda automática (se dice en la interfaz con `solapaExcluidas`). `huecosLargos` de la propuesta ya no cuenta las solapadas (se excluyen antes).
