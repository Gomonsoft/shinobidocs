# 0027 — Copia de seguridad, paquete de canción (ZIP con manifiesto) y exportar la letra a `.lrc`

- Estado: Aceptado (provisionales y la decisión legal del paquete con audio en [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md))
- Fecha: 2026-11-21
- Paso del pipeline: 5 (persistencia) y salida
- Versión: 0.2.2, feature 9 ([propuesta 025](../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md)). Specs: [02 · Feature 9](../ux/02-biblioteca.md), [08 · Feature 9](../ux/08-ajustes-y-acerca.md), [06 · Feature 9](../ux/06-editor.md). Responde a [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md) en lo que toca a esta feature. Concreta la exportación LRC que ADR 0005 dejó «sin interfaz».

## Contexto

Todo el trabajo vive en `<base>/biblioteca/` (ADR 0006): una carpeta por canción con `cancion.json` (+ `.bak`), `fuente/mezcla.flac`, `fuente/miniatura.jpg`, `pistas/voz.flac`, `pistas/instrumental.flac` y la caché regenerable de picos; y `temas.json` con el catálogo y las asignaciones de artista y álbum (ADR 0016). La única herramienta hoy es «Abrir carpeta de datos». Una canción ronda 100 MB; la biblioteca del usuario, ~1,7 GB. Main es el único escritor (ADR 0006) y no se añaden módulos nativos (ADR 0012).

## Alternativas consideradas

### 1. Contenedor

| Opción | Licencia | Pros | Contras |
|---|---|---|---|
| **A. ZIP (ZIP64) con `yazl` para escribir y `yauzl` para leer, en streaming, sin comprimir el audio** | MIT ambas, JavaScript puro | Un solo archivo; se abre con cualquier gestor de archivos (inspeccionable); ZIP64 para copias de varios GB; `yauzl` valida nombres (`..`, rutas absolutas, barras invertidas) y tamaños declarados | Dos dependencias npm nuevas (pequeñas, sin dependencias nativas). El Archivo de Utilidades de macOS no abre ZIP64 (la app sí) |
| B. Carpeta copiada tal cual | — | Sin dependencias | No es «un archivo» para llevar; restaurar exige elegir bien la carpeta; fácil de mezclar con otras |
| C. tar (`tar`, ISC) | ISC | Formato simple | Menos familiar para el usuario en Windows; sin índice central (leer el manifiesto exige recorrer el archivo) |
| D. ZIP con `fflate` | MIT | Una sola dependencia | Sin ZIP64: falla por encima de 4 GB |

### 2. Audio dentro del paquete de canción

| Opción | Pros | Contras |
|---|---|---|
| **A. Dos variantes: «Solo letra, tiempos y estilo» (KB) y «Con las pistas» (~100 MB); al importar una sin audio, la fuente se recupera sola si es de YouTube** | La variante ligera guarda el trabajo sin copiar audio con derechos; la completa sirve entre equipos propios sin volver a descargar | Dos caminos al importar |
| B. Siempre con audio | Simple | Un archivo con audio con derechos que se puede pasar a otra persona (la visión excluye «compartir») |
| C. Nunca con audio | Sin riesgo | Un archivo local hay que volver a elegirlo a mano en el otro equipo |

## Decisión

Opciones **1A y 2A**.

### 1. Formato común (`.shinobi`)

Un ZIP con extensión **`.shinobi`** para las dos cosas (paquete y copia); el tipo va en el manifiesto. Estructura:

```
manifiesto.json
canciones/<id>/cancion.json
canciones/<id>/fuente/mezcla.flac          (solo «con audio»)
canciones/<id>/fuente/miniatura.jpg        (si existe)
canciones/<id>/pistas/voz.flac             (solo «con audio»)
canciones/<id>/pistas/instrumental.flac    (solo «con audio»)
temas.json                                  (temas incluidos, mismo esquema que el catálogo)
ajustes.json                                (solo en la copia completa, si se eligió)
```

```jsonc
// manifiesto.json
{
  "formato": "shinobi",
  "version_formato": 1,                 // un lector rechaza un valor mayor (PAQUETE_VERSION_NUEVA)
  "tipo": "cancion" | "copia",
  "creado": "2026-11-21T10:00:00Z",
  "app": "0.2.2",
  "con_audio": true,
  "canciones": [
    { "id": "6f1c…", "titulo": "…", "artista": "…", "esquema_cancion": 1,
      "archivos": [ { "ruta": "canciones/6f1c…/pistas/voz.flac", "bytes": 15697914, "sha256": "…" } ] }
  ],
  "temas": ["uuid-del-tema", "…"]
}
```

- **Se excluyen**: `.bak`, la caché de picos (regenerable, ADR 0006 revisión de picos), `.importando/`, `runtime/`, `modelos/`, `registros/`, `electron/` y, de `config.json`, todo lo del equipo (`instalacion`, `hardware`, pantallas de la secundaria, carpetas recordadas).
- **Compresión**: el audio (FLAC) y la miniatura sin comprimir (`compress: false`); los JSON con deflate.
- **Integridad**: SHA-256 de cada archivo calculado en streaming al escribir y comprobado al leer. Un archivo que no coincide invalida **su canción** (`PAQUETE_INCOMPLETO`), no el paquete entero.
- **Temas incluidos**: en el paquete de canción, el tema que resuelve su apariencia (asignado, o el que hereda por álbum, artista o predeterminado) con sus asignaciones de artista y álbum solo si la canción depende de ellas; en la copia, `temas.json` entero.

### 2. Escribir (`main/copias/`, `ServicioCopias`)

- Cola propia de **concurrencia 1** (una copia o paquete a la vez), con progreso en bytes (`copias:progreso`, como mucho 4 por segundo) y cancelable.
- **Destino** elegido en main con `dialog.showSaveDialog` y el patrón `destinoId` de ADR 0019 §6 (temporal `.<nombre>.<8 hex>.shinobi-parcial` junto al destino y `rename` al terminar; dentro del directorio de datos, rechazado).
- **Instantánea por canción**: `cancion.json` se serializa desde el índice en memoria de main en el momento de añadirlo; las pistas son inmutables salvo re-separación. Una canción con fuente o separación **en curso** se omite con `EN_CURSO`.
- **Espacio**: suma de tamaños frente al espacio libre del destino antes de empezar (`SIN_ESPACIO`).
- Durante una sesión en vivo se permite (solo lee).

### 3. Leer: importar un paquete y restaurar una copia

- `copias.leer({ origenId })` (el origen se elige con `dialog.showOpenDialog` en main) valida el ZIP, lee **solo** `manifiesto.json` y devuelve el resumen para la confirmación: tipo, con o sin audio, canciones con `existe: boolean` (mismo `id` en la biblioteca) y temas con `existe: "igual" | "distinto" | "no"`.
- `copias.importar({ origenId, conflictos: "sustituir" | "conservar_ambas" | "omitir", porCancion?: { [id]: … }, ajustes: boolean })`:
  - Solo se extraen las entradas que el manifiesto declara bajo `canciones/<id>/` con los cinco nombres permitidos, más `temas.json` y `ajustes.json`. Se usan `validateFileName` y `validateEntrySizes` de `yauzl` y, además, el tamaño declarado en el manifiesto. Cualquier otra entrada se ignora.
  - Cada canción se extrae en `biblioteca/.importando/<id>/`, se verifica (SHA-256 y `cancionSchema`) y se materializa con `rename` (ADR 0006). `esquema_cancion` mayor que el que entiende la app → esa canción `omitida` con `CANCION_MAS_NUEVA`.
  - **Identidad** (0157 §6): misma canción = mismo `id`; «Ya la tienes igual» = mismo `id` y misma `modificada`.
  - **Conflictos**: «Sustituir» mueve la existente a la papelera y pone la importada; con un paquete **ligero**, en cambio, se sustituye solo `cancion.json` (letra, tiempos, estilo y datos) y se **conservan los archivos de audio actuales** (`fuente`, `pistas` y sus pasos de la canción local). «Conservar las dos» importa con un `id` nuevo y el título con « (importada)». «Omitir» no la toca. `creada` y `modificada` se conservan tal como vienen (`creada` ordena la agrupación por fecha de añadido de ADR 0016; es la fecha real de la canción).
  - **Temas** (por `ServicioTemas`, único escritor de `temas.json`; 0157 §8): mismo `id` y estilo igual (forma normalizada, ADR 0018 §1) → se usa el existente; mismo `id` y estilo distinto, o mismo nombre → se importa como **copia** con `id` nuevo y nombre «<nombre> (importado)», y las canciones importadas apuntan a la copia; inexistente → se crea. En un **paquete de canciones**, una canción que heredaba su tema entra con ese tema **asignado a la canción** (`modo: "tema"`), sin importar asignaciones de artista ni álbum. En una **copia de seguridad**, las asignaciones de artista y álbum y el predeterminado se restauran solo donde el equipo no tiene ya una. Con `TEMAS_SOLO_LECTURA` (ADR 0016) no se importan temas y las canciones entran con apariencia `propio` y su instantánea.
  - **Sin audio** (0157 §7): si la canción no existe, se materializa como **borrador** (también si en el paquete era Lista; `modalidad` se retira) con `pistas: null`, `pasos.fuente = "pendiente"` (con su `url` y `youtube_id`, o su `nombre_original`), `pasos.separacion = "pendiente"` y la letra y el estilo intactos. Es el estado de «sustitución de la fuente» de ADR 0006, que conserva letra y estilo: «Continuar» en una de YouTube encola `descargar-youtube` y luego la separación; en una de archivo, ofrece «Elegir archivo». Riesgo anotado en ADR 0006: si la duración nueva difiere más de 2 s, la letra puede no cuadrar; la comprobación de ADR 0024 lo detecta.
  - **Ajustes** (solo copia, solo si se marca; 0157 §9): viajan `biblioteca.agrupar`, `reproductor.transicion_s`, `reproductor.volumen`, `reproductor.silenciado`, `reproductor.voz_guia`, `reproductor.voz_guia_silenciada`, `reproductor.subrayar_cantado`, `exportacion` sin `carpeta`, `editor.paneles` y los interruptores de 0.2.2 (`preparacion.automatica`, `actualizaciones.avisar`). Nunca: `instalacion`, `hardware`, `separacion`, carpetas recordadas, `reproductor.secundaria` (pantallas) ni consentimientos (`aviso_youtube_*`, `rapido_aceptado`). Se fusionan con el esquema parcial tolerante.
  - Resultado por canción con el patrón de «Aplicar tema…»: `importada`, `sustituida`, `omitida` o `error` con motivo.
- **Restaurar una copia** es lo mismo que importar un paquete de tipo `copia`: se **fusiona** con la biblioteca actual; no la borra.

### 4. Exportar la letra a `.lrc` (`shared/letras/lrc.ts`)

- `exportarLrc(letra, { titulo, artista, album, duracionMs })` → texto UTF-8 sin BOM, fin de línea `\n` (reglas de la spec, 0157 §12):
  - Cabecera `[ti:]`, `[ar:]`, `[al:]` (si hay), `[length:mm:ss]` y `[re:Shinobi Karaoke]`.
  - Una marca `[mm:ss.xx]` por línea con inicio, con el tiempo en el audio (`inicio_ms + offset_ms`, centésimas redondeadas); el desplazamiento se aplica y **no** se escribe `[offset:]`.
  - Una **marca vacía** en el `finEfectivo` de una línea cuando el hueco hasta la siguiente con tiempo es de **2 s o más**, y tras la última línea.
  - Líneas sin inicio: se omiten (la spec avisa con el recuento). Pausas: no se escriben aparte (ya las representa la marca vacía si su hueco es ≥ 2 s). Sin tiempos por palabra en 0.2.2.
- **Ida y vuelta** con el importador de ADR 0005 (comprobado en su texto): una marca vacía intermedia se importa como **pausa con tiempo**, y el `finEfectivo` de la línea anterior es el inicio de esa pausa, así que la línea **recupera su fin** (como fin automático, más un elemento de pausa); la marca vacía final se convierte en el fin fijado de la última línea. Los fines de huecos menores de 2 s no viajan (vuelven a ser automáticos). Lo prueba un test.
- Destino por `dialog.showSaveDialog` en main para una canción (`letras.exportarLrc({ cancionId, destinoId })`) y por «Elegir carpeta» para varias (`letras.exportarLrcVarias({ ids, carpetaId })`, nombres `<Artista> - <Título>.lrc` saneados como `exp.nombre`, con « (2)» si se repiten).
- **Abrir un `.shinobi` con doble clic** (asociación de archivo, 0157 §13): **no** en 0.2.2 (toca instaladores de los tres sistemas e instancia única; solo arrastrar y botones).

### 5. Recordatorio

- `config.copias.ultima` = `{ fecha, canciones, bytes, tipo: "completa" | "ligera" } | null` (0157 §10), lectura tolerante; lo escribe main al terminar una copia de la biblioteca. El recuento «añadidas o modificadas desde entonces» lo calcula main **del índice en memoria** (`creada` o `modificada` posteriores a `fecha`), sin recorrer el disco. Sin copias automáticas en segundo plano.
- **Estimación de tamaño** (0157 §11): suma de los tamaños de archivo del índice (más ~1 % de cabeceras ZIP) frente al espacio libre del destino o de la biblioteca; precisión de sobra para ± 10 %.
- **Paquete truncado** (0157 §5): el índice central de un ZIP está al final, así que un archivo cortado no se puede listar y se rechaza **entero** con `PAQUETE_INCOMPLETO` (como se escribe en temporal y se renombra al final, solo pasa con copias rotas fuera de la app). Lo que sí se detecta canción a canción es un archivo dañado (SHA-256 distinto): esa canción falla y las demás entran.

### 6. IPC (rol principal)

| Canal | Qué hace |
|---|---|
| `copias.exportarCanciones({ ids, conAudio, destinoId })` | Paquete de canción (una o varias, mismo archivo) |
| `copias.exportarBiblioteca({ conAudio, ajustes, destinoId })` | Copia completa |
| `copias.destinoPropuesto({ tipo, ids? })` / `copias.elegirDestino({ destinoId })` | Como en ADR 0019 §6 |
| `copias.elegirOrigen()` → `{ origenId }`; `copias.leer({ origenId })`; `copias.importar(…)` | §3 |
| `copias.cancelar({ trabajoId })`; eventos `copias:cambio`, `copias:progreso` | §2 |
| `letras.exportarLrc({ cancionId, destinoId })` y `letras.exportarLrcVarias({ ids, carpetaId })` | §4 |

Códigos nuevos: `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA`, `PAQUETE_INCOMPLETO`, `CANCION_MAS_NUEVA`, `EN_CURSO` (reutiliza `SIN_ESPACIO` y `DESTINO_NO_DISPONIBLE`).

### 7. Dependencias y licencias (ADR 0012)

`yazl` y `yauzl` (MIT, de thejoshwolfe) en `dependencies` de la app, sin dependencias nativas. Se añaden a `THIRD_PARTY_NOTICES.md` con el procedimiento de ADR 0012. Compatibles con GPL-3.0-or-later.

### 8. Pruebas mínimas

- Vitest en main con una biblioteca temporal: paquete con y sin audio, ida y vuelta (exportar → importar en otra biblioteca → mismos `cancion.json` salvo rutas e `id` si «Conservar las dos»), SHA-256 alterado (solo esa canción falla), entrada con `..` o no declarada (ignorada), `version_formato` 2 (rechazo), tema igual y distinto, `temas.json` en solo lectura, sin espacio, cancelación (temporal borrado).
- Vitest en `shared/`: `exportarLrc` con pausas, `offset_ms`, marca vacía solo con huecos ≥ 2 s y al final, líneas sin inicio omitidas, ida y vuelta con el importador (inicios iguales a ±10 ms y fines recuperados en huecos ≥ 2 s).
- E2E: una prueba secundaria: exportar un paquete con audio de una canción de la semilla y volver a importarlo con «Conservar las dos». Críticos: sí (toca `main/` y `shared/`).
- Manual: copia completa de la biblioteca real (1,7 GB) y restauración en otro equipo o usuario del sistema; abrir el `.shinobi` con el gestor de archivos del sistema (salvo macOS por ZIP64 en copias de más de 4 GB).

## Consecuencias

- **Positivas**: red de seguridad para horas de sincronía; mover canciones entre equipos propios; la letra sale de la app en un formato estándar.
- **Negativas / riesgos**: dos dependencias npm nuevas (pequeñas, MIT); una copia con audio es grande (1,7 GB para 17 canciones); los fines intermedios no viajan en LRC.
- **Legales**: el paquete «Con las pistas» contiene audio con derechos de autor y se puede entregar a otra persona aunque la app no lo promueva. **Mitigación**: la variante ligera existe y es la propuesta por defecto en el paquete de canción (provisional), la interfaz lo presenta como copia personal entre equipos propios, no hay ninguna función de envío ni de publicación, y el manifiesto no añade datos del usuario. La letra exportada a `.lrc` tiene el mismo riesgo que ADR 0005 ya describe y queda en el equipo del usuario. La decisión de si el paquete con audio entra es del usuario (0159).

## Fuentes

- [yazl](https://github.com/thejoshwolfe/yazl) (MIT; ZIP64 automático, `compress: false`, salida en streaming) y [yauzl](https://github.com/thejoshwolfe/yauzl) (MIT; ZIP64, `validateFileName`, `validateEntrySizes`), consultados el 2026-11-21.
- PKWARE, [APPNOTE.TXT, especificación ZIP (ZIP64 §4.3.14)](https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT).
- Formato LRC y extensión A2: [Wikipedia, LRC](https://en.wikipedia.org/wiki/LRC_(file_format)); importador del proyecto (ADR 0005, revisión 2026-11-05).
- ADR [0006](0006-persistencia-y-modelo-de-datos.md), [0012](0012-empaquetado-con-electron-builder-fuses-uv-y-licencias.md), [0016](0016-catalogo-de-temas-e-identidad-de-artista-y-album.md), [0019](0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) §6.

## Revisión 2026-11-22 · Destino de la exportación LRC (pregunta 0166)

La spec no tiene diálogo propio para exportar la letra: abre directamente el del sistema. El patrón `destinoId` (destino propuesto que se muestra antes de confirmar) no aplica, así que §4 y §6 cambian:

- `letras.exportarLrc({ cancionId })` → `{ lineasOmitidas, ubicacionId } | null`: main abre `dialog.showSaveDialog` con el nombre propuesto en la última carpeta usada para letras (en memoria de main durante la sesión; si no, Documentos), rechaza el directorio de datos y escribe. `null` = cancelado.
- `letras.exportarLrcVarias({ ids })` → `{ escritas, omitidas: [{ id, motivo }], ubicacionId } | null`: main abre «Elegir carpeta» y escribe un archivo por canción, con « (2)», « (3)»… si el nombre existe (nunca sustituye).
- Nuevo `letras.mostrarEnCarpeta({ ubicacionId })` (rol principal) para el botón del toast. `ubicacionId` es un UUID que main asocia a la ruta escrita mientras la app siga abierta; el renderer nunca ve rutas.
- Copias: `copias.exportarCanciones` / `exportarBiblioteca` → `{ trabajoId }`; eventos `copias:cambio` `{ trabajoId, estado, codigo? }` y `copias:progreso`.

## Revisión 2026-11-22 · Specs, temas, contratos y dependencias (preguntas 0255–0258)

- **Canción con trabajo en curso** (§2): ya no se omite con `EN_CURSO`. Entra `cancion.json` y solo los archivos de pasos completados (nunca uno en escritura); una canción que se está separando entra sin pistas, con la separación `pendiente`, y al importarla se comporta como un paquete ligero para lo que falta (spec 08, `aj.copia.nota.enCurso`).
- **`.lrc`** (§4): nombre `{título} — {artista}.lrc` (sin artista, `{título}.lrc`), igual para una y para varias. Las pausas no se escriben aparte (regla de la marca vacía con hueco ≥ 2 s); la spec 02 se ajusta.
- **Entradas hostiles** (§3 y §8): `..`, rutas absolutas, `\`, enlaces simbólicos, entradas cifradas o repetidas → el paquete **entero** se rechaza con `PAQUETE_NO_VALIDO`. Las entradas con nombre válido no declaradas en el manifiesto se ignoran.
- **Temas** (§3): mismo nombre y mismo estilo normalizado con otro `id` → se reutiliza el local (el primero por creación; nunca uno con `borrado_pendiente`). Así una restauración en una instalación nueva conserva el predeterminado.
- **Manifiesto**: campos opcionales por canción (`modificada`, `creada`, `album`, `duracion_ms`, `estado`) y `extras[]` con la comprobación de `temas.json` y `ajustes.json`. Son aditivos, así que `version_formato` sigue en 1.
- **IPC** (§6), todo aditivo:
  - `destinoCopiaIpcSchema` gana `existe` y `estimacion`;
  - `resumenPaqueteSchema` y `resultadoImportacionSchema` se amplían (pregunta 0257);
  - `copias:cambio` lleva `en_cola`, `tipo` y `resultado`, y `copias:progreso` lleva `cancion`;
  - **`copias.importar` devuelve `{ trabajoId }`** y su resultado llega en `copias:cambio` `terminada`;
  - «Mostrar en la carpeta» usa `letras.mostrarEnCarpeta({ ubicacionId })` (tabla de ubicaciones común de main);
  - canal **`copias.origenDesdeRuta({ ruta })`** para soltar un `.shinobi`, expuesto en el preload solo como `copias.origenDeArchivo(file: File)` (con `webUtils.getPathForFile`), de modo que el renderer no maneja rutas.
- **Dependencias** (§7): `@types/yazl` y `@types/yauzl` como `devDependencies` (MIT, no se distribuyen). La lista de dependencias permitidas en el `app.asar` (`scripts/verificar-paquete.mjs`) es `yaml, zod, yazl, yauzl, buffer-crc32, pend` (todas MIT, sin nativas), con sus notas en `THIRD_PARTY_NOTICES.md` (ADR 0012).
- `ServicioBiblioteca.incorporar(id, cancion)`: método interno de main para materializar una canción importada por la vía del único escritor (ADR 0006). Confirmado.

