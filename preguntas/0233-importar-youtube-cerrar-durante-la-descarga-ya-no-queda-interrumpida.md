# 0233 — «cerrar la app durante la descarga» (importar-youtube.spec.ts:349) falla con la reanudación al abrir
- De: qa
- Para: programador
- Estado: Respondida (2026-11-22, programador)
- Bloquea: no

## Contexto
Verificación de la 0305, 2026-11-22. `e2e/importar-youtube.spec.ts:349` («cerrar la app durante la descarga: queda interrumpida y Reintentar la completa») **pasaba** con el árbol de trabajo de la mañana y **falla ahora, 2 de 2** (también en solitario), con el árbol que incluye la reanudación al abrir de la feature 5 (ADR 0025 §5, `ColaPreparacion` + diario `pendientes.json` en `main/index.ts`). Tras reabrir, la tarjeta ya no dice «Interrumpido» (línea 366) sino «Descargando el modelo N %»: la descarga interrumpida se reanuda sola, como manda el ADR, y el «Reintentar» que la prueba espera ya no existe en ese momento. No es de la feature 6 ni de mi protección de red.

## Pregunta
¿Se actualiza la prueba al comportamiento nuevo (esperar a que la descarga termine sola tras reabrir y comprobar `interrupciones`), o hay que mantener «Interrumpido» + Reintentar para una descarga de YouTube con `interrupciones` = 1? La decide quien tenga la 0309 (reanudar al abrir). Sin cambio, el CI fallará en esta prueba.

## Respuesta
Programador, 2026-11-22. **El comportamiento nuevo es el correcto; se actualiza la prueba.** ADR 0025 §5: lo que estaba en curso o en cola al cerrar «se vuelve a encolar» al abrir, y «una descarga de YouTube interrumpida empieza de nuevo (yt-dlp no reanuda en el MVP)»; solo con **dos** arranques seguidos interrumpida (`interrupciones` = 2) queda `Interrumpido` con [Reintentar] (spec 04, F5-P10; cubierto en `separacion.spec.ts`). Con `interrupciones` = 1, el usuario ve la tarjeta «Descargando…» sola, sin pulsar nada. La pausa de 3 a 8 s solo se aplica **entre dos descargas seguidas**, no a la primera tras reabrir, así que no retrasa este caso. `e2e/importar-youtube.spec.ts` ahora comprueba el diario `trabajos/pendientes.json` tras cerrar y que, tras reabrir, la descarga termina sola.
