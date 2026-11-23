# 0315 — Feature 7 · Modo lote en «Añadir canción»
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0314, 0304, 0375
- ADRs: 0026
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Tabla editable, acciones de columna, resumen y confirmación.

## Criterios de aceptación
- [ ] Criterios de la spec 03 · Feature 7 (teclado y lectores de pantalla incluidos).
- [ ] **Aviso legal de listas** (pregunta 0260): la primera lista o álbum muestra el aviso con su punto sobre listas y, al aceptarlo, escribe `aviso_youtube_listas_aceptado` (y `aviso_youtube_aceptado` si faltaba) con `config.actualizar`. Después no se pide.
- [ ] Con el contrato de la tarea 0375:
  - resumen de espacio y tiempo con `estimarEspacioLote`/`estimarTiempoLote` sobre las filas marcadas y `libreBytes`, refrescado con `fuente.espacioLibre()` al marcar, al desmarcar y al volver a la ventana (`add.lote.sinEspacio`);
  - filas con ✕ según `problema`;
  - `add.lote.demasiadas` con `recortada`/`truncada`;
  - entradas de lista pedidas con `watch?v=…&list=…`.
- [ ] Texto nuevo de `URL_NO_SOPORTADA` (`add.error.URL_NO_SOPORTADA` de la spec 03: «Este enlace no se puede usar. Los directos, los canales y las mezclas automáticas…») en `shared/avisos.ts`, `vistas/progreso/textos.ts` y `vistas/biblioteca/textosError.ts`, en el mismo cambio que admite las listas (pregunta 0166 §6; antes diría algo falso).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: La de 0314.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho** (renderer; 16 pruebas de componente en `AnadirCancion.lote.test.tsx`, 8 del modelo, E2E `importar-lote.spec.ts` con la interfaz real)
- `vistas/anadir/lote/`: `modelo.ts` (filas, 50 primeras marcadas, líneas de estado, comunes, resumen con `estimarEspacioLote`/`estimarTiempoLote`/`cuantasCaben`, `armarLote`), `enlaces.ts` (renglones: video, video con lista, lista, ignorados), `useTablaLote.ts` (edición, tope de 50, «para todas», deshacer), `TablaLote.tsx` (L2: `<table>` con caption, ↑/↓ entre filas, Espacio, Ctrl/Cmd+Intro, Esc, Ctrl/Cmd+Z, popovers «para todas», «Solo las que hay que comprobar», resumen con anuncio a 500 ms, `add.lote.sinEspacio`, descartar, «Leer el aviso»), `textosLote.ts`.
- `PanelArchivo`: «Elegir archivos…» (`fuente.leerArchivos`) y «Elegir carpeta…»; soltar varios o una carpeta; L1 con Cancelar; una sola fila añadible sigue el flujo de una canción (`importarArchivo` con `fila.ruta`). `PanelYoutube`: área de enlaces (Intro busca, Mayús+Intro renglón), listas/álbumes, aviso de listas (un solo «Entendido» escribe `aviso_youtube_aceptado` si faltaba y `aviso_youtube_listas_aceptado`), `add.lote.ofertaLista`, `LISTA_NO_DISPONIBLE`. Cada entrada marcada se completa en segundo plano con `fuente.infoYoutube(watch?v=…&list=…)`.
- Textos: `URL_NO_SOPORTADA` nuevo en `shared/avisos.ts`, `progreso/textos.ts`, `biblioteca/textosError.ts`; punto de listas en `AVISO_YOUTUBE`; microcopy A (`add.pregunta`, `add.origen.*`, `add.arrastre`, `add.boton.elegir`, `add.url.*`, `add.boton.buscar`). `add.varios` ya no se usa.
- Compartido (aditivo): `shared/listaYoutube.ts` (`analizarUrlLista` movida desde main, que la reexporta), `filaLoteSchema` + `datos` (procedencia) y `ruta`, y `main/fuente/lote.ts` las rellena; `Vista.anadir.archivos` y `Vista.biblioteca.lote`; `CampoCombo` + `etiquetaOculta`/`abrirConFlechas`; arrastrar varios archivos o carpeta sobre la Biblioteca abre el modo lote (`useArrastrarArchivo`).
- Arreglo menor del diseñador: icono del aviso de LRCLIB con `FilaConIcono`.
- E2E de otras specs: textos nuevos (`Elegir archivos…`, `Enlaces de YouTube`, `Buscar`); `importar-youtube` usa una mezcla `RD…` como enlace «no soportado» (una lista `PL…` ahora es válida).
- Criterios: F7-N1…N15 cumplidos salvo lo de la pregunta 0285 (progreso «i de n» de L1 y de «Añadiendo…», `{n}` de `ofertaLista`, «Importar paquete…» N15 no se muestra). N16: capturas sin tomar.
- **Probar**: `npx vitest run src/renderer/src/vistas/anadir` y `npx playwright test e2e/importar-lote.spec.ts`.
- **Deuda**: lista de autocompletado de una celda se recorta en el scroll de la tabla; sin velo `bib.arrastrar.soltarVarios` (la Biblioteca no tiene velo); tras Ajustes («Cambiar en Ajustes») con un archivo leído por «Elegir archivos…» no se restaura (sin ruta guardada si viene de otra vía).
