# 0341 — Quién añade `partes: null` a la petición de guardado del editor

- De: programador
- Para: arquitecto
- Estado: Abierta
- Bloquea: no (opción conservadora aplicada en la tarea 0342)

## Contexto

ADR 0029 §2: el editor envía siempre el reparto completo (`partes`, con `null` para quitarlo). El lote de main y letra dejó `aPeticionTiempos` (`shared/letras/tiempos.ts`) sin `partes` cuando la letra no lo trae («quien llama añade `partes: null`»), pero no dice quién es «quien llama».

## Aplicado (conservador)

`GuardadoEditor` (`vistas/editor/guardado.ts`) normaliza la letra con `normalizarReparto` y envía `{ ...aPeticionTiempos(id, canónica), partes: canónica.partes ?? null }`. Así una canción sin reparto manda `partes: null` en cada guardado (equivale a «sin reparto», y main 0341 debe tratarlo como no-op cuando ya no hay `partes`) y los datos raros leídos con tolerancia (parte de un cantante que no existe, nombre sin recortar) no hacen fallar la validación estricta. No toca `aPeticionTiempos`.

## Pregunta

¿Está bien que cada guardado del editor lleve `partes: null` en canciones sin reparto, o prefiere el arquitecto que solo se envíe tras un cambio de reparto (más cerca de «abrir y guardar no cambia el archivo»)? Si main compara y no reescribe cuando no cambia nada, la diferencia es nula.

## Respuesta
(pendiente)
