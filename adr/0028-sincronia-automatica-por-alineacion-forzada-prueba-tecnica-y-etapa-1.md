# 0028 — Sincronía automática por alineación forzada sobre la voz separada: prueba técnica y etapa 1

- Estado: **Propuesto** (fase 1 de la prueba: pasa el filtro con el criterio revisado el 2026-11-23; fase 2, la que decide, pendiente; ver «Resultado de la prueba técnica»). La prueba técnica (§2) está decidida y es una tarea; la etapa 1 (§3) pasa a «Aceptado» solo si la prueba cumple el criterio de §2.4. Si no lo cumple, se aplica el plan B (§4) y este ADR se revisa con el resultado.
- Fecha: 2026-11-21
- Paso del pipeline: 4 (sincronía) y 3 (letra)
- Versión: 0.2.2, feature 10 ([propuesta 019](../propuestas/019-sincronia-automatica-por-alineacion-forzada.md)). Spec: [06 · Feature 10](../ux/06-editor.md). Responde a [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md) en lo que toca a esta feature. Sustituye la decisión 6 de ADR 0005 («alineación automática fuera del MVP; candidata post-MVP en un ADR propio»).

## Contexto

El trabajo manual del editor está en el **fin de cada línea** y en los **tiempos por palabra**. Los inicios llegan de LRCLIB (12 de 12 canciones). «Ajustar los silencios» (ADR 0018 §6) es la única ayuda.

**Qué dice la biblioteca del usuario** (script de solo lectura del 2026-11-21, sin letras; detalle en ADR 0024):

- Los «138 fines fijados en 8 canciones» no son todos hechos a mano. Comparados con lo que propone «Ajustar los silencios» (± 20 ms): Tragedia Termina (22 de 22), Dedos Rotos (21 de 21) y A Pesar de Mí (22 de 30) **salen de «Ajustar los silencios»**. Hechos a mano y por tanto **verdad independiente**: Arrópame (26), ¿Y Ahora Qué? (33) y 8 de A Pesar de Mí: **67 líneas**.
- Sobre esas líneas, «Ajustar los silencios» no propone nada en 13 de 26 líneas de Arrópame (no encuentra un silencio de 400 ms) y, donde propone, tiene un error medio de 1 192 ms en Arrópame y de 266 ms en ¿Y Ahora Qué?; en 18 de 20 casos pone el fin **más tarde** que el usuario (el usuario corta al acabar la palabra; la energía sigue con la reverberación o los coros).
- Hay tiempos por palabra **importados** de LRCLIB en Final Ruin, Valiente y Sinmigo (0.2.1 ya no los pinta): sirven de referencia aproximada para los inicios de palabra.

**Licencias** (ADR 0002 excluye pesos no comerciales o «solo investigación»): los modelos por defecto de WhisperX para español, francés, alemán e italiano (paquetes VoxPopuli de torchaudio) y el alineador multilingüe `MMS_FA` de torchaudio son **CC BY-NC 4.0**: no se pueden usar. El runtime ya tiene `torch` 2.15 (perfil CPU) y 2.11 (cu128) en el extra `separacion` (ADR 0009 §1) y **no** tiene `torchaudio` ni `transformers`.

## Alternativas consideradas

| Candidato | Licencia (código / pesos / datos) | Tamaño | Pros | Contras | Veredicto |
|---|---|---|---|---|---|
| **A. Alineación CTC (Viterbi) con `jonatasgrosman/wav2vec2-large-xlsr-53-spanish`** | Pesos **Apache-2.0**; ajustado sobre Common Voice 6.1 (**CC0**); base `facebook/wav2vec2-large-xlsr-53` Apache-2.0 | `pytorch_model.bin` **1 262 101 911 B** (comprobado en la API de Hugging Face; revisión `96d7e9b4…`, sin `safetensors` en la rama principal) | Mismo método que WhisperX sin sus dependencias; el texto ya se conoce (solo hay que alinear); misma familia para inglés (`…-xlsr-53-english`, Apache-2.0, con `safetensors`) y otros idiomas de Common Voice | 1,26 GB por idioma; modelo entrenado con voz **hablada**; el preentrenamiento de XLSR-53 incluye BABEL (licencia LDC), aunque los pesos se publican con Apache-2.0 | **Candidato principal de la prueba** |
| A′. Igual, en inglés con `WAV2VEC2_ASR_BASE_960H` de torchaudio | **MIT** (pesos de fairseq, LibriSpeech CC BY 4.0) | ~360 MB (sin verificar) | Más ligero | Otra arquitectura (base) y otra fuente de descarga | Alternativa para inglés si A pesa demasiado |
| B. WhisperX | Código BSD-2-Clause | + faster-whisper, CTranslate2, pyannote | Referencia de implementación | Trae transcripción y diarización que no necesitamos; sus modelos de alineación por defecto en español son CC BY-NC | Solo como referencia |
| C. `MMS_FA` / VoxPopuli (torchaudio) | **CC BY-NC 4.0** | — | 1 130 idiomas | No comercial | **Excluido** |
| D. Whisper con texto forzado y DTW sobre la atención cruzada (como stable-ts o whisper-timestamped) | Pesos MIT; stable-ts MIT pero **archivado** (30-05-2026); whisper-timestamped AGPL-3.0 | 0,5–3 GB según tamaño | Un solo modelo multilingüe | Tiempos menos precisos que CTC según la literatura; bibliotecas sin mantenimiento o AGPL | Segundo candidato **solo si A no cumple** (§2.5) |
| E. Montreal Forced Aligner | MIT; modelo español CC BY 4.0 | — | Clásico y preciso en habla | conda + Kaldi: no encaja en el runtime con `uv` | Excluido |
| F. NeMo Forced Aligner | Apache-2.0 | NeMo entero | Bueno en habla | Dependencia enorme | Excluido |
| G. `ctc-forced-aligner` (pip) | Código abierto, modelo por defecto MMS (CC BY-NC) | — | Empaqueta el método | Su modelo por defecto no sirve; con otro modelo no aporta frente a A | Excluido |

**Implementación del alineador** (para A): `torchaudio.functional.forced_align` **se mantiene** (la retirada anunciada para 2.9 se revirtió en enero de 2026, issue #3902) y `torchaudio` 2.11.1 exige `torch>=2.11` sin fijarlo (ABI estable). Pero añadirlo al runtime cambia los requisitos y, por ADR 0009 §6, obliga a **repetir la fase de componentes** (pantalla B5 «Hay que reparar…») a todas las instalaciones al actualizar. Por eso la etapa 1 prefiere **no añadir dependencias** (§3.2).

## Decisión

### 1. Enfoque

**Candidato A** en dos etapas, con prueba técnica previa. En 0.2.2 entran la **prueba técnica** y, si cumple, la **etapa 1** (dentro de cada línea, con los inicios ya dados). La etapa 2 (letra sin tiempos) queda fuera.

### 2. Prueba técnica (tarea propia, antes de cualquier tarea de la etapa 1)

#### 2.1 Dónde y cómo

- Scripts en `docs/spikes/0028-alineacion/` (no es código de producción), con su propio entorno `uv` (Python 3.12, `torch`, `transformers` y `torchaudio` solo para la prueba, `soundfile`, `numpy`). Se ejecuta **en el equipo del usuario**, en solo lectura sobre `%LOCALAPPDATA%\ShinobiKaraoke\biblioteca` (ruta por argumento). **No se copian letras ni audio al repositorio**; en el informe solo van cifras e índices o títulos de canción.
- Pasos por canción:
  1. `voz.flac` a 16 kHz mono.
  2. Emisiones del modelo una vez para toda la pista (trozos de 30 s con 1 s de solape si hace falta).
  3. Por cada línea con inicio: ventana `[inicio − 250 ms, inicio de la siguiente con tiempo)` (la última, hasta la duración); texto normalizado al vocabulario del modelo (minúsculas, sin puntuación; cifras y símbolos sin carácter alineable se marcan); alineación CTC de Viterbi con `forced_align`.
  4. Palabras = tokens de `tokenizarLinea` (ADR 0021) con el inicio de su primer carácter y el fin del último; una palabra sin caracteres alineables se interpola entre sus vecinas.
  5. **Fin de línea** = fin de la última palabra + margen; el margen (0, 60 o 120 ms) se elige dejando fuera la canción que se evalúa (validación cruzada por canción), para no ajustarlo a la verdad.
  6. **Confianza por línea** = media de la probabilidad a posteriori de los fotogramas alineados.
- Además: comprobar que una implementación propia del codificador (§3.2) da las **mismas emisiones** que `transformers` (máxima diferencia absoluta de los *logits* < 1e-3) y que un Viterbi propio en `numpy` da los mismos tramos que `forced_align`.

#### 2.2 Conjuntos de verdad

| Conjunto | Qué | Uso |
|---|---|---|
| **V1 · fines a mano** | Fines fijados que **no** coinciden (± 20 ms) con la propuesta de «Ajustar los silencios», en líneas sin palabras: Arrópame, ¿Y Ahora Qué? y A Pesar de Mí (~67 líneas) | Criterio de éxito |
| V2 · palabras de LRCLIB | Inicios de palabra importados de Final Ruin, Valiente y Sinmigo | Informativo (no es verdad comprobada) |
| V3 · verdad nueva (opcional) | 20 líneas con palabras hechas a mano por el usuario en el editor preciso (0.2.1) en una canción lenta y en la rápida | Si el usuario la prepara antes de la prueba, se añade a V1 |
| Línea base | «Ajustar los silencios» sobre las mismas líneas de V1, calculada por el mismo script | Comparación |

#### 2.3 Medidas

- Sobre V1: cobertura (líneas con fin propuesto), error del fin `e = propuesto − verdad` con media de `|e|`, mediana, p90 y máximo; **cortes** (`e < −150 ms`: el barrido acaba antes que la voz) y **tardíos** (`e > +300 ms`); todo global y por canción, para el alineador y para la línea base.
- Confianza: correlación de Spearman entre confianza y `|e|`, y las mismas medidas solo con el 60 % de líneas de mayor confianza.
- V2: mediana del error de inicio de palabra y fracción a ≤ 100 y ≤ 200 ms.
- Coste en el equipo del usuario: tiempo por canción de 4 min (carga del modelo, emisiones, alineación) con CUDA y con CPU forzada (`dispositivo = cpu`), pico de memoria RAM y de vídeo, y bytes descargados. Repetición en CPU con el mismo resultado (determinismo).

#### 2.4 Criterio de «sirve»

La prueba **sirve** si, sobre V1, se cumplen **todos**:

1. Cobertura ≥ 90 % de las líneas.
2. Mediana de `|e|` ≤ 150 ms, media ≤ 250 ms y p90 ≤ 450 ms; ninguna canción con media > 400 ms.
3. Cortes (> 150 ms antes) en ≤ 5 % de las líneas.
4. Media de `|e|` ≤ 0,6 × la de «Ajustar los silencios» sobre las líneas donde esta propone algo.
5. Coste: ≤ 20 s por canción con GPU sin contar la descarga; ≤ 1,5 × la duración con CPU (≤ 6 min para 4 min); ≤ 4 GB de RAM.
6. Emisiones de la implementación propia iguales a las de `transformers` (§2.1).

**Sirve con confianza** si 2 y 3 solo se cumplen en las líneas con confianza ≥ un umbral y esas son al menos el 60 %: la etapa 1 entra, pero solo aplica esas líneas y señala las demás (`ALINEACION_BAJA`, ADR 0024 §3).

**Palabras**: además, las palabras automáticas solo se aplican si en V2 (y V3 si existe) la mediana del error de inicio de palabra es ≤ 120 ms y al menos el 80 % están a ≤ 200 ms. Si los fines cumplen y las palabras no, la salida es **«solo fines»**.

Las **tres salidas** de la spec ([06 · Feature 10](../ux/06-editor.md#022--feature-10--sincronizar-con-la-voz-etapa-1), 0157 §15) quedan así: **todo** (fines y palabras), **solo fines**, o **nada** (no sirve → §4).

**No sirve** en cualquier otro caso → §4.

La prueba también fija (0157 §17): los umbrales de confianza **Alta**, **Media** y **Baja** (por defecto, los cuantiles que separan el 60 % de líneas más fiables y el 20 % menos fiable de V1), el margen que se añade al fin (§2.1 paso 5), el factor de tiempo por minuto de audio con GPU y con CPU para la estimación de la tanda (ADR 0025 §5), y el tiempo de **una sola línea** con el modelo cargado y sin cargar (0157 §19).

El resultado se escribe en este ADR (sección «Resultado de la prueba técnica») y en el informe de la feature 10.

#### 2.5 Segundo candidato (con límite de tiempo)

Si A falla solo por precisión (criterios 2–4) pero no por coste, se prueba **una vez** el candidato D con `openai-whisper` (MIT) `small` en el mismo banco, con un límite de una jornada de trabajo del programador. Si tampoco cumple, plan B.

### 3. Etapa 1 (solo si la prueba sirve)

#### 3.1 Qué hace

Para una letra que ya tiene inicios, calcula por línea el **fin** y los **tiempos por palabra** sobre la pista de voz. Se lanza desde «Sincronizar con la voz» (pestaña Funciones del editor, con vista previa de recuentos y **un solo paso de deshacer**, como «Ajustar los silencios») y como paso `ajustando_fines` de la preparación desatendida (ADR 0025 §2).

#### 3.2 Runtime (ADR 0009)

- **Sin dependencias nuevas en los requisitos** (provisional, pendiente de §2.1 punto 6): el worker lleva una implementación mínima del codificador wav2vec2 en inferencia (extractor convolucional, proyección, convolución posicional, 24 capas *transformer* con normalización previa y cabeza CTC) sobre `torch`, y el Viterbi CTC en `numpy`. Así no cambia `sha256_requisitos` y nadie pasa por B5 al actualizar. Si la prueba muestra que no es fiable, la alternativa es añadir `torchaudio` (BSD-2-Clause) a los 6 archivos de requisitos y aceptar la reparación al actualizar (se anota en las notas de la versión).
- **Modelos bajo demanda** (0157 §21): entrada nueva `modelos_alineacion[]` en `runtime-manifest.json` (`idioma`, `archivos: [{ nombre, urls, bytes, sha256 }]`, `licencia`, `revision`), descargados por `DescargadorModelos` de main (ADR 0009 §4: `Range`, reanudable, SHA-256 en streaming, un reintento) a `modelos/alineacion/<idioma>/`, con URLs de Hugging Face fijadas a la revisión (`…/resolve/<sha>/pytorch_model.bin`). Se carga con `torch.load(weights_only=True)`. Se descargan **desde Ajustes** (lista por idioma con tamaño, descargar, cancelar, quitar) o desde el diálogo de la acción, con permiso y tamaño (spec 08 · Feature 10). `config.alineacion.modelos_descargados: string[]` como `separacion.modelos_descargados`. El primer arranque y la preparación desatendida **nunca** descargan modelos (la preparación usa «Ajustar los silencios» y lo dice en el resumen).
- **Instalaciones anteriores a 0.2.2**: con la opción sin dependencias nuevas no les falta nada del motor. Si hubiera que añadir `torchaudio` (alternativa de arriba), se instala con la fase de componentes (B5 / «Reparar el motor de audio»).
- **Idiomas en 0.2.2**: español e inglés (provisional). Campo opcional **`letra.idioma`** (código BCP 47 corto: `es`, `en`; 0157 §16d): lo pone main al guardar una letra nueva con `detectarIdioma(letra)` de `shared/idioma.ts` (pura: proporción de palabras vacías frecuentes de cada idioma y caracteres propios como `ñ` o vocales con tilde; devuelve `es`, `en` o `null`) y el usuario lo puede cambiar en el diálogo. Con `null` o un idioma sin modelo, la acción explica `IDIOMA_NO_ADMITIDO` y la preparación no alinea.
- **Una sola línea** (0157 §19): lanzar el worker y cargar 1,26 GB tarda segundos, así que el editor mantiene un **worker de alineación residente** mientras hay un editor abierto con el modelo ya usado, que se cierra tras 5 min sin uso o al salir del editor. Con el modelo cargado, una línea debería tardar < 2 s (lo mide la prueba); sin cargar, la interfaz muestra el progreso `cargando_modelo`. Si la prueba mide más de 2 s, la spec muestra progreso también en ese caso.
- **Comando del worker `alinear-letra`**: argumentos `{ voz, idioma, modelo_dir, dispositivo, lineas: [{ id, texto, desde_ms, hasta_ms }] }`; progreso por JSON Lines (`cargando_modelo`, `alineando` con `{ linea, total }`); resultado `{ lineas: [{ id, fin_ms, confianza, palabras: [{ inicio_ms, fin_ms }] }], omitidas: [{ id, motivo }] }` en **tiempo de audio**. Errores: `MEMORIA_INSUFICIENTE`, `RUNTIME_NO_DISPONIBLE`, `MODELO_NO_DISPONIBLE`, `ERROR_INTERNO`; y, desde main antes de lanzar nada, `ALINEACION_NO_DISPONIBLE` (la prueba dio «nada» o el perfil no lo admite) e `IDIOMA_NO_ADMITIDO` (0157 §23). La acción **nunca cambia inicios** y solo toca fines sin `origen_fin` a mano (es decir, con `origen_fin` `letra`, `silencios`, `preparacion` o `alineacion`, o automáticos); los fines a mano solo si la vista previa lo marca. GPU con perfil `cuda` o `mps` y CPU si no; caída de CUDA a CPU como en la separación.
- **Cola**: `GestorTrabajos`, cola `pesada` (detrás de las separaciones; nunca dos modelos en la GPU), con un trabajo **sin paso persistido** (`paso: null`: no escribe `pasos` de `cancion.json`; su estado llega por `trabajos:cambio` y, en la preparación, por `preparacion`).

#### 3.3 Datos y reglas

- **`origen_palabras: "auto"`**: valor nuevo del catálogo (ADR 0021 §1). Las palabras automáticas **se pintan** (`palabrasVisibles` incluye `manual` y `auto`) y cuentan en `finEfectivo`. Cumplen las reglas de las manuales (tantas como tokens de `tokenizarLinea`, ≥ 20 ms, sin solaparse, dentro de la línea); si el resultado no las cumple, solo se aplica el fin.
- **Fin**: `fin_ms` fijado con `origen_fin: "alineacion"` (ADR 0024 §4), dentro de los invariantes de ADR 0006 (`inicio < fin ≤ inicio siguiente`).
- **`alineacion: { confianza }`** por línea (opcional, 0–1, dos decimales): la usa la revisión guiada; main la retira cuando cambian los tiempos de la línea (la misma regla que `revisada`).
- **`aplicarAlineacion(letra, resultado, { umbral, soloIds? })`** en `shared/alineacion.ts` (pura): solo líneas con confianza ≥ umbral (provisional 0,5; lo fija la prueba) y **sin palabras manuales** (nunca se pisan); devuelve la letra y los recuentos para el aviso.
- **Editar** el inicio o el fin descarta las palabras automáticas como cualquier otra (ADR 0021 §4) y retira `origen_fin` y `alineacion`. Cambiar una palabra en el editor preciso las convierte en `manual`.
- **0.2.1**: lee `"auto"` como ausente (palabras importadas, no se pintan) y descarta `alineacion`; el fin fijado se conserva.

#### 3.4 Qué pasa con «Ajustar los silencios» y la propuesta 003

Siguen: son el respaldo sin modelo (idioma no soportado, sin descarga, confianza baja). La [003](../propuestas/003-calibrar-el-ajuste-de-silencios-por-cancion.md) sigue en espera.

### 4. Plan B (si la prueba no sirve)

- La feature 10 se cierra con el informe de la prueba y **no** entra la etapa 1.
- Entra la [propuesta 027](../propuestas/027-marcar-inicio-y-fin-al-ritmo.md) (marcar inicio y fin al ritmo manteniendo la tecla, S–M) como feature 10-B, con spec del diseñador.
- La [propuesta 016](../propuestas/016-ajustar-el-fin-de-una-linea-con-la-voz.md) (fin de una sola línea con la voz) **ya queda cubierta** por la acción «Fin al final de la voz» de la revisión guiada (feature 11, ADR 0024 §3); no hace falta como feature aparte.
- La 003 se reevalúa con el mismo banco de medida.

## Consecuencias

- **Positivas**: si sirve, quita el trabajo más repetido del editor y devuelve el barrido por palabra sin esfuerzo; la prueba se hace con la verdad real del usuario y con un criterio cerrado de antemano; ningún cambio en el runtime existente.
- **Negativas / riesgos**: los modelos están entrenados con voz hablada; 1,26 GB por idioma; en CPU puede tardar minutos por canción; la verdad independiente es pequeña (~67 líneas, 3 canciones de un mismo artista); implementar el codificador a mano es código delicado (mitigado por la comparación con `transformers`).
- **Legales / licencias**: pesos Apache-2.0 y datos de ajuste CC0, compatibles con GPL-3.0-or-later; los pesos se descargan de Hugging Face en el equipo del usuario (no se redistribuyen en el instalador) y se citan en `THIRD_PARTY_NOTICES.md` y en Acerca de. El preentrenamiento de XLSR-53 incluye BABEL (LDC); los pesos se publican con Apache-2.0 y no se distribuyen datos.
- **Impacto en UX**: descarga opcional de 1,26 GB con permiso; acción con aviso y deshacer; señales de confianza para la revisión guiada.

## Resultado de la prueba técnica

### Fase 1 · filtro (2026-11-23; pregunta [0310](../preguntas/0310-resultado-de-la-fase-1-de-la-alineacion-forzada-no-sirve-con-la-ventana-del-filtro.md))

Candidato A (español y la variante inglesa, ambas Apache-2.0, revisiones fijadas), 13 canciones de la copia del MVP (11 `es`, 2 `en`), 748 líneas. Cifras completas en [`docs/spikes/0028-alineacion/README.md`](../spikes/0028-alineacion/README.md).

**1. Veredicto con el criterio tal como se escribió (revisión «Fase de filtro»): NO SIRVE.**

| Condición | Umbral | Medido |
|---|---|---|
| Cobertura | ≥ 80 % | 99,9 % (cumple) |
| Mediana de \|Δ\| (ventana por línea `[inicio_LRC − 1000 ms, …)`) | ≤ 300 ms | **390 ms (falla)** |
| p90 de \|Δ − sesgo\| | ≤ 600 ms | **910 ms (falla)** |
| Criterio 5 con CPU | ≤ 1,5 × duración, ≤ 4 GB | 0,21–0,63 ×, 2,7 GB (cumple) |
| Criterio 6 | \|Δ logits\| < 1e-3 | 0,8–4,0e-3 en `float32` **(falla la letra)** |
| Determinismo | iguales | 13/13 (cumple) |

**2. Por qué se revisa el criterio y por qué no es «mover la portería».**
- **El filtro tenía un defecto de diseño, del arquitecto.** Alinear **una línea sola** en una ventana que empieza 1 s antes del LRC deja al alineador sin el texto de la línea anterior. Cualquier voz que haya en ese segundo (casi siempre el final de la línea anterior) se la queda la primera palabra: el 40 % de las líneas sale con Δ < −500 ms. Eso mide una configuración que nadie usaría (la etapa 1 parte de inicios dados, §2.1, y no los cambia). Es un artefacto del método de medida, no del modelo.
- **Qué se cambia**: solo la configuración de la medida. Se pasa a alinear **toda la letra de una vez sobre la pista entera**, sin ventanas por línea.
  - Es la única variante medida que **no es circular**: no usa los tiempos del LRC para alinear, así que no puede acertar «por construcción».
  - Es la más exigente de las variantes válidas: el alineador tiene que encontrar cada línea él solo.
  - Las variantes más favorables (ventana 0: 130/245 ms; −250 ms: 170/350 ms) se **descartan** justo por estar ancladas al LRC.
- **Qué no se cambia**: los umbrales. Siguen en 300 y 600 ms, el doble de los del fin de §2.4 porque la referencia (LRC sin revisar) tiene su propio error. Nada en el cambio de método justifica moverlos.
- **Resultado ya medido** (mismas emisiones, sin volver a ejecutar nada): mediana de \|Δ\| **220 ms** (≤ 300) y p90 de \|Δ − sesgo\| **403 ms** (≤ 600). Con Δ < −500 ms en el 1,7 %.
- **Reserva**: dos canciones tienen un sesgo grande (+430 ms y +830 ms; en la segunda, el 81 % de las líneas pasa de 500 ms). Sin fines hechos a mano no se sabe si el LRC va adelantado o el modelo va tarde.

**3. Criterio 6 reformulado.** El umbral de 1e-3 en `float32` estaba por debajo del ruido de la propia referencia: `transformers` en `float32` difiere de su `float64` en 1,3e-3. El fin del criterio era comprobar que la implementación propia es la misma. Queda así:
- (a) en `float64`, máx. \|Δ logits\| < 1e-6 entre el codificador propio y `transformers`;
- (b) en `float32`, las **mismas etiquetas** de Viterbi por fotograma y los mismos inicios de palabra que `forced_align`.

Medido: (a) 2,6e-12; (b) idénticas en las 147 líneas probadas, con 0 ms de diferencia. **Cumple.**

**4. Veredicto de la fase 1 con el criterio revisado: PASA EL FILTRO.**

Qué **demuestra**:
- el modelo encuentra el texto cantado en la voz separada sin ayuda del LRC, a unos 220 ms de mediana;
- coste con CPU y memoria dentro de §2.4, criterio 5 (con el equipo cargado);
- determinismo;
- la implementación propia (§3.2) es equivalente.

Qué **no demuestra**:
- la precisión del **fin** (criterios 1–4 de §2.4: no hay V1). El dato informativo es una **señal de alerta**: en las 91 líneas donde «Ajustar los silencios» encuentra un silencio claro, el fin alineado deja ≥ 300 ms de voz detrás en el 59 %, frente al 25 % de los fines prudentes, y cae 300 ms antes de mediana;
- la de las **palabras**: en V2, la canción 10 cumpliría (40 ms, 91 % a ≤ 200 ms) y la 17 no (191 ms, 53 %);
- el coste con GPU;
- la calibración de la confianza;
- el sesgo de las dos canciones de la reserva.

### Decisión tras la fase 1

- **Estado**: sigue **Propuesto**. La decisión (§2.4: todo, solo fines o nada) espera a la **fase 2 con V1** (los fines hechos a mano de §2.2, en el equipo del usuario que los tiene; pregunta 0280). La medida de la fase 2 usa también la **alineación de toda la letra** como base de los inicios de palabra, para que las dos fases midan lo mismo.
- **Etapa 1**: no se adelanta, ni siquiera como función explícita del editor. Lo que entrega la etapa 1 (fines y palabras) es justo lo que la fase 1 no demuestra, y el dato de fines es desfavorable. Además pediría al usuario descargar 1,2 GB por idioma por una función cuyo resultado puede ser peor que «Ajustar los silencios». **0329–0333 quedan bloqueadas por la fase 2**, con una excepción: 0329 (worker) y 0330 (modelos, cola y canales) pueden empezar si la medida de la «señal D» (tarea [0387](../tareas/0387-medir-la-confianza-de-la-alineacion-como-comprobacion-del-encaje.md)) cumple su criterio, porque también la usarían. Sin una de las dos cosas, nada de producto.
- **Coste para el usuario final** (§3.2, ADR 0009): aceptable como **opcional**.
  - 1,26 GB por idioma, que se descargan solo si el usuario lo pide, desde Ajustes o desde la propia acción, nunca en el primer arranque ni en la preparación.
  - Unos 2,7 GB de RAM mientras alinea, y mientras el worker residente siga vivo (5 min sin uso).
  - Menos tiempo que la canción con CPU.
  - Se recomiendan 8 GB de RAM; con menos puede fallar con `MEMORIA_INSUFICIENTE`.
  - La spec 08 debe decir tamaño, memoria y que es opcional antes de descargar.
- **Plan B** (§4): no se aplica, porque la fase 1 no da «no sirve» con el criterio revisado. Si la fase 2 no llega en 0.2.2, la feature 10 pasa a 0.2.3 con la propuesta 027 a la espera. Esa decisión es del usuario (pregunta 0280).

## Fuentes

- Hugging Face: [`jonatasgrosman/wav2vec2-large-xlsr-53-spanish`](https://huggingface.co/jonatasgrosman/wav2vec2-large-xlsr-53-spanish) (Apache-2.0, Common Voice 6.1, 16 kHz; WER 8,82 en Common Voice) y su [API de archivos](https://huggingface.co/api/models/jonatasgrosman/wav2vec2-large-xlsr-53-spanish?blobs=true) (`pytorch_model.bin` de 1 262 101 911 B, revisión `96d7e9b4e4a78af515a3c6d3cee7c0826045d276`); [`…-xlsr-53-english`](https://huggingface.co/jonatasgrosman/wav2vec2-large-xlsr-53-english) (Apache-2.0, con `model.safetensors`); [`facebook/wav2vec2-large-xlsr-53`](https://huggingface.co/facebook/wav2vec2-large-xlsr-53) (Apache-2.0). Consultados el 2026-11-21.
- Mozilla, [Common Voice: conjuntos de datos (CC0)](https://commonvoice.mozilla.org/en/datasets).
- PyTorch: [`torchaudio.functional.forced_align`](https://docs.pytorch.org/audio/2.9.0/generated/torchaudio.functional.forced_align.html), [tutorial de alineación forzada CTC](https://docs.pytorch.org/audio/2.8.0/tutorials/ctc_forced_alignment_api_tutorial.html), [plan de mantenimiento de torchaudio, issue #3902](https://github.com/pytorch/audio/issues/3902) (las extensiones C++/CUDA, incluido `forced_align`, se quedan; actualización de enero de 2026), [`torchaudio` 2.11.1 en PyPI](https://pypi.org/project/torchaudio/2.11.1/) (`torch>=2.11`), [`WAV2VEC2_ASR_BASE_960H`](https://docs.pytorch.org/audio/2.9.0/generated/torchaudio.pipelines.WAV2VEC2_ASR_BASE_960H.html) (MIT), [`VOXPOPULI_ASR_BASE_10K_ES`](https://docs.pytorch.org/audio/2.8.0/generated/torchaudio.pipelines.VOXPOPULI_ASR_BASE_10K_ES.html) y [`MMS_FA`](https://docs.pytorch.org/audio/2.8.0/generated/torchaudio.pipelines.MMS_FA.html) (CC BY-NC 4.0).
- [WhisperX](https://github.com/m-bain/whisperX) (BSD-2-Clause) y M. Bain et al., [«WhisperX: Time-Accurate Speech Transcription of Long-Form Audio»](https://arxiv.org/abs/2303.00747).
- Alineación de letra cantada: D. Stoller, S. Durand y S. Ewert, [«End-to-end Lyrics Alignment for Polyphonic Music Using an Audio-to-Character Recognition Model»](https://arxiv.org/abs/1902.06797) (error medio de 0,35 s en Jamendo); [«Contrastive Learning-based Audio to Lyrics Alignment for Multiple Languages»](https://arxiv.org/abs/2306.07744); [«Transfer Learning of wav2vec 2.0 for Automatic Lyric Transcription»](https://arxiv.org/abs/2207.09747).
- [stable-ts](https://github.com/jianfch/stable-ts) (MIT, archivado), [Montreal Forced Aligner](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) (MIT), exploración [mejoras de experiencia §4](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md#4-tecnologías-y-licencias).
- Calibración propia sobre la biblioteca del usuario (2026-11-21, solo cifras).

## Revisión 2026-11-22 · Canales de la IPC (pregunta 0166)

Rol principal, grupo propio `alineacion.*` (la descarga es una acción explícita del usuario con tamaño y permiso, como `runtime.aceptarYUsarRapido`):

| Canal | Qué hace |
|---|---|
| `alineacion.estado()` | `{ disponible, modelos: [{ idioma, bytes, descargado, licencia }] }` |
| `alineacion.descargarModelo({ idioma })` / `cancelarDescarga({ idioma })` / `quitarModelo({ idioma })` | §3.2 (progreso por `alineacion:progreso` con `tipo: "modelo"`) |
| `alineacion.previsualizar({ cancionId, idioma, ids? })` | Recuentos para el diálogo (líneas, fines a mano, modelo descargado) |
| `alineacion.alinear({ cancionId, idioma, ids? })` → `{ trabajoId }` | Lanza el trabajo (cola `pesada`) |
| `alineacion.cancelar({ trabajoId })` | Cancela |
| Evento `alineacion:progreso` | `{ tipo: "modelo" \| "alineacion", referencia, fase, hechas, total }` |
| Evento **`alineacion:resultado`** | `{ trabajoId, cancionId, resultado: { lineas: [{ id, finMs, confianza, palabras: [{ inicioMs, finMs }] }], omitidas: [{ id, motivo }] } \| null, error \| null }`, en tiempo de audio |

- **Quién aplica**: en el editor, **el renderer** con `aplicarAlineacion` (§3.3) como un solo paso de deshacer, y descarta las líneas que cambiaron mientras se escuchaban (pregunta 0167); main no escribe la letra de una canción abierta en el editor. En la preparación desatendida aplica main.
- `previsualizar` y `alinear` leen la **letra guardada**: el editor vacía su guardado pendiente antes de llamarlos. El `idioma` vale para esa ejecución; si el usuario lo cambia, el renderer lo guarda en `letra.idioma` con el guardado normal.

## Revisión 2026-11-22 · Fase de filtro con letras sin fines (medida con canciones reales)

El único material con voz separada disponible ahora en el equipo de trabajo es la copia de 18 canciones del MVP ([medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)). Tiene inicios de línea de LRCLIB sin revisar, fines no fiables y palabras en 2 canciones de origen desconocido. **No contiene V1**, así que no puede decidir §2.4.

- La prueba se ejecuta en **dos fases** (tarea [0328](../tareas/0328-prueba-tecnica-de-alineacion-forzada.md)):
  1. **Filtro** con esa copia. Mide el inicio de la primera palabra alineada frente al inicio del LRC, con una ventana de −1000 ms para no anclarlo. También los criterios 5 (coste con CPU) y 6 (equivalencia), que no necesitan verdad.
  2. **Decisión** con V1 (§2.4 sin cambios).
- **Umbrales del filtro**: cobertura ≥ 80 %, mediana de `|Δ|` ≤ 300 ms y p90 de `|Δ − sesgo de la canción|` ≤ 600 ms. Doblan los del fin de §2.4 porque la referencia tiene su propio error.
- Si el filtro falla, **no sirve** y se aplica §4 sin esperar a V1. Si pasa, solo se anota «pasa el filtro»: ni los fines ni las palabras se dan por buenos sin V1.
- Se excluyen las canciones cuya letra no corresponde al audio según la medida (5, 8, 12 y 15) y las de idiomas sin modelo del candidato.
