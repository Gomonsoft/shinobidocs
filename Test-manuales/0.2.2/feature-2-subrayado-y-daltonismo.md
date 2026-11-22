# Guía manual · Feature 2 · Subrayado de lo cantado y aviso de daltonismo

> **No ejecutada todavía.** Cubre lo que no se automatiza: el simulador de daltonismo, que ningún tema incluido avise, el subrayado visto a distancia y en la segunda pantalla. Hay un defecto abierto (pregunta [0205](../../preguntas/0205-subrayado-de-lo-ya-cantado-deja-una-linea-oscura-bajo-la-ya-cantada.md)): el caso 1.3 sirve para confirmarlo.

- Versión: 0.2.2 · Feature 2
- Specs: [07 · Feature 2](../../ux/07-reproductor.md) (F2-R1 a R9) · [06 · Feature 2](../../ux/06-editor.md) (F2-E1 a E11) · [08 · Feature 2](../../ux/08-ajustes-y-acerca.md) (F2-A1 a A4) · ADR [0022](../../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) · Informe: [informe-feature-2](../../versiones/0.2.2/informe-feature-2.md)
- Duración estimada: 1 h
- Requisitos: una canción lista con líneas de dos renglones, un simulador de daltonismo (el de macOS en Accesibilidad › Pantalla › Filtros de color, el de Windows en Filtros de color, o una extensión del navegador sobre una captura), una segunda pantalla.

## Casos

### 1. Subrayado en el reproductor

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | En el editor marca «Subrayar lo ya cantado» y reproduce a pantalla completa. | El subrayado avanza con el barrido, del borde izquierdo del texto; las futuras no tienen subrayado. | ☐ |
| 1.2 | Mira una línea de dos renglones. | Se subraya primero el renglón de arriba y luego el de abajo, sin que cambie la posición de ningún texto. | ☐ |
| 1.3 | Fíjate en la línea ya cantada (la que sube y se apaga) y en la que sale. | **No** queda ninguna línea, ni clara ni oscura, bajo la ya cantada; el subrayado se funde con la salida. (Defecto 0205: hoy se ve una línea oscura fina.) | ☐ |
| 1.4 | En una canción con tiempos por palabra hechos a mano, mira el subrayado. | Cada palabra tiene su tramo y el espacio entre palabras no se subraya. | ☐ |
| 1.5 | En un hueco largo con la barra de espera. | La pista de la barra es el color de la letra al 35 % y el relleno el de lo ya cantado. | ☐ |
| 1.6 | Mira el subrayado desde 5 m. | Se distingue sin esfuerzo y no tapa los renglones de abajo. | ☐ |
| 1.7 | Lo mismo en la ventana secundaria. | Idéntico a la principal. | ☐ |

### 2. Aviso de daltonismo

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Pon letra `#E53935` y resaltado `#43A047`. | Aviso «Con daltonismo, lo ya cantado puede no distinguirse de la letra.» con «Subrayar lo ya cantado» y «Sugerir un color de resaltado», y un punto en la pestaña Estilo. | ☐ |
| 2.2 | Pulsa «Sugerir un color de resaltado». | Propone un color que se distingue; el aviso desaparece. | ☐ |
| 2.3 | Con el simulador de protanopía y deuteranopía activado, mira el reproductor con el par rojo/verde sin subrayado y con él. | Sin subrayado casi no se distingue lo cantado; con subrayado, sí. | ☐ |
| 2.4 | Aplica cada uno de los temas incluidos (Shinobi, etc.) y mira el panel Estilo. | **Ningún** tema incluido muestra el aviso de daltonismo. | ☐ |
| 2.5 | Pon letra `#FFFFFF` y resaltado `#F2F3F7` con la casilla marcada y desmarcada. | Marcada: informativo ⓘ sin punto en la pestaña; desmarcada: aviso ⚠ con acciones. | ☐ |
| 2.6 | En una canción Letra lista con colores que se confunden. | El aviso sale como ⓘ «solo afecta al editor» y la casilla lleva esa nota. | ☐ |

### 3. Ajuste del equipo

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | En Ajustes › Reproductor marca «Subrayar siempre lo ya cantado». Cierra y reabre la app. | Sigue marcada. La siguiente canción (reproductor local y secundaria) sale con subrayado aunque su tema no lo tenga; `cancion.json` y `temas.json` no cambian. | ☐ |
| 3.2 | En el editor, con el ajuste activo y la casilla desmarcada. | Vista previa y «Probar a pantalla completa» muestran subrayado y se lee que Ajustes ya lo activa; el aviso de daltonismo **sigue** saliendo. | ☐ |
| 3.3 | Exporta un video con el ajuste activo y la casilla del tema desmarcada. | El video **no** lleva subrayado (el video solo usa el estilo). | ☐ |
| 3.4 | Desmarca el ajuste. | La siguiente reproducción sale sin subrayado. | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|

