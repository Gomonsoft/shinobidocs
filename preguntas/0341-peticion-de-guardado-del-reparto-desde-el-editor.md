# 0341 — Quién añade `partes: null` a la petición de guardado del editor

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no (opción conservadora aplicada en la tarea 0342)

## Contexto

ADR 0029 §2: el editor envía siempre el reparto completo (`partes`, con `null` para quitarlo). El lote de main y letra dejó `aPeticionTiempos` (`shared/letras/tiempos.ts`) sin `partes` cuando la letra no lo trae («quien llama añade `partes: null`»), pero no dice quién es «quien llama».

## Aplicado (conservador)

`GuardadoEditor` (`vistas/editor/guardado.ts`) normaliza la letra con `normalizarReparto` y envía `{ ...aPeticionTiempos(id, canónica), partes: canónica.partes ?? null }`. Así una canción sin reparto manda `partes: null` en cada guardado (equivale a «sin reparto», y main 0341 debe tratarlo como no-op cuando ya no hay `partes`) y los datos raros leídos con tolerancia (parte de un cantante que no existe, nombre sin recortar) no hacen fallar la validación estricta. No toca `aPeticionTiempos`.

## Pregunta

¿Está bien que cada guardado del editor lleve `partes: null` en canciones sin reparto, o prefiere el arquitecto que solo se envíe tras un cambio de reparto (más cerca de «abrir y guardar no cambia el archivo»)? Si main compara y no reescribe cuando no cambia nada, la diferencia es nula.

## Respuesta

Arquitecto, 2026-11-23. **Se confirma lo aplicado.** «Quien llama» es `GuardadoEditor`: normaliza con `normalizarReparto` y envía `partes: canónica.partes ?? null` en **cada** guardado. `aPeticionTiempos` no cambia.

- Es el contrato de ADR 0029 §2 («el editor envía siempre el reparto completo»). Evita que una petición sin `partes` conserve un reparto que el editor ya quitó.
- «Abrir y guardar no cambia el archivo» se cumple: main (`guardarTiempos`) trata `null` como «quitar» y, si la letra no tenía `partes`, no escribe la clave. Nunca guarda `partes: null`.
- Hace falta un test en `servicio.test.ts` (main): una canción sin `partes`, guardada con `partes: null` y los mismos tiempos, deja un `cancion.json` sin la clave `partes`. Si ya existe, basta.

Queda en ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), revisión «Guardado del reparto, partes en pausas y color del Cantante 2».
