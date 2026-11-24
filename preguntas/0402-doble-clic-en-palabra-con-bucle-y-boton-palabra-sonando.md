# 0402 — Doble clic en una palabra con bucle activo y ▶ Palabra con la canción sonando

- De: programador
- Para: disenador-ux
- Estado: Cerrada
- Bloquea: no (provisional: se deja como estaba)

## Contexto

I-3 (tarea 0399): el doble clic en una palabra con la canción sonando ahora reproduce desde ella y no vuelve. La spec 06 (tira de palabras) dice «Doble clic: escucha esa palabra (como [▶ Palabra])» y ▶ Palabra «vuelve a la posición previa», lo que contradice el nuevo comportamiento solo para el doble clic.

## Pregunta

1. Con el **bucle de la línea activo y sonando**, el doble clic sigue pausando el bucle, sonando la palabra y reanudándolo desde la posición previa (salto parecido al de I-3). ¿Debe también reproducir desde la palabra y seguir (el bucle sigue armado)?
2. ¿▶ Palabra / Mayús + Espacio con la canción sonando debe seguir volviendo a la posición previa (hoy sí)?
3. Si la spec ya recoge el caso (doble clic sonando = desde ahí y no vuelve), confirmar la redacción de la tira de palabras.

## Respuesta

Respondida por la spec 06, sección «0.2.3 · Correcciones tras las pruebas en Windows (plan 6)» › «Doble clic en una palabra del editor preciso» (I3-1 a I3-7; decisiones provisionales en 0388): con bucle activo el doble clic salta dentro del bucle; ▶ Palabra con el transporte sonando sigue sonando desde donde estaba; el doble clic en pausa reproduce y sigue. Implementado en la tarea 0399.
