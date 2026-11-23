# 0357 — Feature 3 · Fin por parte en las reglas de la letra
- Estado: Hecha
- Paso del pipeline: 4
- Depende de: 0356 (si sirve), 0341
- ADRs: 0029 §7, 0006, 0021
- Spec UX: — (ADR 0029 §7); docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto
- Tamaño: M (revisado tras la prueba 0356: el parche existe y pasa las 908 pruebas)
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Prueba 0356: sirve** (2026-11-23). Entra en alpha.2, pendiente de la confirmación del usuario (pregunta 0165, fila 10). Dueño: lote F (`shared/letra.ts`, `shared/letras/tiempos.ts`, `palabras.ts`, `normalizar.ts` y `shared/derivados.ts`, con un cambio acordado con sus dueños).

## Objetivo
Permitir que líneas de partes distintas se solapen sin tocar el orden de inicios.

## Criterios de aceptación
- [x] La regla definitiva de ADR 0029, «Resultado de la prueba técnica de voces a la vez» (pregunta 0366): inicios crecientes en toda la letra; el fin **fijado** y las palabras no pasan de la siguiente línea que choca (misma parte; «Todos» con cantantes; coro con coro; pausa con todo); el fin **automático** llega a la siguiente de cualquier parte. Se aplica con `parteDe(linea, letra)`, no con `parte ?? 'c1'`. Main la valida al escribir (C1S-E4).
- [x] Las 8 funciones del parche de la prueba (`docs/spikes/0029-voces-a-la-vez/parche/`) pasan al código: `validarInvariantesLetra`, `finEfectivo` y `moverInicioLinea` (`letra.ts`), `limitarFin` (`letras/tiempos.ts`), `cargarBorrador` y `limitesEditorDe` (`letras/palabras.ts`), `normalizarLetra` paso 4 (`letras/normalizar.ts`) y `lineasConFinNoValido` (`derivados.ts`). Con las ayudas `chocan`, `siguienteQueChoca` y `anteriorQueChoca`.
- [x] Sin reparto, la regla es exactamente la de 0.2.2. Lo fija la prueba de propiedades de la 0356 (2 000 letras) llevada a `letra.test.ts`.
- [x] Una letra sin solapes da exactamente los mismos resultados que antes en todas las pruebas existentes (C1S-E5).
- [x] `revisada` deja de valer en las líneas cuyo fin automático cambia, sin reescribir nada al abrir.
- [x] Compatibilidad (pregunta 0365, opción A): una canción con solapes se ve **dañada** en versiones anteriores, sin perder nada. Texto para las notas de la versión en el informe (0361). Un test con una copia congelada del `letraSchema` de 0.2.2 confirma que una letra **sin** solapes, con reparto, sigue validando.

## Pruebas de feedback
- Unitarias: `letra.test.ts`, `tiempos.test.ts` con la letra de la prueba; copia congelada del esquema de 0.2.2.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Qué se hizo.** La regla definitiva de ADR 0029 §7 (preguntas 0365 y 0366): inicios crecientes en toda la letra; el fin **fijado** y las palabras no pasan del inicio de la siguiente línea que **choca**; el fin **automático** sigue llegando a la siguiente de cualquier parte.
- `shared/letra.ts`: `chocan(a, b, letra?)`, `siguienteQueChoca` y `anteriorQueChoca` (misma parte; «todos» con cantantes, no con el coro; coro con coro; pausa con todo). Leen la parte con `parteDe(linea, letra)` (lectura tolerante); si ninguna de las dos líneas trae `parte` se salta la lectura (todas `c1`: la regla de 0.2.2). `validarInvariantesLetra(lineas, letra?)` (el esquema le pasa la letra), `finEfectivo` (solo las palabras visibles; el fin automático no cambia) y `moverInicioLinea` (la anterior que choca pierde el fin y las palabras; el fin propio se compara con la siguiente que choca).
- `shared/letras/tiempos.ts` (`limitarFin`), `palabras.ts` (`cargarBorrador`, `limitesEditorDe`), `normalizar.ts` (paso 4; `normalizarLetra(entrada, generarId?, contexto?)`, y `aplicarTextoEditado` le pasa la letra) y `derivados.ts` (`lineasConFinNoValido`).
- Main valida al escribir con `letraSchema`, que hereda la regla (test C1S-E4 en `servicio.reparto.test.ts`: acepta un fin que pasa de otra parte y rechaza el que pasa de la suya, sin escribir).

**Regla de oro, con cifras.** Las 923 pruebas existentes que tocan la regla (52 archivos: la lista de `regresion.sh` del spike) dan 918 correctas y 5 saltadas **antes y después**, y **0 cambian de resultado** (se compararon prueba a prueba contra los 6 archivos de producción en su versión de `HEAD`). Además, `letra.regla.test.ts` lleva la prueba de propiedades de la 0356: 1 000 letras aleatorias sin reparto y 1 000 con reparto pero sin solapes (semilla fija, `__fixtures__/letrasAleatorias.ts`) comparadas con una **copia congelada** de `letra.ts` de 0.2.2 (`__fixtures__/letra0_2_2.ts`): invariantes y `finEfectivo` iguales en las 2 000; `moverInicioLinea`, validación de letras rotas y `normalizarLetra` iguales en las 1 000 sin reparto. Con reparto, `ajustarFin`, `fijarFin` y `limitesEditorDe` ganan libertad (ver abajo); no es una regresión.

**Compatibilidad (0365, opción A).** `letra.regla.test.ts`: con el esquema congelado de 0.2.2, una letra con solapes **no** valida (se vería dañada) y una letra con reparto **sin** solapes sí. Texto para las notas de la versión (0361): «Una canción con voces a la vez (líneas de distintos cantantes que se pisan) no se abre en versiones anteriores: aparece como dañada, sin perder nada, y vuelve a abrirse con 0.2.3. Quita los solapes antes de volver a una versión anterior.»

**`revisada`.** No necesita código nuevo: `retirarCamposObsoletos` ya compara el fin efectivo; test: la marca se retira si el fin automático cambia y no se reescribe nada si no cambia.

**Para 0359 (editor) y 0360 (pantalla).**
- Consumidores que no cambié y que hay que revisar: `vistas/editor/**` (`PistaSincronia`, `PanelSincronia`, `ListaLineas`, `estado.ts`) usa `limitarFin`, `limitesEditorDe` y `limitesInicio`; **el límite del inicio no cambia** (sigue siendo entre los inicios vecinos, de cualquier parte: aviso `inicio_anterior`, pregunta 0368) y solo el fin tiene la libertad nueva (aviso `fin_siguiente` solo ante la siguiente que choca). Para saber si dos líneas se pisan en la interfaz: `solapadas(letra, duracionMs)` (0358).
- `render.ts`/`zonas.ts`: el fin automático **no** puede resolverse dentro de la subsecuencia de una zona (una línea de c1 seguiría activa hasta la siguiente de c1 aunque otra voz haya entrado); usar `finEfectivo(letra entera)` antes de repartir (la 0364 ya lo hace con `conFin`). Los indicadores de espera solo si no suena ninguna zona (C1S-R1) siguen pendientes en la 0360.
- Las palabras hechas a mano siguen perdiéndose al mover un inicio (ADR 0021 §4); en un dúo se notará más.

**Archivos.** `shared/letra.ts`, `letras/{tiempos,palabras,normalizar,editar}.ts`, `derivados.ts`; tests: `letra.regla.test.ts` (26), fixtures `letra0_2_2.ts` y `letrasAleatorias.ts`, `main/letras/servicio.reparto.test.ts`.

**Deuda.** Ninguna. Una `pausa` con inicio choca con todo, como decide el ADR.
