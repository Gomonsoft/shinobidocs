# 0314 — Feature 7 · Lote en main: lectura, duplicados, espacio y canciones con fuente pendiente
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0313, 0309
- ADRs: 0026 §1–§3
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Recibir un lote, revisarlo y crearlo.

## Criterios de aceptación
- [x] Recorrido de carpeta (3 niveles, 500 elementos), referencias `ref`, tipos de lista, duplicados (regla de la spec), tope de 50, espacio y tiempo estimados.
- [x] `fuente.lote` crea las canciones con `fuente.ruta_pendiente` y encola; `ARCHIVO_NO_ENCONTRADO`.
- [x] Aviso legal de listas (`config.aviso_youtube_listas_aceptado`).

## Pruebas de feedback
- Unitarias: Main con dobles del worker.
- E2E: Una secundaria: 3 WAV generados y una lista falsa de 2 vídeos hasta ver 5 tarjetas en cola.
- Críticos: sí
- Manual: Un álbum real de YouTube y una carpeta real.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación

**Hecho** (main; 24 pruebas de `lote.test.ts`, 5 de `carpeta.test.ts`, 5 de `handlers.lote.test.ts`, 4 con worker real en `lote.integracion.test.ts`)
- `main/fuente/carpeta.ts` (`recorrerCarpeta`): 3 niveles de subcarpetas y 500 elementos listados, orden natural con cada subcarpeta en su sitio, sin ocultos ni enlaces simbólicos, filtro por extensión de ADR 0003; cuenta lo ignorado.
- `main/fuente/lista.ts`: `analizarUrlLista` (mismas reglas y mismos casos que el worker), esquemas de `info-lista-youtube` y `leer-etiquetas`.
- `main/fuente/lote.ts` (`ServicioLote`):
  - `leerArchivos({ rutas? })` / `leerCarpeta({ ruta? })` (sin ruta abre el diálogo; `null` si se cancela; las carpetas mezcladas en `rutas` se recorren con las reglas de carpeta). Un solo `leer-etiquetas` para todo; `ref` UUID válido 30 min asociado a la ruta real en main. Propuestas de la feature 6 con `proponerDatos` (con `carpeta` para el álbum). Rechaza lo que no es audio, lo ilegible, rutas repetidas y todo lo que esté en la carpeta de datos.
  - Duplicados (`esDuplicadoArchivo`): mismo `nombre_original` y duración ±1 s, o `claveFlexible` de título y artista iguales y duración ±2 s (la clave flexible incluye a la de identidad; no hay regla nueva). Los de YouTube, por `youtube_id` (`ServicioBiblioteca.indiceDuplicados()`, índice en memoria).
  - `infoLista({ url })` → `{ titulo, tipo, entradas (+ duplicado), recortada }` sobre `ServicioYoutube.leerLista` (comparte con `info` la ranura de lectura: `fuente.cancelarInfo()` la cancela; reintento tras `YOUTUBE_BLOQUEADO` con actualización de yt-dlp; el comando pasa por el cerrojo).
  - `lote({ entradas, metadatos })`: tope de 50 y un metadato por entrada (también en main); comprueba el espacio **antes** de crear nada (`SIN_ESPACIO`, `detalles: {"caben":n}`); crea en el orden de la tabla con `fuente.pendiente` y `fuente.ruta_pendiente`, y encola. Una fila que falla (ref caducada → `ARCHIVO_NO_ENCONTRADO`, título vacío, etc.) sale en `omitidas` y el resto sigue. `metadatos.origen` con `origenAlConfirmar` sobre la propuesta guardada.
  - Archivos: trabajo `importar-archivo-cola` (cola `ligera`, paso `fuente`); `alEmpezar` lee `ruta_pendiente` de la canción y comprueba que sigue siendo un archivo fuera de la carpeta de datos (si no, `ARCHIVO_NO_ENCONTRADO`); `alResultado` guarda mezcla, ganancia y duración real y borra `ruta_pendiente`. `reintentar(id)` para las de archivo.
  - Estimación (`estimarEspacioLote`, `cuantasCaben`): 100 MB por canción de 4 min proporcional a la duración (desconocida = una media), +10 %, margen de 1 GB.
- `ServicioYoutube`: `leerLista`, `crearDeLote(id, metadatos)` (usa lo último consultado de ese vídeo: propuesta, miniatura y duración; sin consulta, la de la lista o 1 ms que corrige la descarga), `duplicado` en `info` (campo opcional del contrato) y, en las entradas de una lista que es un álbum, el título del álbum como álbum propuesto (`origen: 'lista'`).
- Aviso de listas: `leerLista` exige `aviso_youtube_aceptado` **y** `aviso_youtube_listas_aceptado` (ADR 0026 §3). **Conflicto con la spec 03** (que dice que vale el aviso ya aceptado): pregunta 0260, la 0315 debe mostrar el aviso de listas y escribir esa clave.
- Cableado (`main/index.ts`, `main/ipc/handlers.ts`): `fuente.leerArchivos|leerCarpeta|infoLista|lote` sacados de `CANALES_NO_IMPLEMENTADOS`; `fuente.cancelarImportacion` sin id también cancela la lectura del lote; `fuente.reintentar` prueba primero el lote de archivos y luego YouTube; al completarse `importar-archivo-cola` se encadenan la separación y la preparación (con `preparacion.automatica` apagado la preparación no hace nada, ni una petición a LRCLIB); `reintentarDescarga` de la cola de preparación (reanudar al abrir y «Reintentar las fallidas») reimporta las de archivo; el diario y la pausa entre descargas de 3 a 8 s ya eran del gestor (0309) y solo afectan a `descargar-youtube`.
- `dialogoPruebas.ts`: `SHINOBI_DIALOGO_PRUEBAS` admite varias rutas separadas por `|` (selección múltiple) y sirve también para «Elegir carpeta…».
- `shared/cancion.ts`: `fuente.ruta_pendiente` opcional y tolerante.
- Cambio de comportamiento a tener en cuenta: tras **sustituir la fuente de una canción con otro archivo** (`fuente.confirmarArchivo` con `cancionId`, p. ej. «Elegir otro archivo» de un lote) ahora se encadenan la separación y la preparación como en una canción nueva (antes no).

**Probar**: `npx vitest run src/main/fuente src/main/ipc/handlers.lote.test.ts` (las integraciones usan el worker real y el doble de yt-dlp; se omiten sin `uv`). E2E **escrita, sin ejecutar**: `app/e2e/importar-lote.spec.ts` (3 WAV de una carpeta + lista falsa `lista-OLAK5uy_e2eLote001.json` con 2 vídeos y uno privado, por la API del preload hasta ver 5 tarjetas y las 5 fuentes completadas, y 0 peticiones a LRCLIB con la búsqueda automática apagada). Puntos frágiles: que `getByText` encuentre cada título en la tarjeta (`exact`), el diálogo de cierre y que la separación encadenada sin modelo no moleste.

**Criterios**: recorrido, refs, tipos de lista, duplicados, tope de 50, espacio (cumplidos); tiempo estimado: **no** en main (el contrato de lectura no trae espacio libre ni tiempo; pregunta 0261); `fuente.lote` con `ruta_pendiente` y `ARCHIVO_NO_ENCONTRADO` (cumplido); aviso legal de listas (cumplido en main, ver 0260).

**Manual (red y datos reales)**: un álbum real de YouTube Music de 9–12 canciones (lectura, duplicados al repetirlo, pausa de 3–8 s entre descargas, parada por bloqueo) y una carpeta real con subcarpetas y archivos mezclados; con `preparacion.automatica` apagado comprobar que no sale ninguna petición a LRCLIB.

**Para la 0315 (modo lote)**: las lecturas devuelven hasta 500 filas (marcar las 50 primeras en el renderer); `REPETIDA` la calcula el renderer; `lote` pide `metadatos[]` paralelo; `SIN_ESPACIO` trae `{"caben":n}` en `detalles`; cada entrada de una lista se completa con `fuente.infoYoutube(url)` (ya devuelve `duplicado` y el álbum de la lista); mostrar y registrar el aviso de listas (0260); cambiar el texto de `URL_NO_SOPORTADA`.
**Para la 0316 (cola del lote)**: cada canción del lote es una tarjeta con la fuente `pendiente` y un trabajo `importar-archivo-cola` o `descargar-youtube` en la cola `ligera` (paso `fuente`); los errores recuperables son `ARCHIVO_NO_ENCONTRADO` (ofrecer «Elegir otro archivo», que es `fuente.importarArchivo` + `confirmarArchivo` con `cancionId`) y los de descarga; «Reintentar» es `fuente.reintentar(id)` para ambos tipos.

**Deuda**: el tope de 500 elementos de una carpeta corta sin avisar; los tiempos de una lista real no están medidos; `typecheck` y `lint` pueden fallar en `main/copias/**` y `e2e/tmp-head.spec.ts` (trabajo a medias de otros lotes).
