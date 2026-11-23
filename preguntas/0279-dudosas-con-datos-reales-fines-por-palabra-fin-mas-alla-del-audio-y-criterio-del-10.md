# 0279 — Líneas dudosas con datos reales: fines por palabra del MVP, fin más allá del audio y criterio del 10 % (0.2.2, feature 11)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

`calibrar:dudosas` sobre 17 canciones con tiempos de la biblioteca del MVP (informe [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)): **95 de 942 líneas (10,1 %)**, 13 de 17 canciones ≤ 10 %, 55 «importantes». Las letras **no están revisadas a mano**, así que el criterio «≤ 10 % en canciones ya revisadas» no se puede cerrar con ellas. Observaciones que sí pueden afectar al diseño:

1. **`finCorta` (33)**: 24 vienen de la canción 17, que tiene tiempos por palabra en 73 de 73 líneas y `fin_ms` = fin de la última palabra; la voz sigue después (el fin de línea que derivó la sincronía por palabras del MVP queda antes que el final del canto). Son fines «hechos por una herramienta» sin `origen_fin` (las canciones del MVP no lo tienen y cuentan como a mano). ¿Debe `finCorta` tratarse distinto cuando el fin coincide exactamente con el de la última palabra?
2. **`muyCorta` (22)**: aparece en las canciones rápidas (> 25 caracteres/s: 6 y 7 en las canciones 9 y 18). Con los fines prudentes pasa de 22 a 32 (la canción 8 sube de 12 a 16 señaladas). ¿Merece subir `cpsMax` o excluir las líneas sin fin?
3. **`finTarde` (19)**: viene de los fines automáticos (`finEfectivo` = inicio de la siguiente línea) de las letras sin fines; con fines prudentes baja a 2.
4. **Fin más allá del audio**: en la canción 8 la última línea acaba 28 s después de la duración del audio (LRC de otra versión). 0.2.2 la lee sin marcarla como dañada. ¿Debe `detectarDudosas` señalarla o la lectura recortarla? (Es un caso de dato raro, no de código.)
5. **Criterio de «hecha»**: sin canciones revisadas se pudo medir solo lo anterior. Sin las canciones 5 y 8 (letra de otra versión) y 17 (fines por palabra) es el 5,5 % (42/770).

## Pregunta

¿Se ajustan umbrales o motivos con estos datos (puntos 1 y 2) o se espera a medir con las canciones que el usuario revise a mano? ¿Se acepta que el criterio «≤ 10 % en las revisadas» se mida con las 10 canciones de la calibración original del ADR 0024 y se deje de exigir con letras sin revisar?

## Opción provisional

Ninguna; no se ha tocado el código ni los umbrales.
