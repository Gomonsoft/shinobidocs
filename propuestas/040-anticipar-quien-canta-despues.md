# 040 — Anticipar en pantalla quién canta después

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md), caso 4 (legibilidad); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-1
- Fecha: 2026-11-23
- Relacionadas: spec [07 · Feature 1](../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla) («Disposición por zonas», C1-R2 a C1-R8), pregunta [0360](../preguntas/0360-indicadores-de-espera-sobre-la-linea-en-una-zona-y-tamano-del-coro.md), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md)

## Problema

En un dúo, entre una línea y la siguiente todas las zonas se ven igual de atenuadas: las líneas próximas de los dos cantantes esperan en gris/opaco y nada indica cuál de las dos entra primero. Quien canta no sabe si le toca hasta que su línea empieza a barrerse. En palabras del usuario: «no se sabe quién cantará después; lo conveniente es que se ilumine de antemano el cantante que cantará, no que se quede solo en gris/opaco».

Visto en el reproductor (0.2.3-alpha.1, Windows, 1718 × 1386, en pausa a los 00:23, entre el fin de la línea 1 y el inicio de la línea 2, las dos del cantante 1): las cuatro líneas en pantalla (dos por zona) y las dos insignias tienen la misma atenuación. Captura del usuario: `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\No se sabe cual sera el siguiente cantante en cantar.png` (no copiada al repositorio).

## Propuesta

Resaltar por adelantado la parte que canta a continuación: durante el hueco anterior a una línea, su zona (la insignia y la línea próxima) se ilumina o sube de opacidad respecto a las demás, que siguen atenuadas. El detalle (cuánto antes, si es la insignia, la línea o las dos, y cómo convive con la barra y la cuenta 3·2·1 de los huecos largos) es del diseñador UX.

## Valor y coste

- Valor: es la información que más necesita un dúo en un karaoke (a quién le toca) y hoy solo llega cuando la línea ya empezó. Afecta al reproductor, a la ventana secundaria y al video exportado.
- Coste: sin estimar (lo valora el arquitecto). Toca la disposición por zonas del reproductor y las mediciones de opacidad y color añadidas en 0.2.3.
- Riesgos: la regla de oro (una voz, sin reparto: imagen idéntica a 0.2.2); el caso de voces a la vez (dos partes entran casi juntas); no confundir «próxima» con «cantándose».

## Valoración de diseño

(Diseñador UX, 2026-11-23. No cambia ninguna spec: es para que el usuario decida.)

**Recomendación: hacerla, en 0.2.3 antes de publicar**, si el arquitecto confirma que es un cambio acotado (la opacidad de cada zona ya es una función del tiempo). La verificación manual de la feature 1 pregunta justo esto («¿cada uno sabe a tiempo cuándo entra mirando solo su zona?») y con el dúo real la respuesta fue que no: es la carencia más importante de la disposición por zonas.

**Por qué pasa hoy.** En la captura, el hueco entre la línea 1 y la 2 dura 1,9 s; los indicadores de espera (barra, cuenta, puntos) solo salen en huecos de al menos el silencio mínimo de la canción (4 s por defecto), así que no había ninguno. Y como la línea siguiente era del mismo cantante, su zona estaba al 55 %, igual que la otra. En un dúo casi todos los relevos son huecos cortos o sin hueco: la única señal de «te toca» es la que ya llega tarde (el barrido).

**Opciones** (la recomendada primero):

| | Qué se ve | A favor | En contra |
|---|---|---|---|
| **A · La zona que entra se enciende antes** (recomendada) | Cualquier línea que vaya a empezar en los próximos **2 s** y aún no suene se marca como «anunciada»: su texto sube del 55 % al **85 %** y su insignia al **100 %**. La que suena sigue al 100 % y es la única con barrido. Vale haya hueco o no (también mientras el otro cantante aún canta) y también cuando repite el mismo cantante (el caso de la captura). | Es lo que pidió el usuario («que se ilumine»). Una sola regla, que no depende del color: se lee en escala de grises. Los tres estados quedan ordenados: en espera 55 %, anunciada 85 %, cantando 100 % con barrido. | Toca las mediciones de opacidad de 0.2.3. Con una letra de poco contraste, el suelo de contraste puede subir el 55 % cerca del 85 % y la diferencia se reduce (queda la insignia). |
| B · Solo se enciende la insignia | La insignia de la línea anunciada pasa de borde a relleno en el color de su parte; la línea sigue al 55 %. | Cambio mínimo; no toca la opacidad de las líneas. | La insignia es pequeña (0,6 em): a 5 m apenas se ve. Depende del color, que no debe ir solo. |
| C · Puntos en cada relevo | Los puntos ●●● (que ya van en el color de la parte que entra) salen en todo cambio de cantante, aunque el hueco sea corto. | Reutiliza un elemento conocido. | Los puntos tardan 3 s en apagarse y no caben en relevos pegados; no ilumina al cantante, que es lo pedido. |

**Detalle de A** (provisional, para cerrar en la spec si se aprueba):
- **Cuánto antes**: 2 s antes del inicio de la línea. Es el tiempo de prepararse y tomar aire sin que la zona pase media línea del otro «encendida». Con relevos muy seguidos (líneas de 2–3 s) casi siempre habrá dos zonas visibles: la que canta y la que viene, que es justo la información útil.
- **Qué se ilumina**: solo la línea que está en el sitio principal de la zona y su insignia. La «siguiente» al 70 % de tamaño no cambia.
- **Barra de espera y cuenta 3·2·1**: no cambian; ya se dibujan en la zona de la línea que viene. En un hueco largo, la cuenta empieza a los 3 s y la zona se enciende a los 2 s: se lee como una progresión («3» en la zona que espera, la zona se enciende, «2», «1», entra). Los puntos ●●● tampoco cambian.
- **Todos**: se anuncia en todas las zonas de cantante a la vez (ya se dibuja en todas). **Coro**: su zona se anuncia igual que una de cantante.
- **Voces a la vez**: la regla «toda línea que empiece en los próximos 2 s» cubre sola dos entradas casi juntas (se encienden las dos zonas) y una entrada mientras otra parte canta (85 % sin barrido junto a 100 % con barrido).
- **Letra lista** (sin barrido): la que suena se distingue de la anunciada solo por 100 % frente a 85 %. Es la parte más débil; se comprueba en la verificación manual.
- **«Todas en un bloque»**: sin cambios. El bloque de 0.2.2 ya muestra la línea siguiente en su sitio y C1-R10 pide que sea el mismo fotograma de 0.2.2 salvo colores, insignias y paréntesis.

**Reglas que toca**:
- **Regla de oro** (una sola voz, sin reparto: imagen idéntica a 0.2.2): no se toca. Solo actúa en la disposición por zonas.
- **Criterios**: C1-R3 (la zona que espera ya no está siempre al 55 %), C1-R9 (convivencia con los indicadores), C1-R11 (mismo modelo en vista previa, reproductor, secundaria y video), C1-R12 (captura nueva `duo-anuncia`), C1S-R1 y C1S-R2 (voces a la vez). Además, la fila «Opacidad» del sistema visual y las filas «Quién canta ahora» y «Paso de un cantante a otro» de la spec 07. Las mediciones de opacidad en la app real añadidas en 0.2.3 cambian de valor esperado.
- **Daltonismo y contraste**: la señal es opacidad, no color; con un filtro de grises se sigue viendo quién viene. El suelo de contraste se aplica también al 85 %.
- **Reducción de movimiento**: el paso de 55 % a 85 % usa la misma transición que el cambio de opacidad de hoy (instantáneo con movimiento reducido). No hay movimiento nuevo.
- **Video exportado**: sale igual (mismo render), sin opción aparte.

**Preguntas para el usuario**:
1. ¿Con cuánta antelación quieres que se encienda la zona del que entra? Recomendado: **2 s**. Con 1 s puede llegar justo; con 3 s, en relevos rápidos la zona se enciende casi al empezar la línea del otro.
2. ¿Se ilumina la línea entera y su insignia (recomendado) o solo la insignia?
3. ¿También cuando el que sigue es el mismo cantante, como en tu captura? Recomendado: sí; sin eso, tras una pausa corta nadie sabe que vuelve el mismo.

## Valoración técnica

(Arquitecto, 2026-11-23. Leído el código de `c6c0ba8`; nada ejecutado salvo lectura. No cambia ningún ADR.)

**Recomendación: hacerla en 0.2.3 antes de publicar**, con la opción A del diseño, después de lo seguro de I-1 (punto 1a del plan 6). Es un cambio acotado a una función pura del tiempo que ya existe, sin datos nuevos y con la regla de oro protegida por construcción.

**Dónde vive hoy (verificado en el código).** La opacidad de una zona es una función pura del instante: `opacidadDeZona` en `renderer/src/karaoke/render.ts` (1 mientras suena una línea de la zona, `ZONA_OPACIDAD_INACTIVA` = 0,55 si no, con el cambio lineal en `D`). `fotogramasDeZonas` (`karaoke/zonas.ts`) la calcula por zona y `disponerBloque` (`karaoke/pantalla.ts`) la multiplica por la de **todos** los puestos de la zona antes del suelo de contraste. Las cuatro superficies (vista previa del editor, reproductor, ventana secundaria y video exportado) pintan con el mismo `PantallaLetra`, y el video por fotogramas con `tiempoFijoMs` (ADR 0018 §2 y revisión 0.2.1). Lo que se cambie ahí sale igual en las cuatro, sin código aparte.

**Qué habría que cambiar (opción A del diseño).**
- `render.ts`: un estado «anunciada» para la línea del puesto principal de la zona cuando su inicio está a menos de `ZONA_ANTICIPACION_MS` (2000) y aún no suena: su opacidad sube de 0,55 a `ZONA_OPACIDAD_ANUNCIADA` (0,85) con la misma transición de hoy (instantánea con movimiento reducido). Como el diseño quiere que la línea siguiente al 70 % **no** cambie, no basta con subir `opacidadZona` (que multiplica todos los puestos): hace falta un factor propio del puesto 0. Es una función de `t`, del inicio de la próxima línea de la zona (ya lo conoce `fotogramaEn`) y de las constantes.
- `pantalla.ts` (`disponerBloque`): aplicar ese factor al puesto 0, antes del suelo de contraste (el suelo sigue valiendo: subir la opacidad solo mejora el contraste).
- `PantallaLetra.tsx` y `pantallaLetra.module.css`: la insignia al 100 % en la anunciada. Hoy la insignia está dentro del nodo de la línea y hereda su opacidad; necesita una variable propia (`--k-opacidad-insignia` o similar) escrita por fotograma, como las demás.
- `shared/pantalla.ts`: dos constantes con nombre.
- Sin cambios en `main/`, IPC, esquemas ni exportación.

**Coste: pequeño.** Unas 4 fuentes del renderer y sus pruebas. Pruebas de feedback: `render.test.ts` (el estado «anunciada» en los 2 s previos, con y sin hueco, misma parte y otra parte, Todos en todas las zonas, dos entradas casi juntas, movimiento reducido), `zonas.test.ts`, `PantallaLetraReparto.test.tsx` (la insignia y la siguiente al 70 % sin cambio) y la prueba de regresión C1-R1 (una canción sin reparto da el mismo fotograma que 0.2.2 en 50 instantes), que debe seguir pasando sin tocarla. E2E: cambian los valores esperados de `e2e/voces-medicion.spec.ts` (mediciones de opacidad en la app real de C1S-R1 y C1S-R4) y la captura nueva `duo-anuncia` de `capturas-023.spec.ts`. Manual: el caso 4 de la guía de la feature 1 (a 5 m y en escala de grises), también en un video exportado.

**Riesgos.**
- **Regla de oro**: protegida por construcción. Sin reparto, o con «Todas en un bloque», `zonasDeLetra` devuelve el bloque único y el cálculo de opacidad por zona no se ejecuta (`subidaAlSalir` ausente). La prueba C1-R1 lo vigila.
- **Voces a la vez**: la regla por línea («empieza en los próximos 2 s y aún no suena») es local a cada zona, así que dos entradas casi juntas encienden las dos zonas sin lógica nueva. Los solapes no cambian la regla.
- **Confundir «anunciada» con «cantándose»**: lo separan la opacidad (85 % frente a 100 %) y el barrido. En «Letra lista» (sin barrido) solo queda la diferencia de opacidad; es el caso débil que el diseño manda a la verificación manual.
- **Suelo de contraste**: con una letra de poco contraste, el suelo puede subir el 55 % cerca del 85 % y la diferencia se achica (queda la insignia). Es una cuestión visual, no técnica.

**Compatibilidad de datos: ninguna.** No hay campo nuevo en `cancion.json`; las canciones repartidas con 0.2.3-alpha.1 se ven con la regla nueva sin tocarlas; 0.2.1 y 0.2.2 no tienen zonas.

**Video exportado y rendimiento.** El video sale con el anuncio, igual que la pantalla (los ya exportados no cambian hasta volver a exportar). Coste por fotograma despreciable: una comparación y una interpolación más por zona, sin medidas de texto ni repintados nuevos; el fotograma sigue siendo determinista en `t`.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
