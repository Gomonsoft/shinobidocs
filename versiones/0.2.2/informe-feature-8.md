# Informe de la feature 8 de 0.2.2 · Acciones por lotes en la Biblioteca

Tareas: [0318](../../tareas/0318-operaciones-por-lotes-en-main.md), [0319](../../tareas/0319-exportacion-por-lotes-en-main.md), [0320](../../tareas/0320-barra-de-seleccion-y-acciones-por-lotes.md), [0321](../../tareas/0321-dialogo-de-exportar-varias-canciones.md), [0388](../../tareas/0388-consultas-de-carpeta-del-lote-de-exportacion.md) y [0322](../../tareas/0322-verificacion-e-informe-de-la-feature-8.md). ADR [0026](../../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md) §4 y §5. Specs: [02](../../ux/02-biblioteca.md#022--feature-8--acciones-por-lotes-en-la-biblioteca) y [10](../../ux/10-exportacion.md#022--feature-8--exportar-varias-canciones).

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-23 en un Mac M1 (HEAD `81aed30`; CI sin consultar). Reservas:

1. **Pendiente del usuario**: exportar tres canciones reales a una carpeta (y a un USB que se desconecta), recuperar de la papelera en cada sistema y el lector de pantalla ([guía](../../Test-manuales/0.2.2/feature-8-acciones-por-lotes.md)). El criterio «tres canciones reales» no se marca como cumplido.
2. **Defectos** (pregunta [0321](../../preguntas/0321-defectos-de-las-features-7-8-y-9-hallados-al-verificar.md)): el resultado de «Eliminar…» pierde los títulos (media), el recuento de la barra no coincide con el del diálogo de «Preparar» (media-baja) y varios textos.
3. Las variantes singulares de `exp.lote.aviso.existe` (respuesta de 0316) no están implementadas.
4. F8-4, F8-5 y F8-V9 sin E2E de la tanda compartida.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `typecheck` / `lint` / `format:check` | Limpios |
| Vitest de la feature (`main/biblioteca`, `handlers.lotes`, `main/exportacion`, `renderer/exportacion`, `vistas/biblioteca`) | 54 archivos, 754 pasan, **1 falla**: `main/biblioteca/flac.test.ts:125` («PyAV decodifica todas las muestras…», `status` 143 = proceso terminado). Solo, 3 de 3; pasó en la suite completa. Intermitente (ver pruebas.md) |
| Vitest completo | 342 archivos, **4527 pasan**, 13 omitidas |
| `npm run build` | Correcto |
| E2E `biblioteca-acciones`, `menu-contextual`, `exportacion`, `paquetes`, `editor` | **43 pasan**, 1 omitida (perfil opt-in) en 2,7 min |
| Críticos | **2 de 2** |
| Playwright completo, pasada 1 | 229 pasan, 63 omitidas, 4 fallan (ninguna de la feature 8; ver pruebas.md) |
| Capturas (`SHINOBI_CAPTURAS_022_8=1`) | 5 pruebas, 17 capturas |

## Criterios → evidencia (24: 19 cubiertos, 5 parciales, 0 solo manual, 0 sin cubrir)

| Criterio | Estado | Evidencia |
|---|---|---|
| F8-1 | Cubierto | `Biblioteca.lotes.test.tsx` (menú, Esc, foco), capturas `barra-acciones` y `menu-mas-acciones`; la primera fila a 1024 × 576 con el panel abierto solo se comprobó a mano (0320) |
| F8-2 | Cubierto (con el defecto 2 de la 0321) | `Biblioteca.lotes.test.tsx` (recuentos, «Preparar» inactivo y enfocable) |
| F8-3 | Cubierto | Vitest (notas, privacidad, solo las aplicables), captura `dialogo-preparar` |
| F8-4, F8-5 | **Parcial** | Vitest de `main/preparacion` y `useAvisosTrabajos`; ningún E2E de «Preparar» sumada a una tanda |
| F8-6 | Cubierto | `lotes.test.ts` (orden, `COLA_LLENA` parcial, deshacer) y `Biblioteca.lotes.test.tsx` |
| F8-7 | Cubierto | Vitest (impacto, aspecto, campo vacío, título intacto), captura `dialogo-editar-datos` |
| F8-8 | Cubierto | Vitest (casilla con 10, versión) y E2E (Supr, 3 carpetas a la papelera), capturas `dialogo-eliminar` y `-diez` |
| F8-9 | Cubierto | Vitest y captura `resultado-eliminar-parcial` con un fallo real (carpeta inmutable en macOS) y «Reintentar las que faltan» |
| F8-10 | Cubierto | `lotes.test.ts` (3 casos de `CONFIRMACION_OBSOLETA`), `Biblioteca.lotes.test.tsx` y E2E «Eliminar… exige la versión» |
| F8-11 | **Parcial** | Texto y no seleccionable por la tarjeta; no localicé una prueba del tooltip |
| F8-12 | Cubierto | `lotes.test.ts` y `Biblioteca.lotes.test.tsx` (sesión: la que suena sale omitida) |
| F8-13 | **Parcial** | Teclado por Vitest y E2E; lector solo manual |
| F8-14 | Cubierto | 7 de 7 más `acciones-omitida-sin-fuente` |
| F8-V1, V2 | Cubierto | `lote.test.tsx`, E2E `exportacion` (2 videos de 640 × 480) |
| F8-V3 | Cubierto | `servicio.test.ts` (los tres `siExiste`), E2E «omitir», capturas `lote-formulario*` y `lote-ver-cuales` |
| F8-V4, V5, V6, V7, V8 | Cubierto | `servicio.test.ts` (96 casos), `lote.test.tsx`, capturas `lote-exportando`, `lote-cancelar`, `lote-resultado-parcial` (una pista ilegible, real) y `lote-detenido` (destino desaparecido, real) |
| F8-V9 | **Parcial** | `exp.nota.sesion` y `DialogoCierre` por Vitest; ni E2E con sesión ni cierre con el lote real |
| F8-V10 | Cubierto | 9 de 9 pedidas (`lote-detenido` y `lote-resultado-cambiar-opciones` son la misma pantalla) |

## Revisión de código frente al ADR

- **Destructivas**: `ServicioLotes.correr` (`main/biblioteca/lotes.ts:293-335`) recalcula la vista previa y responde `CONFIRMACION_OBSOLETA` sin escribir; una acción a la vez (`EN_CURSO`); resultado por canción; `ejecutarEliminar` vuelve a mirar `cancionActiva` justo antes y usa `biblioteca.eliminar` (cancela trabajos, preparación y exportación y va a la papelera del sistema). La versión incluye estado, título, artista, álbum, pasos y arrastres. Fallo menor: `ejecutarDatos` no repite `EDICION_BLOQUEADA` al escribir (0321, n.º 8).
- **Renderer sin rutas**: `carpetaIpcSchema.ruta` (`destinoCarpeta`) la prevé el ADR para mostrarla; `previsualizarLote` y `mostrarCarpetaLote` solo devuelven nombres y recuentos.
- **Privacidad**: «Preparar» avisa de que se envían título y artista a LRCLIB si alguna va a buscar letra (captura `dialogo-preparar`).
- **Cierre**: `exportando: servicioExportacion.hayEnCurso()` (`main/index.ts:257`) cuenta las del lote.

## Hallazgos para el diseñador

Pregunta [0323](../../preguntas/0323-hallazgos-visuales-de-las-capturas-de-las-features-7-8-y-9.md), puntos 4 y 5: aviso del formulario que tapa texto de ayuda, doble punto, singulares, y `lote-detenido` = `lote-resultado-cambiar-opciones`.

## Capturas

`docs/ux/revisiones/0.2.2-feature-8/` (17, 1280 × 800 al 100 %; semilla; `…/biblioteca-…-{barra-acciones, menu-mas-acciones, dialogo-preparar, dialogo-editar-datos, dialogo-eliminar, dialogo-eliminar-diez, resultado-eliminar-parcial, acciones-omitida-sin-fuente}` y `exportacion-…-lote-{formulario, formulario-omitir, formulario-sustituir, ver-cuales, exportando, cancelar, resultado-parcial, detenido, resultado-cambiar-opciones}`). Abrí con Read las 17. No se tomaron las variantes a 1280 × 720 al 125 % que menciona la spec (el encargo pedía solo 1280 × 800). Con `SHINOBI_CAPTURAS_022_8=1 … -g "feature 8"`.

## Guía manual

[`feature-8-acciones-por-lotes.md`](../../Test-manuales/0.2.2/feature-8-acciones-por-lotes.md).
