# 0380 — «Todas en un bloque» con voces a la vez

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (limitación aplicada)

## Contexto

Tarea 0360. Con «Cada una en su zona» las voces a la vez funcionan (una secuencia por zona). Con `estilo.pantalla.zonas = "una"` la canción se ve en el bloque único de 0.2.2, que es **una sola secuencia de puestos** (una línea activa, las demás futuras o ya cantadas): con solapes no puede mostrar dos líneas activas a la vez. La spec 07 dice que con «una» se ve «el mismo fotograma que una sin reparto salvo colores, insignias y paréntesis»; no dice qué pasa con los solapes.

## Aplicado (conservador)

Sin cambios: el bloque único sigue su modelo de siempre; con líneas que se pisan, la línea que empieza última toma el puesto activo y la anterior que aún suena sigue su barrido hasta su fin en el puesto que le toque (puede salir de pantalla o verse ya como «cantada» antes de acabar). No se rompe nada y no se escribe nada.

## Pregunta

¿Cómo debe verse una canción con solapes en «Todas en un bloque»?

1. **Recomendada**: avisarlo en el editor. Con solapes, la opción «Todas en un bloque» muestra una nota («Esta canción tiene voces a la vez: se ven mejor en zonas»), sin impedirla.
2. Forzar zonas cuando la canción tenga solapes, ignorando `zonas: "una"`.
3. Dejarlo como está (limitación aceptada).

## Respuesta

Diseñador UX, 2026-11-23. Se elige la **opción 1** (avisar en el editor), con una acción para pasar a zonas. En el reproductor se mantiene lo aplicado, que queda como limitación aceptada.

- **Por qué no la 2**: forzar zonas haría que el control del tema mintiera (dice «en un bloque» y se ve en zonas) y un tema compartido se vería distinto según la canción sin que nadie lo hubiera elegido.
- **Por qué no la 3 sola**: quien elige «Todas en un bloque» no sabría por qué una voz se ve «cantada» antes de acabar.

**Cambio exacto** (ya escrito en [06 · Voces a la vez](../ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto), fila «"Todas en un bloque" con solapes», y en [07 · Voces a la vez](../ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto)):

- **Cuándo se ve la nota**: la canción tiene al menos una línea que se solapa con otra de otra parte y el estilo efectivo tiene `estilo.pantalla.zonas = "una"`.
- **Dónde**: en el panel Estilo, «Letra en pantalla», justo bajo el control «Varias voces». Es una nota de nivel `aviso`, que no enciende el punto de la pestaña.
- **Texto**, clave `edi.pantalla.bloqueSolapes`: «Esta canción tiene voces a la vez: en un bloque solo se ve una cada vez. Se ven mejor en zonas.», con el botón fantasma **[Ver en zonas]**.
- **Qué hace «Ver en zonas»**: elige «Cada una en su zona» (`por_parte`), en un paso de deshacer de estilo. En D1/D4 (tema vinculado) pasa por «Cambiar solo en esta canción», como cualquier cambio del bloque. La nota desaparece.
- **No se impide nada**: «Todas en un bloque» se puede seguir eligiendo y el reproductor usa el modelo de bloque de 0.2.2 tal como lo aplicaste (la línea que empieza después toma el puesto activo).
- **Criterios**: C1S-E7 (editor) y la fila «"Todas en un bloque"» de 07. La guía manual de 0.2.3 lo anota como limitación.

Lo decidido es provisional, como el resto de la sección condicionada. Si el usuario prefiere otra opción, solo cambia la nota.
