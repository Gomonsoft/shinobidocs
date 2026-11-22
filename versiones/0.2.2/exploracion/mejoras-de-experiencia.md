# Exploración 0.2.2 · Mejoras de experiencia por feature

- Autor: diseñador UX (exploración, 2026-11-21)
- Estado: **exploración**. Nada de este documento está autorizado. Cada propuesta tiene su archivo en [`docs/propuestas/`](../../../propuestas/README.md) (019 a 035) para que el usuario la apruebe, la aplace o la descarte una a una.
- Fuera de este documento: la letra en pantalla con varios enunciados, enunciado pasado y transiciones (propuesta 018, otro diseñador).
- Base leída: [visión y alcance](../../../00-vision-y-alcance.md), [pipeline](../../../01-pipeline.md), planes [0.2.0](../../0.2.0/plan-2.md), [0.2.1](../../0.2.1/plan-3.md) y [0.2.2](../plan-4.md), specs `docs/ux/` 00 a 10 y sistema visual, [feedback de alpha.1](../../0.2.0/feedback-alpha-1.md), [informe de QA en Windows](../../../Test-manuales/0.2.0/ejecucion-2026-11-21-windows.md), ADR 0003, 0004, 0005 y 0021, y propuestas 001 a 017.

## 1. Resumen en una página

El criterio del plan es automatizar al máximo. Los datos de uso dicen dónde está hoy el trabajo manual:

1. **La máquina ya no es el cuello de botella; lo es la persona.** Separar una canción tarda 28 s de media en el equipo del usuario. Terminar una canción le llevó entre 2 y 56 minutos de editor.
2. **El pipeline se para en «Letra» y espera a que alguien entre.** 5 de las 17 canciones llevan 11 días como borrador con las pistas ya separadas y sin que la búsqueda de letra se haya lanzado nunca.
3. **Las canciones se añaden de una en una.** 9 canciones del mismo álbum se añadieron a mano en 5 minutos y medio, enlace a enlace. La app rechaza las listas de YouTube y varios archivos a la vez.
4. **El trabajo fino es el fin de cada línea.** En las 8 canciones sin tiempos por palabra hay 138 fines fijados de 314 líneas, y las otras 176 siguen con el fin automático. «Ajustar los silencios» acierta con un error medio de 0,44 a 0,59 s según QA.
5. **No hay red de seguridad para ese trabajo.** No existe copia de seguridad, ni exportación de la letra sincronizada, ni aviso de versión nueva.

De ahí salen las cuatro propuestas principales: preparación desatendida (020), importación por lotes (021), comprobación automática de la letra contra el audio (022) y sincronía automática por alineación forzada (019). El resto mejora piezas concretas. La [tabla resumen](#5-tabla-resumen-de-propuestas) las ordena por recomendación.

## 2. Lo que dicen los datos de uso

Fuente: `cancion.json` de la biblioteca real y `config.json`, en solo lectura. Solo se anotan cifras; ninguna letra se ha copiado.

**Nota sobre el recuento.** En disco hay **17** carpetas con `cancion.json`: 12 «Lista» (2 de ellas «Letra lista») y **5** borradores sin letra. El encargo hablaba de 18 canciones y 7 borradores; uso lo que hay en disco hoy.

### 2.1 Biblioteca

| Dato | Valor |
|---|---|
| Canciones | 17: 12 Lista (2 en modo Letra lista), 5 Borrador |
| Origen del audio | 17 de 17 de YouTube, 0 de archivo |
| Artistas | 15 del mismo artista, 2 de otros |
| Álbum | 17 de 17 con álbum; 13 comparten el mismo álbum |
| Modelo de separación | 17 de 17 con «Calidad», en GPU |
| Tiempo de separación | 21,9 a 38,9 s (media 28,2 s) para canciones de 3:12 a 4:40; factor medido 0,128 |
| Origen de la letra | 12 de 12 de LRCLIB; 0 pegadas, 0 de archivo |
| `offset_ms` | 0 en las 12 |
| Apariencia | 13 siguen el tema de su álbum, 3 con tema personalizado, 1 hereda |
| Indicadores de espera propios | 6 canciones; puntos en las 6, cuenta 3·2·1 en 5, **barra en ninguna**; silencio mínimo siempre 4,0 s |
| Agrupación de la Biblioteca | Por artista |

### 2.2 El lote del 10 de noviembre

Entre las 06:21:06 y las 06:26:44 (hora UTC del archivo) se crearon 9 canciones del mismo álbum, una cada 15 a 40 segundos. Las 9 se separaron solas en cola. Once días después:

| Resultado | Canciones |
|---|---|
| Borrador sin letra, sin tocar desde que acabó la separación (`pasos.letra` pendiente y sin fecha) | 5 |
| Terminadas el 21 de noviembre | 3 |
| Terminada el mismo día 10 | 1 |

La búsqueda de letra solo se lanza al entrar en la vista Letra ([05](../../../ux/05-letra.md), criterio 1). Nadie entró, así que esas 5 canciones no tienen ni candidatos.

### 2.3 Líneas y fines

Canciones sin tiempos por palabra importados (8 de las 12 con letra):

| Canción | Líneas | Fin fijado | Fin automático |
|---|---:|---:|---:|
| Arrópame | 28 | 26 | 2 |
| A Pesar de Mí | 31 | 30 | 1 |
| ¿Y Ahora Qué? | 48 | 33 | 15 |
| Tragedia Termina | 53 | 22 | 31 |
| Dedos Rotos y Funerales | 39 | 21 | 18 |
| Especial de Medianoche (Letra lista) | 30 | 4 | 26 |
| Semestre de Otoño | 43 | 1 | 42 |
| Cursiva la Letra | 42 | 1 | 41 |
| **Total** | **314** | **138** | **176** |

- Un fin fijado puede venir de la mano del usuario, de «Ajustar los silencios» o de la propia letra de LRCLIB. No se distingue en el archivo. El informe de QA trata como hechos a mano los de A Pesar de Mí y Arrópame, y como resultado de «Ajustar los silencios» los 21 de Dedos Rotos.
- Las otras 4 canciones (Final Ruin, Valiente, Sinmigo, Assassins Creed Unity) conservan tiempos por palabra importados que 0.2.1 ya no pinta.
- Ninguna línea está sin inicio: LRCLIB trajo todos los inicios. El modo «Sincronizar al ritmo» no dejó rastro en estos datos.

### 2.4 Tiempo entre crear y la última modificación

Orientativo: `modificada` cambia con cualquier edición posterior.

| Canción | Tiempo | Observación |
|---|---|---|
| Assassins Creed Unity | 38 s | Directa a «Letra lista» |
| Semestre de Otoño | 2 min | 1 fin fijado |
| Arrópame | 9 min | 26 fines fijados |
| Valiente | 17 min | — |
| Cursiva la Letra | 29 min | 1 fin fijado |
| Final Ruin | 56 min | Canción del feedback de alpha.1 |

### 2.5 Reproductor y exportación (`config.json`)

- Voz guía al **100 %** y sin silenciar; volumen general al 28 %. El valor de fábrica es 30 % y silenciada ([07](../../../ux/07-reproductor.md)).
- Hay una segunda pantalla recordada para la sesión, a pantalla completa. Cuenta entre canciones: 4 s.
- Última exportación: WebM, 1280 × 720, 30 FPS, «Instrumental y voz», carpeta Videos.
- Tema predeterminado personalizado (degradado y fuente propios).

## 3. Recorrido por feature

Cada apartado: fricción de hoy con su evidencia, qué hacen los referentes y qué se propone. Las fuentes están en la [sección 8](#8-fuentes).

### 3.1 Descarga, instalación y actualizaciones

**Fricción.**
- No hay autoactualización ni aviso de versión nueva: las [notas de 0.2.1-alpha.1](../../0.2.1/notas/0.2.1-alpha.1.md) lo dicen en «Sin probar». La [pregunta 0037](../../../preguntas/0037-autoactualizacion-de-la-app.md) sigue abierta con tres opciones.
- El 21 de noviembre coincidieron tres versiones: 0.2.0-alpha.1 en prueba, alpha.2 lista para publicar y las notas de 0.2.1-alpha.1 en borrador. Quien prueba tiene que enterarse por fuera y reinstalar a mano cada una.
- Chrome marca la descarga como peligrosa por falta de firma (feedback §1.3). Sigue su camino propio (D1) y no se repite aquí.

**Referentes.** Las apps de escritorio sin firma suelen limitarse a avisar y enlazar a la descarga. La autoactualización real exige firma en macOS (ya analizado en la 0037).

**Propuesta.** [026 · Aviso de versión nueva](../../../propuestas/026-aviso-de-version-nueva.md): la opción B de la 0037, con interruptor.

### 3.2 Primer arranque e instalación del motor

**Fricción.**
- Sin evidencia de problemas en el equipo del usuario: instalación completa con perfil `cuda`.
- El registro repite 17 veces el aviso `CUDAExecutionProvider not available` (feedback §1.6). Los tiempos dicen que la GPU sí se usa, pero la app no lo muestra en ningún sitio.
- QA no pudo probar la instalación empaquetada ni equipos modestos.

**Propuesta.** Sin propuesta propia para el primer arranque: no hay evidencia de fricción. El estado del motor (dispositivo realmente usado, última separación) entra en [035 · Ajustes: almacenamiento y estado del motor](../../../propuestas/035-ajustes-almacenamiento-y-estado-del-motor.md).

### 3.3 Añadir canción

**Fricción.**
- Una canción cada vez. Soltar varios archivos usa el primero y dice «Añade las canciones de una en una.» ([03](../../../ux/03-anadir-cancion.md), criterio 3). Una lista de YouTube da el error «Las listas y los directos no se pueden usar.»
- El lote del 10 de noviembre (§2.2) muestra a una persona haciendo de cola: 9 veces pegar enlace, revisar datos y pulsar «Descargar y continuar».
- Los datos de la canción dependen de una heurística que, según el [ADR 0003](../../../adr/0003-fuente-de-audio.md), «fallará a menudo». El álbum no se rellena salvo en videos de YouTube Music, y sin embargo las 17 canciones lo tienen y 13 dependen de él para su tema.

**Referentes.**
- yt-dlp acepta listas y álbumes; con `--flat-playlist` devuelve las entradas sin descargarlas, aunque puede faltar parte de los metadatos.
- karaoke-gen (nomadkaraoke, los autores de `audio-separator`) encadena descarga, separación, letra, sincronía y render sin intervención hasta un paso de revisión humana.
- Youka crea el karaoke desde una URL y organiza la colección con listas y etiquetas. No encontré importación por lotes documentada.

**Propuestas.**
- [021 · Importación por lotes](../../../propuestas/021-importacion-por-lotes.md): varios archivos, una carpeta, varios enlaces o una lista de YouTube, con tabla de revisión y cola desatendida.
- [024 · Datos de la canción automáticos](../../../propuestas/024-datos-de-la-cancion-automaticos.md): título, artista y álbum propuestos con más fuentes, para que la tabla del lote casi no haya que tocarla.

### 3.4 Progreso del pipeline y actividad

**Fricción.**
- La vista de progreso invita a «Buscar la letra mientras tanto». Es un buen consejo para una separación de 5 minutos. Con 28 s de media, el usuario vuelve a la Biblioteca y la canción se queda en «Falta la letra».
- El pipeline automático termina en la separación. Letra, comprobación, fines y tema por defecto esperan a una persona aunque podrían hacerse solos.
- Cerrar la app con trabajos en cola los deja «Interrumpido» y hay que reintentar uno a uno ([04](../../../ux/04-progreso-pipeline.md) §3). Con lotes grandes eso pesa.

**Referentes.** karaoke-gen: todo el proceso corre solo y la persona solo entra en la revisión de la letra.

**Propuesta.** [020 · Preparación desatendida](../../../propuestas/020-preparacion-desatendida.md): tras la fuente, la app busca la letra, la comprueba contra la voz, ajusta los fines y deja la canción en «Lista para revisar». Incluye reanudar la cola al reabrir.

### 3.5 Letra: búsqueda, pegar y edición

**Fricción.**
- La búsqueda es manual por diseño y el usuario elige entre candidatos mirando la duración y una vista previa de 15 líneas. La app no escucha el audio para ayudar: una letra de otra versión se descubre cantando.
- El desplazamiento global se retiró en 0.2.1 porque nadie lo usó (`offset_ms` 0 en todas). El caso que cubría, una letra entera adelantada o atrasada, sigue existiendo y hoy se corrige línea a línea.
- La letra pegada exige borrar a mano «[Estribillo]» y «(x2)» ([05](../../../ux/05-letra.md) §6) y luego sincronizar todas las líneas al ritmo. En los datos nadie pegó una letra: el camino manual cuesta tanto que no se usa, o no hizo falta. No se puede saber cuál de las dos.
- LRCLIB es la única fuente. Si no tiene la canción, el usuario se queda con el camino manual completo.

**Referentes.**
- UltraSinger (MIT) genera archivos UltraStar desde el audio: separa la voz, transcribe con Whisper, alinea y detecta idioma y tono. Un cambio propuesto en ese proyecto parte de letras sincronizadas de LRCLIB y las afina con alineación forzada, que es justo el caso de Shinobi.
- python-lyrics-transcriber (nomadkaraoke) combina la transcripción de Whisper con letras de internet para corregirla y pasa después por revisión humana.
- Youka recomienda pegar la letra limpia para obtener la mejor alineación.

**Propuestas.**
- [022 · Comprobar la letra contra el audio y corregir el desfase](../../../propuestas/022-comprobar-la-letra-contra-el-audio.md): puntuación de coincidencia por candidato, elección automática y corrección del desfase global sin controles manuales.
- [029 · Letra pegada lista para alinear](../../../propuestas/029-letra-pegada-lista-para-alinear.md): limpieza asistida de renglones que no se cantan, idioma y estribillos repetidos. Solo tiene sentido completo junto con la 019.

### 3.6 Editor: sincronía, línea de tiempo y ajustar silencios

**Fricción.**
- Los inicios vienen de LRCLIB; lo que el usuario trabaja son los fines (§2.3). El fin decide cuándo acaba el barrido, cuándo desaparece la línea y dónde salen los indicadores de espera.
- «Ajustar los silencios» es la única automatización. QA midió un error medio de 438 a 590 ms y un máximo de 4,7 s con los parámetros actuales, y concluyó que la calibración no es concluyente con tan pocas canciones.
- Tras aplicar una letra o ajustar silencios, nada le dice al usuario qué líneas merece la pena mirar. O se fía, o repasa la canción entera (56 minutos en Final Ruin).
- «Sincronizar al ritmo» marca solo inicios. El fin de cada línea queda automático y hay que volver sobre él.

**Referentes.**
- Aegisub: forma de onda o espectrograma para ver dónde empieza y acaba cada línea, y modo karaoke en dos pasadas (palabras primero, sílabas después).
- WhisperX (BSD-2-Clause): alineación forzada con modelos wav2vec2 por idioma para obtener tiempos por palabra. Sus límites declarados: palabras con cifras o símbolos y voces solapadas.
- Investigación en alineación de letra cantada: los mejores sistemas rondan 0,2 a 0,4 s de error medio en el conjunto Jamendo, también sobre voz separada. No es magia, pero está en el rango de «Ajustar los silencios» o mejor, y además da tiempos por palabra.

**Propuestas.**
- [019 · Sincronía automática por alineación forzada](../../../propuestas/019-sincronia-automatica-por-alineacion-forzada.md): fines y palabras calculados sobre la voz separada, primero dentro de las líneas que ya tienen inicio y después para letras sin tiempos.
- [023 · Revisión guiada de líneas dudosas](../../../propuestas/023-revision-guiada-de-lineas-dudosas.md): la app señala las líneas sospechosas y las recorre una a una.
- [027 · Marcar inicio y fin al ritmo manteniendo la tecla](../../../propuestas/027-marcar-inicio-y-fin-al-ritmo.md): el gesto que ya existe en el editor preciso, aplicado a las líneas.
- Reactivar [016 · Ajustar el fin de una sola línea con la voz](../../../propuestas/016-ajustar-el-fin-de-una-linea-con-la-voz.md) (tamaño S): es el atajo barato mientras llega la 019. La [003](../../../propuestas/003-calibrar-el-ajuste-de-silencios-por-cancion.md) debe esperar a la prueba técnica de la 019, que usa el mismo banco de medida.

### 3.7 Editor preciso de línea

**Fricción.**
- Es trabajo palabra a palabra, línea a línea. Una canción tiene entre 28 y 101 líneas. Las notas de 0.2.1 reconocen que no se ha probado con canciones reales a oído.
- Los tiempos por palabra importados se retiraron porque dejaban de coincidir al corregir el fin de la línea (feedback §1.4). Cualquier automatismo de palabras tiene que evitar ese mismo fallo.

**Referentes.** Aegisub separa sílabas a mano; WhisperX y UltraSinger las obtienen por alineación.

**Propuesta.** La 019 rellena las palabras y el editor preciso queda para corregir. Regla necesaria: unas palabras automáticas se recalculan o se descartan cuando cambian los límites de su línea, nunca se quedan desfasadas.

### 3.8 Estilo, temas e indicadores de espera

**Fricción.**
- Los temas funcionan: 13 de 17 canciones siguen el tema de su álbum. Es la parte del flujo que ya está automatizada.
- La barra de espera no se usa en ninguna canción; 0.2.1 la acaba de rediseñar. Conviene esperar a ver si el rediseño cambia eso antes de tocarla.
- El contraste se avisa en el editor, pero el resaltado depende solo del color. Una persona con daltonismo puede no distinguir la parte cantada si los dos colores tienen luminosidad parecida.

**Propuesta.** [033 · Legibilidad y resaltado que no dependa solo del color](../../../propuestas/033-legibilidad-y-resaltado-accesible.md), coordinada con la 018. Sin propuesta para temas: no hay fricción medida. La [015](../../../propuestas/015-comodin-de-espera-hueco-a-hueco.md) sigue como está.

### 3.9 Pestaña «Funciones»

**Fricción.** Recién creada en 0.2.1 y sin uso real todavía. Es el sitio natural para las acciones automáticas nuevas («Comprobar la letra», «Sincronizar con la voz», «Revisar»), que hoy no existen.

**Propuesta.** Ninguna propia. Las 019, 022 y 023 la usan como punto de entrada.

### 3.10 Biblioteca: agrupación, búsqueda, selección múltiple

**Fricción.**
- La selección múltiple solo sirve para «Aplicar tema…» ([02](../../../ux/02-biblioteca.md), fase 3). No se puede eliminar, exportar, añadir a la cola ni buscar la letra de varias a la vez.
- Los 5 borradores abandonados no destacan: son tarjetas «Falta la letra» mezcladas con el resto.
- Cada canción ocupa unos 100 MB (texto de `add.error.SIN_ESPACIO`). No hay forma de ver cuánto ocupa la biblioteca ni de recuperar espacio.

**Referentes.** Karaoke Mugen y Youka organizan por listas y etiquetas. Los gestores de biblioteca musical ofrecen acciones por lotes sobre la selección.

**Propuestas.**
- [028 · Acciones por lotes en la Biblioteca](../../../propuestas/028-acciones-por-lotes-en-la-biblioteca.md): la barra de selección gana «Preparar», «A la cola», «Exportar video…» (reactiva la [006](../../../propuestas/006-exportar-varias-canciones-a-video.md)), «Editar datos» y «Eliminar…».
- [025 · Copia de seguridad, paquete de canción y exportar la letra](../../../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md).

### 3.11 Reproductor y voz guía

**Fricción.**
- La voz guía está al 100 %: el usuario canta con la voz original entera. Coros y voz principal salen juntos en la pista de voz, sin control separado.
- No se puede cambiar el tono ni el tempo. Para quien no llega a las notas de la canción original, es la diferencia entre poder cantarla o no.
- No se pueden saltar la introducción ni los solos largos. Con la primera línea a 18 s (A Pesar de Mí), la espera es de la canción, y el reproductor solo ofrece ±5 y ±10 s.
- No hay forma de ensayar una estrofa en bucle fuera del editor.

**Referentes.**
- KaraFun: cambio de tono de ±6 semitonos y de tempo, guardables por canción; volumen de voz principal y de coros por separado.
- Apple Music Sing: control deslizante de voz, coros animados aparte de la voz principal y vista de dúo.
- UltraStar Deluxe, Vocaluxe y Performous: puntuación de afinación con micrófono. Queda fuera de la visión («Puntuación de afinación, micrófono, efectos de voz»).

**Propuestas.**
- [030 · Tono y tempo](../../../propuestas/030-tono-y-tempo.md).
- [032 · Saltar la introducción y los silencios largos, y ensayar una estrofa](../../../propuestas/032-saltar-intro-y-ensayar-estrofa.md).
- Separar voz principal y coros: en la tabla como «solo si…», sin archivo propio, porque depende de un modelo cuya licencia no pude verificar (§4).
- Las [001](../../../propuestas/001-volumen-y-voz-guia-desde-el-panel-de-cola.md), [002](../../../propuestas/002-selector-de-dispositivo-de-audio.md) y [004](../../../propuestas/004-voz-guia-durante-la-cuenta-y-la-espera.md) siguen vigentes. Con la voz guía al 100 % en el uso real, la 001 y la 004 ganan peso.

### 3.12 Cola y segunda pantalla

**Fricción.**
- La cola vive en memoria y se pierde al salir (decisión 0049; propuesta [005](../../../propuestas/005-cola-persistente-entre-sesiones.md) en «Idea»).
- No hay listas guardadas: cada noche se rehace la cola a mano.
- La cola no sabe quién canta. La pantalla del público dice «A continuación» y el título, sin nombre.
- Todo se maneja desde el ordenador principal.
- QA no pudo probar nada con dos pantallas reales.

**Referentes.**
- Karaoke Eternal: los invitados escanean un QR y añaden canciones desde el navegador del móvil; salas con cola propia.
- Karaoke Mugen: lista pública a la que los invitados envían canciones, con modos restringido y cerrado.
- KaraFun: mando desde el móvil y nombre del cantante en cada entrada.

**Propuestas.**
- [031 · Listas guardadas y cola que no se pierde](../../../propuestas/031-listas-guardadas-y-cola-que-no-se-pierde.md): amplía la 005.
- [034 · Cantantes en la cola y mando desde el móvil](../../../propuestas/034-cantantes-en-la-cola-y-mando-desde-el-movil.md): dos etapas de tamaño muy distinto.

### 3.13 Exportación a video

**Fricción.**
- Los fallos graves de alpha.1 se corrigieron en alpha.2 y 0.2.1 (tamaño de captura, sondeo de perfiles, estimación de tamaño).
- Sigue siendo una canción cada vez: abrir el diálogo, confirmar opciones y destino por cada una (propuesta 006).
- El video es la única forma de sacar el trabajo de la app. La letra sincronizada no se puede exportar: el [ADR 0005](../../../adr/0005-letras-y-formato-de-sincronia.md) dice que la conversión a LRC «sigue sin interfaz».
- MKV y WebM no se abren en QuickTime ni en muchos televisores (propuesta [008](../../../propuestas/008-formato-de-video-de-maxima-compatibilidad.md), decisión del usuario).

**Propuestas.** La exportación por lotes entra por la 028 (reactiva la 006). La exportación de la letra, por la 025. Plantillas y preajustes de video: descartados (§6). La [007](../../../propuestas/007-codificacion-de-video-por-hardware.md) gana valor si se aprueban los lotes.

### 3.14 Ajustes y Acerca de

**Fricción.**
- Ajustes solo informa del modelo, gestiona los temas y la cuenta entre canciones. No hay nada sobre almacenamiento, privacidad de red ni automatismos.
- La mezcla original se conserva junto a las dos pistas separadas ([ADR 0004](../../../adr/0004-separacion-voz-instrumental.md)); en una canción terminada solo sirve para volver a separar.

**Propuesta.** [035 · Ajustes: almacenamiento y estado del motor](../../../propuestas/035-ajustes-almacenamiento-y-estado-del-motor.md). Los interruptores de la 020 y la 026 también viven en Ajustes.

### 3.15 Accesibilidad

**Fricción.**
- La app cuida el teclado, el foco y el contraste de la interfaz en todas las specs. El hueco está en la letra cantada: resaltado solo por color, tamaño fijo al 7,5 % del alto y sombra fija.
- Las notas de versión listan como «sin probar» los lectores de pantalla en la exportación y en la cola.

**Propuesta.** La 033. El tamaño de letra y el número de enunciados son de la 018.

## 4. Tecnologías y licencias

El proyecto es GPL-3.0-or-later y el [ADR 0002](../../../adr/0002-licencia-del-proyecto.md) excluye pesos «solo investigación» o no comerciales. Lo comprobado en esta exploración:

| Tecnología | Para qué | Licencia | Veredicto |
|---|---|---|---|
| WhisperX | Alineación forzada por palabra | Código BSD-2-Clause (comprobado en el repositorio) | Compatible. Los modelos de alineación van aparte |
| `jonatasgrosman/wav2vec2-large-xlsr-53-spanish` | Modelo de alineación en español | Apache-2.0 (ficha del modelo) | Compatible |
| Paquetes VoxPopuli de torchaudio (`VOXPOPULI_ASR_BASE_10K_ES` y similares) | Modelo por defecto de WhisperX para es, fr, de, it | **CC BY-NC 4.0** (documentación de torchaudio) | **No usar**: no comercial |
| `MMS_FA` de torchaudio | Alineador multilingüe (1 130 idiomas) | **CC BY-NC 4.0** | **No usar** |
| stable-ts | Alinear texto plano con Whisper | MIT; repositorio **archivado** el 30 de mayo de 2026 | Compatible pero sin mantenimiento |
| Montreal Forced Aligner | Alineación clásica (Kaldi) | MIT; modelo acústico español CC BY 4.0 | Compatible, pero se instala con conda y Kaldi: no encaja en el runtime con `uv` |
| aeneas | Alineación por síntesis de voz | AGPL-3.0; su README dice «not suitable for song captioning»; última versión de 2017 | Descartado |
| UltraSinger | Referente de pipeline (no dependencia) | MIT | Solo como referencia de diseño |
| Rubber Band | Cambio de tono y tempo | GPL-2.0-or-later | Compatible con GPL-3.0 |
| signalsmith-stretch | Cambio de tono y tempo | MIT | Compatible |
| `mel_band_roformer_karaoke_aufr33_viperx` | Separar voz principal y coros | Sin licencia declarada por los autores en lo consultado | Bloqueado hasta verificarla, como en la pregunta 0012 |
| LRCLIB `publish` | Devolver letras sincronizadas a la comunidad | API abierta, sin términos sobre los textos | Descartado (§6) |

Sin comprobar en esta sesión y pendientes del arquitecto: la licencia del modelo inglés que usa WhisperX por defecto, el tamaño en disco de cada modelo de alineación (los wav2vec2 «large» rondan 1,2 GB, cifra de memoria y no verificada), y las condiciones de uso de MusicBrainz para la 024.

## 5. Tabla resumen de propuestas

Ordenadas por recomendación. Tipo: A automatización, U usabilidad, C calidad, X accesibilidad. Tamaño: S, M, L, XL.

| N.º | Título | Área | Tipo | Valor para el usuario | Tamaño | Riesgos o dependencias | Veredicto |
|---|---|---|---|---|---|---|---|
| [020](../../../propuestas/020-preparacion-desatendida.md) | Preparación desatendida: la canción llega sola a «Lista para revisar» | Pipeline, Letra, Biblioteca | A | Quita la parada en «Letra» que dejó 5 borradores abandonados | M–L | Cambia la regla de privacidad del ADR 0005 (búsqueda sin entrar en la vista); necesita la 022 para elegir bien | **Recomendada para 0.2.2** |
| [022](../../../propuestas/022-comprobar-la-letra-contra-el-audio.md) | Comprobar la letra contra el audio y corregir el desfase | Letra, Editor | A, C | Detecta la letra de otra versión y el desfase global antes de cantar | M | Usa los picos de voz que ya existen; hay que calibrar umbrales con las 12 canciones | **Recomendada para 0.2.2** |
| [021](../../../propuestas/021-importacion-por-lotes.md) | Importación por lotes: archivos, carpeta, enlaces o lista de YouTube | Añadir canción | A | Un álbum entero con una sola acción en vez de 9 | L | Revisión del ADR 0003 (listas) y del aviso legal; espacio en disco; límites de LRCLIB | **Recomendada para 0.2.2** |
| [019](../../../propuestas/019-sincronia-automatica-por-alineacion-forzada.md) | Sincronía automática por alineación forzada sobre la voz separada | Editor, Letra | A, C | Fines y palabras sin trabajo manual; abre el camino a letras sin tiempos | XL (etapa 1: L) | Calidad sobre voz cantada sin medir; modelos por idioma de 1 GB o más; licencias de los modelos; ADR nuevo | **Recomendada para 0.2.2 como prueba técnica y etapa 1**; etapa 2 más adelante |
| [023](../../../propuestas/023-revision-guiada-de-lineas-dudosas.md) | Revisión guiada de líneas dudosas | Editor | U, A | Revisar 5 líneas señaladas en vez de la canción entera | M | Mejor con la confianza de la 019; funciona sin ella con reglas simples | **Recomendada para 0.2.2** |
| [025](../../../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md) | Copia de seguridad, paquete de canción y exportar la letra | Biblioteca, Ajustes | U, C | Protege horas de sincronía; mover canciones entre equipos propios | M | El paquete contiene audio con derechos: solo uso personal; versión del esquema | **Recomendada para 0.2.2** |
| [026](../../../propuestas/026-aviso-de-version-nueva.md) | Aviso de versión nueva | Actualizaciones | U | Enterarse de una versión sin salir de la app | S | Acceso a red nuevo, con interruptor; responde la pregunta 0037 | **Recomendada para 0.2.2** |
| [024](../../../propuestas/024-datos-de-la-cancion-automaticos.md) | Datos de la canción automáticos | Añadir canción | A | Título, artista y álbum correctos sin teclear; condición para que los lotes no den trabajo | S–M | Servicio externo opcional; nombres de campos de yt-dlp por comprobar | Recomendada para 0.2.2 **junto con la 021** |
| [028](../../../propuestas/028-acciones-por-lotes-en-la-biblioteca.md) | Acciones por lotes en la Biblioteca | Biblioteca, Exportación | U, A | Preparar, encolar, exportar o eliminar varias de una vez | M | Reactiva la 006; resultado por canción ya diseñado en «Aplicar tema…» | Recomendada para 0.2.2 (al menos «Preparar» y «Eliminar») |
| [016](../../../propuestas/016-ajustar-el-fin-de-una-linea-con-la-voz.md) | Ajustar el fin de una sola línea con la voz (ya registrada) | Editor | U | Atajo barato para el trabajo más repetido | S | Ninguno nuevo | **Reactivar** en 0.2.2 si la etapa 1 de la 019 no entra |
| [027](../../../propuestas/027-marcar-inicio-y-fin-al-ritmo.md) | Marcar inicio y fin al ritmo manteniendo la tecla | Editor | U | Una sola pasada deja inicios y fines | S–M | Cambia un gesto existente; latencia al soltar | Solo si la 019 se aplaza |
| [029](../../../propuestas/029-letra-pegada-lista-para-alinear.md) | Letra pegada lista para alinear: limpieza, idioma y estribillos | Letra | A, U | Pegar y listo, sin borrar «[Estribillo]» a mano | S–M | Riesgo de borrar versos reales: siempre con vista previa | Solo si se aprueba la etapa 2 de la 019 |
| [033](../../../propuestas/033-legibilidad-y-resaltado-accesible.md) | Legibilidad y resaltado que no dependa solo del color | Estilo, Reproductor | X | Letra legible con daltonismo y sobre fondos difíciles | S–M | Debe diseñarse con la 018; afecta a editor, reproductor y video | Junto con la 018 |
| [030](../../../propuestas/030-tono-y-tempo.md) | Tono y tempo | Reproductor, Exportación | U | Cantar canciones fuera del registro propio | L | Calidad del cambio de tono; alcance nuevo respecto a la visión | Más adelante (antes si el usuario la prioriza) |
| [031](../../../propuestas/031-listas-guardadas-y-cola-que-no-se-pierde.md) | Listas guardadas y cola que no se pierde | Cola | U | No rehacer la cola en cada evento ni perderla en un cierre | M | Contradice la decisión 0049; amplía la 005 | Más adelante |
| [032](../../../propuestas/032-saltar-intro-y-ensayar-estrofa.md) | Saltar la introducción y los silencios largos, y ensayar una estrofa | Reproductor | U | Menos esperas al probar y al ensayar | S–M | Teclas nuevas en un reproductor ya denso | Más adelante |
| [035](../../../propuestas/035-ajustes-almacenamiento-y-estado-del-motor.md) | Ajustes: almacenamiento y estado del motor | Ajustes | U | Saber cuánto ocupa la biblioteca y recuperar espacio | S–M | Borrar la mezcla impide volver a separar | Más adelante (antes si se aprueban los lotes) |
| [034](../../../propuestas/034-cantantes-en-la-cola-y-mando-desde-el-movil.md) | Cantantes en la cola y mando desde el móvil | Cola, segunda pantalla | U | Eventos con invitados sin pasar por el ordenador | S (nombres) + L (móvil) | Servidor local en la red: revisión del ADR 0008 de seguridad | Más adelante; la parte de nombres puede ir sola |
| — | Voz principal y coros por separado | Separación, Reproductor | C | Guía con solo la voz principal, coros en el instrumental | L | Licencia del modelo sin verificar; segunda pasada de separación | Solo si el arquitecto verifica la licencia |
| [006](../../../propuestas/006-exportar-varias-canciones-a-video.md) | Exportar varias canciones a video (ya registrada) | Exportación | A | Repertorio entero a una carpeta | M | — | Reactivar dentro de la 028 |
| [005](../../../propuestas/005-cola-persistente-entre-sesiones.md) | Conservar la cola al cerrar (ya registrada) | Cola | U | Seguro ante cierres | S–M | Decisión 0049 | Reactivar como primer paso de la 031 |
| [003](../../../propuestas/003-calibrar-el-ajuste-de-silencios-por-cancion.md) | Sensibilidad en «Ajustar los silencios» (ya registrada) | Editor | C | Menos fines mal cortados | S–M | — | Esperar a la prueba técnica de la 019 |

## 6. Lo que descarté

| Idea | Por qué no |
|---|---|
| **Transcribir la letra con Whisper cuando no hay letra** | El reconocimiento de voz cantada falla mucho más que el hablado y los modelos buenos pesan varios GB. Con LRCLIB cubriendo 12 de 12 canciones del usuario, el caso no está demostrado. Queda como posible etapa 3 de la 019, sin archivo propio. |
| **Detección automática de tono (tonalidad)** | Mostrar «La menor» no ayuda a quien no es músico. Para transponer basta el control de semitonos de la 030. |
| **Detección de tempo y compás** | No hay ninguna función que hoy necesite el compás. Sincronizar la cuenta 3·2·1 con el pulso sería bonito, pero no quita trabajo. |
| **Detección de estructura (estrofa y coro) desde el audio** | Pesada y poco fiable. La repetición de texto ya da los estribillos (029) sin modelo alguno. |
| **Plantillas y preajustes de video** | El diálogo ya recuerda las últimas opciones (`config.exportacion`). Un catálogo de preajustes añade elección sin quitar pasos. Tampoco hay evidencia de que el usuario alterne entre perfiles. |
| **Perfiles de evento** (voz guía, cuenta, pantalla y tema por evento) | Son cuatro ajustes que ya se recuerdan. Lo que sí se rehace en cada evento es la cola, que cubre la 031. |
| **Autoactualización completa** | Sin firma de código no es fiable (pregunta 0037). El aviso de la 026 cubre la necesidad. |
| **Publicar en LRCLIB las letras sincronizadas** | Devolvería trabajo a la comunidad, pero la visión excluye «compartir o publicar», y LRCLIB no declara licencia de los textos. Decisión del usuario si quiere reabrirlo. |
| **Volcado local de LRCLIB para buscar sin conexión** | Varios GB para un caso que no aparece en el uso. Ya descartado en el ADR 0005. |
| **Puntuación, micrófono y efectos de voz** | Fuera de la visión. Es lo que hacen UltraStar, Vocaluxe y Performous, y es otro producto. |
| **Importar karaokes ya hechos (UltraStar `.txt`, CDG, KAR)** | Formatos muy distintos y catálogos de procedencia dudosa. El valor de Shinobi es crear, no reproducir catálogos. |
| **Más pistas separadas (bajo, batería, guitarra)** | No sirve al karaoke. |
| **Re-separar con otro modelo desde la tarjeta** | Con «Calidad» en todas las canciones y sin quejas de la separación, no hay evidencia. |
| **aeneas como alineador** | Su propia documentación lo desaconseja para canciones; sin versiones desde 2017. |
| **Selector de modelo de separación en Ajustes** | El usuario ya decidió que no (pregunta 0019). |
| **Rediseñar la barra de espera** | Nadie la usa, pero 0.2.1 la acaba de cambiar. Primero, ver el uso con el diseño nuevo. |

## 7. Límites de la investigación

- **No pude ejecutar la app.** Toda la fricción sale de las specs, del feedback, del informe de QA y de los archivos de datos. No vi ninguna pantalla real ni medí tiempos de interacción.
- **Sin herramientas de cálculo.** Los recuentos se hicieron con búsquedas de texto sobre los `cancion.json`. No pude calcular huecos entre líneas, caracteres por segundo ni comparar inicios con la voz. Las cifras de §2.3 distinguen fin fijado de fin automático, pero no quién fijó cada fin.
- **Los 5 borradores.** Sé que su búsqueda de letra nunca se lanzó. No sé si LRCLIB tiene esas letras: no hice consultas con datos del usuario a servicios externos.
- **Tiempos de trabajo.** La diferencia entre `creada` y `modificada` es una cota, no el tiempo real en el editor.
- **Un solo usuario y un solo equipo**, con GPU potente. En un equipo sin GPU la separación tarda minutos y parte del diagnóstico cambia: ahí «Buscar la letra mientras tanto» sí tiene sentido. La 020 sirve en los dos casos.
- **Alineación forzada sobre voz cantada.** No encontré medidas de WhisperX ni de wav2vec2 sobre canto en español. Las cifras de 0,2 a 0,4 s son de sistemas de investigación sobre el conjunto Jamendo. Por eso la 019 empieza por una prueba técnica con las canciones del usuario.
- **Licencias.** Comprobé las de la tabla de §4 en sus páginas. No leí los archivos `LICENSE` completos ni las licencias de los datos de entrenamiento. El arquitecto debe confirmarlas en un ADR antes de adoptar nada.
- **Referentes.** Lo dicho de KaraFun, Karaoke Mugen, Karaoke Eternal, Apple Music Sing, Youka y Aegisub viene de su documentación y páginas públicas, no de usarlos. No pude confirmar: la rotación de cantantes de KaraFun y de Karaoke Eternal, las cuotas por invitado de Karaoke Mugen, ni un atajo para saltar la introducción en UltraStar Deluxe. Vocaluxe y Performous no los consulté a fondo: solo los cito por su enfoque de puntuación.
- **yt-dlp.** No comprobé qué campos devuelve una lista en modo rápido; la documentación avisa de que pueden faltar metadatos.
- **Sin probar con dos pantallas**, igual que QA. Las propuestas de cola (031, 034) no tienen evidencia de uso real en eventos.
- **Solape con la 018.** Tamaño de letra, número de enunciados y transiciones no se tratan aquí. La 033 debe revisarse contra lo que proponga el otro diseñador.

## 8. Fuentes

Alineación y transcripción
- [WhisperX (repositorio, BSD-2-Clause, límites declarados)](https://github.com/m-bain/whisperX)
- [WhisperX: Time-Accurate Speech Transcription of Long-Form Audio](https://arxiv.org/abs/2303.00747v1)
- [Tradition or Innovation: A Comparison of Modern ASR Methods for Forced Alignment](https://arxiv.org/pdf/2406.19363)
- [Modelo wav2vec2 español de jonatasgrosman (Apache-2.0)](https://huggingface.co/jonatasgrosman/wav2vec2-large-xlsr-53-spanish)
- [torchaudio `VOXPOPULI_ASR_BASE_10K_ES` (CC BY-NC 4.0)](https://docs.pytorch.org/audio/2.8.0/generated/torchaudio.pipelines.VOXPOPULI_ASR_BASE_10K_ES.html)
- [torchaudio `MMS_FA` (CC BY-NC 4.0)](https://docs.pytorch.org/audio/2.8.0/generated/torchaudio.pipelines.MMS_FA.html)
- [stable-ts (MIT, archivado)](https://github.com/jianfch/stable-ts)
- [Montreal Forced Aligner (MIT)](https://github.com/MontrealCorpusTools/Montreal-Forced-Aligner) y [modelo acústico español (CC BY 4.0)](https://huggingface.co/MontrealCorpusTools/spanish_mfa)
- [aeneas (AGPL-3.0, «not suitable for song captioning»)](https://github.com/readbeyond/aeneas)
- [Low Resource Audio-to-Lyrics Alignment From Polyphonic Music Recordings](https://arxiv.org/pdf/2102.09202)
- [Contrastive Learning-based Audio to Lyrics Alignment for Multiple Languages](https://arxiv.org/html/2306.07744v1)
- [Acoustic Modeling for Automatic Lyrics-to-Audio Alignment](https://arxiv.org/pdf/1906.10369)

Creadores de karaoke automáticos
- [UltraSinger (MIT)](https://github.com/rakuri255/UltraSinger) y [cambio propuesto con LRCLIB y alineación forzada](https://github.com/MrDix/UltraSinger/pull/55)
- [karaoke-gen (nomadkaraoke)](https://github.com/nomadkaraoke/karaoke-gen) y [lyrics-transcriber](https://pypi.org/project/lyrics-transcriber/)
- [Youka: documentación](https://docs.youka.io/introduction) y [página del creador de video](https://www.youka.io/karaoke-video-maker)

Reproductores y sesiones
- [KaraFun: ayuda del reproductor](https://www.karafun.com/en-nz/help/player.html), [KaraFun Player](https://www.karafun.com/karaokeplayer/), [guardar tono y tempo](https://www.karafun.com/blog/476.html) y [funciones](https://www.karafun.com/en-au/features/)
- [Karaoke Mugen en Flathub](https://flathub.org/apps/details/moe.karaokes.mugen) e [incidencia sobre duplicados en la lista pública](https://gitlab.com/karaokemugen/code/karaokemugen-app/-/issues/1541)
- [Karaoke Eternal](https://github.com/bhj/KaraokeEternal)
- [Apple Music Sing (nota de prensa)](https://apple.com/newsroom/2022/12/apple-introduces-apple-music-sing/)

Edición de subtítulos
- [Aegisub: sincronizar con el audio](https://aegisub.org/docs/latest/timing/), [trabajar con audio](https://aegisub.org/docs/latest/audio/) y [tutorial de karaoke](https://aegisub.org/docs/latest/karaoke_timing_tutorial/)

Audio y fuentes
- [Rubber Band (GPL-2.0-or-later)](https://github.com/arthenica/rubberband)
- [signalsmith-stretch (MIT), atribución en la documentación de Qt](https://doc.qt.io/qt-6.9/qtmultimedia-attribution-signalsmith-stretch.html)
- [Modelo de karaoke MelBand RoFormer de aufr33 y viperx (copia en Hugging Face)](https://huggingface.co/jarredou/aufr33-viperx-karaoke-melroformer-model/tree/main) y [tabla de MVSEP](https://mvsep.com/algorithms/76)
- [yt-dlp: página de manual](https://manpages.debian.org/trixie/yt-dlp/yt-dlp.1.en.html)
- [LRCLIB: documentación de la API](https://lrclib.net/docs.md)
