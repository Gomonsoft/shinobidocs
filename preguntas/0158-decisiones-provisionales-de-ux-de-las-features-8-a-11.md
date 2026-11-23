# 0158 — Decisiones provisionales de UX de las features 8 a 11 de 0.2.2

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (opciones provisionales aplicadas en las specs)

## Contexto

Siguiendo tu regla («por defecto se aplica la opción recomendada»), en las specs de las features 8 a 11 he aplicado la opción que recomiendo en cada duda de producto y la he marcado como «decisión provisional». Puedes cambiar cualquiera; ninguna está implementada todavía.

Specs: [02 · Features 8, 9 y 11](../ux/02-biblioteca.md#022--feature-8--acciones-por-lotes-en-la-biblioteca), [10 · Feature 8](../ux/10-exportacion.md#022--feature-8--exportar-varias-canciones), [08 · Features 9 y 10](../ux/08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad), [06 · Features 9, 10 y 11](../ux/06-editor.md#022--feature-10--sincronizar-con-la-voz-etapa-1) y [04 · Feature 10](../ux/04-progreso-pipeline.md#022--feature-10--sincronizar-con-la-voz-en-la-preparación).

## Pregunta

### Feature 8 · Acciones por lotes

1. **Qué acciones entran.** La propuesta recomendaba al menos «Preparar» y «Eliminar».
   - **A (provisional).** Las cinco: Preparar, A la cola, Exportar video, Editar datos (artista y álbum) y Eliminar. «Preparar» va a la vista; el resto, en el menú «Más acciones».
   - B. Solo Preparar y Eliminar en 0.2.2.
2. **Eliminar muchas canciones.**
   - **A (provisional).** Una confirmación con la lista; con 10 o más, además hay que marcar una casilla «Entiendo que se eliminarán N canciones». Van a la papelera del sistema.
   - B. Una confirmación sin casilla, sea cual sea el número.
3. **Exportar varios videos a una carpeta donde ya hay videos con el mismo nombre.**
   - **A (provisional).** Por defecto «Conservar los dos» (el nuevo lleva « (2)»). Se puede cambiar a «Sustituir» u «Omitir» y se recuerda.
   - B. Por defecto «Sustituir», como al exportar una sola canción.

### Feature 9 · Copia de seguridad, paquete y letra

4. **Paquete con audio.** Un paquete con las pistas se puede pasar a otra persona, y la visión excluye «compartir».
   - **A (provisional).** Entran los dos: «Completo, con el audio» (por defecto) y «Ligero, sin audio». La interfaz lo presenta siempre como copia personal, con un aviso fijo sobre los derechos del audio y la letra, sin casilla que aceptar.
   - B. Solo el paquete ligero; el audio no sale nunca de la app salvo en video.
   - C. Como A, pero con una casilla «Es para mi uso personal» que hay que marcar cada vez.
5. **Varias canciones.**
   - **A (provisional).** Un solo archivo con todas.
   - B. Un archivo por canción en una carpeta.
6. **Al importar una canción que ya tienes.**
   - **A (provisional).** Por defecto «Omitir» (no toca la tuya); puedes elegir «Sustituir» (la tuya va a la papelera) o «Conservar las dos», para todas o canción a canción.
   - B. Por defecto, quedarse con la más reciente de las dos.
7. **Restaurar una copia de seguridad.**
   - **A (provisional).** Añade lo que falta y pregunta por lo que ya existe; nunca borra canciones ni temas. Los ajustes se restauran solo si marcas la casilla (marcada de entrada en un equipo vacío).
   - B. Deja la biblioteca exactamente como estaba en la copia, borrando lo que no esté en ella.
8. **Recordatorio de copia.**
   - **A (provisional).** Una nota solo dentro de Ajustes («Desde entonces has añadido o cambiado N canciones»). Sin copias automáticas.
   - B. Además, un punto en el botón de Ajustes cuando toca hacer copia.
9. **Letra exportada (.lrc).**
   - **A (provisional).** Por línea, sin tiempos por palabra, con una marca vacía al final de las líneas seguidas de 2 s o más de silencio (para que los reproductores borren la línea y para recuperar ese fin al volver a importarla).
   - B. Solo los inicios de línea, sin marcas vacías.

### Feature 10 · Sincronizar con la voz

10. **«Ajustar los silencios».** Si la sincronía automática funciona, pierde sentido.
    - **A (provisional).** Se mantiene en 0.2.2 como alternativa sin modelo y como respaldo de la preparación automática.
    - B. Se retira.
11. **Tiempos por palabra automáticos.**
    - **A (provisional).** Se usan para pintar palabra a palabra, pero solo en las líneas que el motor reconoce con confianza alta; se pueden desactivar en la vista previa.
    - B. En 0.2.2 solo se ajustan los fines; las palabras, más adelante.
12. **Fines que ya estaban fijados** (a mano, o que venían con la letra).
    - **A (provisional).** Se conservan; hay una casilla para recalcularlos también. Las líneas con palabras hechas a mano y las que diste por buenas no cambian nunca.
    - B. Se recalculan todos, como hace «Ajustar los silencios».
13. **Modelos (alrededor de 1 GB por idioma, cifra por confirmar).**
    - **A (provisional).** No se descargan al instalar: se descargan la primera vez que pides sincronizar en ese idioma o desde Ajustes. La preparación automática nunca descarga uno por su cuenta; sin modelo usa «Ajustar los silencios» y lo dice.
    - B. El modelo de español se descarga con el resto del motor en el primer arranque.
14. **Acción para una sola línea** («Sincronizar esta línea con la voz», en el menú de la línea y en la revisión guiada). No estaba en la propuesta.
    - **A (provisional).** Incluida: es el mismo motor y cubre lo que pedía la propuesta 016.
    - B. Fuera de 0.2.2.

### Feature 11 · Revisión guiada

15. **Líneas dudosas y «Marcar como lista».**
    - **A (provisional).** No bloquean: la app avisa una vez («Quedan 3 líneas por revisar») y deja marcar igualmente. La app nunca marca sola.
    - B. No se puede marcar como lista hasta revisar todas.
16. **Marcar como lista desde la tarjeta.**
    - **A (provisional).** El menú ⋯ de una «Lista para revisar» ofrece «Marcar como lista» y «Marcar como letra lista» sin abrir el editor (con el aviso anterior si quedan dudosas).
    - B. Solo se marca desde el editor.
17. **Canciones ya terminadas.**
    - **A (provisional).** La tarjeta de una Lista no muestra «líneas por revisar»; la revisión sigue disponible dentro del editor.
    - B. También se muestra en las Listas.
18. **Escuchar cada línea al llegar a ella.**
    - **A (provisional).** Activado por defecto (suena de medio segundo antes a medio segundo después y se pausa); se puede desmarcar.
    - B. Desactivado: se escucha al pulsar.
19. **Teclas nuevas en el editor.**
    - **A (provisional).** R empieza o termina la revisión, N da la línea por buena y pasa a la siguiente, y Ctrl/Cmd + ↓ / ↑ saltan entre líneas dudosas.
    - B. Sin atajos de una tecla: solo botones.
20. **«Fin al final de la voz» en una línea con tiempos por palabra hechos a mano** (añadida el 2026-11-22, pregunta [0226](0226-ajustes-de-ux-de-la-revision-guiada-sin-especificar.md)).
    - **A (provisional).** Se aplica sin confirmación. Junto al botón ya se avisa de que se perderán las palabras; al aplicarlo, la línea vuelve al barrido progresivo y sale un aviso con [Deshacer], que lo devuelve todo de una vez.
    - B. Pedir confirmación antes.
    - C. No ofrecer el botón en esas líneas.

Sin pregunta, por si quieres otros valores: una línea se señala si casi no se oye voz mientras dura (menos del 10 %), si el fin llega 1,2 s o más después de la voz, si el fin corta la voz (sigue habiendo voz durante el segundo siguiente y la línea siguiente tarda 1 s o más en empezar), si no hay voz en los 500 ms siguientes al inicio, si dura menos de 0,25 s o más de 6 s para su texto, o si la sincronía automática no la reconoce. Son los valores del ADR 0024 §3 (revisión del 2026-11-22, pregunta 0225). El objetivo es que una canción bien sincronizada no tenga más de una de cada diez líneas señaladas; los valores se ajustan con tus 12 canciones.

## Opción provisional tomada (si no bloquea)

La A en las 20.

## Respuesta
