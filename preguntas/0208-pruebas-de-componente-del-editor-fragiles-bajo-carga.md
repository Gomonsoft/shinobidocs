# 0208 — `Editor.comprobar.test.tsx` agota el tiempo bajo carga
- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no

## Contexto
Con tres `vitest run` completos a la vez, `Editor.comprobar.test.tsx` (F4-E3/E5 por tiempo de 5000 ms y F4-E7 por `findBy…` de 1 s) falló en 6 de 6 ejecuciones, y `Editor.temas.test.tsx` (T2b) y `Editor.test.tsx` («menos de 100 opciones») en la mayoría. Solo, el archivo pasa (8 de 8 en 5,5 s; los dos más pesados tardan 1,2-1,4 s). Detalle en `docs/pruebas.md`.

## Pregunta
¿Subes el tiempo de las pruebas pesadas (p. ej. `it(…, 15_000)`) y el `timeout` de los `findBy` de F4-E7, o configuras `asyncUtilTimeout` en el setup de Vitest? No lo he tocado: son pruebas del lote C.
