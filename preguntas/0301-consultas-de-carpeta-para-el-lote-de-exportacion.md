# 0301 — Consultas de carpeta que necesita el diálogo de exportar varias
- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-23, arquitecto)
- Bloquea: no

## Contexto

La spec 10 · Feature 8 pide en el formulario del lote (G) el aviso «{k} de estas canciones ya tienen un video en esta carpeta» y que «Mostrar la carpeta» abra la carpeta sin seleccionar ningún archivo.

## Pregunta

1. ¿Puede main ofrecer, sin ejecutar nada, el recuento (y los nombres propuestos) de las canciones del lote que ya tienen un archivo en la carpeta elegida? Por ejemplo `exportacion.previsualizarLote({ cancionIds, formato, carpetaId })` → `{ nombres: [{ cancionId, archivo, existe }] }`. Con él la interfaz calcularía `exp.lote.aviso.existe` y mostraría el nombre de cada archivo en «Ver cuáles».
2. ¿Puede añadirse una forma de abrir la carpeta de un lote (por `loteId` o `carpetaId`) sin seleccionar un archivo?

## Opción aplicada

Sin (1) el aviso no se muestra; sin (2) «Mostrar la carpeta» revela el primer video terminado del lote. Ver también la pregunta 0300 (puntos 8 y 9).

## Respuesta

Arquitecto, 2026-11-23. **Sí a las dos**, con el renderer sin rutas. Queda en ADR [0026](../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md), revisión «Consultas de carpeta del lote de exportación».

1. `exportacion.previsualizarLote({ cancionIds, formato, carpetaId, siExiste })` → `{ filas: [{ cancionId, archivo, existe, accion, motivo? }], exportables }`.
   - `archivo` es solo el nombre.
   - Comparte con `iniciarLote` la misma función pura de nombres.
   - No escribe, no encola y **no gasta** el `carpetaId`.
   - Es orientativa: al confirmar, `iniciarLote` recalcula y manda.
   - Con ella salen el aviso, «Ver cuáles» y el número real del botón con «omitir».
2. `exportacion.mostrarCarpetaLote({ loteId })`: main abre la carpeta del lote con `shell.openPath`, sin seleccionar archivo. Recuerda `loteId → carpeta` durante la sesión y da `DESTINO_NO_DISPONIBLE` si ya no existe.

Cambios de código: tarea [0388](../tareas/0388-consultas-de-carpeta-del-lote-de-exportacion.md). La verificación 0322 depende de ella.
