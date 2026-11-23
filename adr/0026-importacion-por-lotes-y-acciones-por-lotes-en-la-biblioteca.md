# 0026 — Importación por lotes (archivos, carpeta, enlaces y listas de YouTube) y acciones por lotes en la Biblioteca

- Estado: Aceptado (provisionales en [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md); la parte legal de las listas, a confirmar por el usuario)
- Fecha: 2026-11-21
- Paso del pipeline: 1 (fuente), 6 (exportación) y Biblioteca
- Versión: 0.2.2, features 7 ([propuesta 021](../propuestas/021-importacion-por-lotes.md)) y 8 ([propuesta 028](../propuestas/028-acciones-por-lotes-en-la-biblioteca.md), que reactiva la [006](../propuestas/006-exportar-varias-canciones-a-video.md)). Specs: [03 · Feature 7](../ux/03-anadir-cancion.md), [02 · Feature 8](../ux/02-biblioteca.md), [10 · Feature 8](../ux/10-exportacion.md). Responde a [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) y [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md) en lo que toca a estas features. **Revisa** ADR 0003 (listas de YouTube) y amplía ADR 0019 §6 y §8 (destino de carpeta y cola).

## Contexto

- Hoy la vista Añadir canción acepta un archivo o un enlace de vídeo. Soltar varios archivos usa el primero; una lista de YouTube se rechaza (ADR 0003: `noplaylist=True`, «Listas de reproducción … se rechazan»). El 10 de noviembre el usuario añadió 9 canciones de un álbum, una a una, en 5 minutos y medio.
- La importación de un archivo local es una **consulta interactiva** fuera de las colas que decodifica en `biblioteca/.importando/<id>/` y materializa la canción al confirmar (ADR 0006, 0009 §7). Una canción de YouTube se crea al confirmar y se descarga en su carpeta con el trabajo `descargar-youtube` (cola `ligera`).
- `ServicioExportacion` tiene su propia cola de concurrencia 1 y destinos por archivo elegidos en main con `destinoId` de un solo uso (ADR 0019 §6 y §8).
- La selección múltiple de la Biblioteca solo ofrece «Aplicar tema…», con el patrón previsualizar/ejecutar y resultado por canción de ADR 0016 §7.
- Cada canción ocupa unos 100 MB (mezcla y pistas en FLAC).

## Alternativas consideradas

### 1. Cómo se leen los datos de una lista de YouTube

| Opción | Pros | Contras |
|---|---|---|
| **A. `extract_flat: "in_playlist"` para la tabla (segundos) y, después, `info-youtube` por entrada en segundo plano para completar artista, álbum y miniatura** | La tabla aparece enseguida; los campos de música llegan fila a fila; reutiliza `info-youtube` | Una petición a YouTube por entrada antes de descargar (12 entradas ≈ 30–60 s en serie) |
| B. Extracción completa de la lista de una vez | Un solo comando | Una lista de 50 tarda minutos sin mostrar nada |
| C. Solo modo plano | Lo más rápido | yt-dlp avisa de que en modo plano «some entry metadata may be missing»: sin álbum ni artista, la tabla habría que rellenarla a mano |

### 2. Cuándo nacen las canciones de un lote

| Opción | Pros | Contras |
|---|---|---|
| **A. Al confirmar el lote, main crea todas las canciones con la fuente pendiente y encola su fuente en la cola `ligera`** | Las tarjetas aparecen al momento con su estado; la cola, la cancelación y el cierre funcionan como con YouTube; se reanuda al abrir | El archivo local tiene que seguir en su sitio hasta que le toque (se guarda su ruta hasta importarlo) |
| B. Decodificar todos los archivos en `.importando/` antes de confirmar | Igual que el flujo de uno | 50 decodificaciones antes de ver nada; `.importando/` se vacía al arrancar, así que cerrar la app pierde el lote |

### 3. Exportar varias canciones

| Opción | Pros | Contras |
|---|---|---|
| **A. Mismas opciones y una carpeta para todas; cada canción, una exportación en la cola de concurrencia 1** | Sin cambiar el bucle ni la ventana offscreen de ADR 0019; cancelación y resultado por canción | Un lote largo tarda la suma de todas |
| B. Dos exportaciones a la vez | Algo más rápido en equipos con muchos núcleos | El cuello de botella es el transporte de mapas de bits por main (ADR 0019, prueba §3), no el codificador: dos en paralelo apenas ganan y duplican memoria y GPU |

## Decisión

Opciones **1A, 2A y 3A**.

### 1. Entradas del lote (feature 7)

| Entrada | Cómo se reconoce | Cómo se leen los datos |
|---|---|---|
| Varios archivos (arrastrar o «Elegir archivos…», selección múltiple) | Más de un archivo | Comando nuevo del worker `leer-etiquetas` (fuera de las colas, como `importar-archivo`): por cada ruta, duración, `title`, `artist`, `album`, `album_artist`, `track` y `date` con PyAV **sin decodificar el audio** (solo cabeceras; < 100 ms por archivo) |
| Una carpeta (arrastrar o «Elegir carpeta…») | Directorio | Main recorre la carpeta y hasta **3 niveles de subcarpetas** con un tope de **500 elementos listados** (0153 §12c), ignora ocultos y enlaces simbólicos, filtra por extensión (las de ADR 0003) y pasa las rutas a `leer-etiquetas`. Álbum propuesto por el nombre de la carpeta si las pistas no lo traen (ADR 0025 §6). Carpeta sin audio: resultado vacío, sin código propio |
| Varios enlaces (uno por renglón en el campo) | Más de un enlace válido | `info-youtube` por enlace, en serie |
| Lista o álbum de YouTube (`youtube.com/playlist?list=`, `music.youtube.com/playlist?list=`, `watch?v=…&list=…` si el usuario elige «Toda la lista») | `list=` presente | Comando nuevo `info-lista-youtube` (`extract_flat: "in_playlist"`, sin descargar): `{ titulo, tipo, entradas: [{ id, titulo, canal, duracion_s, disponible }] }`; luego `info-youtube` por entrada en segundo plano (opción 1A). Directos, privados y no disponibles salen como filas «no disponible». **Tipo** por el identificador de la lista: `OLAK5uy_…` = álbum de YouTube Music; `RD…` = mezcla automática (se rechaza con `URL_NO_SOPORTADA`: es infinita y cambia); `PL…`, `UU…` y demás = lista. Los canales (`/@…`, `/channel/…`) se rechazan con `URL_NO_SOPORTADA`. Lista privada, vacía o inexistente: `LISTA_NO_DISPONIBLE` |

- **Límite**: `MAX_LOTE = 50` canciones por lote (provisional; no hay un límite técnico duro: lo marcan el disco, unos 5 GB, y la exposición a bloqueos de YouTube). Una lista más larga se recorta a las primeras 50 con aviso; los archivos o enlaces de más se rechazan con el recuento. 50 canciones ≈ 5 GB.
- **Espacio**: el resumen estima `n × tamaño medio por canción de la biblioteca` (100 MB si no hay datos) más un 10 %; si supera el espacio libre de la unidad de la biblioteca, «Añadir» se bloquea con `SIN_ESPACIO` y el recuento que sí cabe.
- **Tiempo estimado**: con el factor de separación medido del equipo (ADR 0004, `config.separacion.factores_medidos`) y la duración de cada fila.
- **Duplicados** (regla de la spec, 0153 §13): un vídeo cuyo `youtube_id` ya está en la biblioteca; un archivo con el mismo `nombre_original` y duración a ±1 s, **o** con la misma identidad de título y artista (ADR 0016 §4) y duración a ±2 s, de una canción existente. Vienen **desmarcados** con el motivo `YA_EN_BIBLIOTECA`; dos filas iguales dentro del lote, la segunda desmarcada (`REPETIDA`). Comprobación en main sobre el índice en memoria. Una huella del audio no compensa: el original no se conserva (ADR 0003), así que no habría con qué compararla.
- **Datos por fila**: los de ADR 0025 §6 (etiquetas, campos de música, nombre del archivo) con su origen; «Mismo artista/álbum para todas» lo resuelve el renderer antes de confirmar.

### 2. Confirmar: canciones con la fuente pendiente (opción 2A)

- `fuente.lote({ entradas: [{ tipo: "archivo", ref } | { tipo: "youtube", id }], metadatos[] })`: el renderer **no** envía rutas; `ref` es un identificador que main asoció a la ruta al leer las etiquetas (como `destinoId` en ADR 0019 §6), válido 30 min.
- Main crea cada canción (`ServicioBiblioteca.construir`, apariencia inicial de ADR 0016 §6) con `pasos.fuente = "pendiente"` y:
  - YouTube: `fuente.tipo = "youtube"` con `url` y `youtube_id`, y encola `descargar-youtube`, como hoy;
  - archivo: `fuente.tipo = "archivo"`, `nombre_original` y el campo nuevo **`fuente.ruta_pendiente`** (ruta absoluta del original, solo mientras la fuente no esté completada; main lo borra al completarla), y encola el trabajo nuevo **`importar-archivo-cola`** en la cola `ligera` (paso `fuente`), que decodifica y normaliza **dentro de la carpeta de la canción** con la misma lógica de `importar-archivo` (temporal y `rename`, ADR 0006).
- Todas entran en la **tanda** actual de la cola de preparación (ADR 0025 §5); el orden de la cola es el de la tabla.
- La separación se encola sola al completar la fuente (como hoy) y la preparación desatendida empieza cuando corresponde (ADR 0025 §2).
- **Archivo que ya no está** al llegarle el turno: `pasos.fuente = "error"` con `ARCHIVO_NO_ENCONTRADO`; la tarjeta ofrece «Elegir otro archivo» (sustitución de la fuente, ADR 0006).
- **YouTube con bloqueos, pausa, paradas y reanudar al abrir**: los de la cola de preparación (ADR 0025 §5: espera de 3 a 8 s entre descargas, paradas solo de descargas ante `YOUTUBE_BLOQUEADO` o `SIN_CONEXION`, diario `trabajos/pendientes.json`). No hace falta un campo de lote en la canción.
- **Resultado del lote**: `{ creadas: [{ id }], omitidas: [{ fila, motivo }] }`; el seguimiento por canción es el de las tarjetas y el panel de actividad.
- **Compatibilidad**: `fuente.ruta_pendiente` es opcional (0.2.1 lo descarta). Una canción de lote con la fuente aún pendiente abierta en 0.2.1 se ve como fuente interrumpida y se puede sustituir.

### 3. Listas de YouTube y riesgo legal (revisión de ADR 0003)

- Se **levanta** el rechazo de listas solo en la vista Añadir canción en modo lote. La descarga sigue siendo de vídeos concretos uno a uno (`noplaylist=True` en `descargar-youtube`); solo `info-lista-youtube` lee la lista.
- **Riesgo**: descargar listas enteras aumenta la exposición descrita en ADR 0003 (condiciones de servicio de YouTube y normas antielusión) y la probabilidad de bloqueos. **Mitigaciones**: el usuario aporta el enlace (sin buscador ni catálogo), tope de 50, descarga en serie con pausas, uso personal y local, módulo de YouTube desactivable (ADR 0003, mitigación 5). **Aviso**: la primera importación de una lista muestra otra vez el aviso legal con un texto que menciona las listas y se registra aparte (`config.aviso_youtube_listas_aceptado`, fecha o `null`). Es una decisión de producto **provisional**: el usuario puede preferir no permitir listas.

### 4. Acciones por lotes en la Biblioteca (feature 8)

Todas siguen el patrón de «Aplicar tema…» (ADR 0016 §7; 0157 §1): **previsualizar** devuelve, por canción, si aplica y qué arrastra (trabajos que se cancelan, entradas de la cola, cambio de tema efectivo) y una `version` de la selección; **ejecutar** recibe esa `version` y responde `CONFIRMACION_OBSOLETA` si la biblioteca cambió en lo que afecta a esas canciones; durante la ejecución main emite `{ hechas, total }`; al final, cada canción da `{ id, resultado: "hecho" | "omitida" | "error", motivo? }`. Durante una sesión en vivo las de edición respetan `EDICION_BLOQUEADA` por canción (ADR 0017 §9).

| Acción | Canal (rol principal) | Reglas |
|---|---|---|
| **Preparar** | `preparacion.previsualizar` y `preparacion.preparar({ ids })` (ADR 0025 §7) | Solo borradores; Lista → `YA_LISTA`; entran en la tanda actual |
| **A la cola** | `sesion.colaAnadirVarias({ ids })` → `{ entradaIds, omitidas }` y `sesion.colaQuitarVarias({ entradaIds })` para deshacer (0157 §2) | Mismo orden visual que la selección; cada entrada con las reglas de `cola.anadir` (ADR 0017 §6); `COLA_LLENA` corta el resto (parcial) con ese motivo. Deshacer quita solo las entradas aún no consumidas |
| **Exportar video…** | `exportacion.destinoCarpeta()` y `exportacion.iniciarLote(…)` | §5 |
| **Editar datos…** | `biblioteca.editarDatosVarias.previsualizar/ejecutar({ ids, artista?, album? })` | Título nunca. Previsualizar dice qué canciones cambiarían de tema heredado; ejecutar escribe por la cola de apariencia; origen `"usuario"` (ADR 0025 §6) |
| **Eliminar…** | `biblioteca.eliminarVarias.previsualizar/ejecutar({ ids })` | Papelera del sistema por canción (`shell.trashItem`, ADR 0006). Antes, por canción: cancela sus trabajos, su preparación y su exportación con limpieza (ADR 0019 §3) y la quita de la cola de la sesión si no suena. Si la papelera falla, `error` con el motivo de hoy y la canción se queda |

- «Aplicar tema…» no cambia.
- Las acciones son secuenciales en main por canción; el renderer recibe el resultado al final (y `biblioteca:cambio` de cada canción por el camino, como hoy).

### 5. Exportar varias canciones (amplía ADR 0019)

- **Destino de carpeta**: `exportacion.destinoCarpeta({ desdeCarpetaId? })` abre `dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })` en la última carpeta usada y devuelve `{ carpetaId, ruta, libreBytes }`. `carpetaId` es de un solo uso y caduca a los 30 min, como `destinoId`. Se rechazan las carpetas dentro del directorio de datos (único escritor, ADR 0019 §6).
- **`iniciarLote({ cancionIds, formato, audio, ancho, alto, fps, carpetaId, siExiste })`** → `{ loteId, encoladas, omitidas }`: para cada canción, main calcula el nombre `exp.nombre` saneado en esa carpeta; dos canciones del lote con el mismo nombre reciben ` (2)`, ` (3)`… Con un archivo ya existente, `siExiste`: `"numerar"` (conservar los dos con ` (2)`), `"sustituir"` (como hoy, temporal y `rename` al terminar) u `"omitir"` (`YA_EXISTE`). Cada canción entra como una exportación normal en la cola (concurrencia 1, ADR 0019 §8) con su **`loteId`** (0157 §3), que permite a la interfaz una fila única en actividad, un solo aviso al final, el resultado por canción, `exportacion.cancelarLote({ loteId })` (cancela las que faltan y la que está en curso) y `exportacion.reintentarLote({ loteId })` (las fallidas). Una canción que ya tiene exportación → `omitida` con `YA_EN_COLA`.
- **Espacio y destino**: suma de las estimaciones (`exportacion.estimar`) frente a `libreBytes`; si no cabe, `SIN_ESPACIO` antes de encolar nada. Si durante el lote aparece `SIN_ESPACIO` o `DESTINO_NO_DISPONIBLE`, el lote **se detiene**: las que faltan quedan `omitidas` con ese motivo (reintentables).
- **Instantánea al confirmar** (como pide la spec, 0157 §3, y como ADR 0019 §3): letra, estilo resuelto y metadatos de todas se toman al aceptar `iniciarLote`. Es asumible: son KB por canción en memoria de main (50 canciones, unos pocos MB); el audio se decodifica en el worker al empezar cada una (ADR 0019 §4).
- La concurrencia sigue en 1 (opción 3A) y la [propuesta 007](../propuestas/007-codificacion-de-video-por-hardware.md) (codificación por hardware) sigue fuera.

### 6. Pruebas mínimas

- Worker (pytest): `leer-etiquetas` con archivos generados (FLAC, MP3, M4A con etiquetas) y un archivo dañado; `info-lista-youtube` con el doble de yt-dlp (`SHINOBI_YTDLP_FALSO`, ADR 0009 §8) y una lista de 3 entradas con una privada.
- Vitest en main: recorrido de carpeta (3 niveles, 500 elementos, ocultos, enlaces), tipos de lista (`OLAK5uy_`, `RD`, canal), duplicados, tope de 50, estimación de espacio, creación de canciones con fuente pendiente, `importar-archivo-cola` con archivo desaparecido; acciones por lotes con previsualizar, `CONFIRMACION_OBSOLETA` y resultado por canción (incluidos `EDICION_BLOQUEADA`, `COLA_LLENA` parcial con deshacer, `YA_EN_COLA`); nombres repetidos, `siExiste`, `loteId`, cancelar y detenerse con `SIN_ESPACIO` en `iniciarLote`.
- E2E: una prueba secundaria de lote (3 WAV generados y una lista falsa de 2 vídeos) hasta ver las 5 tarjetas en cola; una de «Eliminar…» con 3 canciones de la semilla. Críticos: sí.
- Manual: un álbum real de YouTube de 9–12 canciones y una carpeta real; exportar 3 canciones a una carpeta.

## Consecuencias

- **Positivas**: un álbum entero en una acción; con la feature 5, de 9 rondas de formulario y 9 visitas a Letra a una acción y una revisión; las acciones por lotes reutilizan los servicios existentes.
- **Negativas / riesgos**: más exposición legal y más bloqueos de YouTube con listas; 50 canciones ocupan ~5 GB; el archivo local tiene que seguir en su sitio hasta que le toque (se informa con un error recuperable si no); eliminar por lotes es la acción más peligrosa (mitigación: papelera y confirmación con la lista).
- **Impacto en UX**: modo lote de la vista 03, tabla editable, resumen con espacio y tiempo, barra de selección ampliada y diálogo de exportación con carpeta.

## Fuentes

- yt-dlp, [README](https://github.com/yt-dlp/yt-dlp#general-options): `--flat-playlist` («some entry metadata may be missing»), `playlist_count`, `--playlist-items`, `--max-downloads`, campos de música; consultado el 2026-11-21.
- ADR [0003](0003-fuente-de-audio.md) (riesgo legal de YouTube y mitigaciones), [0006](0006-persistencia-y-modelo-de-datos.md), [0009](0009-gestor-de-runtime-y-dobles-de-prueba.md), [0016](0016-catalogo-de-temas-e-identidad-de-artista-y-album.md) §7, [0017](0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md) §6 y §9, [0019](0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) §3, §6 y §8.
- Electron, [`dialog.showOpenDialog`](https://www.electronjs.org/docs/latest/api/dialog#dialogshowopendialogwindow-options) y [`shell.trashItem`](https://www.electronjs.org/docs/latest/api/shell#shelltrashitempath).

## Revisión 2026-11-22 · Canales de la lectura del lote y de la cola (pregunta 0166)

- **Lectura del lote** (rol principal): `fuente.leerArchivos({ rutas? })` y `fuente.leerCarpeta({ ruta? })` → `{ filas: [{ ref, nombre, duracionMs, metadatos, duplicado }], rechazadas } | null` (sin argumento, main abre el diálogo del sistema; `null` si se cancela). Una ruta de `leerArchivos` que es una carpeta se recorre con las reglas de §1 (el renderer no distingue al soltar). `fuente.infoLista({ url })` → `{ titulo, tipo: "lista" | "album", entradas: [{ id, titulo, canal, duracionS, disponible, duplicado }], recortada }`. Varios enlaces, y el completado de cada entrada de una lista (opción 1A), usan `fuente.infoYoutube` uno a uno; su respuesta lleva un campo opcional `duplicado`.
- **Duplicados**: `YA_EN_BIBLIOTECA` lo calcula main (filas de archivo y entradas de YouTube); `REPETIDA` dentro de la tabla lo calcula el renderer.
- `fuente.lote({ entradas, metadatos })`: `metadatos[]` paralelo a `entradas[]` (mismo largo), `MAX_LOTE = 50`.
- **Cola** (§4): los canales son **`cola.agregarVarias({ ids })`** → `{ entradaIds, omitidas }` y **`cola.quitarVarias({ entradaIds })`** (misma respuesta que `cola.quitar`), en el grupo `cola.*`. Sustituyen a los nombres `sesion.colaAnadirVarias`/`colaQuitarVarias` de la tabla de §4; donde dice `cola.anadir`, léase `cola.agregar`.
- `exportacion.iniciarLote` / `reintentarLote` → `{ loteId, encoladas: [{ cancionId, trabajoId }], omitidas: [{ id, motivo }] }`.
- Previsualizar de las acciones por lotes → `{ version, canciones: [{ id, aplica, motivo?, trabajos, entradasCola, cambiaTema }] }`; evento `biblioteca:progresoLote` `{ hechas, total }` (una acción por lotes a la vez).
- Códigos: `ARCHIVO_NO_ENCONTRADO` solo de main (lo comprueba antes de lanzar `importar-archivo-cola`); `LISTA_NO_DISPONIBLE` lo emite el worker (`info-lista-youtube`) y se comparte con `worker/errores.py`.

## Revisión 2026-11-22 · Aviso de listas y contrato final de la lectura del lote (preguntas 0260 y 0261)

- **Aviso legal de listas** (§3): se mantiene el aviso **propio**, que se acepta una vez y queda en `config.aviso_youtube_listas_aceptado`. `fuente.infoLista` responde `ARGUMENTOS_NO_VALIDOS` si falta este aviso o el de YouTube. Es la opción prudente, provisional para el usuario (0159, fila 4); la spec 03 se ajusta.
- **Lectura del lote** (§1), campos aditivos:
  - `leerArchivos` y `leerCarpeta` → `{ filas, rechazadas, libreBytes, factorMinutos, truncada }`;
  - cada fila lleva `problema: null | "ilegible" | "corta"` (un audio ilegible es una fila);
  - `infoLista` → `{ titulo, tipo, entradas, recortada, libreBytes, factorMinutos }`, con `problema: null | "no_disponible" | "directo"` por entrada y `disponible = problema === null`;
  - `rechazadas` = lo no mostrado (no audio, dentro de la carpeta de datos o más allá de 500).
- **Límites**: las lecturas dan hasta **500** filas o entradas; `fuente.lote` impone `MAX_LOTE = 50`. Una carpeta cuenta archivos de audio (como mucho 500) y deja de listar tras 5 000 entradas; `truncada` o `recortada` lo dicen.
- **Espacio y tiempo**: `estimarEspacioLote` y `estimarTiempoLote` en `shared/lote.ts` (puras, comunes a renderer y main). Canal `fuente.espacioLibre()` → `{ libreBytes }` para volver a comprobar. `fuente.lote` mantiene `SIN_ESPACIO` (con `caben`) como última defensa.
- **Álbum de una lista**: main recuerda `listaId → { titulo, tipo }` durante 30 min; `fuente.infoYoutube` con `list=` en la URL lo propone como álbum (origen `lista`).
- **Sustituir la fuente** de una canción con otro archivo (`fuente.confirmarArchivo` con `cancionId`): encadena la separación, los picos y la preparación como en una canción nueva. Es correcto, porque el audio es otro. La preparación **no sustituye** la letra que ya tenga: solo la comprueba y, si sigue `intacta` y sin `desfase_descartado`, corrige el desfase o pone fines (ADR 0024, 0025). Así una letra que ya no cuadra con el audio nuevo se señala sola (ADR 0006).


## Revisión 2026-11-22 · Carpeta propuesta y canciones no intentadas (pregunta 0290)

Corrige §5:
- **`exportacion.destinoCarpeta()`** sin argumento devuelve la carpeta **propuesta** `{ carpetaId, ruta, libreBytes }` sin abrir ningún diálogo: la última usada para vídeo, luego Vídeos, luego la carpeta personal, y nunca dentro de los datos. **`destinoCarpeta({ desdeCarpetaId })`** abre `dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })` en esa carpeta y devuelve la nueva, o `null` si se cancela (el `carpetaId` anterior sigue vigente). Un solo uso y 30 min de vida; `iniciarLote` lo valida y lo gasta.
- `carpetaIpcSchema.libreBytes` es `number | null`. Con `null` no hay comprobación previa de espacio.
- **Lote detenido** por `SIN_ESPACIO` o `DESTINO_NO_DISPONIBLE`: las canciones que faltan quedan con `estado: 'terminada'`, `resultado: 'cancelada'` y `error: { codigo }`. Una cancelación del usuario va sin `error`. `reintentarLote` reencola las fallidas y estas «no intentadas»; nunca las canceladas por el usuario ni las omitidas al iniciar.
- `ExportacionIpc.loteId?: string`, solo en las exportaciones de un lote.
- **Acciones por lotes (§4)**: son cinco, «Preparar», «A la cola», «Exportar video…», «Editar datos…» y «Eliminar…», más «Aplicar tema…», que ya existía. «Marcar como lista» por lotes **no** está en el alcance: la spec 02 no la incluye (F8-1) y marcar varias a la vez se saltaría el aviso de líneas dudosas por canción (feature 11). Si se quiere, va como propuesta.

## Revisión 2026-11-22 · Datos de cada vídeo al descargar y remates de la lectura (pregunta 0285)

- **Lista de YouTube sin consultas vídeo a vídeo** (§1 y §3, cambio de la spec 03, provisional para el usuario):
  - La tabla usa solo `infoLista`.
  - Los datos propios de cada vídeo (campos de YouTube Music) los devuelve la **descarga** en `musica`, con el mismo `info` de yt-dlp y sin otra petición. Main los aplica al completar la fuente, antes de que empiece la preparación.
  - **Regla de origen por campo**: título y artista solo se sustituyen si su origen está ausente o es `nombre` y el dato nuevo es de origen `fuente`. El álbum, solo si está vacío. Nunca se toca un campo `usuario`, `fuente` o `lrclib`. Se escribe con origen `fuente`.
  - Hasta que exista, se acepta la consulta vídeo a vídeo con la pausa entre peticiones de ADR 0025 §5 y `add.lote.completando`.
  - Tarea [0384](../tareas/0384-datos-de-cada-video-al-descargar-y-remates-de-la-lectura-del-lote.md): alpha.3 si cabe, si no alpha.4.
- **`fuente.leerCarpeta`** devuelve además `carpeta?: string`: solo el nombre de la carpeta, nunca la ruta.
- **`fuente.espacioLibre()`** → `{ libreBytes, factorMinutos }`, para estimar el tiempo de un lote de enlaces sueltos.
