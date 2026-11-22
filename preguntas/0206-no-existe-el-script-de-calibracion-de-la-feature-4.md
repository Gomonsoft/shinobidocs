# 0206 — No existe el script de calibración del encaje (0301)
- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: tarea 0301 (criterio «script de solo lectura que repite la tabla del ADR 0024»)

## Contexto
La tarea 0301 pide un script de solo lectura que repita la tabla de calibración del ADR 0024 con las canciones del usuario y negativos fabricados. En `app/scripts/` solo existe `calibrar-silencios*`; no hay `calibrar-encaje*` ni `calibrar-dudosas.ts` (este último lo cita el ADR para la feature 11). Esta máquina no tiene la biblioteca del usuario, así que la calibración no se puede repetir aquí.

## Pregunta
¿Quién escribe `app/scripts/calibrar-encaje.ts` (más CLI `.mjs` y `npm run calibrar:encaje`), siguiendo el patrón de `calibrar-silencios`? Debe imprimir solo cifras: F(0), I(0), d\*, veredicto de `evaluarEncaje` para las letras propias, los 90 pares de letra ajena y los desplazamientos ±0,4, ±0,8, ±1,5 y ±3 s. Hasta entonces, el criterio «10/10 propias, 0 ajenas aceptadas» queda pendiente del usuario (guía manual de la feature 4, caso 1).

## Respuesta

Arquitecto, 2026-11-22. Faltaba una tarea de programación: el criterio estaba en la 0301, que es de verificación. La he creado: **[0368 · Script `calibrar:encaje`](../tareas/0368-script-de-calibracion-del-encaje.md)** (S, alpha.1, lote C, depende de 0297). La 0301 depende ahora de ella y su criterio pasa a ser «ejecutar el script».

Interfaz mínima:
- **Comando**: `npm run calibrar:encaje -- <carpeta-de-biblioteca> [--ids …] [--json]`, con el patrón de `calibrar:silencios`.
- **Entrada**: la carpeta de datos, fuera del repositorio, solo lectura. Usa los picos ya generados y no los genera.
- **Salida**: tabla por canción con veredicto, F(0), I(0), d\*, F(d\*), ganancia y `desfaseVariable`; los pares de letra ajena; los desplazamientos ±0,4, ±0,8, ±1,5 y ±3 s; y un resumen. Nunca escribe en la carpeta de datos ni imprime textos de letra.

`calibrar-dudosas` ya está como criterio de la tarea [0334](../tareas/0334-deteccion-de-lineas-dudosas.md) (feature 11), así que no cambia nada ahí.

El criterio «10/10 propias, 0 ajenas aceptadas» sigue siendo del usuario: lo ejecuta en su equipo con su biblioteca.
