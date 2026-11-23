# 0231 — «3 Doors Down - Kryptonite.mp3» se propone como artista «Doors Down» sin marcarlo como dudoso
- De: qa
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no

## Contexto
Spec 03 · Feature 6: el patrón `NN Artista - Título` descarta el número de pista (`app/src/shared/metadatosNombre.ts:27`, `PISTA`). Resultado medido: `3 Doors Down - Kryptonite.mp3` → artista «Doors Down»; `50 Cent - In Da Club.mp3` → artista «Cent»; `21 Guns.mp3` → título «Guns». En los tres casos el dato sale con la procedencia «Del nombre del archivo» **sin** aviso de dato dudoso, así que el usuario no tiene motivo para revisarlo (y es justo el dato que decide letra y tema).

## Pregunta
Cuando se descarta un número inicial separado solo por espacio (sin «.», «-» ni «)»), ¿se marca el dato como dudoso (`add.dato.dudoso`)? Alternativa: reconocer el número como pista solo si tiene dos cifras con cero a la izquierda o lleva puntuación.

## Respuesta
(pendiente)
