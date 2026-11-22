# 0024 — Encaje de la letra con la voz (comprobación y desfase global) y líneas dudosas con revisión recordada

- Estado: Aceptado (umbrales provisionales; ver [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md))
- Fecha: 2026-11-21
- Paso del pipeline: 3 (letra) y 4 (editor)
- Versión: 0.2.2, features 4 ([propuesta 022](../propuestas/022-comprobar-la-letra-contra-el-audio.md)) y 11 ([propuesta 023](../propuestas/023-revision-guiada-de-lineas-dudosas.md)). Specs: [05 · Feature 4](../ux/05-letra.md), [06 · Features 4 y 11](../ux/06-editor.md). Responde a las preguntas de contratos [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) y [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md) en lo que toca a estas dos features.

## Contexto

La app elige y muestra letras sin escuchar el audio. Ya existen los **picos de voz** (ADR 0015: pirámide min/máx int16 por bloques de 10 ms en `pistas/.picos-voz-v1-*.bin`) y la detección de voz de «Ajustar los silencios» (`detectarVoz` en `shared/silencios.ts`, ADR 0018 §6: percentil 95 de la referencia, umbral `máx(ref − 30 dB, −60 dBFS)`, rachas de menos de 50 ms ignoradas). La feature 4 pide una puntuación de coincidencia por candidato, la detección de «otra versión» y la corrección sola de un desfase global; la feature 11, una lista de líneas sospechosas que se recorren una a una y que, dadas por buenas, no vuelven a señalarse salvo que cambien sus tiempos. La feature 5 (preparación desatendida) usa ambas para decidir sin preguntar.

### Calibración con la biblioteca del usuario (2026-11-21)

Script de solo lectura (fuera del repositorio) sobre `cancion.json` y la caché de picos de las 10 canciones Lista que tienen picos (465 líneas). Solo se anotan cifras; no se copió ninguna letra. Métricas sobre bloques de 10 ms, con la letra pasada a tiempo de audio y desplazada `d`:

- **F(d)**: medida F entre los bloques cubiertos por las líneas (`[inicio, finEfectivo)`) y los bloques con voz.
- **I(d)**: fracción de líneas con voz en más del 25 % de los 400 ms que siguen a su inicio.
- **d\***: el `d` de −5 a +5 s (paso 20 ms) que maximiza F.

| Prueba | Resultado |
|---|---|
| Letra propia, sin desplazar | F(0) de 0,915 a 0,975; I(0) de 0,98 a 1,00; \|d\*\| ≤ 200 ms en 9 de 10 (la canción rápida sin huecos da d\* = 1 180 ms con ganancia de F de solo 0,002: curva plana) |
| Letra de **otra** canción sobre cada audio (90 pares) | F(d\*) mediana 0,73–0,84, máximo 0,914; I(d\*) mediana 0,68–0,90, máximo 0,97 |
| Regla «F(d\*) ≥ 0,88 **y** I(d\*) ≥ 0,95» | Acepta **10 de 10** propias y **0 de 90** ajenas. Con F ≥ 0,85 e I ≥ 0,90 se cuela 1 ajena |
| Letra propia desplazada a propósito ±0,4, ±0,8, ±1,5 y ±3 s | d\* devuelve el desplazamiento con un error igual al sesgo propio de cada canción (−100 a +200 ms); la ganancia de F es de +0,016 a +0,21 a partir de ±0,8 s y de +0,001 a +0,06 a ±0,4 s. En la canción rápida no se recupera (curva plana) |
| Señal «la voz sigue tras el fin» (≥ 90 % de voz en 1 s y la siguiente empieza ≥ 1 s después) | 0–2 líneas por canción (5 en total). Con 300 ms y 80 % salen 0–30 por canción: inservible |
| Señal «la voz acaba mucho antes del fin» (> 1,2 s) | 0–2 por canción |
| Señal «inicio en silencio» (sin voz en los 500 ms siguientes) | 0 en las 10 (las canciones Lista ya están revisadas) |
| Líneas de menos de 500 ms | 7 de 465, 6 en la canción rápida |
| Fines fijados que coinciden (± 20 ms) con lo que propondría «Ajustar los silencios» | Arrópame 0 de 26 y ¿Y Ahora Qué? 0 de 33 (hechos a mano); A Pesar de Mí 22 de 30, Tragedia Termina 22 de 22 y Dedos Rotos 21 de 21 (salen de «Ajustar los silencios») |

La última fila corrige un supuesto anterior: los fines de A Pesar de Mí no son en su mayoría hechos a mano. Hoy el archivo no distingue quién fijó un fin; esta decisión lo añade (§4).

## Alternativas consideradas

### 1. Métrica de encaje

| Opción | Pros | Contras |
|---|---|---|
| **A. F(d) e I(d) sobre los picos existentes, con búsqueda de d\* en ±5 s** | Sin modelos ni dependencias; determinista; barata (sumas prefijas: O(líneas) por cada `d`); separa propias y ajenas en la biblioteca real | Ciega a qué se canta: solo mira cuándo hay voz. Coros y «oh» sin letra bajan F |
| B. Correlación cruzada de envolventes | Clásica | Mismo dato de entrada y peor separación entre letra propia y ajena (no usa la estructura de líneas) |
| C. Reconocimiento de voz (Whisper) y comparación de texto | Detecta la letra equivocada aunque los tiempos encajen | Modelos de GB y minutos de CPU para una comprobación; la feature 10 ya evalúa modelos acústicos |
| D. Puntuación del alineador forzado (feature 10) | Mira el texto | Depende de que la prueba técnica de la feature 10 salga bien y de un modelo por idioma. Se usa como señal extra si existe (§3), no como base |

### 2. Dónde se guarda la corrección del desfase

| Opción | Pros | Contras |
|---|---|---|
| **A. `letra.offset_ms`** | Ya se lee, se valida (±30 s) y se aplica en editor, reproductor, sesión y exportación (ADR 0021 §8); no toca invariantes ni tiempos; deshacer es un campo | El campo no tiene control propio desde 0.2.1: la interfaz debe decir que la letra está desplazada |
| B. Reescribir todos los tiempos | Un solo sistema de tiempos visible | Función nueva de desplazamiento (0.2.1 retiró las suyas), riesgo con inicios negativos y con las palabras manuales |

### 3. Dónde corre

| Opción | Pros | Contras |
|---|---|---|
| **A. Función pura en `shared/` con dos llamadores: main (candidatos de la búsqueda y preparación desatendida) y renderer (acción del editor)** | Mismo cálculo en los dos sitios; main no depende del editor abierto; el editor usa su letra en memoria (como «Ajustar los silencios») | main tiene que leer el nivel base de la caché (lectura pequeña: unos 100 KB) |
| B. Solo renderer | Sin cambios en main | La preparación desatendida (feature 5) no tendría comprobación |
| C. Worker | — | Lanzar Python para sumas sobre 25 000 bloques no tiene sentido |

### 4. «Revisada» y origen de los fines

| Opción | Pros | Contras |
|---|---|---|
| **A. Instantánea por línea `revisada: { inicio_ms, fin_ms }` (tiempos en el momento de darla por buena), invalidada por main al escribir si ya no coincide** | «No vuelve a señalarse salvo que cambien sus tiempos» por construcción, sin depender de cada cliente | Un campo más por línea |
| B. Conjunto de ids revisados en la canción | Más pequeño | Hay que limpiarlo a mano en cada edición; se queda desfasado |
| C. No guardar (estado de la visita) | Nada que migrar | Contradice la spec |

## Decisión

Opciones **1A, 2A, 3A y 4A**.

### 1. `shared/encaje.ts` (nuevo, puro y determinista)

```ts
export const PARAMETROS_ENCAJE = {          // provisionales (calibración de 2026-11-21)
  desfaseMaxMs: 5000, pasoMs: 20,
  ventanaInicioMs: 400, vozMinimaInicio: 0.25,
  coincideF: 0.88, coincideI: 0.95,        // «Coincide con tu audio»
  noCoincideF: 0.85, noCoincideI: 0.90,    // por debajo de cualquiera: «puede ser otra versión»
  desfaseMinimoMs: 500, gananciaMinimaF: 0.02
} as const

evaluarEncaje(letra, voz /* VozDetectada de detectarVoz */, { duracionMs, p })
  → { veredicto: 'coincide' | 'desfasada' | 'dudosa' | 'no_coincide' | 'no_comprobable',
      desfaseMs /* d*; solo con 'desfasada' es una corrección propuesta */,
      f0, i0, fDesfase, iDesfase, lineasEvaluadas,
      lineasSinVoz: string[],                 // ids con < 10 % de voz en su intervalo
      tramosVozSinLetra: [number, number][],  // voz de ≥ 2 s seguidos fuera de toda línea (tiempo de audio)
      desfaseVariable: boolean }              // d* de la primera mitad y de la segunda difieren > 500 ms
```

- Nombres de veredicto: los de la spec ([05 · Feature 4](../ux/05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase), 0153 §10).
- Usa `detectarVoz` con `PARAMETROS_SILENCIOS` (una sola definición de «hay voz»), las líneas con inicio y su `finEfectivo`, en tiempo de audio (`+ offset_ms`).
- **Veredicto** sobre d\*: `coincide` si `F ≥ 0,88` e `I ≥ 0,95`; `no_coincide` si `F < 0,85` o `I < 0,90`; si no, `dudosa`. `desfasada` es un `coincide` en d\* que cumple la regla de corrección de abajo. Letra sin tiempos o con **menos de 5** líneas con inicio, o sin picos: `no_comprobable`.
- **Desfasada** (corrección propuesta) solo si a la vez: `|d*| ≥ 500 ms`, `F(d*) − F(0) ≥ 0,02`, `I(d*) ≥ I(0)`, el veredicto en d\* es `coincide` y `desfaseVariable` es falso (un desfase que cambia a lo largo de la canción es «otra versión», no se corrige). En la biblioteca real no marca como desfasada ninguna letra propia (incluida la canción rápida) y recupera los desfases de ±0,8 s o más salvo en la canción sin huecos. **Por debajo de 500 ms no se propone** (la spec decía 0,15 s): el sesgo propio de la medida en las letras correctas llega a ±200 ms, así que 0,15 s corregiría letras buenas.
- **Nunca saca una línea del audio**: d\* se busca solo en el rango en que el primer inicio queda ≥ 0 y el último < duración.
- **Coros y «oh» sin letra**: bajan la exhaustividad de F, pero no la precisión ni I; las 10 canciones reales los tienen y todas salen `coincide`. Se informan en `tramosVozSinLetra` en lugar de penalizar más.
- **Corrección** (opción 2A, respuesta a 0153 §2 y §3): `offset_ms ← offset_ms + d*`, redondeado a 10 ms y dentro de ±30 s, y se anota `letra.desfase_corregido_ms = d*`. Como `offset_ms` lo aplican todas las superficies y el editor escribe siempre en tiempo de letra (`t − offset_ms`), a efectos de todo lo demás la letra se comporta como si sus tiempos se hubieran movido, **incluidas las palabras hechas a mano, que no se descartan ni se recalculan** (no hace falta excepción a ADR 0021 §4: ningún tiempo de línea cambia). «Quitar la corrección» = `offset_ms −= desfase_corregido_ms` y se borra el campo. En el editor cada una es **un paso de deshacer** (acción del reducer guardada con `letras.guardarTiempos`, que ya escribe `offset_ms`). La spec 05/06 habla de «reescribir los tiempos»: el efecto visible es idéntico.
- **Letra intacta** (0153 §2c): `letra.intacta: true` lo pone main al guardar una letra nueva (LRCLIB, archivo o pegada) y lo **retira** en la primera escritura que cambie un inicio, un fin o unas palabras. Solo una letra intacta y sin `desfase_corregido_ms` se corrige **sola** tras la separación. Los dos campos son opcionales (0.2.1 los descarta).
- **Coste**: sumas prefijas sobre el nivel base (25 000 bloques para 4 min) y 501 desplazamientos × líneas: < 10 ms en JS. No hace falta trocear.

### 2. Llamadores

- **Vista Letra (candidatos de LRCLIB)**: `letras.buscar` sigue igual; si la voz está separada y los picos están `lista`, main evalúa cada candidato con tiempos y añade `encaje: { veredicto, desfaseMs } | null` a cada candidato del resultado (`null` si no hay picos todavía o el candidato es solo texto). El orden de la lista pasa a ser: veredicto (`coincide` = `desfasada` > `dudosa` > `no_comprobable` > `no_coincide`) y, dentro, el orden actual de ADR 0005. Si los picos aún no están, main emite `letras:encaje` con los encajes cuando terminan, para que la vista los muestre sin volver a buscar. El estado de los picos (`no_disponible`, `generando`, `error`, `lista`) lo da el canal existente `picos.estado` (0153 §9).
- **Picos al terminar la separación** (0153 §9): main pide `generar-picos` **en cuanto la separación se completa** (no solo al abrir Sincronía), como trabajo aparte del servicio de picos de ADR 0015 (una generación a la vez). Así la comprobación y el paso de fines de la preparación no esperan al editor.
- **Main** lee el nivel base con `leerNivelBase(ruta)` en `main/picos/formato.ts` (nuevo, sobre la validación que ya existe).
- **Editor** («Comprobar la letra con la voz», pestaña Funciones): lee el nivel base con `picos.leer` en ventanas de 40 960 ms (ADR 0018 §6.2) y llama a `evaluarEncaje` con la letra en memoria. Precondiciones: picos `lista` y al menos 5 líneas con inicio.
- **Preparación desatendida** (feature 5, ADR 0025): el criterio de elección automática usa `veredicto` `coincide` o `desfasada` (esta, con la corrección aplicada).

### 3. `shared/dudosas.ts` (nuevo, puro): líneas dudosas

```ts
export const PARAMETROS_DUDOSAS = {        // provisionales (calibración de 2026-11-21)
  inicioVentanaMs: 500,                    // INICIO_EN_SILENCIO: sin voz en [inicio, inicio + 500)
  finVozMs: 1000, finVozFraccion: 0.9,     // FIN_EN_VOZ: ≥ 90 % de voz en [fin, fin + 1000) y la siguiente empieza ≥ 1 s después
  finTardioMs: 1200,                       // FIN_TARDIO: la última voz dentro de la línea acaba > 1,2 s antes del fin
  vozMinimaLinea: 0.1,                     // SIN_VOZ: < 10 % de la línea con voz
  duracionMinimaMs: 250,                   // MUY_CORTA
  cpsMax: 25, cpsMin: 2, lentaMinMs: 6000, // RITMO: más de 25 caracteres por segundo, o menos de 2 en más de 6 s
  confianzaMinima: 0.5                     // ALINEACION_BAJA (feature 10, si la línea la trae)
} as const

detectarDudosas(letra, voz | null, { duracionMs, p })
  → { id, motivos: Motivo[], detalleMs?: number /* p. ej. cuánto sigue la voz */, prioridad: number }[]
```

- Solo líneas con inicio. Sin picos (`voz = null`) solo se aplican `MUY_CORTA`, `RITMO` y `ALINEACION_BAJA`.
- **Excluye** las líneas con `revisada` vigente (§4).
- **Orden**: por orden de letra (la spec decide si recorre por prioridad); `prioridad` = número de motivos, con `FIN_EN_VOZ`, `INICIO_EN_SILENCIO` y `SIN_VOZ` por delante de `RITMO`.
- **Fines automáticos** (propuesta 023): no son un motivo por sí solos (176 de 314 líneas los tienen en la biblioteca real); cuentan porque `FIN_EN_VOZ` y `FIN_TARDIO` se evalúan sobre `finEfectivo`.
- **Objetivo de calibración**: en canciones ya revisadas, no más del 10 % de las líneas. Con los valores de arriba la biblioteca real da de 0 a 6 por canción (6 en la de 101 líneas). Los umbrales se vuelven a medir en la verificación de la feature con las canciones que el usuario prepare.
- **«Fin al final de la voz»** (acción de la revisión, propuesta 016 dentro de la 023; 0157 §27): reutiliza `proponerAjusteSilencios` restringida a una línea (`soloIds`), sin activar la cuenta, un paso de deshacer.
- **Recuento de pendientes en la Biblioteca** (0157 §24): main calcula `detectarDudosas` (leyendo el nivel base de la caché de picos) al terminar la preparación y en cada escritura de la letra de una canción que tenga `preparacion`, y guarda el recuento en `preparacion.dudosas` (dato derivado y regenerable). El resumen lo expone; la Biblioteca nunca lee picos al listar. El editor lo calcula en vivo.
- **Calibración** (0157 §26): con los umbrales de arriba, Arrópame da 0 líneas señaladas (0 %) y A Pesar de Mí 2 de 31 (6 %), por debajo del 10 % pedido. La verificación de la feature repite la medida con `app/scripts/calibrar-dudosas.ts` (herramienta de desarrollo fuera del paquete, como `calibrar-silencios.ts`, que solo imprime cifras).

### 4. Datos nuevos por línea (sin subir `cancion.esquema`)

```jsonc
{ "id": "l7", "tipo": "linea", "texto": "…", "inicio_ms": 41200, "fin_ms": 44310, "palabras": null,
  "origen_fin": "silencios",                       // opcional: "letra" | "silencios" | "preparacion" | "alineacion"; ausente = a mano
  "revisada": { "inicio_ms": 41200, "fin_ms": 44310, "texto": "…" }  // opcional: lo que había cuando se dio por buena
}
```

- **`origen_fin`** (catálogo de la spec, 0157 §16b): `letra` lo pone main al importar un fin que traía la letra (LRCLIB o `.lrc`); `silencios`, el editor al aplicar «Ajustar los silencios» o «Fin al final de la voz»; `preparacion`, la preparación desatendida al ajustar fines (ADR 0025); `alineacion`, la sincronía con la voz (ADR 0028). Cualquier otra edición del fin lo quita (= a mano). Main lo valida (catálogo cerrado; un valor desconocido se lee como ausente con `.catch`) y lo retira si `fin_ms` es `null`. Las letras anteriores a 0.2.2 no lo tienen: sus fines cuentan como a mano (las funciones automáticas no los tocan; es la opción prudente). «Quitar esos fines» de la feature 5 = poner a `null` los fines con `origen_fin: "preparacion"` (si el usuario los cambió, ya no lo tienen).
- **`revisada`** (0157 §25): forma parte de la letra del editor, así que entra en el historial de deshacer, y viaja en `letras.guardarTiempos` (campo opcional por línea; no hay canal nuevo). Al escribir **cualquier** letra, main la **retira** de las líneas cuyo `inicio_ms`, `finEfectivo` o texto ya no coinciden con la instantánea, así que una línea revisada que cambia vuelve a poder señalarse sin depender del cliente (también tras `editarTextoLinea`).
- **Compatibilidad**: `elementoLetraSchema` es `z.object`, así que 0.2.1 descarta los dos campos sin error; si reescribe la canción se pierden (pérdida aceptada, como `origen_palabras` en ADR 0006).
- **Invariantes**: no cambian (ADR 0006).

### 5. Pruebas mínimas

- Vitest `encaje.test.ts` con picos sintéticos (voz en bloques conocidos): los cinco veredictos, letra desplazada ±0,8 y ±3 s recuperada a ± 20 ms, curva plana sin corrección, desfase variable, ninguna línea fuera del audio, `no_comprobable`, límite de ±30 s, «Quitar la corrección», `intacta` retirada por una edición de tiempos, determinismo.
- Vitest `dudosas.test.ts`: cada motivo con un caso positivo y uno negativo, exclusión por `revisada` vigente, invalidación al mover un tiempo, sin picos.
- Vitest en main: `letras.buscar` con picos falsos añade `encaje` y ordena; `guardarTiempos` retira `revisada` desfasada y `origen_fin` sin fin.
- E2E: ninguna nueva para el cálculo; la prueba de la feature (vista Letra con el doble de LRCLIB y picos generados, y el modo «Revisar» del editor) la fija cada tarea con su spec.
- Manual: con canciones reales, una letra de otra versión y una letra adelantada a mano; volver a medir los umbrales con un script de solo lectura (sin letras en el repositorio).

## Consecuencias

- **Positivas**: comprobación sin modelos ni dependencias, en milisegundos; separación perfecta en la biblioteca real (10/10 y 0/90); el desfase se corrige sin controles nuevos; la revisión se recuerda de forma robusta; por fin se sabe qué fines fijó una herramienta.
- **Negativas / riesgos**: umbrales medidos con 10 canciones de casi un solo artista y un solo modelo de separación («Calidad»): con el modelo «Rápido» los restos de instrumental pueden bajar F; una versión con el mismo arreglo y otra letra encajaría igual (la métrica no lee texto); la canción rápida sin huecos no permite estimar el desfase (se informa como «sin corregir»).
- **Legales**: ninguno nuevo (todo local; la calibración no sale del equipo del usuario).
- **Impacto en UX**: una línea de encaje por candidato; acción en Funciones; modo «Revisar» con motivos codificados (la spec pone los textos).

## Fuentes

- ADR [0015](0015-linea-de-tiempo-y-picos-de-voz.md) (formato de la caché) y [0018](0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) §6 (`detectarVoz`, `proponerAjusteSilencios`).
- Calibración propia sobre la biblioteca del usuario, 2026-11-21 (script de solo lectura en el equipo del usuario; resultados de esta página, sin letras).
- Medida F (precisión y exhaustividad): C. J. van Rijsbergen, *Information Retrieval*, 2.ª ed., cap. 7 ([texto](http://www.dcs.gla.ac.uk/Keith/Preface.html)).
