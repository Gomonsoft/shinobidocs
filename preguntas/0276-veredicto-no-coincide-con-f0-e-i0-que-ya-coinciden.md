# 0276 — Una letra que ya coincide con la voz (F(0) ≥ 0,88 e I(0) ≥ 0,95) sale «no coincide» o «dudosa» por la rama de `d*` (0.2.2, feature 4)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

Con las 17 letras con tiempos de la biblioteca del MVP (informe [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)), 8 salen `coincide`, pero **12** tienen F(0) ≥ 0,88 e I(0) ≥ 0,95 (sin desplazar). Las otras 4 (canciones 2, 9, 16 y 18) fallan por cómo se decide el veredicto en `app/src/shared/encaje.ts` (líneas 188-196):

- Canciones 2, 9 y 18: hay un `d*` espurio de 0,7 a 3,6 s con **ganancia de F ≤ 0,014** (curva plana) y `desfaseVariable` (la primera y segunda mitad dan `d*` distintos). La rama «`|d*| ≥ 500 ms` y `coincide` en `d*` y `desfaseVariable` → `no_coincide`» las declara «otra versión» aunque en `d = 0` ya coincidían (F(0)/I(0): 0,908/1,000; 0,937/0,988; 0,954/0,990).
- Canción 16: `|d*|` = 60 ms (< 500), así que el veredicto es el de `d*` (I(d*) = 0,935 < 0,95) y no el de `d = 0` (I(0) = 0,968): sale `dudosa`, sin que se proponga mover nada.

El ADR 0024 vio el mismo síntoma en la canción rápida (d* = 1180, ganancia 0,002) y escribió que sale `coincide`; con el código actual, con `desfaseVariable` no es así.

## Pregunta

¿El veredicto debe tomar el de `d = 0` cuando no se propone corrección (`|d*| < 500`, ganancia < 0,02 o desfase variable)? Medido: con esa regla, las propias aceptadas pasan de 8/17 a 12/17. Hay que medir también el efecto en las ajenas (6/272 tal cual): habría que repetirlo con `calibrar:encaje` tras el cambio. Es un cambio de `shared/encaje.ts` y de sus pruebas (el programador, con tu decisión).

## Opción provisional

Ninguna; no se ha tocado el código.

## Respuesta

Arquitecto, 2026-11-22. **Es un defecto de la regla del ADR, que era ambigua, y la implementación eligió la lectura estricta.** §1 decía «veredicto sobre d\*» y «un desfase variable no se corrige». La tarea 0297 lo implementó como «`|d*| ≥ 500` y desfase variable ⇒ `no_coincide`» aunque d = 0 ya coincidiera. Y para `|d*| < 500` tomó el veredicto de d\*. La calibración del ADR contaba la canción rápida como `coincide`, así que esa no era la intención.

**Regla nueva** (ADR 0024, revisión «Medida con canciones reales», tabla del punto 1; tarea [0378](../tareas/0378-encaje-veredicto-en-d0-y-guardas-de-fiabilidad.md)), en `app/src/shared/encaje.ts`, líneas 179–196:
- `|d*| < 500` → el **mejor** de `v0` y `vMejor` (arregla la canción 16).
- Si se cumple la corrección y d\* no está en el borde → `desfasada`.
- Si no, `v0 = coincide` → `coincide`. Un d\* plano o variable ya no tapa lo que se ve en d = 0 (arregla 2, 9 y 18).
- `desfaseVariable` solo convierte en `no_coincide` cuando d = 0 **no** coincide. Además exige que al menos una mitad tenga ganancia real (≥ 0,02): dos mitades planas no son un desfase variable.

**Qué cambia de verdad**: no se pasa de 8/17 a 12/17 aceptadas. Esas cuatro letras dejan de decir «No coincide: puede ser otra versión», que es falso. Pero las guardas de la pregunta 0275 las dejarán casi seguro en «No está claro»: 9 y 18 por voz continua, y 2 y 16 por contraste bajo (curva plana). Es el mensaje honesto. El efecto en las ajenas lo mide `qa` con el script tras 0378/0381.
