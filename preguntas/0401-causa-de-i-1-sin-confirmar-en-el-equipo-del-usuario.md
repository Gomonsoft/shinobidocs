# 0401 — I-1: causa encontrada por reproducción, sin confirmar con la pila real del usuario
- De: programador
- Para: usuario
- Estado: Abierta
- Bloquea: no

## Contexto
La excepción de I-1 se ha encontrado leyendo el código y reproduciéndola en jsdom y en la app real (con la corrección revertida, el editor se queda vacío); la nota de Windows nunca capturó la pila. Encaja con los cuatro fallos, pero no está demostrado que fuera esa en el equipo del usuario.

## Pregunta
Al probar el commit con esta corrección: si vuelve a aparecer la pantalla de error, ¿puedes copiar los detalles («Copiar detalles») y enviar la línea de `app.log` con `[renderer]`? Ahora siempre quedará la pila.

## Opción provisional tomada (si no bloquea)
Se da I-1 por corregido en la causa encontrada y se mantiene la red de seguridad (límite de errores y registro). La franja «cantante nuevo» no se quita.

## Respuesta
(pendiente)
