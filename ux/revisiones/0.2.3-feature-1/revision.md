# Revisión de diseño · 0.2.3 · Feature 1 — Cantantes por línea (editor)

Fecha: 2026-11-23. Revisa el Diseñador UX. Alcance: **solo las capturas del editor** (`editor-*.png`, 57 archivos: 19 estados a 1280 × 720 al 100 % y al 125 % y a 1024 × 576). Las del reproductor se revisarán aparte, cuando estén regeneradas.

Referencia: [06 · 0.2.3 · Feature 1](../../06-editor.md#023--feature-1--cantantes-por-línea) y [sistema visual · 0.2.3](../../sistema-visual.md#023--varios-cantantes-y-coros). Gravedad: **bloquea** (se corrige antes de cerrar la alpha) o **menor** (se puede corregir después).

## Veredicto por criterio

Los criterios de comportamiento (deshacer, teclas, datos) no se ven en una captura: se dan por cubiertos si los tests de la tarea los comprueban.

| Criterio | Veredicto | Notas |
|---|---|---|
| C1-E1 | Cumple | `sin-reparto`: sin chips, sin fila «Canta», pista única, sin «Juntar carriles» y vista previa sin insignias. |
| C1-E2 – C1-E6 | Tests | `menu-quien-canta` y `seleccion-multiple` muestran el punto de partida correcto. |
| C1-E7 | Cumple | Dúo: Cantante 1, Cantante 2, Coro, separador, «Todos (los dos)» con T, separador, añadir y nombres. Trío: Todos con el icono `users` junto a los cantantes y antes del Coro. |
| C1-E8 | Cumple con corrección menor | `carril-vacio`: carril con `edi.partes.carrilVacio`; la línea base de la onda atraviesa el texto (corrección 5). |
| C1-E9 | No verificable | `funciones-cuatro` no deja ver `edi.partes.maximo`: la sección queda cortada tras «Ana» (corrección 10). |
| C1-E10 | Cumple (lo visible) | Iniciales A, L, M; «1», «3», «4» con nombre predeterminado; Todos «A·L» en dúo e icono `users` con 3 o más. «An»/«Al»: tests. |
| C1-E11, C1-E12 | Tests | |
| C1-E13 | Cumple con corrección menor | Orden 1…4, Todos, Coro; un cantante con coros, dos carriles; la onda de fondo detrás de todos. La etiqueta de 72 px corta «Todos» («Tod…», «To…» con «A·L») y «Cantante» («Can…») (corrección 3). |
| C1-E14 | No cumple | `arrastre-carril`: con la franja «+ Nuevo cantante», el carril del Coro queda debajo de la vista general, así que no se puede soltar en él; la región arrastrada no se ve y no hay carril de destino resaltado (correcciones 2 y 9). |
| C1-E15 | No cumple (fila de controles) | Altos: sin scroll de página; zona superior ≈ 170 px a 1280 al 100 % con 6 carriles y ≈ 150 px al 125 % (≥ 136). A 1024 × 576 y al 125 %, con 4 o más carriles se juntan solos con el botón inactivo. **Pero** la fila de controles de la línea de tiempo se recorta: «Ajustar los silencios» queda como un botón vacío de unos 30 px (corrección 1). |
| C1-E16 | Cumple | `carriles-juntos`: franja de 3 px en el color de la parte e inicial en cada región; el botón pasa a «Separar carriles». La preferencia: tests. |
| C1-E17 | Parcial | `estilo-colores`: «Ana = Color de lo ya cantado ↑», Luis `#35C6E8` y Todos con selector; el Coro y «Más colores» quedan fuera de la captura (corrección 10). El chip de esta sección se estira a 40 px (corrección 6). |
| C1-E18 | Tests | |
| C1-E19 | Cumple | `aviso-parte`: ⚠ `edi.contraste.parte` con «Sugerir un color» y punto en la pestaña; dos ⓘ `edi.contraste.partesParecidas` (Ana/Coro y Luis/Todos), esperados con los colores predeterminados y sin punto (anotado en el sistema visual). |
| C1-E20 – C1-E22 | Tests | |
| C1-E23 | Cumple con corrección menor; falta medirlo | 256 px: chips enteros y sin scroll, pero el texto de la fila mide ≈ 100 px porque el hueco del chip ocupa ≈ 57 px; la spec pedía ≥ 160 px, cifra que no se podía alcanzar con la bandera y el tiempo de 0.2.2. La spec pasa a ≥ 96 px y C1-E23 queda medible (corrección 8). 300 px: la fila «Canta» cabe; en Funciones la ayuda toca la barra de desplazamiento (corrección 7). |
| C1-E24 | Cumple con capturas por repetir | Están los 14 estados pedidos y 5 más; cuatro capturas por repetir y una nueva (corrección 10). |
| C1-E25 | Sin captura | Se añade el estado `estilo-voces` a C1-E24 (corrección 10). |

## Avisos del programador

| Aviso | Decisión |
|---|---|
| «Todos» se corta a «Tod…» en el carril de 72 px | La etiqueta del carril pasa a 96 px y el nombre predeterminado se escribe «Cantante» (corrección 3). |
| A 1024 × 576 se recorta la fila de controles | Ya incumplía AS1 («solo icono por debajo de 1280 px»), también sin reparto. «Juntar carriles» sigue la misma regla (corrección 1). |
| C1-E23 sin medir | El criterio queda con medidas concretas y el número del texto se corrige en la spec (corrección 8). |
| Falta `coros-preparando` | Es de la feature 2: ver [su revisión](../0.2.3-feature-2/revision.md). |

## Correcciones

1. **Bloquea.** Fila de controles de la línea de tiempo por debajo de 1280 px de ancho efectivo (1024 × 576 y 1280 × 720 al 125 %):
   - «Ajustar los silencios» y «Juntar / Separar carriles» se muestran **solo con su icono** (`fold-vertical` para juntar). Llevan tooltip y nombre accesible con el texto completo y conservan `aria-pressed` y `aria-disabled` con `edi.partes.juntosSinEspacio`.
   - Ningún botón de la fila puede ser más estrecho que su contenido.
   - Spec: 06 · «Juntar carriles» y C1-E15.
2. **Bloquea.** Durante un arrastre, el alto efectivo de la pista cuenta la franja «+ Nuevo cantante» (y la de Todos en un dueto) como un carril de 24 px:
   - Ningún carril queda debajo de la vista general ni recortado.
   - Si no cabe, cede la zona superior, como con un carril más, y todo vuelve al soltar o cancelar.
   - Spec: 06 · «Soltar en "+ Nuevo cantante"» y C1-E15.
3. **Menor.** La columna de etiquetas de carril pasa de 72 a 96 px:
   - «Todos» y «Coro» caben enteros.
   - Con el nombre predeterminado la etiqueta dice «Cantante» (el número va en el chip).
   - Tooltip y nombre accesible con el nombre completo.
   - Spec: 06 · «Etiqueta del carril», C1-E13 y sistema visual.
4. **Menor.** Con carriles, los mensajes de la onda («Preparando forma de onda…», la disponibilidad tras la separación y «Forma de onda no disponible») salen de los carriles:
   - En `coros-sin-voz`, el texto «Disponible…» asoma debajo de la primera región.
   - Pasan a la celda vacía sobre las etiquetas: icono `audio-waveform` en `texto-3`, con tooltip y `aria-describedby`; «Reintentar» va en el tooltip y en el menú contextual de la pista.
   - Spec: 06 · «Mensajes de la onda con carriles».
5. **Menor.** Carril vacío: el texto `edi.partes.carrilVacio` lleva un fondo del color del carril y 8 px de relleno lateral, para que la línea base de la onda no lo atraviese. Spec: sistema visual · «Carril vacío».
6. **Menor.** El chip de Funciones y Estilo es el mismo que en la lista:
   - Ancho según el contenido, con un mínimo de 24 px.
   - Va alineado en una columna de 40 px, sin estirarse a lo ancho de ella.
   - Spec: sistema visual · «Chip de parte».
7. **Menor.** El panel a 300 px reserva el hueco de la barra de desplazamiento (`scrollbar-gutter: stable`, o 12 px de relleno a la derecha): en `funciones-300`, «se ve» de la ayuda queda debajo de la barra. Spec: C1-E23.
8. **Menor.** Lista:
   - El hueco del chip mide el chip más ancho de la canción más 8 px a cada lado (hoy ≈ 57 px fijos).
   - A 256 px el texto mide ≥ 96 px.
   - El test de C1-E23 comprueba `scrollWidth ≤ clientWidth` en la lista, el panel y la sección, el alto de 20 px de cada chip y el ancho del texto.
   - Spec: 06 · «Ancho» y C1-E23.
9. **Menor.** La franja de destino («+ Nuevo cantante», «Todos») lleva el borde de destino (2 px `acento-texto`) con el puntero encima, como un carril. Spec: 06 y sistema visual · «Franja de destino».
10. **Menor.** Capturas por repetir, a los tres tamaños, desplazando el panel hasta que la sección se vea entera (C1-E24 actualizado):

    | Captura | Qué debe verse |
    |---|---|
    | `estilo-colores` | Hasta el Coro y «Más colores». |
    | `funciones-varios` | Todos, Coro y «+ Añadir cantante». |
    | `funciones-cuatro` | Hasta `edi.partes.maximo`. |
    | `arrastre-carril` | El puntero sobre un carril de destino, con la región arrastrada visible y el borde de destino. Si la región no se dibuja durante el arrastre, el fallo es de la corrección 2 y bloquea. |
    | `estilo-voces` (nueva) | «Letra en pantalla › Varias voces» con la nota `edi.pantalla.zonas`. |

## Segunda vuelta del editor (2026-11-23): veredicto final

**Aprobada con correcciones menores.** Las diez correcciones del editor están aplicadas y se ven en las capturas regeneradas:

| N.º | Comprobado en |
|---|---|
| 1 | Solo icono para «Juntar carriles» y «Ajustar los silencios» a 1024 × 576 y al 125 %, sin botones recortados: `lista-varios`, `sin-reparto`. |
| 2 | Durante el arrastre la pista crece y el Coro queda por encima de la vista general: `arrastre-carril`. |
| 3 | Etiquetas de 96 px, con «Todos» y «Cantante» enteros. |
| 4 | El icono de la onda va sobre las etiquetas: `coros-sin-voz`. |
| 5 | El texto del carril vacío lleva fondo. |
| 6 | El chip tiene ancho según su contenido en Funciones y Estilo. |
| 7 | Funciones a 300 px no queda debajo de la barra de desplazamiento. |
| 8 | La lista a 256 px deja ≈ 100 px al texto. |
| 9 | La franja de destino se resalta. |
| 10 | Capturas completas: `estilo-colores` llega hasta «Más colores», `funciones-varios` y `funciones-cuatro` llegan hasta `edi.partes.maximo`, y `arrastre-carril` muestra la región arrastrada. |

| Criterio | Veredicto final |
|---|---|
| C1-E1, C1-E7, C1-E8, C1-E10, C1-E13, C1-E14, C1-E15, C1-E16, C1-E17, C1-E19, C1-E23 | Aprobados |
| C1-E9 | Aprobado (`funciones-cuatro`: «Hasta 4 cantantes por canción.» y sin «+ Añadir cantante») |
| C1-E25 | Aprobado con corrección menor 12 |
| C1-E24 | Aprobado con corrección menor 12 |
| Criterios de comportamiento | Cubiertos por los tests de la tarea |

12. **Menor.** `estilo-voces` muestra «Varias voces» con sus dos opciones, pero se corta en «Líneas a la vez» y no deja ver la nota `edi.pantalla.zonas`, que C1-E24 pide. Cambio: repetir la captura a los tres tamaños desplazando el panel hasta que se vea la nota (bajo «Líneas ya cantadas»).

### Tercera vuelta (2026-11-23): veredicto final del editor

**Aprobada.**

- La corrección 12 está aplicada: `estilo-voces` muestra «Varias voces» y la nota `edi.pantalla.zonas` entera.
- Fallos que solo se veían en Linux, corregidos por el programador:
  - **El hueco del chip cede hasta 30 px** (`minmax(30px, …)`) para que el texto conserve 96 px a 256 px. **Es aceptable**: 30 px es el ancho del chip más ancho («A·L»), así que ningún chip se recorta, y en `lista-256` a 1024 × 576 el chip y el texto no se tocan. La spec 06 · «Ancho» lo recoge: el hueco cede antes que el texto, nunca por debajo del chip más ancho ni de 30 px, y con al menos 4 px de separación con el tiempo y con el texto. Si un día hubiera un chip más ancho de 30 px, manda su ancho.
  - **El relleno de 12 px del panel solo se aplica con barras de desplazamiento superpuestas.** Es correcto: con barras clásicas el navegador ya reserva su hueco, y lo que pedía la corrección 7 era que ningún texto quedara debajo de la barra.

Todos los criterios C1-E y C1-R quedan aprobados o cubiertos por los tests de la tarea.

Las capturas `solape-*` que se guardaron en esta carpeta son de la feature 3 y se revisan en [su revisión](../0.2.3-feature-3/revision.md).

## Reproductor (segunda parte, 2026-11-23)

Capturas `reproductor-*.png`: 9 estados a 1920 × 1080 y a 1280 × 720, más `cuatro-tercios-duo` a 1440 × 1080. Referencia: [07 · 0.2.3 · Feature 1](../../07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla).

| Criterio | Veredicto | Notas |
|---|---|---|
| C1-R1 | Tests | Es una regresión del modelo; no tiene captura. |
| C1-R2 | Cumple | Dúo con coro: Coro arriba, con media altura y una línea; debajo, Ana y Luis. Las zonas están en el mismo sitio en todas las capturas del dúo, con la de Ana vacía en `duo-coro` sin que se recoloque nada. `solo-coros`: dos zonas, con el Coro arriba. |
| C1-R3 | Cumple | `duo-canta-2`: la zona de Luis va al 100 %, con el barrido en `#35C6E8` y la insignia «L»; la de Ana muestra su próxima línea al 55 % sin barrido; lo que falta por cantar va en el color de la letra. |
| C1-R4 | Cumple | `duo-todos`: la misma línea en las dos zonas, barrida en lavanda y con «A·L». `cuarteto-coro`: Todos lleva el icono `users`. |
| C1-R5 | Cumple | La línea de coro lleva un solo par de paréntesis (el texto ya los traía) y no lleva insignia. |
| C1-R6 | Cumple (visual) | A 1440 × 1080 la línea más ancha, con su insignia, ocupa ≈ 76 % del ancho. El cuarteto con coro a 1280 × 720 cabe sin cortes y cada línea queda dentro de su zona. El 75 % de `S` se comprueba en el test. |
| C1-R7 | Cumple (visual) | La insignia queda a la izquierda del primer renglón sin tocarlo y su borde lleva el color de la parte. Las medidas exactas, en el test. |
| C1-R8 | Cumple | `letra-lista-duo`: cada texto va entero en el color de su parte, sin barrido; la zona que suena al 100 % y las demás al 55 %. |
| C1-R9 | Cumple | `espera-zona` (fila de 0360): los indicadores van en la zona del coro, en naranja, en una fila sobre la línea y sin tocarla. De izquierda a derecha: puntos, barra (25 % del ancho, porque lleva la cuenta al lado) y la cuenta «2». Antes de una línea de Todos se ve en la feature 3 (`espera-tras-solape`): una sola vez, en la primera zona y en lavanda. |
| C1-R10, C1-R11 | Tests | No hay captura de «Todas en un bloque». La vista previa del editor coincide a ojo con el reproductor en `lista-varios` y `duo-canta-2`. |
| C1-R12 | Cumple | Están las 19 capturas pedidas. |

**Correcciones del reproductor**

11. **Menor** (es de la spec y ya está corregido). 07 decía que en «Un solo cantante con coros» el Coro iba «abajo», en contra de la regla «Orden». Las capturas siguen la regla, con el Coro arriba. El texto de 07 está corregido.

**Observaciones sin cambio**

- `escala-de-grises`: se sigue sabiendo quién canta (por la zona, la insignia y la opacidad). Lo ya cantado en el cian de Luis queda como un gris claro, poco distinto del blanco de lo que falta, que es el caso que cubre el subrayado de 0.2.2 · F2. No se cambia nada: va a la guía manual con el simulador de deuteranopía.
- En `duo-canta-1` y `duo-canta-2` la próxima línea de Todos sale dos veces (como próxima de una zona y como siguiente de la otra), a tamaños distintos. Es la consecuencia diseñada de que Todos no tenga zona propia (0170 n.º 4, provisional).

## Observaciones sin cambio (editor)

- La línea horizontal que cruza el carril central es la línea base de la onda de fondo (pista sintética sin picos): es lo esperado.
- En la vista previa, una línea de Todos aparece en la zona de cada cantante: es lo diseñado ([07](../../07-reproductor.md), C1-R4).
- A 1024 × 576 la lista muestra fila y media, y la cabecera «Líneas» corta el recuento cuando aparece la bandera de la revisión guiada. Ya pasaba en 0.2.2 y no es de esta feature.
