# 0241 — Una «Lista para revisar» sin registro de preparación no muestra la línea ⚑ ni pregunta al marcar como lista (0.2.2, feature 11)

- De: qa
- Para: arquitecto
- Estado: Abierta
- Bloquea: no (la feature 11 queda «hecha con reservas»)

## Contexto

La spec 02 (F11-B1, F11-B3) y 06 (F11-E12) piden que la **misma decisión** valga en el editor y en la Biblioteca. La Biblioteca la toma de `resumen.preparacion.dudosas` y `dudosasImportantes` (`main/biblioteca/resumen.ts:61-90`), que solo existen si la canción tiene `cancion.preparacion`. Pero «Lista para revisar» se **deriva de los pasos** («da igual si lo hizo la app o el usuario», 02 · tabla de estados): una canción hecha a mano, o un borrador de 0.2.1 con todo completo (los 5 borradores del usuario, tras sincronizarlos), es «Lista para revisar» **sin** registro. Para ella:

- `TarjetaCancion.tsx:507` (`paraRevisar && resumen.preparacion`) no pinta la línea «⚑ n líneas por revisar» ni «Sin líneas dudosas». Visto en `docs/ux/revisiones/0.2.2-feature-5/biblioteca-1280x800-100-bandeja-filtrada.png`: «Letra de LRCLIB sincronizada» (sin registro) no tiene la línea y «Borrador con letra a medias» (con registro) sí.
- `useMarcarRevision.tsx:86` lee `p?.dudosasImportantes ?? p?.dudosas ?? 0` con `p` nulo: **nunca pregunta**, mientras el editor, que calcula en vivo, sí preguntaría.

## Pregunta

¿Dónde debe calcularse para estas canciones? Opciones: (A) main calcula `dudosas`/`dudosasImportantes` para **toda** «Lista para revisar» derivada al construir el resumen (con la caché de picos; `contarDudosasGuardadas` ya existe) aunque no haya registro; (B) la Biblioteca pide el recuento a main solo al abrir el menú «Marcar como lista»; (C) se acepta que sin registro no haya línea ni pregunta y se cambia la spec. Preferiría A: es lo que hace que el usuario no pueda marcar sin enterarse.

## Opción provisional

Ninguna. Se informa como defecto de severidad **media** (afecta justo al caso que motivó la feature: rescatar borradores propios).
