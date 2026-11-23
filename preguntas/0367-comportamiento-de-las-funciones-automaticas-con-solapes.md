# 0367 — Qué hacen «Ajustar los silencios», encaje, dudosas, alineación y `.lrc` con líneas solapadas

- De: programador (prueba técnica 0356)
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (define el criterio 3 de la prueba; 0358 lo toma tal cual si se confirma)

## Contexto

La voz separada mezcla a todos los cantantes: donde dos líneas se solapan no se puede atribuir la voz a una u otra. En el spike (`docs/spikes/0029-voces-a-la-vez/prototipo/solapes.ts`, `pruebas/criterio3.test.ts`) medí las funciones reales de `app/src/shared` con la letra inventada y la voz «perfecta» (la unión de los intervalos reales):

| Función | Sin adaptador (código real, regla nueva) | Con el adaptador del prototipo |
|---|---|---|
| Ajustar los silencios | 6 cambios, **4 sobre líneas solapadas**; el coro (l09, 33 000) se alargaba a 35 100 porque la voz mezclada sigue | **Excluye** las líneas solapadas (11 de 13) y lo dice (`edi.partes.solapaExcluidas`); 2 cambios, ambos fuera de solapes |
| Encaje («Comprobar la letra») | `tramosDe` recorta cada tramo al inicio del siguiente: F0 = 0,972, 1 línea «sin voz» y 1 tramo «voz sin letra» falsos | **Fusiona** los tramos solapados en uno (`aplanarSolapes`, sin tocar `encaje.ts`): F0 = 1, 0 falsos; con la voz desplazada 700 ms propone `desfasada` de 700 ms |
| Líneas dudosas | 1 falso positivo (l09, «fin corto») | **Excluye** las solapadas (salvo «sin inicio»): 0 falsos; un fallo real fuera de los solapes (l07 sin voz) se sigue detectando |
| `.lrc` | Escribe una marca vacía a los 33 s **dentro** de una línea que sigue sonando hasta los 35 s | Solo la línea del grupo que acaba la última puede llevar la marca vacía; el orden temporal y las 13 líneas se conservan al reimportar |
| Alineación (ADR 0028) | `shared/alineacion.ts` aún no existe | Regla propuesta: **excluye** las solapadas, como silencios y dudosas. Solo probado el predicado |

## Pregunta

¿Se confirma «excluir» (silencios, dudosas, alineación), «fusionar» (encaje) y «una sola marca vacía por grupo» (`.lrc`)?

## Opción provisional tomada (si no bloquea)

La de la tabla.

## Respuesta

Arquitecto, 2026-11-23. **Confirmado**, con un único predicado `solapadas` y adaptadores, sin cambiar el código de las funciones:
- **excluyen**: «Ajustar los silencios», «Fin al final de la voz», los fines prudentes de la preparación y de «Ajustar los fines…», las líneas dudosas (salvo `sinInicio`) y la alineación forzada si entra;
- el **encaje fusiona** (`aplanarSolapes`) y mantiene sus guardas de prudencia;
- el **`.lrc`** escribe una sola marca vacía por grupo.
Queda en [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), «Resultado de la prueba técnica de voces a la vez» y en la 0358.
