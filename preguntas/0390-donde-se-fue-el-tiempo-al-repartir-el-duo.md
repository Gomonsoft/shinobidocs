# 0390 — ¿Dónde se fueron los 30 minutos de repartir el dúo?

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no

## Contexto

En la prueba en Windows del 2026-11-23 ([incidencias](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), «Ejecución · primer dúo real completado»), repartir un dúo de 4:01 y 36 líneas llevó **unos 30 minutos** sin contar pausas. La guía ([feature 1](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md), paso 1.4) da como referencia «unos pocos minutos para una canción de 4 min»; esa referencia es de la spec 06 y la puse yo.

Lo que cuenta la nota y que puede estar dentro de esos 30 minutos:
- **Cuatro pantallas en negro** (incidencia I-1), cada una con reinicio de la app y vuelta al sitio.
- **Cantantes 3 y 4 creados sin querer** (propuesta 041) y quitados después.
- **Ajuste de tiempos**: el usuario dice que «todas las líneas se ajustaron a mano». La medida lo confirma: 33 de 34 inicios movidos, todos los fines tocados y tiempos por palabra hechos a mano en las 36 líneas (167 palabras, con el editor preciso). Eso es trabajo de sincronía, no de reparto, y puede ser la mayor parte.
- **Corregir la letra** para añadir y separar secciones, a mitad del trabajo.
- **La selección no sigue al cabezal** (incidencia I-2): para asignar la línea que acaba de sonar hay que buscarla en la lista o en la línea de tiempo.

La referencia de «unos pocos minutos» suponía saber de antemano quién canta cada línea. Si hay que escuchar la canción para decidirlo, el mínimo realista ronda una escucha entera (4 min) más el tiempo de asignar.

## Pregunta

Para saber si el reparto en sí es lento (y qué mejorar) o si el tiempo se fue en otra cosa:

1. ¿Los 30 minutos fueron **solo repartir** (decir quién canta cada línea) o también **ajustar tiempos** (inicios, fines, palabras en el editor preciso)? Si fue todo, ¿cuánto calculas de cada cosa?
2. ¿Cuánto calculas que se perdió en las pantallas en negro (reabrir y volver al punto) y en deshacer los cantantes 3 y 4?
3. ¿Sabías de antemano quién canta cada línea, o tuviste que escuchar para decidirlo? Si escuchaste: ¿una pasada entera asignando mientras sonaba, o línea a línea con pausas?
4. ¿Qué gesto usaste más: arrastrar regiones entre carriles, el menú «¿Quién canta?» tras seleccionar con Mayús + clic, o el teclado (C, Alt + 1/2)? ¿Asignabas de una en una o por bloques?
5. Las 13 líneas de «Todos», ¿son estribillos que se repiten? ¿Asignaste cada repetición por separado?
6. ¿Hubo algún momento en que no supieras qué hacer o tuvieras que volver atrás (por ejemplo, encontrar en la lista la línea que acababa de sonar)?

**Medida propuesta para la próxima canción** (caso 1 o 1.5 de la guía): cronometrar por separado (a) repartir, desde «Repartir entre varios cantantes» hasta la última asignación, sin tocar tiempos; (b) ajustar tiempos; (c) interrupciones. Si puedes, graba la pantalla solo mientras repartes: con el video se ve dónde se va el tiempo sin que tengas que anotarlo.

**Mejoras de diseño que parecen evidentes** (solo ideas; no se especifican hasta conocer las respuestas; si alguna se quiere, irá como propuesta):
- **Asignar mientras suena**: que una tecla asigne la línea que está sonando (o la última que sonó) sin tener que seleccionarla. Con eso, un dúo se reparte en una sola escucha. Hoy las teclas actúan sobre la selección, que no sigue al cabezal (I-2).
- **Repetir en las líneas iguales**: al asignar una línea, ofrecer aplicar la misma parte a las demás líneas con el mismo texto (los estribillos suelen repetir el reparto).
- **Separar en la guía el reparto del ajuste de tiempos**, y cambiar la referencia por algo comprobable: «poco más que una escucha de la canción si hay que oírla; unos pocos minutos si ya sabes quién canta».

## Opción provisional tomada (si no bloquea)

Ninguna: no se cambia nada hasta tener las respuestas. La referencia del paso 1.4 de la guía se mantiene.

## Respuesta

(pendiente)
