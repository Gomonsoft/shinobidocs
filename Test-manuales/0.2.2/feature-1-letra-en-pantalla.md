# Guía manual · Feature 1 · Letra en pantalla con varias líneas

> **No ejecutada todavía.** Recoge lo que las pruebas automáticas no pueden comprobar: fluidez, legibilidad a distancia, 4:3, video frente al reproductor y la operación completa del panel. Las capturas de revisión ya están en `docs/ux/revisiones/0.2.2-feature-1/` (las revisa el diseñador).

- Versión: 0.2.2 · Feature 1
- Specs: [07 · Feature 1](../../ux/07-reproductor.md) (F1-R1 a R25) · [06 · Feature 1](../../ux/06-editor.md) (F1-E1 a E16) · ADR [0022](../../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md) · Informe: [informe-feature-1](../../versiones/0.2.2/informe-feature-1.md)
- Duración estimada: 1 h 30 min
- Requisitos: una canción lista con al menos 10 líneas (una con líneas largas de dos renglones), un monitor o televisor y, si puedes, un equipo modesto (sin GPU dedicada), una pantalla 4:3 o una ventana de 1440 × 1080, un reproductor de video que abra MP4 y la copia de una biblioteca de 0.2.1 (o una instalación de 0.2.1).

## Casos

### 1. Legibilidad y fluidez

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Reproduce la canción a pantalla completa con la configuración por defecto (5 líneas, 1 ya cantada, Desplazamiento) y mírala desde 5 m. | Se lee la línea que suena, la siguiente y las ya cantadas en gris; la activa destaca claramente. | ☐ |
| 1.2 | Repite con 7 líneas y 2 ya cantadas. | Las líneas lejanas se leen peor pero nada molesta; ninguna se corta por arriba ni por abajo. | ☐ |
| 1.3 | Mira 3 cambios de línea seguidos con «Desplazamiento», «Fundido» y «Sin animación». | Los dos primeros se ven suaves, sin tirones ni parpadeos; el tercero cambia de golpe. | ☐ |
| 1.4 | En un equipo modesto, reproduce 2 minutos con un fondo en movimiento y 5 líneas. | Sin saltos visibles. Si los hay, anota el equipo (hay una mitigación prevista con `will-change`). | ☐ |
| 1.5 | Repite 1.4 en la ventana secundaria (segunda pantalla). | Misma fluidez que en la principal. | ☐ |
| 1.6 | Activa el movimiento reducido del sistema y reproduce. | Las líneas cambian sin movimiento; la barra de espera y el barrido siguen avanzando; la ya cantada sigue en gris. Si el movimiento te marea, anótalo con la opción que usabas. | ☐ |

### 2. 4:3 y dos renglones

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | En una ventana de 1440 × 1080 (o una pantalla 4:3), elige 7 líneas y una canción con líneas de dos renglones. | Ninguna línea aparece cortada; las futuras que no caben simplemente no se dibujan. | ☐ |
| 2.2 | Compara los cortes de renglón de una línea larga en 16:9 y en 4:3. | Cada línea se parte igual en todos los puestos por los que pasa (no cambia de renglón al subir). | ☐ |
| 2.3 | En un hueco largo con barra, cuenta y puntos, mira el reproductor. | Los indicadores no tapan ninguna línea y las futuras siguen a la vista. | ☐ |

### 3. Video exportado

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Exporta la canción a video a **24 FPS** y reprodúcela junto a la vista del reproductor. | Mismos puestos, líneas y cambios en los mismos instantes; los cambios de línea se ven fluidos. | ☐ |
| 3.2 | Repite a **60 FPS**. | Igual, con movimiento más suave. | ☐ |
| 3.3 | Exporta una «Letra lista». | Ninguna línea aparece en el color de lo ya cantado, tampoco a mitad de un cambio. | ☐ |

### 4. Panel Estilo del editor

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Con el panel Estilo al mínimo (300 px), al medio (360) y al máximo (480), abre «Letra en pantalla». | Sin scroll de página, texto sin cortar y los seis valores de «Líneas a la vez» en una fila. (F1-E13, sin prueba automática.) | ☐ |
| 4.2 | Maneja los tres controles solo con el teclado (Tab, flechas, Espacio). | Se comportan como grupos de radio; las opciones no disponibles reciben el foco y explican por qué. (F1-E14) | ☐ |
| 4.3 | Cambia sin guardar a 7 líneas y pulsa «Probar a pantalla completa». | La prueba usa los mismos valores que la vista previa. (F1-E15) | ☐ |
| 4.4 | Pulsa «Ver un ejemplo» y pulsa Esc a mitad. | Se detiene; no sonó audio ni se movió el cabezal. Un lector de pantalla anuncia el inicio y el fin. | ☐ |

### 5. Compatibilidad con 0.2.1

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Abre con 0.2.2 una biblioteca de 0.2.1. Mira la fecha de modificación de `cancion.json` y `temas.json` antes y después de reproducir y de abrir el editor. | Las canciones se ven con 5 líneas, 1 ya cantada y desplazamiento; las fechas no cambian. | ☐ |
| 5.2 | Crea en 0.2.2 una canción con 7 líneas y ábrela con 0.2.1 (sin editarla). | Se abre y se reproduce con 2 líneas, sin error. Si editas y guardas con 0.2.1, al volver a 0.2.2 recupera 5 líneas (esperado y avisado en las notas de la versión). | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|

