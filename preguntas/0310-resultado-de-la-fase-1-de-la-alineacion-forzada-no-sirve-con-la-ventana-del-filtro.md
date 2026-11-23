# 0310 — Fase 1 de la alineación forzada (tarea 0328): «no sirve» con el criterio cerrado, por la ventana del filtro (0.2.2, feature 10)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (la fase 2 y el plan B esperan tu decisión)

## Contexto

Fase 1 de la [tarea 0328](../tareas/0328-prueba-tecnica-de-alineacion-forzada.md) ejecutada con el candidato A del ADR 0028 tal cual (`jonatasgrosman/wav2vec2-large-xlsr-53-spanish` y `…-english`, Apache-2.0, `torchaudio.functional.forced_align`) sobre la copia de 13 canciones (11 `es`, 2 `en`; sin 5, 8, 12, 15 ni la 1). Detalle, scripts y cifras en [`docs/spikes/0028-alineacion/README.md`](../spikes/0028-alineacion/README.md). Solo cifras e ids abreviados; el ADR 0028 no se ha editado.

## Resultado con el criterio cerrado de la tarea

| Condición | Umbral | Medido | |
|---|---|---|---|
| Cobertura | ≥ 80 % | 99,9 % (747/748) | cumple (el alineador siempre devuelve algo) |
| Mediana de abs(Δ) | ≤ 300 ms | **390 ms** | **falla** |
| p90 de abs(Δ − sesgo) | ≤ 600 ms | **910 ms** | **falla** |
| Coste CPU | ≤ 1,5 × duración, ≤ 4 GB | 0,21–0,63 × (equipo cargado); 2,7 GB | cumple |
| Criterio 6 | < 1e-3 en *logits* | 0,8–4,0e-3 en `float32`; 2,6e-12 en `float64`; alineaciones idénticas | **no cumple la letra**, sí el fondo |
| Determinismo | iguales | 13/13 | cumple |

Veredicto aplicando lo escrito: **no sirve**. Descargado: 2 524 044 643 B de pesos (Apache-2.0).

## Qué hay detrás del «no sirve» (diagnóstico informativo, no usado para decidir)

- Con la ventana de −1000 ms, el 40 % de las líneas tienen Δ < −500 ms: la primera palabra se «engancha» al final de la voz de la línea anterior (el alineador solo tiene el texto de esa línea y no sabe esperar). Es un efecto de la **ventana del filtro**, no del modelo.
- Mismas emisiones, otras ventanas (ADR 0028 §2.1 usa −250 ms): −500 ms → 220 / 500; −250 ms → 170 / 350; 0 → 130 / 245 (mediana de abs(Δ) / p90 de abs(Δ − sesgo)). Con ventanas estrechas el resultado queda parcialmente anclado al LRC (Δ ≥ −ventana por construcción).
- Alineando **toda la letra de una vez** sobre la pista (sin ventanas, sin ancla al LRC): mediana 220 ms, p90 403 ms, Δ < −500 ms en el 1,7 %; pasaría los dos umbrales. Con sesgos positivos grandes en dos canciones (`2fec1a9d` +430 ms; `8275d460` +830 ms, con el 81 % de líneas a más de 500 ms): o el LRC de esas canciones va adelantado o el modelo se retrasa; **sin V1 no se distingue**.
- Criterio 6: en `float64` el codificador propio y `transformers` coinciden a 2,6e-12; `transformers` en `float32` ya difiere de su propio `float64` en 1,3e-3. El 1e-3 sobre *logits* es más estricto que el ruido de redondeo de `float32`.
- Informativo: en las 91 líneas donde «Ajustar los silencios» propone fin, la alineación deja voz ≥ 300 ms detrás en el 59 % (47 % con margen de 100 ms) frente al 25 % de los fines prudentes. V2: canción 10 (`8766c2f2`), mediana 40 ms y 91 % a ≤ 200 ms; canción 17 (`f538b75e`), mediana 191 ms y 53 % a ≤ 200 ms.

## Preguntas (decide el arquitecto)

1. **¿Se da el filtro por «no sirve» y se aplica el plan B (§4)?** Es lo que dice la regla escrita. Mi lectura: el «no sirve» es un artefacto de cómo se diseñó la ventana, y el modelo en sí (coste, determinismo, V2 de la 10) no está descartado.
2. **¿O se repite el filtro con una definición corregida** (alineación de toda la letra de una vez, o por línea con ventana de −250 ms como §2.1)? Es un cambio de criterio tras ver los datos, por eso no lo he hecho; el diagnóstico ya está medido y valdría como resultado si lo autorizas, sin volver a ejecutar nada.
3. **Criterio 6**: ¿se reformula («misma alineación y diferencia en `float64` < 1e-6», o un umbral de `float32` realista como 1e-2)?
4. Para la fase 2 sigue haciendo falta V1 (fines hechos a mano; pregunta 0280): ninguna cifra de aquí sustituye esa verdad.
5. Si el candidato A pasara, el inglés (`…-english`, con `safetensors`) se comporta como el español en coste; el español (`pytorch_model.bin`) no tiene `safetensors` en esa revisión y se carga con `weights_only=True`.

## Opción conservadora tomada

No se ha cambiado ninguna ventana ni se ha excluido ninguna canción para que «pase»; el veredicto formal es «no sirve». La tarea 0328 queda `En curso` (fase 1 hecha; fase 2 sin empezar) hasta tu respuesta.

## Respuesta

Arquitecto, 2026-11-23. Todo queda en ADR [0028](../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md), «Resultado de la prueba técnica · Fase 1», con el veredicto original escrito.

1. **Con el criterio tal como lo escribí: «no sirve».** Consta en el ADR. Pero el filtro tenía un **defecto de diseño mío**: una línea sola en una ventana que empieza 1 s antes deja que su primera palabra se quede con la voz de la línea anterior. Mide un artefacto del método, no del modelo, y una configuración que la etapa 1 no usa. **No se aplica el plan B por eso.**
2. **Criterio revisado**: solo cambia la configuración de la medida. Pasa a la alineación de **toda la letra de una vez**, que es la única no circular (no usa los tiempos del LRC) y la más exigente de las válidas. Se descartan, por estar ancladas al LRC, las ventanas de 0 y −250 ms, que darían mejores cifras. Los **umbrales no cambian** (300/600 ms). Con lo ya medido (220/403 ms), **pasa el filtro**, con la reserva de las dos canciones con sesgo grande.
3. **Criterio 6 reformulado**: (a) en `float64`, < 1e-6, y (b) en `float32`, las mismas etiquetas de Viterbi y los mismos inicios. Medido: 2,6e-12 y alineaciones idénticas. **Cumple.** El 1e-3 en `float32` quedaba por debajo del ruido de la propia referencia.
4. **La fase 2 sigue haciendo falta**: ninguna cifra de aquí sustituye a V1. Fines y palabras no están demostrados, y el dato de fines es desfavorable (deja voz detrás en el 59 % de las líneas donde «Ajustar los silencios» encuentra silencio, frente al 25 %).
   - La etapa 1 (0329–0333) **espera a la fase 2**; tampoco se adelanta como función explícita del editor.
   - Excepción: 0329 y 0330 pueden empezar si la medida nueva [0387](../tareas/0387-medir-la-confianza-de-la-alineacion-como-comprobacion-del-encaje.md) cumple su criterio. Esa medida comprueba si la confianza de alinear toda la letra separa la propia de las ajenas: es la «señal D», que podría desbloquear la elección automática de la feature 5.
5. Lo del inglés en `safetensors` y el español en `pytorch_model.bin` con `weights_only=True` es lo que prevé §3.2. Sin cambios.

