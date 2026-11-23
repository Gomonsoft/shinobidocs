# 0024 — Encaje de la letra con la voz (comprobación y desfase global) y líneas dudosas con revisión recordada

- Estado: Aceptado (umbrales provisionales; ver [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md)). **Las constantes de §1 no aguantan con letras de LRCLIB sin fines** (medida del 2026-11-22): rigen las guardas de prudencia de la revisión «Medida con canciones reales» (al final), provisionales hasta medir con canciones revisadas a mano.
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

## Revisión 2026-11-22 · El desfase retira las marcas «está bien» (pregunta 0172)

- Al escribir una letra cuyo `offset_ms` difiere del guardado («Corregir el desfase», «Quitar la corrección» o el campo de desfase del editor), main **retira `revisada` de todas las líneas**, aunque el cliente las envíe. Una línea dada por buena antes de mover la letra respecto a la voz ya no está comprobada en su sitio nuevo.
- El reducer del editor hace lo mismo en el estado local, dentro del mismo paso de deshacer (deshacer recupera las marcas).
- `intacta` y `origen_fin` no cambian con el desfase.
- Prueba: Vitest de `guardarTiempos` (cambiar `offset_ms` retira `revisada`; repetir el mismo `offset_ms` la conserva).

## Revisión 2026-11-22 · Quién escribe la corrección del desfase (pregunta 0210)

- `letras.guardarTiempos` admite `desfase_corregido_ms: number | null` (±30 s): un número lo anota, `null` lo borra y si falta no cambia. Junto con `offset_ms`, es como se corrige y se quita la corrección en el editor y en la vista Letra (C, con `abrirEdicion` → `guardarTiempos` → `cerrarEdicion`). No hay canal propio.
- `letras.guardar` admite `desfase_ms` (±30 s): main aplica `corregirDesfase({ offset_ms: 0 }, desfase_ms)` y guarda `offset_ms` y `desfase_corregido_ms` con la letra nueva. La letra queda `intacta`.
- **Comprobación diferida** (spec 05, F4-L7): cuando los picos de una canción quedan listos tras separar, si su letra guardada está `intacta`, sin corrección previa, con tiempos y la canción no es Lista ni Letra lista, main la evalúa con `evaluarEncaje`. Si sale `desfasada`, aplica la corrección por el mismo camino que `guardarTiempos` y emite un aviso con [Deshacer] para el toast. Dentro de una tanda de varias canciones no hay toast por canción. La preparación desatendida (ADR 0025 §2, paso `comprobando`) usa la misma función y no la duplica.

## Revisión 2026-11-22 · Quitar la corrección impide que vuelva sola (pregunta 0207)

- Campo opcional **`letra.desfase_descartado: true`** (lectura tolerante; 0.2.1 lo descarta). Main lo pone al escribir una letra cuando quita una corrección que existía (`desfase_corregido_ms` guardado y la petición trae `null`): vista Letra, editor o [Deshacer] del toast de la diferida.
- Con la marca, la comprobación diferida y la preparación desatendida **no** corrigen solas esa letra, aunque se regeneren los picos (re-separar pistas o caché borrada). El usuario puede corregirla a mano y la propuesta se sigue mostrando.
- `intacta` no cambia: solo la retiran los cambios de tiempos de línea, y la preparación la necesita para seguir con los fines (ADR 0025).
- Una letra nueva (`letras.guardar`) nace sin la marca.

## Revisión 2026-11-22 · Líneas dudosas tal como se implementaron (pregunta 0225)

- **Umbrales**: mandan los de §3 (`PARAMETROS_DUDOSAS`, calibrados). **Motivos** con los nombres y la prioridad de la spec 06 · Feature 11:

  | Motivo | Regla |
  |---|---|
  | `sinInicio` | La línea no tiene inicio |
  | `sinVoz` | Menos del 10 % de la línea con voz (`SIN_VOZ`) |
  | `reconocimiento` | Confianza de alineación < 0,5 (`ALINEACION_BAJA`) |
  | `vozTarde` | Sin voz en los 500 ms siguientes al inicio (`INICIO_EN_SILENCIO`) |
  | `finCorta` | ≥ 90 % de voz en el segundo siguiente al fin y la siguiente empieza ≥ 1 s después (`FIN_EN_VOZ`) |
  | `finTarde` | La última voz de la línea acaba más de 1,2 s antes del fin (`FIN_TARDIO`) |
  | `muyCorta` | Dura menos de 250 ms o va a más de 25 caracteres/s |
  | `muyLarga` | Dura más de 6 s y va a menos de 2 caracteres/s |

- **Recuento** `preparacion.dudosas`: lo calcula `contarDudosasGuardadas` (`main/letras/dudosas.ts`). Lo guarda el servicio de la preparación al terminar y tras cada escritura de la letra de una canción con `preparacion` (tarea 0308).
- **Preferencia** `config.editor.revision_autoescucha: boolean` (por defecto `true`, lectura tolerante, escribible por el renderer): «Escuchar cada línea al llegar» del modo «Revisar».
- **`origen_fin`** (§4, complemento): toda acción del usuario que fija o mueve un fin a mano lo quita en el reducer del editor, en el mismo paso de deshacer. Main no puede distinguirlo (tarea 0370). Las acciones automáticas lo ponen. `proponerAjusteSilencios` admite `soloIds` y pone `origen_fin: "silencios"` en los fines que cambia.
- `revisada` en memoria del editor puede quedar no vigente tras editar la línea: es aceptable (el detector solo usa marcas vigentes y main la retira al escribir).

## Revisión 2026-11-22 · Recuento para «Lista para revisar» sin registro (pregunta 0241)

- El recuento de líneas por revisar (`dudosas`, `dudosasImportantes`) es un **derivado en memoria de main** para toda canción que derive «Lista para revisar», tenga o no registro `preparacion`. Se calcula en segundo plano tras el arranque, al quedar listos los picos y tras cada escritura de la letra. No se escribe en disco ni se crea un registro.
- El resumen lo expone como `revision: { dudosas, dudosasImportantes } | null`, y `biblioteca.recuentoRevision(id)` lo calcula al momento. Biblioteca y editor toman la misma decisión. `preparacion.dudosas` en disco solo sirve de valor inicial (tarea 0377).

## Revisión 2026-11-22 · Medida con canciones reales y guardas de prudencia (preguntas 0275, 0276, 0277 y 0279)

**Provisional** hasta repetir la medida con canciones revisadas a mano por el usuario (pregunta [0280](../preguntas/0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)).

### Qué se midió y qué se puede concluir

`qa` midió con 18 canciones de la biblioteca del MVP del usuario ([medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)). 16 de las 17 letras con tiempos son LRC de LRCLIB sin fines y sin revisar a mano.

| | Calibración de §1 (10 canciones revisadas, con fines) | 17 LRC casi sin fines, sin revisar |
|---|---|---|
| Propias aceptadas | 10/10 | 8/17 |
| Ajenas aceptadas | 0/90 | 6/272 (9 sin fines, 18 con fines prudentes) |
| Desplazadas ±0,8 s corregidas | sí, salvo la canción sin huecos | 0/34; 14/34 siguen saliendo `coincide` |
| Voz detectada ≥ 90 % entre la primera y la última línea | no se midió (se citó una canción «sin huecos») | 8 de 17 |

Lo que **sí** se concluye (no depende de que las letras estén revisadas):

1. **Sin fines, F apenas cambia al desplazar la letra.** Cada línea ocupa hasta el inicio de la siguiente, así que mover la letra 0,8 s mueve muy pocos bloques. La ganancia a ±0,8 s tiene una mediana de 0,006, y el mínimo para proponer es 0,02. Con estas letras, la búsqueda de d\* **no puede** detectar un desfase de 0,8 s, y `coincide` no descarta que la letra esté desplazada. Es un **límite del método**, no un defecto de código.
2. **Con la voz casi continua, F no distingue una letra de otra.** Todas las ajenas aceptadas, en las tres variantes, caen sobre voces con ≥ 91 % de voz detectada. Una ajena llega a F = 0,989. Ningún umbral de F ni de `detectarVoz` las separa (lo midió `qa` de −30 a −12 dB). También es un límite del método.
3. **La regla del veredicto tiene un defecto** (pregunta 0276). Un `d*` espurio, de curva plana y con `desfaseVariable`, convierte en `no_coincide` («puede ser otra versión») letras que en d = 0 cumplen F ≥ 0,88 e I ≥ 0,95. §1 decía «veredicto sobre d\*» y «un desfase variable no se corrige». La implementación (tarea 0297) leyó la segunda frase como «desfase variable ⇒ `no_coincide`» aunque d = 0 ya coincidiera, y la calibración de §1 contaba la canción rápida como `coincide`. La regla era ambigua y se corrige aquí.
4. Una ajena sale `desfasada` con d\* = +5000 ms, justo en el borde de la búsqueda. Un máximo en el borde no es un pico encontrado.

Lo que **no** se concluye: si las constantes valen con letras **revisadas y con fines**. Esta biblioteca no tiene ninguna. Tampoco cuántas letras correctas aceptaría la regla nueva con ese material. **No se recalibra ninguna constante** con esta muestra.

### Decisión

En el producto rige el criterio más prudente: una falsa aceptación o una corrección automática equivocada son peores que decir «no está claro».

**1. Regla del veredicto (corrige §1).** `vMejor` y `v0` son los veredictos de F/I en d\* y en d = 0.

| Caso | Veredicto |
|---|---|
| \|d\*\| < 500 ms | El mejor de `v0` y `vMejor` (orden `coincide` > `dudosa` > `no_coincide`). Un d\* pequeño es el sesgo propio de la medida |
| Se cumple la regla de corrección de §1 **y** d\* no está en el borde de la búsqueda | `desfasada` |
| `v0 = coincide` y no se propone corrección | `coincide`. Un d\* de curva plana o un desfase variable no tapan lo que ya se ve en d = 0 |
| `vMejor = coincide`, `v0 ≠ coincide` y `desfaseVariable` | `no_coincide` (otra versión: spec 05, F4-L2) |
| `vMejor = coincide`, `v0 ≠ coincide` y no se propone corrección (ganancia corta, I peor o borde) | `v0` |
| Resto | `vMejor` |

- **Borde**: d\* es el primer o el último valor de la rejilla de desfases. La rejilla está acotada por ±`desfaseMaxMs` y por la regla de «nunca saca una línea del audio».
- **`desfaseVariable`** exige además que al menos una de las dos mitades tenga ganancia de F ≥ `gananciaMinimaF` sobre su propia F(0). Dos mitades de curva plana dan d\* de ruido, y eso no es un desfase variable.

**2. Guardas de fiabilidad (nuevas).** Solo actúan sobre un veredicto `coincide` o `desfasada`:

```ts
// En PARAMETROS_ENCAJE (provisionales, revisión 2026-11-22):
densidadVozMaxima: 0.9,       // voz detectada / tiempo entre el inicio de la primera línea y el fin de la última
desfaseSensibilidadMs: 800,   // el desfase más pequeño que la comprobación debe poder ver
contrasteMinimoF: 0.02        // = gananciaMinimaF: lo que F debe bajar si la letra se mueve 0,8 s
```

- **`densidadVoz`**: bloques con voz dividido entre los bloques de `[inicio de la primera línea, finEfectivo de la última)`. Se mide con el desfase del veredicto y en tiempo de audio, recortado al audio. Si es ≥ 0,90, el veredicto pasa a `dudosa` con `limitacion: "vozContinua"`.
- **`contrasteF`**: `F(dv) − máx(F(dv − 800), F(dv + 800))`. `dv` es d\* con `desfasada` y 0 en el resto. Solo cuentan los lados que están dentro de la rejilla; si no hay ninguno, el contraste es 0. Si es < 0,02, el veredicto pasa a `dudosa` con `limitacion: "sinContraste"`. En palabras: «coincide» solo se afirma si la comprobación **habría notado** la misma letra movida 0,8 s. El umbral es la ganancia que §1 exige para proponer una corrección, así que no es una constante nueva calibrada a ciegas.
- Con `limitacion`, `desfaseMs` se sigue informando (d\*), pero **no es una propuesta**. `lineasSinVoz` y `tramosVozSinLetra` se calculan en d = 0.
- `ResultadoEncaje` gana `densidadVoz`, `contrasteF` y `limitacion: "vozContinua" | "sinContraste" | null`. `EncajeCandidato` (IPC de la vista Letra y de la preparación) gana `limitacion?: … | null`, con lectura tolerante.
- `no_coincide` y `no_comprobable` no cambian.

**3. Quién usa el veredicto.** Los llamadores no cambian de regla: la prudencia ya está dentro del veredicto.
- **Elección automática** (ADR 0025 §3, criterio 3): sigue exigiendo `coincide` o `desfasada`. Con las guardas, una letra con limitación es `dudosa` y la canción va a «Elige la letra» (motivo `duda`).
- **Corrección automática** (comprobación diferida, paso `comprobando` de la preparación y «Usar esta letra» de un candidato `desfasada`): solo con `desfasada`, que ahora implica contraste suficiente, voz no continua y d\* fuera del borde.
- **Editor y vista Letra**: `dudosa` con limitación muestra un texto propio que explica por qué no se puede comprobar. La spec la pide al diseñador (tarea 0379). Hasta entonces se ve el texto genérico de `dudosa`, que no afirma nada.

**4. Fines prudentes para estimar d\*** (opción A de la pregunta 0275): **no se adoptan**. Corregirían 36 de 102 desplazamientos con un sesgo fijo de −100 ms, pero suben las ajenas y el criterio de la pregunta 0222 no se cumple. Se vuelve a medir con canciones revisadas: la tarea 0381 añade las cifras.

**5. `gananciaMinimaF` más baja para letras sin fines** (opción B de la pregunta 0275): **no**. Con 0,005 recupera 9 de 102 desplazamientos, y 6 de las correcciones quedan a más de 200 ms.

**6. Líneas dudosas (pregunta 0279)**: **sin cambios** en umbrales ni motivos.
- `finCorta` en fines por palabra del MVP y `muyCorta` en canciones rápidas o con fines prudentes señalan cosas que conviene escuchar.
- Una línea que acaba más allá del audio ya se señala (`sinVoz`, importante). La lectura no la recorta: no se cambian datos del usuario al leer.
- El objetivo «≤ 10 %» se mide **solo** con canciones revisadas a mano. Con letras sin revisar es informativo.

### Efecto esperado en la biblioteca medida (a confirmar por `qa`; no es una calibración)

- Ajenas aceptadas: de 6/272 a **0**, porque todas caían en voces continuas.
- Propias `coincide`: de 8/17 a **4 como mucho**. Las 8 de voz continua pasan a «No está claro», y de las 4 restantes (2, 6, 10 y 16) decide el contraste.
- Desplazadas ±0,8 s que salen `coincide`: de 14/34 a **0** previsto.

Con LRC sin fines la app dirá «No está claro» casi siempre, y la preparación no elegirá sola. Es el comportamiento buscado mientras el método no sea fiable con ese material.

### Medida pendiente

| Medida | Quién | Para qué |
|---|---|---|
| `calibrar:encaje` (con 0378 y 0381) sobre la copia de las 18 canciones | `qa`, ya: la copia está en su equipo | Confirmar la seguridad: 0 ajenas aceptadas, 0 desplazadas ≥ 0,8 s que digan `coincide`, 0 propias `desfasada` y 0 correcciones automáticas con error > 200 ms |
| `calibrar:encaje --variantes` y `calibrar:dudosas` con ≥ 8 canciones **revisadas a mano con fines**, mejor de varios artistas y con alguna de voz continua | el usuario (o `qa` con una copia que el usuario prepare) | Saber si las guardas rechazan demasiadas letras buenas; recalibrar `densidadVozMaxima`, `contrasteMinimoF` y los fines prudentes con nota aquí |

Tareas: [0378](../tareas/0378-encaje-veredicto-en-d0-y-guardas-de-fiabilidad.md) (`encaje.ts`), [0379](../tareas/0379-limitacion-del-encaje-en-la-interfaz.md) (interfaz) y [0381](../tareas/0381-calibrar-encaje-con-guardas-de-fiabilidad.md) (script).

## Revisión 2026-11-22 · Resultado con las guardas: 0/17 coincide (pregunta 0295)

Medida con 0378 y 0381 sobre la copia de las 18 canciones:
- **Seguridad: cumple.** 0/272 ajenas, 0 desplazadas ≥ 0,8 s aceptadas, 0 propias `desfasada` y 0 correcciones equivocadas, en tal cual y sin fines.
- **Utilidad: nula con LRC sin fines.** Propias `coincide`: 0/17 (sin guardas serían 12/17). El contraste de F a 0,8 s es < 0,02 en 16 de 17 canciones (mediana 0,002), incluidas las de voz no continua. La previsión de la revisión anterior («4 como mucho») era optimista.
- Las 4 `no_coincide` son 5, 8 y 15 (veredicto correcto: otra versión o desfase creciente) y 17 (falso, porque sus fines por palabra cortan la voz).

Decisión: **no se recalibra**. Las guardas se quedan. Se mide una señal por **inicios** (arranques de voz tras una pausa, corregidos por el azar), con criterio cerrado de adopción, en la tarea [0385](../tareas/0385-medir-el-encaje-por-inicios-en-letras-sin-fines.md). La otra vía es la confianza de la alineación forzada (§1, opción D; ADR 0028). Hasta que una de las dos cumpla, la elección automática de la feature 5 no elige letras de LRCLIB sin fines (ADR 0025).
