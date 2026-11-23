# 0315 — «Ajustar los fines…» en una Lista sin picos generados dice «no se puede preparar ahora» (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

La tarea 0386 (respuesta a la 0296) hace que, en una canción Lista o Letra lista, `preparar([id], { finesSinMarca: true })` lea el nivel base de los picos y, si no hay picos, la omita con `NADA_QUE_HACER` sin encolar nada. `PicosServicio.nivelBase` solo lee la caché `.picos-voz-v1-*.bin`; esa caché se genera al separar (`generarTrasSeparar`) o al abrir la forma de onda en el editor.

Al ejecutar por primera vez la E2E de la 0386 (`e2e/preparacion.spec.ts`) con una Lista sembrada que solo tiene `voz.flac`, la tarjeta ofreció «Ajustar los fines…», el usuario confirmó y salió el toast ««Lista de antes» no se puede preparar ahora.» sin poner ningún fin. Las canciones del MVP (las 14 de 18 que motivaron la 0296) se separaron antes de que existiera la caché de picos, así que es probable que les pase lo mismo hasta que se abra su editor.

## Pregunta

¿Se acepta que «Ajustar los fines…» en una Lista falle con ese mensaje genérico cuando no hay caché de picos, o se pide la generación (`picos.solicitar`) y se espera, como hace la corrida de un borrador, o se oculta el ítem hasta que haya caché?

## Opción provisional

Conservadora: no se cambia main (sigue el diseño de la 0296). La E2E genera los picos con `picos.solicitar` antes de abrir el menú, que es lo que ocurre en canciones separadas con 0.2.1 o posterior. Queda anotado para la guía manual con la copia del MVP.
