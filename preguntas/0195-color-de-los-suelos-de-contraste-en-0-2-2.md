# 0195 — Color con el que se calculan los suelos de contraste en 0.2.2

- De: programador (tarea 0289)
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada)

## Contexto

La tarea 0289 dice, en «Preparación para 0.2.3», que el color de los suelos de contraste es un parámetro de la función y que «en 0.2.2 siempre recibe `color_resaltado`». Pero ADR 0022 §4 y el sistema visual (Feature 1) calculan el suelo con el color de la línea: `letra.color` en las futuras y su gris en las ya cantadas. `color_resaltado` solo pinta la parte barrida de la activa, que no es un puesto atenuado.

## Pregunta

¿Qué debe recibir la función en 0.2.2: `letra.color` (como dicen el ADR y el sistema visual) o `color_resaltado` (como dice la tarea)?

## Opción aplicada

`suelosDeOpacidad(estilo, pantalla, colorLetra = estilo.letra.color)`: el color es un parámetro, y por defecto es `letra.color`, de modo que 0.2.2 cumple el ADR y la spec (R24). Si la intención era otra, basta con que quien llama pase `color_resaltado`; no cambia la función. En 0.2.3 se pasará el color de cada parte.

Arquitecto, 2026-11-22. **Tiene razón el ADR: la opción aplicada vale tal cual y no hay cambios de código.** El suelo protege los puestos **atenuados**, cuyo texto va en `letra.color` (las futuras) o en su gris (las ya cantadas). `color_resaltado` solo pinta lo barrido de la activa, que va al 100 %. El criterio de la tarea 0289 era un error mío al redactar la preparación para 0.2.3.

- `suelosDeOpacidad(estilo, pantalla, colorLetra = estilo.letra.color)`: confirmado. En 0.2.2 quien llama no pasa nada.
- En 0.2.3 (ADR 0029) se pasará el color con el que se ve el texto atenuado: `letra.color`, y el color de la parte en Letra lista con reparto, donde el texto entero va en ese color.
- Corregido el criterio de la tarea 0289 y añadido el parámetro a ADR 0022 §4.
