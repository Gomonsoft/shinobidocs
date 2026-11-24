# 0025 — Preparación desatendida hasta «Lista para revisar» y datos de la canción automáticos

- Estado: Aceptado (provisionales en [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md))
- Fecha: 2026-11-21
- Paso del pipeline: 1 (fuente: metadatos), 3 (letra) y transversal (orquestación)
- Versión: 0.2.2, features 5 ([propuesta 020](../propuestas/020-preparacion-desatendida.md)) y 6 ([propuesta 024](../propuestas/024-datos-de-la-cancion-automaticos.md)). Specs: [02](../ux/02-biblioteca.md), [03](../ux/03-anadir-cancion.md), [04](../ux/04-progreso-pipeline.md), [05](../ux/05-letra.md) y [08](../ux/08-ajustes-y-acerca.md) (secciones «0.2.2 · Feature 5» y «Feature 6»). Responde a [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) en lo que toca a estas features. **Revisa** la regla de privacidad de ADR 0005 (cuándo se consulta LRCLIB) y la heurística de metadatos de ADR 0003.

## Contexto

El pipeline automático termina en la separación. La búsqueda de letra solo se lanza al entrar en la vista Letra (ADR 0005, revisión 2026-11-05: «Solo se envían título, artista, álbum y duración … y solo cuando el usuario entra en el paso Letra o pulsa Buscar»). En la biblioteca del usuario, 5 de 17 canciones llevan 11 días como borrador sin que la búsqueda se haya lanzado. Separar tarda 28 s de media con GPU.

Lo que ya existe y se reutiliza: `GestorTrabajos` con colas `pesada` y `ligera` (ADR 0009 §7), el cliente de LRCLIB en main con presupuesto, serialización y `Retry-After` (ADR 0005), `ServicioLetras` como único escritor de la letra, la caché de picos y su servicio (ADR 0015), `proponerAjusteSilencios` (ADR 0018 §6, función pura de `shared/`) y la comprobación de encaje (ADR 0024).

Restricciones de datos (ADR 0006): `cancion.estado` es `z.enum(['borrador', 'lista'])` en 0.2.1. **Un valor nuevo («lista para revisar») haría que 0.2.1 diera la canción por dañada.** `cancionSchema` es `z.object`: una clave nueva se descarta sin error.

## Alternativas consideradas

### 1. Cómo se representa «Lista para revisar»

| Opción | Pros | Contras |
|---|---|---|
| A. Nuevo valor de `cancion.estado` | Explícito | 0.2.1 rechaza la canción. Habría que subir `cancion.esquema` |
| **B. Campo opcional `preparacion` con su propio estado; `estado` sigue en `borrador`** | 0.2.1 lo descarta y ve un borrador con letra (lo que es); la elegibilidad para Lista no cambia | Un estado derivado más que la Biblioteca tiene que combinar |
| C. Derivarlo solo de los pasos (borrador con letra y pistas) | Sin datos | No distingue «la app lo preparó» de «el usuario lo dejó a medias», ni guarda «Elige la letra» ni sus candidatos |

### 2. Dónde vive la orquestación

| Opción | Pros | Contras |
|---|---|---|
| **A. Servicio nuevo en main (`ServicioPreparacion`), una máquina de estados por canción que encadena operaciones existentes** | Main ya es dueño de la letra, la biblioteca, la cola y LRCLIB; nada cambia en el worker | Un servicio más que conoce a varios |
| B. Un trabajo largo del worker | — | El worker no puede escribir `cancion.json` (ADR 0006) ni hablar con LRCLIB (está en main) |
| C. El renderer (al terminar la separación) | Poco código | Solo funciona con la ventana abierta en la vista correcta: el problema de hoy |

### 3. Qué se guarda de los candidatos de «Elige la letra»

| Opción | Pros | Contras |
|---|---|---|
| **A. Solo identificadores y resumen (id de LRCLIB, nombres, duración, tipo, encaje); el texto se vuelve a pedir por id al abrir la vista** | Mantiene la mitigación legal de ADR 0005 («solo se guarda la letra elegida»); pocos bytes | Una petición más al abrir; sin red, la vista avisa |
| B. Guardar los textos de los candidatos | Funciona sin red | Guarda en disco letras que el usuario no ha elegido |

### 4. Fuente extra de metadatos (feature 6)

| Opción | Pros | Contras |
|---|---|---|
| **A. Sin servicio nuevo: etiquetas del archivo (PyAV), campos de música de yt-dlp, heurística sobre el nombre y la respuesta de LRCLIB que ya se pide** | Cero accesos a red nuevos; cubre el caso real (17 de 17 canciones con álbum; 13 dependen de él para el tema) | El álbum de LRCLIB puede ser de otra edición |
| B. MusicBrainz como respaldo | Datos abiertos (CC0) y normalizados | Otro servicio externo: 1 petición por segundo por IP y `User-Agent` con contacto obligatorio; otra regla de privacidad e interruptor. No hay evidencia de que haga falta |

## Decisión

Opciones **1B, 2A, 3A y 4A**.

### 1. Datos: `cancion.preparacion` (opcional, sin subir `esquema`)

```jsonc
"preparacion": {                     // registro de la preparación (0153 §4); opcional
  "estado": "en_curso",              // "en_curso" | "lista_para_revisar" | "elige_letra" | "sin_letra" | "detenida" | "error"
  "paso": "comprobando",             // en curso: "buscando_letra" | "esperando_separacion" | "comprobando" | "ajustando_fines"; si no, null
  "origen": "automatica",            // "automatica" (al añadir) | "manual" («Preparar»)
  "actualizado": "2026-11-21T10:00:00Z",
  "busqueda": {                      // resultado de la búsqueda automática, sin letras (0153 §5)
    "resultado": "elige",            // "elegida" | "elige" | "sin_letra" | "instrumental" | "pendiente"
    "candidatas": 3,
    "motivo": null,                  // código de ADR 0005 si no hubo resultado (SIN_CONEXION…)
    "ids": [123, 456, 789]           // ids de LRCLIB para volver a pedir los textos por id; como mucho 10
  },
  "eleccion": { "por": "app", "fecha": "2026-11-21T10:01:00Z", "lrclib_id": 123 },   // "app" | "usuario"; null si no hay letra
  "desfase_ms": 800,                 // corrección aplicada por la preparación (la misma que letra.desfase_corregido_ms)
  "fines": { "metodo": "silencios", "lineas": 23 },   // "silencios" | "alineacion" | null; las líneas llevan origen_fin "preparacion" o "alineacion"
  "dudosas": 3,                      // recuento derivado (ADR 0024 §3)
  "revisada": false,                 // true cuando el usuario cierra el aviso, cambia un tiempo o un texto, o marca la canción
  "error": null                      // { codigo, mensaje } con "error"; { codigo: "CIERRE" } con "detenida" por cierre
}
```

- La escribe **solo** `ServicioPreparacion` a través de `ServicioBiblioteca` (único escritor). **Se conserva** como registro después de terminar (de ahí salen «Letra elegida automáticamente», el banner del editor y el bloque «Preparación automática» de la spec); main pone `revisada: true` en los casos de la spec y nunca la borra sola. Si el usuario elige otra letra, `eleccion.por` pasa a `"usuario"`.
- **Los candidatos no se guardan como texto** (opción 3A): solo `busqueda` con sus ids. Durante la sesión la lista completa vive en memoria; al entrar en Letra sin ella, main pide los textos por id (`/api/get/{id}`) o, si fallan, repite la búsqueda. Es compatible con la mitigación de ADR 0005: en disco solo está la letra elegida y metadatos (nombre, artista, duración, id) que no son la letra.
- **Derivado para la interfaz** (`shared/derivados.ts`): `estadoPreparacion(cancion)` combina `preparacion` con los pasos. Una canción `borrador` con `preparacion.estado = "lista_para_revisar"` y todas las líneas con inicio es «Lista para revisar» (insignia propia; no es un valor de `estado`). El resumen de la Biblioteca expone `preparacion: { estado, paso, busqueda: { resultado, candidatas }, dudosas, revisada } | null` y los recuentos para la bandeja de pendientes.
- **«Probar» un borrador desde la Biblioteca** (0153 §6): sin impedimento técnico. El reproductor local se abre con la canción guardada (`biblioteca.obtener(id)`), como con una Lista, si tiene pistas y al menos una línea con inicio; omite las líneas sin inicio (regla de `incompleta`, ADR 0006). No toca su estado ni entra en la cola ni en la sesión.
- **«Nunca se marca Lista sola»**: la preparación no llama a `marcarLista`. Las reglas de Lista y Letra lista (ADR 0006, 0018 §5) no cambian.
- `pasos` no cambia: `pasos.letra` sigue derivándose de que haya letra (ADR 0006, revisión 2026-11-05).
- 0.2.1 descarta `preparacion` y ve un borrador con letra.

### 2. `ServicioPreparacion` (`main/preparacion/`)

Máquina de estados por canción, con pasos idempotentes y reanudables. Cada paso usa lo que ya existe:

| Paso | Cuándo empieza | Qué hace | Si falla |
|---|---|---|---|
| `buscando_letra` | `pasos.fuente` completado (no espera a la separación) | `BusquedaLetras` de main con título, artista, álbum y duración (estrategia de ADR 0005), en la **cola automática** de LRCLIB (§4) | Sin red o servicio caído: reintento a los 10 min, como mucho 3 veces; luego `error` con el código de ADR 0005. `LETRA_NO_ENCONTRADA` → `sin_letra`. `INSTRUMENTAL` → `sin_letra` con ese código |
| `esperando_separacion` | Hay candidatos | Espera a `pasos.separacion = completado` y pide los picos (servicio de ADR 0015) | Separación en error: `elige_letra` con los candidatos sin encaje |
| `comprobando` | Picos `lista` | `evaluarEncaje` (ADR 0024) sobre cada candidato con tiempos | — |
| — (elección) | — | **Elección automática** (§3). Si elige: `ServicioLetras.guardar` con la letra (y `offset_ms` corregido). Si no: `elige_letra` con candidatos | — |
| `ajustando_fines` | Letra guardada | Con la alineación disponible (ADR 0028, si la etapa 1 entra, el idioma está admitido y su modelo **ya** está descargado): trabajo `alinear-letra`, con `origen_fin: "alineacion"`. Si no: `proponerAjusteSilencios` en main sobre el nivel base de picos en su **variante prudente** (0153 §11): parámetro `{ soloFinesAutomaticos: true, activarComodin: false }`, que solo toca líneas con `fin_ms: null`, no cambia los fines que traía la letra ni activa la cuenta 3·2·1; con `origen_fin: "preparacion"` | Alineación fallida: se usa la variante prudente y se anota en `fines.metodo` |
| — (cierre) | — | `detectarDudosas` (ADR 0024 §3) para `resumen.dudosas`; estado `lista_para_revisar` | — |

- **Concurrencia**: los pasos de red van por la cola automática de LRCLIB (una petición a la vez); la espera de la separación y de los picos no ocupa nada; la alineación va a la cola `pesada` de `GestorTrabajos` (detrás de las separaciones, para no cargar dos modelos en la GPU). Las demás operaciones son funciones puras en main (milisegundos).
- **Qué la detiene**: cancelar desde la tarjeta o el progreso (`preparacion.cancelar`), eliminar la canción, guardar el usuario una letra o tiempos en esa canción, o apagar el interruptor (las que estén `en_curso` en el paso `buscando_letra` y aún no hayan enviado nada se detienen). Detener deja `detenida` (o retira el campo si no había hecho nada; lo concreta la spec).
- **Durante una sesión en vivo** (ADR 0017 §9): la preparación escribe en la canción, así que respeta `EDICION_BLOQUEADA`: si la canción está en la cola de la sesión, espera a que salga de ella.
- **Cerrar la app**: lo que esté en curso pasa a `detenida` con su paso; al abrir se reanuda (§5).

### 3. Elección automática de la letra (feature 5, con la 4)

Se elige **sin preguntar** solo si se cumplen todas:

1. El candidato tiene tiempos por línea (`syncedLyrics` o `lyricsfile`; nunca solo texto).
2. `|duración del candidato − duración del audio| ≤ 2000 ms`.
3. `evaluarEncaje` da `coincide` o `desfasada` (en este caso se guarda con la corrección).
4. Si hay varios que cumplen 1–3, el primero en el orden de ADR 0005 (el de `get` primero); si dos de ellos tienen textos distintos tras normalizar (`normalizar.ts`), **no** se elige y se pasa a `elige_letra` (dos letras «buenas» distintas es ambiguo).

En cualquier otro caso: `elige_letra` con los candidatos ordenados como en la vista Letra (ADR 0024 §2). Con un solo candidato sincronizado `dudosa` tampoco se elige (provisional).

### 4. LRCLIB: regla de privacidad revisada y cola automática (revisión de ADR 0005)

- **Regla nueva**: título, artista, álbum y duración se envían a LRCLIB (a) cuando el usuario entra en Letra o pulsa Buscar, como hasta ahora, (b) cuando pulsa «Preparar» en una o varias canciones, y (c) **automáticamente al añadir una canción** si el interruptor **«Buscar la letra automáticamente»** está activo. Lo demás (cabeceras, sin datos del equipo, URL fija) no cambia.
- **Interruptor**: `config.preparacion.automatica: boolean`, **activado por defecto** (provisional: el criterio del plan es automatizar al máximo; el usuario puede preferir que venga apagado). Lectura tolerante, escrito con `config.actualizar`. Apagado: al añadir una canción solo se separa, como en 0.2.1; «Preparar» sigue funcionando porque es una acción explícita. El texto de primer arranque y Ajustes lo mencionan (spec 08).
- **Cola automática**: las peticiones de la preparación pasan por una cola con un **mínimo de 1,5 s entre peticiones** (como mucho 40 por minuto, por debajo de los ~45 por minuto anónimos de ADR 0005) y respetan `Retry-After` con su margen aleatorio. Una búsqueda interactiva (vista Letra) **adelanta** a la cola automática y conserva su presupuesto de 10 s. Un lote de 50 canciones son ~150 peticiones: unos 4 minutos de búsquedas, en paralelo con las separaciones.
- **Texto de un candidato por id** (para `elige_letra`, opción 3A): `GET /api/get/{id}` al abrir la vista Letra de esa canción, con la caché en memoria de 10 min de siempre.
- **Legal**: sin cambios en la mitigación: solo se guarda la letra elegida (por la app o por el usuario), en su `cancion.json`, con la atribución «Letra: LRCLIB». La elección automática es una decisión de la app en nombre del usuario para su uso personal; la tarjeta muestra siempre el origen.

### 5. Cola de preparación: tanda, pausa, paradas y reanudar al abrir (0153 §14 y §15)

- **Tanda** (en memoria de main): desde que la cola deja de estar vacía hasta que vuelve a estarlo. Lleva total, terminadas, resultado por canción y estimación de tiempo con el factor de separación medido (ADR 0004) y, si hay alineación, su factor (ADR 0028). Se expone con `preparacion.tanda()` y el evento `preparacion:tanda`.
- **Pausa** de toda la cola (`preparacion.pausar` / `reanudar`): deja terminar el trabajo en curso y no lanza más. Se **conserva al cerrar** en `config.preparacion.pausada` (booleano, lectura tolerante, solo main).
- **Paradas automáticas**: `YOUTUBE_BLOQUEADO` o `SIN_CONEXION` paran **solo las descargas** (las separaciones y la letra de lo ya descargado siguen); main comprueba la conexión cada 60 s con una petición `HEAD` a `https://lrclib.net` sin datos y reanuda solo. `SIN_ESPACIO`, `RUNTIME_NO_DISPONIBLE` o tres fallos seguidos con el mismo código paran **toda** la cola (pausa con motivo). «Reintentar las fallidas» vuelve a encolar las de la tanda en `error`.
- **Pausa entre descargas de YouTube** (0153 §14f, recomendada): espera aleatoria de 3 a 8 s entre dos descargas seguidas para reducir bloqueos; no se aplica a la primera.
- **Reanudar al abrir**: `GestorTrabajos` y `ServicioPreparacion` mantienen el diario **`<base>/trabajos/pendientes.json`** (escritura atómica, ADR 0006) con `[{ cancionId, tipo, orden, interrupciones }]` de lo que está en curso o en cola. Al arrancar, **después** de la comprobación del runtime (ADR 0009 §6; si está dañado no se reanuda nada hasta repararlo), main vuelve a encolar todo en su orden y emite `preparacion:reanudada` con el recuento para que la spec ofrezca «Detener». El trabajo que estaba **en curso** suma 1 a `interrupciones`; si llega a 2 (interrumpido en dos arranques seguidos), se queda `interrumpido` como hoy y no se reanuda. Si la pausa estaba activa, se reanuda en pausa.
- Una descarga de YouTube interrumpida empieza de nuevo (yt-dlp no reanuda en el MVP); una separación interrumpida también.
- **Avisos al terminar** (0153 §17): en una tanda de 2 o más canciones, `ServicioAvisos` (main) no emite el aviso de cada canción y emite uno de tipo `tanda` al vaciarse la cola. Es un tipo más del catálogo de avisos existente; el canal no cambia.

### 6. Datos de la canción automáticos (feature 6, revisión de ADR 0003)

- **Archivo local** (`importar-archivo`, worker): además de `title`, `artist` y `album`, se leen `album_artist`, `track` (número) y `date` de los metadatos del contenedor y de la primera pista de audio (`container.metadata` y `stream.metadata` de PyAV, claves en minúscula que normaliza FFmpeg para ID3, Vorbis y MP4). `artist` vacío cae a `album_artist`.
- **YouTube** (`info-youtube` y entradas de lista, ADR 0026): campos de música de yt-dlp `track`, `artists`/`artist`, `album`, `album_artist`, `release_year` y `track_number` cuando existen (vídeos de YouTube Music y descripciones «Provided to YouTube by …»); si no, la heurística de ADR 0003 sobre `title` y `channel`/`uploader`.
- **Nombre del archivo** (`shared/metadatosNombre.ts`, puro, nuevo): quita la extensión, los números de pista iniciales (`01 `, `01. `, `01 - `, `1-01 `), guiones bajos y los sufijos de ADR 0003; separa `Artista - Título` por ` - `, ` – ` o ` — `. Con la importación de una **carpeta** (ADR 0026), si ninguna pista trae álbum, se propone el nombre de la carpeta como álbum (y `Artista - Álbum` si lo tiene). Siempre editable.
- **LRCLIB**: si la preparación elige una letra y la canción tiene el **álbum vacío**, se rellena con `albumName` del registro elegido (y solo el álbum; título y artista nunca se cambian solos). Puede cambiar el tema heredado (ADR 0016: el álbum es parte de la identidad): es lo que el usuario espera en la mayoría de casos y queda visible por el origen.
- **Origen visible**: `metadatos.origen?: { titulo?, artista?, album? }` con valores `"fuente"` (etiqueta del archivo o campo de YouTube), `"nombre"` (heurística), `"lrclib"` o `"usuario"`; ausente = desconocido (canciones de 0.2.1). Main pone `"usuario"` en cada campo que cambia `biblioteca.editarDatos` o el formulario de Añadir. Lectura tolerante (`.catch`).
- **Autocompletado y unificación** (spec 03): sin datos nuevos. Main expone en el resumen de la biblioteca los valores existentes de artista y álbum con su clave de identidad (ADR 0016 §4); la sugerencia «¿Te refieres a…?» compara con la clave (NFC, espacios, minúsculas) **y** además sin diacríticos ni puntuación final (`…` = `...`), en `shared/identidad.ts` (`claveFlexible`, nueva). La clave de identidad de ADR 0016 no cambia.
- **Nunca se sobrescribe** un valor con origen `"usuario"`.
- **Lo que devuelve main al proponer** (0153 §8): por campo `{ valor, origen, dudoso, alternativa? }`, donde `dudoso` sigue la lista de la spec 03 (heurística sobre el título del vídeo, artista igual al canal, nombre de archivo sin separador, valor que solo existe en una fila del lote…) y `alternativa` es la grafía existente en la biblioteca si `claveFlexible` coincide y la grafía difiere. La lista de artistas y álbumes con su recuento sale del índice en memoria (`biblioteca.valoresDatos()`), sin leer disco.
- **Álbum desde LRCLIB** (0153 §8d): se recuerda con `metadatos.origen.album = "lrclib"`; «Quitar» lo vacía y pone el origen `"usuario"`, así que no se vuelve a rellenar. Sin más reparos que el cambio de tema heredado ya dicho.
- **Campos de yt-dlp** comprobados en su documentación (0153 §8e): `track`, `artists`/`artist`, `album`, `album_artist`, `track_number`, `release_year`; en listas, `playlist_title`, `playlist_count` y, por entrada en modo plano, `id`, `title`, `duration`, `channel` y `availability` (no siempre: el modo plano «puede no traer» parte de los metadatos).

### 7. IPC (rol principal)

| Canal | Qué hace |
|---|---|
| `preparacion.previsualizar({ ids })` | Sin ejecutar nada: por canción, si aplica y qué hará (`{ id, aplica, pasos: [...], motivo? }`); lo usa el diálogo de la feature 8 (0153 §7a) |
| `preparacion.preparar({ ids })` | Lanza la preparación desde el **primer paso pendiente** de cada canción, en la tanda actual (0157 §4). Nunca sustituye una letra existente ni toca tiempos editados (solo continúa con fines si la letra sigue `intacta`). Cuenta como búsqueda iniciada por el usuario aunque el interruptor esté apagado. Responde `{ aceptadas, omitidas: [{ id, motivo }] }` (motivos: `YA_LISTA`, `EN_CURSO`, `SIN_FUENTE`, `EDICION_BLOQUEADA`, `NADA_QUE_HACER`) |
| `preparacion.pausar()` / `preparacion.reanudar()` / `preparacion.reintentarFallidas()` / `preparacion.tanda()` | §5 |
| `preparacion.cancelar({ id })` | Detiene la de una canción |
| `preparacion:cambio` (evento) | `{ id, preparacion }` en cada cambio de estado o paso |
| `preparacion:reanudada` (evento) | `{ total }` al reanudar al abrir |
| `letras.candidatoPorId({ cancionId, lrclibId })` | Texto de un candidato guardado (opción 3A) |

`config.preparacion.automatica` va en `configParcialRendererSchema`. Sin roles nuevos.

### 8. Pruebas mínimas

- Vitest en main con el doble de LRCLIB, un `GestorTrabajos` falso y picos sintéticos: cada transición de la tabla de §2, elección automática (los cuatro criterios y la ambigüedad), `elige_letra` con candidatos sin textos, cola automática a ≥ 1,5 s y adelantada por una búsqueda interactiva, `Retry-After`, interruptor apagado, detención por edición del usuario y por eliminar, reanudación al abrir solo de las «detenidas por cierre».
- Vitest en `shared/`: `estadoPreparacion`, `metadatosNombre` (tabla de nombres reales anonimizados), `claveFlexible`.
- Worker (pytest): lectura de `album_artist`, `track` y `date` de un FLAC y un MP3 generados con etiquetas.
- E2E: una prueba secundaria: añadir un WAV con el doble de LRCLIB y el separador falso y ver la tarjeta llegar sola a «Lista para revisar»; los críticos se ejecutan (toca `main/`, `shared/` y Añadir canción).
- Manual: preparación real con red de un borrador del usuario y de un álbum de YouTube; privacidad con el interruptor apagado (sin peticiones a LRCLIB al añadir).

## Consecuencias

- **Positivas**: la canción llega sola a «Lista para revisar»; los 5 borradores actuales se rescatan con «Preparar»; sin dependencias, sin worker nuevo y sin esquema nuevo.
- **Negativas / riesgos**: elegir mal la letra en silencio (mitigado: cuatro criterios, encaje con 0/90 falsos aceptados en la calibración y origen visible); «Ajustar los silencios» automático deja fines con el error medido (ADR 0024: en Arrópame no encuentra silencio en 13 de 26 líneas), que la revisión guiada señala; el álbum de LRCLIB puede ser de otra edición y cambiar el tema heredado.
- **Legales / privacidad**: LRCLIB recibe título, artista, álbum y duración al añadir cada canción (con el interruptor activo); se dice en el primer arranque y en Ajustes.
- **Impacto en UX**: estados nuevos de tarjeta, bandeja de pendientes, aviso de reanudación, interruptor, origen de los datos.

## Fuentes

- ADR [0005](0005-letras-y-formato-de-sincronia.md) (LRCLIB, límites y mitigación), [0003](0003-fuente-de-audio.md), [0006](0006-persistencia-y-modelo-de-datos.md), [0016](0016-catalogo-de-temas-e-identidad-de-artista-y-album.md), [0018](0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md), [0024](0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md).
- yt-dlp, [README: campos de pistas y álbumes de música](https://github.com/yt-dlp/yt-dlp#output-template) (`track`, `artists`, `album`, `album_artist`, `track_number`, `release_year`), consultado el 2026-11-21.
- MusicBrainz, [Rate Limiting](https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting) («1 request per second» de media por IP; `User-Agent` con nombre, versión y contacto obligatorio), consultado el 2026-11-21.
- PyAV, [`container.metadata`](https://pyav.basswood-io.com/docs/stable/api/container.html) y FFmpeg, [metadatos de contenedores](https://ffmpeg.org/doxygen/trunk/group__metadata__api.html) (claves normalizadas).
- LRCLIB, [documentación de la API](https://lrclib.net/docs) (`/api/get/{id}`).

## Revisión 2026-11-22 · Formas de la IPC (pregunta 0166)

- `preparacion.preparar({ ids })` → `{ aceptadas: string[], omitidas: [{ id, motivo }] }` (ids de las aceptadas).
- `preparacion.tanda()` y el evento `preparacion:tanda` → `null` sin tanda, o `{ total, terminadas, pausada, motivoPausa, estimacionMin, descargasParadas, canciones }`:
  - `pausada: true` con `motivoPausa: null` = pausa del usuario; con un código (`SIN_ESPACIO`, `RUNTIME_NO_DISPONIBLE`, o el de tres fallos seguidos) = parada automática de toda la cola (§5).
  - `descargasParadas: "YOUTUBE_BLOQUEADO" | "SIN_CONEXION" | null`: parada solo de las descargas (§5).
  - `estimacionMin`: minutos restantes; `null` mientras se calcula.
  - `canciones: [{ id, resultado, motivo?, dudosas? }]` en el orden de la cola, con `resultado` `null` (sin resultado aún), `lista_para_revisar`, `elige_letra`, `sin_letra`, `letra_pendiente`, `error` o `cancelada`; de ahí sale el diálogo «Resultado de la preparación» (spec 04).

## Revisión 2026-11-22 · Contratos de los datos propuestos (pregunta 0220)

- **Propuesta por campo** (§6): viaja en un campo opcional `datos: { titulo, artista, album }` de `fuente.importarArchivo` y `fuente.infoYoutube`, junto a `metadatos`, que no cambia. Cada campo es `{ valor, origen, dudoso, invertido?, alternativa? }`.
  - `origen` es el detalle de la spec (`etiquetas | nombre | carpeta | video | pista | canal | lista | biblioteca`, o `null`).
  - Si `claveFlexible` coincide con un valor existente, `valor` lleva la grafía de la biblioteca (origen `biblioteca`) y `alternativa` la propuesta original. Corrige §6, que decía lo contrario; manda la spec, F6-N3.
- **Worker**: `importar-archivo` devuelve `etiquetas` crudas e `info-youtube` devuelve `musica` (campos de YouTube Music y título y canal limpios). La limpieza es del worker; el origen, la inversión y el «dudoso» los decide main (`main/fuente/propuestaDatos.ts`).
- **Almacén**: al confirmar, `metadatos.origen` guarda `fuente`, `nombre` o `usuario` (si el valor confirmado difiere del propuesto); `biblioteca.actualizarMetadatos` pone `usuario` en cada campo que cambia, también al vaciarlo.
- **`biblioteca.valoresDatos`**: cada álbum lleva `artistas?: string[]` (claves de identidad) para ordenar; el álbum se agrupa solo por su clave.
- **Álbum desde LRCLIB**: `rellenarAlbumDesdeLrclib` (`main/biblioteca/origen.ts`) se aplica al guardar **cualquier** letra de LRCLIB, de la preparación o elegida por el usuario. Así se cumple la spec 03 F6-N7, que es más amplia que §6. La letra guarda `datos_lrclib: { titulo, artista, album }` (opcional, tolerante; metadatos del registro, no texto de la letra) para la sugerencia «Usar estos datos». Se implementa en la feature 5 (tareas 0308 y 0311).

## Revisión 2026-11-22 · Reintento, LRC sin fines y edición durante la corrida (preguntas 0221–0223)

- **Reintento de la búsqueda** (§2, `buscando_letra`): sin red o con el servicio caído se reintenta **una vez a los 60 s**. Si vuelve a fallar, el registro queda en `error` con el código de ADR 0005 y `busqueda.resultado: "pendiente"`, que la interfaz muestra como «Letra pendiente». Se reintenta solo en el siguiente arranque, con [Reintentar] o al entrar en Letra (spec 04, F5-P5). Sustituye a «10 min, como mucho 3 veces».
- **LRC sin fines** (§3, criterio 3): por ahora se evalúa el candidato tal como viene. Si la medida de la tarea 0371 cumple el criterio de la pregunta 0222, la elección y el encaje de la vista Letra evaluarán con fines prudentes en memoria, y se anotará aquí.
- **Letra elegida por el usuario durante la corrida**: la corrida continúa sin buscar ni sustituir; solo comprueba y pone fines si la letra sigue `intacta`. **Cambio de tiempos o texto de una letra que ya existía**: la corrida se detiene (retira el registro si no había hecho nada; si no, `detenida`).
- **Sesión en vivo** (§2): la espera es **global**, mientras `ServicioSesion.edicionBloqueada()` sea verdadero, porque ADR 0017 §9 bloquea todas las escrituras de letra. Corrige «si la canción está en la cola». Descarga, separación y búsqueda siguen; solo esperan las escrituras.
- **Separación pendiente sin trabajo**: al llegar a `esperando_separacion`, si la fuente está completada, la separación `pendiente` y no hay trabajo de separación de la canción, la corrida la encola (cola `pesada`). Con la separación en `error` rige §2.

## Revisión 2026-11-22 · Aviso de tanda y pruebas sin red real (pregunta 0224)

- **Aviso `tanda`** (§5): tipo del catálogo de `ServicioAvisos`, sin canción, con `texto` `act.cola.fin`, `etiqueta` «Ver resultado» y destino `biblioteca`. El clic en su notificación del sistema emite el evento propio **`preparacion:abrirResultado`** (sin carga), no `abrirCancion` con un id vacío. El renderer abre la Biblioteca con el diálogo «Resultado de la preparación».
- **Diario** `trabajos/pendientes.json`: cada entrada lleva además `enCurso: boolean` (lectura tolerante, `false`). Solo las entradas en curso al cerrar suman `interrupciones`.
- **Pruebas**: ninguna prueba automática sale a lrclib.net (ni a otro servicio real). Van al doble (`SHINOBI_LRCLIB_URL`) o a `http://lrclib.invalid`. Defensa en el producto: sin empaquetar y con `SHINOBI_E2E=1`, la URL base de LRCLIB, que usan la búsqueda y la comprobación de conexión, nunca es la real (tarea 0372).

## Revisión 2026-11-22 · Motivo de la no elección (pregunta 0235)

- `preparacion.busqueda` gana **`no_elige`**: `"varias" | "sinExacta" | "duda" | "noCoincide" | "soloTexto" | "sinComprobar" | null` (tolerante), el motivo por el que la elección automática (§3) no eligió. Es el mismo catálogo que los textos `let.prep.motivo.*`.
- `busqueda.motivo` es solo el código de ADR 0005 de un fallo de búsqueda (`SIN_CONEXION`, `SERVICIO_NO_DISPONIBLE`…).
- El resumen (`ResumenPreparacionIpc.busqueda`) expone `motivo` y `noElige`. La interfaz los lee y no deduce nada.
- `aplicaPreparar(cancion)` en `shared/derivados.ts` es la regla común de §7 para `preparacion.previsualizar` y para «Preparar» de una tarjeta.
- Canal `biblioteca.marcarPreparacionRevisada(id)` → resumen o `null`, rol principal: pone `preparacion.revisada = true`. Es un metadato, así que se admite durante una sesión en vivo.

## Revisión 2026-11-22 · Solicitud de cierre perdida (pregunta 0236)

- Main recuerda la solicitud de cierre sin responder (`ControlCierre.pendiente()`) y la expone con **`app.solicitudCierrePendiente()`** → `SolicitudCierreIpc | null` (rol principal, solo lectura). El diálogo de cierre la consulta al montar, porque el evento `app:solicitudCierre` puede llegar antes de que el diálogo exista.
- `GestorTrabajos` comprueba la cancelación entre marcar el paso `en_curso` y lanzar el worker.
- **Red de seguridad**: sin límite de tiempo mientras el renderer responda. Si la ventana principal se cae, se destruye o no responde durante más de 10 s con una solicitud pendiente, main sale como si el usuario hubiera confirmado: cancela con motivo `cierre` y conserva el diario para reanudar (tarea 0374).

## Revisión 2026-11-22 · Sonda de conexión sin LRCLIB (pregunta 0243)

- Sustituye la comprobación de §5 («`HEAD` a `https://lrclib.net` cada 60 s»): **LRCLIB nunca se usa como sonda de conexión**. Una parada de descargas por `SIN_CONEXION` se comprueba reintentando cada 60 s **la primera descarga parada**: si termina o falla por otro motivo, se liberan las demás. `YOUTUBE_BLOQUEADO` sigue sin reanudación automática por sonda.
- Así, con «Buscar la letra automáticamente» apagado, no sale ninguna petición a LRCLIB que el usuario no haya pedido (tarea 0377).

## Revisión 2026-11-22 · Elección con el veredicto prudente y «Preparar» sobre letras sin marca (preguntas 0277 y 0278)

**Provisional** hasta medir con canciones revisadas y con red real (pregunta [0280](../preguntas/0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)).

### Elección automática (§3) y corrección del desfase

- Los fines prudentes **no se adoptan** para evaluar candidatos: el criterio de la pregunta 0222 no se cumple (pregunta 0277). La revisión «LRC sin fines» de arriba se queda como está.
- §3 no cambia de texto: se elige solo con `coincide` o `desfasada`. Lo que cambia es el veredicto. Con las guardas de ADR 0024 (revisión «Medida con canciones reales»), una letra cuya comprobación no es fiable (voz continua o letra que no notaría un desfase de 0,8 s) sale `dudosa`, y la canción va a «Elige la letra» con el motivo `duda`.
- Consecuencia aceptada: con LRC de LRCLIB sin fines, lo normal será «Elige la letra» y no la elección sola. Es el lado seguro. Elegir sola una letra ajena o mal desplazada es peor que pedir al usuario que elija.
- La corrección sola del desfase (paso `comprobando` y comprobación diferida) solo actúa con `desfasada`, que ahora exige contraste suficiente, voz no continua y d\* fuera del borde de la búsqueda.
- Criterio de seguridad de la elección (sustituye a la condición «ajenas = 0» de 0222 como medida de producto): en `calibrar:encaje`, **0 ajenas aceptadas** y **0 desplazadas ≥ 0,8 s que salgan `coincide`**. No se ha medido la situación real de la elección: varias versiones de la **misma** canción en LRCLIB. Se mide con red real (guía de la feature 5).

### «Preparar» sobre una letra sin `intacta` (pregunta 0278)

Las letras del MVP y de 0.2.1 no tienen `intacta`. Tampoco la tiene una letra de 0.2.2 cuyo usuario cambió un tiempo. No hay forma fiable de distinguir los dos casos: el MVP no guardaba quién tocó los tiempos. Por eso **no se infiere** `intacta` de ninguna heurística.

Decisión:

1. **`aplicaPreparar`**: un borrador con letra que **no** está `intacta`, tiene alguna línea con inicio y `fin_ms: null` y no tiene `preparacion.fines` **aplica** con `pasos: ["ajustando_fines"]` y `confirmar: "finesSinMarca"`. No incluye `comprobando`: sin `intacta` no se corrige nunca el desfase solo. Las letras `intacta` siguen como estaban, sin confirmación.
2. **Confirmación explícita**: `preparacion.preparar(ids, { finesSinMarca?: boolean })` (segundo argumento opcional; el primero no cambia).
   - Con `finesSinMarca: true`, las canciones con `confirmar: "finesSinMarca"` se aceptan.
   - Sin el campo, se omiten con `NADA_QUE_HACER`, como hasta hoy.
   - `preparacion.previsualizar` devuelve `confirmar` por canción para que la interfaz lo pida (una vez por acción, también en lote).
   - El diario `trabajos/pendientes.json` guarda `finesSinMarca` por entrada (lectura tolerante, `false`), para que una corrida reanudada al abrir no lo pierda.
3. **Qué hace la corrida con esa marca**: el paso `ajustando_fines` usa la variante prudente de siempre (`soloFinesAutomaticos: true, activarComodin: false, origenFin: "preparacion"`).
   - Solo pone fin en líneas con `fin_ms: null` donde la voz para con claridad.
   - **Nunca** toca un inicio, un fin ya fijado, unas palabras ni `offset_ms`.
   - Sigue sin escribir con el editor abierto sobre la canción.
   - Se deshace con «Quitar esos fines» (`origen_fin: "preparacion"`).
   - Después, el recuento de dudosas, como siempre.
4. **Borrador con letra sin tiempos** (texto pegado): sigue en `NADA_QUE_HACER`. «Preparar» nunca sustituye una letra.
5. La comprobación diferida (ADR 0024, revisión 0210) **no** cambia: exige `intacta`.

Tareas: [0380](../tareas/0380-preparar-letras-sin-marca-con-confirmacion.md) (contrato y main) y [0382](../tareas/0382-confirmacion-de-preparar-con-letras-sin-marca.md) (interfaz; la confirmación la define el diseñador en la spec 02). El resumen de la Biblioteca gana `prepararFinesSinMarca: boolean`, para que la tarjeta sepa si puede ofrecerlo sin leer la letra.

### Corrección de §«Consecuencias»

Donde dice «los 5 borradores actuales se rescatan con "Preparar"», se lee así:
- Los borradores **sin letra** se preparan con «Preparar»; para eso hace falta red.
- Los borradores **con letra anterior a 0.2.2** reciben fines automáticos tras confirmar, sin mover ningún inicio. Su desfase no se corrige solo.
- Que la elección automática acierte con LRCLIB real no está demostrado.

## Revisión 2026-11-22 · La elección automática con LRC sin fines depende de una señal fiable (pregunta 0295)

Con las guardas de ADR 0024, la copia de 18 canciones reales da 0/17 letras propias `coincide`. La preparación **no elige sola** letras de LRCLIB sin fines: la canción llega a «Elige la letra» con las candidatas buscadas, comprobadas y ordenadas. Que llegue sola a «Lista para revisar» con ese material depende de una de estas vías:
- la señal por inicios, si la tarea 0385 cumple su criterio;
- la confianza de la alineación forzada (feature 10, ADR 0028);
- una decisión del usuario de elegir sin comprobar (pregunta 0280, punto 2, no aplicada).

## Revisión 2026-11-22 · Vía de los inicios cerrada y «Ajustar los fines» en canciones Lista (preguntas 0305 y 0296)

- **Elección automática con LRC sin fines**: la señal por inicios (tarea 0385) no cumple su criterio con las 18 canciones reales (1 de 12 propias plausibles) y se cierra. La elección automática de letras de LRCLIB sin fines queda **pendiente de la feature 10** (prueba técnica 0328, fase 1 en marcha) **o de una medida con canciones revisadas a mano** (pregunta 0280). Mientras tanto, esas canciones llegan a «Elige la letra».
- **«Ajustar los fines…» en Lista y Letra lista**:
  - `aplicaPreparar` también aplica, solo con `pasos: ["ajustando_fines"]` y `confirmar: "finesSinMarca"`, a una Lista sin `intacta`, con líneas sin fin, sin ninguna línea `origen_fin: "preparacion"` y sin `preparacion.fines`.
  - La corrida hace solo los fines: no escribe `preparacion`, no cambia `estado`, no busca ni separa nada y no consulta la red.
  - Con una sesión en vivo se omite al momento (`EDICION_BLOQUEADA`).
  - «Quitar esos fines» del editor se muestra por las líneas `origen_fin: "preparacion"` y no depende del registro.
  - Tarea [0386](../tareas/0386-ajustar-los-fines-en-canciones-lista-sin-cambiar-su-estado.md).

## Revisión 2026-11-23 · Elección automática con LRC sin fines: fuera de 0.2.2 (pregunta 0311)

La señal D tampoco sirve (ADR 0024, revisión del 2026-11-23). En 0.2.2, la preparación **no elige sola** letras de LRCLIB sin fines: llegan a «Elige la letra», ya buscadas y ordenadas. Solo se reabre con evidencia nueva (canciones revisadas u otro modelo) o si el usuario elige la opción del punto 2 de la pregunta 0280.

## Revisión 2026-11-23 · Picos bajo demanda en «Ajustar los fines» (pregunta 0315)

- En una Lista (camino de solo fines de la revisión de la pregunta 0296), si falta la caché de picos, main la **genera bajo demanda** (`picos.solicitar`) y espera con el mismo límite que la corrida de un borrador. La caché es un dato derivado (ADR 0015): generarla no cambia `cancion.json` ni la letra.
- Motivos nuevos de omisión: `SIN_VOZ` (falta `pistas/voz.flac`) y `SIN_PICOS` (la generación falla o tarda demasiado). `prepararFinesSinMarca` es `false` sin pista de voz.
- Tarea [0389](../tareas/0389-ajustar-los-fines-genera-los-picos-si-faltan.md).

## Revisión 2026-11-23 · Parada por `RUNTIME_NO_DISPONIBLE` según el trabajo (pregunta 0317)

Corrige §5:
- `RUNTIME_NO_DISPONIBLE` en una **separación** (cola `pesada`) para **solo las separaciones**, con `separacionesParadas` en la tanda. Las descargas, las importaciones y la búsqueda de letra siguen, y las canciones esperan su separación.
- El mismo código en una descarga o una importación (el motor básico no está) para toda la cola, como antes.
- `SIN_ESPACIO` y tres fallos seguidos siguen parando todo.
- Se libera con «Reanudar» o al reparar el motor.
- Tarea [0390](../tareas/0390-ruta-fuera-del-contrato-del-lote-y-parada-solo-de-separaciones.md).

## Revisión 2026-11-23 · Elegir sin comprobar con tu audio, y fines aplazados con el editor abierto (preguntas 0393 y 0394)

**Provisional** (pregunta [0393](../preguntas/0393-elegir-la-letra-sin-comprobarla-con-tu-audio.md)). Origen: medida del usuario en Windows ([incidencias 2026-11-23](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), sección «Medida»). 0 de 7 canciones de YouTube con letra de LRCLIB llegaron solas a «Lista para revisar». En las dos medidas la letra era la correcta, y además la preparación registró 0 fines.

### 1. Elección «sin comprobar con tu audio» (punto 2 de la pregunta 0280, generalizado)

**Por qué.** Con LRC sin fines el encaje no puede afirmar `coincide` (ADR 0024, revisiones del 2026-11-22 y de hoy). Ningún umbral lo cambia: 0/17 en todas las variantes medidas. La elección automática de §3 queda inservible con el material real del usuario. La revisión de la pregunta 0311 decía que se reabriría con evidencia nueva: el 0 de 7 lo es.

**Regla nueva (se añade a §3; las condiciones 1, 2 y 4 no cambian).** Si **ningún** candidato cumple la condición 3 (`coincide` o `desfasada`):
- Son **elegibles sin comprobar** los candidatos con tiempos por línea, a ≤ 2000 ms de la duración del audio y con veredicto `dudosa` **con `limitacion`** (`vozContinua` o `sinContraste`): la comprobación no puede decir nada, no que dude.
- Una `dudosa` sin limitación (F o I entre los umbrales), un `no_coincide` y un `no_comprobable` **no** son elegibles.
- Si todos los elegibles sin comprobar tienen el mismo texto tras normalizar (`claveFlexible`, como la condición 4), se elige el primero en el orden de ADR 0005. Si hay dos textos distintos: `elige_letra` con motivo `varias`.
- Elegida así, la letra **nunca** se corrige sola (`desfaseMs: null`) y la canción queda en «Lista para revisar», nunca «Lista».
- `preparacion.eleccion` gana **`sin_comprobar: true`** (opcional, con lectura tolerante; ausente = comprobada). El resumen de la IPC gana `eleccionSinComprobar: boolean`.
- La interfaz no puede decir «coincide con tu audio» de esta letra. El texto lo define el diseñador ([pregunta 0394](../preguntas/0394-texto-de-la-letra-elegida-sin-comprobar.md)).

**Medido** (Mac, 17 canciones, letras tal cual, con la ventana de inicio de 800 ms de ADR 0024):

| | Elegibles sin comprobar |
|---|---|
| Propias (sin mover / adelantadas 150 / 300 / 450 ms) | 12 / 12 / 12 / 11 de 17 (las 5 restantes son `no_coincide`) |
| Ajenas, todas | 15 de 272 (todas `vozContinua`) |
| Ajenas con duraciones a ≤ 2 s | **1 de 10** |
| Propias desplazadas ±0,8, ±1,5 y ±3 s | 62 de 102 |

- **Riesgo aceptado (provisional):** la regla elige el **texto**, no garantiza la **sincronía**. Una letra desplazada 0,8–3 s se elegiría igual (62/102): esa letra no tiene forma de saberlo, y lo dice el aviso. En 1 de los 10 pares de canciones distintas con duración parecida se elegiría la letra de la otra.
- **No medido**: el filtro real de LRCLIB (título y artista). El par ajeno que pasa es una canción distinta, que una búsqueda por título y artista no devolvería (supuesto). Tampoco se ha medido el caso de varias versiones de la misma canción en LRCLIB: se mide con la guía de la feature 5.
- **Alternativa descartada: solo `sinContraste`** (0 ajenas, pero 4/17 propias). Las 8 canciones de voz continua del usuario no se elegirían nunca.

### 2. Fines de la preparación con el editor abierto (causa de los 0 fines)

**Verificado en el código** y con un arnés sobre datos temporales con los servicios reales:
- Sin `intacta`, `pasoFines` sale antes de escribir nada (`main/preparacion/servicio.ts:731-739`): el registro no tendría `fines`. Un `fines.lineas = 0` solo sale de `aplicarFinesPreparacion`, que devuelve 0 **si el editor tiene abierta la canción** (`main/letras/servicio.ts:358`).
- Con la vista Letra abierta (elegir en «Elige la letra» → `preparar([id])`) los fines **sí** se ponen: 6 de 6 en el arnés. Con el editor abierto sobre la canción en ese instante: `fines: { lineas: 0 }`.
- Ese registro con 0 **bloquea** el paso de fines para siempre: `aplicaPreparar` exige `!preparacion.fines` (`shared/derivados.ts:285, 291, 299`). En el arnés, `previsualizar` después solo ofrece `comprobando`.
- Que el usuario tuviera el editor abierto en ese instante es un **supuesto**: ni `app.log` ni el registro guardan nada de los fines. Cuadra con `46700fe1`: «lista para revisar» a las 22:31:48 y el editor en uso antes del reinicio de las 22:33.

**Diseñado**: no escribir con el editor abierto (su copia en memoria lo revertiría). **Defecto**: anotarlo como hecho con 0 y no volver a intentarlo. Además, no queda rastro en el registro.

**Decisión:**
- `aplicarFinesPreparacion` distingue «el editor está abierto» (`null`) de «0 puestos».
- Con el editor abierto, `pasoFines` **no** escribe `preparacion.fines`: los aplaza. La corrida sigue hasta «Lista para revisar», como hoy.
- Al cerrarse el editor sobre esa canción, main pone los fines aplazados. Solo lo hace si la letra sigue `intacta`, la canción sigue en borrador y no hay sesión en vivo. Después escribe `fines` y vuelve a contar las dudosas.
- Si el usuario tocó tiempos en el editor (la letra ya no es `intacta`), no se pone nada solo. Como no hay registro `fines`, «Preparar» y «Ajustar los fines…» los ofrecen con confirmación (revisión de la pregunta 0278).
- Lo aplazado vive en memoria: tras reiniciar la app se recupera por el mismo camino de «Preparar».
- `app.log` registra siempre el resultado del paso: `fines puestos=N`, `fines aplazados (editor abierto)` y `fines aplazados puestos=N`.
- **Alternativa descartada:** esperar en `pasoFines` a que se cierre el editor (como con la sesión en vivo). La canción seguiría «Preparando» mientras el usuario trabaja en ella, sin revisión guiada, y los fines calculados antes de esperar podrían no valer.

Tareas: [0393](../tareas/0393-elegir-la-letra-sin-comprobar-con-tu-audio.md) (main y contrato), [0394](../tareas/0394-fines-de-la-preparacion-aplazados-con-el-editor-abierto.md) (fines) y [0395](../tareas/0395-aviso-de-letra-elegida-sin-comprobar.md) (interfaz, tras la spec del diseñador).
