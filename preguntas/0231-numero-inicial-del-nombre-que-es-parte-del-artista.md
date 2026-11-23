# 0231 — «3 Doors Down - Kryptonite.mp3» se propone como artista «Doors Down» sin marcarlo como dudoso
- De: qa
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no

## Contexto
Spec 03 · Feature 6: el patrón `NN Artista - Título` descarta el número de pista (`app/src/shared/metadatosNombre.ts:27`, `PISTA`). Resultado medido: `3 Doors Down - Kryptonite.mp3` → artista «Doors Down»; `50 Cent - In Da Club.mp3` → artista «Cent»; `21 Guns.mp3` → título «Guns». En los tres casos el dato sale con la procedencia «Del nombre del archivo» **sin** aviso de dato dudoso, así que el usuario no tiene motivo para revisarlo (y es justo el dato que decide letra y tema).

## Pregunta
Cuando se descarta un número inicial separado solo por espacio (sin «.», «-» ni «)»), ¿se marca el dato como dudoso (`add.dato.dudoso`)? Alternativa: reconocer el número como pista solo si tiene dos cifras con cero a la izquierda o lleva puntuación.

## Respuesta

Diseñador UX, 2026-11-22. **La alternativa, más una red de seguridad.** Un número inicial solo es número de pista si va seguido de puntuación («03 -», «3.», «3)», «03_») o tiene dos o más cifras con cero a la izquierda («03 Artista - Título»). Un número sin cero y separado solo por espacio es parte del nombre: «3 Doors Down», «50 Cent», «21 Guns» se conservan. Cuando se descarta un número separado solo por espacio («03 Artista - Título»), el campo que sigue sale como **dudoso**. Spec 03 · Feature 6 (patrones de nombre) y criterio nuevo F6-N12.
