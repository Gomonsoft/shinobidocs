# 043 — «Ajustar los silencios»: que el fin no corte la voz que sigue a un silencio dentro de la misma línea

- Estado: Idea
- Origen: prueba manual del usuario en Windows con canciones reales (2026-11-23); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-4
- Fecha: 2026-11-23
- Relacionadas: ADR [0018](../adr/0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) §6.1 y §6.4, ADR 0025 §2 (variante prudente de la preparación), guía [fase 5 · calibración de silencios](../Test-manuales/0.2.0/fase-5-calibracion-de-silencios.md), tarea 0210

## Problema

«Ajustar los silencios» pone el fin de una línea al final de la voz **anterior al primer silencio** de su ventana (del inicio de la línea al inicio de la siguiente). Si dentro de la línea hay una pausa de 400 ms o más y después se canta la última palabra, el fin queda en la pausa y esa palabra se queda fuera de la línea: en pantalla el barrido termina antes de que acabe de cantarse. En palabras del usuario: «a veces en una sola línea hay un silencio y luego sigue la última palabra antes del inicio que nos dio la línea siguiente».

Comprobado en el código (`app/src/shared/silencios.ts`, `buscarFinVoz`: «Fin de la voz previa al primer silencio de la ventana»): es el comportamiento diseñado, no un fallo de la implementación. Lo usan igual el botón «Ajustar los silencios» del editor y los fines de la preparación desatendida (`pasoFines`, variante prudente).

Medido sobre 6 canciones reales preparadas ese día (solo cifras; mismo algoritmo y parámetros, voz detectada desde `pistas/voz.flac` a bloques de 10 ms): de 66 líneas en las que el algoritmo encuentra un silencio, en **27** queda voz (150 ms o más por encima del umbral) entre ese fin y el inicio de la línea siguiente; en 18 de ellas la voz llega hasta el propio inicio siguiente y en 6 son más de 1,5 s de voz. Detalle por canción en la nota. Límite de la medida: «voz después» incluye también respiraciones, restos de la separación y entradas adelantadas de la línea siguiente; no se ha escuchado.

## Propuesta

El usuario sugiere **respetar los inicios que da la letra**: el inicio de la línea siguiente marca hasta dónde puede llegar la actual, y el fin debería ir tras la **última** voz antes de ese inicio, no tras la primera pausa. Queda para el arquitecto y el diseñador la regla exacta; opciones a medir con la herramienta de calibración (`npm run calibrar:silencios`):

- fin tras el último tramo de voz de la ventana, si entre él y el inicio siguiente hay un silencio suficiente;
- o la regla actual, pero ignorando un silencio interior cuando después vuelve a haber voz dentro de la misma ventana;
- en los dos casos, sin tocar nunca los inicios (hoy ya no se tocan).

## Valor y coste

- Valor: menos fines que hay que rehacer a mano tras «Ajustar los silencios» y tras la preparación desatendida; afecta al criterio de «hecha» de las features 5 y 11 de 0.2.2.
- Coste: sin estimar. Cambia una regla aceptada en un ADR y sus pruebas; hay que recalibrar.
- Riesgos: en líneas seguidas de un silencio largo con ruido o restos de otra voz, el fin se iría demasiado tarde (se perdería el hueco que activa la espera); la entrada adelantada de la línea siguiente contaría como voz de la actual.

## Valoración de diseño

(Diseñador UX, 2026-11-23. La regla exacta es del arquitecto; aquí solo lo que ve el usuario. No cambia ninguna spec.)

**Recomendación: hacerla con cambios, en 0.2.3 antes de publicar si la calibración con las 6 canciones de la nota lo confirma** (menos fines que rehacer y ningún hueco perdido por una respiración); si no, en la versión siguiente. El plan 6 ya reabre la preparación automática (punto 2), y es el mismo paso de fines: conviene calibrarlos juntos. El cambio de regla debe venir con un límite claro: **incluir la voz que sigue a una pausa dentro de la línea, pero no comerse el hueco** por una respiración, un resto de la separación o la entrada adelantada de la línea siguiente.

**Lo que ve hoy el usuario.** En una línea sin tiempos por palabra, el barrido va de forma uniforme del inicio al fin. Con el fin en la pausa interior, el barrido acaba antes de la última palabra, y esa palabra se canta sin guía. Además, la app se contradice: la revisión guiada puede señalar esa misma línea como «El fin corta la voz: sigue {d} s más», y su arreglo rápido «Fin al final de la voz» usa la regla de hoy, así que vuelve a poner el fin en la misma pausa. El botón ofrecido para arreglarlo no lo arregla.

**Qué cambiaría a la vista**:
- **«Ajustar los silencios»**: mismo botón y mismo diálogo. Cambia la explicación (`edi.silencios.explicacion`, hoy «buscará en la voz el primer silencio después de cada línea…»): pasaría a decir algo como «llevará el fin de cada línea al último momento con voz antes de la línea siguiente, sin contar respiraciones». Los recuentos bajarán: habrá menos «silencios largos» y, por tanto, la cuenta 3·2·1 se activará sola en menos canciones.
- **Revisión guiada**: «Fin al final de la voz» debe usar la misma regla nueva (si no, sigue el contrasentido de arriba). Saldrán menos líneas con «El fin corta la voz».
- **Espera entre líneas**: con fines más tardíos, los huecos son más cortos. Algunos bajarán del silencio mínimo (4 s por defecto) y perderán la barra, la cuenta y los puntos. Es lo correcto si la voz seguía, pero es el **mayor riesgo**: con restos de voz en un interludio, el fin llegaría hasta la línea siguiente, la línea «duraría» varios segundos más y su barrido iría lento en **toda** la línea, no solo al final. Quien canta perdería la cuenta justo donde más la necesita.
- **Canciones ya sincronizadas**: no cambian solas. Solo cambia lo que se calcule a partir de entonces (al pulsar el botón o en la preparación de canciones nuevas).

**Opciones** (la recomendada primero):

| | Qué hace | A favor | En contra |
|---|---|---|---|
| **A · Regla nueva sin interfaz nueva, con una marca en el diálogo** (recomendada) | La regla que fije el arquitecto con los límites de arriba. En «Ver las líneas» del diálogo, las líneas cuyo fin pasó por encima de una pausa llevan « · tras una pausa», para que el usuario sepa cuáles escuchar. | Arregla el caso medido (41 % de las líneas con silencio) sin pedir nada más al usuario. La marca deja revisar los casos dudosos sin convertirlos en «líneas dudosas». | Hay que recalibrar y cambiar pruebas (AS3, AS4, F11-E7). |
| B · Elegir la regla en el diálogo | El diálogo ofrece «Hasta la primera pausa» o «Hasta la última voz antes de la línea siguiente». | El usuario decide. | Sin escuchar no se puede elegir bien; añade una decisión técnica a una función que debe ser de un clic. Contra la simplicidad del MVP. |
| C · Dejar la regla y señalarlas | La regla no cambia; las líneas con voz después del fin se marcan para revisar (ampliando «El fin corta la voz» a los huecos de menos de 1 s). | Sin riesgo de comerse huecos. | Más trabajo a mano: el usuario ya rehízo esos fines; esto solo le dice dónde. |

**Reglas que toca**: ADR 0018 §6.1 (paso 3, «primer silencio») y §6.4 (calibración); AS3, AS4 y AS9 de «Ajustar los silencios» en la spec 06; F11-E7 («Fin al final de la voz» como «Ajustar los silencios» para una línea) y el motivo `finCorta` de la revisión guiada; el texto `edi.silencios.explicacion`; los criterios de «hecha» de las features 5 y 11 de 0.2.2 (se anota en su traspaso). **Voces a la vez**: sin cambios (las líneas solapadas siguen excluidas). **Regla de oro, daltonismo, contraste, reducción de movimiento**: no les afecta. **Video exportado**: solo cambia lo que ya cambia en la canción (fines), sin regla propia.

**Preguntas para el usuario**:
1. Cuando la app no está segura, ¿qué te molesta más: un barrido que termina antes de la última palabra (fin corto, lo de hoy) o un barrido algo lento que además quita la cuenta 3·2·1 en ese hueco (fin largo)? Recomendado: aceptar el fin largo solo cuando después de la pausa hay voz de verdad (no una respiración) y nunca si eso borra un hueco largo sin revisarlo.
2. ¿Te sirve que el diálogo marque las líneas cuyo fin «saltó» una pausa, para escucharlas tú (recomendado), o prefieres que no añada nada?

## Valoración técnica

(Arquitecto, 2026-11-23. Medido en solo lectura sobre la copia de la biblioteca del Mac; no se ha escuchado nada. Script: [`spikes/0030-fin-tras-ultima-voz/`](../spikes/0030-fin-tras-ultima-voz/medir.ts). No se enmienda el ADR 0018: el borrador va al final y lo decide el usuario.)

**Recomendación: hacerla en 0.2.3 antes de publicar, con la regla E2 de abajo** («saltar una pausa interior **corta** si después vuelve voz de verdad»), **después de pasar el mismo script por las canciones de Windows** con fines corregidos a mano (`701572c1` y `4cad645e`), que son la única referencia buena. Si allí E2 no mejora lo de hoy, se queda para la versión siguiente. Ni «el último tramo de la ventana» a secas (opción 1 de la propuesta) ni dejar la regla como está.

### Qué se midió y cómo

- **Muestra**: la copia de la biblioteca del Mac (`~/shinobi-pruebas-0.2.2/`), 17 canciones con tiempos (una no tiene inicios), **925 líneas** con línea siguiente. Voz detectada con `detectarVoz` y los parámetros actuales sobre la caché de picos de cada canción, igual que la app. Fines calculados «como si fueran automáticos» (sin `fin_ms` ni palabras), que es lo que hace la preparación.
- **Control**: la copia de la regla actual en el script da exactamente los mismos fines que `proponerAjusteSilencios` de la app en las 925 líneas (0 diferencias).
- **La herramienta `npm run calibrar:silencios` no sirve para esto**: solo recorre los parámetros de la regla actual (no compara reglas) y toma como verdad los fines fijados a mano en líneas sin palabras; en esta biblioteca solo hay uno por canción (la última línea, 14 en total). Por eso el script aparte.
- **Referencia de «fin correcto»**: en el Mac no hay fines corregidos a mano. Las dos canciones con tiempos por palabra (`8766c2f2` y `f538b75e`, 107 líneas) dan el fin de su última palabra; son palabras **importadas, no revisadas**, así que la referencia es aproximada.
- **«Queda voz»**: 150 ms o más de voz entre el fin y el inicio siguiente (el mismo criterio que la nota de Windows). **«Espera con voz dentro»**: un hueco de 4 s o más (el que activa la barra, la cuenta 3·2·1 o los puntos) con 0,5 s o más de voz dentro, es decir, la cuenta saldría mientras se sigue cantando. **«Espera limpia»**: con menos de 0,5 s de voz dentro.

### Reglas comparadas

- **Hoy (A)**: fin tras la voz anterior al **primer** silencio de 400 ms de la ventana.
- **B** (opción 1 de la propuesta): fin tras el **último** tramo de voz de la ventana, si le sigue un silencio de 400 ms hasta el inicio siguiente.
- **CD**: como B, pero un último tramo de menos de 300 ms de voz no cuenta (respiración, resto) y la voz que empieza en los 250 ms previos al inicio siguiente es de la línea siguiente (entrada adelantada).
- **E2** (opción 2 de la propuesta, con límites; recomendada): como hoy, pero se salta una pausa interior **de menos de 2 s** si después hay un tramo de al menos 300 ms de voz que no empieza en los 250 ms previos al inicio siguiente. Una pausa de 2 s o más **siempre** cierra la línea.
- **E3**: E2 con 3 s en lugar de 2.

(El script mide además variantes intermedias; no cambian la conclusión.)

### Resultados (medidos)

| Regla | Fines que pone | Queda voz después (de ellos, > 1,5 s) | Fines distintos de hoy | De ellos, vuelven al inicio siguiente (sin fin propio) | Esperas de 4 s o más | De ellas, con voz dentro | Esperas limpias de hoy que se pierden |
|---|---|---|---|---|---|---|---|
| **Hoy (A)** | 131 | **65** (21) | — | — | 20 | **15** | — |
| B | 53 | 0 (0) | 84 | 78 | 1 | 0 | **4 de 5** |
| CD | 106 | 27 (0) | 61 | 38 | 6 | 0 | 0 |
| **E2** | 93 | **21** (2) | 46 | 38 | 7 | **2** | **0** |
| E3 | 84 | 11 (1) | 56 | 47 | 7 | 1 | 0 |

Contra la referencia aproximada (107 líneas con palabras importadas; error medio con el fin que queda en cada línea, haya silencio o no):

| Regla | Error medio | Cortes (fin más de 150 ms antes de la última palabra) | Cortes de más de 1 s |
|---|---|---|---|
| Hoy (A) | 686 ms | 5 | 4 |
| B | 1 485 ms | 0 | 0 |
| CD | 664 ms | 3 | 2 |
| **E2** | **654 ms** | **1** | **1** |
| E3 | 654 ms | 1 | 1 |

Qué hay detrás del fallo de hoy (medido): en las 65 líneas en las que la regla actual deja voz después, la pausa en la que corta dura de 400 a 1 000 ms en 45, de 1 a 2 s en 6 y 2 s o más en 14; en 47 de las 65 la voz sigue hasta el propio inicio siguiente. Las 20 esperas que crea hoy son la otra cara: en 14 de ellas, tras una pausa de 0,4 a 1,4 s, siguen de 1,5 a 7,4 s de voz, es decir, la cuenta 3·2·1 saldría mientras se canta (supuesto razonable sin escuchar: puede ser voz que no está en la letra, como coros o improvisaciones, pero no es un silencio).

### Lectura

1. **El fallo es mayor en el Mac que en Windows** (50 % frente a 41 % de las líneas con silencio) y **tiene un segundo efecto que la propuesta no menciona**: la regla actual inventa esperas. De 20 huecos que activarían la cuenta, 15 tienen voz dentro.
2. **B (el último tramo, sin más) arregla la voz cortada pero rompe lo demás**: quita el fin propio a 78 líneas (vuelven a durar hasta el inicio siguiente), deja una sola espera y pierde 4 de las 5 esperas limpias, porque cualquier resto de voz al final del hueco cuenta como «último tramo». Contra la referencia, el error medio pasa de 686 a 1 485 ms. Es el riesgo que temían la propuesta y el diseño.
3. **E2 es la que mejor equilibra**: la voz que queda fuera baja de 65 a 21 líneas (y de 21 a 2 con más de 1,5 s), las esperas con voz dentro de 15 a 2, **no pierde ninguna espera limpia**, y contra la referencia tiene el menor error y el menor número de cortes (de 5 a 1). Su garantía es estructural: un silencio de 2 s o más cierra siempre la línea, así que un interludio con restos de voz no puede comerse el hueco, aunque los restos duren más de 300 ms.
4. **CD** se acerca en números, pero no tiene ese tope: en un interludio largo con restos, el fin saltaría hasta el último resto. Contra la referencia corta más (3 frente a 1).
5. **E3** deja aún menos voz fuera (11) con la misma referencia, a costa de saltar pausas de 2 a 3 s, que pueden ser ya un final. Por eso el valor de partida es 2 s, como constante con nombre que se recalibra con las canciones de Windows (1,5 / 2 / 3 s).
6. **No resuelve los otros fines mal puestos de la nota** (líneas 8, 17 y 18 de `701572c1`: el fin automático, que es el inicio de la línea siguiente, queda segundos antes de donde lo puso el usuario). Ninguna regla puede pasar del inicio siguiente; eso es de los inicios, no de los silencios.

**Supuestos y límites**: nada se ha escuchado; «voz» es lo que supera el umbral en la pista de voz separada (incluye respiraciones, coros no escritos y restos); la referencia del Mac son palabras importadas, no corregidas; las 6 canciones de Windows no se han medido con las reglas nuevas.

### Coste: pequeño

- **Código**: `shared/silencios.ts` (`buscarFinVoz` se reescribe sobre tramos, unas 30 líneas, y tres constantes nuevas en `PARAMETROS_SILENCIOS`). Es la única función que cambia y la usan los cuatro sitios: «Ajustar los silencios» del editor, «Fin al final de la voz» de la revisión guiada (así deja de contradecir al aviso «El fin corta la voz», como señala el diseño), los fines de la preparación desatendida (`pasoFines`, por `proponerAjusteSilenciosSinSolapes`) y las herramientas de calibración. Las líneas con voces a la vez siguen excluidas (`shared/solapes.ts`), sin cambios.
- **Pruebas de feedback**: `silencios.test.ts` (casos nuevos con picos sintéticos: pausa interior de 500 ms seguida de 1 s de voz, se salta; pausa de 2,5 s seguida de voz, cierra; tramo de 200 ms tras la pausa, no cuenta; voz que empieza 200 ms antes del inicio siguiente, no cuenta; voz que llega al inicio siguiente, la línea no cambia), revisar los existentes cuyo dibujo de voz tenga voz tras el primer silencio; `solapes.test.ts`, `DialogoAjustarSilencios.test.tsx` (si cambia el texto de la explicación) y las del servicio de preparación. E2E: la de `editor.spec.ts` («ajustar los silencios: propone, aplica…») usa una voz generada con silencios conocidos; hay que comprobar si su dibujo cambia de resultado.
- **Calibración**: añadir las tres constantes a la rejilla de `scripts/calibrar-silencios.ts` (opcional) y una ejecución del script de la prueba de concepto sobre la copia de la biblioteca de Windows.
- **Documentación**: revisión del ADR 0018 §6.1 y §6.4, textos AS3, AS4, AS9 y F11-E7 de la spec 06 (del diseñador) y una nota en `versiones/0.2.2/traspaso.md` (cambia el criterio de «hecha» de las features 5 y 11 de 0.2.2).

### Compatibilidad de datos, video y rendimiento

- **Esquema de `cancion.json`**: sin cambios. Los fines se siguen guardando en `fin_ms` con `origen_fin` `silencios` o `preparacion`, como hoy.
- **Canciones ya hechas** (también las repartidas con 0.2.3-alpha.1): no cambian solas. Solo cambia lo que se calcule después: al pulsar «Ajustar los silencios», al usar «Fin al final de la voz» o al preparar una canción nueva. 0.2.1 y 0.2.2 leen esos fines igual que cualquier otro.
- **Video exportado**: cambia solo a través de los fines: menos barridos que terminan antes de la última palabra y menos cuentas 3·2·1 sobre voz. Como el fin queda más tarde en esas líneas, su barrido (sin tiempos por palabra) va algo más lento en toda la línea. Los videos ya exportados no cambian.
- **Rendimiento**: el mismo recorrido lineal de intervalos por línea; despreciable (milisegundos por canción en el editor y en la preparación).
- **Riesgo que queda**: con E2, una línea cuya última palabra llega después de una pausa de 2 s o más sigue cortándose (en el Mac, 2 líneas con más de 1,5 s de voz fuera); y la voz de coros no escritos que siga a una pausa corta alargará la línea. Ambas cosas se ven en «Ver las líneas» del diálogo si se aprueba la marca « · tras una pausa» que propone el diseño.

### Borrador de la enmienda al ADR 0018 (no aplicado)

> **Revisión para 0.2.3 — propuesta 043** (fecha de la decisión del usuario).
>
> - **§6.1, paso 3**, sustituye a «Desde ahí se busca el primer silencio…»: desde el primer bloque con voz, los intervalos de voz se agrupan en **tramos** (separados por silencios de al menos `silencioMinimoMs`). Se avanza de un tramo al siguiente mientras se cumplan las tres condiciones: la pausa entre ellos es menor que `pausaInteriorMaxMs`; el siguiente tiene al menos `tramoMinimoMs` de voz; y no empieza en los `guardaSiguienteMs` previos al final de la ventana. El fin de la voz es el final del último tramo aceptado. Si ese tramo llega al final de la ventana, o le siguen menos de `silencioMinimoMs` de silencio dentro de ella, la línea **no cambia** (igual que hoy cuando no hay silencio).
> - **§6.1, parámetros nuevos** en `PARAMETROS_SILENCIOS` (provisionales, §6.4): `pausaInteriorMaxMs: 2000` (una pausa así o más larga cierra la línea), `tramoMinimoMs: 300` (menos voz tras una pausa es respiración o resto), `guardaSiguienteMs: 250` (la voz que empieza ahí es la entrada adelantada de la línea siguiente).
> - **Sin cambios**: pasos 1, 2, 4, 5 y 6 (ventana hasta el inicio siguiente; los inicios no se tocan; fin = voz + `margenColaMs`, nunca después del inicio siguiente; recuentos y activación del comodín), la exclusión de las líneas con voces a la vez y las variantes `soloIds`, `soloFinesAutomaticos` y `activarComodin`.
> - **§6.4**: medido en la copia de la biblioteca del Mac (17 canciones, 925 líneas; [spike 0030](../spikes/0030-fin-tras-ultima-voz/medir.ts)): la voz que queda tras el fin baja de 65 a 21 líneas; los huecos de espera con voz dentro, de 15 a 2; ninguna espera limpia se pierde; contra el fin de las palabras importadas, el error medio pasa de 686 a 654 ms y los cortes de 5 a 1. Pendiente de confirmar con las canciones con fines corregidos a mano de Windows.
> - **Consecuencias**: «un silencio intencionado dentro de una línea la corta» pasa a «una pausa de `pausaInteriorMaxMs` o más dentro de una línea la corta».

### Para confirmar en Windows (10 minutos, solo lectura)

En `app/`, sobre una **copia** de la biblioteca:
`node --experimental-transform-types --disable-warning=ExperimentalWarning ..\docs\spikes\0030-fin-tras-ultima-voz\medir.mjs <copia>\biblioteca --detalle`.
Toma como referencia los fines fijados a mano (sin `origen_fin`) y las palabras hechas a mano, así que en `701572c1` y `4cad645e` da el dato que falta. Solo imprime identificadores y cifras.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
