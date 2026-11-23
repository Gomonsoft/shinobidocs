# 0317 — Origen de los datos de un lote de YouTube sin consulta previa, `musica` nula y rutas en el contrato de lectura

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (opción aplicada)

## Contexto

Tarea 0384 (datos de cada vídeo al descargar). Al quitar la consulta vídeo a vídeo de la tabla, `fuente.lote` recibe entradas de YouTube que main nunca consultó.

## Pregunta

1. **Origen sin consulta (`ServicioYoutube.origenSinConsulta`)**. Sin consulta previa, `crearDeLote` dejaba `metadatos.origen` vacío y la descarga pisaba incluso el título que el usuario había editado en la tabla (lo vio la E2E de `importar-lote`). Main recuerda ahora, por vídeo, el título de la lista y el álbum que mostró la tabla: lo igual a eso se guarda con origen `nombre` (la descarga lo puede completar) y lo que el usuario cambió o escribió, con `usuario` (artista no vacío = `usuario`, porque la lista no lo daba). ¿Se confirma?
2. **`musica` nula**. El worker devuelve `musica: null` cuando el vídeo no trae `track`, `artist`, `album`, `album_artist`, `track_number` ni `release_year` (solo título y canal limpios no cuentan, no son datos de YouTube Music). ¿Se confirma?
3. **Rutas en el contrato**. `filaLoteSchema.ruta` (0315) entrega al renderer la ruta de un archivo para el flujo de una sola canción (`importarArchivo(ruta)`). La regla (ADR 0008) es que el renderer no maneja rutas. ¿Se justifica como excepción (el renderer ya recibe rutas de arrastrar y soltar con `rutaDeArchivo`) o se quita, de modo que con un solo archivo añadible main lo importe por el `ref`?
4. **Parada total y descargas**. En el CI de 80dfa1f un fallo `RUNTIME_NO_DISPONIBLE` de la separación paró TODA la cola y retuvo también las descargas de YouTube pendientes (la E2E `importar-lote` no usaba el separador falso). Es lo que dice el ADR 0025 §5, pero las descargas y las importaciones de archivo no necesitan el motor de audio: ¿deben seguir mientras la separación está parada por `RUNTIME_NO_DISPONIBLE`? (Con `SIN_ESPACIO` sí tiene sentido pararlo todo.)

## Opción provisional tomada (si no bloquea)

1 y 2: aplicadas como se describe. 3 y 4: sin cambios de código; la E2E usa el separador falso.

## Respuesta

Arquitecto, 2026-11-23. Queda en ADR [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md) y [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) (revisiones de esta pregunta).

1. **Confirmado.**
   - Lo igual a lo que mostró la tabla lleva origen `nombre`; lo cambiado o escrito por el usuario, `usuario`. El artista no vacío también es `usuario`.
   - Es la regla de la 0384 aplicada a entradas sin consulta, y garantiza que la descarga nunca pisa lo editado.
   - La comparación, tras recortar espacios.
2. **Confirmado**: `musica: null` sin ningún campo de YouTube Music. Título y canal limpios no son datos de música.
3. **Se quita la ruta.**
   - El arrastre es distinto: el renderer **envía** a main la ruta que le da el sistema, y main la valida.
   - Aquí, en cambio, main **entregaría** al renderer rutas que el renderer no conocía (las del diálogo). ADR 0008 no lo admite y no hace falta: el `ref` ya existe.
   - `fuente.importarArchivo({ ref })` para el caso de una sola fila. Tarea [0390](../tareas/0390-ruta-fuera-del-contrato-del-lote-y-parada-solo-de-separaciones.md).
4. **Sí, deben seguir.**
   - `RUNTIME_NO_DISPONIBLE` en una separación para solo la cola `pesada` (`separacionesParadas`); descargas, importaciones y búsqueda de letra siguen.
   - Si la descarga o la importación fallan con ese mismo código, el motor básico falta y se para todo, como antes. `SIN_ESPACIO` lo para todo.
   - Corrige ADR 0025 §5. Tarea 0390.
5. **Confirmado**: `SIN_CODIFICADOR` ofrece «Cambiar opciones», porque cambiar el formato lo puede resolver.
