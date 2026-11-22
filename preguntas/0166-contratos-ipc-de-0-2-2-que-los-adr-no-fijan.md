# 0166 — Contratos IPC de 0.2.2 que los ADR 0022–0028 no fijan
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en la tarea [0339](../tareas/0339-contratos-compartidos-de-0-2-2.md))

## Contexto

La tarea 0339 declara todos los canales, esquemas y códigos de 0.2.2. Los ADR fijan los nombres y los argumentos de casi todos, pero no tres cosas: (a) los canales `alineacion.*`, (b) las lecturas del lote que preceden a `fuente.lote`, y (c) la forma de varias respuestas y eventos. Cada canal responde «no implementado» hasta que su tarea lo sustituya, así que corregir cualquier forma ahora cuesta solo editar `shared/ipc.ts` (sección «0.2.2: contratos de las once features»).

## Pregunta

1. **Canales `alineacion.*`** (ADR 0028 §3.2 solo nombra el comando del worker). Propuestos: `alineacion.estado()` (disponibilidad y modelos por idioma con tamaño, licencia y si están descargados), `descargarModelo({ idioma })`, `cancelarDescarga({ idioma })`, `quitarModelo({ idioma })`, `previsualizar({ cancionId, idioma, ids? })` (recuentos para el diálogo), `alinear({ cancionId, idioma, ids? })` → `{ trabajoId }`, `cancelar({ trabajoId })` y el evento `alineacion:progreso`. ¿Se confirman o se renombran? (`test` de `handlers.test.ts` que prohíbe canales con «modelo» o «descargar» fuera de `runtime.*` se ha acotado para excluir el grupo `alineacion:`.)
2. **Lecturas del lote** (ADR 0026 §1 no nombra los canales). Propuestos: `fuente.leerArchivos({ rutas? })`, `fuente.leerCarpeta({ ruta? })` (sin ruta, main abre el diálogo del sistema; `null` si se cancela) → `{ filas: [{ ref, nombre, duracionMs, metadatos, duplicado }], rechazadas }`, y `fuente.infoLista({ url })` → `{ titulo, tipo, entradas, recortada }`. Varios enlaces siguen usando `fuente.infoYoutube` uno a uno. `fuente.lote` lleva `metadatos[]` paralelo a `entradas[]` (mismo largo) y `MAX_LOTE = 50`.
3. **Formas de respuesta no fijadas**: `preparacion.preparar` → `{ aceptadas: string[], omitidas }` (el ADR dice `{ aceptadas, omitidas }`; elegí ids en lugar de un número); `preparacion.tanda` → `{ total, terminadas, pausada, motivoPausa, estimacionMin }`; `exportacion.iniciarLote`/`reintentarLote` → `{ loteId, encoladas: [{ cancionId, trabajoId }], omitidas }`; `letras.exportarLrc` → `{ lineasOmitidas }`; `copias.exportarCanciones`/`exportarBiblioteca` → `{ trabajoId }`; previsualizaciones por lotes → `{ version, canciones: [{ id, aplica, motivo?, trabajos, entradasCola, cambiaTema }] }`; eventos `biblioteca:progresoLote` (`{ hechas, total }`), `copias:cambio` y `copias:progreso`.
4. **`letras.exportarLrc({ cancionId, destinoId })`**: el ADR habla de `dialog.showSaveDialog` en main pero no de qué canal entrega el `destinoId`. ¿Es `exportacion.destinoPropuesto`/`elegirDestino` (hoy solo de formatos de video) o hay que añadir un canal propio de letras?
5. **Canal de la cola de varias canciones**: el ADR 0026 los llama `sesion.colaAnadirVarias`/`colaQuitarVarias` (la tarea 0339 también) aunque el grupo de la cola hoy es `cola.*`. Los dejé en `sesion.*` tal como se nombran; el ADR cita además `cola.anadir`, que en el código es `cola.agregar`.
6. **Texto de `URL_NO_SOPORTADA`**: 0339 pide el texto nuevo («Este enlace no se puede usar. Los directos, los canales y las mezclas automáticas…», spec 03). Hoy el modo de una sola canción sigue rechazando las listas con ese código, así que cambiar el texto antes de que exista el modo lote (0315) diría algo falso. **No lo cambié**: el texto actual vive en `shared/avisos.ts`, `vistas/progreso/textos.ts` y `vistas/biblioteca/textosError.ts` y debe cambiarlo la tarea 0315 junto con el parser de listas.
7. **Códigos nuevos solo de main**: `LISTA_NO_DISPONIBLE` y `ARCHIVO_NO_ENCONTRADO` los declaré en `CODIGOS_SOLO_MAIN` para no tocar `worker/errores.py` (la paridad con el worker lo comprueba un test). Si el worker llega a emitirlos, la tarea del worker (0313) los mueve.

## Opción provisional tomada (si no bloquea)

Lo descrito arriba: nombres y formas propuestos, todos de la principal, con manejador «no implementado». Nada visible cambia.

## Respuesta

Arquitecto, 2026-11-22. La opción conservadora se confirma casi entera: los puntos 6 y 7 quedan tal cual; los puntos 1, 2 y 3 añaden campos o un evento; el 4 cambia los argumentos de la exportación LRC y el 5 renombra dos canales. Cada contrato queda fijado como «Revisión 2026-11-22 (pregunta 0166)» en su ADR: [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md), [0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md) y [0028](../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md).

### 1. Canales `alineacion.*` — se confirman, con un evento más

- Se confirman `alineacion.estado()`, `descargarModelo({ idioma })`, `cancelarDescarga({ idioma })`, `quitarModelo({ idioma })`, `previsualizar({ cancionId, idioma, ids? })`, `alinear({ cancionId, idioma, ids? })` → `{ trabajoId }`, `cancelar({ trabajoId })` y el evento `alineacion:progreso`, todos de la principal. El grupo propio es correcto: la descarga de estos modelos es una acción explícita del usuario con tamaño y permiso (spec 08 · Feature 10), igual que `runtime.aceptarYUsarRapido`; el test acotado a `alineacion:` vale.
- **Falta el resultado**: añadir el evento **`alineacion:resultado`** `{ trabajoId, cancionId, resultado: { lineas: [{ id, finMs, confianza, palabras: [{ inicioMs, finMs }] }], omitidas: [{ id, motivo }] } | null, error: ErrorIpc | null }` (tiempos **en tiempo de audio**, como el comando del worker). Motivo: en el editor el resultado lo aplica **el renderer** con `aplicarAlineacion` (función pura de `shared/`) como **un solo paso de deshacer**, y descarta las líneas que cambiaron mientras se escuchaban (pregunta 0167, punto 3); main no escribe la letra de una canción abierta en el editor. En la preparación desatendida main aplica él mismo y el evento se emite igual (sin efecto si no hay editor).
- `alinear` y `previsualizar` leen la **letra guardada**: el editor vacía su guardado pendiente antes de llamarlos (el mismo mecanismo de `app.guardadoPendiente`). El `idioma` es el de esta ejecución; si el usuario lo cambia en el diálogo, el renderer lo guarda en `letra.idioma` con el guardado normal del editor (main no lo escribe aquí).

### 2. Lecturas del lote — se confirman, con dos precisiones

- Se confirman `fuente.leerArchivos({ rutas? })`, `fuente.leerCarpeta({ ruta? })` (sin argumento, main abre el diálogo; `null` si se cancela) → `{ filas, rechazadas }` y `fuente.infoLista({ url })` → `{ titulo, tipo, entradas, recortada }`; varios enlaces y el completado de las entradas de una lista, con `fuente.infoYoutube` uno a uno; `fuente.lote` con `metadatos[]` paralelo y `MAX_LOTE = 50`.
- **Rutas que son carpetas**: el renderer no distingue al soltar una carpeta de un archivo; `leerArchivos({ rutas })` acepta carpetas mezcladas y main recorre cada una con las reglas de `leerCarpeta` (3 niveles, 500 elementos). Es comportamiento de la tarea 0314, no cambia la forma.
- **Duplicados de YouTube**: la regla vive en main (ADR 0026 §1). Añadir **`duplicado: 'YA_EN_BIBLIOTECA' | null`** a cada entrada de `infoLista` y un campo **opcional** `duplicado` igual en la respuesta de `fuente.infoYoutube` (el modo de una canción lo ignora). `REPETIDA` dentro de la tabla la calcula el renderer, que ve todas las filas.

### 3. Formas de respuesta — se confirman, salvo la tanda y `exportarLrcVarias`

- `preparacion.preparar` → `{ aceptadas: string[], omitidas: [{ id, motivo }] }`: **confirmado** (ids mejor que un número).
- `preparacion.tanda` → **ampliar**: `{ total, terminadas, pausada, motivoPausa, estimacionMin, descargasParadas, canciones }` con `descargasParadas: 'YOUTUBE_BLOQUEADO' | 'SIN_CONEXION' | null` (parada solo de descargas, distinta de la pausa de toda la cola; spec 04 «Botón de la barra superior») y `canciones: [{ id, resultado: null | 'lista_para_revisar' | 'elige_letra' | 'sin_letra' | 'letra_pendiente' | 'error' | 'cancelada', motivo?: string, dudosas?: number }]` en el orden de la cola (`null` = aún sin resultado). ADR 0025 §5 dice que la tanda lleva «resultado por canción» y el diálogo «Resultado de la preparación» lo necesita (spec 04, F7-P6). `pausada: true` con `motivoPausa: null` es la pausa del usuario; con un código, la parada automática de toda la cola. `estimacionMin` = minutos restantes, `null` mientras se calcula.
- `exportacion.iniciarLote` / `reintentarLote` → `{ loteId, encoladas: [{ cancionId, trabajoId }], omitidas: [{ id, motivo }] }`: **confirmado**.
- `letras.exportarLrc` y `exportarLrcVarias`: cambian, ver punto 4.
- `copias.exportarCanciones` / `exportarBiblioteca` → `{ trabajoId }`: **confirmado**.
- Previsualizaciones por lotes → `{ version, canciones: [{ id, aplica, motivo?, trabajos, entradasCola, cambiaTema }] }`: **confirmado**.
- Eventos `biblioteca:progresoLote` `{ hechas, total }` (una acción por lotes a la vez: la interfaz es modal), `copias:cambio` `{ trabajoId, estado, codigo? }` y `copias:progreso`: **confirmados**.

### 4. Destino de `letras.exportarLrc` — sin `destinoId`: main abre el diálogo dentro de la llamada

La spec ([02 · Feature 9, «Exportar la letra a `.lrc`»](../ux/02-biblioteca.md)) no tiene diálogo propio: abre **directamente** el «Guardar» del sistema (una canción) o «Elegir carpeta» (varias). El patrón `destinoId` existe para mostrar un destino propuesto antes de confirmar, que aquí no hay; y `exportacion.destinoPropuesto` está atado a un formato de video. Por eso:

- `letras.exportarLrc({ cancionId })` → `{ lineasOmitidas, ubicacionId } | null`: main abre `dialog.showSaveDialog` con el nombre `lrc.nombre` en la última carpeta usada para letras (en memoria de main durante la sesión; si no, Documentos), rechaza el directorio de datos y escribe. `null` = cancelado.
- `letras.exportarLrcVarias({ ids })` → `{ escritas, omitidas: [{ id, motivo }], ubicacionId } | null`: main abre «Elegir carpeta» y escribe un `.lrc` por canción con « (2)», « (3)»… si el nombre existe (nunca sustituye).
- Canal nuevo **`letras.mostrarEnCarpeta({ ubicacionId })`** para [Mostrar en la carpeta] / [Mostrar la carpeta] del toast. `ubicacionId` (UUID) lo asocia main a la ruta escrita mientras la app siga abierta; el renderer nunca recibe ni envía rutas.

### 5. Cola de varias canciones — se renombra a `cola.*`

El grupo de la cola es `cola.*` y ahí deben vivir: **`cola.agregarVarias({ ids })`** → `{ entradaIds, omitidas }` y **`cola.quitarVarias({ entradaIds })`** → la misma respuesta que `cola.quitar`, ambos de la principal. Los nombres `sesion.colaAnadirVarias`/`colaQuitarVarias` del ADR 0026 y `cola.anadir` eran errores de redacción; el ADR queda corregido y la tarea 0318 también.

### 6. Texto de `URL_NO_SOPORTADA` — de acuerdo: lo cambia la 0315

Correcto no cambiarlo ahora. El criterio pasa de la tarea 0339 a la [0315](../tareas/0315-modo-lote-en-anadir-cancion.md), que cambia el texto en `shared/avisos.ts`, `vistas/progreso/textos.ts` y `vistas/biblioteca/textosError.ts` a la vez que admite las listas.

### 7. Códigos solo de main — de acuerdo, con un traslado previsto

`ARCHIVO_NO_ENCONTRADO` se queda en main (main comprueba que el archivo existe antes de lanzar `importar-archivo-cola`). `LISTA_NO_DISPONIBLE` **sí** lo emitirá el worker (`info-lista-youtube` es quien ve la lista privada o vacía): la tarea [0313](../tareas/0313-worker-leer-etiquetas-y-listas-de-youtube.md) lo mueve de `CODIGOS_SOLO_MAIN` a los códigos compartidos con `worker/errores.py` (queda en sus criterios).

### Cambios de código pendientes (para el programador, tarea 0339)

1. **`shared/canales.ts`**:
   - Quitar `sesion.colaAnadirVarias` y `sesion.colaQuitarVarias`; añadir `cola.agregarVarias: 'cola:agregarVarias'` y `cola.quitarVarias: 'cola:quitarVarias'`, ambos `PRINCIPAL` en `ROLES_POR_CANAL`.
   - Añadir `letras.mostrarEnCarpeta: 'letras:mostrarEnCarpeta'` (`PRINCIPAL`).
   - Añadir el evento `alineacionResultado: 'alineacion:resultado'` junto a `alineacionProgreso`.
   - Quitar del comentario del grupo `alineacion` la mención «propuestos en la pregunta 0166, a confirmar» (ya confirmados).
2. **`shared/ipc.ts`**:
   - Renombrar `colaAnadirVariasSchema`/`colaQuitarVariasSchema`/`resultadoColaAnadirVariasSchema` a `colaAgregarVarias…`/`colaQuitarVarias…` y sus entradas del `CONTRATO` a `CANALES.cola.agregarVarias`/`quitarVarias`; la respuesta de `quitarVarias` = la de `cola.quitar` (`quitarColaResSchema`). En la interfaz de la API, mover los métodos de `sesion` a `cola` como `agregarVarias(ids)` y `quitarVarias(entradaIds)`.
   - `exportarLrcSchema` → `z.strictObject({ cancionId })`; respuesta `z.object({ lineasOmitidas, ubicacionId: z.uuid() }).nullable()`.
   - `exportarLrcVariasSchema` → `z.strictObject({ ids: idsCancionSchema })`; respuesta `z.object({ escritas, omitidas: z.array(omitidaSchema), ubicacionId: z.uuid() }).nullable()`.
   - Nuevo `[CANALES.letras.mostrarEnCarpeta]: { args: z.tuple([z.strictObject({ ubicacionId: z.uuid() })]), res: z.void() }` y su método `letras.mostrarEnCarpeta(ubicacionId)`.
   - `tandaPreparacionSchema`: añadir `descargasParadas: z.enum(['YOUTUBE_BLOQUEADO', 'SIN_CONEXION']).nullable()` y `canciones: z.array(z.object({ id: idCancionSchema, resultado: z.enum(['lista_para_revisar', 'elige_letra', 'sin_letra', 'letra_pendiente', 'error', 'cancelada']).nullable(), motivo: motivoSchema.optional(), dudosas: z.number().int().nonnegative().optional() }))`; quitar «forma provisional» del comentario.
   - `listaYoutubeSchema.entradas[]`: añadir `duplicado: z.enum(['YA_EN_BIBLIOTECA']).nullable()`; `infoYoutubeSchema`: añadir `duplicado: z.enum(['YA_EN_BIBLIOTECA']).nullable().optional()`.
   - Nueva interfaz `ResultadoAlineacionIpc` `{ trabajoId: string; cancionId: string; resultado: { lineas: { id: string; finMs: number; confianza: number; palabras: { inicioMs: number; finMs: number }[] }[]; omitidas: { id: string; motivo: string }[] } | null; error: ErrorIpc | null }` y `alineacion.alResultado(cb)` en la API.
   - Quitar «provisionales (pregunta 0166)» de los comentarios de `leerArchivosSchema` y del bloque de alineación.
3. **`preload/index.ts`**: `cola.agregarVarias`/`quitarVarias` (fuera de `sesion`), `letras.exportarLrc(cancionId)`, `letras.exportarLrcVarias(ids)`, `letras.mostrarEnCarpeta(ubicacionId)` y `alineacion.alResultado(cb)` sobre el evento nuevo.
4. **`main/ipc/handlers.ts`**: registrar `cola.agregarVarias`, `cola.quitarVarias` y `letras.mostrarEnCarpeta` con el manejador «no implementado» (y quitar los dos de `sesion`).
5. **Dobles** (`vistas/apiNuevaFalsa.ts`, `vistas/*/fixturesApi.ts`) y **`shared/ipc022.test.ts`**: los mismos renombres y altas.
6. **Tarea 0339**: el criterio del texto de `URL_NO_SOPORTADA` ya no le corresponde (se ha quitado de su lista de criterios).
