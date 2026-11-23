# Guía manual · 0.2.3 · Feature 2 · Voz en los coros

> **No ejecutada todavía.** Es lo que ninguna prueba automática puede decidir: **oído** (mezcla, chasquidos en las rampas, voz guía silenciada y al 30 %), **memoria del editor** con canciones largas, **ventana secundaria** con dos niveles de coros y **video** con y sin la casilla en un reproductor externo. Las ganancias, los tramos y la envolvente ya se comprueban con pistas sintéticas ([informe](../../versiones/0.2.3/informe-feature-2.md)).

- Versión: 0.2.3 · Feature 2
- Specs: [06 · Feature 2](../../ux/06-editor.md#023--feature-2--voz-en-los-coros) (C2-E1 a E8) · [07 · Feature 2](../../ux/07-reproductor.md#023--feature-2--voz-en-los-coros) (C2-R1 a R6) · [10 · Feature 2](../../ux/10-exportacion.md#023--feature-2--voz-de-los-coros-en-el-video) (C2-V1 a V7) · ADR [0030](../../adr/0030-voz-original-en-las-lineas-de-coro.md)
- Informe: [informe-feature-2](../../versiones/0.2.3/informe-feature-2.md)
- Duración estimada: 2 h
- Requisitos: **auriculares o altavoces buenos**; **3 canciones reales con coros** (listas, con voz separada y con sus coros marcados: Coro asignado o «Marcarlas como coro»), y de ellas una de **4 minutos** y otra de **10 minutos** (o la más larga que tengas); un reproductor de video externo (VLC o QuickTime); el Monitor de Actividad (macOS) o el Administrador de tareas (Windows); una segunda pantalla.

## Preparación

1. Trabaja sobre una copia de tu biblioteca de pruebas. Las canciones de la semilla (`npm run semilla -- --reparto`) tienen el audio en silencio y **no sirven para oír**: úsalas solo para ver la interfaz (por ejemplo «Reparto: un cantante con coros»).
2. Elige 3 canciones reales con coros y ponles un reparto (al menos las líneas de coro asignadas al Coro). Anótalas como A, B y C.
3. Ten claro lo que se espera oír: **solo en las líneas de coro, suena la voz original al nivel elegido, aunque la voz guía esté silenciada**. Fuera de los coros, la voz guía suena como ella esté. Límite conocido: si en esas líneas canta también la voz principal, también se oirá.

## Casos

### 1. Chasquidos y mezcla en el editor (A, B y C)

Criterios: C2-E2, C2-E3, C2-E6; límite de las rampas (150 ms) de la spec.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | En el editor, Funciones › «Cantantes y coros» › «Voz en los coros». Pon el deslizador en **0 %** y elige «Escuchar: Instrumental». Reproduce por encima de un coro de A. | Instrumental puro, sin voz, también dentro del coro. Se anuncia «Sin voz (0 %)». | ☐ |
| 1.2 | Pon **50 %** y repite sobre 3 coros de A. | Al entrar a cada coro la voz sube suavemente y al salir baja suavemente. **Sin chasquidos, clics ni saltos de volumen** en la entrada ni en la salida. Anota cuántos coros revisaste. | ☐ |
| 1.3 | Pon **100 %** y repite. | La voz suena a su volumen original en los coros, sin distorsión; fuera, solo el instrumental. Sin chasquidos. | ☐ |
| 1.4 | Repite 1.1–1.3 con B y con C. | Mismo resultado. Si oyes un chasquido, anota canción, nivel, el tiempo y si es al entrar o al salir (la rampa de 150 ms es un valor provisional de `coros.ts`). | ☐ |
| 1.5 | Con 50 %, usa «Escuchar un coro». | Suena de 2 s antes a 1 s después de la siguiente línea de coro, pausa sola y el cabezal vuelve a donde estaba. Esc lo detiene. | ☐ |
| 1.6 | Con «Escuchar: Original» y luego «Voz», reproduce un coro. | La mezcla no cambia al mover el deslizador (solo afecta a «Instrumental»). | ☐ |
| 1.7 | Mueve el deslizador a ráfagas (flechas, Re Pág) y reproduce. | El audio no se corta al rehacer la mezcla (unos 300 ms después del último cambio). Si el cálculo tarda más de medio segundo se lee «Preparando los coros…» junto al selector; anota con qué canción. | ☐ |
| 1.8 | Activa los bucles de «Bloquear enunciado» y la velocidad 0,5× y 0,75× sobre un coro. | El bucle y la velocidad funcionan igual que con el instrumental solo, sin chasquidos al repetir. | ☐ |

### 2. Reproductor: voz guía silenciada y al 30 %

Criterios: C2-R1 a R5.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Reproduce A a pantalla completa con la voz guía **silenciada** (tecla V). | Se lee «Voz silenciada · coros al N %». En cada coro suena la voz original al nivel de la canción, y fuera de él, nada. | ☐ |
| 2.2 | Escucha 3 entradas y salidas de coro. | Sin chasquidos. | ☐ |
| 2.3 | Pon la voz guía al **30 %**. | Fuera de los coros suena al 30 %; dentro, al nivel de los coros de la canción (por ejemplo 50 %): se nota un cambio de volumen al entrar, sin clic. | ☐ |
| 2.4 | Pon la voz guía al **80 %** (más que el nivel de los coros). | Suena al 80 % en todas partes: no hay bajón al entrar en el coro. | ☐ |
| 2.5 | Busca con la barra de tiempo al centro de un coro. | La voz suena ya a su nivel desde el primer instante, sin subida desde cero. | ☐ |
| 2.6 | Pausa y reanuda dentro de un coro. | El nivel no cambia. | ☐ |
| 2.7 | Repite 2.1–2.3 con B y con C. | Mismo resultado. Anota canción y momento de cualquier chasquido. | ☐ |
| 2.8 | Reproduce una canción **sin coros** y pulsa V. | Se lee «Voz silenciada» (sin coros) y no suena nada de la voz. | ☐ |

### 3. Ventana secundaria con dos niveles de coros

Criterio: C2-R6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Pon el nivel de coros de A al 20 % y el de B al 70 % (cada una en su editor). | Se guarda en cada canción. | ☐ |
| 3.2 | Con la ventana secundaria abierta, encola A y B y deja que suenen seguidas, con la voz guía silenciada. | En A los coros suenan al 20 % y, en B, al 70 %: cada una con su nivel, sin arrastrar el de la anterior. | ☐ |
| 3.3 | Salta entre las dos con «Siguiente» y vuelve. | Cada una conserva su nivel. | ☐ |

### 4. Memoria del editor con canciones de 4 y 10 minutos

Criterio: riesgo de memoria de la tarea 0352 (derivada ≈ 92 MB a 4 min y ≈ 230 MB a 10 min, **calculadas, no medidas**).

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Abre el Monitor de Actividad y anota la memoria de la aplicación recién abierta (proceso de la ventana del editor). | Cifra inicial anotada. | ☐ |
| 4.2 | Abre en el editor la canción de **4 minutos** con coros, pon «Escuchar: Instrumental» y espera a que desaparezca «Preparando los coros…». Anota la memoria. | El editor sigue fluido. Anota el aumento (previsto ≈ 100 MB sobre las pistas). | ☐ |
| 4.3 | Cambia el nivel de coros 10 veces seguidas y anota el pico de memoria. | La memoria sube durante el cálculo y baja después; no crece sin parar. | ☐ |
| 4.4 | Repite 4.2 y 4.3 con la de **10 minutos**. | El editor no se bloquea ni se cierra; el pico previsto es unos 230 MB más el cálculo. Anota las cifras reales: si pasan de 1 GB de aumento, pásalas a una pregunta. | ☐ |
| 4.5 | En la de 10 min, abre otra canción y vuelve. | Anota si la memoria baja al cambiar de canción (se espera que la pista derivada de la anterior se libere; si no baja, es un hallazgo). | ☐ |
| 4.6 | Fuerza un fallo: renombra la pista de voz de una copia mientras el editor está abierto y cambia el nivel. | Suena el instrumental y aparece el aviso de que no se pudo preparar la voz de los coros **una sola vez**. | ☐ |

### 5. Video «Solo instrumental» con y sin la casilla, en un reproductor externo

Criterios: C2-V1 a V6.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Exporta A a video con «Solo instrumental». | La casilla «Incluir la voz en los coros (N %)» aparece marcada. Con «Instrumental y voz» no hay casilla. | ☐ |
| 5.2 | Con la casilla **marcada**, exporta. Ábrelo en VLC o QuickTime. | Solo en las líneas de coro suena la voz, al nivel de la canción. Fuera, solo instrumental. **Sin chasquidos** en las entradas y salidas. | ☐ |
| 5.3 | Exporta de nuevo con la casilla **desmarcada**. | Solo instrumental, sin voz en ningún punto. Igual que con 0.2.2. | ☐ |
| 5.4 | Abre el diálogo otra vez. | Recuerda la elección anterior. | ☐ |
| 5.5 | Pon en una canción el nivel de coros al 0 % y abre el diálogo. | Se lee que el video saldrá sin voz y no hay casilla. | ☐ |
| 5.6 | Exporta un lote con 2 canciones con coros (20 % y 70 %) y 3 sin ellos. | La casilla del lote dice que se aplica a las canciones que los tienen, cada una a su volumen; cada video lleva la voz de sus coros a su nivel. | ☐ |
| 5.7 | Compara el coro del video con el del reproductor. | Suenan igual (mismos tramos y mismo nivel). | ☐ |
| 5.8 | Exporta una canción sin coros con «Solo instrumental». | No hay casilla y el audio es idéntico al de 0.2.2. | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
