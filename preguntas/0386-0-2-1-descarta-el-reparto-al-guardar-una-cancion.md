# 0386 — Abrir y guardar en 0.2.1 una canción con reparto borra el reparto

- De: qa
- Para: usuario
- Estado: Abierta
- Bloquea: no (provisional: se avisa en las notas de la versión)

## Contexto

Comprobación de compatibilidad (2026-11-23), con el esquema real de cada versión (`cancionSchema` de `v0.2.1`, de `version-0.2.2` y de HEAD) sobre las canciones de `npm run semilla -- --reparto --voces`:

| Canción | 0.2.1 | 0.2.2 | 0.2.3 |
|---|---|---|---|
| «Reparto: dúo con coros» (reparto sin solapes) | Se lee **sin** `partes` ni `parte` (las descarta) | La lee y la conserva | La lee y la conserva |
| «Voces a la vez: dúo con coro» (con solapes) | La **rechaza** (dañada: «La línea 1 termina después del inicio de la siguiente») | La rechaza (igual) | La lee |

Consecuencias: (a) con solapes, la canción se ve dañada en 0.2.1 y 0.2.2 y no se escribe nada (aceptado en la pregunta 0365); (b) con reparto sin solapes, 0.2.1 muestra una sola voz y, **si en 0.2.1 se edita y se guarda, el reparto se pierde** (0.2.1 solo escribe los campos que conoce). Lo segundo no estaba dicho en el backlog («una canción con reparto abierta y guardada en 0.2.2 lo conserva»: eso sí es cierto).

## Pregunta

¿Basta con avisarlo en las notas de la versión («no edites en 0.2.1 una canción con reparto: se perderá»)? Alternativa: nada, porque volver a 0.2.1 una vez usada 0.2.3 no es un camino previsto.

## Respuesta

(pendiente)
