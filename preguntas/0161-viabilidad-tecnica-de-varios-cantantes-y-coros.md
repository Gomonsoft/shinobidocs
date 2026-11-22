# 0161 — Viabilidad técnica de «Varios cantantes y coros»

- De: disenador-ux
- Para: arquitecto
- Estado: Respondida
- Bloquea: no (exploración sin autorizar; el punto 4 conviene responderlo antes de empezar las tareas 0288–0290 y 0293 de 0.2.2)

## Contexto

Exploración: [varios-cantantes-y-coros.md](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md). Decisiones del usuario: [0160](0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md). Cada línea tendría una **parte** (Cantante 1–4, Todos, Coro); los colores vienen del tema; el coro puede llevar la voz separada a un nivel por canción. Etapas: 1 líneas enteras sin solapes; 2 voz en los coros; 3 voces a la vez; 4 partes dentro de una línea.

## Pregunta

1. **Datos (etapa 1).** ¿Vale el boceto de la exploración §2.4 (`letra.partes`, `lineas[].parte`, `estilo.letra.colores_partes`, Cantante 1 = `color_resaltado`)? Lectura tolerante, y qué pasa con 0.2.1/0.2.2 al reescribir (hoy `elementoLetraSchema` es `z.object` y descarta claves). ¿Conviene que la vista Letra conserve la parte en su diff por líneas (las cambiadas heredan la de la anterior)?
2. **Voz en los coros (etapa 2).** Automatizar `gananciaVoz` por tramos (rampas de 150 ms, `máx(voz guía, nivel de coros)`) en el reproductor, la vista previa con «Instrumental», la ventana secundaria y la mezcla de la exportación «Solo instrumental». ¿Es una función pura del tiempo compartida (como el modelo de render)? ¿Hay riesgo de chasquidos o de desfase con la búsqueda?
3. **Voces a la vez (etapa 3).** Relajar las invariantes del ADR 0006 por parte (inicios crecientes y `fin ≤ siguiente` solo dentro de la misma parte). Impacto en `finEfectivo`, `moverInicioLinea`, `marcarInicioLinea` (modo al ritmo por parte), «Ajustar los silencios», encaje (F4), sincronía automática (F10, tramo hasta «la siguiente») y dudosas (F11, `finCorta`, `vozTarde`). ¿Es una etapa de una versión o hace falta una prueba técnica antes?
4. **Ajustes ahora en las features 1 y 2 de 0.2.2** (exploración §11.2), sin cambio visible:
   a. color base de barrido **por línea** en `LineaEnPantalla` y en `color-mix` (hoy siempre `color_resaltado`);
   b. parámetro de **ancho reservado a la izquierda** en la medición de renglones (0 en 0.2.2);
   c. `disponerBloque` con **alturas arbitrarias por enunciado** (no «1 o 2 renglones»), para que un grupo simultáneo sea un enunciado de varias filas;
   d. subrayado en el color de la línea y la comprobación de daltonismo de la F2 con **lista de pares**.
   ¿Los aceptas en el ADR 0022 y en las tareas 0288–0290 y 0293, o prefieres dejarlos para la versión de la función?
5. **Partes dentro de una línea (etapa 4).** ¿Parte por palabra (`palabras[].parte`, que exige palabras) o partir la línea en sublíneas con un vínculo? ¿Qué hace el barrido sin tiempos por palabra?
6. **Atajos.** ¿Chocan Alt + 1…4 con los aceleradores del menú de la app en Windows o Linux? Si chocan, la asignación por teclado queda solo con C y el menú.

## Opción provisional tomada (si no bloquea)

Exploración escrita con: el boceto de datos del punto 1; la voz de los coros como función pura del tiempo; la etapa 3 aplazada a 0.3.0; los cuatro ajustes del punto 4 recomendados para 0.2.2; la etapa 4 por palabras; y C como atajo seguro.

## Respuesta

Arquitecto, 2026-11-22. Detalle, citas de código y lo que es supuesto en [varios-cantantes-y-coros-factibilidad.md](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md). Mis decisiones provisionales están en [0165](0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md). Es exploración: no creo ni modifico ADR. Se escribirá uno (o una revisión del 0022 y del 0006) cuando el usuario autorice la función.

1. **Datos: sí, con precisiones** (factibilidad §1).
   - `lineas[].parte` (`c1`…`c4`, `todos` o `coro`; ausente = `c1`; nunca en pausas), `letra.partes { cantantes[1–4], voz_en_coros }` y `estilo.letra.colores_partes` por ranura. Cantante 1 = `color_resaltado`.
   - Lectura tolerante por campo: un valor desconocido o un cantante que no existe se lee como `c1`, y un color no válido como el de su ranura.
   - Se escribe con un campo opcional `parte` por línea y `partes` en `letras.guardarTiempos`, igual que `revisada` (ADR 0024 §4). Sin canal nuevo y sin subir `cancion.esquema`.
   - **Compatibilidad**: es cierto que 0.2.1 y 0.2.2 descartan los campos al leer. Además, **cualquier** escritura de la canción los pierde, no solo editar la letra: main guarda el objeto ya validado (`main/biblioteca/servicio.ts:384-392`). Y el paquete de la feature 9 se serializa desde ese objeto (ADR 0027 §2), así que un paquete de 0.2.3 importado en 0.2.2 perdería el reparto sin aviso. Por eso recomiendo que **0.2.2 reserve los tres campos**: opcionales, conservados y sin uso (tareas 0296 y 0287).
   - **Vista Letra**: sí, las líneas emparejadas conservan su parte y las cambiadas heredan la de la anterior. Pero `aplicarTextoEditado` reconstruye las líneas campo a campo (`shared/letras/editar.ts:88-100`): **hoy ya pierde `origen_palabras`**, en contra de ADR 0021 §4. Conviene arreglarlo en 0296.
2. **Voz en los coros: sí, como función pura del tiempo** (`shared/coros.ts`: tramos en tiempo de audio y envolvente con rampas; factibilidad §2).
   - **Reproductor y secundaria**: la ganancia de la voz es `máx(voz guía, envolvente)`, programada en el `AudioParam` en cada arranque, búsqueda y cambio de voz guía, con el mismo `when` que las fuentes. No hay desfase con la búsqueda. Los chasquidos [S] se comprueban en la guía manual.
   - **Corrección importante**: el motor del **editor** no tiene ganancia de voz. Solo suena una pista cada vez (ADR 0011; `karaoke/motorAudio.ts:271-307`). Para la vista previa con «Instrumental» recomiendo una **pista derivada en memoria** (instrumental + voz × envolvente), para que el bucle, la velocidad y el tono conservado sigan igual sin tocarlos.
   - **Exportación**: la envolvente viaja al worker y se aplica con `np.interp`.
   - **Límite**: los dos modelos aceptados solo dan voz e instrumental (ADR 0004). El que separa voz principal y coros tiene la licencia de sus pesos sin verificar: queda como incógnita, con cómo se comprobaría.
3. **Voces a la vez: hace falta una prueba técnica antes, y es una etapa de versión (0.3.0)** (factibilidad §3).
   - Propongo **mantener los inicios crecientes en toda la letra** (dos líneas simultáneas, a 1 ms) y relajar **solo** «fin ≤ inicio de la siguiente» para que mire **la siguiente de la misma parte**. Así se conservan el orden, la búsqueda binaria del render, `limitesInicio`, `moverInicioLinea` y el modo al ritmo, que no necesita ir por partes.
   - Cambian `finEfectivo`, la validación del fin y de las palabras, los tiradores, «Ajustar los silencios» (que excluye los grupos simultáneos), el render de grupos de la feature 1, el encaje (que fusiona intervalos), las dudosas (sin `FIN_EN_VOZ` ni `FIN_TARDIO` en los grupos), la alineación (los grupos se excluyen: la CTC alinea un solo texto) y las marcas de fin del `.lrc`.
   - Hoy hay unos 16 archivos afectados y 0.2.2 añade 5.
4. **Ajustes en las features 1 y 2** (factibilidad §4.2). 0.2.2 no se encarece de forma medible: ninguna tarea nueva y unos cinco criterios.
   - **a. Sí.** Color por línea con variables CSS por nodo (`colorDeLinea`, que en 0.2.2 devuelve siempre `color_resaltado`), también en los indicadores. `LineaEnPantalla` no cambia, y en 0289 el color de los suelos pasa a ser un parámetro. Tareas 0290 y 0289.
   - **b. Sí, como variable de ancho** (`--k-ancho-linea`, 88 %). Basta con eso: el texto sigue centrado y la insignia se coloca con la caja que ya se mide. Tarea 0290.
   - **c. En parte.** ADR 0022 §3 ya inyecta alturas arbitrarias. Solo pido tests con 3 y 4 renglones (0289). No renombro el tipo ni añado filas: la forma del grupo depende de la prueba técnica de la etapa 3.
   - **d. Subrayado: sí, y sale gratis con (a)** (0293). **Daltonismo**: la función es de la **0294**, no de la 0293. Una función de pares `confusionDaltonismo(a, b)` con nombres neutros ya sirve para N pares, así que no hace falta una lista.
5. **Partes dentro de una línea: por palabra** (`palabras[].parte`, ausente = la parte de la línea). Sin palabras visibles, la línea entera usa su parte y el editor lo dice. Descarto las sublíneas enlazadas porque rompen «una fila = una línea» en la lista, la revisión y el `.lrc`.
6. **Atajos: C sirve.** Ni el editor ni el editor preciso la usan, y la feature 11 añade R, N y Ctrl/Cmd + ↑/↓. **Alt + 1…4 no chocan** con la app: el menú no tiene mnemónicos (`main/menu.ts`) y el editor solo usa Alt con ←/→. Hay que leer `e.code` (en macOS, Opción + 1 cambia `e.key`) y exigir que no haya Ctrl ni Cmd (en Windows, AltGr llega como Ctrl + Alt). Alt + ↑/↓ también está libre. Ni C ni Alt + 1…4 deben actuar con el foco en la ventana del editor preciso.

**Dónde meterla**: de acuerdo con la opción B: **0.2.3 con las etapas 1 y 2 tras `0.2.2-alpha.4`**, y las etapas 3 y 4 en 0.3.0. La etapa 1 vive en los archivos del lote C, ocupado durante toda 0.2.2. Cambios ya en 0.2.2, sin efecto visible: factibilidad §8.3 (tareas 0287, 0289, 0290, 0293, 0294 y 0296).
