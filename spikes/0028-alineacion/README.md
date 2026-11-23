# Prueba técnica de la alineación forzada (ADR 0028, tarea 0328)

Prueba de concepto desechable (no es código de producción, no se empaqueta ni se importa desde `app/` o `worker/`). Esta carpeta contiene los scripts y el resultado de la **fase 1 · filtro**; la decisión (fase 2, con fines hechos a mano) está pendiente. **Aquí solo hay cifras e ids abreviados: ninguna letra, título, artista ni audio.** Los resultados intermedios con texto (en esta prueba no se guarda texto: solo tiempos) quedan fuera del repositorio.

Estado: **borrador** del programador (2026-11-23); el arquitecto lo traslada al ADR 0028 («Resultado de la prueba técnica»).

## Entorno

- `uv` propio de esta carpeta (`pyproject.toml` + `uv.lock`; Python 3.12; `torch` 2.15.0, `torchaudio` 2.11.1, `transformers` 5.24.0, `soundfile`, `numpy`, `psutil`). **No** usa ni toca el de `worker/`. `torchaudio` 2.11.1 convive con `torch` 2.15.0 (`forced_align` funciona).
- Mac M1 (CPU, 4 hilos: `OMP_NUM_THREADS=4`, `torch.set_num_threads(4)`, `nice -n 15`), con otros procesos pesados en marcha (carga media del sistema de 10 a 25 durante la prueba): los tiempos son pesimistas y ruidosos.
- Modelos (descargados una vez desde Hugging Face con `curl` a la revisión fijada; es la única salida a la red; no se envió ningún dato del usuario):

| Idioma | Origen | Revisión | Archivo | Bytes | SHA-256 | Licencia |
|---|---|---|---|---|---|---|
| es | `jonatasgrosman/wav2vec2-large-xlsr-53-spanish` | `96d7e9b4e4a78af515a3c6d3cee7c0826045d276` | `pytorch_model.bin` | 1 262 101 911 (coincide con el ADR) | `41c110e55d2eac8c79486ad87dbe8f9527ed034fe087a6adf03c891eeba914c1` | Apache-2.0 (la API de HF lo confirma) |
| en | `jonatasgrosman/wav2vec2-large-xlsr-53-english` | `569a6236e92bd5f7652a0420bfe9bb94c5664080` | `model.safetensors` | 1 261 942 732 (coincide con la API) | `6144f8464c6aaa220dd57c5a2ad4039b5710dcf8ee6e67057675f76597c19875` | Apache-2.0 (la API de HF lo confirma) |

  Más `config.json`, `vocab.json`, `preprocessor_config.json` y `special_tokens_map.json` (< 3 KB cada uno). Total descargado: **2 524 044 643 B + ~2,5 KB** (≈ 2,35 GiB). El de español no tiene `safetensors` en esa revisión y se carga con `torch.load(weights_only=True)` (vía `transformers`).
- Los pesos (y los JSON de resultados, solo tiempos) están en la carpeta temporal de la sesión, fuera del repositorio. El `.venv` de esta carpeta (801 MB) está ignorado por git.

## Scripts

| Archivo | Qué hace |
|---|---|
| `alinear.py` | Por canción: `voz.flac` a 16 kHz mono, emisiones por trozos de 30 s con solape, alineación CTC por línea con `torchaudio.functional.forced_align` (ventana `[inicio_LRC − 1000 ms, inicio de la siguiente)`), palabras = tokens de `tokenizarLinea`; escribe un JSON con solo tiempos. `--propio` usa el codificador propio; `--viterbi-propio` el Viterbi propio; `--guardar-emisiones`. |
| `medir.py` | Cobertura, mediana de abs(Δ), p90 de abs(Δ − sesgo), sesgo, tiempo y RAM por canción y global; V2 de las canciones con palabras. |
| `encoder_propio.py` | Codificador wav2vec2 (norma estable) solo con `torch` (criterio 6; ADR 0028 §3.2). |
| `viterbi_propio.py` | Viterbi CTC en `numpy`. |
| `equivalencia.py`, `equivalencia_fp64.py` | Criterio 6: emisiones propias frente a `transformers` y Viterbi propio frente a `forced_align` (y la comprobación en `float64`). |
| `fines.mjs` | Informativo: fin alineado frente a `detectarVoz` y a los fines prudentes de «Ajustar los silencios» (reutiliza `app/src/shared/silencios.ts`; se lanza desde `app/`). |
| `variantes.py` | Diagnóstico informativo (no entra en el veredicto): otras ventanas de inicio y alineación de toda la letra de una vez, sobre las emisiones guardadas. |

## Cómo ejecutarlo

```sh
cd docs/spikes/0028-alineacion
uv sync
# ids abreviados (8 caracteres) por idioma; los pesos en <modelos>/es y <modelos>/en con sus config/vocab
OMP_NUM_THREADS=4 nice -n 15 uv run python alinear.py <biblioteca> --idioma es=<id8,...> --idioma en=<id8,...>     --modelos <modelos> --salida <salida> [--guardar-emisiones <emis>]
uv run python medir.py <biblioteca> <salida>
uv run python equivalencia.py <biblioteca> <modelos> <id8>:es <id8>:en
cd ../../../app && node --experimental-transform-types --disable-warning=ExperimentalWarning     --disable-warning=MODULE_TYPELESS_PACKAGE_JSON ../docs/spikes/0028-alineacion/fines.mjs <biblioteca> <salida>
```

Solo lectura sobre la biblioteca. El idioma lo determinó `detectarIdioma` de `app/src/shared/idioma.ts`: 11 de las 13 canciones son `es` y 2 `en` (`8275d460` = canción 9 y `f538b75e` = canción 17).

## Resultado de la fase 1 (13 canciones: 2, 3, 4, 6, 7, 9, 10, 11, 13, 14, 16, 17, 18)

Δ = inicio de la primera palabra alineada − inicio del LRC, con ventana por línea `[inicio_LRC − 1000 ms, inicio de la siguiente)`. «alineadas» cuenta líneas con al menos una palabra alineada; `omitidas` = líneas sin alineación y su motivo. `t` = lectura + emisiones + alineación (sin la carga del modelo, ~2–10 s). La RAM es el pico del proceso hasta esa canción (el proceso procesó todas las de un idioma seguidas): el máximo es el de la fila de la última.

| id | cancion | idioma | lineas | alineadas | cobertura | med abs D (ms) | p90 abs(D-sesgo) (ms) | sesgo (ms) | dur (s) | t emis+ali (s) | t/dur | RAM pico (MB) | frac abs D > 1000 | omitidas |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 18a9c864 | 2 | es | 28 | 28 | 100% | 205 | 226 | 180 | 193 | 51 | 0.26 | 2586 | 0% | {} |
| 24728256 | 3 | es | 62 | 62 | 100% | 345 | 915 | -25 | 192 | 40 | 0.21 | 2586 | 2% | {} |
| 2fec1a9d | 4 | es | 113 | 113 | 100% | 600 | 1046 | -520 | 234 | 66 | 0.28 | 2586 | 1% | {} |
| 613de88b | 6 | es | 25 | 25 | 100% | 40 | 90 | 0 | 227 | 129 | 0.57 | 2586 | 0% | {} |
| 76a5239f | 7 | es | 52 | 52 | 100% | 160 | 994 | 95 | 264 | 109 | 0.41 | 2586 | 0% | {} |
| 8275d460 | 9 | en | 86 | 85 | 99% | 880 | 440 | -880 | 186 | 49 | 0.26 | 2688 | 1% | {'ventana_corta': 1} |
| 8766c2f2 | 10 | es | 36 | 36 | 100% | 150 | 895 | 30 | 227 | 56 | 0.25 | 2586 | 0% | {} |
| 906aeca5 | 11 | es | 46 | 46 | 100% | 125 | 960 | -30 | 161 | 62 | 0.38 | 2586 | 7% | {} |
| ca2bf253 | 13 | es | 33 | 33 | 100% | 290 | 628 | -90 | 183 | 68 | 0.37 | 2586 | 0% | {} |
| e0cea680 | 14 | es | 62 | 62 | 100% | 385 | 874 | -125 | 150 | 40 | 0.26 | 2631 | 5% | {} |
| f413b443 | 16 | es | 31 | 31 | 100% | 130 | 320 | 20 | 186 | 65 | 0.35 | 2631 | 0% | {} |
| f538b75e | 17 | en | 73 | 73 | 100% | 150 | 930 | -60 | 311 | 197 | 0.63 | 2727 | 5% | {} |
| fd955121 | 18 | es | 101 | 101 | 100% | 600 | 830 | -570 | 209 | 80 | 0.38 | 2631 | 4% | {} |

GLOBAL: 13 canciones, 748 lineas, 747 alineadas, cobertura 99.9%; mediana |D| 390 ms; p90 |D-sesgo| 910 ms; p50 |D-sesgo| 220; mediana de medianas 205; t/dur max 0.63; RAM max 2727 MB
V2 8766c2f2: 204 palabras; mediana |e| 40 ms; sesgo -4 ms; <=100 ms 85%; <=200 ms 91%
V2 f538b75e: 285 palabras; mediana |e| 191 ms; sesgo 75 ms; <=100 ms 29%; <=200 ms 53%

### Veredicto de la fase 1: **no sirve** (con el criterio cerrado de la tarea)

| Condición | Umbral | Medido | Resultado |
|---|---|---|---|
| Cobertura | ≥ 80 % | 99,9 % (747 de 748; una omitida en `8275d460` por ventana más corta que su texto) | cumple (nota: el alineador siempre devuelve algo; la cobertura no mide acierto) |
| Mediana de abs(Δ) | ≤ 300 ms | **390 ms** (por canción de 40 a 880 ms) | **falla** |
| p90 de abs(Δ − sesgo) | ≤ 600 ms | **910 ms** | **falla** |
| Coste con CPU | ≤ 1,5 × la duración y ≤ 4 GB | 0,21 a 0,63 × la duración (≈ 0,2–0,4 en reposo); RAM pico 2,7 GB | cumple |
| Criterio 6 (equivalencia) | máx. abs(Δ logits) < 1e-3 | 0,8 a 4,0 e-3 en `float32`; **2,6e-12 en `float64`**; alineaciones idénticas | **no cumple la letra** del umbral; el fondo sí (ver abajo) |
| Determinismo | dos ejecuciones iguales | emisiones y alineaciones idénticas en 13 de 13 | cumple |

**Cómo se lee.** Con la ventana de −1000 ms del filtro, el 40 % de las líneas tienen Δ < −500 ms: la primera palabra de una línea se «roba» el final de la voz de la línea anterior (en canciones con la voz continua el alineador no tiene dónde esperar). El diagnóstico siguiente (**informativo, no entra en el veredicto, no se ha ajustado nada para que «pase»**) lo muestra:

```
ventana -1000 ms: n 747; mediana |D| 390; p90 |D-sesgo| 910; D < -500 ms: 40.3%
   por cancion (med|D|/p90/sesgo): 18a9c864:205/226/180 24728256:345/915/-25 2fec1a9d:600/1046/-520 613de88b:40/90/0 76a5239f:160/994/95 8766c2f2:150/895/30 906aeca5:125/960/-30 ca2bf253:290/628/-90 e0cea680:385/874/-125 f413b443:130/320/20 fd955121:600/830/-570 8275d460:880/440/-880 f538b75e:150/930/-60
ventana -500 ms: n 747; mediana |D| 220; p90 |D-sesgo| 500; D < -500 ms: 2.8%
   por cancion (med|D|/p90/sesgo): 18a9c864:205/235/205 24728256:280/551/185 2fec1a9d:400/778/300 613de88b:40/76/10 76a5239f:145/160/140 8766c2f2:145/350/55 906aeca5:80/435/10 ca2bf253:210/480/-30 e0cea680:240/495/15 f413b443:110/220/40 fd955121:270/460/-40 8275d460:440/420/-440 f538b75e:90/498/10
ventana -250 ms: n 747; mediana |D| 170; p90 |D-sesgo| 350; D < -500 ms: 0.0%
   por cancion (med|D|/p90/sesgo): 18a9c864:205/235/205 24728256:250/430/240 2fec1a9d:390/568/390 613de88b:40/76/10 76a5239f:140/149/140 8766c2f2:135/265/80 906aeca5:80/225/15 ca2bf253:150/464/-30 e0cea680:150/348/100 f413b443:110/210/40 fd955121:190/350/100 8275d460:220/524/-200 f538b75e:80/252/10
ventana -0 ms: n 746; mediana |D| 130; p90 |D-sesgo| 245; D < -500 ms: 0.0%
   por cancion (med|D|/p90/sesgo): 18a9c864:205/208/205 24728256:255/255/255 2fec1a9d:400/276/400 613de88b:20/42/20 76a5239f:140/139/140 8766c2f2:95/240/95 906aeca5:55/95/55 ca2bf253:80/472/80 e0cea680:150/298/150 f413b443:50/150/50 fd955121:145/245/145 8275d460:60/400/60 f538b75e:50/108/50
Toda la letra alineada de una vez sobre la pista completa (sin ventana por linea; sin ancla al LRC):
  18a9c864: lineas 28; mediana |D| 205; p90 |D-sesgo| 235; sesgo 205; D<-500: 0%; D>500: 0%
  24728256: lineas 62; mediana |D| 255; p90 |D-sesgo| 284; sesgo 255; D<-500: 0%; D>500: 5%
  2fec1a9d: lineas 113; mediana |D| 430; p90 |D-sesgo| 210; sesgo 430; D<-500: 0%; D>500: 29%
  613de88b: lineas 25; mediana |D| 40; p90 |D-sesgo| 76; sesgo 10; D<-500: 0%; D>500: 0%
  76a5239f: lineas 52; mediana |D| 145; p90 |D-sesgo| 155; sesgo 145; D<-500: 0%; D>500: 4%
  8766c2f2: lineas 36; mediana |D| 135; p90 |D-sesgo| 280; sesgo 105; D<-500: 0%; D>500: 8%
  906aeca5: lineas 46; mediana |D| 80; p90 |D-sesgo| 835; sesgo 50; D<-500: 7%; D>500: 9%
  ca2bf253: lineas 33; mediana |D| 190; p90 |D-sesgo| 662; sesgo -30; D<-500: 9%; D>500: 9%
  e0cea680: lineas 62; mediana |D| 230; p90 |D-sesgo| 345; sesgo 215; D<-500: 2%; D>500: 11%
  f413b443: lineas 31; mediana |D| 120; p90 |D-sesgo| 250; sesgo 40; D<-500: 0%; D>500: 3%
  fd955121: lineas 101; mediana |D| 190; p90 |D-sesgo| 370; sesgo 180; D<-500: 4%; D>500: 7%
  8275d460: lineas 86; mediana |D| 840; p90 |D-sesgo| 510; sesgo 830; D<-500: 1%; D>500: 81%
  f538b75e: lineas 73; mediana |D| 70; p90 |D-sesgo| 546; sesgo 40; D<-500: 1%; D>500: 10%
  GLOBAL: n 748; mediana |D| 220; p90 |D-sesgo| 403; D<-500 ms: 1.7%
```

Con la ventana de −250 ms de ADR 0028 §2.1 el filtro pasaría (mediana 170, p90 350) y alineando **toda la letra de una vez sobre la pista** (sin ancla al LRC: ninguna ventana por línea) también (mediana 220, p90 403). Ojo: con ventanas estrechas el resultado queda parcialmente anclado al LRC (Δ ≥ −ventana por construcción), así que solo la alineación de toda la letra de una vez es una medida no circular; esta, sin embargo, tiene el sesgo positivo de canciones concretas (`2fec1a9d` +430 ms, `8275d460` +830 ms con el 81 % de líneas a más de 500 ms), que puede ser el LRC de LRCLIB adelantado (lo normal) o un tropiezo del modelo, y **no se puede separar sin fines/palabras hechas a mano** (V1).

### Criterio 6 · equivalencia

- Emisiones (`24728256`, es, y `8275d460`, en; 3 trozos de 30 s cada una): máxima diferencia de *logits* `float32` del codificador propio frente a `transformers`: 1,28e-3, 1,09e-3, 1,52e-3 (es) y 4,00e-3, 0,80e-3, 2,77e-3 (en); sobre la pista completa, en log-softmax, 9,4e-3 (es) y 1,6e-2 (en). **Supera el 1e-3 del ADR en 5 de 6 trozos.**
- Pero en `float64` el codificador propio y `transformers` coinciden a **2,6e-12** (rango de *logits* −21 a +15), y `transformers` en `float32` ya difiere de su propio `float64` en 1,3e-3: la diferencia es ruido de redondeo de `float32`, no un error de implementación. El umbral de 1e-3 sobre *logits* es más estricto que el ruido de `float32` de `transformers` mismo.
- Alineación: con las emisiones propias y el Viterbi propio, los tramos y los inicios de línea son **idénticos** a los de referencia (62 de 62 líneas en `24728256`; 85 de 85 en `8275d460`; diferencia máxima de inicio: 0 ms). El Viterbi propio (numpy) da las **mismas etiquetas por fotograma** que `forced_align` en todas las líneas alineadas de las dos canciones.
- Lectura: el criterio 6 **tal como está escrito no se cumple**; el de fondo (misma alineación, igualdad exacta en `float64`) sí. Propuesta para el arquitecto: reformularlo como «misma alineación y diferencia de *logits* en `float64` < 1e-6» o con un umbral de `float32` realista (1e-2).

### Informativo (no criterio)

Fines. Un fin = fin de la última palabra alineada (+ margen); «corte probable» = `detectarVoz` marca ≥ 300 ms de voz entre ese fin y el inicio LRC de la siguiente línea (en canciones con la voz continua el LRC de la siguiente línea suele empezar antes de que acabe la voz propia, por lo que esta medida es pesimista para cualquier fin). Los fines prudentes son los de «Ajustar los silencios» sobre la letra sin fines (propone en 91 de 747 líneas).

```
18a9c864: lineas alineadas 28; alineacion con voz>=300 ms despues: margen0 24 (86%), margen100 21 (75%); prudentes proponen 12, de ellos con voz despues: 2; en esas mismas lineas la alineacion (m0/m100): 11/10
24728256: lineas alineadas 62; alineacion con voz>=300 ms despues: margen0 19 (31%), margen100 17 (27%); prudentes proponen 2, de ellos con voz despues: 0; en esas mismas lineas la alineacion (m0/m100): 2/2
2fec1a9d: lineas alineadas 113; alineacion con voz>=300 ms despues: margen0 19 (17%), margen100 18 (16%); prudentes proponen 6, de ellos con voz despues: 2; en esas mismas lineas la alineacion (m0/m100): 2/2
613de88b: lineas alineadas 25; alineacion con voz>=300 ms despues: margen0 23 (92%), margen100 22 (88%); prudentes proponen 13, de ellos con voz despues: 6; en esas mismas lineas la alineacion (m0/m100): 12/11
76a5239f: lineas alineadas 52; alineacion con voz>=300 ms despues: margen0 42 (81%), margen100 33 (63%); prudentes proponen 4, de ellos con voz despues: 0; en esas mismas lineas la alineacion (m0/m100): 3/2
8275d460: lineas alineadas 85; alineacion con voz>=300 ms despues: margen0 14 (16%), margen100 11 (13%); prudentes proponen 1, de ellos con voz despues: 0; en esas mismas lineas la alineacion (m0/m100): 1/0
8766c2f2: lineas alineadas 36; alineacion con voz>=300 ms despues: margen0 13 (36%), margen100 8 (22%); prudentes proponen 5, de ellos con voz despues: 3; en esas mismas lineas la alineacion (m0/m100): 3/3
906aeca5: lineas alineadas 46; alineacion con voz>=300 ms despues: margen0 17 (37%), margen100 16 (35%); prudentes proponen 7, de ellos con voz despues: 1; en esas mismas lineas la alineacion (m0/m100): 3/2
ca2bf253: lineas alineadas 33; alineacion con voz>=300 ms despues: margen0 23 (70%), margen100 19 (58%); prudentes proponen 2, de ellos con voz despues: 1; en esas mismas lineas la alineacion (m0/m100): 2/0
e0cea680: lineas alineadas 62; alineacion con voz>=300 ms despues: margen0 12 (19%), margen100 6 (10%); prudentes proponen 2, de ellos con voz despues: 0; en esas mismas lineas la alineacion (m0/m100): 0/0
f413b443: lineas alineadas 31; alineacion con voz>=300 ms despues: margen0 22 (71%), margen100 21 (68%); prudentes proponen 12, de ellos con voz despues: 5; en esas mismas lineas la alineacion (m0/m100): 8/8
f538b75e: lineas alineadas 73; alineacion con voz>=300 ms despues: margen0 26 (36%), margen100 15 (21%); prudentes proponen 18, de ellos con voz despues: 2; en esas mismas lineas la alineacion (m0/m100): 5/1
fd955121: lineas alineadas 101; alineacion con voz>=300 ms despues: margen0 11 (11%), margen100 7 (7%); prudentes proponen 7, de ellos con voz despues: 1; en esas mismas lineas la alineacion (m0/m100): 2/2
GLOBAL: lineas alineadas 747; alineacion con voz>=300 ms tras el fin: m0 265 (35.5%), m100 214 (28.6%)
  lineas donde 'Ajustar los silencios' propone fin: 91; con voz>=300 ms tras su fin: 23 (25.3%); alineacion en esas mismas lineas m0 54 (59.3%), m100 43 (47.3%)
  mediana (fin alineacion - fin prudente) en esas lineas: -300 ms
```

Comparación en las mismas 91 líneas: la alineación deja voz detrás en 54 (59,3 %; con margen de 100 ms, 43 = 47,3 %) frente a 23 (25,3 %) de los fines prudentes; la alineación pone el fin 300 ms antes (mediana). Es decir, **sobre las líneas donde «Ajustar los silencios» encuentra un silencio claro, el fin por alineación cae antes y deja más voz detrás**; no hay verdad para decidir cuál es mejor.

V2 (palabras de las canciones 10 y 17, origen desconocido; error del inicio de palabra, con la ventana del filtro): ver las dos últimas líneas de arriba. `8766c2f2` (10): mediana 40 ms, 85 % a ≤ 100 ms, 91 % a ≤ 200 ms (cumpliría 120 ms / 80 % de ADR 0028 §2.4); `f538b75e` (17): mediana 191 ms, 29 % a ≤ 100 ms, 53 % a ≤ 200 ms (no cumpliría). Son 489 palabras de dos canciones cuyas palabras no son una verdad comprobada.
