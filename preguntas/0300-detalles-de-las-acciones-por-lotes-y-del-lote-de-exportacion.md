# 0300 — Detalles de la interfaz de las acciones por lotes y del lote de exportación que la spec no fija
- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción conservadora aplicada en cada punto)

## Contexto

Al implementar 0320 (barra y diálogos de acciones por lotes) y 0321 (diálogo de exportar varias) quedaron puntos sin texto o sin decisión en la spec.

## Pregunta y opción aplicada

1. **Motivo `SIN_FUENTE` de «Preparar»** (borrador sin el audio descargado): no hay clave. Aplicado: `bib.acc.motivo.noLista` («Aún no está lista»).
2. **Notas de «Preparar» con letra**: solo hay «Ya tiene letra: comprobará la letra y ajustará los fines». Si main solo propone `ajustando_fines`, aplicado «Ya tiene letra: ajustará los fines». «Separará las pistas y buscará la letra» sale si la separación no está completada.
3. **Aviso `finesSinMarca`** (`bib.acc.preparar.aviso.finesSinMarca`, `preparar(ids, { finesSinMarca: true })`): **no implementado**; depende de las tareas 0378/0380/0381 (contrato aún sin entregar). Se añadirá cuando el contrato exista.
4. **Omitidas que no cuentan como problema** («Editar datos…» y «Eliminar…»): una canción `NADA_QUE_HACER` (ya tenía el dato) se vio en la confirmación; si solo hay de esas, el diálogo se cierra con su toast. Cualquier otra omisión (`EDICION_BLOQUEADA`, `CANCION_EN_REPRODUCCION`) abre el resultado por canción. La fila de `EDICION_BLOQUEADA` va sin el prefijo «Omitida:» porque su texto ya dice «No se ha cambiado».
5. **Nota de lo que arrastra «Eliminar…»**: main solo da recuentos (`trabajos`, `entradasCola`), no el tipo de trabajo. Aplicado «Se cancelará su trabajo en curso» (sin distinguir separación, descarga, preparación o exportación).
6. **«Editar datos…», destino del tema**: la lista revelable dice «Cambiará de aspecto» por canción; main no da el nombre del tema nuevo (`cambiaTema` es booleano).
7. **«Aplicar tema…»** sigue siendo el botón primario de la barra («sin cambios», spec); «Preparar» es secundario.
8. **Aviso `exp.lote.aviso.existe`** («{k} de estas canciones ya tienen un video en esta carpeta»): no se puede calcular antes de confirmar (no hay forma de consultar la carpeta; ver 0301). Aplicado: no se muestra; las omitidas por nombre aparecen en el seguimiento y en el resultado como «Omitida: ya había un video con ese nombre».
9. **«Mostrar la carpeta» del resultado**: la API actual revela un archivo, no abre la carpeta sin seleccionar (ver 0301). Aplicado: revela el primer video terminado.
10. **[Cambiar opciones]** del resultado cuando todas fallaron con un código que no se arregla repitiendo: no implementado; el botón es siempre «Reintentar las fallidas».
11. **[✕] de la fila `act.exp.lote`** del panel de actividad: abre el diálogo del lote con la pregunta «¿Cancelar las {k} que faltan?» visible (equivale a «Cancelar las que faltan», con su confirmación).
12. **Cabecera «Ver cuáles»** del diálogo de lote: lista con «{título} — {artista} · {duración}» y la nota; no repite el nombre del archivo (`→ {nombre}`), que main aún no propone por canción antes de confirmar.

## Respuesta

Diseñador UX, 2026-11-23. Specs 02 · Feature 8 y 10 · Feature 8 actualizadas. **Nada de esto bloquea alpha.3.**

1. **Cambio de texto**: «Aún no está lista» no explica nada. Clave nueva `bib.acc.motivo.SIN_FUENTE`: «No se prepara: falta el audio. Ábrela con «Continuar» para elegir el archivo o descargarlo.»
2. **Conforme**; clave `bib.acc.preparar.nota.soloFines` («Ya tiene letra: ajustará los fines»).
3. **Conforme**: se añade con el contrato (tarea 0382).
4. **Conforme** las dos cosas; escrito en la spec.
5. **Conforme**: `bib.acc.eliminar.nota.trabajo` («Se cancelará su trabajo en curso»).
6. **Conforme**: «Cambiará de aspecto» sin nombre del tema.
7. **Conforme**.
8. **Conforme hasta la 0301**: sin aviso previo y con el botón contando todas; las omitidas por nombre se ven en H e I. Cuando main dé los nombres existentes, el aviso y el número real del botón (F8-V3) pasan a ser obligatorios.
9. **Conforme hasta la 0301**: revelar el primer video terminado. Cuando exista, abrir la carpeta sin seleccionar.
10. **Cambio** (no bloquea): si **todas** fallaron con un código que no se arregla repitiendo (tabla de la fase 7: sin espacio, destino no disponible, perfil no soportado, captura), el botón es **[Cambiar opciones]** y vuelve a G con esas canciones y las opciones anteriores; si alguna se puede reintentar, «Reintentar las fallidas».
11. **Conforme**.
12. **Conforme** hasta que main proponga el nombre por canción.
