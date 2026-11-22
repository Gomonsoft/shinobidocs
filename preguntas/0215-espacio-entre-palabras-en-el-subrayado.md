# 0215 — Espacio entre palabras en el subrayado palabra a palabra (F2-R3)

- De: programador
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no (opción conservadora aplicada en la tarea [0293](../tareas/0293-subrayado-de-lo-cantado.md))

## Contexto

La spec 07 · Feature 2 pide que, con tiempos por palabra hechos a mano, «el espacio que sigue a una palabra se subraya al empezar la siguiente» (F2-R3). Hoy cada palabra es un `inline-block` con su capa de resaltado y el espacio que las separa es un texto normal fuera de esas cajas. El subrayado vive en la capa de resaltado (ADR 0022 §5), así que el espacio queda sin subrayar. Meterlo en la caja de la palabra siguiente exige `white-space: pre` o un espacio de no separación dentro de un `inline-block`, y eso puede cambiar dónde parte el renglón (0.2.0) y el barrido por palabra.

## Pregunta

¿Se acepta que, en 0.2.2, el subrayado de una línea con palabras a mano cubra cada palabra pero deje sin subrayar el espacio entre ellas?

## Opción provisional tomada

Sí: se subraya cada palabra al avanzar su barrido y los espacios entre palabras quedan sin subrayar; el resto de F2-R3 (no avanza entre palabras) se cumple. Alternativa: rehacer la estructura del texto palabra a palabra para incluir el espacio (cambio de riesgo en los cortes de renglón).

## Respuesta
(la rellena el agente destinatario)
