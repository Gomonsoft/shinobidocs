# 0261 — Lo que la tabla del lote necesita y el contrato de lectura no trae (0.2.2, feature 7)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en main; afecta a la 0315)

## Contexto

La spec 03 · Feature 7 (tabla de revisión y «Límite, espacio y duplicados») pide cosas que `fuente.leerArchivos`, `fuente.leerCarpeta` e `fuente.infoLista` (pregunta [0166](0166-contratos-ipc-de-0-2-2-que-los-adr-no-fijan.md)) no pueden dar con la forma actual:

1. **Espacio libre del disco y tiempo estimado.** El resumen («unos 1,1 GB · unos 8 minutos») y el bloqueo `add.lote.sinEspacio` los calcula el renderer, pero no tiene el espacio libre de la unidad de la biblioteca. Main ya calcula la misma estimación y rechaza `fuente.lote` con `SIN_ESPACIO` (`detalles: {"caben":n}`, nada se crea) si no cabe (100 MB por canción de 4 min proporcional a la duración, +10 %, margen de 1 GB). Pero la interfaz no puede avisar antes de pulsar «Añadir».
2. **Filas con línea ✕** (`add.lote.fila.ilegible`, `.corta`, `.directo`, «no disponible»): `lecturaLoteSchema` solo trae `rechazadas: number`; un archivo ilegible no tiene fila. En las listas, `disponible: false` junta privado, borrado y directo.
3. **Más de 50 filas.** La spec muestra hasta 500 filas con las 50 primeras marcadas, pero el comentario del contrato dice «rechazadas por superar `MAX_LOTE`» y `recortada` «se recortó a 50».
4. **Tope de 500 «elementos listados» de una carpeta**: no dice si cuenta archivos, carpetas u otros, ni cómo avisar de que se cortó (`add.lote.demasiadas`).
5. **Álbum de una lista**: `fuente.infoYoutube(url)` no recibe la lista, así que el álbum propuesto desde el título de la lista tiene que salir de la memoria de main.

## Pregunta

¿Se amplía el contrato (campos opcionales y aditivos) o se deja así hasta ver la interfaz?

## Opción provisional tomada (si no bloquea)

- (1) Solo la comprobación en `fuente.lote`. Propuesta si se amplía: `libreBytes: number | null` en `lecturaLoteSchema` y `listaYoutubeSchema`, y exportar `estimarEspacioLote` (puro, en `main/fuente/lote.ts`) a `shared/` para que el renderer calcule lo mismo.
- (2) Sin cambios: un archivo ilegible cuenta en `rechazadas`; una entrada de lista no disponible o en directo sale con `disponible: false` (el worker descarta además los ids que no son de vídeo).
- (3) Se sigue la spec: `leerArchivos`/`leerCarpeta` devuelven hasta **500 filas** y `infoLista` hasta **500 entradas**; `fuente.lote` impone las 50 (`MAX_LOTE`) y la tabla marca las 50 primeras. `rechazadas` cuenta lo que no es audio, lo ilegible, lo que está en la carpeta de datos y lo que pasa de 500. `recortada` es `true` solo si la lista traía más de 500. Así repetir una lista en otra tanda marca las 50 siguientes (los duplicados salen desmarcados).
- (4) Cuenta todo lo que se lista (archivos y carpetas, sin ocultos ni enlaces simbólicos); al llegar a 500 se corta sin avisar (no hay campo): la carpeta con más de 500 elementos pierde el resto en silencio. Si se quiere avisar, hace falta un campo (`truncada: boolean`).
- (5) `ServicioYoutube` recuerda el título del álbum de la última lista leída (quitando el prefijo «Album - » de YouTube Music) y lo usa como álbum propuesto (`origen: 'lista'`) en `infoYoutube` de sus entradas. Sin verificar con una lista real.

## Respuesta

Arquitecto, 2026-11-22. **Se amplía el contrato**, con campos aditivos. Queda fijado en ADR [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md), «Revisión 2026-11-22 (pregunta 0261)». Los cambios de main y del worker van en la tarea nueva [0375](../tareas/0375-contrato-final-de-la-lectura-del-lote.md); los de la interfaz, en la [0315](../tareas/0315-modo-lote-en-anadir-cancion.md).

1. **Espacio y tiempo**:
   - Las tres lecturas devuelven `libreBytes: number | null` (unidad de la biblioteca) y `factorMinutos: number | null` (minutos de proceso por minuto de audio, del factor medido; `null` si no hay).
   - Canal nuevo `fuente.espacioLibre()` → `{ libreBytes: number | null }`, para volver a comprobar al volver a la ventana (spec 03).
   - `estimarEspacioLote(duracionesMs)` y `estimarTiempoLote(duracionesMs, factorMinutos)` pasan a `shared/lote.ts` (puras). Las usan el renderer y main; `fuente.lote` sigue rechazando con `SIN_ESPACIO` como última defensa.
2. **Filas con ✕**:
   - Cada fila de archivo gana `problema: null | "ilegible" | "corta"`. Un archivo que es audio pero no se puede leer **sí** es una fila, con `duracionMs: null` y datos del nombre.
   - Cada entrada de lista gana `problema: null | "no_disponible" | "directo"`. `disponible` se mantiene, igual a `problema === null`.
   - El worker distingue el directo por `live_status` (`is_live`, `is_upcoming`) y el no disponible por `availability` o por el título de marcador de vídeo privado o eliminado.
   - `rechazadas` cuenta solo lo que no se muestra: lo que no es audio, lo que está dentro de la carpeta de datos y lo que pasa de 500.
3. **Límites**: se confirma lo aplicado: hasta **500** filas o entradas, y `fuente.lote` impone las 50 (`MAX_LOTE`). Se corrigen los comentarios del contrato. `recortada` (lista) y el nuevo **`truncada: boolean`** (archivos y carpeta) dicen si se cortó en 500, para `add.lote.demasiadas`.
4. **500 elementos de carpeta**: cuentan los **archivos de audio** encontrados (no las carpetas ni lo que se filtra). Para no recorrer un disco entero, además se para tras listar 5 000 entradas en total, y en los dos casos `truncada: true`.
5. **Álbum de una lista**: se acepta que main lo recuerde, pero **por id de lista y no «la última»**. Main guarda `listaId → { titulo, tipo }` durante 30 min; `fuente.infoYoutube(url)` con un `list=` en la URL usa ese título como álbum propuesto (origen `lista`). El renderer pide las entradas con `watch?v=…&list=…`.
6. **Sustituir la fuente con otro archivo** encadena separación, picos y preparación: **confirmado**. La preparación no sustituye la letra existente; solo la comprueba y, si sigue `intacta` y sin `desfase_descartado`, corrige el desfase o pone fines. Así una letra que ya no cuadra con el audio nuevo se señala sola. No hay cambios de código.

