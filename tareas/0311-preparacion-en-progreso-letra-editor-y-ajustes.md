# 0311 — Feature 5 · Progreso, vista Letra, editor y Ajustes
- Estado: Hecha
- Paso del pipeline: 3
- Depende de: 0308, 0307
- ADRs: 0025
- Spec UX: docs/ux/04-progreso-pipeline.md, 05-letra.md, 06-editor.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 5)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Lo que cuentan la vista de progreso, la vista Letra, el banner y el bloque «Preparación automática» del editor, y el interruptor de Ajustes.

## Criterios de aceptación
- [x] Criterios de esas secciones; «Quitar esos fines» y «Quitar la corrección».
- [x] **F6-N7, parte de interfaz** (spec 03 · Feature 6): `add.dato.origen.lrclib` con [Quitar] en el resumen del paso 1 y en «Editar datos» (`CamposDatos`). [Quitar] vacía el álbum con origen `usuario`. Si el título o el artista de `letra.datos_lrclib` difieren de los de la canción, se muestra `add.dato.lrclib.sugerencia` y [Usar estos datos] los aplica con origen `usuario`.
- [x] El renderer escucha `preparacion:abrirResultado` (tarea 0372) y, al recibirlo, va a la Biblioteca y abre el diálogo «Resultado de la preparación» de la última tanda. No usa `abrirCancion` con un id vacío (pregunta 0224).
- [x] **F6-N8**: con «Buscar la letra automáticamente» activado, el formulario de «Añadir canción» muestra `add.dato.lrclib` con el enlace «Cambiar en Ajustes»; desactivado, no. Ir a Ajustes y volver conserva lo escrito en el formulario.

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ninguna nueva (la de 0308).
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
**Hecho**
- **Progreso** (`vistas/progreso/preparacion.ts`, `BloqueResultado.tsx`, `textosPreparacion.ts`, `Progreso.tsx`): con registro de preparación (o con la búsqueda automática activada y sin letra) sale `prog.prep.titulo/subtitulo`, los subpasos «Buscar la letra», «Comprobar la letra con la voz» y «Ajustar los fines de línea» con su resultado a la derecha (también «— Ya tiene letra» y la espera de la separación), «Volver a la biblioteca» primario con el foco y «Ver la letra», y los bloques R1 a R4 (R1: lo que se hizo con el desfase y los fines, Revisar y Probar; R2 y R3 en `info`; R4 con [Reintentar]). Sin registro y con el interruptor apagado, la vista es la de 0.2.1. El stepper (`cancion/pasos.ts`) muestra ⟳ en Letra mientras se busca o comprueba y el indicador `circle-alert` («necesita tu atención») en R2, R3 y R4.
- **Toasts por canción** (`navegacion/useAvisosPreparacion.ts`, cableado en `App.tsx`): `prog.toast.revisar|elige|sinLetra` al pasar el resumen de «preparando» a un resultado; ninguno en una tanda de 2 o más, en la vista de progreso de esa canción o con «Letra pendiente». El aviso `tanda` de main se muestra como toast persistente con [Ver resultado] (`useAvisosTrabajos`).
- **`preparacion:abrirResultado`** (`useAvisosTrabajos`): va a la Biblioteca con `Vista.biblioteca.abrirResultado` y abre el diálogo «Resultado de la preparación» (de la 0310). No usa `abrirCancion` con un id vacío.
- **Letra** (`letra/Letra.tsx`, `BusquedaLetra.tsx`, `AvisoEleccion.tsx`, `preparacion.ts`): letra elegida sola → C con `let.prep.elegida(.corregida)`, [Ver otras candidatas] (A con la actual marcada y seleccionada) y [×] (nuevo canal `biblioteca.marcarPreparacionRevisada`); «Elige la letra» → A con `let.prep.elige` y su motivo y, al usar una letra, `preparacion.preparar([id])` continúa la cadena (`let.prep.continuando`); «No encontramos la letra» e «Instrumental» → su banner sin repetir la búsqueda; «Letra pendiente» → reintenta al entrar; búsqueda en curso → espera a esa (0 peticiones extra). El motivo se deduce en el renderer (pregunta 0235).
- **Editor** (`editor/preparacion/`, `PanelFunciones.tsx`, `Editor.tsx`, `estado.ts`): bloque «Preparación automática» como primera sección de «Funciones» (letra, desfase con [Quitar la corrección], fines con [Quitar esos fines] = acción `quitar_fines_preparacion`, un paso del historial con `edi.prep.toast.fines` y [Deshacer]); desaparece cuando no queda ningún renglón. Banner de la feature 11 `edi.banner.revision` / `.nada` (con `edi.banner.preparada` mientras se calcula la revisión), [Ver qué hicimos] con el foco en el título del bloque y [×] que marca la preparación como revisada; prioridad por debajo de los de la feature 4 y por encima de «ya sincronizada».
- **Ajustes** (`ajustes/PreparacionAjustes.tsx`): casilla «Buscar la letra automáticamente…» (marcada por defecto), `aj.prep.privacidad`/`.desactivado` asociados con `aria-describedby`, «Qué es LRCLIB», `aj.prep.pendientes` con [Verlos en la Biblioteca] (abre la casilla «Esperan letra»), `aj.rep.toast.error` si falla; `aj.soporte.busqueda` en «Copiar información para soporte».
- **F6-N7** (`anadir/CamposDatos.tsx`, `datosLrclibDe`, `DialogosCancion.tsx`, `ResumenFuente.tsx`): `add.dato.origen.lrclib` con [Quitar] (vacía el álbum; el guardado lo marca `usuario`) y `add.dato.lrclib.sugerencia` con [Usar estos datos], en el resumen del paso 1 y en «Editar datos».
- **F6-N8** (`anadir/AvisoBusqueda.tsx`, `borrador.ts`, `PanelArchivo.tsx`, `PanelYoutube.tsx`): `add.dato.lrclib` con «Cambiar en Ajustes» solo con la búsqueda activada; al volver (`Vista.anadir.restaurar`, origen `{ tipo: 'anadir' }`) se vuelve a leer el archivo o el enlace y se recupera lo escrito.
- Compartidos (aditivos): canal `biblioteca:marcarPreparacionRevisada` (`canales.ts`, `ipc.ts`, `preload`, `handlers.ts`), `Vista.biblioteca.{abrirResultado,casilla}`, `Vista.anadir.restaurar`, `OrigenAjustes` `anadir` y `SeccionAjustes` `preparacion` (`navegacion/estado.ts`), `Toast.duracionMs`, `ItemMenu.descripcion`.

**Correcciones de la feature 6 (revisión de qa y del diseñador)**: D1 (`CamposDatos`: sugerencia de unificar a los 400 ms, al elegir o cerrar la lista y con Tab, nunca en el `blur`; región `role="status"` vacía desde el principio), D2 (`shared/metadatosNombre.ts`: solo es pista con puntuación, `_` o cero a la izquierda; `numeroDudoso` marca el campo siguiente), D3 (`main/fuente/propuestaDatos.ts`: grafía de la biblioteca también si solo difieren las mayúsculas), V1 (campo → sugerencia → 8 px → ayuda, que sigue visible), D4 (↑ activa la última), D5 («Intercambiar» conserva la sugerencia del Álbum) y la lista que se cierra sola con la única opción exacta.

**Pruebas**: `Progreso.preparacion`, `useAvisosPreparacion`, `Letra.preparacion`, `Editor.preparacion`, `editor/preparacion/modelo`, `PreparacionAjustes`, `AvisoBusqueda`, `CamposDatos.lrclib`, `CamposDatos` (unificar/teclado), `metadatosNombre`, `propuestaDatos` y `handlers`. E2E: ninguna nueva (la de 0308).

**Deuda / límites**: pregunta 0235 (motivo de «Elige la letra»; R2 usa siempre «no está claro…»). Con la letra elegida desde el editor («Ver otras candidatas») A consulta de nuevo (`buscarOtra` ignora la caché). El anuncio por lectores de pantalla de los subpasos nuevos es un solo `role="status"` con el paso en curso o el resultado. Manual: capturas del diseñador y comprobar con red real que el toast no se duplica con el de «separación terminada» de main (`prog.toast.ok`).
