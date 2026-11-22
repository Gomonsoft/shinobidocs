# Plan de Shinobi Karaoke 0.2.2 (en exploración)

La 0.2.2 parte de [0.2.1](../0.2.1/plan-3.md). Este documento es un **plan en exploración**: recoge la feature que el usuario pidió el 2026-11-21 y la lista de mejoras que proponen los diseñadores. **Nada de aquí está autorizado para implementarse** hasta que el usuario lo apruebe, feature por feature.

## Resumen

| # | Feature | Origen | Estado |
|---|---|---|---|
| 1 | Letra en pantalla con varios enunciados, enunciado pasado y transiciones con movimiento | Usuario, 2026-11-21 | En exploración · diseño en curso |
| — | Mejoras de experiencia por feature existente | Diseñador UX (exploración) | Pendiente de la investigación; ver [Propuestas por aprobar](#propuestas-por-aprobar) |

## Feature 1 · Letra en pantalla con varios enunciados

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

### Estado

En exploración. Tras la aprobación del usuario: spec en `docs/ux/07-reproductor.md` y `06-editor.md`, ADR del arquitecto y desglose en tareas.

## Propuestas por aprobar

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

## Regla de decisión

Indicación del usuario del 2026-11-21: **por defecto se toma la opción recomendada por el agente**; si alguna no le convence, pide el cambio. En este plan eso significa:

- Las decisiones de diseño de la feature 1 quedan con la recomendación del diseñador, anotadas como provisionales.
- Las propuestas que el diseñador recomiende para 0.2.2 entran en la tabla como «Aceptada por defecto»; las demás quedan como «Más adelante». El usuario puede cambiar cualquiera.
- Implementar sigue esperando a que el usuario diga que se empiece.

## Criterio del proyecto para priorizar

La idea de Shinobi Karaoke es **automatizar al máximo** la creación del karaoke (fuente → separación → letra → sincronía → estilo → reproducción y video). Una propuesta que quite pasos manuales tiene prioridad aunque sea pesada de implementar.
