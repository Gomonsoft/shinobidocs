# Revisión de diseño · 0.2.3 · Feature 3 — Voces a la vez (reproductor; provisional)

Fecha: 2026-11-23. Revisa el Diseñador UX. Capturas: `reproductor-{1920x1080,1280x720}-{dos-voces,tres-voces-con-coro,dos-voces-final,todos-sin-solape,espera-tras-solape}.png`. Las capturas del editor de esta feature llegarán después y se revisarán aparte.

Referencia: [07 · Voces a la vez](../../07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto) (condicionada y provisional) y [06 · Voces a la vez](../../06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto). Gravedad: **bloquea** (antes de cerrar la alpha) o **menor**.

## Veredicto por criterio

| Criterio | Veredicto | Notas |
|---|---|---|
| C1S-R1 | Cumple (visual) | `dos-voces`: las zonas de Cantante 1 «M» y Cantante 2 «I» están al 100 % y cada una barre por su punto. `tres-voces-con-coro`: también barre el coro. `dos-voces-final`: el coro y «I» barren mientras la zona de «M», que ya no tiene líneas, queda vacía. Los 10 instantes del solape, en el test. |
| C1S-R2 | Cumple (visual) | `todos-sin-solape`: la línea de Todos se dibuja en las dos zonas, barrida en lavanda y con «M·I», sin otra voz a la vez. `espera-tras-solape`: los indicadores salen solo cuando no suena ninguna zona, una sola vez, en la primera zona y en el color de Todos (C1-R9), en la fila de 0360. |
| C1S-R3 | Del arquitecto | Es la medida de la prueba técnica (60 FPS). |
| C1S-R4 (nuevo) | A comprobar | En `tres-voces-con-coro` y `dos-voces-final`, lo ya cantado se ve menos saturado (oro, cian y naranja más pálidos) que la misma parte en `dos-voces` y que en las capturas de la feature 1. Puede ser la transición de opacidad o la compresión de la captura, pero también una mezcla de colores durante el solape. |

## Correcciones

1. **Menor** (bloquea si el test falla). Durante un solape, el color de lo ya cantado de cada línea es el de su parte **exacto**: sonar a la vez no mezcla, aclara ni atenúa colores.
   - Se comprueba con el nuevo C1S-R4 (modelo y píxeles en una captura sin desenfoque).
   - Si la diferencia viene de la subida de 55 % a 100 % (`D`), hay que repetir la captura cuando esa transición haya terminado.
   - Spec: 07, fila «Color del barrido en un solape».
2. **Menor.** «Todas en un bloque» con solapes (pregunta 0380):
   - El editor muestra la nota `edi.pantalla.bloqueSolapes` con «Ver en zonas».
   - El reproductor sigue el modelo de bloque (limitación aceptada).
   - Spec: 06, fila «"Todas en un bloque" con solapes», C1S-E7, y 07, fila «"Todas en un bloque"».
3. **Bloquea** (para el editor de esta feature). «Juntar carriles» con regiones solapadas: hoy una región se pinta encima de la otra y la de debajo no se puede seleccionar. Decisión:
   - Juntar se permite siempre.
   - La pista juntada se divide en `k` sub-filas de 24 px, siendo `k` el máximo de líneas que suenan a la vez en la canción. Cada región va en la primera sub-fila libre, en el orden de los carriles, y su sub-fila es estable al hacer zoom y al desplazar.
   - Si las sub-filas no caben, la pista tiene scroll vertical propio, nunca de página.
   - Sin solapes, todo queda igual.
   - Se descarta impedir juntar, porque con poco espacio los carriles se juntan solos y no habría salida.
   - Spec: 06, fila «"Juntar carriles" con solapes», y C1S-E6, con la captura `editor-1280x720-100-juntos-solapes.png`.

## Segunda vuelta (2026-11-23): editor y reproductor regenerado, veredicto final

**Aprobada con correcciones menores** (provisional, como toda la sección condicionada).

Capturas del editor revisadas: `solape-carriles`, `solape-carriles-juntos`, `solape-menu-inactivo`, `solape-arrastre-prohibido` y `solape-silencios-excluidas`, a los tres tamaños salvo el arrastre, que solo está a 1280 × 720 al 100 %. Están guardadas en `0.2.3-feature-1/`. También `juntos-solapes`, en esta carpeta.

| Criterio | Veredicto final |
|---|---|
| C1S-E1 | Cubierto por los tests. En `solape-carriles` se ve el fin de la línea de Ana pasando el inicio de la de Luis. |
| C1S-E2 | Aprobado. Las dos regiones se ven enteras en sus carriles y la fila 2 lleva el icono `layers`. |
| C1S-E3 | Aprobado con corrección menor 4: las partes inactivas y su motivo se ven en el menú, y en el arrastre el carril de Ana se marca como prohibido. |
| C1S-E4 | Aprobado. `solape-silencios-excluidas` muestra «2 líneas que suenan a la vez que otras no se han tocado.» |
| C1S-E5 | Cubierto por los tests. |
| C1S-E6 | Aprobado con correcciones menores 5 y 6: dos sub-filas, ninguna región tapa a otra, y a 1024 × 576 igual. |
| C1S-E7 | Sin captura (corrección menor 7). |
| C1S-R1, C1S-R2 | Aprobados, igual que en la primera vuelta. |
| C1S-R4 | Aprobado por el test del programador, con corrección menor 8 para las capturas. Las regeneradas **siguen sin ser coherentes entre sí**: `tres-voces-con-coro` y `dos-voces-final` se ven más pálidas que `dos-voces`. Pero la palidez afecta a todo el fotograma (bordes de las insignias, barra de progreso y deslizadores), no solo a lo ya cantado. Eso cuadra con la explicación del perfil de color de la captura y no con una mezcla durante el solape. |

4. **Menor.** Menú y arrastre con una parte prohibida (spec 06, fila «Asignar», y sistema visual · «Carril»):
   - En el menú, el motivo `edi.partes.solapaMisma` sale cortado con «…» («se solapa con su lín…»). Debe leerse entero: el menú crece hasta 360 px y, si no cabe, el motivo pasa a un segundo renglón.
   - En el arrastre, el carril prohibido usa el mismo rojo que el carril de destino permitido. Debe llevar borde **discontinuo** de 2 px `error` y el motivo centrado en el carril, para no depender solo del color.
5. **Menor.** En la pista juntada, las regiones de cada sub-fila van pegadas arriba y el texto de 20 px pierde los trazos descendentes («gaviota», «bahía»). Cambio:
   - Las sub-filas se reparten el alto de la pista a partes iguales.
   - Cada región va centrada en vertical en su sub-fila.
   - El texto va centrado en los 17 px que deja la franja, sin recortes.
   - Spec 06, fila «"Juntar carriles" con solapes».
6. **Menor.** `solape-carriles-juntos` y `juntos-solapes` salieron con el puntero encima de «Separar carriles», y su tooltip tapa «Sincronizar al ritmo». Hay que repetirlas con el puntero fuera de la fila de controles.
7. **Menor.** Falta la captura de C1S-E7. Cambio: añadir `editor-1280x720-100-bloque-solapes.png` en esta carpeta, con «Todas en un bloque» elegido y la nota `edi.pantalla.bloqueSolapes` con «Ver en zonas» a la vista.
8. **Menor.** Repetir las cinco capturas del reproductor de esta feature en una sola ejecución con un perfil de color fijo (por ejemplo, Chromium con `--force-color-profile=srgb`), para que los colores de las partes coincidan entre capturas y con las de la feature 1.

## Tercera vuelta (2026-11-23): veredicto final

**Editor: aprobado** (provisional). Las correcciones 4 a 7 están aplicadas:

| N.º | Comprobado en |
|---|---|
| 4 | `solape-menu-inactivo`: el motivo se lee entero en dos renglones («…se solapa con su línea 1.»). `solape-arrastre-prohibido`: el carril de Ana tiene borde discontinuo y el motivo centrado, así que se distingue de la franja permitida sin depender del color. |
| 5 | `juntos-solapes`: las regiones van centradas en sus sub-filas y el texto se lee sin recortes. |
| 6 | Las capturas ya no tienen el tooltip encima. |
| 7 | `bloque-solapes`: con «Todas en un bloque» elegido se ve la nota `edi.pantalla.bloqueSolapes` con «Ver en zonas». |

C1S-E2, C1S-E3, C1S-E4, C1S-E6 y C1S-E7 quedan aprobados; C1S-E1 y C1S-E5, cubiertos por los tests.

**Reproductor: aprobado con una comprobación menor (9).** Con el perfil sRGB fijo, los colores **siguen sin ser coherentes** entre `dos-voces` y las otras dos capturas:

- En `dos-voces`, el oro y el cian salen saturados.
- En `tres-voces-con-coro` y `dos-voces-final`, el oro, el cian, el naranja y los bordes de sus insignias salen más pálidos.
- La interfaz de alrededor (barra de progreso, deslizadores, título) es idéntica en las tres.

Así que no es el perfil de color. La palidez afecta a líneas enteras, insignia incluida, y no al resto del fotograma: tiene la forma de una **opacidad menor que 100 %**, no la de una mezcla de colores. Puede ser la subida de 55 % a 100 % al empezar una línea, o el paso a gris al acabar, que duran `D`. En los tres casos pálidos hay una línea que acaba de entrar o está a punto de salir.

9. **Menor.** Comprobar si es la transición:
   - En los instantes de `tres-voces-con-coro` (00:08) y `dos-voces-final` (00:17), anotar la opacidad que da el modelo a cada zona que suena.
   - Si es la transición `D`, es el comportamiento diseñado. Basta con mover esas dos capturas a un instante en que haya pasado al menos `D` desde el último inicio y falte al menos `D` para el siguiente fin.
   - Si una zona que suena se queda por debajo del 100 % pasado `D`, es un fallo de C1S-R1 («las dos zonas están al 100 %») y **bloquea**.
   - El color exacto de lo ya cantado (C1S-R4) queda aprobado por el test del programador.

## Observación sin cambio

La lectura funciona: cada voz en su franja, quien canta ahora al 100 % y quien espera al 55 %, y las insignias se leen a 1280 × 720. Con tres barridos a la vez la pantalla está cargada pero se puede seguir. Se anota en la guía manual para probarlo a 5 m.
