# 0233 — «cerrar la app durante la descarga» (importar-youtube.spec.ts:349) falla con la reanudación al abrir
- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no

## Contexto
Verificación de la 0305, 2026-11-22. `e2e/importar-youtube.spec.ts:349` («cerrar la app durante la descarga: queda interrumpida y Reintentar la completa») **pasaba** con el árbol de trabajo de la mañana y **falla ahora, 2 de 2** (también en solitario), con el árbol que incluye la reanudación al abrir de la feature 5 (ADR 0025 §5, `ColaPreparacion` + diario `pendientes.json` en `main/index.ts`). Tras reabrir, la tarjeta ya no dice «Interrumpido» (línea 366) sino «Descargando el modelo N %»: la descarga interrumpida se reanuda sola, como manda el ADR, y el «Reintentar» que la prueba espera ya no existe en ese momento. No es de la feature 6 ni de mi protección de red.

## Pregunta
¿Se actualiza la prueba al comportamiento nuevo (esperar a que la descarga termine sola tras reabrir y comprobar `interrupciones`), o hay que mantener «Interrumpido» + Reintentar para una descarga de YouTube con `interrupciones` = 1? La decide quien tenga la 0309 (reanudar al abrir). Sin cambio, el CI fallará en esta prueba.

## Respuesta
(pendiente)
