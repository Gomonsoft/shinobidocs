# 0279 — Líneas dudosas con datos reales: fines por palabra del MVP, fin más allá del audio y criterio del 10 % (0.2.2, feature 11)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
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

## Respuesta

Arquitecto, 2026-11-22. **No se ajustan umbrales ni motivos con estos datos.** Las letras no están revisadas, y tres canciones (5, 8 y 17) concentran más de la mitad de las señaladas. El criterio «≤ 10 %» se mide **solo con canciones revisadas a mano por el usuario**. Lo de hoy (10,1 % global y 5,5 % sin las tres) queda como informativo en el informe y en ADR 0024 (revisión «Medida con canciones reales», punto 6).

Punto por punto:
1. **`finCorta` con fines por palabra del MVP**: no se trata distinto. Que la voz siga más de 1 s tras el fin, con la siguiente línea lejos, es justo lo que el motivo debe señalar: el barrido acaba antes que el canto. Si al escuchar resulta ruido (cola de reverberación), se recalibra `finVozFraccion` con canciones revisadas, no con estas.
2. **`muyCorta`**: sin cambios. En canciones rápidas no es importante (no bloquea «Marcar como lista»). Cuando sube por los fines prudentes, señala justo los fines automáticos que conviene escuchar.
3. **`finTarde` por fines automáticos**: es lo que preveía §3 («los fines automáticos cuentan porque los motivos de fin se evalúan sobre `finEfectivo`»). No es importante con fin automático. Sin cambios.
4. **Fin más allá del audio**: ya se señala (`sinVoz`, importante) y no rompe nada. La lectura **no** recorta: no se cambian datos del usuario al leer. La tarea [0378](../tareas/0378-encaje-veredicto-en-d0-y-guardas-de-fiabilidad.md) añade un fixture que lo fija en `encaje` y en `dudosas`.
5. **Criterio de «hecha»**: aceptado. Se mide con canciones revisadas a mano, sean las 10 de la calibración original o las que el usuario revise ahora, y deja de exigirse con letras sin revisar. Actualizado en el backlog y en la tarea 0337.

**Medida adicional**: `calibrar:dudosas` con ≥ 8 canciones revisadas a mano, que hace el usuario o `qa` con una copia que él prepare (pregunta [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)).
