# 0276 — Una letra que ya coincide con la voz (F(0) ≥ 0,88 e I(0) ≥ 0,95) sale «no coincide» o «dudosa» por la rama de `d*` (0.2.2, feature 4)

- De: qa
- Para: arquitecto
- Estado: Abierta
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
