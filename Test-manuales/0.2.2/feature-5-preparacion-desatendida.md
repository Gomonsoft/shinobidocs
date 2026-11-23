# Guía manual · Feature 5 · Preparación desatendida

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas no pueden comprobar: red real (LRCLIB y YouTube), la biblioteca real, una TV, el registro de red y cerrar la app a mano. Los textos entre «» son los de la spec y están implementados tal cual. Las cifras de las pruebas automáticas están en el [informe](../../versiones/0.2.2/informe-feature-5.md).

- Versión: 0.2.2 · Feature 5 (incluye F6-N7 y F6-N8)
- Specs: [02 · Biblioteca](../../ux/02-biblioteca.md) (F5-B), [03 · Añadir](../../ux/03-anadir-cancion.md) (F6-N7, N8), [04 · Progreso](../../ux/04-progreso-pipeline.md) (F5-P), [05 · Letra](../../ux/05-letra.md) (F5-L), [06 · Editor](../../ux/06-editor.md) (F5-E), [08 · Ajustes](../../ux/08-ajustes-y-acerca.md) (F5-J) · ADR: [0025](../../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) · Tareas: [0306](../../tareas/0306-registro-de-preparacion-y-derivados.md)–[0312](../../tareas/0312-verificacion-e-informe-de-la-feature-5.md), [0371](../../tareas/0371-calibrar-encaje-con-letras-sin-fines.md)–[0373](../../tareas/0373-motivo-de-la-no-eleccion-en-la-preparacion.md)
- Duración estimada: 2 h (más el tiempo de separación de tus canciones).
- Requisitos:
  - Una biblioteca **con canciones reales tuyas** y, entre ellas, **los 5 borradores** que quieres rescatar.
  - Red. Para el caso 5, poder cortarla (modo avión o desenchufar el cable).
  - Un monitor de red de tu sistema para el caso 4: Little Snitch o Activity Monitor › Red (macOS), Wireshark o `netstat` (cualquiera) o el Monitor de recursos › Red (Windows). Vale cualquiera que muestre con qué dominios habla `Shinobi Karaoke`.
  - Un archivo **WAV** y un **vídeo de YouTube** de canciones con letra en LRCLIB, y una **carpeta de 10 a 12** canciones (para el lote sin 429).
  - Una televisión por HDMI para el caso 7.
  - Una copia de la carpeta de datos antes de empezar (**Ajustes › Abrir carpeta de datos**).

Cada fila tiene un paso, lo que debería pasar y una casilla. Si algo no coincide, márcalo como fallo y apúntalo en «Incidencias».

## Casos

### 1. Un WAV y un vídeo llegan solos a «Lista para revisar» (criterio de «hecha»)

Criterio: F5-P1 a P4, P8, P9, P11; F5-B1, B5; F5-J1.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | **Ajustes**: la casilla «Buscar la letra automáticamente al añadir una canción» está marcada. | Marcada de serie, con el texto de privacidad visible. | ☐ |
| 1.2 | **Añadir canción** con tu WAV (título y artista bien escritos). **No toques nada más**: vuelve a la Biblioteca o espera en la vista. | En la vista de progreso salen los subpasos «Buscar la letra», «Comprobar la letra con la voz» y «Ajustar los fines de línea» y, al final, el bloque «Lista para revisar» con lo que se hizo. Sin intervención. | ☐ |
| 1.3 | Repite con el enlace de YouTube. | Igual; entre dos descargas seguidas hay una pausa de 3 a 8 s. | ☐ |
| 1.4 | Mira la tarjeta de cada una en la Biblioteca. | Insignia «Lista para revisar», «Letra elegida automáticamente» (con «y corregida» si hubo desfase) y los botones «Revisar» y «▶ Probar». **No** está en Listas ni se puede poner en la cola. Su `estado` sigue siendo borrador. | ☐ |
| 1.5 | Con la app en otra vista (p. ej. Ajustes) al terminar la segunda: ¿sale un toast «está lista para revisar» con [Revisar]? ¿Sale **además** «ya se puede marcar como lista»? | Un solo toast por canción (el de revisar). Apunta si se duplican ([pregunta 0242](../../preguntas/0242-defectos-menores-de-la-feature-5-y-11-hallados-en-la-verificacion.md), punto 6). | ☐ |
| 1.6 | Pulsa [Revisar] del toast. | Abre el editor **con la revisión guiada empezada** en la primera línea dudosa. **Conocido**: hoy el toast abre el editor sin el recorrido (punto 1 de la pregunta 0242). | ☐ |
| 1.7 | Con otra ventana de otra app delante, añade una canción más y espera. | Notificación del sistema al terminar (spec 04). **Conocido**: puede no salir (punto 5 de la pregunta 0242). | ☐ |
| 1.8 | Pulsa «▶ Probar» en una de las dos y sal con Esc. | Se ve y se oye a pantalla completa sin cambiar su estado; al salir, el foco vuelve a la tarjeta y sale «¿Qué tal «…»?» con [Marcar como lista] y [Revisar]. | ☐ |
| 1.9 | **Cántala entera** (o mira la letra mientras suena). | La letra elegida es la correcta y casi no hay líneas desplazadas. Anota: letras equivocadas ____ de ____. | ☐ |

### 2. Lote grande sin límites de LRCLIB (429)

Criterio: ADR 0025 §4 (cola automática a ≥ 1,5 s entre peticiones).

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Añade 10 o 12 canciones seguidas (una a una desde **Añadir canción**; la importación por lotes es de la feature 7). | Se encolan sin errores. La cola de actividad muestra la tanda. | ☐ |
| 2.2 | No toques nada hasta que termine. | Un solo aviso al final (`N canciones preparadas: …`) con [Ver resultado]; ninguna canción termina en «Letra pendiente» por límite de peticiones. Anota cuántas esperan letra: ____ y cuántas listas para revisar: ____ | ☐ |
| 2.3 | Pulsa [Ver resultado]. | Diálogo «Resultado de la preparación» con una fila por canción, su estado y su acción (Revisar, Elegir la letra, Añadir la letra). | ☐ |
| 2.4 | Mira el registro de la app (**Ajustes › Abrir carpeta de datos › registros**). | Ninguna línea con `429`. | ☐ |

### 3. Rescatar los 5 borradores del usuario con «Preparar» (criterio de «hecha»)

Criterio: F5-B6, F5-L6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | En la Biblioteca, filtra «Borradores». Para cada uno de los 5, abre su ⋯ y mira si existe «Preparar». | Está en los borradores a los que les falta algo (letra, fuente o pistas) y muestra su ayuda (`bib.prep.menu.ayuda`) si va a buscar letra. No aparece en «Lista para revisar». | ☐ |
| 3.2 | Pulsa «Preparar» en el primero. | Toast «Preparando «…». Te avisaremos al terminar.»; la tarjeta pasa por las líneas ⟳ (Buscando, Comprobando, Ajustando los fines). | ☐ |
| 3.3 | Un borrador **que ya tenga letra tuya** o tiempos que sincronizaste a mano: «Preparar». | **No** sustituye tu letra ni toca tus tiempos; solo añade fines y comprobación. Verifica abriéndola: tus inicios son los mismos. | ☐ |
| 3.4 | Prepara los 5. | Cada uno acaba en «Lista para revisar», «Elige la letra · n candidatas», «No encontramos la letra» o «Letra pendiente». Apunta cuántos de cada: ____ / ____ / ____ / ____ | ☐ |
| 3.5 | De los que llegaron a «Lista para revisar»: ¿tienen línea «⚑ n líneas por revisar» en la tarjeta? Y los que ya tenían todo completo antes de prepararlos. | La tienen. **Conocido**: una «Lista para revisar» sin registro de preparación (hecha a mano) **no** la tiene y marcar como lista desde su ⋯ no pregunta ([pregunta 0241](../../preguntas/0241-linea-y-dialogo-de-revision-no-existen-en-listas-para-revisar-sin-registro.md)). Anota si te ocurre. | ☐ |
| 3.6 | **Número de canciones que caen en «Elige la letra»** en esta preparación real. | Anótalo aquí (lo necesita la decisión de la tarea 0312 sobre los fines prudentes): ____ de ____ | ☐ |

### 4. Interruptor apagado: ninguna petición a LRCLIB al añadir (criterio de «hecha»)

Criterio: F5-J2, F5-J4 y la regla de privacidad de ADR 0005 revisado.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Arranca el monitor de red y filtra por `Shinobi Karaoke`. **Ajustes**: desmarca la casilla. Cierra y vuelve a abrir la app. | La casilla sigue desmarcada y el texto dice «Desactivada: …». | ☐ |
| 4.2 | Añade un archivo y un vídeo de YouTube. Espera a que terminen de separarse. | El monitor **no** muestra ninguna conexión a `lrclib.net` (sí a YouTube, y a GitHub si el aviso de versión está activo). Las canciones quedan «Falta la letra». | ☐ |
| 4.3 | Entra en «Letra» de una de ellas. | Ahora **sí** sale la búsqueda a `lrclib.net` (acción del usuario). | ☐ |
| 4.4 | «Preparar» en la otra. | También sale la petición (acción explícita), aunque el interruptor siga apagado. | ☐ |
| 4.5 | Desmarcada, deja una descarga de YouTube **sin red** (corta la conexión justo al empezar) y espera 2 minutos con el monitor. | **Conocido** ([pregunta 0243](../../preguntas/0243-comprobacion-de-conexion-contra-lrclib-con-el-interruptor-apagado.md)): tras ~60 s la app hace un `HEAD` sin datos a `lrclib.net` para ver si vuelve la conexión. Anota si lo ves. | ☐ |
| 4.6 | Vuelve a marcar la casilla con borradores sin letra. | Aviso «Tienes n borradores sin letra…» con [Verlos en la Biblioteca]; no se lanza ninguna búsqueda para ellos. Compara n con la casilla «Esperan letra» a la que lleva (**conocido**: pueden diferir, punto 3 de la pregunta 0242). | ☐ |

### 5. Sin red y «Letra pendiente»

Criterio: F5-P5, F5-L4, F5-B4.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Corta la red y añade un archivo con la casilla marcada. | «Buscar la letra» muestra ⚠ «Sin conexión»; la separación termina con normalidad. | ☐ |
| 5.2 | Espera 1 minuto. | Se reintenta una vez sola. Después: «No pudimos buscar la letra: sin conexión a internet.» con [Reintentar] y [Añadir la letra]. En la Biblioteca, «Letra pendiente: sin conexión». | ☐ |
| 5.3 | Vuelve la red y pulsa [Reintentar] (en la Biblioteca, sin salir de ella). | Repite la búsqueda y sigue la cadena. | ☐ |

### 6. Cerrar a mitad y reabrir

Criterio: F5-P10, F5-B9; ADR 0025 §5 y pregunta 0236 (cierre justo tras reanudar).

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Añade 3 canciones largas (4 min o más) y, con una separando y dos en cola, **cierra la app** (confirma «Cerrar de todos modos»). | El cierre se completa en pocos segundos. | ☐ |
| 6.2 | Abre la app. | Aviso «Retomando 3 canciones que quedaron a medias al cerrar.» con [Detener]. Las tres siguen solas, en el mismo orden. | ☐ |
| 6.3 | **En el primer segundo tras abrir**, vuelve a cerrar la app. | No se cuelga: sale el diálogo de cierre o se cierra (arreglo reciente, pregunta 0236). Hazlo 3 veces. | ☐ |
| 6.4 | Reabre, y vuelve a cerrar y reabrir **sin dejar que termine** (dos veces seguidas). | A la segunda, la que estaba en curso queda «Interrumpido» con [Reintentar]; no se retoma sola. | ☐ |
| 6.5 | Con trabajos retomados, pulsa [Detener]. | La cola queda en pausa: «Hay n canciones en pausa, a medio preparar.» con [Reanudar]. Cierra y reabre: sigue en pausa. [Reanudar] la retoma. | ☐ |

### 7. «Probar» en una televisión

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 7.1 | Conecta la TV por HDMI. Pulsa «▶ Probar» en una «Lista para revisar». | Pantalla de título y reproducción con voz guía; el sonido sale por donde hayas elegido. Se abre en la pantalla principal (no en la otra: «Probar» no es una sesión). | ☐ |
| 7.2 | Abre «Abrir en otra pantalla…» y empieza una sesión con otra canción Lista; mira la tarjeta de «Lista para revisar». | «Probar» queda desactivado con su motivo y «Revisar» muestra el candado y `edi.bloqueo`. | ☐ |

### 8. Álbum desde LRCLIB y aviso de búsqueda (F6-N7, F6-N8)

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 8.1 | **Añadir canción**: con la casilla marcada, mira el formulario. | Aviso «Al continuar buscaremos la letra en LRCLIB con estos datos.» y «Cambiar en Ajustes». Desmarcada, no sale. Al volver de Ajustes, lo escrito se conserva. | ☐ |
| 8.2 | Añade un archivo **sin álbum** cuya letra esté en LRCLIB con álbum. | Al terminar, el álbum queda con el de LRCLIB y **Editar datos** muestra «Tomado de LRCLIB» con [Quitar]. | ☐ |
| 8.3 | Pulsa [Quitar] y guarda; después «Preparar» otra vez. | El álbum queda vacío y no se vuelve a rellenar. Título y artista no cambian nunca solos. | ☐ |
| 8.4 | En **Editar datos**, si LRCLIB llama distinto a la canción: «LRCLIB la llama «…», de «…».» | [Usar estos datos] copia título y artista al formulario. | ☐ |

### 9. Calibración con tu biblioteca (decisión de la tarea 0312)

> **Pendiente del usuario.** No se puede hacer en el equipo de pruebas: la biblioteca real no está. **No se marca como cumplido.**

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 9.1 | `cd app && npm run calibrar:encaje -- <carpeta de tu biblioteca>` | Tabla por canción con el veredicto de encaje de sus letras. Guarda la salida. | ☐ |
| 9.2 | `npm run calibrar:encaje -- <carpeta> --variantes` | **La tarea [0371](../../tareas/0371-calibrar-encaje-con-letras-sin-fines.md) sigue pendiente**: si el script no acepta `--variantes`, anótalo y deja este paso. Si lo acepta: compara las letras sin fines con los fines prudentes y decide con el criterio de la [pregunta 0222](../../preguntas/0222-lrc-sin-fines-y-elegir-sola-la-letra-con-huecos-instrumentales.md) si se evalúan con fines prudentes (anótalo en el informe y en el ADR 0025). | ☐ |
| 9.3 | Anota cuántas de tus canciones cayeron en «Elige la letra» en el caso 3.6. | ____ de ____ | ☐ |

### 10. Teclado y lector de pantalla

Criterio: F5-B10, F5-P9.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 10.1 | Solo con teclado: Tab por la bandeja «Pendientes de ti», Intro filtra, Intro de nuevo la quita. | Cada casilla anuncia número y estado («2 listas para revisar»). | ☐ |
| 10.2 | Con VoiceOver / NVDA / Orca, recorre una tarjeta «Lista para revisar». | Anuncia «Lista para revisar», su línea de origen y la de revisión. | ☐ |
| 10.3 | En la vista de progreso, deja que cambie de subpaso. | Se anuncia el paso en curso o su resultado, sin repetirse. El indicador de atención («necesita tu atención») se anuncia en «Elige la letra», «No encontramos la letra» y «Letra pendiente». | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
| | | | |
