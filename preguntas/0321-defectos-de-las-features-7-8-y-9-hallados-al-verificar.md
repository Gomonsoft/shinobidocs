# 0321 — Defectos de las features 7, 8 y 9 hallados al verificar

- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no

## Contexto

Verificación de 0317, 0322 y 0327 (alpha.3, HEAD `81aed30`), con capturas y revisión de código. Los de seguridad están en la 0320.

## Defectos

1. **Media · el resultado de «Eliminar…» pierde los títulos de las canciones eliminadas** (`app/src/renderer/src/vistas/biblioteca/acciones/DialogoEliminar.tsx:68-74`, `nombre(id)` busca en `porId`, la biblioteca ya sin ellas): las filas con ✓ dicen «Canción sin nombre — Sin artista» (captura `resultado-eliminar-parcial`). Guardar los títulos antes de ejecutar.
2. **Media-baja · el recuento de «Preparar» de la barra no coincide con el del diálogo** (`vistas/biblioteca/tarjeta.ts` `puedePrepararResumen` frente a `shared/derivados.ts` `aplicaPreparar`): con 2 Listas con letra anterior, 2 borradores y 1 con la letra pegada, la barra dice «Preparar (2 de 5)» y el diálogo «Preparar 4 canciones» (suma las Listas a las que pondría fines). F8-2 pide la cifra de las que aplican.
3. **Baja · «Ya tiene esos datos» como motivo de «Preparar»** (`acciones/textos.ts`, `MOTIVO.NADA_QUE_HACER`): es el texto de «Editar datos…»; en «Preparar» una letra pegada sin sincronizar sale con ese motivo. Pedir texto propio al diseñador.
4. **Baja · `toastFin` con k = n** (`vistas/biblioteca/textosAjustarFines.ts`): «Pusimos fin a 6 de 6 líneas… Las demás no tenían una pausa clara.»
5. **Baja · textos del lote de exportación**: doble punto en «No se puede guardar en esa carpeta.. Puede que…» (`exportacion/lote/textos.ts:70`, `detenido` concatena el texto del error, que ya acaba en punto); y las variantes singulares que respondió el diseñador en la 0316 no están (`avisoExiste` con k = 1; la prueba E2E de `exportacion.spec.ts` aún espera «1 de estas canciones ya tienen» y «1 canciones no se exportarán»).
6. **Baja · F7, columna «Duración» de la tabla** recortada (`vistas/anadir/lote/TablaLote.tsx`; capturas `anadir-*-tabla-*`).
7. **Baja · `fuente.lote`, `eliminarVarias`, `editarDatosVarias` aceptan ids repetidos** (`shared/ipc.ts:1144`, `idsCancionSchema` sin unicidad): la segunda ocurrencia de una eliminación sale `error`. Inofensivo.
8. **Baja · `ejecutarDatos` no vuelve a mirar `EDICION_BLOQUEADA` por canción al escribir** (`main/biblioteca/lotes.ts:129-148`; sí lo hace `ejecutarEliminar`): una canción que empieza a sonar a mitad de un lote largo se edita.
9. **Ya recogido**: `filaLoteSchema.ruta` (tarea 0390, pregunta 0317).

## Pregunta

¿Se recogen en una tarea de remates de alpha.3?

## Respuesta
