# 0215 — Espacio entre palabras en el subrayado palabra a palabra (F2-R3)

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción conservadora aplicada en la tarea [0293](../tareas/0293-subrayado-de-lo-cantado.md))

## Contexto

La spec 07 · Feature 2 pide que, con tiempos por palabra hechos a mano, «el espacio que sigue a una palabra se subraya al empezar la siguiente» (F2-R3). Hoy cada palabra es un `inline-block` con su capa de resaltado y el espacio que las separa es un texto normal fuera de esas cajas. El subrayado vive en la capa de resaltado (ADR 0022 §5), así que el espacio queda sin subrayar. Meterlo en la caja de la palabra siguiente exige `white-space: pre` o un espacio de no separación dentro de un `inline-block`, y eso puede cambiar dónde parte el renglón (0.2.0) y el barrido por palabra.

## Pregunta

¿Se acepta que, en 0.2.2, el subrayado de una línea con palabras a mano cubra cada palabra pero deje sin subrayar el espacio entre ellas?

## Opción provisional tomada

Sí: se subraya cada palabra al avanzar su barrido y los espacios entre palabras quedan sin subrayar; el resto de F2-R3 (no avanza entre palabras) se cumple. Alternativa: rehacer la estructura del texto palabra a palabra para incluir el espacio (cambio de riesgo en los cortes de renglón).

## Respuesta

Diseñador UX, 2026-11-22. **Se acepta la opción aplicada**; no hace falta cambiar el código.

- Con tiempos por palabra, el subrayado va **en tramos, uno por palabra**, y los espacios quedan sin subrayar. Es coherente con el barrido, que tampoco «pinta» los espacios, y se sigue leyendo como avance por forma (el objetivo de la feature 2). No compensa arriesgar los cortes de renglón de 0.2.0 ni el barrido por palabra para unir los tramos.
- En una línea sin tiempos por palabra (barrido progresivo), el subrayado sigue siendo **continuo**, espacios incluidos.
- Spec ajustada: [07 · Feature 2](../ux/07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color), fila «Palabra a palabra» y criterio **F2-R3** (mismo identificador, texto nuevo: cada palabra tiene su tramo, que mide lo mismo que su parte pintada ± 1 px; el espacio entre dos palabras nunca se subraya; con barrido progresivo, continuo), y [sistema visual · Feature 2](../ux/sistema-visual.md#022--feature-2--resaltado-accesible), fila «Longitud». Decisión provisional anotada para el usuario en [0155](0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md) n.º 14.
- Lo único que hay que comprobar es que el test de F2-R3 use el texto nuevo del criterio (si hoy comprueba «espacio subrayado al empezar la siguiente», cambia la expectativa a «no subrayado»).
