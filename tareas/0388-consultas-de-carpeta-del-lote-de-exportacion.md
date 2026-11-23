# 0388 — Feature 8 · Remates: previsualizar los nombres del lote de exportación y abrir su carpeta
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0319 (hecha); la interfaz, de 0321
- ADRs: 0026 (revisión «Consultas de carpeta del lote de exportación (pregunta 0301)»), 0019 §6, 0008
- Spec UX: docs/ux/10-exportacion.md (0.2.2 · Feature 8, formulario G: `exp.lote.aviso.existe`, «Ver cuáles», botón con el número real y «Mostrar la carpeta»)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md)), feature 8 (alpha.3). Lote E (`main/exportacion/**`, `vistas/exportacion/**`). `shared/ipc.ts`, `shared/canales.ts`, `preload/index.ts` y `main/ipc/handlers.ts` van con un cambio pequeño acordado.

## Objetivo
Que el diálogo de exportar varias sepa, antes de confirmar, qué vídeos ya existen y cuántos se exportarán de verdad, y que «Mostrar la carpeta» abra la carpeta sin seleccionar un archivo. El renderer no maneja rutas.

## Criterios de aceptación
1. [ ] **`exportacion.previsualizarLote({ cancionIds, formato, carpetaId, siExiste })`** (rol principal) → `{ filas: [{ cancionId, archivo, existe, accion, motivo? }], exportables }`:
   - `archivo` es **solo el nombre** del archivo resultante (con extensión, sin ruta).
   - `existe` dice si ya hay un archivo con ese nombre en la carpeta.
   - `accion` es `"nuevo" | "numerar" | "sustituir" | "omitir"`.
   - `motivo` es el de las omitidas (`YA_EXISTE`, `YA_EN_COLA`…).
   - `exportables` es el número de canciones que `iniciarLote` encolaría con esos datos.
2. [ ] Usa **la misma función** de nombres que `iniciarLote`: saneado `exp.nombre` y ` (2)`, ` (3)`… entre canciones del lote y frente a la carpeta. Se extrae a una función pura compartida por los dos caminos y no se duplica.
3. [ ] **No escribe nada, no encola nada y no gasta el `carpetaId`** (sigue siendo de un solo uso para `iniciarLote`). Lee solo el listado de la carpeta. Con un `carpetaId` caducado o desconocido devuelve `DESTINO_NO_DISPONIBLE`.
4. [ ] `iniciarLote` vuelve a calcular todo al confirmar: manda lo que haya en ese momento, y el resultado por canción refleja lo que ocurrió. No hace falta `CONFIRMACION_OBSOLETA`, porque la previsualización es orientativa.
5. [ ] **`exportacion.mostrarCarpetaLote({ loteId })`** (rol principal) → `void`:
   - main abre la carpeta del lote con `shell.openPath`, sin seleccionar ningún archivo;
   - main recuerda `loteId → carpeta` mientras viva el proceso;
   - un `loteId` desconocido o una carpeta que ya no existe da `DESTINO_NO_DISPONIBLE`.
6. [ ] **Interfaz** (0321):
   - el aviso `exp.lote.aviso.existe` y «Ver cuáles» salen de `filas`;
   - el botón dice `exportables`;
   - se vuelve a pedir al cambiar la carpeta, el formato, la selección o «si ya existe»;
   - «Mostrar la carpeta» usa `mostrarCarpetaLote`.

## Pruebas de feedback
- Unitarias (main, con un sistema de archivos temporal):
  - nombres repetidos dentro del lote y frente a la carpeta;
  - las tres opciones de `siExiste` y el `exportables` de cada una;
  - el `carpetaId` sigue sirviendo para `iniciarLote` después de previsualizar;
  - nada se escribe en la carpeta;
  - `mostrarCarpetaLote` llama a `openPath` con la carpeta del lote, y con un `loteId` desconocido da `DESTINO_NO_DISPONIBLE`.
- Unitarias (componente): aviso, «Ver cuáles» y el número del botón con `omitir`.
- E2E: ampliar el de exportar varias (`exportacion.spec.ts`): con un vídeo ya presente y «omitir», el botón dice uno menos y se exporta uno menos.
- Críticos: no.
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios`.

## Notas de implementación
(las rellena el programador al terminar)
