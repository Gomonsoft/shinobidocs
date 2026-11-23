# Guía manual · 0.2.2 · Feature 7 · Importación por lotes

- Versión: 0.2.2-alpha.3 · Feature 7
- Specs: [03 · Feature 7](../../ux/03-anadir-cancion.md#022--feature-7--importación-por-lotes) · [04 · Feature 7](../../ux/04-progreso-pipeline.md#022--feature-7--cola-de-preparación-de-un-lote) · [02 · Feature 7](../../ux/02-biblioteca.md#022--feature-7--lotes-en-la-biblioteca) · ADR: [0026](../../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md)
- Informe de QA: [informe-feature-7](../../versiones/0.2.2/informe-feature-7.md)
- Duración estimada: 90 min (más lo que tarden las descargas y las separaciones de verdad)
- Requisitos: un equipo con el motor de audio instalado y los modelos descargados; conexión a internet; un álbum **real y pequeño** (8 a 12 canciones) en YouTube Music (con enlace `music.youtube.com/playlist?list=OLAK5uy_…`); una carpeta **real** con subcarpetas, audios mezclados con imágenes y algún archivo que no sea de audio; opcional: un monitor de red (Little Snitch, Wireshark, el monitor de actividad del router) y un lector de pantalla (VoiceOver, NVDA o Orca).

> **Decisión legal provisional, pendiente de ti (pregunta [0159](../../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md), fila de las listas de YouTube).** La versión permite leer y descargar **listas** de YouTube (hasta 50 vídeos, de uno en uno, con 3 a 8 s de pausa) y pide un aviso propio la primera vez. Aumenta la exposición a las condiciones de servicio de YouTube y a los bloqueos (ADR 0003, ADR 0026 §3). No se publica ninguna versión con listas hasta que lo confirmes o lo quites. Anota abajo tu decisión.

## Preparación

1. Crea un usuario o un directorio de datos de prueba (`SHINOBI_DATOS=<carpeta temporal>` si arrancas desde el código) para no mezclar con tu biblioteca real.
2. En Ajustes, deja «Buscar la letra automáticamente» **activada** salvo en el caso 5, que la necesita apagada.
3. Apunta la hora de cada paso donde la tabla pida un tiempo.

## Casos

### 1. Un álbum real de YouTube Music

Criterios: F7-N3, N5, N6, N7, N9, N10, N16 · F7-P1, P6 · «Hecha cuando».

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Añadir canción → Enlaces de YouTube → pega el enlace del álbum → Buscar. Cuenta los segundos hasta ver la tabla | «Consultando la lista…» y la tabla con todas las canciones en pocos segundos; **no aparece «Completando los datos…»** y no se descarga nada | ☐ |
| 1.2 | Primera vez que pegas una lista: mira el aviso | Un aviso con el punto sobre listas, **aunque ya hubieras aceptado el de YouTube**. Al aceptar no se vuelve a pedir; la tabla enseña «Recuerda: descarga solo contenido que tengas derecho a descargar» con «Leer el aviso» | ☐ |
| 1.3 | Revisa título, artista y álbum de cada fila | El álbum de la lista aparece como álbum de todas con el aviso único. Anota **cuántas celdas hay que corregir** antes de pulsar «Añadir» (objetivo: pocas) | ☐ |
| 1.4 | Compara el resumen «N canciones · unos X GB · unos Y minutos en tu equipo» con la realidad al terminar | Anota el tamaño y el tiempo estimados y los reales. El tamaño debe estar en el orden de magnitud; el tiempo, en ± 50 % | ☐ |
| 1.5 | Pulsa «Descargar y añadir N canciones» | Vuelves a la Biblioteca con las tarjetas nuevas, el foco en la primera y el aviso con [Ver actividad]. El botón superior dice «Preparando i de N» | ☐ |
| 1.6 | Cronometra el inicio de dos descargas seguidas (en el panel de actividad) | Entre una descarga y la siguiente hay **de 3 a 8 s** de pausa. Las descargas son de una en una | ☐ |
| 1.7 | Cuando termine: cuenta cuántas canciones están en «Lista para revisar» sin haber tocado nada | Anota el recuento. Las que no lleguen quedan en «Elige la letra» o «No encontramos la letra» (es lo esperado con letras de LRCLIB sin fines) | ☐ |
| 1.8 | Los datos de cada canción tras descargar | Si YouTube Music trae pista, artista y álbum propios, los usa **salvo lo que cambiaste a mano en la tabla**. Anota las que cambian y si son correctas | ☐ |
| 1.9 | Vuelve a pegar el mismo enlace | Todas las canciones salen **desmarcadas** con «Ya está en tu biblioteca». Se pueden marcar a mano | ☐ |
| 1.10 | Pega el enlace de un vídeo que pertenezca a una lista | Se abre el flujo de una canción con «Este vídeo está en una lista» y [Añadir la lista entera]. La lista no se consulta hasta pulsar | ☐ |
| 1.11 | Pega una mezcla automática (lista que empieza por `RD…`), un canal (`/@…`) y un directo | Mensaje claro «no se puede añadir» para cada uno, sin tabla | ☐ |

### 2. Una carpeta real con subcarpetas

Criterios: F7-N1, N2, N6, N7, N9, N17.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Añadir canción → «Elegir carpeta…» y elige tu carpeta real (con 2 niveles de subcarpetas, imágenes y algún `.txt`) | L1 «Leyendo los archivos…» y la tabla con «De la carpeta «<nombre>» · N archivos». Las imágenes y lo que no es audio no aparecen y se avisa de cuántos se han ignorado | ☐ |
| 2.2 | Comprueba el álbum de las filas | Si los archivos traen etiqueta de álbum, la usan; si no, sale el **nombre de la carpeta** | ☐ |
| 2.3 | Incluye un archivo de audio roto (renómbrale un `.txt` a `.mp3`) y uno de menos de 10 s | Filas sin casilla: «No podemos leer este archivo» y «Dura menos de 10 segundos»; no cuentan en el resumen | ☐ |
| 2.4 | Arrastra la carpeta directamente sobre la ventana | Aparece el velo «Suelta para añadir las canciones de la carpeta» y, al soltar, la tabla | ☐ |
| 2.5 | Arrastra 3 archivos sueltos | Velo «Suelta para añadir 3 canciones» y la tabla con 3 filas; **no** sale «Añade las canciones de una en una» | ☐ |
| 2.6 | Una carpeta con más de 50 audios (o duplica archivos hasta llegar a 60) | Las 50 primeras marcadas, el aviso del límite y no deja marcar la 51. Repite la misma carpeta tras añadirlas: se marcan las que faltan | ☐ |
| 2.7 | Una carpeta con más de 500 audios (si la tienes) | Aviso «Hay más de 500 archivos de audio…» y solo 500 filas | ☐ |
| 2.8 | Añade una carpeta cuyos archivos ya estén en la biblioteca | Filas desmarcadas con «Ya está en tu biblioteca» (mismo nombre y duración, o mismo título y artista) | ☐ |

### 3. Pausa, cancelar y cerrar con la cola en marcha

Criterios: F7-P1, P2, P3, P4, P8, P10, P11.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Con un lote en marcha, abre «Actividad» y pulsa «Pausar» a mitad de una separación | La canción en curso **termina su paso** y no empieza ninguna más. El botón dice «Reanudar» y el superior «En pausa · faltan m». Reanuda y continúa en el mismo orden | ☐ |
| 3.2 | Pausa, cierra la app (confirma) y vuelve a abrirla | Sigue **en pausa** | ☐ |
| 3.3 | Con la cola en marcha, cierra la app | El diálogo dice «Faltan N canciones por preparar… seguirán solas la próxima vez». Al reabrir, la tanda se retoma sola y el resumen final cuenta **todas** las canciones | ☐ |
| 3.4 | «Cancelar lo que falta…» | Pide confirmación con el foco en «Seguir preparando». Al confirmar, lo no terminado queda como borrador con su «Falta…» y lo terminado no cambia | ☐ |
| 3.5 | Añade un segundo lote con el primero en marcha | Se pone detrás; el total sube y la barra **no retrocede** | ☐ |
| 3.6 | Abre el reproductor en otra pantalla con una canción sonando y deja la cola trabajando | Aparece la nota «Si notas cortes en el sonido, pausa la cola». **Anota si hay cortes de sonido** | ☐ |
| 3.7 | Al terminar la tanda | **Un solo** aviso «Preparación terminada» con [Ver resultado] (ningún aviso por canción). [Ver en la biblioteca] abre la bandeja «Listas para revisar» (o «Todas» si no hay) | ☐ |

### 4. Parada por bloqueo y sin conexión

Criterios: F7-P5. Con red real es difícil provocar un bloqueo a voluntad: usa una lista larga (30 a 50 vídeos) solo si estás dispuesto a que YouTube te limite durante un tiempo.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Si YouTube bloquea (error de «no eres un robot») | Se **paran solo las descargas** pendientes con «YouTube no permite descargas ahora mismo…»; las separaciones en cola siguen. Botón «Reintentar las descargas» | ☐ |
| 4.2 | A mitad de una descarga, apaga el wifi | Las descargas se paran con «Sin conexión a internet…» y se reanudan solas al volver | ☐ |
| 4.3 | Llena el disco hasta que casi no quede espacio (o usa un disco pequeño) y añade un lote | La tabla avisa «No hay espacio para todas» antes de pulsar y bloquea el botón; si pasa durante el proceso, para **toda** la cola con su aviso | ☐ |

### 5. Privacidad y red

Criterios: privacidad de ADR 0025 y 0026.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Apaga «Buscar la letra automáticamente», abre el monitor de red y añade un lote de carpeta | **Ninguna** conexión a `lrclib.net`. Las canciones terminan como «Falta la letra» | ☐ |
| 5.2 | Lo mismo con un lote de lista de YouTube | Solo conexiones a YouTube (y, sin conexión durante más de un minuto, una comprobación `HEAD` a LRCLIB: pregunta [0243](../../preguntas/0243-comprobacion-de-conexion-contra-lrclib-con-el-interruptor-apagado.md); anótala si la ves) | ☐ |
| 5.3 | Pega la lista y mira el monitor mientras se ve la tabla | Una sola petición de la lista y **ninguna por vídeo**. Las consultas de cada vídeo ocurren al descargarlo | ☐ |

### 6. Lector de pantalla y teclado

Criterios: F7-N13, F7-P9.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Recorre la tabla con Tab, ↑/↓, Espacio y Ctrl/Cmd + Intro | Cada campo se anuncia con su columna y su fila («Título de «…»»). Esc cancela con la confirmación | ☐ |
| 6.2 | Marca y desmarca filas | El resumen se anuncia (a lo sumo cada 500 ms) | ☐ |
| 6.3 | Con la cola en marcha | El progreso se anuncia como mucho cada 10 s; la pausa, las paradas y el final se anuncian siempre | ☐ |
| 6.4 | A 1024 × 640 | Sin scroll horizontal; el resumen y los botones siguen visibles | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
| | | | |

## Decisión pendiente del usuario

- [ ] Listas de YouTube: **permitir** (como está) / **quitar** (volver a rechazarlas, ADR 0003) / **permitir con otro límite**: _______ (fecha: ______).
