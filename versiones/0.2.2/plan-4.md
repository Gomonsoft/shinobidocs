# Plan de Shinobi Karaoke 0.2.2

La 0.2.2 parte de [0.2.1](../0.2.1/plan-3.md). El 2026-11-21 el usuario autorizó definir las propuestas aceptadas: «vamos a meter las que ya se aceptaron por defecto; cada feature será el equivalente a una fase; ahora trabajaremos por feature, pues la app ya tiene estructura».

## Cómo se trabaja en esta versión

- **Una feature = una fase.** Cada una tiene su spec, su parte de ADR, sus tareas, su verificación y su informe, y se integra por separado.
- **Decisiones:** por defecto se aplica la opción recomendada por el agente ([regla de decisión](#regla-de-decisión)).
- **Estado actual:** definida (specs, ADR 0022–0028 y tareas 0284–0339 en el [backlog](backlog.md)). La implementación empieza cuando el usuario lo indique.

## Features de la versión

El número de feature es el de la propuesta original; el **orden** de implementación y las entregas los fija el arquitecto en el [backlog](backlog.md) según las dependencias (2026-11-21). La tarea [0339](../../tareas/0339-contratos-compartidos-de-0-2-2.md) (contratos compartidos) va antes que todas.

| Feature | Propuesta | Qué es | Tamaño | Orden | Tareas | Entrega | ADR | Estado |
|---|---|---|---|---|---|---|---|---|
| 1 | [018](../../propuestas/018-letra-en-pantalla-con-varios-enunciados.md) | Letra en pantalla con varios enunciados, línea pasada y transiciones | L | 2 | 0287–0292 | alpha.1 | [0022](../../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) | Definida (spec, ADR y tareas) |
| 2 | [033](../../propuestas/033-legibilidad-y-resaltado-accesible.md) | Resaltado que no dependa solo del color (subrayado y aviso de daltonismo) | S–M | 3 | 0293–0295 | alpha.1 | 0022 | Definida |
| 3 | [026](../../propuestas/026-aviso-de-version-nueva.md) | Aviso de versión nueva | S | 1 | 0284–0286 | alpha.1 | [0023](../../adr/0023-aviso-de-version-nueva-con-github-releases.md) | Definida |
| 4 | [022](../../propuestas/022-comprobar-la-letra-contra-el-audio.md) | Comprobar la letra contra el audio y corregir el desfase | M | 3 | 0296–0301, 0378, 0379, 0381 | alpha.1 | [0024](../../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) | Definida. Los umbrales no aguantan con letras de LRCLIB sin fines ([medida del 2026-11-22](medidas-con-canciones-reales.md)): guardas de prudencia provisionales y medida con canciones revisadas pendiente (pregunta 0280) |
| 5 | [020](../../propuestas/020-preparacion-desatendida.md) | Preparación desatendida hasta «Lista para revisar» | L | 5 | 0306–0312, 0380, 0382, 0386 | alpha.2 (con LRC sin fines llega a «Elige la letra»; elegir sola queda pendiente de la feature 10 o de medir con canciones revisadas; la vía de los inicios se cerró, preguntas 0295 y 0305) | [0025](../../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md) | Definida |
| 6 | [024](../../propuestas/024-datos-de-la-cancion-automaticos.md) | Datos de la canción automáticos | S–M | 4 | 0302–0305 | alpha.2 | 0025 | Definida |
| 7 | [021](../../propuestas/021-importacion-por-lotes.md) | Importación por lotes | L | 7 | 0313–0317 | alpha.3 | [0026](../../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md) | Definida (listas de YouTube: legal provisional) |
| 8 | [028](../../propuestas/028-acciones-por-lotes-en-la-biblioteca.md) | Acciones por lotes en la Biblioteca | M | 8 | 0318–0322 | alpha.3 | 0026 | Definida |
| 9 | [025](../../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md) | Copia de seguridad, paquete de canción y exportar la letra | M–L | 8 | 0323–0327 | alpha.3 | [0027](../../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md) | Definida (paquete con audio: legal provisional) |
| 10 | [019](../../propuestas/019-sincronia-automatica-por-alineacion-forzada.md) | Sincronía automática por alineación de la voz: prueba técnica y etapa 1 | M + L | 1 (prueba) · 9 (etapa 1) | 0328 · 0329–0333 | prueba en alpha.1 · etapa en alpha.4 | [0028](../../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md) (Propuesto) | Fase 1 de la prueba: pasa el filtro con el criterio revisado (2026-11-23). Etapa 1 a la espera de la fase 2 (fines hechos a mano del usuario). Medida de la «señal D» para la feature 5: 0387 |
| 11 | [023](../../propuestas/023-revision-guiada-de-lineas-dudosas.md) | Revisión guiada de líneas dudosas | M | 6 | 0334–0337 | alpha.2 | 0024 | Definida |

## Feature 1 · Letra en pantalla con varios enunciados (propuesta 018)

### Qué pidió el usuario

Hoy el reproductor muestra dos enunciados (el actual y el siguiente) y, en las pausas, la pantalla sin texto. Se pide:

1. **Número de enunciados visibles configurable:** 5 por defecto, hasta 7, mínimo 2 (el comportamiento actual).
2. **«Enunciado pasado»:** con más de 3 enunciados visibles, poder configurar que uno sea la línea ya cantada. Esa línea sube y se decolora (pasa a un tono más gris).
3. **Transiciones con movimiento:** que el cambio de línea no sea solo desaparecer y aparecer. Dos tipos de animación, una de ellas con las líneas ya cantadas desplazándose hacia arriba.
4. **Dónde vive cada cosa:** un diseñador UX decide dónde va la función y dónde van sus ajustes.

### Lo que hay que decidir en el diseño

- Dónde se configura: en el tema (se hereda por canción, álbum y artista), en los ajustes del reproductor o por canción.
- Cuántas líneas pasadas y cuántas futuras hay en cada número de enunciados, y cuál es la línea activa.
- Las dos animaciones de transición y qué pasa con movimiento reducido.
- Convivencia con lo existente: indicadores de espera (puntos, barra de carga, cuenta 3·2·1), pausas, «Letra lista» (sin color de resaltado), líneas largas que ocupan varios renglones, proporción 4:3 y tamaño de letra.
- La vista previa del editor y la exportación a video, que deben verse igual que el reproductor (render por fotograma, ADR 0019).
- Legibilidad a distancia con 5 y 7 enunciados, usando como referencia las canciones «Lista» de la biblioteca del usuario.

### Entregables de la exploración

- Exploración de diseño con opciones, recomendación y maqueta: [`exploracion/letra-en-pantalla.md`](exploracion/letra-en-pantalla.md).
- Propuesta formal: `docs/propuestas/018-…`.

### Diseño recomendado (aplicado por defecto)

Resumen de la [exploración](exploracion/letra-en-pantalla.md); hay una [maqueta HTML](../../propuestas/diseno/letra-en-pantalla.html) para ver las animaciones (sin ejecutar por el diseñador: puede tener defectos).

- **Modelo.** La línea activa conserva su tamaño de hoy y queda anclada a una altura fija. Debajo, las futuras: la primera al 70 % y el resto al 60 %, cada vez más tenues. Encima, la pasada: al 60 % y en gris, con un contraste mínimo de 3:1. Por defecto 5 = 1 pasada + activa + 3 futuras. Con 2 queda exactamente lo de hoy.
- **Línea pasada.** Una línea pasa a pasada al llegar a su fin; si en 2 s no empieza otra, se retira. Disponible con 4 o más líneas; hasta 2 pasadas con 6 o 7.
- **Transiciones.** «Desplazamiento» (350 ms): todo el bloque sube un puesto y la cantada encoge y se vuelve gris. «Fundido» (250 ms): nadie viaja, cada línea se funde hacia su puesto; va mejor en canciones rápidas y en video a 24–30 FPS. Y «Sin animación». Todo depende del tiempo de la canción: la pausa congela, una búsqueda no se anima y el video sale idéntico.
- **Líneas muy cortas.** La animación se acorta al 60 % del tiempo hasta la siguiente; por debajo de 120 ms el cambio es instantáneo.
- **Dónde se configura.** En el tema: sección nueva «Letra en pantalla» del panel Estilo, entre «Letra» e «Indicadores de espera», heredable y con «Cambiar solo en esta canción». Tres controles: «Líneas a la vez» (2 a 7), «Líneas ya cantadas» (Ninguna, 1 o 2) y «Cambio de línea» (Desplazamiento, Fundido o Sin animación). Sin ajuste global ni control propio en la exportación.
- **Pausas largas.** Las líneas futuras siguen a la vista junto a los indicadores de espera, en lugar de la pantalla casi vacía de hoy.

### Decisiones tomadas por defecto

| N.º | Decisión | Opción aplicada |
|---|---|---|
| 1 | Dónde viven los ajustes | En el tema, con «solo en esta canción» |
| 2 | Bibliotecas y temas existentes al actualizar | Pasan a 5 líneas |
| 3 | «Líneas ya cantadas» por defecto | 1 |
| 4 | Línea pasada con 3 líneas | No; solo con 4 o más |
| 5 | Dos pasadas con 6 y 7 líneas | Sí |
| 6 | Segunda animación | «Fundido», más «Sin animación» |
| 7 | Fin de línea con hueco corto | Dos tiempos: sube al acabar y la siguiente entra en su inicio |
| 8 | Pausas largas | Futuras a la vista; la pasada se retira a los 2 s |
| 9 | Líneas de dos renglones | Conservan su forma en todos los puestos |
| 10 | Tamaño de la activa con 6 y 7 líneas | Igual que hoy |
| 11 | Exportación | Usa lo del tema |

### Sin comprobar

- La maqueta HTML no se ha abierto ni ejecutado.
- Las cifras de las canciones de referencia se sacaron a mano, sin script; conviene repetirlas antes de fijar umbrales.
- La legibilidad a 5 m de las líneas al 60 % y el coste de mover hasta 8 líneas por fotograma en un equipo modesto.

### Estado

Diseño recomendado aplicado por defecto, pendiente de que el usuario lo vea. Tras la aprobación del usuario: spec en `docs/ux/07-reproductor.md` y `06-editor.md`, ADR del arquitecto y desglose en tareas.

## Propuestas y su decisión

Las rellena la sesión principal con lo que propongan los diseñadores. Cada fila enlaza a su archivo en `docs/propuestas/`. El usuario marca la decisión.

Origen: [exploración de mejoras de experiencia](exploracion/mejoras-de-experiencia.md). La columna «Decisión» aplica la [regla de decisión](#regla-de-decisión): lo recomendado para 0.2.2 queda «Aceptada por defecto» hasta que el usuario diga otra cosa.

### Recomendadas para 0.2.2

| N.º | Propuesta | Área | Tamaño | Recomendación del diseñador | Decisión |
|---|---|---|---|---|---|
| [018](../../propuestas/018-letra-en-pantalla-con-varios-enunciados.md) | Letra en pantalla con varios enunciados (feature 1) | Reproductor | — | Pedida por el usuario | Aceptada (usuario) |
| [020](../../propuestas/020-preparacion-desatendida.md) | Preparación desatendida: la canción llega sola a «Lista para revisar» | Pipeline, Letra | M–L | Recomendada | Aceptada por defecto |
| [022](../../propuestas/022-comprobar-la-letra-contra-el-audio.md) | Comprobar la letra contra el audio y corregir el desfase | Letra, Editor | M | Recomendada | Aceptada por defecto |
| [021](../../propuestas/021-importacion-por-lotes.md) | Importación por lotes (archivos, carpeta, enlaces o lista de YouTube) | Añadir canción | L | Recomendada | Aceptada por defecto |
| [024](../../propuestas/024-datos-de-la-cancion-automaticos.md) | Datos de la canción automáticos (título, artista, álbum) | Añadir canción | S–M | Recomendada junto con la 021 | Aceptada por defecto |
| [019](../../propuestas/019-sincronia-automatica-por-alineacion-forzada.md) | Sincronía automática por alineación forzada sobre la voz separada | Editor, Letra | XL (etapa 1: L) | Prueba técnica y etapa 1 en 0.2.2; etapa 2 más adelante | Aceptada por defecto (prueba técnica y etapa 1) |
| [023](../../propuestas/023-revision-guiada-de-lineas-dudosas.md) | Revisión guiada de líneas dudosas | Editor | M | Recomendada | Aceptada por defecto |
| [025](../../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md) | Copia de seguridad, paquete de canción y exportar la letra (.lrc) | Biblioteca, Ajustes | M | Recomendada | Aceptada por defecto |
| [026](../../propuestas/026-aviso-de-version-nueva.md) | Aviso de versión nueva | Actualizaciones | S | Recomendada | Aceptada por defecto |
| [028](../../propuestas/028-acciones-por-lotes-en-la-biblioteca.md) | Acciones por lotes en la Biblioteca (incluye la 006) | Biblioteca, Exportación | M | Recomendada, al menos «Preparar» y «Eliminar» | Aceptada por defecto |
| [033](../../propuestas/033-legibilidad-y-resaltado-accesible.md) | Legibilidad y resaltado que no dependa solo del color | Estilo, Reproductor | S–M | Junto con la 018 | Aceptada por defecto |

### Condicionadas

| N.º | Propuesta | Tamaño | Condición del diseñador | Decisión |
|---|---|---|---|---|
| [016](../../propuestas/016-ajustar-el-fin-de-una-linea-con-la-voz.md) | Ajustar el fin de una sola línea con la voz | S | Solo si la etapa 1 de la 019 no entra | En espera de la 019 |
| [027](../../propuestas/027-marcar-inicio-y-fin-al-ritmo.md) | Marcar inicio y fin al ritmo manteniendo la tecla | S–M | Solo si la 019 se aplaza | En espera de la 019 |
| [029](../../propuestas/029-letra-pegada-lista-para-alinear.md) | Letra pegada lista para alinear: limpieza, idioma y estribillos | S–M | Solo si se aprueba la etapa 2 de la 019 | Más adelante |
| [003](../../propuestas/003-calibrar-el-ajuste-de-silencios-por-cancion.md) | Sensibilidad en «Ajustar los silencios» | S–M | Esperar a la prueba técnica de la 019 | En espera de la 019 |

### Más adelante

| N.º | Propuesta | Tamaño | Nota |
|---|---|---|---|
| [030](../../propuestas/030-tono-y-tempo.md) | Cambiar el tono y el tempo | L | Antes si el usuario la prioriza |
| [031](../../propuestas/031-listas-guardadas-y-cola-que-no-se-pierde.md) | Listas guardadas y cola que no se pierde (amplía la 005) | M | Contradice la decisión 0049 (la cola se vacía al salir) |
| [032](../../propuestas/032-saltar-intro-y-ensayar-estrofa.md) | Saltar la introducción y los silencios largos, y ensayar una estrofa | S–M | |
| [035](../../propuestas/035-ajustes-almacenamiento-y-estado-del-motor.md) | Ajustes: almacenamiento y estado del motor | S–M | Antes si se aprueban los lotes |
| [034](../../propuestas/034-cantantes-en-la-cola-y-mando-desde-el-movil.md) | Cantantes en la cola y mando desde el móvil | S + L | La parte de nombres puede ir sola |
| — | Voz principal y coros por separado | L | Solo si el arquitecto verifica la licencia del modelo; sin archivo propio |

### Decisiones que arrastran las aceptadas

- **Privacidad (020):** la búsqueda automática envía título y artista a LRCLIB sin que el usuario entre en la vista de Letra. Hay que revisar esa regla del ADR 0005 y añadir un interruptor.
- **Legal (021 y 025):** descargar listas enteras de YouTube, y un paquete de canción con audio que se puede pasar a otra persona aunque la visión excluye «compartir».
- **Licencias (019):** los modelos de alineación por defecto para español y el multilingüe son de uso no comercial (CC BY-NC 4.0) y no sirven; hay alternativa Apache-2.0 para español. La calidad sobre voz cantada no está medida: por eso empieza con una prueba técnica.
- **Decisión previa que se reabre (026):** cierra la pregunta 0037 con la opción B (avisar de versión nueva, sin autoactualizar).

## Preparación para 0.2.3 · Varios cantantes y coros

La propuesta [036](../../propuestas/036-varios-cantantes-y-coros.md) va en la versión 0.2.3 (decisión del usuario, 2026-11-22). El alcance de 0.2.2 no cambia: solo se añaden ajustes sin efecto visible (seis iniciales y cinco por las zonas de pantalla de [ADR 0029](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md)) para no rehacer trabajo después ([factibilidad §8.3](exploracion/varios-cantantes-y-coros-factibilidad.md)).

| Ajuste | Tarea |
|---|---|
| Reservar y conservar los datos del reparto (letra y estilo) sin usarlos | 0296, 0287 |
| `aplicarTextoEditado` conserva los campos de las líneas que no cambian (defecto de 0.2.1) | 0296 |
| Color del barrido por línea e indicadores con el color de la línea que viene | 0290, 0289 |
| Ancho de línea como variable | 0290 |
| Tests de disposición con líneas de 3 y 4 renglones | 0289 |
| Subrayado con el color de su línea y comprobación de daltonismo de dos colores | 0293, 0294 |
| Forma exacta del reparto reservado (ADR 0029 §1) y reserva de `estilo.pantalla.zonas` | 0296, 0287 |
| Zonas de pantalla: `fotogramaEn` sobre una subsecuencia de líneas con su propio índice | 0288 |
| Zonas de pantalla: `disponerBloque` dentro de una región `{ y0Px, altoPx }` | 0289 |
| Zonas de pantalla: `PantallaLetra` pinta una lista de zonas (en 0.2.2, una); indicadores en la zona de la línea que viene | 0290 |

## Regla de decisión

Indicación del usuario del 2026-11-21: **por defecto se toma la opción recomendada por el agente**; si alguna no le convence, pide el cambio. En este plan eso significa:

- Las decisiones de diseño de la feature 1 quedan con la recomendación del diseñador, anotadas como provisionales.
- Las propuestas que el diseñador recomiende para 0.2.2 entran en la tabla como «Aceptada por defecto»; las demás quedan como «Más adelante». El usuario puede cambiar cualquiera.
- Implementar sigue esperando a que el usuario diga que se empiece.

## Criterio del proyecto para priorizar

La idea de Shinobi Karaoke es **automatizar al máximo** la creación del karaoke (fuente → separación → letra → sincronía → estilo → reproducción y video). Una propuesta que quite pasos manuales tiene prioridad aunque sea pesada de implementar.
