# 0030 — Voz original en las líneas de coro: una envolvente, tres consumidores

- Estado: Aceptado (provisionales en la ampliación de [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md); los tiempos de las rampas se ajustan a oído en la guía manual)
- Fecha: 2026-11-22
- Paso del pipeline: 4 (vista previa del editor) y 6 (reproductor, ventana secundaria y exportación)
- Versión: 0.2.3, feature 2 · Voz en los coros ([plan 5](../versiones/0.2.3/plan-5.md)). Specs: `ux/06-editor.md`, `ux/07-reproductor.md` y `ux/10-exportacion.md` (secciones «0.2.3 · Feature 2»). Depende de [ADR 0029](0029-reparto-de-la-letra-entre-cantantes-y-coro.md) (qué líneas son `coro` y dónde se guarda el nivel). Amplía ADR 0010 y 0011 (audio del editor y del reproductor) y 0019 (mezcla de la exportación).

## Contexto

- Quien canta sin voz guía no oye los coros que nadie hace. El usuario pidió que en los coros «se escuche la voz hasta cierto volumen».
- La separación da **dos pistas**, voz e instrumental (ADR 0004). La voz lleva **juntas** la principal y los coros: no hay pista de coros aparte, y el modelo que la separaría no tiene licencia comprobada (fuera de esta versión).
- **Reproductor y ventana secundaria** (`MotorReproductor`): instrumental y voz suenan a la vez; la voz pasa por su `GainNode` con el nivel de voz guía del equipo (`reproductor.voz_guia`, ganancia lineal 0–1, y `voz_guia_silenciada`). Buscar vuelve a crear las fuentes.
- **Editor** (`MotorAudio`): suena **una sola pista** cada vez (original, voz o instrumental), con bucle, velocidad 0,5 y 0,75 y estiramiento con el tono conservado (WSOLA) de esa pista. Guarda como mucho 2 `AudioBuffer` (LRU). No hay voz sonando junto al instrumental (factibilidad §2.1).
- **Exportación** (worker `exportar.py`): `mezclar(instrumental, voz, ganancia_db)` con la voz al 100 % («Instrumental y voz») o sin voz («Solo instrumental»), y normalización de pico.

## Alternativas consideradas

### 1. Cómo se decide el nivel de la voz en cada instante

| Opción | Pros | Contras |
|---|---|---|
| **A. Una función pura del tiempo (`shared/coros.ts`) que da los tramos de coro y su envolvente; cada consumidor la aplica a su manera** | El mismo instante da lo mismo en reproductor, editor y video (patrón del modelo de render, ADR 0022 §2); se prueba con números | Tres adaptaciones distintas |
| B. Cada consumidor calcula sus tramos | — | Tres reglas que se separan con el tiempo |
| C. Renderizar una pista «instrumental con coros» en disco al guardar | Un archivo y listo | Escribe ~40 MB por canción en cada cambio; caduca con cada edición del reparto o del nivel |

### 2. Vista previa del editor

| Opción | Pros | Contras |
|---|---|---|
| **A. Pista derivada en memoria: instrumental + voz × envolvente, calculada en un Web Worker y usada como una pista más de `MotorAudio`** | Bucle, velocidad, tono conservado y búsqueda siguen igual sin tocarlos | ~85 MB más por 4 min mientras se usa; recalcular al cambiar el nivel o el reparto |
| B. Segunda fuente sincronizada con automatización de ganancia | Sin memoria extra | Hay que reprogramar la automatización en cada vuelta del bucle (va en tiempo del contexto) y estirar también la voz con WSOLA; código delicado en el motor más usado |

## Decisión

Opciones **1A y 2A**.

### 1. Nivel y regla

- **Nivel** por canción: `letra.partes.voz_en_coros` (ADR 0029 §1), 0–1 en pasos de 0,05, **por defecto 0,5**, en la **misma escala lineal** que `reproductor.voz_guia`. 0 = coros sin voz. Se escribe con `letras.guardarTiempos` (`partes`), un paso de deshacer por ráfaga.
- **Nivel de la voz en el instante `t`** (reproductor y secundaria): `máx(vozGuiaEfectiva, envolvente(t))`, con `vozGuiaEfectiva = voz_guia_silenciada ? 0 : voz_guia`. Silenciar la voz guía **no** silencia los coros (decisión 19 de 0160). El volumen general y el silencio general (M) siguen afectando a todo.
- Sin voz separada (`pistas` nulas): no hay coros con voz; suena lo de siempre.

### 2. `shared/coros.ts` (nuevo, puro)

- `tramosCoro(letra, duracionMs)` → `[{ desdeMs, hastaMs }]` en **tiempo de audio** (`inicio_ms + offset_ms`): para cada línea `coro` con inicio, de `inicio − 150 ms` a `finEfectivo + 300 ms`; se unen los tramos separados por menos de 1 s; se recortan a `[0, duracionMs]`. Las líneas sin inicio no cuentan.
- `envolvente(tramos, nivel)` → puntos `[[ms, nivel], …]` de una curva lineal a trozos con **rampas de 150 ms** (sube en `[desde, desde + 150]`, baja en `[hasta − 150, hasta]`); con `nivel = 0` o sin tramos, `[]`.
- `nivelEn(puntos, ms)` → interpolación lineal (0 fuera de los tramos).
- Constantes exportadas `CORO_ANTES_MS = 150`, `CORO_DESPUES_MS = 300`, `CORO_UNIR_MS = 1000`, `CORO_RAMPA_MS = 150`: **provisionales**, se ajustan a oído en la guía manual sin cambiar el contrato.

### 3. Reproductor y ventana secundaria (`MotorReproductor`)

- En cada `arrancar` (reproducir, buscar, repetir) y en cada `fijarVoz`, `fijarCoros(puntos)` o cambio de canción: `cancelScheduledValues` en la ganancia de la voz, `setValueAtTime` con el nivel del instante actual y, para cada punto futuro, `linearRampToValueAtTime(máx(vozGuiaEfectiva, nivel), cuando + (ms − desde)/1000)` en el reloj del `AudioContext`, con el mismo `when` que las fuentes. Son unas decenas de sucesos por canción.
- Las posiciones negativas (silencio previo, ADR 0011 §3) no necesitan caso especial: la envolvente está en tiempo de canción.
- Los puntos los calcula quien carga la canción (reproductor local o ventana secundaria) a partir de la letra de su entrada; la secundaria no necesita IPC nuevo (la instantánea de la sesión ya lleva la letra, ADR 0029 §4).
- Indicador breve de la tecla V en canciones con coros y nivel > 0: el texto de la spec («Voz silenciada · coros al {n} %»).

### 4. Editor (vista previa)

- Con «Escuchar: Instrumental» y la canción con alguna línea `coro` y nivel > 0, `MotorAudio` usa la pista **`instrumental_coros`** en lugar de `instrumental`. Con «Voz» u «Original» no cambia nada (ya suena la voz entera).
- `instrumental_coros` = `instrumental + voz × nivelEn(t)`, muestra a muestra, calculada en un **Web Worker** (el de estiramiento u otro hermano, con `Float32Array` transferidos, sin copiar). Se recalcula con un retardo de 300 ms tras el último cambio de nivel, de reparto o de tiempos de una línea `coro`; mientras tanto suena la anterior (o el instrumental la primera vez). Con un pico mayor que 0,999 se escala como en la exportación.
- `maxBuffers` sube de 2 a **3** solo mientras existe la pista derivada (o se libera la voz tras mezclar si la memoria lo pide; lo mide la tarea). Coste medido o estimado en la tarea: ≈ 85 MB por 4 min, ≈ 210 MB por 10 min.
- **[▶ Escuchar]** de Funciones › «Cantantes y coros»: reproduce con `instrumental_coros` desde 2 s antes de la próxima línea `coro` tras el cabezal hasta 1 s después de su fin y vuelve a la posición previa en pausa (patrón de la escucha de comprobación).

### 5. Exportación de video

- `iniciarExportacion` e `iniciarLote` admiten **`coros: boolean`** (opcional; ausente = `false`). Solo cuenta con `audio: "instrumental"` y en canciones con líneas `coro` y nivel > 0; con «Instrumental y voz» la voz va al 100 % como hoy.
- Main calcula los puntos con `tramosCoro` y `envolvente` desde la **instantánea** de la exportación (ADR 0019 §3; en un lote, por canción) y los pasa al worker como `audio.voz_envolvente: [[ms, nivel], …]` (como mucho 10 000 puntos; `ms` crecientes; nivel 0–1). Con envolvente, el worker decodifica la voz y hace `mezcla += voz × np.interp(t, ms, nivel) × g` antes de la normalización de pico. `_validar` rechaza puntos mal formados con `ARGUMENTOS_NO_VALIDOS`.
- La casilla «Incluir la voz en los coros ({n} %)» aparece en el diálogo de una canción y en el de varias (0.2.2, feature 8) cuando aplica, **marcada** por defecto (decisión 20 de 0160); su último valor se recuerda en `config.exportacion.coros: boolean` (lectura tolerante, por defecto `true`, escribible por el renderer). Provisional: lo confirma la spec 10.
- La estimación de tamaño y el tiempo no cambian de forma apreciable.

### 6. Pruebas mínimas

- Vitest en `shared/`: `tramosCoro` (offset, unión < 1 s, recorte, líneas sin inicio, `finEfectivo`), `envolvente` y `nivelEn` (rampas, nivel 0, sin coros).
- Vitest del motor con un `AudioContext` falso: sucesos programados al arrancar, buscar a mitad de un coro y `fijarVoz` con la voz guía silenciada y al 100 %.
- Vitest de la mezcla derivada (una señal sintética: voz solo dentro de los tramos, al nivel ± 1 %).
- pytest: `mezclar` con envolvente (voz ausente fuera de los tramos y a `nivel × g` dentro) y `_validar` con puntos inválidos.
- E2E: ninguna nueva obligatoria; la de exportación sigue pasando.
- Manual (guía de QA): chasquidos con 3 canciones con coros, voz guía silenciada y al 100 %, buscar a mitad de un coro, ventana secundaria, y un video «Solo instrumental» con y sin la casilla.

## Consecuencias

- **Positivas**: los coros se oyen sin que nadie los cante; una sola regla de tiempo para las cuatro salidas; sin tecnologías nuevas (Web Audio, Web Workers y numpy ya están en el proyecto).
- **Negativas / riesgos**: la voz separada lleva también la voz principal: si canta a la vez que el coro, también se oye (se dice en la ayuda). La pista derivada del editor gasta memoria. Las rampas podrían oírse en alguna mezcla (se ajustan las constantes).
- **Legales / licencias**: sin dependencias nuevas. El video sigue siendo para uso personal (ADR 0019).
- **Impacto en UX**: deslizador y [▶ Escuchar] en Funciones, texto del indicador de V, casilla en los diálogos de exportación.

## Fuentes

- [Factibilidad técnica](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md) §2; [exploración UX](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md) §5.
- MDN, [AudioParam](https://developer.mozilla.org/en-US/docs/Web/API/AudioParam) (`setValueAtTime`, `linearRampToValueAtTime`, `cancelScheduledValues`) y [Transferable objects](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects).
- NumPy, [`numpy.interp`](https://numpy.org/doc/stable/reference/generated/numpy.interp.html).
- ADR [0004](0004-separacion-voz-instrumental.md), [0010](0010-editor-motor-de-audio-reloj-y-guardado.md), [0011](0011-reproductor-pantalla-completa-y-reutilizacion-del-motor.md) §3, [0019](0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) §3–§4, [0022](0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) §2.
