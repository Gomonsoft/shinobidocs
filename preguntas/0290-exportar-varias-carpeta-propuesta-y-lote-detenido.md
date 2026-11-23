# 0290 — Exportar varias canciones: cómo se obtiene la carpeta propuesta y cómo se ve una canción «no intentada»
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en las tareas [0318](../tareas/0318-operaciones-por-lotes-en-main.md) y [0319](../tareas/0319-exportacion-por-lotes-en-main.md))

## Contexto

ADR 0026 §5 dice que `exportacion.destinoCarpeta({ desdeCarpetaId? })` «abre `dialog.showOpenDialog` en la última carpeta usada» y devuelve `{ carpetaId, ruta, libreBytes }`. La spec 10 (G) muestra la carpeta **ya rellena** al abrir el diálogo de lote («Propuesta: la última carpeta usada para exportar; si no existe, la de vídeos») y [Cambiar…] abre el selector. Con un solo canal que siempre abre el selector, el formulario no tendría una carpeta propuesta sin abrir antes un diálogo del sistema. Además, ADR 0026 §5 dice que las canciones que faltan «quedan `omitidas` con ese motivo (reintentables)» cuando el lote se detiene, pero `iniciarLote` ya respondió; hace falta una forma en el estado de cómo ve la interfaz esas filas.

## Pregunta

1. ¿`destinoCarpeta()` sin argumentos debe devolver la carpeta **propuesta** (sin diálogo) y `destinoCarpeta({ desdeCarpetaId })` abrir el selector? (Es lo que hace `destinoPropuesto` frente a `elegirDestino` en el vídeo de una canción.)
2. ¿Cómo se representa una exportación de un lote que no se intentó porque el lote se detuvo por `SIN_ESPACIO` o `DESTINO_NO_DISPONIBLE`?
3. ¿Se aceptan el campo opcional `loteId` en `ExportacionIpc` y `libreBytes` anulable en `carpetaIpcSchema`?

## Opción provisional tomada (si no bloquea)

1. Sí: `destinoCarpeta()` propone (la última carpeta usada para vídeo, luego Vídeos, luego la personal; nunca dentro de los datos) y devuelve `{ carpetaId, ruta, libreBytes }`; con `desdeCarpetaId` abre `dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] })` empezando en esa carpeta y devuelve la nueva (o `null` si se cancela; el `carpetaId` anterior sigue vigente). El `carpetaId` es de un solo uso y caduca a los 30 min; `iniciarLote` lo valida (no es la carpeta de datos y se puede escribir) y lo gasta una sola vez.
2. Las que faltan pasan a `estado: 'terminada'`, `resultado: 'cancelada'` **con** `error` `{ codigo: 'SIN_ESPACIO' | 'DESTINO_NO_DISPONIBLE', … }` (una cancelada por el usuario no lleva `error`). La interfaz las pinta como `exp.lote.fila.noIntentada` y `reintentarLote` las vuelve a encolar con las fallidas; las canceladas por el usuario y las omitidas por nombre no se reintentan.
3. Sí: `ExportacionIpc.loteId?: string` (solo las de un lote) y `carpetaIpcSchema.libreBytes: number | null` (`null` si no se pudo consultar; el espacio total solo se comprueba con un dato válido).

## Respuesta

Arquitecto, 2026-11-22. **Se confirma la opción provisional en sus tres puntos.** Queda fijada en ADR [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md), revisión «Carpeta propuesta y canciones no intentadas (pregunta 0290)», que corrige §5.

1. `exportacion.destinoCarpeta()` sin argumento **propone** la carpeta sin abrir ningún diálogo: la última usada para vídeo, luego Vídeos, luego la carpeta personal, y nunca dentro de los datos. `destinoCarpeta({ desdeCarpetaId })` abre el selector en esa carpeta y devuelve `null` si se cancela; el `carpetaId` anterior sigue vigente. El `carpetaId` es de un solo uso, caduca a los 30 min y lo valida `iniciarLote`. Es el mismo patrón que `destinoPropuesto`/`elegirDestino` del vídeo de una canción.
2. Una canción del lote que no se intentó porque el lote se detuvo queda con `estado: 'terminada'`, `resultado: 'cancelada'` y `error: { codigo: 'SIN_ESPACIO' | 'DESTINO_NO_DISPONIBLE' }`. Una cancelación del usuario no lleva `error`. `reintentarLote` reencola las fallidas y las no intentadas, nunca las canceladas por el usuario ni las omitidas al iniciar. Así se representan las «omitidas (reintentables)» de §5, porque `iniciarLote` ya respondió.
3. Se aceptan `ExportacionIpc.loteId?: string` y `carpetaIpcSchema.libreBytes: number | null`. Con `null` no se hace la comprobación previa de espacio, y el lote se detiene con `SIN_ESPACIO` si el espacio falta durante la escritura.

No hay cambios de código en main: ya está implementado así (tareas 0318 y 0319). La interfaz que lo usa es la tarea [0321](../tareas/0321-dialogo-de-exportar-varias-canciones.md), que gana dos criterios.
