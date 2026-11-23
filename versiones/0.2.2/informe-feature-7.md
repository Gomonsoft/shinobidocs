# Informe de la feature 7 de 0.2.2 · Importación por lotes

Tareas: [0313](../../tareas/0313-worker-leer-etiquetas-y-listas-de-youtube.md), [0314](../../tareas/0314-lote-en-main.md), [0375](../../tareas/0375-contrato-final-de-la-lectura-del-lote.md), [0315](../../tareas/0315-modo-lote-en-anadir-cancion.md), [0316](../../tareas/0316-cola-de-lote-en-progreso-y-biblioteca.md), [0384](../../tareas/0384-datos-de-cada-video-al-descargar-y-remates-de-la-lectura-del-lote.md) y [0317](../../tareas/0317-verificacion-e-informe-de-la-feature-7.md). ADR [0026](../../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md). Specs: [03](../../ux/03-anadir-cancion.md#022--feature-7--importación-por-lotes), [04](../../ux/04-progreso-pipeline.md#022--feature-7--cola-de-preparación-de-un-lote), [02](../../ux/02-biblioteca.md#022--feature-7--lotes-en-la-biblioteca).

**Veredicto: hecha con reservas.** Ejecutado el 2026-11-23 en un Mac M1 sobre `version-0.2.2` (HEAD `81aed30`, árbol limpio; el CI no se ha consultado). Reservas:

1. **Pendiente del usuario**: el álbum real de YouTube Music y la carpeta real ([guía](../../Test-manuales/0.2.2/feature-7-importacion-por-lotes.md)), que son el criterio de «hecha», y la **decisión legal de las listas de YouTube** (pregunta [0159](../../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md), provisional: se permiten con aviso propio y tope de 50). No se marcan como cumplidas.
2. **Tarea [0390](../../tareas/0390-ruta-fuera-del-contrato-del-lote-y-parada-solo-de-separaciones.md) sin hacer** (respuesta del arquitecto a la 0317): quitar `filaLoteSchema.ruta` y que una separación sin motor no pare descargas ni importaciones. El código verificado es el de antes.
3. Defectos bajos de interfaz (columna «Duración» recortada, aviso de «añadidas» fuera de la vista), preguntas [0321](../../preguntas/0321-defectos-de-las-features-7-8-y-9-hallados-al-verificar.md) y [0323](../../preguntas/0323-hallazgos-visuales-de-las-capturas-de-las-features-7-8-y-9.md).
4. F7-N14, F7-B3 sin prueba; F7-P9 solo manual.

## Pruebas de feedback

| Comando | Resultado |
|---|---|
| `npm run typecheck` / `lint` / `format:check` | Limpios (al empezar y al terminar; entre medias añadí capturas a `e2e/capturas-022.spec.ts`) |
| Vitest de la feature (`main/fuente`, `shared/lote`, `handlers.lote`, `vistas/anadir`, `main/preparacion`, `navegacion`, `vistas/progreso`) | 39 archivos, **510 pasan** |
| `uv run pytest` / `ruff check` / `ruff format --check` (worker) | **379 pasan**, 7 deseleccionadas / limpio / 54 archivos formateados |
| `npm run build` | Correcto |
| E2E `importar-lote`, `importar-archivo`, `importar-youtube`, `separacion`, `separacion-errores`, `separacion-motor-incompleto`, `biblioteca`, `sin-red-real` | **51 de 51** (3,8 min; el caso «sin conexión con el interruptor apagado» dura 2,3 min por la espera de 60 s) |
| `npm run test:e2e:criticos` | **2 de 2** (22,8 s) |
| Vitest completo (una sola instancia) | 342 archivos pasan, 1 omitido; **4527 pasan**, 13 omitidas |
| Playwright completo, pasada 1 | 229 pasan, 63 omitidas, 4 fallan (ver [pruebas.md](../../pruebas.md#intermitentes-bajo-carga-clasificación-2026-11-23)) |
| Capturas (`SHINOBI_CAPTURAS_022_7=1`) | 7 pruebas, 21 capturas |

## Criterios → evidencia (33: 26 cubiertos, 4 parciales, 1 solo manual, 2 sin cubrir)

| Criterio | Estado | Evidencia |
|---|---|---|
| F7-N1, N2 | Cubierto | `AnadirCancion.lote.test.tsx` (soltar 3 archivos, carpeta sin audio), `carpeta.test.ts`, E2E `importar-lote` (3 WAV de una carpeta), captura `tabla-carpeta` (4 + 2 audios, 3 ignorados) |
| F7-N3 | Cubierto (Mayús + Intro sin prueba localizada) | `AnadirCancion.lote.test.tsx` (tres renglones, uno ignorado), `youtube.lista.test.ts`, E2E (lista de 2 + un privado, 0 consultas por vídeo con el contador del doble) |
| F7-N4 | Cubierto | `AnadirCancion.lote.test.tsx` (oferta sin consultar), `importar-youtube.spec.ts` (mezcla `RD…` → «no soportado») |
| F7-N5 | Cubierto | `AnadirCancion.lote.test.tsx` (aviso propio aunque el de YouTube esté aceptado; «Entendido» guarda la clave), `lote.test.ts` (`infoLista` exige ambos) |
| F7-N6, N7 | Cubierto | `modelo.test.ts`, `AnadirCancion.lote.test.tsx` («Álbum para todas…» y Ctrl + Z), capturas `tabla-lista`, `tabla-duplicados` |
| F7-N8 | **Parcial** | Vitest con 80 filas (50 marcadas, 51 no marca) y captura; «repetir la lista marca las 30 restantes» solo por la lógica de duplicados |
| F7-N9 | Cubierto | Vitest (sin espacio, `libreBytes` null, sin factor), capturas `tabla-sin-espacio` y `tabla-enlaces-sueltos` (con tiempo) |
| F7-N10, N11, N12 | Cubierto | Vitest (orden, descartar con foco en «Seguir revisando», título vacío), E2E `importar-lote` (5 canciones, «…la letra tendrás que buscarla tú»), captura `descartar` |
| F7-N13 | **Parcial** | Vitest de teclado; lector de pantalla solo manual; a 1024 × 640 solo captura (sin comprobación de scroll horizontal) |
| F7-N14 | **Sin cubrir** | Ninguna prueba localizada de «una sola fila añadible abre el formulario D»; la 0390 lo cambia (`importarArchivo({ ref })`) |
| F7-N15, N17 | Cubierto | `AnadirCancion.test.tsx`, `lote.test.ts`, `modelo.test.ts`, `AnadirCancion.lote.test.tsx` |
| F7-N16 | Cubierto | 12 de 12 pedidas más `tabla-lista-sin-completando`, `tabla-enlaces-sueltos`, `leyendo` (fotografiada con 400 archivos) |
| F7-P1, P3, P4, P6, P7, P8, P10 | Cubierto | `IndicadorActividad.cola.test.tsx`, `useAvisosTrabajos.test.tsx`, `modelo.test.ts` de progreso, `cola.test.ts`, capturas `cola`, `dialogo-cancelar`, `cola-con-errores`, `resultado` |
| F7-P2 | **Parcial** | Pausar y reanudar con Vitest; «cerrar y reabrir en pausa» solo por el diario de la cola (`cola.test.ts`) |
| F7-P5 | Cubierto en lo que hay | `cola.test.ts`, captura `cola-youtube-parada` con el doble (3 descargas paradas, la separación sigue). Cambia con la 0390 |
| F7-P9 | **Solo manual** | Guía, caso 6 |
| F7-P11 | **Parcial** | `DialogoCierre.test.tsx` y E2E de una descarga («cerrar la app durante la descarga: al reabrir se retoma sola»); con un lote entero, solo manual |
| F7-P12 | Cubierto | 6 de 6 |
| F7-B1, B2, B4 | Cubierto | `VeloArrastre.test.tsx`, E2E `importar-lote`, capturas `velo-arrastre` y `lote-anadido` |
| F7-B3 | **Sin cubrir** | Rendimiento de 50 canciones de golpe: ninguna medida |

## Revisión de código

- **Rutas al renderer (pregunta 0317 n.º 3)**: sí llega una ruta real. `filaLoteSchema.ruta` (`shared/ipc.ts:1244`) se rellena en `main/fuente/lote.ts:333` y `:348` con la ruta absoluta (tras `realpath`) de **cada fila** de `fuente.leerArchivos` y `fuente.leerCarpeta`, también de las que el renderer no conocía (las elegidas en el diálogo del sistema). El único uso es `vistas/anadir/PanelArchivo.tsx:210-212` (`importarArchivo(ruta)` con una fila). La 0390 ya la quita. Otras rutas que main entrega, previstas por los ADR: `carpetaIpcSchema.ruta` y `destinoIpcSchema.ruta` (carpeta de exportación) y `destinoCopiaIpcSchema.carpeta`. `fuente.leerArchivos(rutas)` y `leerCarpeta(ruta)` aceptan rutas del renderer (arrastre) y las validan en main (fuera de los datos, ilegibles descartados).
- **Privacidad y red**: con `preparacion.automatica` apagado, E2E `importar-lote` cuenta 0 peticiones (también `HEAD`) al doble de LRCLIB tras añadir; con él activo `importar-youtube` lo prueba como control. La tabla ya no consulta vídeo a vídeo (contador `llamadas-info.log` a 0). El aviso propio de listas se pide la primera vez (`infoLista` exige `aviso_youtube_listas_aceptado`, `lote.ts`) y el E2E lo tiene aceptado de antemano; lo cubre Vitest. Ninguna prueba sale a la red real (vigilante `sin-red-real` 2 de 2).
- **Cierre**: `main/index.ts:249` cuenta `gestorTrabajos.hayPendientes()` (la cola del lote vive ahí) y el diálogo dice `cierre.cuerpo.cola`. Sin prueba de lote completo (arriba).
- **Datos al descargar (0384)**: `cambioPorMusica` respeta el origen `usuario` (E2E: el título editado en la tabla sobrevive).
- **Compatibilidad**: `fuente.ruta_pendiente` es opcional y tolerante en `shared/cancion.ts`. Detalle: viaja dentro de los paquetes ([0320](../../preguntas/0320-excepcion-no-capturada-al-extraer-un-paquete-y-ruta-pendiente-en-las-canciones-importadas.md)).

## Defectos

Sin defectos de seguridad propios de esta feature (el de las rutas es de diseño y está en la 0390). Interfaz: columna «Duración» recortada (baja, `TablaLote.tsx`); aviso `bib.import.anadidas` fuera de la vista tras el desplazamiento al primer elemento nuevo (baja); `ids` repetidos aceptados (muy baja). Todo en [0321](../../preguntas/0321-defectos-de-las-features-7-8-y-9-hallados-al-verificar.md) y [0323](../../preguntas/0323-hallazgos-visuales-de-las-capturas-de-las-features-7-8-y-9.md).

## Capturas

`docs/ux/revisiones/0.2.2-feature-7/` (21, 1280 × 800 salvo `anadir-1024x640-100-tabla`; semilla con títulos inventados; abrí con Read 19; no abrí `origen-archivos` ni `tabla-lista-sin-completando`): `anadir-…-{origen-archivos, origen-enlaces, leyendo, tabla-lista, tabla-lista-sin-completando, tabla-carpeta, tabla-duplicados, tabla-limite, tabla-sin-espacio, tabla-enlaces-sueltos, oferta-lista, descartar}`, `actividad-…-{cola, cola-en-pausa, cola-youtube-parada, cola-con-errores, resultado, dialogo-cancelar}`, `biblioteca-…-{lote-anadido, velo-arrastre}`. En `tabla-lista` y `tabla-lista-sin-completando` se ve lo mismo (la segunda se toma 3 s después y comprueba que no hay «Completando los datos…»). «Descargando el modelo» en las filas de la cola es del separador falso. Con `SHINOBI_CAPTURAS_022_7=1 npx playwright test e2e/capturas-022.spec.ts --workers=1 -g "feature 7"`. Todas las pedidas se tomaron, incluidas las tres nuevas.

## Guía manual

[`feature-7-importacion-por-lotes.md`](../../Test-manuales/0.2.2/feature-7-importacion-por-lotes.md): álbum real, carpeta real, pausa/cierre/reanudar, parada por bloqueo, privacidad con monitor de red, lector de pantalla y la decisión legal pendiente.
