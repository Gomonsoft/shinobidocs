# 0220 — Contratos de los datos propuestos (feature 6) y lo que queda para la feature 5

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en las tareas [0302](../tareas/0302-metadatos-de-archivo-youtube-y-nombre.md), [0303](../tareas/0303-propuesta-de-datos-por-campo-en-main.md) y [0304](../tareas/0304-datos-automaticos-en-anadir-cancion.md))

## Contexto

ADR 0025 §6 fija que main devuelve por campo `{ valor, origen, dudoso, alternativa? }` pero no dónde viaja ni cómo se guarda el origen de cada fuente. Se tomaron estas decisiones mínimas.

## Pregunta

¿Se confirman?

1. **Dónde viaja la propuesta.** `fuente.importarArchivo` y `fuente.infoYoutube` devuelven, además de `metadatos` (cadenas, sin cambios), un campo opcional `datos: { titulo, artista, album }` con `{ valor, origen, dudoso, invertido?, alternativa? }` (`shared/ipc.ts`, `propuestaDatosSchema`). `origen` es `etiquetas | nombre | carpeta | video | pista | canal | lista | biblioteca` (los de la spec) o `null` sin valor. `invertido` distingue el aviso `add.dato.dudoso.invertido`. `alternativa` es la grafía propuesta antes de cambiarla por la de la biblioteca. Con `iniciales` (sustituir la fuente) el renderer ignora `datos`.
2. **Worker.** `importar-archivo` devuelve además `etiquetas` crudas (`title`, `artist`, `album`, `album_artist`, `track`, `date`, cadena vacía si faltan) y `info-youtube` devuelve `musica` (`track`, `artist` —`artists` unidos por «, »—, `album`, `album_artist`, `track_number`, `release_year`, `titulo_limpio` y `canal_limpio`). La limpieza de «(Official Video)», «ft. …», « - Topic», «VEVO» sigue en el worker (ADR 0003); el origen, la inversión y el «dudoso» se deciden en main (`main/fuente/propuestaDatos.ts`), como dice la spec.
3. **Almacén.** Al confirmar, main guarda `metadatos.origen` con `fuente` (etiqueta o campo de YouTube Music), `nombre` (nombre, carpeta, título del vídeo, canal o lista) o `usuario` (el valor confirmado difiere del propuesto); campo vacío = sin origen. `biblioteca.actualizarMetadatos` pone `usuario` en cada campo que cambia (también al vaciarlo) y fusiona el origen campo a campo.
4. **`biblioteca.valoresDatos`**: cada álbum lleva además `artistas?: string[]` (claves de identidad de los artistas con canciones de ese álbum) para ordenar primero los del artista escrito (spec 03, F6-N4). El álbum se agrupa solo por su clave, no por el par.
5. **Aplazado a la feature 5 (0307/0308/0311), no hecho en 0304**: F6-N7 (rellenar el álbum con el de LRCLIB, [Quitar], `add.dato.lrclib.sugerencia`, «Usar estos datos»), porque necesita la elección de letra de la preparación (`main/letras/**`, lote C); y F6-N8 (`add.dato.lrclib` con «Cambiar en Ajustes»), porque la sección «Letras y preparación automática» de Ajustes y conservar lo escrito al ir y volver no existen aún. `metadatos.origen` ya admite `lrclib` y la fusión por campo.

## Opción provisional tomada (si no bloquea)

Todo lo anterior. Alternativa: hacer `datos` obligatorio y dejar de enviar `metadatos` (cambia las fixtures de 0339 y los dobles de los tests).

## Respuesta

Arquitecto, 2026-11-22. **Se confirman los puntos 1 a 4 tal como están aplicados; no hay cambios de código.** Queda fijado en ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), «Revisión 2026-11-22 (pregunta 0220)». Mantengo `metadatos` junto a `datos`; no hace falta la alternativa.

1. **`datos`** opcional en `importacionLeida` e `infoYoutube`, con `{ valor, origen, dudoso, invertido?, alternativa? }`: confirmado. Corrijo el texto del ADR para que diga lo que pide la spec (F6-N3): `valor` lleva ya la grafía de la biblioteca (origen `biblioteca`) y `alternativa` es la propuesta original. El origen fino de la propuesta (`etiquetas`, `nombre`, `carpeta`, `video`, `pista`, `canal`, `lista`, `biblioteca`) solo existe mientras se añade la canción.
2. **Worker**: confirmado (`etiquetas` y `musica` crudos; limpieza en el worker, decisión en main).
3. **`metadatos.origen`** `{ titulo?, artista?, album? }` con `fuente | nombre | lrclib | usuario`, y `usuario` en cada campo que cambia `actualizarMetadatos`: confirmado.
4. **`valoresDatos`** con `artistas?` por álbum, y el álbum agrupado solo por su clave: confirmado.
5. **F6-N7 y F6-N8 pasan a la feature 5**:
   - La parte de main de F6-N7 va a la tarea [0308](../tareas/0308-servicio-de-preparacion-desatendida.md): `rellenarAlbumDesdeLrclib` en `main/biblioteca/origen.ts`, llamada al guardar una letra de LRCLIB, la elija la preparación o el usuario. Mantiene las reglas que diste: solo con el álbum vacío, nunca sobre un campo con origen `usuario` y «Quitar» = álbum vacío con origen `usuario`. Para la sugerencia «Usar estos datos», la letra guarda `datos_lrclib: { titulo, artista, album }`, que son metadatos del registro y no letra.
   - La interfaz de F6-N7 (`CamposDatos`, [Quitar] y la sugerencia) y F6-N8 van a la tarea [0311](../tareas/0311-preparacion-en-progreso-letra-editor-y-ajustes.md).
   - Lo verifica la 0312; el criterio de «hecha» de las features 5 y 6 está ajustado en el backlog y la 0305 lo dice.
