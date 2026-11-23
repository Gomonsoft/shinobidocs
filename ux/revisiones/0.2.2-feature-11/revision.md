# Revisión de capturas · 0.2.2 · Feature 11 (revisión guiada de líneas dudosas)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F11-E16 y el resto de [06 · Feature 11](../../06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas), incluidas las decisiones de [0226](../../../preguntas/0226-ajustes-de-ux-de-la-revision-guiada-sin-especificar.md), la regla de «importantes» de F11-E12 y los umbrales del ADR 0024 §3.
- Revisadas **las 17 capturas**, una a una: las 8 de cada escala (100 % y 125 %) y `recorrido-panel-300`. `banner-revision` falta por diseño (depende de la feature 5) y no cuenta.

**Veredicto: no aprobada** hasta corregir R1 y R2 (la tarjeta del recorrido), que **bloquean alpha.2**. Todo lo demás es conforme o se corrige después.

## Por captura

| Captura | Resultado | Notas |
|---|---|---|
| `funciones-revisar` (100, 125) | Conforme | «Revisar la sincronía» la primera de Funciones, [⚑ Revisar (2)…] y el resumen `edi.revision.resumen`. En la cabecera de la lista, el botón ⚑ ▾ (0226 n.º 3). |
| `lista-con-marcas` (100, 125) | Conforme | ⚑ en la columna izquierda de 14 px (0226 n.º 2) y la banderita en la esquina de la región. |
| `recorrido` (100, 125) | **No conforme: R1, R2**; revisar **R4** | La tarjeta encima del panel de la línea, con el motivo y los arreglos. **[✓ Está bien (2)] asoma cortado** y hace falta el scroll del panel. El «(2)» es un número y debería ser la tecla N. |
| `recorrido-panel-300` | **No conforme: R1, R2** | A 300 px los botones no se parten, pero el problema del recorte es el mismo. |
| `recorrido-corregida` (100, 125) | **No conforme: R2, R3** | `edi.revision.corregida` correcto. Salen a la vez «Siguiente ›» y «Siguiente (1)»: dos botones con el mismo nombre y la misma acción, y el «(1)» es un número. |
| `recorrido-fuera` (100, 125) | Conforme | `edi.revision.fuera` con [Volver a la revisión] y la ⚑ de la línea pendiente en la lista. |
| `recorrido-fin` (100, 125) | Conforme, con **R5** | Texto `edi.revision.fin`, [Probar a pantalla completa (F)], `edi.revision.fin.hecho` (canción Lista) y «Hecho» resaltado con contorno `info` (0226 n.º 8). Falta el ✓ delante de «Has revisado…» del wireframe. |
| `popover-pendientes` (100, 125) | Conforme, con **R4** | Popover anclado a «Marcar como lista», [Revisar ahora] primario y [Marcar igualmente]. El banner de la feature 4 en la lista se valora abajo. |
| `sin-dudas` (100, 125) | Conforme | `edi.revision.nada`, botón inactivo y sin el ⚑ ▾ en la cabecera de la lista. |

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **R1** | F11-E15 y el recorrido (la acción principal de la tarjeta) | A 1280 × 720 (100 % y 125 %) y a 300 px, [✓ Está bien] queda debajo de [Escuchar otra vez], [Fin al final de la voz] y [Anterior]/[Siguiente], cortado por el borde del panel. Hace falta desplazar el panel en **cada** línea del recorrido. | **Reordenar** (spec actualizada, «Orden y tamaño de la tarjeta»): título · motivo · **[✓ Está bien] a todo el ancho, con borde `acento-texto`** · [‹ Anterior] [Siguiente ›] · [▶ Escuchar otra vez] [arreglo rápido] (en una fila si caben) · casilla. Botones de la tarjeta de 32 px de alto y 8 px de separación. «Está bien» debe verse entero sin desplazar a 1280 × 720 (100 % y 125 %) y a 300 px. Lo de debajo puede requerir el scroll propio del panel, y eso es conforme. **No** basta con aceptar el scroll: es la acción que se repite en cada línea. | **Bloquea alpha.2** |
| **R2** | `edi.revision.bien` | «Está bien (2)» y «Siguiente (1)»: se pinta el número de pendientes. En la spec, «(N)» era la tecla del atajo. | «Está bien» (o «Siguiente» en una línea corregida) y, alineada a la derecha dentro del botón, la tecla **N** en `t-pequeno` `texto-3`. Nombre accesible sin la tecla, con `aria-keyshortcuts="N"`. El número de pendientes ya está en el título («quedan 2 de 2»). Microcopy aclarado en la spec. | Bloquea alpha.2 (va con R1, en la misma pieza) |
| **R3** | «Línea ya corregida» | Dos «Siguiente» a la vez (navegación y principal). | El principal pasa a [Siguiente] (con la tecla N) en el sitio de «Está bien», y el «Siguiente ›» de la navegación **se oculta**; queda [‹ Anterior] solo. **Fallo de la spec** (no lo decía): ya corregido en «Línea ya corregida». | Se corrige después (con R1) |
| **R4** | Motivo `finTarde` y regla de «importantes» (F11-E12) | En `recorrido`, la línea 2 dice «El fin llega 3,0 s después de la voz.» y el popover cuenta 2 pendientes. En la línea de tiempo, la región de la línea 2 llega hasta el inicio de la siguiente, que es lo típico de un **fin automático**. | Si el fin de la línea 2 es automático: el motivo debe usar la variante «El fin es automático y llega 3,0 s después de la voz.» (`edi.revision.motivo.finTarde`) y, con la regla nueva de F11-E12, **no debe contar** para el popover (si no queda otra importante, «Marcar como lista» marca sin preguntar). Si el fin está fijado en el fixture, las dos capturas son conformes. No se puede saber desde la imagen: **QA debe confirmar** el `fin_ms` de la línea 2 del fixture y, si es automático, el programador debe corregir el texto y el recuento. Puede que la captura sea anterior a la regla de «importantes». | Se corrige después (si se confirma) |
| **R5** | Wireframe del fin | «Has revisado las 2 líneas señaladas…» sin el ✓ delante. | Icono `check` de 16 px en `exito` delante del texto, en la misma línea. | Se corrige después |
| **R6** | 0226 n.º 1 (captura que falta) | Ninguna captura muestra el recorrido activo con otra pestaña abierta, así que no se puede comprobar la ⚑ de la pestaña «Sincronía». | Captura nueva `editor-1280x720-100-recorrido-otra-pestana.png`: recorrido activo, pestaña «Funciones» abierta y, en «Sincronía», el icono `flag` de 12 px en `texto-2` (no el punto `aviso`). | Se corrige después (QA) |

## Banner de la feature 4 junto al popover (`popover-pendientes`)

**Aceptable en una canción real.** Los dos avisos tratan problemas distintos (la letra entera puede ser de otra versión; algunas líneas tienen tiempos dudosos), están en zonas separadas (lista y dock) y no se tapan. El popover solo sale al pulsar «Marcar como lista», que es justo el momento de recordar los dos. Si la letra no encaja con la voz, lo normal es que también haya muchas líneas dudosas, y que el usuario las vea juntas es coherente. No hace falta coordinar nada. Para la captura de referencia sería más limpio un fixture sin el banner, pero no es necesario.
