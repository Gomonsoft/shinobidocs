# 0225 — Líneas dudosas: umbrales spec/ADR, recuento `preparacion.dudosas` y preferencia de la casilla (0.2.2, feature 11)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (opciones conservadoras aplicadas en las tareas [0334](../tareas/0334-deteccion-de-lineas-dudosas.md) y [0335](../tareas/0335-modo-revisar-en-el-editor.md))

## Contexto

1. **Umbrales distintos en la spec y en el ADR.** La tabla de motivos de [06 · Feature 11](../ux/06-editor.md) y el ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) §3 no coinciden: `vozTarde` (spec: la voz empieza ≥ 1 s después del inicio; ADR: sin voz en los 500 ms siguientes), `finCorta` (spec: la voz sigue ≥ 0,4 s antes del siguiente inicio; ADR: ≥ 90 % de voz en 1 s tras el fin y la siguiente empieza ≥ 1 s después), `finTarde` (1 s frente a 1,2 s), `muyCorta` (0,5 s frente a 250 ms) y `muyLarga` (12 s frente a 6 s con < 2 car./s). Además el ADR no nombra `sinInicio`, y la spec añade `reconocimiento` (= `ALINEACION_BAJA`).
2. **`preparacion.dudosas`.** El ADR §3 dice que main guarda el recuento en `preparacion.dudosas` al terminar la preparación y en cada escritura de la letra. Hoy `cancion.preparacion` no existe (lo define la tarea 0306, feature 5) y `shared/cancion.ts` es del lote D.
3. **«Escuchar cada línea al llegar»** debe recordarse «con las preferencias del editor». No había campo para ello en `config.editor`.

## Pregunta

¿Se confirma lo aplicado?

1. **Umbrales**: se usan los del ADR (`PARAMETROS_DUDOSAS`, constantes con nombre) y los nombres de motivo de la spec (`sinInicio`, `sinVoz`, `reconocimiento`, `vozTarde`, `finCorta`, `finTarde`, `muyCorta`, `muyLarga`, en ese orden de prioridad). `muyCorta` = dura < 250 ms **o** > 25 caracteres/s; `muyLarga` = > 6 s y < 2 caracteres/s; `sinInicio` se detecta además (la spec lo pide). Con los umbrales del ADR la biblioteca real daba 0–6 líneas por canción; con los de la spec habría que volver a medir. Si se prefieren los de la spec, es cambiar seis números en `shared/dudosas.ts`.
2. **Recuento**: implementada la función de main `contarDudosasGuardadas` (`main/letras/dudosas.ts`, con test) que calcula el recuento con el nivel base de los picos, pero **no está cableada**: falta el campo `cancion.preparacion` y el servicio de la preparación. Quien implemente 0306/0310 debe llamarla (a) al terminar la preparación y (b) tras cada escritura de la letra de una canción que tenga `preparacion`, y guardar el número en `preparacion.dudosas`.
3. **Preferencia**: campo nuevo `config.editor.revision_autoescucha` (booleano, por defecto `true`, lectura tolerante) en `shared/config.ts` y en el esquema parcial de `shared/ipc.ts` (como `omitir_aviso_letra_lista`); sin canal nuevo.

## Opción provisional tomada (si no bloquea)

Exactamente lo anterior. No hay cambio de contrato de IPC más allá del campo de configuración.

## Respuesta

Arquitecto, 2026-11-22. Lo aplicado se confirma en los puntos 1, 2, 3 y 5. El punto 4 es en parte un defecto (tarea nueva 0370). Queda fijado en ADR [0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md), «Revisión 2026-11-22 (pregunta 0225)».

1. **Umbrales**: mandan los del **ADR**. Están calibrados con la biblioteca real (0–6 líneas por canción, por debajo del 10 % pedido) y los de la spec no se han medido. Los nombres de motivo y su orden son los de la spec, con `sinInicio` y `reconocimiento`. El ADR recoge la correspondencia. La spec 06 · Feature 11 cambiará sus cifras (lo pide la sesión principal al diseñador). Si la verificación con canciones del usuario pide otros valores, se cambian en `PARAMETROS_DUDOSAS` y en el ADR.
2. **Recuento**: confirmado `contarDudosasGuardadas`. El cableado pasa como criterio a la tarea [0308](../tareas/0308-servicio-de-preparacion-desatendida.md) (al terminar la preparación y tras cada escritura de la letra de una canción con `preparacion`) y sale de lo pendiente de 0334.
3. **`config.editor.revision_autoescucha`**: confirmado (booleano, `true` por defecto, lectura tolerante, escribible por el renderer). Es una preferencia del editor como las demás, sin canal nuevo.
4. **Deuda del reducer**:
   - **`origen_fin` al editar un fin a mano: es un defecto.** Por ADR 0028 §3.2, un fin con `origen_fin` automático se puede sustituir con «Sincronizar con la voz» o en la preparación, así que el trabajo a mano del usuario se perdería. Main no puede distinguirlo: un fin cambiado con el mismo `origen_fin` también puede venir de una acción automática. Se corrige en el reducer con la tarea nueva [0370](../tareas/0370-retirar-origen-fin-al-editar-un-fin-a-mano.md) (S, lote C), que tiene que estar hecha antes de que 0308 y 0332 apliquen fines.
   - **`revisada` en memoria: aceptable.** El detector solo usa marcas vigentes y main las retira al escribir. No hay efecto visible y deshacer sigue siendo coherente.
5. **`proponerAjusteSilencios` con `soloIds` y `origen_fin: "silencios"`**: confirmado; es lo que pedía el ADR 0018 (revisión 0.2.2) y el 0024 §4.

