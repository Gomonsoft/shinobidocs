# 0206 — No existe el script de calibración del encaje (0301)
- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: tarea 0301 (criterio «script de solo lectura que repite la tabla del ADR 0024»)

## Contexto
La tarea 0301 pide un script de solo lectura que repita la tabla de calibración del ADR 0024 con las canciones del usuario y negativos fabricados. En `app/scripts/` solo existe `calibrar-silencios*`; no hay `calibrar-encaje*` ni `calibrar-dudosas.ts` (este último lo cita el ADR para la feature 11). Esta máquina no tiene la biblioteca del usuario, así que la calibración no se puede repetir aquí.

## Pregunta
¿Quién escribe `app/scripts/calibrar-encaje.ts` (más CLI `.mjs` y `npm run calibrar:encaje`), siguiendo el patrón de `calibrar-silencios`? Debe imprimir solo cifras: F(0), I(0), d\*, veredicto de `evaluarEncaje` para las letras propias, los 90 pares de letra ajena y los desplazamientos ±0,4, ±0,8, ±1,5 y ±3 s. Hasta entonces, el criterio «10/10 propias, 0 ajenas aceptadas» queda pendiente del usuario (guía manual de la feature 4, caso 1).
