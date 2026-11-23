# 039 — Mover una línea en el editor sin perder sus tiempos

- Estado: Idea
- Origen: prueba técnica de voces a la vez (tarea 0356, pregunta 0368; 2026-11-23)
- Fecha: 2026-11-23
- Relacionadas: ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) («Resultado de la prueba técnica de voces a la vez»), feature 3 de 0.2.3

## Problema

La letra debe ir en orden de inicio. En un dúo escrito «por cantante» (primero todo lo de A, luego lo de B), o con un coro escrito antes que la frase a la que acompaña, el usuario tiene que reordenar el texto en la vista Letra, y las líneas que cambian pierden sus tiempos.

## Propuesta

Una acción del editor que sube o baja una línea (o la lleva a su sitio por su inicio) conservando su texto, su parte y sus tiempos.

## Valor y coste

- Valor: dúos y letras pegadas sin tiempos; evita rehacer la sincronía.
- Coste: S–M (reducer del editor, atajos y menú; la regla de inicios se comprueba como siempre).
- Riesgos: interacción con las palabras hechas a mano y con el historial de deshacer.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
