# Guía manual · 0.2.3 · Feature 3 · Voces a la vez (provisional)

> **No ejecutada todavía.** La feature entra de forma provisional (pregunta 0165, fila 10): el usuario la confirma o la retira después de esta prueba. Recoge lo que solo se comprueba con **un dúo real** (frases que se cruzan, de oído y a distancia) y con **otras versiones** de la aplicación. Las reglas, la geometría y el editor ya tienen pruebas ([informe](../../versiones/0.2.3/informe-feature-3.md)).

- Versión: 0.2.3 · Feature 3
- Specs: [06 · Voces a la vez](../../ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto) (C1S-E1 a E7) · [07 · Voces a la vez](../../ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto) (C1S-R1 a R4) · ADR [0029 §7](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md)
- Informe: [informe-feature-3](../../versiones/0.2.3/informe-feature-3.md)
- Duración estimada: 1 h 15 min
- Requisitos: **un dúo real** con frases cruzadas (uno responde mientras el otro sigue), listo y sincronizado; un reproductor de video externo; instalaciones de 0.2.1 y de 0.2.2 (o sus carpetas de datos de prueba) para el caso 5.

## Preparación

1. `npm run semilla -- --reparto --voces` (en `app/`): crea «Voces a la vez: dúo con coro» (Marta e Iván, con solapes, un coro que acompaña y una línea de Todos sin solape). Va a `app/.datos-dev`, no a tu carpeta real. Su audio es silencio: sirve para ver.
2. `npm run dev` abre la aplicación con esos datos.

## Casos

### 1. La canción de la semilla en el editor

Criterios: C1S-E1 a E3, C1S-E6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Abre «Voces a la vez: dúo con coro» en el editor. | Las regiones de Marta, Iván y el Coro se solapan en el tiempo, cada una completa en su carril. Las líneas que empiezan mientras suena otra llevan el icono de capas con «Suena a la vez que la línea N». | ☐ |
| 1.2 | Arrastra el tirador de fin de una línea de Marta más allá del inicio de la siguiente de Iván. | Se permite y se guarda. | ☐ |
| 1.3 | Arrástralo más allá del inicio de la siguiente línea **de Marta**. | No se permite: el tirador se queda en el límite. | ☐ |
| 1.4 | Selecciona una línea de Iván que se solape con otra de Iván (o crea el caso) y prueba a asignársela por el menú, C, Alt + 1…4, Alt + ↑/↓ y arrastre. | Ninguna vía lo permite y se explica: «No puede ser de Iván: se solapa con su línea N». | ☐ |
| 1.4b | En el menú «¿Quién canta?» mira la opción inactiva. | La parte inactiva muestra el motivo en hasta dos renglones, sin cortarlo con «…». | ☐ |
| 1.5 | Pulsa «Juntar carriles». | Ninguna región tapa a otra: la pista se divide en sub-filas (de 2 a 5 según las líneas a la vez). Cada región se puede seleccionar con un clic y conserva su sub-fila al hacer zoom y al desplazar. | ☐ |
| 1.6 | Ejecuta «Ajustar los silencios» y la comprobación de la letra. | No cambian las líneas que suenan a la vez y el resumen dice cuántas no se han tocado. | ☐ |
| 1.7 | En Estilo › Letra en pantalla › «Varias voces», elige «Todas en un bloque». | Aparece la nota «Esta canción tiene voces a la vez: en un bloque solo se ve una cada vez…» con «Ver en zonas». | ☐ |
| 1.8 | Pulsa «Ver en zonas». | Vuelve a «Cada una en su zona» en un paso de deshacer y la nota desaparece. | ☐ |

### 2. Un dúo real con frases cruzadas, en el reproductor

Criterios: C1S-R1, C1S-R2, C1S-R4.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | En tu dúo real, marca las respuestas que se cruzan con un cantante distinto y extiende los fines con los tiradores hasta donde suena de verdad. Anota cuánto cuesta. | Los solapes se guardan sin avisos raros. | ☐ |
| 2.2 | Reprodúcelo a pantalla completa y míralo desde 5 m, con el audio. | Cada voz barre en su zona a la vez que la otra; la que canta ahora está al 100 % y la que espera al 55 %. Se sigue sin perder el hilo. Anota si con tres barridos a la vez (dos cantantes y coro) la pantalla se siente cargada. | ☐ |
| 2.3 | Mira lo ya cantado de cada voz durante un solape. | El color de lo ya cantado es exactamente el de su parte: no se mezcla, aclara ni apaga por sonar a la vez (revisión del diseñador, C1S-R4). Compáralo con el mismo color cuando no hay solape. | ☐ |
| 2.4 | Mira un hueco largo justo después de un solape. | Los indicadores de espera salen solo cuando no suena ninguna zona, una vez, en la primera zona. | ☐ |
| 2.5 | Reproduce en una ventana de 1280 × 720 y de 1920 × 1080. | Las insignias se leen y ninguna línea se corta. | ☐ |
| 2.6 | Reproduce con «Todas en un bloque». | Se ve una sola línea cada vez, como en 0.2.2 (limitación aceptada, pregunta 0380). | ☐ |
| 2.7 | Con la ventana secundaria abierta en otra pantalla, reproduce el dúo. | Igual que la principal (usa el mismo componente: no tiene prueba propia). | ☐ |
| 2.8 | Mira a ojo la fluidez durante los solapes más cargados (tres barridos). | Sin tirones. La medida de la tarea 0360 fue de 60 FPS sostenidos en un MacBook M1; anota si en tu equipo se nota algo. | ☐ |

### 3. Video con voces a la vez

Criterios: C1-V1 (modelo del video igual al del reproductor).

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Exporta «Voces a la vez: dúo con coro» y también tu dúo real a video, y ábrelos en un reproductor externo. | Cada zona barre a su vez y las dos (o tres) a la vez en los solapes, igual que el reproductor, en los mismos instantes. | ☐ |
| 3.2 | Compara tres instantes de solape entre el reproductor y el video. | Mismas zonas, colores e insignias. | ☐ |

### 4. Sin solapes todo sigue igual

Criterio: C1S-E5 y regla de oro de la versión.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Abre «Reparto: dúo con coros» (sin solapes) y reprodúcela. | Se ve como con la feature 1: zonas, colores e insignias, sin iconos de capas ni notas. | ☐ |
| 4.2 | Arrastra el tirador de fin de una línea de Ana hasta pasar el inicio de la siguiente línea de **Todos**. | No se permite: Todos cuenta como de todos los cantantes, así que choca con Ana (como choca con Luis). El tirador se queda en el límite. | ☐ |
| 4.3 | Arrastra el fin de una línea de Ana hasta pasar el inicio de la siguiente línea del **Coro**. | Se permite (Ana y el Coro pueden sonar a la vez): la canción pasa a tener voces a la vez y la línea siguiente lleva el icono de capas. Deshaz con Ctrl/Cmd + Z. | ☐ |
| 4.4 | Arrastra el fin de una línea más allá de una **pausa** (línea vacía con inicio). | No se permite: una pausa choca con todo. | ☐ |

### 5. Compatibilidad: abrir en 0.2.1 y 0.2.2

Aceptada en la pregunta 0365: una canción con solapes se ve dañada en versiones anteriores, **sin perder nada**.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Copia la carpeta de «Voces a la vez: dúo con coro» (la que tiene `cancion.json`) a la biblioteca de **0.2.1**. Anota la fecha y el tamaño de `cancion.json`. | — | ☐ |
| 5.2 | Abre 0.2.1. | La canción aparece **dañada** (la letra no es válida: las líneas se pisan). No se cierra la aplicación ni se pierden las demás canciones. | ☐ |
| 5.3 | Mira `cancion.json` de esa canción. | Fecha, tamaño y contenido idénticos a los del paso 5.1: 0.2.1 no ha reescrito nada. | ☐ |
| 5.4 | Repite 5.1–5.3 con **0.2.2**. | El mismo resultado (medido: 0.2.2 también rechaza la letra). | ☐ |
| 5.5 | Copia «Reparto: dúo con coros» (**sin** solapes) a 0.2.1 y a 0.2.2. | En 0.2.2 se abre y conserva el reparto. En 0.2.1 se abre como una sola voz, sin error (ver el caso 7 de la guía de la feature 1). | ☐ |
| 5.6 | Vuelve a abrir «Voces a la vez» en 0.2.3. | Funciona con normalidad: no se ha perdido nada. | ☐ |

Texto para las notas de la versión (propuesto): «Las canciones con voces a la vez (frases de partes distintas que se solapan) no se pueden abrir en versiones anteriores de Shinobi Karaoke: se ven como dañadas, pero no se pierde nada y vuelven a funcionar en 0.2.3.»

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
