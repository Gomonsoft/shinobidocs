# 0235 — El motivo por el que la preparación no eligió la letra no llega a la interfaz
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opción conservadora aplicada en la tarea [0311](../tareas/0311-preparacion-en-progreso-letra-editor-y-ajustes.md))

## Contexto

La spec pide el motivo de «Elige la letra» en tres sitios: `prog.prep.r2.cuerpo` («No la elegimos por ti porque {motivo}») en la vista de progreso, `let.prep.elige` con `let.prep.motivo.*` en la vista Letra y la nota de la tarjeta. `elegirLetra` (`main/preparacion/eleccion.ts`) decide con `MotivoNoElige` (`sin_tiempos`, `duracion`, `no_coincide`, `sin_encaje`, `ambigua`), pero solo lo escribe en el registro de la aplicación: `preparacion.busqueda.motivo` queda `null` con `elige` y el resumen (`ResumenPreparacionIpc`) tampoco lo lleva.

## Pregunta

¿Se guarda el motivo en `preparacion.busqueda.motivo` (y se expone en `ResumenPreparacionIpc`) con un conjunto cerrado que coincida con `let.prep.motivo.*` (`varias`, `sinExacta`, `duda`, `noCoincide`, `soloTexto`, `sinComprobar`)?

## Opción provisional tomada (si no bloquea)

- **Vista Letra**: el motivo se deduce en el renderer de las candidatas y de su comprobación, que la vista ya tiene (`letra/preparacion.ts`, `motivoElige`): solo texto, sin exacta (diferencia de duración > 2 s), varias que coinciden, sin comprobar, ninguna coincide o duda. Es una aproximación de lo que decidió main.
- **Vista de progreso (R2)**: usa siempre `let.prep.motivo.duda` («no está claro que coincida con tu audio»), porque no tiene las candidatas.

Si se guarda el motivo, ambas lo leerían del registro y se retira `motivoElige`.


## Respuesta

Arquitecto, 2026-11-22. **Sí: `preparacion` guarda el motivo de la no elección y el código del error de búsqueda.** Son metadatos de la decisión, sin texto de letra. Hoy los dos sitios de la spec que los muestran deducen algo distinto de lo que decidió main. Queda fijado en ADR [0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), «Revisión 2026-11-22 (pregunta 0235)», y el cambio va en la tarea nueva [0373](../tareas/0373-motivo-de-la-no-eleccion-en-la-preparacion.md).

- **Motivo de no elegir**: campo nuevo `busqueda.no_elige`, de un catálogo cerrado igual a `let.prep.motivo.*`: `varias`, `sinExacta`, `duda`, `noCoincide`, `soloTexto`, `sinComprobar`, o `null`. Correspondencia con `MotivoNoElige`: `ambigua` → `varias`, `duracion` → `sinExacta`, `no_coincide` → `noCoincide`, `sin_tiempos` → `soloTexto`, `sin_encaje` → `sinComprobar`, y un único candidato sincronizado `dudosa` → `duda` (motivo que hay que añadir a `MotivoNoElige`). `busqueda.motivo` sigue siendo el **código de ADR 0005** del fallo (`SIN_CONEXION`, `SERVICIO_NO_DISPONIBLE`…).
- **Resumen**: `ResumenPreparacionIpc.busqueda` gana `motivo` y `noElige`. La vista de progreso (R2), la vista Letra y la tarjeta los leen, y se retira la deducción `motivoElige` del renderer. «Letra pendiente» distingue `SIN_CONEXION` de `SERVICIO_NO_DISPONIBLE`.
- **«Preparar» por tarjeta**: decidir en local es aceptable solo si la regla es **la misma función** que usa main en `preparacion.previsualizar`. Por eso pasa a una función pura compartida, `aplicaPreparar(cancion)` en `shared/derivados.ts`, usada por los dos. La respuesta de `preparar` (con `omitidas`) sigue mandando.
- **`biblioteca.marcarPreparacionRevisada(id)`** → `ResumenCancionIpc | null`, rol principal: **confirmado**. Solo escribe `preparacion.revisada = true` (metadato de la canción, no letra), así que se admite también durante una sesión en vivo, como el resto de metadatos de la Biblioteca (ADR 0017 §9).
