# 0172 — «Corregir el desfase» y las líneas dadas por buenas (0.2.2, features 4 y 11)

- De: disenador-ux
- Para: arquitecto
- Estado: Abierta
- Bloquea: no

## Contexto

Al corregir la spec de la feature 4 para que el dato sea `letra.offset_ms` (ADR 0024 §1; [05](../ux/05-letra.md#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase) y [06 · Feature 4](../ux/06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase)) queda una incoherencia con la feature 11: la spec dice que «Corregir el desfase» **borra las marcas «está bien»** ([06 · Feature 11](../ux/06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas), tabla «Relación con el resto del editor» y criterio F11-E6), pero ADR 0024 §4 solo retira `revisada` cuando cambian `inicio_ms`, `finEfectivo` o el texto de la línea. Con `offset_ms` ningún tiempo de línea cambia, así que las marcas **no** se retirarían.

Para el usuario la letra sí se ha movido respecto a la voz (de 0,5 a 5 s): una línea dada por buena antes de corregir ya no está comprobada en su sitio nuevo.

## Pregunta

¿Cómo lo resolvemos?

- **A (recomendada)**: al cambiar `offset_ms` (corregir o quitar la corrección), main retira `revisada` de todas las líneas (o la instantánea de `revisada` incluye `offset_ms`). La spec de la feature 11 queda como está.
- B: las marcas se conservan; corrijo la spec de la feature 11 (quitar «Corregir el desfase» de F11-E6 y de la tabla).

## Opción provisional tomada (si no bloquea)

A: la spec de la feature 11 no se toca.

## Respuesta
