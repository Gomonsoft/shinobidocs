# Guía manual · Feature 6 · Datos de la canción automáticos

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas no pueden comprobar: vídeos reales de YouTube, archivos propios con etiquetas de verdad, la tasa de correcciones («10 + 10» de la spec), el lector de pantalla y el teclado. Los textos entre «» son los de la spec y están implementados tal cual. El álbum que rellena LRCLIB y su aviso en el formulario son de la feature 5 y **no** se prueban aquí.

- Versión: 0.2.2 · Feature 6
- Spec: [03 · Feature 6](../../ux/03-anadir-cancion.md#022--feature-6--datos-de-la-canción-automáticos) (F6-N1 a F6-N6, N9, N10) · ADR: [0025](../../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) · Tareas: [0302](../../tareas/0302-metadatos-de-archivo-youtube-y-nombre.md), [0303](../../tareas/0303-propuesta-de-datos-por-campo-en-main.md), [0304](../../tareas/0304-datos-automaticos-en-anadir-cancion.md), [0305](../../tareas/0305-verificacion-e-informe-de-la-feature-6.md) · Informe: [informe-feature-6](../../versiones/0.2.2/informe-feature-6.md)
- Duración estimada: 1 h 30 min (el caso 1 es el más largo).
- Requisitos:
  - Una biblioteca **con canciones reales tuyas** (cuantas más, mejor) y, entre ellas, el artista que más repites.
  - **10 archivos de audio propios** variados: con etiquetas completas (MP3, FLAC, M4A), sin etiquetas con nombre `Artista - Título`, con nombre `03 - Título`, con nombre sin sentido (`audio_final2.wav`) y con el número de pista pegado a un artista (`3 Doors Down - …`).
  - **10 enlaces de vídeos reales de YouTube** variados: oficiales, «Lyrics», de canal «- Topic», con «ft.», uno de YouTube Music con álbum y uno con título y artista al revés.
  - Red para YouTube; para el caso 5, la posibilidad de cortarla.
  - Un lector de pantalla para el caso 6: NVDA (Windows), VoiceOver (macOS) u Orca (Linux).
  - Una copia de la carpeta de datos (**Ajustes → Abrir carpeta de datos**) antes de empezar.

Cada fila tiene un paso, lo que debería pasar y una casilla. Si algo no coincide, márcalo como fallo y apúntalo en «Incidencias».

## Casos

### 1. Las «10 + 10» (criterio de la spec)

Para cada fuente, **Añadir canción**, pega el enlace o elige el archivo y mira «Revisa los datos de la canción» **sin escribir nada**. Apunta si hay que corregir algún campo (título, artista o álbum) y cuál. No hace falta terminar de añadir: **Cancelar** basta.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Los 10 archivos propios, uno a uno. | Cada campo lleva su línea de procedencia (De las etiquetas del archivo / Del nombre del archivo / Como en tu biblioteca). Un nombre sin sentido da el título con «⚠ Del nombre del archivo: compruébalo» y, sin artista, «Sin artista es más difícil encontrar la letra.». | ☐ |
| 1.2 | Los 10 enlaces de YouTube, uno a uno. | Un vídeo de YouTube Music trae título, artista y álbum «De los datos de la canción en YouTube». Un oficial con «(Official Video)» o «[Lyrics]» sale sin ese añadido. Un artista sacado del canal lleva «⚠ Del nombre del canal: compruébalo». | ☐ |
| 1.3 | Anota el recuento. | Escribe aquí en cuántos de los 20 hubo que corregir algún campo: ____ de 20 (archivos ____, vídeos ____). Los campos corregidos: ____ | ☐ |
| 1.4 | Prueba especialmente `3 Doors Down - …`, `50 Cent - …` y `21 Guns.mp3` si los tienes. | **Conocido** ([pregunta 0231](../../preguntas/0231-numero-inicial-del-nombre-que-es-parte-del-artista.md)): la app descarta el número como pista y propone «Doors Down», «Cent» y «Guns» sin avisar de duda. Anota si te ocurre. | ☐ |

### 2. «Como en tu biblioteca» y el tema heredado

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Mira en la Biblioteca (agrupar por Álbum) cómo está escrito un álbum del artista que más repites; si tiene puntos suspensivos, tildes o comillas mejor aún. | Anota su grafía exacta: ____ | ☐ |
| 2.2 | Añade un archivo o vídeo de ese artista y álbum cuyo álbum venga escrito con una diferencia mínima (tilde, «...» en lugar de «…», un espacio). | El campo Álbum ya sale con **la grafía de la biblioteca** y la línea «Como en tu biblioteca». | ☐ |
| 2.3 | Termina de añadir la canción y ve a la Biblioteca. | La canción aparece en el **mismo grupo** de álbum (no en un grupo aparte) y **hereda su tema** sin tocar nada. | ☐ |
| 2.4 | Repite con el artista escrito en minúsculas respecto a la biblioteca. | La canción entra en el mismo grupo de artista. (La propuesta puede conservar las minúsculas: [pregunta 0232](../../preguntas/0232-grafia-de-la-biblioteca-cuando-solo-difieren-las-mayusculas.md).) | ☐ |

### 3. Título y artista al revés

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Un vídeo titulado «Título - Artista» de un artista que ya está en tu biblioteca. | Salen ya intercambiados con «⚠ Hemos intercambiado título y artista: compruébalo». | ☐ |
| 3.2 | Pulsa **⇄ Intercambiar título y artista**. | Se intercambian los valores, desaparecen sus líneas de procedencia y el foco queda en el botón. El botón solo existe con título y artista rellenos. | ☐ |

### 4. Autocompletado, unificar y «Editar datos» (teclado y ratón)

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | En Artista escribe las dos primeras letras de un artista tuyo. | Lista con hasta 8 artistas que contienen lo escrito (sin distinguir mayúsculas ni tildes), con «n canciones» y ordenados por canciones. | ☐ |
| 4.2 | Con la lista abierta: ↓ ↓ Intro. | Se elige el segundo valor. La lista se cierra. | ☐ |
| 4.3 | Escribe de nuevo y pulsa **Esc**. | La lista se cierra y **sigues en la vista**. Un segundo Esc cancela la vista. | ☐ |
| 4.4 | En Álbum, con un artista que tiene varios álbumes, pulsa ↓. | Salen primero los álbumes de ese artista. | ☐ |
| 4.5 | Escribe un valor nuevo que no está en la lista y continúa. | Es válido; no se bloquea nada. | ☐ |
| 4.6 | Escribe en Álbum el nombre de uno existente cambiando una tilde o «…» por «...» y sal del campo con el **ratón** (clic en otro campo). | Aparece «¿Te refieres a «…», que ya está en tu biblioteca?» con **Usar «…»** y **Dejarlo así**. Usar sustituye el valor y deja el foco en el campo; Dejarlo así lo oculta y permite continuar. | ☐ |
| 4.7 | Repite 4.6 saliendo con **Tab**. | **Conocido** ([pregunta 0230](../../preguntas/0230-sugerencia-de-unificar-aparece-despues-de-salir-del-campo.md)): el foco ya está en «Cancelar» cuando aparece la sugerencia. Anota cómo lo vives. | ☐ |
| 4.8 | Cambia a mano un campo prerrellenado. | Su línea de procedencia desaparece y no vuelve sola. | ☐ |
| 4.9 | En la Biblioteca, **⋯ → Editar datos** de una canción. Repite 4.1, 4.6 y 3.2. | Mismo autocompletado, misma sugerencia de unificar y mismo intercambio; **sin** líneas de procedencia. Esc con la lista abierta la cierra sin cerrar el diálogo. | ☐ |

### 5. Sin conexión

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Corta la red y añade un archivo con etiquetas y uno sin ellas. | Todo lo de los casos 1, 2 y 4 funciona igual. No hay avisos de red. | ☐ |
| 5.2 | Con un monitor de red abierto, añade un archivo. | Al revisar los datos no sale ninguna petición. (Al continuar, la búsqueda de letra es de la feature 5 y depende de su interruptor.) | ☐ |

### 6. Lector de pantalla

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Enfoca Artista con la biblioteca llena. | Lo anuncia como cuadro combinado editable, con la ayuda (procedencia) leída como descripción. | ☐ |
| 6.2 | Escribe y recorre la lista con ↓. | Cada opción se lee «{nombre}, {n} canciones» y el estado expandido/contraído se anuncia. | ☐ |
| 6.3 | Provoca la sugerencia de unificar. | Se anuncia el texto de la sugerencia (región de estado) **sin que tengas que buscarla**. Anota si no se lee: la región se inserta ya con el texto. | ☐ |
| 6.4 | Pulsa «Intercambiar título y artista». | Se anuncia «Título y artista intercambiados.». | ☐ |
| 6.5 | Un dato dudoso. | La advertencia se lee con su texto («…: compruébalo»); no depende del color. | ☐ |

### 7. Capturas (F6-N11)

Ya están tomadas automáticamente sobre la semilla en `docs/ux/revisiones/0.2.2-feature-6/` (`anadir-1280x800-100-…`). Solo falta `editar-datos-lrclib`, que espera a la feature 5. Con vídeos y archivos reales, comprueba a ojo que se parecen a las capturas.

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
