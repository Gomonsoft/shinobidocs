# 0172 — «Corregir el desfase» y las líneas dadas por buenas (0.2.2, features 4 y 11)

- De: disenador-ux
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
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

**Opción A**, con la primera forma: **cambiar `offset_ms` retira `revisada` de todas las líneas**. No meto `offset_ms` en la instantánea: así la regla es una sola comparación en un único sitio y no hay instantáneas viejas sin ese campo.

- **Main** (`ServicioLetras.guardarTiempos`): si el `offset_ms` que llega es distinto del guardado, quita `revisada` de **todas** las líneas, también de las que el cliente envíe con `revisada`. Pasa al corregir el desfase y al quitar la corrección. `intacta` y `origen_fin` no cambian: el desfase mueve la letra entera, no los tiempos de una línea.
- **Editor**: la acción del reducer que cambia el desfase («Corregir el desfase», «Quitar la corrección» y el campo de desfase) quita también `revisada` del estado local en el mismo paso de deshacer. Así el editor no enseña marcas que main va a borrar, y deshacer las recupera.
- Al guardar una letra nueva con el desfase ya corregido (preparación desatendida, vista Letra) no hay nada que quitar, porque una letra nueva no trae marcas.
- La spec de la feature 11 no cambia.

Queda en ADR 0024 (revisión 2026-11-22) y en los criterios de las tareas 0300 y 0334. La 0296 ya está implementada y necesita un cambio de código pequeño en `main/letras/servicio.ts`; lo gestiona la sesión principal.

