# Informe de la feature 9 de 0.2.2 · Copia de seguridad, paquete de canción y exportar la letra

Tareas: [0323](../../tareas/0323-exportar-la-letra-a-lrc.md), [0324](../../tareas/0324-escribir-paquetes-y-copias.md), [0325](../../tareas/0325-importar-paquetes-y-restaurar.md), [0376](../../tareas/0376-remates-de-copias-y-paquetes.md), [0326](../../tareas/0326-paquete-y-copia-en-la-interfaz.md), [0383](../../tareas/0383-remates-de-interfaz-de-la-feature-9.md) y [0327](../../tareas/0327-verificacion-e-informe-de-la-feature-9.md). ADR [0027](../../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md). Specs: [02](../../ux/02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra), [08](../../ux/08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad), [06](../../ux/06-editor.md#022--feature-9--exportar-la-letra-desde-el-editor).

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-23 en un Mac M1 (HEAD `81aed30`; CI sin consultar). Reservas:

1. **Defecto de seguridad medio sin corregir**: un paquete con una entrada comprimida cuyo tamaño real supera al declarado provoca una excepción no capturada en el proceso principal (`importar.ts:292-315`; pregunta [0320](../../preguntas/0320-excepcion-no-capturada-al-extraer-un-paquete-y-ruta-pendiente-en-las-canciones-importadas.md)). Recomiendo no publicar sin arreglarlo.
2. **Pendiente del usuario**: la copia de la biblioteca real restaurada en otro usuario u otro equipo, la copia de más de 4 GB (ZIP64), el paquete ligero de YouTube y el `.lrc` en un reproductor externo ([guía](../../Test-manuales/0.2.2/feature-9-copia-paquete-y-lrc.md)) son el criterio de «hecha». **La decisión legal del paquete con audio queda anotada como pendiente de ti** (pregunta [0159](../../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md)): el paquete «Completo» contiene audio y letras con derechos y se puede pasar a otra persona; la variante «Ligero» es la propuesta por defecto del paquete de canción.
3. Defectos bajos (0320 n.º 2-3, 0321) y observaciones visuales (0323).

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `typecheck` / `lint` / `format:check` | Limpios |
| `npm run licencias:comprobar` | «Avisos JS y uv comprobados» (yazl, yauzl, buffer-crc32 y pend en `THIRD_PARTY_NOTICES.md`) |
| Vitest de la feature (`main/copias`, `exportarLrc`, `shared/letras/lrc`, `handlers.copias`, `vistas/ajustes`, `vistas/editor`, `navegacion`) | 75 archivos, **630 pasan** |
| Vitest completo | 342 archivos, **4527 pasan**, 13 omitidas |
| `npm run build` | Correcto |
| E2E `paquetes` (exportar con audio e importar con «Conservar las dos») y `editor` («Exportar la letra» tras mover un inicio) | pasan (dentro de los 43 de 2,7 min) |
| Críticos | **2 de 2** |
| Playwright completo, pasada 1 | 229 pasan, 63 omitidas, 4 fallan (ninguna de la feature 9) |
| Paquetes hostiles propios (Vitest temporal con `montajeDePrueba.ts`, retirado después) | 6 casos: ver abajo |
| Capturas (`SHINOBI_CAPTURAS_022_9=1`) | 3 pruebas, 18 capturas |

## Criterios → evidencia (26: 22 cubiertos, 4 parciales, 0 sin cubrir)

| Criterio | Estado | Evidencia |
|---|---|---|
| F9-1, F9-3, F9-5, F9-6, F9-7, F9-8, F9-9, F9-11, F9-17 | Cubierto | `Biblioteca.paquetes.test.tsx`, `copias.test.ts` (35 casos: ida y vuelta, ligero, conflictos, temas, cancelación, temporal), `DialogoImportarPaquete.test.tsx`, E2E `paquetes`, capturas |
| F9-2 | **Parcial** | `copias.test.ts` («la variante completa pesa más que la ligera»); **no hay prueba de ± 10 % frente al tamaño real**; el aviso de derechos siempre y la ausencia de «compartir»: capturas, sin prueba |
| F9-4 | **Parcial** | Fila `act.paq` e indicador por Vitest y captura `actividad-paquete`; la suma de `hayTrabajos` en `main/index.ts:249-252` no tiene prueba (nota de la 0383) |
| F9-10 | Cubierto | `paqueteHostil.test.ts` (truncado entero en el paso 1, no ZIP, versión 2, SHA alterado: solo esa canción), captura `paquete-version-nueva` |
| F9-12 | Cubierto | `useArrastrarArchivo.paquete.test.tsx`, captura `vacio-con-enlace` |
| F9-13, F9-14 | Cubierto | `lrc.test.ts` (texto exacto, ida y vuelta ± 10 ms), `exportarLrc.test.ts` (« (2)», omitidas) |
| F9-15 | **Parcial** | Teclado y «Esc no cancela» por Vitest; los estados sin color se ven en `importar-conflictos` (icono + texto); lector solo manual |
| F9-16 | Cubierto | 10 de 10 |
| F9-E1, F9-E2 | Cubierto | E2E `editor` (F9-E1), `PanelFunciones.test.tsx`, captura `editor-…-exportar-letra` |
| F9-A1, A2, A3, A4, A5, A7 | Cubierto | `CopiaAjustes.test.tsx`, `copias.test.ts` (solo las entradas del formato; restauración sin perder nada; consentimientos y carpetas no viajan; ajustes hostiles no se aplican), capturas |
| F9-A6 | **Parcial** | «Cancelar a mitad borra el temporal y deja intacto el archivo previo» (`copias.test.ts`); no hay aserción de que `copias.ultima` no cambia |

## Revisión de código y ataques

Leí `main/copias/zip.ts`, `formato.ts`, `importar.ts`, `ajustes.ts` y `servicio.ts` y comprobé el ADR §3 y la revisión de 0255-0258:

- **Rutas**: `strictFileNames` y `validateFileName` de `yauzl` rechazan `..`, absolutas y `\` en el índice; el id de canción del manifiesto está acotado por `ID_CANCION_PAQUETE` (sin `/`, `\`, `.` ni espacios; mis casos `../../fuera`, `a\b`, `/etc/x`, `C:evil`, `a/b`, `.oculto`, `a b`: paquete entero rechazado con `PAQUETE_NO_VALIDO`, sin crear nada). Solo se extraen los cinco nombres permitidos, siempre a `.importando/<id>/` con `wx`. Enlaces simbólicos (también con el nombre de un archivo declarado), cifradas y repetidas: rechazo del paquete entero.
- **Bombas**: límites de entradas (25 003), por tipo (`LIMITES`) y total; bytes reales comprobados al extraer (medidor + `validateEntrySizes`). Mi caso: `voz.flac` deflate de 40 MB con el tamaño rebajado a 4096 → esa canción `error` (`PAQUETE_INCOMPLETO`), `.importando/` vacía y biblioteca vacía; **pero** con una excepción no capturada (0320 n.º 1). Los límites por archivo son altos (16 GB; total 1 TiB): la protección real es la comprobación de espacio antes de empezar (`libreBytes`; con `null` no hay ninguna).
- **ZIP truncado**: a la mitad y con un byte menos → `PAQUETE_INCOMPLETO` entero (comprobado).
- **Un archivo dañado falla solo su canción**: sí (SHA y tamaños), y `cancion.json` con la forma equivocada también.
- **No pisa sin confirmar**: «igual» siempre se omite; `omitir` es lo predeterminado; la existente solo va a la papelera cuando la importada ya está verificada (`importar.ts:617`; si falla el `rename` posterior, la original queda en la papelera: recuperable); no se sustituye la que suena ni la que se procesa.
- **Rutas y renderer**: el preload solo expone `copias.origenDeArchivo(file)` (`webUtils.getPathForFile`) y main valida extensión, existencia y que esté fuera de los datos (`servicio.ts:242`). `destinoCopiaIpcSchema.carpeta` es la carpeta de destino que el ADR muestra.
- **`cancion.json` hostil**: `pistas.voz` o `fuente.miniatura` fuera de la carpeta no se leen (`rutaInterna` y el `dentro` de exportación), pero la canción se importa como «importada» y queda dañada; `fuente.ruta_pendiente` se conserva y viaja en los paquetes (0320 n.º 2-3).
- **Cierre**: `servicioCopias.hayTrabajos()` entra en el diálogo de cierre (salvo cerrar solo la ventana en macOS).
- **Compatibilidad**: `version_formato` 2 → `PAQUETE_VERSION_NUEVA` (comprobado); campos aditivos del manifiesto con `.catch(undefined)`; `CANCION_MAS_NUEVA` por canción.

## Capturas

`docs/ux/revisiones/0.2.2-feature-9/` (18, 1280 × 800 al 100 %): `biblioteca-…-{exportar-paquete, exportar-paquete-ligero, creando-paquete, paquete-creado, importar-revisar, importar-conflictos, importar-resultado, paquete-version-nueva, vacio-con-enlace, tarjeta-sin-audio, actividad-paquete, importadas-resaltadas}`, `ajustes-…-{copia-nunca, copia-ultima-recordatorio, copia-dialogo, copia-creando, restaurar-revisar}` y `editor-…-exportar-letra`. Las abrí con Read salvo la versión final de `paquete-creado` (repetida con el paquete completo). **El velo de arrastre de un `.shinobi` no existe**: el velo solo sale con varios archivos o una carpeta (se fotografió con 2 archivos, feature 7). `importadas-resaltadas` no enseña resalte (solo se enfoca la primera, 0292); en `tarjeta-sin-audio` sí se ve el foco en las dos. «Creando» se fotografía con 2,5 GB dispersos. No se tomaron a 1280 × 720 al 125 %.

## Guía manual

[`feature-9-copia-paquete-y-lrc.md`](../../Test-manuales/0.2.2/feature-9-copia-paquete-y-lrc.md).
