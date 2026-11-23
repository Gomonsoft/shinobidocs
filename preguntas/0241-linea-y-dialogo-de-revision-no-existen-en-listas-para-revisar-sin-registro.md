# 0241 — Una «Lista para revisar» sin registro de preparación no muestra la línea ⚑ ni pregunta al marcar como lista (0.2.2, feature 11)

- De: qa
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (la feature 11 queda «hecha con reservas»)

## Contexto

La spec 02 (F11-B1, F11-B3) y 06 (F11-E12) piden que la **misma decisión** valga en el editor y en la Biblioteca. La Biblioteca la toma de `resumen.preparacion.dudosas` y `dudosasImportantes` (`main/biblioteca/resumen.ts:61-90`), que solo existen si la canción tiene `cancion.preparacion`. Pero «Lista para revisar» se **deriva de los pasos** («da igual si lo hizo la app o el usuario», 02 · tabla de estados): una canción hecha a mano, o un borrador de 0.2.1 con todo completo (los 5 borradores del usuario, tras sincronizarlos), es «Lista para revisar» **sin** registro. Para ella:

- `TarjetaCancion.tsx:507` (`paraRevisar && resumen.preparacion`) no pinta la línea «⚑ n líneas por revisar» ni «Sin líneas dudosas». Visto en `docs/ux/revisiones/0.2.2-feature-5/biblioteca-1280x800-100-bandeja-filtrada.png`: «Letra de LRCLIB sincronizada» (sin registro) no tiene la línea y «Borrador con letra a medias» (con registro) sí.
- `useMarcarRevision.tsx:86` lee `p?.dudosasImportantes ?? p?.dudosas ?? 0` con `p` nulo: **nunca pregunta**, mientras el editor, que calcula en vivo, sí preguntaría.

## Pregunta

¿Dónde debe calcularse para estas canciones? Opciones: (A) main calcula `dudosas`/`dudosasImportantes` para **toda** «Lista para revisar» derivada al construir el resumen (con la caché de picos; `contarDudosasGuardadas` ya existe) aunque no haya registro; (B) la Biblioteca pide el recuento a main solo al abrir el menú «Marcar como lista»; (C) se acepta que sin registro no haya línea ni pregunta y se cambia la spec. Preferiría A: es lo que hace que el usuario no pueda marcar sin enterarse.

## Opción provisional

Ninguna. Se informa como defecto de severidad **media** (afecta justo al caso que motivó la feature: rescatar borradores propios).

## Respuesta

Arquitecto, 2026-11-22. **Opción A, sin escribir nada en disco.** Es un defecto real: afecta justo a los borradores que la feature quiere rescatar. Queda fijado en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), «Revisión 2026-11-22 (pregunta 0241)», y el cambio va en la tarea nueva [0377](../tareas/0377-recuento-de-revision-sin-registro-y-privacidad-de-la-sonda.md).

- **Dónde**: el recuento de líneas por revisar es un **dato derivado de main, en memoria**: `dudosas` y `dudosasImportantes` por canción, junto al índice de la biblioteca. Se calcula para **toda** canción que derive «Lista para revisar» (tenga o no registro `preparacion`) con `contarDudosasGuardadas`. **No se crea un registro mínimo**: inventar `preparacion` en canciones que nunca se prepararon falsearía «Elegimos esta letra por ti» y la bandeja. Tampoco se escribe en `cancion.json`, así que 0.2.1 no nota nada.
- **Cuándo**: en segundo plano tras el arranque (una canción cada vez, después de la comprobación del runtime), al quedar listos los picos y tras cada escritura de la letra. El coste es leer el nivel base de la caché de picos (≈ 25 000 bloques por 4 min) y < 10 ms de cálculo: unos 1–2 s para 100 canciones, sin bloquear nada. Se invalida con la letra (`modificada`) o los picos.
- **Resumen**: campo nuevo a nivel de canción, `revision: { dudosas, dudosasImportantes } | null` (`null` = aún no calculado o sin picos). La tarjeta y «Marcar como lista» lo leen en lugar de `preparacion.dudosas`. `preparacion.dudosas` en disco se mantiene como valor inicial hasta que el cálculo esté listo.
- **«Marcar como lista» con `revision: null`**: antes de decidir, el renderer pide **`biblioteca.recuentoRevision(id)`** → `{ dudosas, dudosasImportantes } | null`, que lo calcula al momento. Así la Biblioteca y el editor deciden igual (F11-B1, F11-B3, F11-E12).
