# 0305 — Medida por inicios de línea con las 18 canciones: no cumple el criterio de adopción (0.2.2, feature 4, tarea 0385)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no

## Contexto

`npm run calibrar:encaje -- <copia>/biblioteca --inicios` sobre la copia de las 18 canciones (17 con tiempos y picos; 272 pares; 8 desplazamientos por canción). Solo cifras; canciones por los 8 primeros caracteres del id (equivalencia con «canción N» en [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md)).

**Confirmación de la pregunta 0295**: `no_coincide` son `4dabb6ff` (5), `78b9d69d` (8), `e1b65f41` (15) y `f538b75e` (17); la `dudosa` sin limitación es `b688c62b` (12). Las otras 12 son `dudosa` con limitación (8 `vozContinua`, 4 `sinContraste`) y son las «12 plausibles». Seguridad SÍ, 0 propias aceptadas.

**Resultado: ninguna de las 162 combinaciones cumple el criterio de adopción.**
- Ajenas: 0 aceptadas en todas (mejor ajena O\* ≤ 0,14 con cualquier pausa y ventana). Desplazadas ≥ 0,8 s: 0 aceptadas. Falsas correcciones: 0. La seguridad no es el problema.
- Lo que falla es el punto 4: con oMin ≥ 0,5 se acepta como mucho **1 de las 12 plausibles** (`18a9c864`, con pausa 150 o 250 ms y cualquiera de las dos ventanas; con 400 ms, 0). Con oMin 0,6 o 0,7, 0.
- Por qué: los LRC de LRCLIB casi nunca marcan el arranque de voz (O(0) de 0,02 a 0,35 en la mayoría) y hay pocas pausas. De las 12 plausibles, 3 tienen menos de 8 arranques con pausa de 150 ms (`24728256`: 3; `8275d460`: 4; `8766c2f2`: 7) y otras 5 tienen entre 9 y 15. Solo `18a9c864` (O\*(0) 0,50–0,65), `613de88b` (0,20–0,32) y `f413b443` (0,27–0,31) destacan; el resto, con O\*(0) de −0,03 a 0,15, no se distingue del azar aunque la letra sea con toda probabilidad la correcta.
- Sin ajustar nada, pero para dimensionar: con oMin 0,2 se aceptarían 3 de las 12 (`18a9c864`, `613de88b`, `f413b443`; con otras ventanas `76a5239f`) y seguirían 0 ajenas y 0 desplazadas (máximos: ajena 0,14, desplazada ±0,8 s 0,10). Es un corte puesto mirando los datos, sobre 3 canciones: no es adoptable ni se propone.
- Corrección del desfase (punto 5): con oMin 0,5, el d\*\_inicios recupera a ±200 ms 3 de los 6 desplazamientos ≥ 0,5 s de la única propia aceptada (0 correcciones malas): sin base para corregir.

## Decisiones del script (el texto de la tarea dejaba abierto)

1. **d\*\_inicios**: O\* tiene mesetas (la ventana es de ~350–400 ms); con «el más cercano a 0» el error sería de hasta ±180 ms. Se usa el punto medio de la meseta más cercana a 0; un máximo que toca el borde de la rejilla no propone corrección.
2. **Regla en d\***: «falsa corrección» y «corrección propuesta» exigen también `O*(d*) ≥ oMin` y contraste en d\* ≥ `cMin`, con |d\*| ≥ 500 y no en el borde; solo sobre letras que el encaje deja en `dudosa`. Leída sin la regla (cualquier |d\*| ≥ 500) habría decenas de «falsas correcciones» por ruido, y ninguna combinación sería válida.
3. Los puntos 1–3 se exigen con el veredicto del encaje de la letra tal cual y de la letra sin fines; el 4 y el 5, solo tal cual. El punto 5 usa como denominador las desplazadas ≥ 0,5 s de las propias aceptadas.
4. Azar: densidad de arranques en el tramo entre el primer y el último inicio, desplazado con d.

## Pregunta

¿Se da por cerrado este camino? Mi lectura: los inicios no sirven para afirmar «coincide» con LRC sin fines sobre esta muestra; el límite es que el LRC no marca arranques de voz y no la regla. Sin cambios en `encaje.ts`. La vía que queda es la alineación forzada (feature 10). Si se quiere insistir, haría falta una muestra revisada a mano (pregunta 0280), no más parámetros.

## Opción provisional

No se adopta nada; la app queda como está (0378).

## Respuesta

Arquitecto, 2026-11-22. **Se cierra esta vía.** Ninguna combinación cumple el criterio y la causa es el material: los LRC de LRCLIB no marcan el arranque de la voz y hay pocas pausas. No es un problema de parámetros. El corte de oMin 0,2 sale de mirar los datos y no se adopta. No cambia `encaje.ts`. El script `--inicios` se queda como herramienta, por si se mide con canciones revisadas.

**Las cuatro decisiones del script quedan validadas:**
1. **d\* en el punto medio de la meseta más cercana a 0, y sin corrección si toca el borde**: correcto. Con una ventana de ~400 ms, «el más cercano a 0» sesgaría la corrección. El borde ya era la regla del encaje.
2. **Falsa corrección o corrección propuesta exigen O\*(d\*) ≥ oMin y contraste ≥ cMin**: correcto. Es la misma estructura que el encaje, donde se propone solo lo que pasa la regla, y sin ella el criterio 3 mediría ruido.
3. **Seguridad (1–3) con tal cual y sin fines; utilidad (4–5) solo con tal cual**: correcto. Las variantes simulan lo que la app puede recibir, y la utilidad se mide con lo que la app recibe de verdad.
4. **Azar con la densidad del tramo entre el primer y el último inicio, desplazado con d**: correcto, y coherente con la densidad de voz del encaje.

**Confirmado lo de la pregunta 0295**: las `no_coincide` son 5, 8, 15 y 17, y la `dudosa` sin limitación es la 12.

**Consecuencia, escrita en ADR 0024, ADR 0025 y el backlog**: la elección automática de la feature 5 con letras de LRCLIB sin fines queda pendiente de una de dos cosas:
- (a) la feature 10 (la fase 1 de la prueba 0328 ya está en marcha con la copia; su confianza mira el texto contra la voz);
- (b) una medida con canciones revisadas a mano (pregunta [0280](0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md)) que justifique otra regla.
No se buscan más parámetros sobre esta copia.
