# 0319 — Feature 8 · Exportación por lotes en main
- Estado: Hecha
- Paso del pipeline: 6
- Depende de: 0339
- ADRs: 0026 §5, 0019
- Spec UX: docs/ux/10-exportacion.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
`destinoCarpeta`, `iniciarLote`, `loteId`, `cancelarLote` y `reintentarLote`.

## Criterios de aceptación
- [ ] Nombres repetidos, `siExiste`, espacio total, instantáneas al confirmar, detención con `SIN_ESPACIO`/`DESTINO_NO_DISPONIBLE`.

## Pruebas de feedback
- Unitarias: `servicio.test.ts` de exportación con dobles.
- E2E: Ninguna (la de 0321).
- Críticos: sí
- Manual: Exportar 3 canciones reales a una carpeta.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Qué se hizo.** `ServicioExportacion` (`main/exportacion/servicio.ts`) gana `destinoCarpeta`, `iniciarLote`, `cancelarLote` y `reintentarLote`; `Destinos` (`destinos.ts`) gana la carpeta de un solo uso (`carpetaPropuesta`, `elegirCarpeta`, `rutaDeCarpeta`, `consumirCarpeta`; 30 min; rechaza los datos de la app y las carpetas sin permiso con `DESTINO_NO_DISPONIBLE` `{ campo: 'destino' }`). `iniciar` se refactorizó sin cambiar su comportamiento (`exigirPerfil`, `crearTrabajo`). Cableado: `handlers.ts` (canales fuera de `CANALES_NO_IMPLEMENTADOS`), `main/index.ts` (selector de carpetas y `statfs`).
- **Comportamiento.** `iniciarLote` → `{ loteId, encoladas: [{ cancionId, trabajoId }], omitidas: [{ id, motivo }] }`: valida el perfil una vez; para cada canción, en orden, `YA_EN_COLA` si ya se exporta, `CANCION_NO_DISPONIBLE` y demás códigos de `leerCancion` si no puede exportarse, y toma ahí la **instantánea** (letra, estilo, metadatos). «Instrumental y voz» sin pista de voz: esa canción se exporta solo con instrumental (`ExportacionIpc.audio` lo dice). Nombres: `exp.nombre`; dos canciones del lote con el mismo nombre → « (2)», « (3)»…; con un archivo existente, `siExiste` `numerar` (« (2)»…), `sustituir` (mismo nombre, temporal y `rename` al terminar bien) u `omitir` (`YA_EXISTE`); nunca pisa un « (2)» ajeno ni el destino de otra exportación en marcha. **Espacio**: suma de `estimar` frente a `libreBytes` de la carpeta antes de encolar nada (`SIN_ESPACIO`; el `carpetaId` sigue vigente); solo se comprueba con un dato válido. Cada exportación entra en la cola de siempre (concurrencia 1) con `loteId`. `SIN_ESPACIO` o `DESTINO_NO_DISPONIBLE` en una detienen el lote: las que faltan acaban `cancelada` **con** `error` (código del fallo) = «no intentada» (pregunta 0290); un fallo cualquiera no detiene. `cancelarLote` cancela la que está en curso (con limpieza) y las que esperan; lo terminado se conserva. `reintentarLote` vuelve a encolar fallidas y no intentadas (no las canceladas por el usuario ni las omitidas) con las mismas opciones, el mismo nombre y una instantánea nueva. Un solo aviso del sistema por lote (`AVISOS_EXPORTACION.lote`), ninguno por video.
- **Contratos tocados** (aditivos): `ExportacionIpc.loteId?` (`shared/exportacion.ts`, `shared/ipc.ts`), `carpetaIpcSchema.libreBytes` anulable, `CarpetaDestinoIpc`. **`destinoCarpeta()` sin argumentos propone la carpeta (sin diálogo); con `desdeCarpetaId` abre el selector** (pregunta 0290: la spec necesita la carpeta ya rellena).
- **Archivos.** `main/exportacion/{servicio,destinos}.ts` y `servicio.test.ts` (12 casos nuevos), `main/ipc/handlers.ts`, `main/index.ts`, `shared/{exportacion,ipc}.ts`, `main/ipc/handlers.lotes.test.ts`.
- **Cómo probarlo.** `npx vitest run src/main/exportacion` (96 casos: carpeta propuesta/elegida/rechazada, orden y `loteId`, nombres repetidos, `siExiste` ×3, instantánea al confirmar, `YA_EN_COLA`, solo instrumental, espacio, fallo normal, `SIN_ESPACIO`/`DESTINO_NO_DISPONIBLE` con reintento, `cancelarLote`, aviso único). E2E: ninguna (la de 0321). Manual: exportar 3 canciones reales a una carpeta y desconectar el USB a mitad.
- **Para 0321.** Al abrir el diálogo: `exportacion.destinoCarpeta()` (propuesta) y `exportacion.estimar` por canción (suma en la interfaz); [Cambiar…] → `destinoCarpeta(carpetaId)` (`null` = cancelado). Seguimiento: agrupar `exportacion:cambio` por `ExportacionIpc.loteId` (las encoladas llegan en la respuesta); una fila «no intentada» = `resultado === 'cancelada'` con `error`; `exp.lote.fila.noIntentada`. Las omitidas por nombre o por `YA_EN_COLA` solo están en la respuesta de `iniciarLote`/`reintentarLote` (guardarlas en el estado del diálogo). La respuesta a «si ya existe» no se persiste en main (no hay campo de configuración): la recuerda la interfaz. No hay toast por video de main; el toast único del lote es de la interfaz (`exp.lote.toast`).
