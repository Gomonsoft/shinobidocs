# Factibilidad técnica · Varios cantantes y coros

- Versión: sin asignar (exploración durante la definición de 0.2.2). Acompaña a la [exploración de UX](varios-cantantes-y-coros.md) y a la [propuesta 036](../../../propuestas/036-varios-cantantes-y-coros.md).
- Autor: Arquitecto. Fecha: 2026-11-22.
- Estado: **exploración, sin autorizar**. No cambia el [plan](../plan-4.md), el [backlog](../backlog.md), los ADR, las tareas ni las specs. Mis decisiones abiertas llevan la opción recomendada como **provisional** y están en la pregunta [0165](../../../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md). La respuesta a la pregunta del diseñador está en [0161](../../../preguntas/0161-viabilidad-tecnica-de-varios-cantantes-y-coros.md).
- Base comprobada: código de `develop` (0.2.1 publicada, commit `42a53e0`) y documentación de la rama `version-0.2.2` del submódulo. Las rutas de código son relativas a `app/src/` salvo que se diga otra cosa. **[C]** = comprobado en el código o en el ADR citado; **[S]** = supuesto, sin comprobar.

## Veredicto

| Etapa | ¿Factible? | Tamaño | Tareas aprox. | Prueba técnica previa |
|---|---|---|---|---|
| 1 · Líneas enteras, carriles, colores e insignia | Sí, sin tocar las reglas de la letra | M–L | 9 | No |
| 2 · Voz original en los coros | Sí. En el reproductor es barato; en el editor cuesta más de lo que supone la exploración (el motor del editor solo hace sonar una pista) | S–M | 5 | No (sí una prueba manual de chasquidos) |
| 3 · Voces a la vez | Sí, pero toca la regla central de la letra (ADR 0006) y unos 20 archivos de hoy más 5 de 0.2.2 | L | 12–15 + prueba | **Sí** |
| 4 · Cambio de cantante dentro de una línea | Sí, sobre los tiempos por palabra | M | 6–8 | Solo si depende de la feature 10 |

Total de las etapas 1 y 2: unas **14 tareas**, una cuarta parte de las 56 de 0.2.2. **Recomiendo una versión propia, 0.2.3, con las etapas 1 y 2**, y las 3 y 4 en 0.3.0. Coincido con el diseñador en el sitio. En 0.2.2 conviene hacer **ya** seis ajustes baratos (§8.3), que no cambian nada visible.

## 1. Modelo de datos y compatibilidad

### 1.1 Lo que hay hoy

- **[C]** Una línea tiene `id`, `tipo`, `texto`, `inicio_ms`, `fin_ms`, `palabras` y `origen_palabras`. El esquema es `z.object`, que en Zod 4 **descarta las claves desconocidas** (`shared/letra.ts:11-27`). `letraSchema` también es `z.object` (`letra.ts:254-265`), igual que `estiloSchema` y `estilo.letra` (`shared/estilo.ts:56-65`).
- **[C]** `cancion.esquema` es 1 (`shared/cancion.ts:7`). Al leer, `migrarCancion` valida con `cancionSchema` (`shared/migraciones.ts:75-78`). El índice de main guarda **el objeto ya validado**, sin las claves que no conoce. `ServicioBiblioteca.actualizar` aplica cada cambio sobre ese objeto y lo escribe entero (`main/biblioteca/servicio.ts:384-392`). Por eso **cualquier escritura** de una canción (letra, estilo, datos, pasos, Lista) pierde los campos que esa versión no conoce. No solo las ediciones de la letra.
- **[C]** El editor guarda los tiempos con `letras.guardarTiempos`. Su esquema de IPC es estricto (`shared/letrasBusqueda.ts:93-107`). Main parte de la línea guardada con `...guardada` (`main/letras/servicio.ts:288-333`), así que conserva los campos que el IPC no trae.
- **[C]** La vista Letra («Corregir la letra») aplica el texto con `aplicarTextoEditado`. Esta función **reconstruye cada línea emparejada campo a campo**: `id`, `tipo`, `texto`, `inicio_ms`, `fin_ms` y `palabras` (`shared/letras/editar.ts:88-100`). Pierde `origen_palabras` y perdería cualquier campo nuevo por línea. **Hallazgo aparte de esta función:** hoy, corregir en la vista Letra una línea que no cambia le quita el `origen_palabras: "manual"`. Sus palabras hechas a mano dejan de pintarse. El ADR 0021 (tabla de §4, «una línea emparejada conserva tiempos y palabras») dice lo contrario. Ningún test lo cubre (`shared/letras/*.test.ts`). Lo mismo les pasaría a `origen_fin`, `revisada` y `alineacion` de la tarea 0296.

### 1.2 Dónde va cada dato (provisional, 0165 §1)

El boceto del diseñador (exploración §2.4) me vale con tres precisiones:

```jsonc
"letra": {
  "partes": {                                    // opcional; ausente = un solo cantante
    "cantantes": [ { "id": "c1", "nombre": "Ana" }, { "id": "c2", "nombre": "Luis" } ],  // 1–4, ids c1…c4
    "voz_en_coros": 0.5                          // etapa 2; 0–1 en pasos de 0,05; ausente = 0,5
  },
  "lineas": [ { "id": "…", "tipo": "linea", …, "parte": "c2" } ]   // "c1"…"c4" | "todos" | "coro"; ausente = "c1"; nunca en pausas
}
"estilo": { "letra": { …, "colores_partes": { "c2": "#4ADEDE", …, "todos": "#B388FF", "coro": "#FF9F1C" } } }  // opcional, por ranura
```

1. **Lectura tolerante por campo**, como `editor.paneles` (ADR 0006, revisión de 0.2.0). Si `parte` vale algo fuera del catálogo o apunta a un cantante que no existe en `partes`, se lee como `c1`. Un nombre vacío o de más de 40 caracteres se lee como «Cantante N». Un color no válido en `colores_partes` se lee como el predeterminado de su ranura. Nada de esto deja la canción ni el tema como dañados. Al escribir, main valida de forma estricta.
2. **`partes` vive en la letra, no en la raíz de la canción**, porque la letra tiene un solo escritor (`ServicioLetras`, `main/letras/servicio.ts:73`) y así el reparto viaja con ella por el historial del editor, el paquete y la sesión. Si se sustituye la letra entera (otra letra de LRCLIB), el reparto se pierde: las líneas son otras.
3. **Escritura**: un campo opcional `parte` por línea en `tiempoElementoSchema` y un campo opcional `partes` en `guardarTiemposSchema`. Es el mismo camino que ya sigue `revisada` en 0.2.2 (ADR 0024 §4: «viaja en `letras.guardarTiempos` […]; no hay canal nuevo»). Sin canal nuevo.

**Versión del esquema**: **no sube** (sigue en 1). Es la regla de ADR 0006 (revisión de la fase 3: «un campo opcional con equivalencia por defecto no sube `esquema`»). Ausente equivale a una canción de un solo cantante, que es lo que pinta una versión anterior.

### 1.3 Qué pasa al abrir y al guardar con versiones anteriores

| Versión que abre una canción con reparto | Al abrir | Al guardar cualquier cosa de esa canción |
|---|---|---|
| 0.2.1 | **[C]** Se abre sin error. Descarta `parte`, `partes` y `colores_partes` y pinta un solo cantante con `color_resaltado`. | **[C]** Se pierde el reparto (`servicio.ts:384-392`). Si 0.2.1 guarda un tema, se pierden sus `colores_partes`. Es la pérdida aceptada de ADR 0018 §1 y de 0022 §1. |
| 0.2.2 tal como está definida | Igual que 0.2.1. | Igual que 0.2.1. |
| 0.2.2 con los campos **reservados** (§8.3, ajuste 1) | Los lee con tolerancia y no los usa. | **Los conserva.** |
| Sesión y ventana secundaria | **[C]** La entrada viaja validada con `letraSchema` y `estiloSchema` (`shared/sesion.ts:213-226`), así que en 0.2.3 el reparto llega solo. | — |

**El diseñador dice que los campos nuevos se descartan al leer: es correcto** (`letra.ts:11`, `estilo.ts:59`). Añado un caso que la exploración no recoge: **el paquete de canción de la feature 9**. Main serializa `cancion.json` «desde el índice en memoria» (ADR 0027 §2) y, al importar, valida con `cancionSchema` y materializa el archivo (ADR 0027 §3). Así:

- un paquete de 0.2.3 importado en 0.2.2 **entra sin aviso** (`esquema_cancion` sigue en 1, así que no salta `CANCION_MAS_NUEVA`) y pierde el reparto en la primera escritura;
- un paquete creado en 0.2.2 con una canción de 0.2.3 (tras volver a 0.2.2) ya sale sin reparto.

**Recomiendo que 0.2.2 reserve los campos** (0165 §2). Comparo las dos formas de hacerlo:

| Opción | Pros | Contras |
|---|---|---|
| **A. Reservar los tres campos con nombre** (`lineas[].parte`, `letra.partes`, `estilo.letra.colores_partes`): opcionales, tolerantes, conservados y sin uso | Explícito. No abre la puerta a claves arbitrarias. El IPC sigue siendo estricto (ADR 0008). Coste: un criterio en 0296 y otro en 0287. | Fija la forma antes de que el usuario apruebe la UX. Si 0.2.3 la cambia, 0.2.2 descarta la nueva, que es lo mismo que pasa hoy. |
| B. `z.looseObject` en la letra y en sus líneas (conservar todo lo desconocido) | Protege también campos futuros que hoy no se conocen. | Un campo futuro que dependa de los tiempos se conservaría sin revalidar. La validación de la letra deja de ser una lista blanca. Cada lector y cada escritor (`aplicarTextoEditado`, `normalizarLetra`) tendría que propagar claves que no entiende. |
| C. No hacer nada | Cero coste. | Paquetes y vuelta atrás pierden el reparto sin aviso. |

### 1.4 `.lrc` (feature 9)

- **[C]** `exportarLrc` escribe una marca por línea y marcas vacías para los fines (ADR 0027 §4). Las partes no cambian eso.
- **[S]** No hay un estándar de cantantes en LRC. Coincido con la decisión 19 del diseñador: **no escribir partes**.
- **Añado (provisional, 0165 §8)**: en 0.2.3, escribir **entre paréntesis** las líneas de coro que no los tengan. Es la convención de las letras de LRCLIB que el propio diseñador usa para sugerir «Marcarlas como coro». Así, al reimportar el `.lrc`, la sugerencia las vuelve a encontrar. No afecta a 0.2.2.

## 2. Audio

### 2.1 Lo que hay hoy

- **[C]** La separación produce **dos pistas: voz e instrumental** (`pistasSchema`, `shared/cancion.ts:32-40`; `pistas.ts:1-11`). Los dos modelos aceptados son de dos salidas: MelBand RoFormer (Kim), «Calidad», y UVR MDX-Net Inst HQ4, «Rápido» (ADR 0004, revisión del 2026-11-05). **Ninguno separa la voz principal de los coros.**
- **[C] Reproductor y ventana secundaria** (`MotorReproductor`): dos fuentes, instrumental y voz, con el mismo `when`. La voz pasa por su propio `GainNode` antes de la maestra (`karaoke/motorReproductor.ts:63`, `124-128` y `210-235`; ADR 0011 §3). La velocidad es siempre 1 (`:226`). Buscar vuelve a arrancar las fuentes (`:260-265`). `fijarVoz` cambia la ganancia al momento (`:292-295`).
- **[C] Editor** (`MotorAudio`): **una sola pista suena cada vez** («conmuta entre original, voz e instrumental», ADR 0011, contexto; `karaoke/motorAudio.ts:59-69` y `271-307`). Tiene bucle con `loopStart`/`loopEnd`, velocidad 0,5 o 0,75 con `playbackRate` y un tramo estirado con el tono conservado (WSOLA) **de esa única pista** (`:290-305`, `347-353`). Como mucho guarda dos `AudioBuffer` (LRU). **Aquí la exploración se equivoca**: dice que «el motor de audio ya tiene una ganancia propia para la voz», pero eso solo es cierto en el reproductor. En el editor no hay ninguna voz sonando junto al instrumental.
- **[C] Exportación**: `mezclar(instrumental, voz, ganancia_db)` en numpy, con la voz al 100 % o sin voz y una normalización de pico constante (`worker/shinobi_worker/exportar.py:43-53` y `76-85`; ADR 0019, worker).

### 2.2 Propuesta: una sola función pura del tiempo, tres consumidores (provisional, 0165 §3)

- **`shared/coros.ts`** (nuevo, puro): `tramosCoro(letra, duracionMs)` devuelve los tramos en **tiempo de audio** (con `offset_ms`): del inicio de la primera línea de coro − 150 ms al `finEfectivo` de la última + 300 ms, uniendo las líneas separadas por menos de 1 s. `envolvente(tramos, nivel)` devuelve los puntos de una curva lineal a trozos, con rampas de 150 ms. Es el mismo patrón que el modelo de render (ADR 0022 §2): el mismo instante da lo mismo en todas partes, y se prueba con números.
- **Reproductor y secundaria**: la ganancia de la voz pasa a ser `máx(nivel de voz guía, envolvente(t))`. En cada `arrancar` (reproducir, buscar) y en cada `fijarVoz` se cancelan los valores programados y se programan los puntos que quedan desde la posición actual con `setValueAtTime` y `linearRampToValueAtTime`, en el reloj del `AudioContext` (`cuando + (ms − desde)/1000`). Son unas pocas decenas de sucesos por canción.
  - **Chasquidos** [S]: una rampa lineal de 150 ms sobre `GainNode.gain`, que se automatiza a la frecuencia de muestreo, no debería oírse. Se confirma en la guía manual.
  - **Búsqueda**: al buscar ya se vuelven a crear las fuentes, así que el nivel se fija directamente al valor de la envolvente en ese instante. No hay desfase porque todo se programa con el mismo `when` que las fuentes.
  - **Silencio previo** (posiciones negativas, ADR 0011 §3): sin caso especial, porque la envolvente está en tiempo de canción.
- **Editor (vista previa con «Instrumental»)**: no recomiendo una segunda fuente sincronizada en `MotorAudio`. Habría que replicar el bucle (la automatización va en tiempo del contexto y el bucle da la vuelta en tiempo del buffer, así que habría que reprogramarla en cada vuelta) y estirar también la voz con WSOLA. Recomiendo una **pista derivada en memoria**, «instrumental con coros» = instrumental + voz × envolvente. Se calcula una vez por nivel y reparto (una suma de muestras de unos 10 millones de valores para 4 min; [S] decenas de ms, se puede hacer en el worker de estiramiento) y entra en `MotorAudio` como una pista más. Así el bucle, la velocidad, el tono conservado y la búsqueda funcionan sin tocarlos. Coste: unos 85 MB más mientras está en uso (ADR 0010, opción A) y subir el LRU a 3 buffers, o liberar la voz tras mezclar.
- **Exportación «Solo instrumental» con la casilla marcada**: main pasa al worker los puntos de la envolvente (`audio.voz_envolvente: [[ms, nivel], …]`) y el worker hace `mezcla += voz × np.interp(t, …) × g`. Con «Instrumental y voz», la voz va al 100 % como hoy. Es un cambio de pocas líneas en `exportar.py`, más su validación en `_validar`. La exportación por lotes (feature 8, tarea 0321) tendrá que llevar la misma casilla (0.2.3).

### 2.3 El límite de la voz separada

- **[C]** La pista `voz.flac` lleva **toda la voz**: principal y coros juntos (dos salidas en ADR 0004). La exploración lo cuenta bien (§5.5). La voz guía de los coros funciona cuando el coro canta solo (respuestas, ecos) y deja oír a la voz principal si canta a la vez.
- **Incógnita**: hay modelos públicos que separan la voz principal de los coros, por ejemplo el Mel-Band RoFormer «karaoke» de aufr33 y viperx. Su punto de control está en Hugging Face y MVSEP publica sus medidas (voz principal ≈ 10,4 dB de SDR). **No he podido comprobar la licencia de sus pesos**: el repositorio de Hugging Face no la declara, y solo una conversión de un tercero dice «MIT». Por la regla del ADR 0004 («excluidos hasta que sus pesos tengan una licencia libre verificable»), hoy **no entra**. Cómo se comprobaría: (1) un archivo `LICENSE` o una ficha de modelo de los autores originales en su repositorio o en sus notas de publicación; (2) si aparece, una prueba técnica en `docs/spikes/` con 3 canciones del usuario que tengan coros, que mida el tiempo extra en CPU (sería una segunda pasada sobre `voz.flac`) y si los coros separados son útiles; (3) un ADR que revise el 0004. Es la fila «Voz principal y coros por separado» del plan y no bloquea las etapas 1 y 2.

## 3. La regla de los inicios crecientes (ADR 0006) y lo que depende de ella

### 3.1 Etapas 1 y 2: confirmo que no la tocan

**[C]** Asignar una parte no cambia ni el orden ni los tiempos. `validarInvariantesLetra` (`letra.ts:68-125`), `finEfectivo` (`:310-348`), `moverInicioLinea` (`:377-437`), `limitesInicio` (`shared/letras/tiempos.ts:54-72`), `proponerAjusteSilencios` (`shared/silencios.ts:162-192`) y el modelo de render (`karaoke/render.ts:114-157`, búsqueda binaria sobre una sola secuencia) siguen igual. Las features 4, 10 y 11 tampoco notan nada: miran la pista de voz entera, que contiene a todos los cantantes.

### 3.2 Etapa 3: qué se rompe

Hoy hay dos reglas: (a) **inicios estrictamente crecientes** en toda la letra (`letra.ts:88-96`); (b) un fin fijado y las palabras terminan **antes del inicio del siguiente elemento con inicio** (`:98-121`). La regla (b) es la que impide que dos líneas se solapen. La exploración propone relajar las dos «por parte».

**Propuesta más barata (provisional, 0165 §4)**: **mantener (a) en toda la letra y relajar solo (b)**, para que mire «el siguiente de la **misma parte**». Dos líneas que empiezan juntas se separan 1 ms (inaudible), así que el orden de la lista sigue siendo el orden de los inicios. Esto conserva:

- el orden del array y la búsqueda binaria del render;
- la lista, la línea de tiempo y el modo al ritmo, que marca inicios en orden: no hace falta un modo al ritmo «por parte», aunque sigue siendo cómodo;
- `limitesInicio` y `moverInicioLinea`, que solo miran inicios. La limitación es que el inicio de una línea no puede adelantar al de otra, de cualquier parte. Me parece aceptable.

Aun así, todo lo que usa «la siguiente» como límite del fin tiene que pasar a «la siguiente de su parte»:

| Pieza | Dónde [C] | Cambio |
|---|---|---|
| Invariantes y palabras | `letra.ts:98-121`, `validarPalabras`, `palabrasVisibles` | Límite = siguiente de la misma parte. |
| `finEfectivo` | `letra.ts:310-348` | Fin automático hasta la siguiente de la misma parte. Si no, una línea solapada se cortaría en el inicio de la otra voz. |
| Tiradores y límites del fin | `tiempos.ts`, `PistaSincronia.tsx:204-218`, `estado.ts` | Por carril. |
| «Ajustar los silencios» | `silencios.ts:177-192` | Hueco hasta la siguiente de la misma parte. La voz detectada mezcla a los dos cantantes, así que en los solapes no sabe de quién es el silencio: **excluir los grupos simultáneos**. |
| Render y feature 1 | `render.ts`, `pantalla.ts` (0288–0290) | Relevo y dos tiempos **entre grupos**. Varias activas a la vez. El grupo ocupa un puesto (exploración §6.4). Es lo más caro. |
| Encaje (F4) | `shared/encaje.ts` (0297), ADR 0024 §1 | Usa los intervalos `[inicio, finEfectivo]`. Con solapes hay que fusionarlos para no contar dos veces la voz. Pequeño. |
| Dudosas (F11) | `shared/dudosas.ts` (0334), ADR 0024 §3 | `FIN_EN_VOZ` («la siguiente empieza ≥ 1 s después») y `FIN_TARDIO` darían falsos positivos en los solapes: excluir las líneas de un grupo de esos dos motivos. |
| Alineación forzada (F10) | ADR 0028 §2, ventana `[inicio − 250 ms, inicio de la siguiente)` | [S] La alineación CTC busca **un** camino monótono para **un** texto. Con dos textos cantados a la vez sobre la misma pista no hay un camino válido para los dos. Los grupos simultáneos se excluyen (se conservan los tiempos a mano) y la ventana de las demás pasa a «la siguiente de su parte». |
| Exportar `.lrc` (F9) | ADR 0027 §4 | Las marcas vacías de fin solo cuando no hay solape. Los inicios salen igual. |
| Revisión, «Está bien» (F11) | ADR 0024 §4 | `revisada` compara `finEfectivo`. Cambiar la regla del fin automático invalida las revisiones de las líneas afectadas: hay que anotarlo en la migración (no se reescribe nada, solo vuelven a poder señalarse). |

Tamaño: hoy **16 archivos que no son de prueba** usan estas reglas (`finEfectivo`, `limitesInicio`, `validarInvariantesLetra` y vecinos; búsqueda en `shared/`, `karaoke/` y `vistas/editor/`), y 0.2.2 añade cinco más (`encaje.ts`, `dudosas.ts`, alineación, `lrc.ts` y el modelo de puestos). **Hace falta una prueba técnica antes**: (1) la regla «inicios globales + fin por parte» contra 3 dúos reales sincronizados a mano; (2) el modelo de grupos de la feature 1 con la letra sintética de los tests de 0288 y alturas de 3 y 4 renglones; (3) la medida de nodos y de fotogramas en un equipo modesto (§4.3). Es una etapa de una versión (0.3.0), no de una entrega.

## 4. Letra en pantalla y exportación por fotogramas

### 4.1 Lo que hay hoy

- **[C]** Los colores son variables CSS de la raíz: `--k-color` y `--k-resaltado` (`karaoke/estiloCss.ts:39-40`). La capa de barrido pinta en `var(--k-resaltado)` (`pantallaLetra.module.css:53-56`) y los indicadores de espera también (`--k-indicador`, `:17`). **Una variable CSS se hereda**: basta con fijar `--k-resaltado` (o la `--k-color-base` de ADR 0022 §3) en el nodo de cada línea para que su barrido y su subrayado tomen otro color sin tocar nada más. El subrayado va en la misma capa con `text-decoration`, cuyo color por defecto es `currentColor` (ADR 0022 §5).
- **[C]** El ancho de la línea es un 88 % fijo en el CSS (`pantallaLetra.module.css:30` y `:141`), y la reducción por longitud busca que quepa en 2 renglones (`PantallaLetra.tsx:258-262`).
- **[C]** ADR 0022 §3 ya define `disponerBloque` con **alturas medidas e inyectadas** por línea (`altura_S`), no con «1 o 2 renglones». La regla de los 2 renglones vive en la reducción por longitud (decisión 9), no en la geometría.

### 4.2 Los cuatro ajustes que pide el diseñador

| Ajuste | Tarea | ¿Lo acepto? | Qué cambia exactamente en el contrato | Coste en 0.2.2 |
|---|---|---|---|---|
| **a. Color de barrido por línea** | 0290 (y 0289 solo en la firma) | **Sí** | `PantallaLetra` fija en cada nodo de línea `--k-color-base` (y `--k-resaltado` en karaoke) con una función `colorDeLinea(id): string` que en 0.2.2 devuelve siempre `color_resaltado` (o `letra.color` en Letra lista). Los indicadores de espera toman el color de la línea que viene con la misma función. `LineaEnPantalla` **no** cambia: el modelo sigue sin saber nada del estilo (ADR 0022 §1, opción A). Para Letra lista con partes, `suelosDeOpacidad` ya calcula «para cada puesto atenuado y su color» (ADR 0022 §4): solo hay que dejar que el color sea un parámetro, no una lectura fija de `estilo.letra.color`. | Casi nulo: un criterio y un test en 0290 (y una línea en 0289). |
| **b. Ancho reservado a la izquierda** | 0290 | **Sí, en otra forma** | El 88 % pasa a ser una variable `--k-ancho-linea` (88 % en 0.2.2) que usan el CSS y la reducción por longitud. En 0.2.3 baja al 80 % con partes y la insignia se coloca, fuera del flujo, a la izquierda de la primera caja de renglón, que ya mide `medirBarridos` (`PantallaLetra.tsx:49-74`). Basta con un parámetro de ancho: no hace falta un «ancho reservado a la izquierda», porque el texto sigue centrado. | Nulo: un criterio en 0290. |
| **c. `disponerBloque` con alturas arbitrarias; la unidad pasa a llamarse «enunciado»** | 0289 | **En parte** | Las alturas ya son arbitrarias en el ADR. Pido solo que los tests de `pantalla.test.ts` incluyan alturas de **3 y 4 renglones** (apilado, crecimiento desde el centro y recorte del 86 % y el 10 %), para que nadie las limite a 1 o 2 sin querer. **No** renombro el tipo ni añado `filas` ahora: el grupo simultáneo es de la etapa 3 (0.3.0) y su forma depende de la prueba técnica de §3.2 y de lo que se aprenda al implementar la feature 1. Un campo que no se usa solo encarecería 0288 y 0290. | Nulo: un caso de test en 0289. |
| **d. Subrayado en el color de la línea y daltonismo con varios pares** | 0293 (subrayado) y **0294** (daltonismo, no 0293) | **Subrayado: sí, y es gratis** con el ajuste (a), porque el subrayado hereda el color de su capa. **Daltonismo: no hace falta cambiar la firma** | `confusionDaltonismo` va en la **0294**, no en la 0293 (ADR 0022 §5; tarea 0294, criterio 1). Una función que compara **un par de colores** (`confusionDaltonismo(a, b)`) ya sirve para N pares: el bucle es de quien la llama. Pido solo que sus parámetros no se llamen `letra` y `resaltado`, sino `a` y `b`, y que el aviso de 0.2.2 la llame con (letra, resaltado). Las reglas por parte (exploración §7.3) son de 0.2.3, en `evaluarContraste`. | Nulo: un criterio en 0293 (el test de que el subrayado toma el color del nodo) y una nota en 0294. |

**En total: 0.2.2 no se encarece de forma medible** (ninguna tarea nueva y unos cinco criterios repartidos entre 0289, 0290, 0293 y 0294). Se anotan como revisión del ADR 0022 cuando el usuario autorice esta función o, si lo prefiere, ya en 0.2.2 (son neutros).

### 4.3 Coste de render en la exportación

- **[C]** La exportación captura el mismo `PantallaLetra` fotograma a fotograma (ADR 0019 §2), así que el coste es el del DOM.
- **Etapas 1 y 2**: una insignia más por línea visible (como mucho N + 1 = 8, y 16 con las copias de «Fundido»), y una variable CSS por nodo. [S] Despreciable frente a la captura del fotograma.
- **Etapa 3**: en el puesto activo puede haber hasta 4 filas, cada una con su capa de barrido y su medición. En el peor caso, unos 4 nodos de barrido en el puesto activo y el doble de nodos durante un «Fundido». Se mide en la prueba técnica, junto con el riesgo que ADR 0022 ya anota (volver a rasterizar el texto escalado).

## 5. Editor

| Tema | Comprobado | Valoración |
|---|---|---|
| **Carriles en la línea de tiempo** | **[C]** Las regiones son botones DOM, uno por línea (`PistaSincronia.tsx:397-446`), de 32 px de alto centrados en una pista de al menos 48 px (`pistaSincronia.module.css:82-92`). La onda va en Canvas detrás, en la misma pista (ADR 0015, «La onda y el minimapa pintan en Canvas»; `PistaSincronia.tsx:386`). Alto por defecto de la pista: 76 px; mínimo, 48 (`vistas/editor/distribucion.ts:28-31`). | Factible. El número de nodos **no crece** con los carriles (sigue habiendo uno por línea), así que no hay riesgo de rendimiento con canciones largas. Los picos no cambian: hay una sola pista de voz. Dos carriles de 24 px más 28 de onda = 76 px, el alto de hoy. **Sugerencia para el diseñador**: dejar la onda **de fondo detrás de todos los carriles**, como hoy, en lugar de una fila «Voz» de 28 px. Es más legible y no cambia `PistaOndaVoz`. El «alto efectivo» que crece por carril encaja en el modelo de `distribucion.ts`, que ya separa el alto preferido del efectivo (ADR 0006, revisión de paneles). |
| **Arrastre entre carriles** | **[C]** Hoy el cuerpo de una región solo selecciona y escucha (`:416-419`). Los tiradores capturan el puntero (`:151-159`). | Factible. Hay que distinguir el clic del arrastre vertical por umbral, como en los tiradores. Riesgo bajo. |
| **Selección múltiple** | **[C]** El estado del editor tiene una sola selección (`estado.ts:104`, `seleccion: string \| null`). | Hay que añadir `seleccionadas` y mantener `seleccion` como la principal, para que todo lo de hoy siga igual. Toca el reducer, que es del lote C en 0.2.2: otro motivo para no meterla en 0.2.2. |
| **Deshacer** | **[C]** El historial guarda instantáneas (`estado.ts:102-103`, `pasado`/`futuro`). | Asignar una parte a N líneas es **un** paso sin trabajo extra. El guardado envía `parte` y `partes` con `guardarTiempos` (§1.2). |
| **Atajos** | **[C]** El editor no usa **C** (`atajos.ts:42-90`). La feature 11 añade R, N y Ctrl/Cmd + ↑/↓ (spec 06 · Feature 11). El editor preciso no usa C (`preciso/atajosPreciso.ts:45-90`). Con Alt, el editor solo atiende ← y → (`atajos.ts:55-67`; `useAtajosEditor.ts:41`). El menú de la app no tiene mnemónicos `&` (`main/menu.ts:27-91`). **Alt + ↑/↓** está libre. | **C** sirve. **Alt + 1…4** no choca con nada de la app. Hay dos trampas de teclado: en macOS, Opción + 1 cambia `e.key` (da «¡»), y en Windows AltGr llega como Ctrl + Alt (AltGr + 2 = «@» en el teclado español). Por eso hay que leer `e.code` (`Digit1`…) y exigir que no estén pulsados ni Ctrl ni Cmd. [S] Ningún sistema reserva Alt + dígito en una ventana normal. Provisional: se permite (0165 §6). **C** y Alt + 1…4 no deben actuar con el foco en la ventana del editor preciso. |
| **Convivencia con el editor preciso** | **[C]** La ventana trabaja con una línea y sus palabras (ADR 0021). | Sin cambios en las etapas 1 a 3. En la etapa 4 su tira de palabras es el sitio natural para pintar partes. |

## 6. Interacción con las once features de 0.2.2 (revisión técnica de la tabla del diseñador, §9.2)

| Feature | Diseñador | Revisión técnica |
|---|---|---|
| 1 · Letra en pantalla | Cambiar antes | **De acuerdo**, con los matices de §4.2: (a) y (b) sí; (c) solo como test. |
| 2 · Subrayado y daltonismo | Cambiar antes | **Corrijo**: el subrayado sale gratis con (a); la función de daltonismo está en la **0294**, y basta con nombrar sus parámetros de forma neutra. |
| 3 · Aviso de versión | No afecta | De acuerdo. |
| 4 · Comprobar la letra | Afecta (etapa 3) | De acuerdo. Hay que fusionar los intervalos solapados (§3.2). |
| 5 · Preparación desatendida | Afecta (opcional) | De acuerdo: que no marque coros sola. |
| 6 · Datos automáticos | No afecta | De acuerdo. |
| 7 · Importación por lotes | No afecta | De acuerdo. |
| 8 · Acciones por lotes | No afecta | **Corrijo a «Afecta (0.2.3)»**: el diálogo de «Exportar varias» (0321) y la exportación por lotes en main (0319) tendrán que llevar la casilla de los coros y la envolvente. Sin cambios en 0.2.2. |
| 9 · Copia, paquete y `.lrc` | Afecta; «la copia y el paquete llevan `cancion.json` entero» | **Corrijo**: se serializa **desde el índice en memoria**, ya validado (ADR 0027 §2), así que solo lleva lo que conoce la versión que lo escribe, y al importar se valida con `cancionSchema`. Sin el ajuste 1 de §8.3, un paquete de 0.2.3 pierde el reparto en 0.2.2 sin aviso. Sobre el `.lrc`: sin partes, pero con paréntesis en los coros (§1.4). |
| 10 · Sincronizar con la voz | Afecta (etapa 3) | De acuerdo. Además, la alineación CTC no puede con dos textos a la vez: los grupos se excluyen (§3.2). |
| 11 · Revisión guiada | Afecta (etapa 3) | De acuerdo. Añado que cambiar la regla del fin automático invalida `revisada` en las líneas afectadas. |
| Vista Letra (0.2.1, «Corregir la letra») | Conserva la parte; las líneas cambiadas heredan la de la anterior | **Factible**, pero `aplicarTextoEditado` reconstruye las líneas campo a campo (`editar.ts:88-100`) y hay que cambiarla para que propague todos los campos salvo el texto. Ya hoy pierde `origen_palabras` (§1.1). Conviene arreglarlo en 0296, que añade tres campos por línea más. |

## 7. Esfuerzo y riesgo

| Etapa | Tareas (aprox.) | Tamaño | Riesgo | Prueba previa |
|---|---|---|---|---|
| **1** | (1) contratos de datos e IPC, con la herencia en `aplicarTextoEditado`; (2) reducer: selección múltiple y asignar; (3) lista: chip, menú «¿Quién canta?», C y Alt + 1…4; (4) panel Sincronía; (5) línea de tiempo con carriles, «Juntar carriles», arrastre, Alt + ↑/↓ y alto efectivo; (6) Funciones › «Cantantes y coros»; (7) Estilo: colores por ranura y avisos de contraste y daltonismo; (8) render: color por línea, insignia, paréntesis, Letra lista e indicadores; (9) verificación e informe | M–L (≈ 9) | Medio-bajo: muchas piezas de interfaz, pero ninguna regla de datos. La 5 es la más delicada (distribución a 1024 × 576). | No |
| **2** | (10) `shared/coros.ts`; (11) automatización en `MotorReproductor` y secundaria; (12) pista derivada en el editor y «Escuchar»; (13) envolvente en el worker y casilla en los dos diálogos de exportación; (14) verificación | S–M (≈ 5) | Bajo en el reproductor y la exportación; medio en el editor (memoria y relevo del estiramiento). | Guía manual de chasquidos con 3 canciones |
| **3** | Prueba técnica + invariantes y `finEfectivo` por parte, render de grupos, carriles solapados, modo «Reparto», ajustes en F4, F10 y F11, verificación | L (12–15) | Alto: toca la regla central de los datos y el modelo de la feature 1. | **Sí** (§3.2) |
| **4** | Parte por palabra, barrido por tramos, modo «Partes» en el editor preciso, verificación | M (6–8) | Medio: depende de que haya palabras (a mano o de la feature 10). | Solo si se apoya en la feature 10 |

Comparación: las etapas 1 y 2 son unas **14 tareas** (≈ 25 % de las 56 de 0.2.2, similar a 0.2.1, que tuvo 27). Las cuatro etapas juntas rondarían 35–40.

**Etapa 4, sin tiempos por palabra** (pregunta del diseñador, 0161 §5): recomiendo `palabras[].parte` (opcional, ausente = la parte de la línea). El barrido por partes solo existe con palabras visibles (`palabrasVisibles`); sin ellas la línea entera usa la parte de la línea, y el editor lo dice. Descarto partir la línea en sublíneas enlazadas: rompería «una fila = una línea» en la lista, en la revisión (F11) y en el `.lrc`, y duplicaría ids que ya usan `revisada` y la alineación.

## 8. Dónde meterla

### 8.1 Recomendación

**Versión propia 0.2.3 con las etapas 1 y 2, después de `0.2.2-alpha.4`; etapas 3 y 4 en 0.3.0.** Coincido con el diseñador (su opción B) por motivos técnicos:

1. **Choca con los dueños de archivos de 0.2.2.** La etapa 1 es casi todo `vistas/editor/**`, el reducer `estado.ts` y `shared/letra.ts`. Son del **lote C**, que está ocupado de principio a fin de 0.2.2 (0296 → F4 → F11 → interfaz de F10; backlog, «Lotes paralelos»). La parte de render es del **lote B**, que queda libre tras alpha.1, pero sin la parte del editor no sirve. Meterla en 0.2.2 obliga a serializarla detrás de C, así que llegaría igual de tarde y alargaría la versión.
2. **Se apoya en código que 0.2.2 reescribe** (render de la feature 1, panel Funciones de las features 4 y 11, exportación por lotes de la 8). Hacerla después evita rehacer ese trabajo.
3. **Es temática y corta**, y su riesgo (interfaz del editor) es distinto del de 0.2.2 (flujo principal en main).

Si el usuario la quiere antes, el sitio menos dañino es una **feature 12 en alpha.4 solo con la etapa 1**, como dice el diseñador, con dos condiciones: que el lote C haya cerrado 0335 y que alpha.4 no se retrase por la prueba técnica de la feature 10. No lo recomiendo.

### 8.2 Orden respecto a las entregas de 0.2.2

`alpha.1` (3, 1, 2, 4) → `alpha.2` (6, 5, 11) → `alpha.3` (7, 8, 9) → `alpha.4` (10) → **0.2.3** (etapa 1 y etapa 2, que pueden ir en una sola alfa o en dos). La prueba técnica de la etapa 3 puede hacerse durante 0.2.3 en `docs/spikes/`, sin tocar código de producción.

### 8.3 Qué decidir o cambiar YA en 0.2.2 (todo sin efecto visible)

| N.º | Ajuste | Tarea | Por qué ahora |
|---|---|---|---|
| 1 | **Reservar los campos** `lineas[].parte`, `letra.partes` y `estilo.letra.colores_partes`: opcionales, tolerantes, conservados al escribir y sin uso | 0296 (letra), 0287 (estilo) | Para que 0.2.2 no pierda el reparto de una canción o de un paquete de 0.2.3 (§1.3). |
| 2 | **`aplicarTextoEditado` conserva todos los campos de una línea emparejada** salvo el texto (hoy pierde `origen_palabras`) | 0296 | Es un defecto actual frente a ADR 0021 §4 y afectaría a `origen_fin`, `revisada` y `alineacion` de 0.2.2. |
| 3 | **Color por línea** en `PantallaLetra` (`colorDeLinea`, variables por nodo) y color de los indicadores tomado de la línea que viene | 0290 (y 0289: color como parámetro de los suelos) | Evita reabrir la pieza de más riesgo de 0.2.2. |
| 4 | **Ancho de línea como variable** (`--k-ancho-linea`, 88 %) en el CSS y en la reducción por longitud | 0290 | La insignia de 0.2.3 lo necesita. |
| 5 | **Tests de `disponerBloque` con alturas de 3 y 4 renglones** | 0289 | Fija que la geometría no asume 1 o 2 renglones. |
| 6 | **Subrayado con el color del nodo** (test) y **`confusionDaltonismo(a, b)`** con nombres neutros | 0293 y 0294 | Subrayado gratis y función reutilizable. |

Lo que **no** cambio ahora: el tipo `LineaEnPantalla` (nada de «enunciado» ni `filas`), los canales de IPC y las reglas de la letra.

## 9. Discrepancias con el diseñador

1. **El editor no tiene ganancia de voz** (exploración §0 y §5.2): `gananciaVoz` solo existe en el reproductor. La vista previa con coros necesita una pista derivada. El coste de la etapa 2 en el editor es mayor de lo que dice la exploración (§2.2).
2. **Ajuste (c)**: las alturas ya son arbitrarias en ADR 0022 §3. No renombro el tipo ni añado filas ahora; basta con un test (§4.2).
3. **Ajuste (d)**: la función de daltonismo es de la tarea 0294, y no hace falta que reciba una lista (§4.2).
4. **Compatibilidad**: no basta con «pérdida aceptada». El paquete de la feature 9 la convierte en una pérdida silenciosa entre versiones. Recomiendo reservar los campos en 0.2.2 (§1.3).
5. **Etapa 3**: propongo mantener los inicios crecientes en toda la letra y relajar solo el fin por parte. Es más barato que «inicios crecientes por parte», pendiente de la prueba técnica (§3.2).
6. **`.lrc`**: sin partes, como dice el diseñador, pero con paréntesis en las líneas de coro (§1.4).
7. **Fila «Voz» de la línea de tiempo**: sugiero la onda de fondo detrás de los carriles (§5). Es una sugerencia; lo decide el diseñador.

## 10. Riesgos e incógnitas

- **[S]** Que no se oigan chasquidos con rampas de 150 ms. Se comprueba en la guía manual de 0.2.3.
- **[S]** El tiempo de mezclar la pista derivada en el editor y la memoria de un tercer buffer (≈ 85 MB por 4 min; 210 MB por 10 min). Se mide en la tarea.
- **Incógnita**: la licencia de los modelos que separan voz principal y coros (§2.3).
- **[S]** Que LRCLIB casi nunca marque quién canta, más allá de los paréntesis. Coincide con lo que vio el diseñador en la biblioteca del usuario, que no he vuelto a contar.
- **[S]** Que Alt + dígito no esté reservado por ningún gestor de ventanas de Linux habitual.
- **Etapa 3**: alto, ya cubierto con la prueba técnica previa.

## Fuentes

- Código: `shared/letra.ts`, `shared/cancion.ts`, `shared/estilo.ts`, `shared/migraciones.ts`, `shared/sesion.ts`, `shared/letrasBusqueda.ts`, `shared/letras/editar.ts`, `shared/letras/tiempos.ts`, `shared/silencios.ts`, `main/biblioteca/servicio.ts`, `main/letras/servicio.ts`, `main/menu.ts`, `renderer/src/karaoke/{render.ts, PantallaLetra.tsx, pantallaLetra.module.css, estiloCss.ts, contraste.ts, motorReproductor.ts, motorAudio.ts, pistas.ts}`, `renderer/src/vistas/editor/{atajos.ts, useAtajosEditor.ts, estado.ts, PistaSincronia.tsx, pistaSincronia.module.css, distribucion.ts, preciso/atajosPreciso.ts}`, `worker/shinobi_worker/exportar.py` (`develop`, 2026-11-22).
- ADR 0004 (revisión del 2026-11-05), 0006 (revisiones de 0.2.0 a 0.2.2), 0010, 0011 §3, 0015, 0018 §1, 0019, 0021 §4, 0022 §1–§5, 0024 §1, §3 y §4, 0027 §2–§4, 0028 §2.
- Tareas 0287–0290, 0293, 0294, 0296 y 0339; [backlog de 0.2.2](../backlog.md), «Lotes paralelos».
- Modelo de voz principal y coros (licencia sin confirmar): [repositorio en Hugging Face](https://huggingface.co/jarredou/aufr33-viperx-karaoke-melroformer-model/tree/main), [medidas en MVSEP](https://mvsep.com/algorithms/76), [conversión de un tercero que declara MIT](https://huggingface.co/AEmotionStudio/roformer-models/blob/main/README.md).
- Web Audio, programación de `AudioParam` (`setValueAtTime`, `linearRampToValueAtTime`, `cancelScheduledValues`): [MDN, AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam).
- Teclas con Opción en macOS y AltGr en Windows (`KeyboardEvent.code` frente a `key`): [MDN, KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).
