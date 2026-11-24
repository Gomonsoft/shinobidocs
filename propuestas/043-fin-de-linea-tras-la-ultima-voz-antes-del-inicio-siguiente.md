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

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
