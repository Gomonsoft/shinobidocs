# 02 — Biblioteca (vista inicial)

- Paso del pipeline: — (raíz) y 5 (estados borrador/lista)
- ADRs: [0006](../adr/0006-persistencia-y-modelo-de-datos.md), [0004](../adr/0004-separacion-voz-instrumental.md)
- Restricciones: [arquitectura.md "Restricciones e implicaciones para UX" §2–§3](../arquitectura.md)
- Sistema visual: [sistema-visual.md](sistema-visual.md)
- Preguntas: [0005](../preguntas/0005-viabilidad-detalles-ux-fase-0.md) §8 y [0006](../preguntas/0006-ajustes-specs-ux-tras-0005.md) §4 (lista incompleta; respondidas); [0007](../preguntas/0007-textos-y-comportamientos-de-ui-no-definidos-fase-1.md) (textos de la Fase 1; respondida) y [0008](../preguntas/0008-ajustes-ui-tras-revision-fase-1.md) (cambios tras la revisión visual); [0020](../preguntas/0020-huecos-ux-de-la-separacion-fase-3.md) (estados de separación de la Fase 3; respondida)
- Revisión visual de la Fase 1: [revision-fase-1/](revisiones/fase-1/README.md) (2026-11-04)
- 0.2.0, fase 3 (2026-11-09): agrupación por artista y álbum, búsqueda en álbum, selección múltiple con «Aplicar tema…», tema de artista y álbum y línea de tema en la tarjeta. Ver [Fase 3 · Temas y biblioteca](#fase-3-de-020--temas-y-biblioteca).
- 0.2.0, fase 4 (2026-11-11): abrir el reproductor en otra pantalla, panel «Cola de reproducción», controles de la sesión, cierre con cola y recuperación. Ver [Fase 4 de 0.2.0 — ventana secundaria y cola](#fase-4-de-020--ventana-secundaria-y-cola).
- 0.2.0, fase 5 (2026-11-20): insignia «Letra lista» y toast al marcarla; portadas con el fondo quieto. Ver [Fase 5 de 0.2.0 — estilo, espera y Letra lista](#fase-5-de-020--estilo-espera-y-letra-lista).
- 0.2.0, fase 6 (2026-11-20): «Exportar video…» en el ⋯ de las Listas, línea de exportación en la tarjeta y exportaciones en el panel de actividad. Ver [Fase 6 de 0.2.0 — exportación](#fase-6-de-020--exportación) y [10 · Exportar a video](10-exportacion.md).
- 0.2.1, fase 8 (2026-11-21): «Editar» junto a «Reproducir» en las tarjetas Lista y Letra lista, y agrupar por «Fecha de añadido». Ver [Fase 8 de 0.2.1 — estados y fecha de añadido](#fase-8-de-021--estados-y-fecha-de-añadido).
- 0.2.2, features 8, 9 y 11 (2026-11-21): acciones por lotes sobre la selección múltiple (preparar, a la cola, exportar video, editar datos, eliminar), paquete de canción, importar, exportar la letra a `.lrc`, y líneas por revisar en la tarjeta «Lista para revisar». Ver [Feature 8](#022--feature-8--acciones-por-lotes-en-la-biblioteca), [Feature 9](#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra) y [Feature 11](#022--feature-11--revisión-guiada-en-la-biblioteca).

## Objetivo
Ver de un vistazo todas las canciones y su estado, **reproducir una canción lista con un clic**, retomar un borrador justo donde se quedó y empezar una canción nueva.

Usuario/tarea principal: "Quiero cantar X" (reproducir) o "Quiero terminar/crear un karaoke" (continuar / añadir).

## Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ ◆ Shinobi Karaoke                         [⟳ 1 en curso ▾]  [⚙]  [+ Añadir canción]│
├──────────────────────────────────────────────────────────────────────────────┤
│  Biblioteca                                                                  │
│  [ Todas 12 ] [ Listas 7 ] [ Borradores 5 ]          [🔍 Buscar título o artista ]│
│                                                                              │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐ ┌────…  │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │░░░░░░░░░░░░░░░░░░░░│ │           │
│  │▓▓ Bohemian    ( ▶ )│ │▓▓  La flaca        │ │░░  Despacito       │ │           │
│  │▓▓ Rhapsody         │ │▓▓                  │ │░░                  │ │           │
│  │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ │░░░░░░░░░░░░░░░░░░░░│ │           │
│  │ Bohemian Rhapsody  │ │ La flaca           │ │ Despacito          │ │           │
│  │ Queen · 5:55       │ │ Jarabe de Palo·4:31│ │ Luis Fonsi · 3:48  │ │           │
│  │ (✓ Lista)      [⋯] │ │ (✎ Borrador)   [⋯] │ │ (✎ Borrador)   [⋯] │ │           │
│  │                    │ │ ⟳ Separando 42 %   │ │ ⚠ Interrumpido     │ │           │
│  │ [▶ Reproducir]     │ │ ███████░░░ 3 min   │ │ [Reintentar]       │ │           │
│  └────────────────────┘ │ [Continuar]        │ └────────────────────┘ │           │
│                         └────────────────────┘                                  │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Rejilla de tarjetas: `repeat(auto-fill, minmax(240px, 1fr))`, separación 24 px. 4 columnas a 1280 px, 3 a 1024 px.
- Orden: **modificadas más recientemente primero** (`modificada` desc). Sin otras ordenaciones en el MVP.

### Anatomía de la tarjeta
```
┌──────────────────────────┐
│ PORTADA 16:9             │  ← fondo del estilo de la canción (sólido/degradado)
│   Título en la fuente    │     + título en su fuente y color de letra.
│   de la canción   ( ▶ )  │     Si es de YouTube y aún no tiene estilo propio:
│                          │     miniatura con velo oscuro. ( ▶ ) solo si Lista.
├──────────────────────────┤
│ Título (t-subtitulo, 1 línea, …) │
│ Artista · duración (texto-2)     │
│ [insignia estado]          [⋯]   │
│ línea de paso / progreso         │  ← Borrador; en Lista solo si está incompleta
│ [acción principal]               │
└──────────────────────────┘
```

## Componentes e interacciones

| Elemento | Comportamiento |
|----------|----------------|
| **+ Añadir canción** (primario, barra superior) | Abre la vista 03. Atajo Ctrl/Cmd+N. |
| **Filtros** (control segmentado) | Todas / Listas / Borradores, con recuento. Persisten durante la sesión (la búsqueda, no: se vacía al volver a la vista; salir del reproductor no cuenta como volver, porque la Biblioteca se queda debajo y conserva la búsqueda). Las canciones **Dañadas** solo aparecen en *Todas* (no cuentan en Listas ni en Borradores); las listas incompletas cuentan en *Listas*. |
| **Buscar** | Filtra en vivo por título y artista (sin distinguir mayúsculas ni tildes: "cancion" encuentra "Canción"). Ctrl/Cmd+F enfoca. Esc vacía el campo. |
| **Tarjeta — clic en la portada / Intro con la tarjeta enfocada** | Lista → **Reproductor** (spec 07) directamente. Borrador → acción "Continuar". Dañada → abre el menú de recuperación. |
| **▶ Reproducir** (botón de la tarjeta Lista y botón redondo superpuesto en la portada al pasar el ratón/enfocar) | Abre el reproductor a pantalla completa y empieza a sonar sin más pasos (spec 07 §"Entrada"; si la primera línea entra antes de 6 s, tras un breve silencio con la pantalla de título). La Biblioteca se queda debajo: al salir del reproductor se conservan filtro, búsqueda y desplazamiento, y el foco vuelve a la tarjeta. Lo mismo hacen *Reproducir* del menú ⋯ y [▶ Reproducir] del toast `bib.toast.lista`. |
| **Continuar** (Borrador) | Abre la vista del paso actual (tabla de [00-mapa-de-vistas §3](00-mapa-de-vistas.md)). |
| **Reintentar** (Borrador con paso en error o interrumpido) | Relanza el trabajo del paso (fuente o separación) sin salir de la biblioteca; la tarjeta pasa a "En cola"/"En curso". También hay "Continuar" en el menú ⋯. |
| **⋯ Menú de la tarjeta** | Lista: *Reproducir*, *Editar* (abre Editor), *Editar datos* (título/artista/álbum, diálogo), *Volver a borrador*, *Mostrar en la carpeta*, *Eliminar…*. Borrador: *Continuar*, *Editar datos*, *Cancelar trabajo* (si hay uno en curso o en cola), *Mostrar en la carpeta*, *Eliminar…*. Dañada: *Re-separar pistas* (si solo faltan pistas), *Mostrar en la carpeta*, *Eliminar…*. Abre también con la tecla Menú o Mayús+F10 sobre la tarjeta. |
| **Volver a borrador** | Diálogo: "¿Volver a borrador? «{título}» dejará de poder reproducirse hasta que la marques como lista otra vez. No se pierde nada." [Cancelar] [Volver a borrador]. |
| **Eliminar…** | Diálogo: "¿Eliminar «{título}»? Se moverá a la papelera de tu sistema, con sus pistas y su letra. Podrás recuperarla desde allí." [Cancelar] [Eliminar] (destructivo). Si hay un trabajo en curso, el texto añade "Se cancelará la separación en curso.". Tras eliminar: toast "«{título}» se movió a la papelera." |
| **Mostrar en la carpeta** | Abre la carpeta de la canción en el explorador del sistema. |
| **Indicador de actividad** (barra superior) | Ver spec 04 §"Panel de actividad". |
| **Teclado en la rejilla** | La rejilla es un único punto de tabulación (`role="grid"` o lista con *roving tabindex*): flechas mueven entre tarjetas; Intro = acción de la portada; Espacio = acción principal visible (Reproducir/Continuar/Reintentar); tecla Menú = ⋯; Supr = Eliminar… |
| **Actualizaciones en vivo** | Las tarjetas reflejan los eventos `cancion:cambiada` y `trabajo:progreso` sin recargar ni mover el foco. Una canción que cambia de estado **no** se reordena hasta que el usuario sale y vuelve a la vista (para no mover tarjetas bajo el cursor). |

### Línea de paso de un borrador (bajo la insignia)
Se muestra el **primer paso no completado** con prioridad para trabajos activos y problemas:
| Situación | Texto | Extra |
|-----------|-------|-------|
| Descargando de YouTube | ⟳ Descargando 63 % | barra + tiempo |
| Preparando el audio | ⟳ Preparando el audio… | barra indeterminada |
| Descargando: actualizando el descargador tras un bloqueo (fase `actualizando`) | ⟳ Actualizando el descargador… | barra indeterminada |
| Descarga en cola (trabajo vivo) | 🕒 En cola para descargar | — |
| Separación en cola (trabajo vivo) | 🕒 En cola para separar | — |
| Fuente pendiente **sin** trabajo vivo, archivo local | Falta preparar el audio | botón Continuar |
| Fuente pendiente **sin** trabajo vivo, YouTube (descarga cancelada) | Falta descargar el audio | botón Continuar (abre la spec 03, wireframe E) |
| Separación pendiente **sin** trabajo vivo | Falta separar las pistas | botón Continuar |
| Separación descargando el modelo (fase `descargando_modelo`, [0020](../preguntas/0020-huecos-ux-de-la-separacion-fase-3.md) §2) | ⟳ Descargando el modelo 34 % | barra determinada, sin tiempo |
| Separación cargando modelo | ⟳ Preparando la separación… | barra indeterminada |
| Separación: reintento automático por memoria | ⟳ Reintentando la separación… | barra indeterminada |
| Descarga de YouTube: espera antes de un reintento de red (0020 §4) | ⟳ Reintentando en {n} s… | sin barra; la cuenta atrás se actualiza cada segundo |
| Separando | ⟳ Separando 42 % · quedan unos 3 min | barra |

Tiempo restante en la tarjeta (`bib.eta`, forma corta): «quedan unos {n} min» (n ≥ 2) · «queda alrededor de 1 min» · «queda menos de 1 min». Sin estimación todavía no se muestra tiempo. «En cola» y los estados ⟳ (color `info`) **solo** con un trabajo vivo en el gestor; un paso `pendiente` persistido sin trabajo se muestra como «Falta …» en `texto-2` sin icono. El icono de «en cola» es `clock` (no ⏸, que sugiere una pausa del usuario).
| Error de fuente o separación | ✕ {título del error} | botón Reintentar (o "Ver" si no es reintentable; p. ej. `RUNTIME_NO_DISPONIBLE` siempre muestra "Ver", spec 04) |
| Interrumpido | ⚠ Interrumpido | botón Reintentar |
| Sin letra | Falta la letra | botón Continuar |
| Letra sin sincronizar del todo | Faltan {n} líneas por sincronizar | botón Continuar |
| Todo hecho salvo marcar | Lista para revisar | botón Continuar |

Si hay un trabajo activo **y** falta letra/sincronía, se muestra el trabajo activo (es lo que cambia). Con `n = 1` se usa el singular: "Falta 1 línea por sincronizar" (`bib.paso.sincronia`). Las pausas (♪) nunca cuentan en `n`.

### Lista incompleta
Una canción `lista` en la que, tras editarla, hay líneas (no pausas) sin tiempo de inicio. **Sigue siendo Lista** (el estado guardado no cambia solo; el indicador `incompleta` se deriva, ADR 0006). Si lo que falta son las pistas, no es "incompleta" sino **Dañada**.
```
│ Bohemian Rhapsody                │
│ Queen · 5:55                     │
│ (✓ Lista)                   [⋯]  │
│ ⚠ Faltan 3 líneas por sincronizar│  ← t-pequeno, color `aviso`, icono alert-triangle 16 px
│ [▶ Reproducir]                   │
```
- Insignia **"✓ Lista"** sin cambios (es lista y se puede cantar) y cuenta en el filtro *Listas*.
- Línea de aviso bajo la insignia: `bib.lista.incompleta` con icono ⚠ en `aviso` (icono + texto: no depende solo del color). Es informativa, no es un botón.
- Acción principal **"▶ Reproducir"** y botón redondo de la portada **sin cambios**: reproducir funciona (el reproductor omite esas líneas y lo avisa, spec 07).
- Para arreglarlo: *Editar* del menú ⋯ (abre el Editor, que muestra el popover de lo que falta en "Hecho", spec 06). No se añade un segundo botón a la tarjeta.
- Lectores de pantalla: `bib.aria.tarjeta` con estado "Lista" y línea de paso = texto del aviso.

## Estados

| Estado | Presentación |
|--------|--------------|
| **Vacío** (sin canciones) | Centrado en el área de contenido: icono de micrófono/shuriken 64 px en `texto-3`, título `t-display` "Tu biblioteca está vacía", texto "Añade tu primera canción desde un archivo de tu ordenador o un enlace de YouTube. Shinobi Karaoke separará la voz para que puedas cantar encima.", botón primario grande "Añadir canción" (el de la barra superior se oculta en este estado para no duplicar primarios), y nota `texto-3`: "Formatos: MP3, M4A, FLAC, WAV, OGG, y también vídeos MP4, MKV, MOV o WebM." Arrastrar un archivo sobre la ventana abre la vista 03 con ese archivo. |
| **Sin resultados** (filtro/búsqueda) | Con texto en *Todas*: `bib.sinresultados` + botón fantasma "Borrar búsqueda". Con texto en *Listas* / *Borradores*: `bib.sinresultados.listas` / `bib.sinresultados.borradores` + "Borrar búsqueda" + botón fantasma "Ver todas" (pasa a *Todas* conservando el texto). Sin texto, filtro *Listas* vacío: `bib.sinlistas`; filtro *Borradores* vacío: `bib.sinborradores`. |
| **Cargando** | Al abrir la app, el escaneo de `biblioteca/` (< 1 s esperado): 4 tarjetas esqueleto con brillo suave (estático con movimiento reducido). Si tarda > 3 s: texto "Cargando tu biblioteca…". |
| **Procesando** | Tarjetas con línea de paso y barra (tabla anterior). |
| **Error de canción** | Insignia ✕ Error en `error`, línea con el título del error y Reintentar. |
| **Interrumpido** | Insignia ✎ Borrador + línea ⚠ Interrumpido (aviso) + Reintentar. |
| **Dañada** | Portada gris `fondo-2` con icono de alerta; si `cancion.json` no se pudo leer, el título es `bib.danada.sintitulo` («Canción sin nombre»; nunca el id de la carpeta) y no hay línea de artista; insignia "✕ Dañada"; línea: "No se puede abrir esta canción" (json ilegible) o "Faltan las pistas separadas" (pistas borradas). Acciones según menú ⋯. |
| **Borrador** | Insignia `aviso` con contorno "✎ Borrador". Portada con estilo actual (o predeterminado). Botón "Continuar". |
| **Lista** | Insignia `exito` "✓ Lista". Botón "▶ Reproducir" (secundario con icono; en la portada, botón redondo 48 px). |
| **Lista incompleta** | Como Lista + línea `aviso` "⚠ Faltan {n} líneas por sincronizar" (§"Lista incompleta"). |
| **Éxito tras marcar como lista** | Al volver del editor, la tarjeta recibe el foco, se desplaza hasta quedar visible, se resalta durante 2 s (borde 2 px `exito`; sin transición con movimiento reducido) y aparece el toast "«{título}» está lista para cantar. [▶ Reproducir]". Si el filtro activo la ocultaría (*Borradores*), el filtro pasa a *Todas*. Detalle en spec 06 §"Volver a la Biblioteca". |
| **Vuelta desde el reproductor** | Filtro, búsqueda y desplazamiento como estaban; foco en la tarjeta; sin toast. Los toasts que llegaron mientras se cantaba aparecen ahora (spec 07 §"Salida"). |
| **Vuelta desde el editor** | Borrador con cambios en esa visita: toast `edi.toast.borrador` ("Borrador guardado."). "Hecho" en una Lista: tarjeta enfocada, sin resalte ni toast. Spec 06. |
| **Lista recién eliminada** | Toast con el nombre; no hay "deshacer" en la app (se recupera desde la papelera del sistema). |

## Microcopy
| Clave | Texto |
|-------|-------|
| `bib.titulo` | Biblioteca |
| `bib.boton.anadir` | Añadir canción |
| `bib.filtro` | Todas · Listas · Borradores |
| `bib.buscar` | Buscar título o artista |
| `bib.vacia.titulo` | Tu biblioteca está vacía |
| `bib.vacia.cuerpo` | Añade tu primera canción desde un archivo de tu ordenador o un enlace de YouTube. Shinobi Karaoke separará la voz para que puedas cantar encima. |
| `bib.vacia.formatos` | Formatos: MP3, M4A, FLAC, WAV, OGG, y también vídeos MP4, MKV, MOV o WebM. |
| `bib.sinresultados` | No hay canciones que coincidan con «{texto}». |
| `bib.sinresultados.listas` | No hay canciones listas que coincidan con «{texto}». |
| `bib.sinresultados.borradores` | No hay borradores que coincidan con «{texto}». |
| `bib.vertodas` | Ver todas |
| `bib.sinlistas` | Aún no tienes canciones listas. Termina un borrador y márcalo como lista para poder cantarlo aquí. |
| `bib.sinborradores` | No tienes borradores. Las canciones que añadas aparecerán aquí hasta que las marques como listas. |
| `bib.cargando` | Cargando tu biblioteca… |
| `bib.error.listar` | No se pudo cargar tu biblioteca. [Reintentar] |
| `bib.toast.noabre` | No se pudo abrir la canción. |
| `bib.estado.lista` | Lista |
| `bib.estado.borrador` | Borrador |
| `bib.estado.danada` | Dañada |
| `bib.accion.reproducir` | Reproducir |
| `bib.accion.continuar` | Continuar |
| `bib.accion.reintentar` | Reintentar |
| `bib.menu` | Reproducir · Editar · Editar datos · Volver a borrador · Cancelar trabajo · Re-separar pistas · Mostrar en la carpeta · Eliminar… |
| `bib.paso.*` | ver tabla "Línea de paso" |
| `bib.paso.sincronia` | Faltan {n} líneas por sincronizar · (n = 1) Falta 1 línea por sincronizar |
| `bib.lista.incompleta` | ⚠ Faltan {n} líneas por sincronizar · (n = 1) ⚠ Falta 1 línea por sincronizar |
| `bib.danada.json` | No se puede abrir esta canción |
| `bib.danada.pistas` | Faltan las pistas separadas |
| `bib.danada.sintitulo` | Canción sin nombre |
| `bib.paso.cola.descarga` | En cola para descargar |
| `bib.paso.cola.separacion` | En cola para separar |
| `bib.paso.falta.fuente` | Falta preparar el audio |
| `bib.paso.falta.descarga` | Falta descargar el audio |
| `bib.paso.actualizando` | Actualizando el descargador… |
| `bib.paso.falta.separacion` | Falta separar las pistas |
| `bib.paso.modelo` | Descargando el modelo {n} % |
| `bib.paso.reintento.memoria` | Reintentando la separación… |
| `bib.paso.reintento.red` | Reintentando en {n} s… |
| `bib.eta` | quedan unos {n} min · queda alrededor de 1 min · queda menos de 1 min |
| `bib.dialogo.eliminar` | ¿Eliminar «{título}»? Se moverá a la papelera de tu sistema, con sus pistas y su letra. Podrás recuperarla desde allí. |
| `bib.dialogo.eliminar.trabajo` | (se añade al texto de eliminar) Se cancelará la separación en curso. · Se cancelará la descarga en curso. |
| `bib.datos.titulo` | Editar datos · campos: Título · Artista · Álbum (opcional) · [Cancelar] [Guardar] |
| `bib.datos.error.titulo` | Escribe un título. |
| `bib.arrastrar.varios` | Añade las canciones de una en una. (= `add.varios`) |
| `bib.arrastrar.noadmitido` | Ese tipo de archivo no se puede usar. Prueba con un archivo de audio o de vídeo. |
| `bib.toast.errorgenerico` | {título del error de 00 §7} [Copiar detalles] |
| `bib.dialogo.borrador` | ¿Volver a borrador? «{título}» dejará de poder reproducirse hasta que la marques como lista otra vez. No se pierde nada. |
| `bib.toast.lista` | «{título}» está lista para cantar. — [▶ Reproducir] |
| `bib.toast.eliminada` | «{título}» se movió a la papelera. |
| `bib.aria.tarjeta` | {título}, {artista}, {estado}. {línea de paso}. |
| `act.boton` | {n} en curso · {n} en curso · {m} en cola · {m} en cola (solo trabajos en cola) |
| `act.terminado` | ✓ Terminado (4 s, solo si alguno terminó bien) |

Revisión 2026-11-04 de los textos escritos en las tareas 0019/0020 sin estar en la spec: **aprobados** «No se pudo cargar tu biblioteca.» + Reintentar, «No se pudo abrir la canción.», «Escribe un título.», «Se cancelará la descarga en curso.», «{m} en cola», «✓ Terminado», no mostrar toast tras «Volver a borrador» y Dañadas solo en *Todas*. **Corregidos**: «No hay canciones que coincidan con el filtro.» → `bib.sinborradores`; «Ese archivo no es de audio ni de vídeo admitido.» → `bib.arrastrar.noadmitido`; «queda 1 min aprox.» / «menos de 1 min» → `bib.eta`; fuente en cola «En cola» → «En cola para descargar»; «En cola para separar» / «Preparando el audio…» sin trabajo vivo → «Falta separar las pistas» / «Falta preparar el audio»; etiqueta «Álbum» → «Álbum (opcional)».

## Criterios de aceptación
1. Al abrir la app con la instalación completa se muestra la Biblioteca con todas las canciones de `biblioteca/`, ordenadas por fecha de modificación descendente.
2. Cada tarjeta muestra título, artista, duración (m:ss), insignia de estado con icono y texto (Lista / Borrador / Dañada) y, en borradores, la línea de paso según la tabla (singular con n = 1; las pausas no cuentan).
2b. Una canción Lista con líneas sin inicio (indicador derivado `incompleta`) mantiene la insignia "✓ Lista", el botón "▶ Reproducir" y su sitio en el filtro *Listas*, y muestra la línea `bib.lista.incompleta` en color `aviso` con icono; al sincronizar todas las líneas la línea desaparece en vivo.
3. En una canción Lista, un único clic en la portada, en "Reproducir" (tarjeta, menú ⋯ o toast `bib.toast.lista`) o Intro con la tarjeta enfocada abre el reproductor a pantalla completa con su pantalla de título en < 200 ms y el instrumental suena en < 1 s (más el silencio previo si la primera línea entra antes de 6 s; spec 07, criterios 1, 2 y 6). Al salir del reproductor se conservan filtro, búsqueda y desplazamiento y el foco está en la tarjeta; si el reproductor no encontró el instrumental, la tarjeta ya aparece como Dañada (spec 07, criterio 22).
4. En un borrador, "Continuar" abre la vista del paso actual según la tabla de [00-mapa-de-vistas §3](00-mapa-de-vistas.md).
5. Las tarjetas con trabajos activos actualizan porcentaje y tiempo restante en vivo (≥ 1 vez cada 2 s) sin mover el foco ni reordenarse.
6. Un borrador con un paso `error` o `interrumpido` muestra el aviso y un botón "Reintentar" que relanza el trabajo desde la propia biblioteca.
7. Una canción con `cancion.json` ilegible (y sin `.bak` válido) o sin pistas tras haberlas tenido se muestra como "Dañada" con las acciones del menú indicadas, y no rompe la carga del resto.
8. Sin canciones, se muestra el estado vacío con un único botón primario "Añadir canción" que abre la vista 03.
9. Arrastrar un archivo de audio o vídeo sobre la ventana abre la vista 03 con ese archivo ya seleccionado.
10. Filtros y búsqueda reducen las tarjetas en vivo; la búsqueda ignora mayúsculas y tildes; con 0 resultados aparece el mensaje correspondiente.
11. "Eliminar…" pide confirmación y mueve la carpeta de la canción a la papelera del sistema; si había un trabajo en curso, lo cancela antes.
12. "Volver a borrador" pide confirmación y cambia el estado a borrador sin modificar letra, estilo ni pistas.
13. Toda la vista es operable con teclado: rejilla navegable con flechas, Intro/Espacio para acciones, tecla Menú o Mayús+F10 para ⋯, Supr para eliminar; foco visible según sistema visual.
14. Cada tarjeta expone a lectores de pantalla el texto `bib.aria.tarjeta`.
15. La portada usa el estilo de la canción (fondo + fuente + color de letra) o, en canciones de YouTube sin estilo modificado (estilo igual al predeterminado de fábrica **o** al predeterminado vigente del usuario; deja de valer en cuanto se edita en el Editor), la miniatura con velo `rgba(0,0,0,0.5)` y el título en `texto-1`.
16. Un borrador de YouTube con la fuente `pendiente` y sin trabajo vivo muestra «Falta descargar el audio» en `texto-2` sin icono y "Continuar", que abre el paso 1 (spec 03, wireframe E); durante la actualización automática de yt-dlp la línea de paso es «⟳ Actualizando el descargador…» con barra indeterminada ([0013](../preguntas/0013-huecos-ux-de-la-fase-2.md) §1, §4).
17. Una canción de YouTube sin `fuente/miniatura.jpg` (o cuya miniatura no carga) usa la portada del estilo como cualquier otra canción, sin marcador ni aviso.
18. Durante la fase `descargando_modelo` de una separación, la tarjeta muestra `bib.paso.modelo` con barra determinada; durante un reintento automático por memoria, `bib.paso.reintento.memoria`; durante la espera de un reintento de red de una descarga, `bib.paso.reintento.red` con la cuenta atrás. Ninguno se muestra como error. "Re-separar pistas" sigue disponible **solo** en canciones Dañadas sin pistas: no se ofrece para canciones separadas con el modelo Rápido ([0020](../preguntas/0020-huecos-ux-de-la-separacion-fase-3.md) §3).

## Fase 3 de 0.2.0 · Temas y biblioteca

Origen: [plan, fase 3, features 5 y 6](../versiones/0.2.0/plan-2.md#fase-3--temas-y-biblioteca) y [0047](../preguntas/0047-temas-asignados-edicion-y-borrado.md). Identidad de artista y álbum, índice y resolución de temas: [ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md); detalles acordados en [0054](../preguntas/0054-detalles-de-interfaz-de-temas-y-biblioteca.md). Conceptos de tema, procedencia, diálogos de nombre, impacto y eliminación: [Editor · Fase 3](06-editor.md#fase-3-de-020--temas-y-biblioteca). Esta sección **amplía** la vista; lo no mencionado sigue igual.

**Sustituye**: la fila «Buscar» de «Componentes e interacciones», la clave `bib.buscar`, la anatomía de la tarjeta (se añade una línea), el criterio 15 (portada de YouTube) y la frase del criterio 10 «la búsqueda ignora mayúsculas y tildes» (ahora también busca en álbum).

### Barra de herramientas
```
≥ 1280 px (una fila)
│ Biblioteca                                                                                 │
│ [Todas 12|Listas 7|Borradores 5]  Agrupar por [Sin agrupar|Artista|Álbum]  [☑ Seleccionar]  [🔍 Buscar título, artista o álbum] │

< 1280 px (dos filas)
│ [Todas 12|Listas 7|Borradores 5]                     [🔍 Buscar título, artista o álbum] │
│ Agrupar por [Sin agrupar|Artista|Álbum]                                [☑ Seleccionar] │
```
| Elemento | Comportamiento |
|---|---|
| **Agrupar por** (control segmentado con etiqueta visible) | «Sin agrupar» (la rejilla actual), «Artista», «Álbum». Se **guarda como preferencia global** (sobrevive al reinicio, como los tamaños de paneles del editor) en `config.biblioteca.agrupar` (`"ninguno"` = Sin agrupar, `"artista"`, `"album"`) con `config.actualizar` al cambiarlo; por defecto, o si el valor guardado no es válido, «Sin agrupar». Si la escritura falla, la vista agrupa igual durante la sesión, sin aviso. El plegado de grupos no se guarda. Se combina con filtro y búsqueda. |
| **Buscar** | Placeholder y nombre `bib.buscar` («Buscar título, artista o álbum»). Comparación **flexible**: sin distinguir mayúsculas ni tildes, con espacios colapsados («queen   greatest» encuentra «Queen · Greatest Hits»); cada palabra de la consulta debe aparecer en título, artista o álbum (en cualquiera de los tres). Se combina con el filtro de estado y con la agrupación. Ctrl/Cmd + F y Esc como hoy. La identidad de los grupos es estricta (ver «Grupos»); la búsqueda no. |
| **Seleccionar** | Botón secundario con icono `square-check`. Entra en el modo selección (ver «Selección múltiple»). Con el modo activo se sustituye por la barra de selección. No aparece en el estado vacío. |
| **Recuento anunciado** | Tras cambiar búsqueda, filtro o agrupación, una región `role="status"` (solo lectores de pantalla) anuncia `bib.anuncio.resultados` con 500 ms de espera tras la última tecla. |

### Grupos

**Por artista**
```
│ ▾ Queen  ·  7 canciones                 Tema del artista: Neón   [Tema…]  │  h2 + controles
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                                          │
│ │ card │ │ card │ │ card │ │ card │   (rejilla igual que «Sin agrupar»)      │
│ └──────┘ └──────┘ └──────┘ └──────┘                                          │
│ ▾ Jarabe de Palo  ·  2 canciones        Sin tema de artista      [Tema…]  │
│ …                                                                          │
│ ▾ Sin artista  ·  3 canciones           Añade el artista con «Editar datos» para darles un tema. │
```

**Por álbum**
```
│ ▾ A Night at the Opera — Queen  ·  4 canciones   Tema del álbum: Noche ninja  [Tema…] │
│ ▾ Greatest Hits — ABBA  ·  3 canciones           Sin tema de álbum            [Tema…] │
│ ▾ Greatest Hits — Queen  ·  2 canciones          Sin tema de álbum            [Tema…] │  ← homónimo separado
│ ▾ Greatest Hits — Sin artista  ·  1 canción      Añade el artista para darle un tema. │
│ ▾ Sin álbum  ·  5 canciones                                                          │
```

| Aspecto | Regla |
|---|---|
| Identidad | La da main (ADR 0016): Unicode NFC, espacios recortados y colapsados y sin distinguir mayúsculas, **conservando tildes** («Canción» y «Cancion» son grupos distintos; «QUEEN» y «Queen» el mismo). El álbum pertenece a su artista: dos álbumes con el mismo nombre y distinto artista son **dos grupos**. |
| Nombre visible | La grafía de la canción del grupo modificada más recientemente (estable mientras no se edite otra; [0054](../preguntas/0054-detalles-de-interfaz-de-temas-y-biblioteca.md) §4). Para unificarla, se corrige con «Editar datos». |
| Orden de grupos | Alfabético por nombre visible (comparación del idioma, sin distinguir mayúsculas ni tildes). En «Álbum», por artista y luego por álbum. «Sin artista» y «Sin álbum» al final. |
| Orden dentro del grupo | El de siempre: modificadas más recientemente primero. |
| Metadatos ausentes | «Sin artista» (vista por artista) y «Sin álbum» (vista por álbum, un único grupo con canciones de cualquier artista; la tarjeta ya muestra el artista). Un álbum con nombre y sin artista forma su grupo «{álbum} — Sin artista». Son **agrupaciones visuales**: no admiten tema (sin botón «Tema…», con el texto `bib.grupo.sinTema.*`). |
| Encabezado | `h2` con botón plegable (chevron, `aria-expanded`, `aria-controls`) que incluye nombre y recuento; a la derecha, el tema del grupo (`bib.grupo.tema` o `bib.grupo.sinTemaPropio`) y [Tema…]. Con búsqueda o filtro activos, el recuento es «{v} de {n} canciones». |
| Plegado | Por grupo, solo durante la sesión (al reiniciar, todo desplegado). Plegar no cambia la selección. Un grupo plegado conserva su encabezado. |
| Con búsqueda o filtro | Solo aparecen los grupos con alguna coincidencia. Si no hay ninguna, el mensaje de «Sin resultados» de siempre (no hay mensajes por grupo). |
| Tema del grupo en borrado pendiente | Las asignaciones de grupo siempre apuntan a temas existentes (ADR 0016 §3). Si su tema está en borrado pendiente, el encabezado lo dice con `bib.grupo.temaBorrando` (icono ⚠, `aviso`) y [Tema…] permite elegir otro. |

### Tema de un artista o de un álbum

Se asigna desde [Tema…] del encabezado del grupo (y, con el mismo diálogo, desde «Tema del álbum…» / «Tema del artista…» del editor).

```
┌ Tema del álbum «A Night at the Opera» de Queen ───────┐
│ Tema                                                  │
│ [▣ Noche ninja                                  ▾ ]   │  primera opción: «Sin tema de álbum»
│                                                       │
│ Cambiará el aspecto de 3 de sus 4 canciones.          │  se recalcula al cambiar la opción
│ 1 no cambia porque tiene tema personalizado o         │
│ asignado.                                             │
│ [▸ Ver las canciones]                                 │
│ Las canciones que añadas a este álbum también lo      │
│ usarán.                                               │
│                                  [Cancelar] [Aplicar] │
└───────────────────────────────────────────────────────┘
```
- La primera opción es «Sin tema de álbum (usar el del artista o el predeterminado)» / «Sin tema de artista (usar el predeterminado)». Elegirla **quita** la asignación del grupo; el recuento dice cuántas cambiarán y a qué pasan («Pasarán a usar «Neón», del artista»). Cada canción vuelve a lo que le da el nivel siguiente, que puede ser distinto en cada una (su base «al azar» o «predeterminado anterior», el predeterminado o el estilo incluido; el `despues` de cada afectada en `ImpactoIpc`). Si no todas van al mismo destino, se usa la variante «destinos distintos» de `bib.grupo.impacto` y la lista revelable muestra el destino de cada una.
- **Destino `respaldo`** ([0056](../preguntas/0056-destino-respaldo-y-canciones-pendientes.md)): una canción cuya base («al azar» o «predeterminado anterior») apunta a un tema que no está en el catálogo pasará a «Tema no disponible». Su fila de la lista usa la variante «destino no disponible» de `bib.grupo.impacto` (con ⚠ en `aviso`; no se nombra ningún tema, aunque `despues.temaNombre` venga relleno). Si **todas** las afectadas van a `respaldo`, el texto principal usa la variante «quitar, todas no disponibles». Si solo van algunas, se usa el texto que toque («quitar» o «destinos distintos») y debajo se añade la línea `bib.grupo.impacto.noDisponible` con ⚠. No cambia el botón ni el foco inicial: quitar el tema del grupo sigue siendo reversible desde el mismo diálogo.
- La asignación del grupo **no** toca canciones con tema personalizado ni con tema asignado; en «Artista», tampoco las canciones cuyo álbum tiene tema. El texto de exclusión enumera la causa real (`bib.grupo.excluidas`).
- Con 0 canciones afectadas: `bib.grupo.ninguna`. El botón «Aplicar» sigue disponible (la asignación vale para canciones futuras del grupo).
- Foco inicial en el selector; «Aplicar» es el botón principal del diálogo (asignar a un grupo es reversible desde el mismo diálogo y su alcance se ve antes de confirmar). Confirmación obsoleta, error de escritura y tema inexistente: como en el editor (`tema.obsoleto`, `tema.toast.error`, `tema.error.noExiste`).
- Tras aplicar: toast `bib.grupo.toast`, el encabezado muestra el tema nuevo y las tarjetas afectadas actualizan portada y línea de tema en vivo sin moverse. Foco de vuelta en [Tema…].
- No entra en ningún historial de deshacer.

### Tarjeta: tema y portada

Anatomía con la línea nueva:
```
│ Título (t-subtitulo)             │
│ Artista · duración (texto-2)     │
│ ◐ Neón · del artista (texto-3)   │  ← línea de tema, t-pequeno, una línea con «…»
│ [insignia estado]          [⋯]   │
```
- Texto: `bib.tarjeta.tema` con el nombre del tema y su procedencia corta (`tema.origen.corta.*`); «◐ Tema personalizado»; «◐ Estilo incluido»; con tema no disponible, «⚠ Tema no disponible» (icono `aviso`, texto `texto-3`). Icono `palette` 14 px. Se añade al final de `bib.aria.tarjeta`.
- Procedencia corta (`tema.origen.corta.*`, spec 06): del álbum · del artista · predeterminado · al azar · predeterminado anterior · incluido; con tema asignado a la canción, «propio». Ejemplo: «◐ Noche ninja · predeterminado anterior». Si no cabe, se corta con «…» y el texto completo va en `title` y en el nombre accesible.
- **Portada** (sustituye al criterio 15): usa siempre el aspecto efectivo de la canción. Una canción de YouTube muestra su miniatura con velo **solo** mientras su apariencia es **neutra** (nadie eligió nada para ella, su álbum ni su artista): procedencia «Tema predeterminado», «Elegido al azar», «Tema predeterminado anterior» o «Estilo incluido». En cuanto tiene tema asignado, personalizado, o tema de álbum o artista, la portada usa el estilo; también con «Tema no disponible». Una canción de 0.1.0 personalizada cuyo estilo era igual al predeterminado de fábrica o al del usuario conserva la miniatura hasta que se edite su estilo (compatibilidad con la regla anterior). La decisión la da main en `apariencia.neutra` del resumen ([ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md) §3 y §9): el renderer la usa tal cual (`miniatura` presente y `neutra` → miniatura; si no, estilo resuelto) y no compara estilos ni lee `config.estilo_predeterminado`. Así, quitar el predeterminado en Ajustes no cambia ninguna portada.
- Menú ⋯ de Lista y Borrador: se añade «Aplicar tema…» tras «Editar datos». Abre el diálogo de «Aplicar tema» con esa sola canción.

### Editar datos

- El diálogo es el mismo (`bib.datos.titulo`). Al guardar un cambio de artista o álbum, la tarjeta **se mueve en ese momento** a su grupo nuevo (excepción a «no se reordena hasta salir y volver», que sigue valiendo para cambios de estado). Si el grupo destino estaba plegado, se despliega.
- Foco: vuelve a la tarjeta en su posición nueva, que se desplaza hasta quedar visible (`block: "nearest"`); se anuncia `bib.anuncio.movida`.
- Si con los datos nuevos la canción deja de coincidir con la búsqueda o el filtro, no desaparece de golpe: permanece visible en su grupo nuevo hasta el siguiente cambio de búsqueda, filtro o agrupación, con la tarjeta enfocada (evita perder el foco).
- La herencia se **reevalúa**: si cambia el tema efectivo (p. ej. el álbum nuevo tiene tema), portada y línea de tema se actualizan y aparece el toast `bib.toast.temaCambiado`. Si no cambia, no hay toast. Las canciones personalizadas o con tema asignado no cambian de aspecto.
- Vaciar el artista o el álbum lleva la tarjeta a «Sin artista» o «Sin álbum».

### Selección múltiple y «Aplicar tema…»

**Modo selección**
```
│ ☑ 3 seleccionadas · 1 fuera de la vista   [Aplicar tema…]  [Seleccionar visibles]  [Quitar selección]  [Terminar] │
│ ▾ ☐ Queen · 7 canciones  (en modo selección, casilla de grupo tri-estado)  │
│ ┌───────────┐                                                             │
│ │☑ portada  │  casilla 24 px arriba a la izquierda de la portada          │
│ │ Título    │  sin botón de acción principal ni ⋯ mientras dura el modo   │
│ └───────────┘                                                             │
```
| Elemento | Comportamiento |
|---|---|
| Entrar | «Seleccionar» (barra) o Ctrl/Cmd + A con el foco en la rejilla (entra y selecciona todas las visibles). La barra de selección sustituye a la fila de «Seleccionar» y queda fija arriba al desplazar la vista (`position: sticky`). Con «Seleccionar», el foco pasa a la tarjeta activa para empezar a marcar (con Ctrl/Cmd + A se queda donde estaba); se anuncia `bib.sel.anuncio.entrar`. |
| Tarjeta | Clic en cualquier parte, Espacio o Intro alternan su casilla. No se reproduce ni se abre nada. Casilla con nombre `bib.sel.casilla`. Las flechas siguen moviendo el foco. Mayús + clic selecciona el rango desde la última tarjeta alternada (orden visual). |
| Canciones no editables | Las **Dañadas con `cancion.json` ilegible** (y, en fases futuras, las bloqueadas por una sesión de evento) muestran la casilla `aria-disabled` con tooltip `bib.sel.noEditable`; no se pueden seleccionar. Borradores en cualquier paso, Listas y las **Dañadas solo por faltar pistas** sí (su `cancion.json` es válido y el tema se verá cuando se reparen; [0054](../preguntas/0054-detalles-de-interfaz-de-temas-y-biblioteca.md) §8). |
| Casilla de grupo | En vistas agrupadas, en el encabezado: marca o desmarca las canciones **visibles y editables** del grupo; estado mixto si hay parte. Nombre `bib.sel.grupo`. |
| Seleccionar visibles | Añade todas las visibles editables (respeta búsqueda, filtro y grupos plegados: las de grupos plegados no se añaden). |
| Quitar selección | Vacía la selección y sigue en el modo. |
| Persistencia | La selección se conserva al buscar, filtrar, agrupar o plegar. La barra dice cuántas quedan fuera de la vista (`bib.sel.fuera`). Si una seleccionada se elimina, sale de la selección sin aviso; si pasa a Dañada, sigue contada y la confirmación la excluye. |
| Terminar | Botón o **Esc** (si no hay diálogo ni menú abierto, y el foco no está en la búsqueda con texto). Sale del modo y vacía la selección. Foco al botón «Seleccionar». |
| Aplicar tema… | Inactivo (`aria-disabled`, tooltip `bib.sel.ninguna`) sin selección. Abre el diálogo. |

**Diálogo «Aplicar tema»** (ancho 560 px, máx. 90 vw)
```
┌ Aplicar tema a 4 canciones ─────────────────────────────┐
│ Tema [▣ Neón                                      ▾ ]   │
│ Se asignará «Neón» a cada canción. No cambia el tema de │
│ sus álbumes ni de sus artistas.                         │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ Bohemian Rhapsody — Queen                            │ │
│ │   ⚠ Sustituye su tema personalizado                  │ │
│ │ La flaca — Jarabe de Palo                            │ │
│ │   Ahora usa «Noche ninja» (del artista)              │ │
│ │ Despacito — Luis Fonsi                               │ │
│ │   Sustituye el tema asignado «Sol»                   │ │
│ │ Lucía — Sin artista                                  │ │
│ │   Ya tiene asignado «Neón»: no cambia                │ │
│ └──────────────────────────────────────────────────────┘ │
│ ⚠ 1 canción perderá su tema personalizado.              │
│                       [Cancelar] [Aplicar a 3 canciones] │
└──────────────────────────────────────────────────────────┘
```
- Las anotaciones de cada canción las calcula main para el tema elegido y se recalculan al cambiarlo: `bib.lote.nota.*`. La lista ocupa hasta 280 px con scroll propio y está ordenada como en la Biblioteca (sin agrupar).
- Aplicar = **asignar el tema a nivel canción** (vínculo vivo), igual que elegirlo en el editor. Las personalizadas pierden su estilo propio: el aviso `bib.lote.avisoPersonalizado` lo dice antes de confirmar.
- El botón dice cuántas cambiarán (excluye las que ya lo tienen asignado). Si son 0, está inactivo con `bib.lote.nadaQueCambiar`.
- Foco inicial en el selector de tema; Esc = Cancelar.
- **Aplicando**: el botón pasa a «Aplicando… {i} de {n}» (`hechas`/`total` del evento `temas:progreso` de la ficha confirmada; antes del primer evento, «Aplicando… 0 de {n}»), el selector y la lista quedan inactivos; no se cierra con Esc hasta terminar.
- **Resultado** (el mismo diálogo, título `bib.lote.resultado`):
```
│ «Neón» se aplicó a 2 de 3 canciones.                    │
│ ✓ Bohemian Rhapsody — Aplicado                          │
│ ✕ La flaca — No se pudo guardar.     [Copiar detalles]  │
│ – Lucía — Ya lo tenía                                   │
│                     [Revisar y reintentar] [Cerrar]     │
```
  - Cada fila con icono y texto (✓ `exito`, ✕ `error`, – `texto-3`). Correspondencia con el resultado de main (ADR 0016 §7): `aplicada` → ✓ «Aplicado»; `sin_cambios` → – «Ya lo tenía»; `omitida` → – con su motivo (`bib.lote.fallo.noExiste`, `bib.lote.fallo.danada` o `bib.lote.fallo.cambio`); `error` → ✕ `bib.lote.fallo.guardar`. «Revisar y reintentar» incluye las `error` y las `omitida` por cambio; nunca las `aplicada` ni las `sin_cambios`. Si el tema dejó de existir o entró en borrado, no se aplica a ninguna y se muestra `tema.error.noExiste`. Con `CONFIRMACION_OBSOLETA` antes de empezar, la lista de confirmación se actualiza con `tema.obsoleto` y no se aplica nada.
  - Las que se aplicaron **quedan aplicadas** (no hay vuelta atrás automática). «Revisar y reintentar» vuelve a la confirmación solo con las fallidas, recalculando sus notas; nunca repite las ya aplicadas.
  - El resultado se anuncia (`role="status"`) con el resumen. El foco va a «Cerrar» si todo fue bien o a «Revisar y reintentar» si hubo fallos.
  - Al cerrar: si todo fue bien, sale del modo selección y el foco va a «Seleccionar»; con fallos, sigue en el modo con las fallidas seleccionadas y el foco en «Aplicar tema…».
- Desde el menú ⋯ de una tarjeta, el mismo diálogo con una canción («Aplicar tema a «{título}»»); al cerrar, el foco vuelve a la tarjeta.

### Foco y desplazamiento al actualizar resultados
- Escribir en la búsqueda: el foco se queda en el campo; la vista vuelve arriba en cada cambio del texto (los resultados empiezan siempre visibles).
- Cambiar filtro o agrupación: el foco se queda en el control. Si la tarjeta activa (la del *roving tabindex*) sigue visible, se desplaza para mostrarla (`block: "center"`); si no, la vista vuelve arriba y la activa pasa a ser la primera.
- **Teclado en vistas agrupadas**: las tarjetas de todos los grupos comparten un solo punto de tabulación (*roving tabindex*). ←/→ recorren en orden visual cruzando grupos; ↑/↓ van a la fila contigua, también la del grupo anterior o siguiente; Inicio/Fin, primera y última tarjeta del grupo; Ctrl/Cmd + Inicio/Fin, de toda la biblioteca. Los controles del encabezado (plegar, [Tema…], casilla) son paradas de tabulación propias, antes de su rejilla. Las tarjetas de grupos plegados no participan.
- Actualizaciones en vivo (`cancion:cambiada`, nuevas canciones) no mueven el foco ni el desplazamiento: si aparece contenido por encima, la posición se ancla a la primera tarjeta visible. Una canción nueva aparece en su grupo sin reordenar el resto hasta volver a la vista (regla de siempre).
- Si desaparece la tarjeta enfocada (eliminada aquí o en otra parte), el foco pasa a la siguiente del orden visual, si no a la anterior, si no al título de la vista. Nunca queda en `body`.
- Volver del reproductor o del editor conserva agrupación, grupos plegados, filtro, búsqueda (solo desde el reproductor, como hoy), modo selección y desplazamiento, con el foco en la tarjeta.

### Estados nuevos
| Estado | Presentación |
|---|---|
| Biblioteca vacía | Igual que hoy; sin «Agrupar por» ni «Seleccionar». |
| Sin resultados agrupando | Mensajes de siempre (`bib.sinresultados*`). |
| Todas en «Sin artista» | Un solo grupo; sin aviso especial. |
| Catálogo en solo lectura (`TEMAS_SOLO_LECTURA`) o apartado por ilegible | Las tarjetas que apuntaban a temas que ya no se pueden usar muestran su aspecto de respaldo y «⚠ Tema no disponible». En solo lectura, [Tema…] y «Aplicar tema…» quedan inactivos con `bib.temas.soloLectura`. |
| Catálogo vacío | «Aplicar tema…» y [Tema…] inactivos con el tooltip `bib.temas.vacio`. |

### Microcopy (fase 3, biblioteca)
| Clave | Texto |
|---|---|
| `bib.buscar` | Buscar título, artista o álbum |
| `bib.agrupar` | Agrupar por · Sin agrupar · Artista · Álbum |
| `bib.anuncio.resultados` | {n} canciones · (n = 1) 1 canción · (n = 0) Ninguna canción |
| `bib.grupo.recuento` | {n} canciones · 1 canción · (con búsqueda o filtro) {v} de {n} canciones |
| `bib.grupo.sinArtista` / `bib.grupo.sinAlbum` | Sin artista · Sin álbum |
| `bib.grupo.album` | {álbum} — {artista} · (sin artista) {álbum} — Sin artista |
| `bib.grupo.plegar` | Plegar {grupo} · Desplegar {grupo} |
| `bib.grupo.tema` | Tema del artista: {tema} · Tema del álbum: {tema} |
| `bib.grupo.sinTemaPropio` | Sin tema de artista · Sin tema de álbum |
| `bib.grupo.temaBorrando` | ⚠ {tema}: eliminación sin terminar |
| `bib.grupo.sinTema.artista` | Añade el artista con «Editar datos» para darles un tema. |
| `bib.grupo.sinTema.album` | Añade el álbum con «Editar datos» para darles un tema. |
| `bib.grupo.sinTema.albumSinArtista` | Añade el artista para darle un tema. |
| `bib.grupo.boton` | Tema… — nombre accesible: Tema del artista {artista}… · Tema del álbum {álbum}… |
| `bib.grupo.dialogo` | Título: Tema del artista {artista} · Tema del álbum «{álbum}» de {artista} · Opción: Sin tema de artista (usar el predeterminado) · Sin tema de álbum (usar el del artista o el predeterminado) — [Cancelar] [Aplicar] |
| `bib.grupo.impacto` | Cambiará el aspecto de {n} de sus {m} canciones. · (n = m) Cambiará el aspecto de sus {m} canciones. · (quitar) {n} canciones pasarán a usar «{tema}», {procedencia}. · (quitar, destinos distintos) {n} canciones volverán al tema que usaban sin el del {artista/álbum}; en la lista se ve cuál usará cada una. · (fila de la lista al quitar) {título} — {artista} · usará «{tema}» ({procedencia corta}) · (destino estilo incluido) {título} — {artista} · usará el estilo incluido · (destino no disponible) ⚠ {título} — {artista} · se verá con el último aspecto guardado (su tema de origen no está en tus temas) · (quitar, todas no disponibles) {n} canciones se verán con el último aspecto guardado en cada una: su tema de origen no está en tus temas. · (n = 1, no disponible) 1 canción se verá con el último aspecto guardado en ella: su tema de origen no está en tus temas. |
| `bib.grupo.impacto.noDisponible` | ⚠ {r} de ellas quedarán como «Tema no disponible» porque su tema de origen no está en tus temas. Puedes darles otro con «Aplicar tema…». · (r = 1) ⚠ 1 de ellas quedará como «Tema no disponible» porque su tema de origen no está en tus temas. Puedes darle otro con «Aplicar tema…». |
| `bib.grupo.excluidas` | {k} no cambian porque tienen tema personalizado o asignado. · (artista) {k} no cambian porque tienen tema personalizado o asignado, o su álbum tiene tema. |
| `bib.grupo.ninguna` | Ahora no cambiará ninguna canción. |
| `bib.grupo.futuras` | Las canciones que añadas a este {álbum/artista} también lo usarán. |
| `bib.grupo.toast` | {Artista/Álbum} {nombre}: tema «{tema}». · (quitar) {Artista/Álbum} {nombre}: sin tema propio. |
| `bib.tarjeta.tema` | {tema} · {procedencia corta} · Tema personalizado · Estilo incluido · Tema no disponible |
| `bib.aria.tarjeta` | {título}, {artista}, {estado}. {línea de paso}. Tema: {línea de tema}. |
| `bib.menu.aplicarTema` | Aplicar tema… |
| `bib.anuncio.movida` | «{título}» está ahora en {grupo}. |
| `bib.toast.temaCambiado` | «{título}» usa ahora el tema «{tema}», {procedencia en minúscula}. |
| `bib.sel.boton` | Seleccionar |
| `bib.sel.contador` | {n} seleccionadas · 1 seleccionada |
| `bib.sel.fuera` | {k} fuera de la vista |
| `bib.sel.visibles` | Seleccionar visibles |
| `bib.sel.quitar` | Quitar selección |
| `bib.sel.terminar` | Terminar |
| `bib.sel.casilla` | Seleccionar «{título}» |
| `bib.sel.grupo` | Seleccionar las canciones de {grupo} |
| `bib.sel.noEditable` | No se puede cambiar el tema de una canción que no se puede abrir. |
| `bib.sel.ninguna` | Selecciona al menos una canción. |
| `bib.sel.anuncio.entrar` | Modo selección. Usa Espacio para marcar canciones y Esc para terminar. |
| `bib.lote.titulo` | Aplicar tema a {n} canciones · Aplicar tema a «{título}» |
| `bib.lote.explicacion` | Se asignará «{tema}» a cada canción. No cambia el tema de sus álbumes ni de sus artistas. |
| `bib.lote.nota.personalizado` | ⚠ Sustituye su tema personalizado |
| `bib.lote.nota.asignado` | Sustituye el tema asignado «{tema}» |
| `bib.lote.nota.heredado` | Ahora usa «{tema}» ({procedencia corta}) |
| `bib.lote.nota.igual` | Ya tiene asignado «{tema}»: no cambia |
| `bib.lote.nota.noDisponible` | Sustituye un tema no disponible |
| `bib.lote.avisoPersonalizado` | ⚠ {k} canciones perderán su tema personalizado. · (k = 1) ⚠ 1 canción perderá su tema personalizado. |
| `bib.lote.aplicar` | Aplicar a {n} canciones · Aplicar a 1 canción |
| `bib.lote.nadaQueCambiar` | Todas las canciones ya tienen asignado este tema. |
| `bib.lote.aplicando` | Aplicando… {i} de {n} |
| `bib.lote.resultado` | «{tema}» se aplicó a {a} de {n} canciones. · (todas) «{tema}» se aplicó a {n} canciones. |
| `bib.lote.fila` | Aplicado · Ya lo tenía · {motivo de fallo} |
| `bib.lote.fallo.guardar` | No se pudo guardar. — [Copiar detalles] |
| `bib.lote.fallo.cambio` | Cambió mientras confirmabas. |
| `bib.lote.fallo.noExiste` | Ya no está en la biblioteca. |
| `bib.lote.fallo.danada` | Está dañada. |
| `bib.lote.reintentar` | Revisar y reintentar |
| `bib.temas.soloLectura` | Tus temas son de una versión más nueva de Shinobi Karaoke y aquí no se pueden cambiar. |
| `bib.temas.vacio` | Aún no tienes temas. Crea uno desde el editor de una canción. |

### Criterios de aceptación de la fase 3 (biblioteca)
- B1. «Agrupar por» ofrece Sin agrupar, Artista y Álbum; la elección se conserva al volver de otra vista y al reiniciar la app; «Sin agrupar» es idéntica a la rejilla anterior.
- B2. Con canciones de «Queen», «QUEEN » y «queen» se forma **un** grupo de artista; «Canción» y «Cancion» forman dos. Dos álbumes «Greatest Hits» de ABBA y de Queen aparecen como dos grupos en la vista por álbum.
- B3. Las canciones sin artista o sin álbum aparecen en «Sin artista» / «Sin álbum» al final, sin [Tema…] y con el texto `bib.grupo.sinTema.*`; un álbum sin artista forma «{álbum} — Sin artista», tampoco asignable.
- B4. La búsqueda encuentra por título, artista y álbum sin distinguir mayúsculas, tildes ni espacios repetidos, exige todas las palabras de la consulta, se combina con el filtro de estado y con la agrupación (grupos sin coincidencias ocultos, recuento «{v} de {n}») y anuncia el número de resultados una vez tras dejar de escribir.
- B5. [Tema…] de un grupo muestra el impacto recalculado al cambiar de opción, excluyendo personalizadas, asignadas y (en artista) las de álbum con tema; al aplicar, las tarjetas afectadas cambian portada y línea de tema sin moverse, el encabezado muestra el tema y el foco vuelve a [Tema…]. Quitar el tema de grupo devuelve sus canciones al siguiente nivel.
- B5b. (Destino `respaldo`, [0056](../preguntas/0056-destino-respaldo-y-canciones-pendientes.md)) Con un álbum con tema y dos canciones que lo heredan, una con base «al azar» de un tema que no está en el catálogo y otra sin base, elegir «Sin tema de álbum» muestra la variante «destinos distintos», la línea `bib.grupo.impacto.noDisponible` con r = 1 y, en la lista, la fila «destino no disponible» con ⚠ y sin nombre de tema. Si las dos tienen esa base, se usa la variante «quitar, todas no disponibles» sin la línea extra. Tras aplicar, esas tarjetas muestran «⚠ Tema no disponible».
- B6. La herencia se comprueba en los cuatro niveles con la línea de tema de la tarjeta: una canción con tema asignado ignora el del álbum; sin él, usa el del álbum; sin tema de álbum, el del artista; sin ninguno, el predeterminado.
- B7. «Editar datos» que cambia el artista mueve la tarjeta al grupo correcto en ese momento, despliega el grupo si estaba plegado, deja el foco en la tarjeta visible y anuncia `bib.anuncio.movida`; si su nuevo artista tiene tema y la canción lo hereda, portada y línea cambian y aparece `bib.toast.temaCambiado`; si estaba personalizada, no cambia su aspecto.
- B8. Modo selección: «Seleccionar» y Ctrl/Cmd + A lo activan; Espacio, Intro y clic alternan; Mayús + clic selecciona un rango; las Dañadas con `cancion.json` ilegible no se pueden marcar y explican por qué (las Dañadas por pistas sí); la casilla de grupo es tri-estado; la selección sobrevive a búsqueda, filtro y agrupación y la barra dice cuántas quedan fuera de vista; Esc y «Terminar» salen y vacían.
- B9. «Aplicar tema…» muestra la lista completa de seleccionadas con una nota por canción (personalizada, asignada, heredada, igual), el aviso de personalizadas y el número que cambiará en el botón; con todas iguales, el botón está inactivo con su motivo.
- B10. Con un fallo simulado en una de cinco canciones y otra modificada entre la confirmación y la escritura, el resultado muestra 3 aplicadas, 1 «No se pudo guardar» y 1 «Cambió mientras confirmabas»; las 3 quedan aplicadas al reabrirlas; «Revisar y reintentar» vuelve a confirmar solo las 2 fallidas.
- B11. Tras un lote correcto, se sale del modo y el foco está en «Seleccionar»; con fallos, se sigue en el modo con las fallidas seleccionadas y el foco en «Aplicar tema…». El resultado se anuncia una vez.
- B12. Escribir en la búsqueda mantiene el foco en el campo y lleva la vista arriba; cambiar agrupación mantiene visible la tarjeta activa; un evento en vivo no mueve foco ni desplazamiento; eliminar la tarjeta enfocada deja el foco en la siguiente (o anterior, o el título).
- B13. En vistas agrupadas, ←/→ y ↑/↓ cruzan grupos, Ctrl/Cmd + Inicio/Fin llevan a la primera y última tarjeta, y las de grupos plegados se saltan; plegar y desplegar se anuncian por `aria-expanded`.
- B14. La portada de una canción de YouTube muestra la miniatura solo con `apariencia.neutra` (procedencia predeterminado, al azar, predeterminado anterior o estilo incluido, o personalizada de 0.1.0 con estilo igual al predeterminado), y deja de mostrarla al asignar un tema a la canción, a su álbum o a su artista. Quitar el predeterminado en Ajustes no cambia la portada de ninguna canción; la línea de tema de las que lo seguían pasa a «… · predeterminado anterior».
- B15. Volver del reproductor conserva agrupación, grupos plegados, filtro, búsqueda, modo selección y desplazamiento, con el foco en la tarjeta.
- B16. Capturas en `docs/ux/revisiones/fase-3/` (ver [README](revisiones/fase-3/README.md)), nombre `biblioteca-{ancho}x{alto}-{escala}-{estado}.png`, a 1280 × 800 al 100 % y 1280 × 720 al 125 %: `artista`, `album` (con homónimos), `sin-metadatos`, `busqueda-album`, `seleccion` (con «fuera de la vista»), `dialogo-aplicar-tema`, `resultado-lote` (con fallos), `dialogo-tema-grupo`, `foco-tras-mover`.

## Fase 4 de 0.2.0 — ventana secundaria y cola

Origen: [plan, fase 4, features 10 y 11](../versiones/0.2.0/plan-2.md#fase-4--reproducción-en-eventos), [0048](../preguntas/0048-escucha-editor-durante-evento.md), [0049](../preguntas/0049-politica-cola-de-reproduccion.md) y [ronda 4](../versiones/0.2.0/discusion/r4-disenador-ux.md). Conceptos (sesión, cola, entrada activa, pendientes, candidata, última reproducida) y todo lo que ve el público: [07 · Fase 4](07-reproductor.md#fase-4-de-020--ventana-secundaria-y-cola). Bloqueo de edición: [06 · Fase 4](06-editor.md#fase-4-de-020--ventana-secundaria-y-cola). Contratos: [ADR 0017](../adr/0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md). Respuesta a los puntos de interfaz del arquitecto: [0058](../preguntas/0058-interfaz-de-la-sesion-en-vivo-y-la-cola.md). Conductas ante incidencias, decididas por el usuario en [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) (1B, 2A, 3B, 4A). Letra bloqueada y sin volumen ni voz guía en el panel: [0060](../preguntas/0060-letra-y-controles-de-sonido-durante-la-sesion.md) (1A, 2A). Esta sección **amplía** la vista; lo no mencionado sigue igual.

La ventana principal es el **puesto del operador**: desde aquí se abre el reproductor en otra pantalla, se prepara y ordena la cola y se opera la sesión (pausa, siguiente, reiniciar, detener la cuenta, cerrar). La secundaria solo muestra.

**Sustituye**, solo mientras hay sesión: la acción principal «▶ Reproducir» de las tarjetas Lista, el botón redondo de la portada y la acción de la portada / Intro (ver «Tarjetas durante la sesión»). Sin sesión, «Reproducir» abre el reproductor local como siempre, aunque haya una cola preparada o conservada.

### Vista con el panel de cola
```
≥ 1280 px
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ◆ Shinobi Karaoke        [▶ En otra pantalla] [⟳ 1 en curso]  [⚙]  [+ Añadir canción]       │ ← indicador de sesión
├────────────────────────────────────────────────────────┬─────────────────────────────────┤
│ Biblioteca              [▣ Abrir en otra pantalla…] [☰ Cola 3] │ Cola de reproducción   [Ocultar] │
│ [Todas|Listas|Borradores] Agrupar por […]  [☑ Seleccionar] [🔍…]│ ● Pantalla 2 · DELL U2720Q       │
│ ┌──────┐ ┌──────┐ ┌──────┐                              │   Pantalla completa              │
│ │ card │ │ card │ │ card │                              │ ─────────────────────────────── │
│ └──────┘ └──────┘ └──────┘                              │ (contenido del panel, P1–P6)    │
│ …                                                      │                                 │
└────────────────────────────────────────────────────────┴─────────────────────────────────┘
```
- **Panel** a la derecha de la rejilla, de alto completo bajo la barra superior, con scroll propio: 360 px (≥ 1280 px de ancho) o 320 px (< 1280). La rejilla se adapta (`auto-fill`): a 1024 px quedan 2 columnas. No hay divisor redimensionable.
- **Cuándo se ve**: se abre solo al empezar una sesión, al añadir la primera entrada a una cola vacía y al volver con una cola conservada. [Ocultar] lo cierra (foco al botón «Cola»); [☰ Cola {n}] de la cabecera lo abre o cierra (`aria-expanded`, `aria-controls`). Se recuerda abierto/cerrado durante la sesión de la app, no entre reinicios.
- **Cabecera de la vista**: «Abrir en otra pantalla…» (`ses.abrir`, secundario, icono `monitor-up`) y «Cola {n}» (`cola.boton`, fantasma, icono `list-music`; {n} = pendientes, sin cifra si 0) a la derecha del título «Biblioteca». Durante la sesión, «Abrir en otra pantalla…» desaparece (solo hay una secundaria). No aparecen en el estado vacío de la biblioteca.

### Abrir el reproductor en otra pantalla
Desde «Abrir en otra pantalla…» de la cabecera de la vista o del panel (P5, P6), desde [Volver a abrir] tras una caída y desde **«Reproducir en otra pantalla…»** del ⋯ de una canción Lista (solo sin sesión: esa canción empieza al momento y las pendientes siguen detrás). Son las **únicas** formas de empezar una sesión, y solo existen en la Biblioteca. Diálogo ancho (560 px):
```
┌ Abrir el reproductor en otra pantalla ──────────────────────────┐
│ Pantalla                                                         │
│ ◉ Pantalla 2 · DELL U2720Q · 3840 × 2160                         │
│ ○ Pantalla 1 · Pantalla integrada · 1512 × 982                   │
│     Principal · Aquí está esta ventana                           │
│ [☑] Pantalla completa                                            │
│                                                                  │
│ ⓘ El sonido sale por la salida de audio de tu equipo, no por la  │
│   pantalla elegida.                                              │
│ Empezará con «La flaca» — Jarabe de Palo.                        │  ← `ses.empieza.*`
│ Mientras el reproductor esté abierto no se podrán editar         │
│ canciones.                                                       │
│                                   [Cancelar] [Abrir reproductor] │
└──────────────────────────────────────────────────────────────────┘
```
| Elemento | Comportamiento |
|---|---|
| Pantallas | Grupo de radio con todas las pantallas que da main, en el orden del sistema. Cada opción: «Pantalla {n} · {nombre} · {ancho} × {alto}» (resolución física; sin nombre del sistema, se omite) y, en la principal, la línea `ses.pantalla.principal`. Selección inicial: la última usada si está conectada; si no, la primera que **no** es la principal; con una sola pantalla, esa. La lista se actualiza en vivo si se conecta o desconecta una pantalla; si desaparece la elegida, se selecciona la inicial y se muestra `ses.pantalla.desaparecida` (`role="alert"`). |
| Una sola pantalla | Se añade la nota `ses.unaPantalla` (`info`). «Pantalla completa» empieza desmarcada. |
| Pantalla completa | Casilla, marcada por defecto salvo si la elegida es la principal. Se recuerda junto con la pantalla (`config.reproductor.secundaria`, ADR 0017 §2). Elegir la pantalla de la ventana principal muestra la nota `ses.completa.misma` (`info`), marcada o no la casilla; no se impide (sirve con un solo monitor y para probar). |
| Linux con Wayland (`colocacion: 'sistema'`, [0061](../preguntas/0061-reproductor-en-otra-pantalla-con-wayland.md)) | El sistema decide dónde aparece la ventana: en lugar del grupo de radio se muestra `ses.wayland` (`info`) y la casilla «Pantalla completa» no aparece. «Abrir reproductor» abre la ventana en modo ventana. En el panel, el estado de la pantalla es `cola.pantalla.desconocida` y «Cambiar de pantalla…», «Mover a…» y «Llevar el reproductor allí» se sustituyen por `ses.wayland` como texto informativo. |
| Audio | Nota fija `ses.audio`. No hay selector de dispositivo (mejora futura de prioridad baja, 0048). |
| Empezará con | `ses.empieza.*` según la cola: vacía, con pendientes, con una última reproducida interrumpida o terminada (07 §"Reabrir con la cola conservada"). |
| Abrir reproductor | Primario. Pasa a «Abriendo…» (cargando). Éxito: el diálogo se cierra, el foco va al panel de la cola (encabezado «En reproducción» o la acción principal del estado), el panel se abre y el indicador de sesión aparece. Fallo: el diálogo sigue abierto con la selección intacta y un banner `error` en línea: `ses.error.abrir` con [Reintentar] (también con `PANTALLA_NO_DISPONIBLE`, que además actualiza la lista), `ses.error.guardando` con `GUARDADO_PENDIENTE` y `ses.error.noDisponible` si la canción elegida ya no se puede reproducir (`CANCION_NO_DISPONIBLE`). Con `SESION_EN_CURSO` (otra apertura ganó la carrera) el diálogo se cierra y el panel muestra la sesión. |
| Teclado | Foco inicial en la opción seleccionada; ↑/↓ cambian de pantalla; Esc = Cancelar. |

### Contenido del panel

**P1 — Sesión, reproduciendo**
```
│ Cola de reproducción                  [Ocultar] │
│ ● Pantalla 2 · DELL U2720Q                      │  estado de la pantalla (t-pequeno)
│   Pantalla completa                             │
│ [⛶ Ver en una ventana] [⋯] [✕ Cerrar reproductor] │  ⋯ = Mostrar · Cambiar de pantalla…
│ ─────────────────────────────────────────────── │
│ EN REPRODUCCIÓN                                  │  h3
│ ┌─────────────────────────────────────────────┐ │
│ │ Bohemian Rhapsody                       [⋯] │ │  fondo-2
│ │ Queen                                       │ │
│ │ ⚠ Faltan 3 líneas por sincronizar           │ │  solo si incompleta
│ │ 01:12 ━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━ 05:55   │ │  progreso de solo lectura
│ │ [❚❚ Pausa]  [⏭ Siguiente]  [↺ Reiniciar]     │ │
│ └─────────────────────────────────────────────┘ │
│ A CONTINUACIÓN (3)                    [Vaciar…] │  h3
│ 1  ⠿  La flaca — Jarabe de Palo   4:31   [⋯]    │
│ 2  ⠿  Despacito — Luis Fonsi      3:48   [⋯]    │
│ 3  ⠿  Bohemian Rhapsody — Queen   5:55   [⋯]    │  repetida: entrada distinta
```

**P2 — Cuenta entre canciones**
```
│ EN REPRODUCCIÓN                                  │
│ ┌─────────────────────────────────────────────┐ │
│ │ Terminó «Bohemian Rhapsody»                 │ │
│ │ Empieza en 3 s: «La flaca»                  │ │  t-cuerpo-fuerte; se actualiza cada segundo (no se anuncia cada segundo)
│ │ [▶ Empezar ya]  [❚❚ Detener cuenta]          │ │
│ └─────────────────────────────────────────────┘ │
│ A CONTINUACIÓN (3)                               │
│ 1  ⠿  La flaca — Jarabe de Palo  · Siguiente     │  la candidata lleva «Siguiente»
```

**P3 — Fallo de una entrada**
```
│ ┌─────────────────────────────────────────────┐ │
│ │ ✕ No se puede reproducir «La flaca»          │ │  banner error, role="alert"
│ │   Faltan sus pistas separadas.              │ │
│ │   [Pasar a la siguiente canción] [Copiar detalles] │  sin pendientes: [Descartar]
│ └─────────────────────────────────────────────┘ │
```

**P4 — En espera / fin de la cola**
```
│ ┌─────────────────────────────────────────────┐ │  │ ┌─────────────────────────────────────────────┐ │
│ │ En espera                                   │ │  │ │ La cola terminó.                            │ │
│ │ [▶ Iniciar «La flaca»]                       │ │  │ │ Si añades una canción, empezará tras la     │ │
│ └─────────────────────────────────────────────┘ │  │ │ cuenta. O cierra el reproductor.            │ │
│                                                 │  │ │ Última: Bohemian Rhapsody — Queen [↻ Otra vez] │
│                                                 │  │ └─────────────────────────────────────────────┘ │
```
Sin candidata, en espera: `cola.espera.vacia` en lugar del botón. En **fin de la cola**, añadir una canción (tarjeta, ⋯ o toast) **empieza la cuenta** hacia ella ([0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §3 B): el bloque pasa a P2 con [▶ Empezar ya] y [❚❚ Detener cuenta]. En **espera**, añadir no arranca nada: aparece [▶ Iniciar «{título}»].

**P5 — Sin sesión, cola conservada**
```
│ Cola de reproducción                  [Ocultar] │
│ Reproductor cerrado                             │
│ [▣ Abrir en otra pantalla…]   [Eliminar cola…]  │
│ ─────────────────────────────────────────────── │
│ ÚLTIMA REPRODUCIDA                               │  (fila de contexto, seleccionada)
│ Bohemian Rhapsody — Queen                       │
│ Se detuvo en 02:13. Al abrir el reproductor,    │
│ seguirá desde ahí.                              │
│ A CONTINUACIÓN (2)                    [Vaciar…] │
│ 1  ⠿  La flaca — Jarabe de Palo   4:31   [⋯]    │
│ 2  ⠿  Despacito — Luis Fonsi      3:48   [⋯]    │
```

**P6 — Sin sesión, preparando la cola** (sin última reproducida): como P5 sin el bloque «Última reproducida»; con 0 pendientes, `cola.vacia.sinSesion`. «Eliminar cola…» solo aparece si hay algo que eliminar.

### Componentes e interacciones del panel
| Elemento | Comportamiento |
|---|---|
| Estado de la pantalla | `cola.pantalla` + `cola.modo` (pantalla completa / en una ventana). Punto `exito` + texto (el color no es la única señal). |
| [⛶ Pantalla completa] / [⛶ Ver en una ventana] | Alterna la secundaria; el texto refleja el estado real (también si se cambia con F en la secundaria). |
| ⋯ › Mostrar | `ses.mostrar`: trae la secundaria al frente (y la restaura si estaba minimizada). No le pasa el foco del teclado. |
| ⋯ › Cambiar de pantalla… | En el ⋯ de la cabecera del panel (nombre `ses.menu`, «Más opciones del reproductor»). Abre el mismo diálogo de pantallas sin la parte de «Empezará con»; al aceptar, main mueve la ventana sin cortar el audio. |
| [✕ Cerrar reproductor] | Termina la sesión: con pendientes, diálogo `ses.cierre`; sin pendientes, cierra al momento. |
| Sin volumen ni voz guía | El panel no tiene volumen general ni nivel de voz guía (decisión del usuario en [0060](../preguntas/0060-letra-y-controles-de-sonido-durante-la-sesion.md) §2 A): se ajustan en el propio reproductor (spec 07) o con el volumen del sistema. |
| Progreso de la activa | Barra de 6 px **de solo lectura** (`role="progressbar"`, `aria-valuetext` «1 minuto 12 segundos de 5 minutos 55») y tiempos `t-tiempo`, actualizados al menos una vez por segundo. Para buscar se usa la secundaria. |
| [❚❚ Pausa] / [▶ Reanudar] | Pausa o reanuda la secundaria. |
| [⏭ Siguiente] | Interrumpe la activa y empieza la cuenta de la candidata (07 S1), como un fin natural; [▶ Empezar ya] la salta. Sin pendientes: `aria-disabled` con tooltip `cola.siguiente.no`. Sin confirmación; un doble clic produce un único avance (ADR 0017 §7). |
| [↺ Reiniciar] | `cola.reiniciar`: vuelve al principio de la activa con título y silencio previo. |
| ⋯ de la activa | «Agregar otra vez al final». |
| [▶ Empezar ya] / [❚❚ Detener cuenta] | Durante la cuenta (P2). Detener → en espera (P4) con la misma candidata. |
| [▶ Iniciar «{título}»] | En espera con candidata (P4; en fin de la cola no hace falta, porque añadir ya empieza la cuenta): empieza la candidata al momento, con su pantalla de título. Es la acción principal del panel en ese estado. |
| [↻ Otra vez] | En fin de la cola sin candidata: vuelve a poner la última al frente («Reproducir a continuación») y la empieza. |
| Fallo (P3) | Banner `error` con `cola.fallo.titulo` y la causa (`cola.causa.*`). [Pasar a la siguiente canción] descarta la entrada fallida y empieza la cuenta de la siguiente. Sin pendientes no aparece: se añade `cola.fallo.sinSiguiente` y el botón es [Descartar] (`cola.descartar`), que deja la sesión en espera sin candidata. [Copiar detalles] copia el código. Foco al botón primero al aparecer el fallo **solo si el foco estaba en el panel**; si no, se anuncia y el indicador de sesión pasa a «Requiere atención». |
| Lista «A continuación» | `role="list"` con nombre `cola.pendientes`. Fila de 48 px: posición, asa ⠿, «título — artista», duración, ⋯. La candidata lleva la etiqueta `cola.etiqueta.siguiente` durante la cuenta y en espera. Una pendiente que ya se sabe que no se puede reproducir muestra debajo `cola.noDisponible` (icono ⚠ `aviso`) y sigue en su sitio hasta que se quite o llegue su turno (entonces, P3). Una canción Lista **incompleta** muestra `bib.lista.incompleta` debajo, como aviso informativo. |
| ⋯ de una pendiente | «Reproducir a continuación» (no en la primera) · «Subir» (no en la primera) · «Bajar» (no en la última) · «Mover al final» (no en la última) · «Agregar otra vez al final» · separador · «Quitar de la cola». |
| Reordenar con ratón | Arrastrar desde el asa ⠿ (cursor `grab`). Una línea de 2 px `acento-texto` marca el hueco de destino; la fila arrastrada queda semitransparente en su sitio. Al soltar, se mueve; Esc durante el arrastre cancela. Arrastrar cerca de los bordes del panel lo desplaza. Nunca se puede arrastrar la activa ni soltar por encima de ella. |
| Reordenar con teclado | Con una fila enfocada: **Alt + ↑ / ↓** sube / baja una posición; **Alt + Inicio / Fin** la llevan al principio / al final. El foco sigue a la fila movida y se anuncia `cola.anuncio.movida`. Equivalentes en el ⋯. |
| Navegación | La lista es una sola parada de tabulación (*roving tabindex*): ↑/↓ entre filas, Inicio/Fin; Tab siguiente va al ⋯ de la fila activa. Tecla Menú o Mayús + F10 abre el ⋯. **Supr** quita la fila. |
| Quitar | Sin confirmación. Toast `cola.toast.quitada` con [Deshacer] (la vuelve a su posición si la cola no cambió entretanto; si cambió, al final). El foco pasa a la fila siguiente, si no a la anterior, si no al encabezado «A continuación» (`tabindex="-1"`). |
| [Vaciar…] | Visible con ≥ 2 pendientes. Diálogo `cola.dialogo.vaciar` (foco en «Cancelar»). No interrumpe la activa. |
| [Eliminar cola…] | Solo sin sesión (P5, P6). Diálogo `cola.dialogo.eliminar`: quita pendientes y última reproducida. |
| Cambios hechos por otros | Si la secundaria avanza, una entrada se descarta o main recalcula la candidata, la lista se actualiza sin mover el foco; si desaparece la fila enfocada, rige la regla de «Quitar». |

### Tarjetas y menú durante la sesión
| Elemento | Sin sesión (con o sin cola) | Con sesión |
|---|---|---|
| Acción principal de una Lista | «▶ Reproducir» (reproductor local, como hoy) | **«A la cola»** (`bib.cola.boton`, icono `list-plus`) = «Agregar al final» |
| Botón redondo de la portada, clic en la portada, Intro | Reproducir (local) | Agregar al final |
| ⋯ de una Lista | Reproducir · **Reproducir en otra pantalla…** · **Reproducir a continuación** · **Agregar al final** · Editar · Editar datos · Aplicar tema… · Volver a borrador · Mostrar en la carpeta · Eliminar… | Reproducir a continuación · Agregar al final · Editar (bloqueado) · Editar datos · Aplicar tema… · Volver a borrador · Mostrar en la carpeta · Eliminar… (sin «Reproducir») |
| ⋯ de un Borrador | Continuar · … (como hoy) | Igual; «Continuar» hacia Letra o Editor muestra el bloqueo (spec 06) |
| Línea de cola en la tarjeta | Si está pendiente: `bib.cola.enCola` | Activa: `bib.cola.sonando`; pendiente: `bib.cola.enCola` |
- Solo las canciones **Lista** (incluidas las incompletas) se pueden poner en cola. Borradores y Dañadas no ofrecen las opciones. Con la cola llena (500 pendientes, `COLA_LLENA`) se muestra el toast `cola.llena` y no se añade nada.
- **Reproducir en otra pantalla…** abre el diálogo de pantallas con `ses.empieza` en su variante «con canción». Si había una última reproducida interrumpida, la variante lo dice (no se retomará).
- **Reproducir a continuación** coloca la entrada **al frente de las pendientes** (nunca interrumpe la activa). **Agregar al final**, al final. Repetir una canción ya en cola crea otra entrada. Cada vez: toast `cola.toast.siguiente` / `cola.toast.final` con [Deshacer] (quita esa entrada); en espera sin candidata, el toast añade [▶ Iniciar ahora]; en fin de la cola, el toast usa la variante `cola.toast.cuenta` (la cuenta ya ha empezado). Se anuncia el toast como siempre (`aria-live`).
- **Editar** (y «Continuar» hacia Letra o Editor, el toast «Abrir editor» de spec 04, el stepper hacia Letra o Editor) muestran el diálogo de bloqueo `edi.bloqueo` (spec 06). Se pintan con `aria-disabled="true"` y un icono `lock` 14 px; siguen enfocables.
- Siguen disponibles durante la sesión: Añadir canción, Editar datos (la cola muestra el título nuevo), Aplicar tema y [Tema…] de grupo (la activa conserva su aspecto; las pendientes usan el nuevo al empezar), selección múltiple (ninguna canción queda excluida por la sesión; sustituye la nota de «Canciones no editables» de la fase 3), Mostrar en la carpeta y Ajustes.
- **Eliminar…** y **Volver a borrador** de la canción de la **entrada activa**: `aria-disabled` con tooltip `bib.cola.activaBloqueada`. De una canción **pendiente**: permitidos, con una frase más en su diálogo (`bib.cola.dialogo.eliminar` / `bib.cola.dialogo.borrador`). Eliminar quita también sus entradas de la cola; Volver a borrador las deja marcadas `cola.noDisponible`.
- El reproductor local (incluido el toast `bib.toast.lista` con [▶ Reproducir]) no se puede abrir durante la sesión: un solo transporte audible.

### Indicador de sesión (barra superior)
- Botón en la barra superior, a la izquierda del indicador de actividad, en todas las vistas que tienen barra superior. Visible con sesión o con una cola no vacía.
- Textos (`ses.ind.*`) con icono: «▶ En otra pantalla» (`info`), «❚❚ En pausa», «Siguiente en {n} s», «En espera», «⚠ Requiere atención» (`aviso`: fallo, pantalla desconectada, cierre inesperado o sin respuesta), y sin sesión «Cola {n}». Nombre accesible `ses.ind.aria`.
- Clic: lleva a la Biblioteca (desde otra vista, con la salida normal de esa vista), abre el panel y pone el foco en su primer control. Es el camino para operar la sesión desde Ajustes o desde una vista del espacio de canción.

### Cerrar el reproductor
**Con pendientes** — diálogo `ses.cierre` (480 px) en la ventana **donde se pidió el cierre** (07 §"Cerrar el reproductor con cola"); si fue en la secundaria, el panel de la principal muestra `ses.cierre.esperando` (`role="status"`) y sus controles de sesión quedan inactivos hasta que se responda:
```
┌ Hay canciones en cola ─────────────────────────────────────────┐
│ Quedan 3 canciones pendientes. Si conservas la cola, podrás    │
│ seguir donde lo dejaste al volver a abrir el reproductor. La   │
│ cola se pierde al salir de Shinobi Karaoke.                     │
│                                                                │
│ [Cancelar] [Cerrar y eliminar cola] [Cerrar y conservar cola]  │
└────────────────────────────────────────────────────────────────┘
```
- Foco inicial en «Cancelar»; Esc = Cancelar. «Cerrar y conservar cola» es el primario; «Cerrar y eliminar cola», destructivo.
- Mientras está abierto, la canción sigue sonando y una cuenta en curso queda congelada en la secundaria. Si al confirmar main responde `CONFIRMACION_OBSOLETA` (la cola cambió entretanto, p. ej. terminó la canción), el diálogo actualiza el número de pendientes, muestra `ses.cierre.obsoleto` (`role="alert"`) y pide confirmar otra vez. Si al pedir el cierre ya no quedan pendientes, se cierra sin diálogo.
- Tras conservar: panel en P5 con la última reproducida seleccionada como contexto y el foco en «Abrir en otra pantalla…»; anuncio `ses.anuncio.conservada`. Tras eliminar: panel cerrado, toast `ses.toast.eliminada`, foco en el botón «Cola». Sin pendientes: panel en P6 vacío o cerrado si no hay nada, foco en «Abrir en otra pantalla…».

**Salir de la app con sesión o cola** — diálogo `ses.salir` desde la principal (cerrar la ventana, Ctrl/Cmd + Q, menú). Si además hay trabajos en curso, un solo diálogo: el de spec 04 (`cierre.*`) con la frase `ses.salir.extra` añadida. Foco en «Cancelar». Al confirmar, la secundaria se cierra sin el diálogo de cola. En macOS, cerrar la ventana principal **no** sale de la app: se usa la variante «macOS, cerrar ventana» (la secundaria se cierra y la cola se conserva, como en una caída); Cmd + Q usa la variante normal.

### Recuperación (lado de la principal)
Avisos en banner dentro del panel (bajo el estado de la pantalla), con el indicador en «⚠ Requiere atención»; si el panel está oculto, se abre sin mover el foco y se anuncia.

| Situación | Banner | Acciones |
|---|---|---|
| Se desconecta la pantalla de la secundaria (sigue sonando, en ventana, en la pantalla primaria; decisión del usuario en 0059 §1) | `aviso` `ses.rec.monitor` | [Mover a…] (menú con las pantallas; mueve y restaura pantalla completa) |
| Vuelve a estar conectada | `info` `ses.rec.vuelve` | [Llevar el reproductor allí] · ✕ |
| La secundaria se cerró o se cayó | `error` `ses.rec.caida`; panel en P5 | [Volver a abrir] (abre el diálogo de pantallas con la última elegida) · ✕ |
| La secundaria no responde | `aviso` `ses.rec.noResponde`; desaparece solo si vuelve a responder | [Esperar] (oculta el aviso; vuelve si sigue sin responder 10 s más) · [Cerrar y volver a abrir] (cierre forzado que conserva la cola como en una caída y abre el diálogo de pantallas) |
| Linux con Wayland | Sin banner de pantalla: las acciones que moverían la ventana se sustituyen por `ses.wayland` como información | — |
| La entrada conservada no se pudo reanudar | P3 dentro de la sesión recién abierta | [Pasar a la siguiente canción] / [Descartar] |
| No se pudo abrir | En el diálogo, `ses.error.*` | [Reintentar] |

Se usan banners en el panel y no toasts: el panel es el puesto del operador, los avisos no se apilan ni caducan y el indicador de la barra superior lleva hasta ellos desde cualquier vista.

### Estados nuevos
| Estado | Presentación |
|---|---|
| Sin sesión, sin cola | Como hoy, con «Abrir en otra pantalla…» y «Cola» (sin cifra). Panel cerrado. |
| Sin sesión, cola preparada | P6; tarjetas con `bib.cola.enCola`; «Reproducir» local disponible. |
| Abriendo | Diálogo con «Abriendo…». |
| Sesión: reproduciendo / pausa / cuenta / espera / fin / fallo | P1–P4; indicador con su texto. |
| Confirmando cierre en la secundaria | `ses.cierre.esperando` en el panel; controles de sesión inactivos. |
| Sin sesión, cola conservada | P5. |
| Biblioteca vacía | Sin «Abrir en otra pantalla…» ni «Cola» (nada que poner en cola). |

### Accesibilidad
- Panel `role="complementary"` con nombre `cola.titulo`; `h2` «Cola de reproducción», `h3` «En reproducción», «A continuación ({n})» y «Última reproducida».
- Anuncios `aria-live="polite"` en hitos: sesión abierta y cerrada, entrada que empieza («Suena «{título}».»), inicio de la cuenta y cambio de candidata (los mismos textos de 07), en espera, fin de la cola, cola conservada, reanudación, movimientos y altas en la cola. Nunca cada segundo de la cuenta ni del progreso. Fallos y caídas, `role="alert"`.
- Ninguna acción de la sesión tiene atajo de una sola tecla en la principal (evita pulsaciones accidentales durante un evento); todas son botones alcanzables con Tab.
- Las filas tienen nombre `cola.aria.fila`; el asa es decorativa (`aria-hidden`) y el arrastre siempre tiene equivalente de teclado y de menú.
- Foco: nunca queda en `body` cuando desaparece una fila, el bloque de la activa cambia de estado o se cierra el panel.

### Microcopy (fase 4, biblioteca)
| Clave | Texto |
|---|---|
| `ses.abrir` | Abrir en otra pantalla… (nombre accesible: Abrir el reproductor en otra pantalla…) |
| `ses.dialogo.titulo` | Abrir el reproductor en otra pantalla |
| `ses.dialogo.pantalla` | Pantalla |
| `ses.pantalla.opcion` | Pantalla {n} · {nombre} · {ancho} × {alto} · (sin nombre) Pantalla {n} · {ancho} × {alto} |
| `ses.pantalla.principal` | Principal · Aquí está esta ventana |
| `ses.pantalla.desaparecida` | La pantalla que habías elegido se desconectó. Elige otra. |
| `ses.unaPantalla` | Solo hay una pantalla conectada. El reproductor se abrirá en una ventana aparte; si conectas otra pantalla, aparecerá en esta lista. |
| `ses.completa` | Pantalla completa |
| `ses.completa.misma` | Cubrirá esta ventana. Para volver a ella usa Alt + Tab (Cmd + Tab en macOS), o pulsa F en el reproductor para verlo en una ventana. |
| `ses.audio` | El sonido sale por la salida de audio de tu equipo, no por la pantalla elegida. |
| `ses.empieza` | Empezará con «{título}» — {artista}. · (vacía) La cola está vacía. Añade canciones con «A la cola» y empieza cuando quieras. · (interrumpida) Seguirá «{título}» desde {mm:ss}. · (terminada) La última fue «{título}». Podrás empezar «{siguiente}» cuando quieras. · (terminada, sin pendientes) La última fue «{título}». La cola está vacía. · (con canción) Empezará con «{título}» — {artista}.[ Después seguirán las {n} canciones de la cola.][ «{interrumpida}» ya no seguirá desde {mm:ss}.] |
| `ses.wayland` | En este escritorio el sistema decide dónde se abre el reproductor. Arrástralo a la pantalla del público y pulsa F para verlo a pantalla completa. |
| `cola.pantalla.desconocida` | En otra ventana |
| `ses.error.guardando` | Aún se están guardando cambios de una canción. Espera un momento y vuelve a intentarlo. — [Reintentar] |
| `ses.error.noDisponible` | «{título}» ya no se puede reproducir. Elige otra canción. |
| `bib.menu.otraPantalla` | Reproducir en otra pantalla… |
| `ses.mover` | Mover a… (menú con las pantallas: Pantalla {n} · {nombre}) |
| `ses.bloqueo.nota` | Mientras el reproductor esté abierto no se podrán editar canciones. |
| `ses.boton.abrir` | Cancelar · Abrir reproductor · (cargando) Abriendo… |
| `ses.error.abrir` | No se pudo abrir el reproductor en esa pantalla. Vuelve a intentarlo o elige otra. — [Reintentar] |
| `ses.mostrar` | Mostrar |
| `ses.menu` | Más opciones del reproductor |
| `ses.cambiar` | Cambiar de pantalla… |
| `ses.ventana` | Pantalla completa · Ver en una ventana |
| `ses.cerrar` | Cerrar reproductor |
| `ses.ind` | En otra pantalla · En pausa · Siguiente en {n} s · En espera · Requiere atención · (sin sesión) Cola {n} |
| `ses.ind.aria` | Reproductor en otra pantalla: {estado}. Ir a la cola. · (sin sesión) Cola: {n} pendientes. Ir a la cola. |
| `ses.cierre` | Título: Hay canciones en cola · Cuerpo: Quedan {n} canciones pendientes. Si conservas la cola, podrás seguir donde lo dejaste al volver a abrir el reproductor. La cola se pierde al salir de Shinobi Karaoke. · (n = 1) Queda 1 canción pendiente. … — [Cancelar] [Cerrar y eliminar cola] [Cerrar y conservar cola] |
| `ses.cierre.esperando` | Esperando tu respuesta en la otra pantalla para cerrar el reproductor… |
| `ses.cierre.obsoleto` | La cola cambió mientras confirmabas. Revisa cuántas canciones quedan y elige otra vez. |
| `ses.anuncio.conservada` | Reproductor cerrado. La cola se ha conservado. |
| `ses.toast.eliminada` | Reproductor cerrado. Cola eliminada. |
| `ses.salir` | Título: ¿Salir de Shinobi Karaoke? · Cuerpo: El reproductor de la otra pantalla se cerrará y la cola se perderá. · (sin sesión, con cola) La cola se perderá. — [Cancelar] [Salir] · (macOS, cerrar ventana) Título: ¿Cerrar la ventana? · Cuerpo: El reproductor de la otra pantalla se cerrará. La cola se conservará mientras Shinobi Karaoke siga abierto. — [Cancelar] [Cerrar] |
| `ses.salir.extra` | (se añade a `cierre.cuerpo`) El reproductor de la otra pantalla se cerrará y la cola se perderá. |
| `ses.rec.monitor` | Se desconectó «{pantalla}». El reproductor sigue sonando en una ventana en «{pantalla nueva}». — [Mover a…] |
| `ses.rec.vuelve` | «{pantalla}» vuelve a estar conectada. — [Llevar el reproductor allí] |
| `ses.rec.caida` | El reproductor se cerró de forma inesperada. Se conservó la cola. · (con interrumpida) El reproductor se cerró de forma inesperada. Se conservó la cola y «{título}» seguirá desde {mm:ss}. — [Volver a abrir] |
| `ses.rec.noResponde` | El reproductor no responde. Si lo cierras, la cola se conserva. — [Esperar] [Cerrar y volver a abrir] |
| `cola.titulo` | Cola de reproducción |
| `cola.boton` | Cola {n} · (0) Cola — nombre accesible: Mostrar la cola ({n} pendientes) · Ocultar la cola |
| `cola.ocultar` | Ocultar |
| `cola.pantalla` | {Pantalla n} · {nombre} |
| `cola.modo` | Pantalla completa · En una ventana |
| `cola.activa` | En reproducción |
| `cola.pendientes` | A continuación ({n}) |
| `cola.ultima` | Última reproducida |
| `cola.ultima.interrumpida` | Se detuvo en {mm:ss}. Al abrir el reproductor, seguirá desde ahí. |
| `cola.ultima.terminada` | Terminó. Al abrir el reproductor podrás empezar la siguiente. |
| `cola.cerrado` | Reproductor cerrado |
| `cola.pausa` | Pausa · Reanudar |
| `cola.siguiente` | Siguiente |
| `cola.siguiente.no` | No hay canciones a continuación. |
| `cola.reiniciar` | Reiniciar canción |
| `cola.otraVez` | Agregar otra vez al final |
| `cola.termino` | Terminó «{título}» |
| `cola.cuenta` | Empieza en {n} s: «{título}» |
| `cola.empezarYa` | Empezar ya |
| `cola.detener` | Detener cuenta |
| `cola.espera` | En espera |
| `cola.iniciar` | Iniciar «{título}» |
| `cola.espera.vacia` | Añade una canción con «A la cola» para empezar. |
| `cola.fin` | La cola terminó. Si añades una canción, empezará tras la cuenta. O cierra el reproductor. · Última: {título} — {artista} — [Otra vez] |
| `cola.etiqueta.siguiente` | Siguiente |
| `cola.fallo.titulo` | No se puede reproducir «{título}» |
| `cola.causa` | (`no_encontrada`) Ya no está en la biblioteca. · (`no_lista`) Ya no está lista: volvió a borrador. · (`danada`, faltan pistas) Faltan sus pistas separadas. · (`danada`, no se puede leer `cancion.json`) No se puede abrir la canción. · (`lectura`, `decodificacion`) No se ha podido leer su audio. · (otro) Algo salió mal. |
| `cola.fallo.sinSiguiente` | No hay más canciones en la cola. |
| `cola.pasar` | Pasar a la siguiente canción |
| `cola.descartar` | Descartar |
| `cola.quitar` | Quitar de la cola |
| `cola.llena` | La cola está llena. Quita alguna canción para añadir más. |
| `cola.noDisponible` | ⚠ No disponible: {causa en minúscula} |
| `cola.menu` | Reproducir a continuación · Subir · Bajar · Mover al final · Agregar otra vez al final · Quitar de la cola |
| `cola.vaciar` | Vaciar… (nombre accesible: Vaciar las pendientes…) |
| `cola.dialogo.vaciar` | Título: ¿Quitar las {n} canciones pendientes? · Cuerpo: La canción que suena no se interrumpe. — [Cancelar] [Quitar pendientes] |
| `cola.eliminar` | Eliminar cola… |
| `cola.dialogo.eliminar` | Título: ¿Eliminar la cola? · Cuerpo: Se quitarán las {n} canciones pendientes[ y ya no se podrá seguir «{título}» desde {mm:ss}]. — [Cancelar] [Eliminar cola] |
| `cola.vacia` | No hay canciones pendientes. Usa «A la cola» en una canción lista para añadirla. |
| `cola.vacia.sinSesion` | La cola está vacía. Puedes prepararla antes de abrir el reproductor: usa «Agregar al final» en el menú ⋯ de una canción lista. |
| `cola.toast.final` | «{título}» se agregó al final de la cola (posición {p}). — [Deshacer] · (en espera sin candidata) — [▶ Iniciar ahora] [Deshacer] |
| `cola.toast.siguiente` | «{título}» sonará a continuación. — [Deshacer] |
| `cola.toast.cuenta` | (fin de la cola) «{título}» empieza en {n} s. — [Detener cuenta] |
| `cola.toast.quitada` | «{título}» se quitó de la cola. — [Deshacer] |
| `cola.anuncio.movida` | «{título}», posición {p} de {n}. |
| `cola.anuncio.empieza` | Suena «{título}», de {artista}. |
| `cola.aria.fila` | {p} de {n}: {título}, de {artista}, {duración}[, siguiente][, no disponible: {causa}] |
| `bib.cola.boton` | A la cola — nombre accesible: Agregar «{título}» al final de la cola |
| `bib.menu.cola` | Reproducir a continuación · Agregar al final |
| `bib.cola.sonando` | ▶ Sonando en la otra pantalla |
| `bib.cola.enCola` | En la cola |
| `bib.cola.activaBloqueada` | Se está reproduciendo en la otra pantalla. |
| `bib.cola.dialogo.eliminar` | (se añade al texto de eliminar) También se quitará de la cola. |
| `bib.cola.dialogo.borrador` | (se añade al texto de volver a borrador) Está en la cola: no se podrá reproducir hasta que la marques como lista otra vez. |

### Criterios de aceptación de la fase 4 (biblioteca)
- S1. «Abrir en otra pantalla…» lista todas las pantallas con número, nombre (si lo hay), resolución y la marca «Principal · Aquí está esta ventana»; preselecciona la última usada o la primera no principal; con una sola pantalla muestra `ses.unaPantalla` y «Pantalla completa» desmarcada. Desconectar la pantalla elegida con el diálogo abierto cambia la selección y lo anuncia. La elección y la casilla se recuerdan al reiniciar.
- S2. Si la secundaria no se puede abrir, el diálogo sigue abierto con la selección, muestra `ses.error.abrir` y [Reintentar] lo vuelve a intentar.
- S3. Con la sesión abierta, el panel muestra P1 con la canción activa, progreso de solo lectura actualizado ≥ 1 vez por segundo y [Pausa] [Siguiente] [Reiniciar]; la secundaria responde a cada uno sin que la principal suene.
- S4. «Reproducir a continuación» coloca la entrada en la posición 1 de pendientes y «Agregar al final» en la última, sin interrumpir la activa; la misma canción añadida dos veces aparece como dos filas; [Deshacer] del toast quita solo esa entrada.
- S5. Reordenar por arrastre y por teclado (Alt + ↑/↓, Alt + Inicio/Fin) y desde el ⋯ produce el mismo orden, mantiene el foco en la fila movida, anuncia `cola.anuncio.movida` y no interrumpe la activa. Esc durante el arrastre lo cancela.
- S6. Quitar una pendiente (⋯, Supr) la quita sin confirmación, deja el foco en la fila siguiente (o anterior, o el encabezado) y [Deshacer] la devuelve a su posición.
- S7. Durante la cuenta, el panel muestra P2 con la candidata y el número sincronizado con la secundaria (± 1 s); «Detener cuenta» pasa a P4 y la secundaria a S2; «Empezar ya» la empieza al momento.
- S8. En espera, añadir una canción no la empieza: aparece [▶ Iniciar «{título}»] en el panel y en el toast; pulsarlo la empieza con su pantalla de título. En fin de la cola, añadir una canción empieza la cuenta configurada: el panel pasa a P2 y el toast es `cola.toast.cuenta`; [Detener cuenta] (panel o toast) lleva a espera y [Empezar ya] la empieza al momento.
- S9. Con una entrada fallida, P3 muestra el título y la causa correcta para cada caso (borrada, vuelta a borrador, sin pistas, audio ilegible); nada avanza hasta [Pasar a la siguiente canción] (que empieza la cuenta de la siguiente) o, sin pendientes, [Descartar]. Una pendiente vuelta a borrador muestra `cola.noDisponible` en su fila antes de llegar su turno.
- S10. Durante la sesión, las tarjetas Lista muestran «A la cola» en lugar de «Reproducir» y su portada agrega al final; «Editar» y «Continuar» hacia Letra o Editor muestran el diálogo de bloqueo; Eliminar y Volver a borrador de la canción activa están `aria-disabled` con `bib.cola.activaBloqueada`; Editar datos, Aplicar tema y Añadir canción funcionan.
- S11. Eliminar una canción pendiente avisa con `bib.cola.dialogo.eliminar` y quita todas sus entradas de la cola.
- S12. Cerrar con pendientes desde la principal o la secundaria muestra una sola vez `ses.cierre` en la ventana donde se pidió, con el foco en «Cancelar» (pedido en la secundaria, la principal muestra `ses.cierre.esperando`); si la cola cambia antes de confirmar, aparece `ses.cierre.obsoleto` y hay que confirmar otra vez; «Cerrar y conservar cola» deja P5 con la última reproducida y su segundo, y el foco en «Abrir en otra pantalla…»; «Cerrar y eliminar cola» vacía la cola y cierra el panel; sin pendientes, cerrar no pide confirmación.
- S13. Salir de la app con sesión o con cola pide `ses.salir` (o el diálogo de trabajos con `ses.salir.extra`); al volver a abrir la app la cola está vacía.
- S14. El indicador de sesión aparece con sesión o cola, muestra el estado correcto en cada caso y lleva a la Biblioteca con el panel abierto y el foco dentro, desde Ajustes y desde una vista del espacio de canción.
- S15. Recuperación: desconectar la pantalla de la secundaria muestra `ses.rec.monitor` sin cortar el audio, y [Mover a…] la lleva a otra pantalla; reconectarla, `ses.rec.vuelve` con [Llevar el reproductor allí]; terminar el proceso de la secundaria muestra `ses.rec.caida` con la cola conservada y [Volver a abrir], y libera el bloqueo de edición; con la secundaria sin responder (simulada), `ses.rec.noResponde`; [Cerrar y volver a abrir] la cierra conservando la cola y abre el diálogo de pantallas.
- S15b. «Reproducir en otra pantalla…» del ⋯ de una Lista abre el diálogo con la variante «con canción» de `ses.empieza`; al abrir, esa canción suena primero y las pendientes siguen detrás. En Linux con Wayland el diálogo muestra `ses.wayland` sin lista de pantallas.
- S16. Todo el panel es operable solo con teclado y ninguna acción de sesión tiene atajo de una tecla en la principal; el foco nunca queda en `body`.
- S17. A 1024 × 576 (1280 × 720 al 125 %) con el panel abierto, la rejilla muestra 2 columnas, el panel tiene scroll propio y no hay scroll horizontal.
- S18. Capturas en `docs/ux/revisiones/fase-4/` con nombre `biblioteca-{ancho}x{alto}-{escala}-{estado}.png` a 1280 × 800 al 100 % y 1280 × 720 al 125 %: `dialogo-pantalla`, `dialogo-una-pantalla`, `sesion`, `cuenta`, `fallo`, `espera`, `fin-cola`, `cola-conservada`, `dialogo-cierre`, `monitor-desconectado`, `caida`, `tarjetas-sesion`.

## Fase 5 de 0.2.0 — estilo, espera y Letra lista

Origen: [plan, fase 5, feature 12](../versiones/0.2.0/plan-2.md#12-letra-lista--m) y [0048](../preguntas/0048-escucha-editor-durante-evento.md) («Biblioteca distingue «Letra lista» y permite abrirla y encolarla»). Cómo se marca: [06 · Fase 5 · LL](06-editor.md#ll--letra-lista-feature-12). Cómo se reproduce: [07 · Modo Letra lista](07-reproductor.md#modo-letra-lista). Esta sección **amplía** la vista; los degradados con movimiento y los indicadores de espera no cambian la Biblioteca (las portadas pintan el fondo **quieto, en fase 0**).

**Concepto.** «Letra lista» es una canción **Lista** que se reproduce sin barrido. A efectos de la Biblioteca es una Lista más: mismo filtro, mismas acciones, misma cola y mismo panel de la sesión. Solo cambian la insignia, su nombre accesible y el toast al marcarla.

### Tarjeta
```
┌──────────────────────────┐
│ PORTADA 16:9      ( ▶ )  │  igual que una Lista
├──────────────────────────┤
│ Despacito                        │
│ Luis Fonsi · 3:48                │
│ ◐ Neón · del artista             │
│ (▤ Letra lista)             [⋯]  │  ← insignia: icono `captions` + texto, colores de `exito`
│ [▶ Reproducir]                   │
└──────────────────────────┘
```
| Elemento | Comportamiento |
|---|---|
| **Insignia** | `bib.estado.letraLista` «Letra lista» con icono `captions` 14 px, fondo `exito-tenue` y texto `exito` (es un estado terminado, como Lista; el icono y el texto la distinguen, no el color). `title` con `bib.estado.letraLista.ayuda`. |
| **Filtro** | Cuenta y aparece en **Listas** (y en Todas). El control segmentado no cambia. |
| **Acción principal, portada, Intro** | Iguales que en una Lista: «▶ Reproducir» sin sesión; «A la cola» con sesión (fase 4). |
| **Menú ⋯** | El mismo que el de una Lista (Reproducir, Reproducir en otra pantalla…, Reproducir a continuación, Agregar al final, Editar, Editar datos, Aplicar tema…, Volver a borrador, Mostrar en la carpeta, y lo que añada la fase 6, Eliminar…). El cambio entre Lista y Letra lista se hace en el editor (menú ⋯ de la cabecera), no aquí **(provisional, [0110](../preguntas/0110-decisiones-provisionales-de-ux-de-la-fase-5.md) §3)**. |
| **Letra lista incompleta** | Como una Lista incompleta: insignia sin cambios y la línea `bib.lista.incompleta` debajo. |
| **Volver a borrador** | Mismo diálogo `bib.dialogo.borrador`. Al volver a terminarla, el usuario elige otra vez entre «Marcar como lista» y «Marcar como letra lista». |
| **Selección múltiple, Aplicar tema…, tema de grupo** | Sin cambios: la modalidad no es parte del tema y aplicar un tema no la toca. |
| **Cola y sesión** | Sin cambios: se encola y se reproduce como cualquier Lista; la secundaria la muestra sin barrido. Las filas de la cola no llevan marca propia. |
| **Lectores de pantalla** | `bib.aria.tarjeta` usa como estado `bib.aria.letraLista` («Letra lista, sin barrido»). |

### Al volver del editor tras «Marcar como letra lista»
Igual que tras «Marcar como lista» (spec 06 §«Volver a la Biblioteca»: filtro, foco, desplazamiento y resalte de 2 s con borde `exito`), con el toast `bib.toast.letraLista` y su [▶ Reproducir].

### Microcopy (fase 5, biblioteca)
| Clave | Texto |
|---|---|
| `bib.estado.letraLista` | Letra lista |
| `bib.estado.letraLista.ayuda` | Se reproduce con la letra sincronizada por líneas, sin barrido. |
| `bib.aria.letraLista` | Letra lista, sin barrido |
| `bib.toast.letraLista` | «{título}» tiene la letra lista para cantar. — [▶ Reproducir] |

### Criterios de aceptación de la fase 5 (biblioteca)
- LB1. Una canción marcada como letra lista muestra la insignia «Letra lista» con icono y texto, distinta de «✓ Lista», cuenta en el filtro *Listas* y su nombre accesible dice «Letra lista, sin barrido».
- LB2. Su acción principal, la portada, Intro y el menú ⋯ son los de una Lista; «▶ Reproducir» abre el reproductor sin barrido y, con sesión, «A la cola», «Reproducir a continuación» y «Agregar al final» la encolan.
- LB3. Tras «Marcar como letra lista» en el editor, la Biblioteca enfoca y resalta la tarjeta (filtro a *Todas* si estaba en *Borradores*) y muestra `bib.toast.letraLista`, cuyo [▶ Reproducir] abre el reproductor.
- LB4. La modalidad persiste al reiniciar la app; «Volver a borrador» y «Aplicar tema…» no la cambian por sí solos (tras volver a borrador, la insignia es «✎ Borrador»).
- LB5. Una Letra lista con líneas sin inicio muestra `bib.lista.incompleta` y sigue en *Listas*.
- LB6. Las portadas de canciones con fondo en movimiento se ven quietas (fase 0).
- LB7. Captura `docs/ux/revisiones/0.2.0-fase-5/biblioteca-1280x800-100-letra-lista.png` con una Lista, una Letra lista, una Letra lista incompleta y un borrador.

## Fase 6 de 0.2.0 — exportación

Origen: [plan, fase 6, feature 7](../versiones/0.2.0/plan-2.md#fase-6--exportación) y [0050](../preguntas/0050-perfiles-y-concurrencia-exportacion.md). Diálogo, progreso, errores, marca de agua y criterios completos: [10 · Exportar a video](10-exportacion.md). Esta sección solo define **cómo se llega desde la Biblioteca** y qué muestra la tarjeta; lo no mencionado sigue igual.

### Menú ⋯ de la tarjeta
| Tarjeta | Cambio |
|---|---|
| Lista (también «Letra lista» e incompleta) | Nuevo ítem **«Exportar video…»** (`exp.menu`, icono `film`) después de «Editar datos» y antes de «Aplicar tema…». Abre el diálogo de spec 10 (A). Con una exportación de esa canción en curso o en cola, el ítem es **«Ver exportación»** y además aparece **«Cancelar exportación…»** (antes del separador de los destructivos), que abre `exp.dialogo.cancelar` (en cola: retira sin confirmación). |
| Borrador | Sin «Exportar video…» (la exportación de un borrador solo se ofrece desde el editor, spec 06 · Fase 6). Si el borrador se está exportando (lanzado desde el editor): «Ver exportación» y «Cancelar exportación…». |
| Dañada | Sin cambios. |
| Durante una sesión en otra pantalla | Igual que sin sesión, **sin candado**: exportar y la sesión conviven ([ADR 0019](../adr/0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) §9). El diálogo de spec 10 muestra la nota `exp.nota.sesion`. |

No hay botón de exportar en la tarjeta ni atajo propio: la acción principal sigue siendo «▶ Reproducir» (o «A la cola» durante la sesión).

### Línea de la tarjeta
- Con una exportación en curso, bajo la insignia: `bib.exp.linea` («⟳ Exportando video 42 % · quedan unos 5 min», color `info`) con barra de 6 px, como la línea de paso de un borrador. En cola: `bib.exp.cola` («🕒 En cola para exportar»). Durante «Preparar» y «Terminar el archivo», «⟳ Exportando video…» con barra indeterminada.
- En una Lista, es la única línea de paso; en una Lista incompleta, va **debajo** de `bib.lista.incompleta`. En un borrador, la separación o la descarga activas tienen prioridad; si no hay otra, se muestra la de exportación en lugar de «Falta…».
- No hay acción en la línea: se ve el detalle con «Ver exportación» del ⋯ o con [Ir] del panel de actividad.
- Al terminar (bien, mal o cancelada) la línea desaparece; el resultado se comunica con el toast de spec 10. La tarjeta **no** se reordena ni cambia de estado: exportar no modifica la canción.
- `bib.aria.tarjeta` incluye la línea de exportación como línea de paso.

### Panel de actividad e indicador
- Las exportaciones aparecen en el panel de actividad (spec 04 §2) como un trabajo más: «{título} — Exportando video 42 %» con barra y tiempo, [Ir] (abre el diálogo de spec 10 en su estado) y [✕] (cancelar con `exp.dialogo.cancelar`; en cola, sin confirmación). Textos `act.exp`.
- Cuentan en «{n} en curso · {m} en cola» del indicador de actividad.

### Eliminar y volver a borrador
- **Eliminar…** de una canción que se está exportando o espera en cola: el diálogo añade `exp.eliminar.extra`; al confirmar se cancela la exportación con limpieza y después se mueve a la papelera.
- **Volver a borrador**: permitido; la exportación sigue (usa una instantánea).

### Abrir el reproductor en otra pantalla con una exportación en curso
El diálogo «Abrir el reproductor en otra pantalla» **no cambia**: la sesión se abre normalmente y las exportaciones en curso y en cola siguen sin pausarse ([ADR 0019](../adr/0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) §9). No hay banner ni botón «Cancelar la exportación y abrir»; el punto 4 de [0130](../preguntas/0130-decisiones-de-producto-de-la-exportacion.md) queda sin efecto.

### Microcopy (fase 6, biblioteca)
Las claves `exp.*`, `bib.exp.*` y `act.exp` están en [spec 10 · Microcopy](10-exportacion.md#microcopy). Únicas nuevas de esta vista:
| Clave | Texto |
|---|---|
| `bib.menu.exportar` | Exportar video… · Ver exportación · Cancelar exportación… |

### Criterios de aceptación de la fase 6 (biblioteca)
- X1. El ⋯ de una Lista (también «Letra lista» e incompleta) muestra «Exportar video…» entre «Editar datos» y «Aplicar tema…»; el de un borrador o una Dañada no lo muestra.
- X2. Con una exportación de esa canción en curso o en cola, el ⋯ muestra «Ver exportación» (abre el diálogo en su estado) y «Cancelar exportación…» (confirma en curso; en cola retira sin confirmar).
- X3. La tarjeta muestra `bib.exp.linea` con porcentaje y tiempo actualizados ≥ 1 vez cada 2 s sin mover el foco ni reordenarse, o `bib.exp.cola` en cola; al terminar la línea desaparece y el estado de la canción no cambia.
- X4. El panel de actividad lista la exportación con [Ir] y [✕] y la cuenta en el indicador.
- X5. Eliminar una canción que se exporta muestra `exp.eliminar.extra` y, al confirmar, no queda temporal en el disco.
- X6. Durante una sesión, «Exportar video…» está disponible sin candado y el diálogo muestra `exp.nota.sesion`; con una exportación en curso, el diálogo de pantallas no cambia y, al abrir la sesión, la exportación sigue.
- X7. Captura `docs/ux/revisiones/fase-6/exportacion-1280x800-100-tarjeta-exportando.png` (tarjeta con la línea y el ⋯ abierto).

## Fase 8 de 0.2.1 — estados y fecha de añadido

Origen: [plan 0.2.1, fase 8](../versiones/0.2.1/plan-3.md#fase-8--sincronía-y-editor-más-simples), puntos 6 y 7, y palabras del usuario: «el estado de letra lista debe tener el botón de reproducir o editar» y «Agregar Agrupar por "Fecha de añadido" (si la estructura no es compatible simplemente asignar la fecha default y dejar en sin agrupar)». Editor: [06 · Fase 8](06-editor.md#86--estados-y-acciones-dock-pestaña-funciones-y-menú-). Contrato de la fecha: [0145](../preguntas/0145-contratos-de-las-fases-8-y-9-para-las-specs.md) §7. Decisiones provisionales: [0147](../preguntas/0147-decisiones-provisionales-de-ux-de-0-2-1.md). Esta sección **amplía** la vista.

**Sustituye**: la fila «Lista» de «Estados» y la de «Acción principal, portada, Intro» de la tarjeta de la fase 5 (se añade «Editar»), la anatomía de la tarjeta (fila de acciones), la fila «Agrupar por» de la barra de herramientas de la fase 3 (cuarta opción) y la clave `bib.agrupar`.

### Tarjeta Lista y Letra lista: «Reproducir» y «Editar»

```
┌──────────────────────────┐
│ PORTADA 16:9      ( ▶ )  │
├──────────────────────────┤
│ Despacito                        │
│ Luis Fonsi · 3:48                │
│ ◐ Neón · del artista             │
│ (▤ Letra lista)             [⋯]  │
│ [▶ Reproducir]  [✎ Editar]       │  ← dos botones en una fila
└──────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| **Dónde** | Tarjetas **Lista** y **Letra lista**, también las incompletas **(decisión provisional, [0147](../preguntas/0147-decisiones-provisionales-de-ux-de-0-2-1.md) §6: el usuario lo pidió para Letra lista; se aplica también a Lista porque las dos son el mismo estado y su tarjeta debe ser igual)**. Borradores (Continuar / Reintentar) y Dañadas: sin cambios. |
| **▶ Reproducir** | Sin cambios (secundario con icono; con sesión, «A la cola»). Sigue siendo la acción de Espacio y la de la portada e Intro. |
| **✎ Editar** | Botón **fantasma** con icono `pencil` a la derecha de «Reproducir». Abre el Editor como «Editar» del menú ⋯ (que se mantiene). Durante una sesión en otra pantalla: `aria-disabled` con el candado y el diálogo `edi.bloqueo` (fase 4). |
| **Ancho** | Los dos botones caben en una fila desde la tarjeta mínima (240 px): «▶ Reproducir» y «✎ Editar» miden juntos ≈ 200 px con 8 px de separación. Con la línea de exportación o de incompleta, van debajo de ella. |
| **Teclado** | Con la tarjeta enfocada: **Intro** = portada (reproducir), **Espacio** = Reproducir (o «A la cola»), **E** = Editar (nuevo; solo en Lista y Letra lista; durante la sesión abre `edi.bloqueo`). Los botones también se alcanzan con el puntero y desde el menú ⋯. |
| **Modo selección** | Los dos botones se ocultan, como la acción principal hoy. |
| **Lectores de pantalla** | `bib.aria.tarjeta` no cambia; el botón tiene el nombre `bib.accion.editar.aria` y `aria-keyshortcuts="E"`. |

### Agrupar por «Fecha de añadido»

```
≥ 1280 px
│ [Todas 12|Listas 7|Borradores 5]  Agrupar por [Sin agrupar|Artista|Álbum|Fecha de añadido]  [☑ Seleccionar]  [🔍 …] │

│ ▾ Hoy  ·  2 canciones                                                   │
│ ┌──────┐ ┌──────┐                                                       │
│ ▾ Ayer  ·  1 canción                                                    │
│ ▾ Esta semana  ·  3 canciones                                           │
│ ▾ Este mes  ·  4 canciones                                              │
│ ▾ Octubre de 2026  ·  6 canciones                                       │
│ ▾ Diciembre de 2025  ·  1 canción                                       │
│ ▾ Sin agrupar  ·  1 canción          No tienen fecha de añadido válida. │
```

| Aspecto | Regla |
|---|---|
| **Opción** | Cuarta opción del control segmentado «Agrupar por»: «Fecha de añadido». Se guarda en `config.biblioteca.agrupar` como `"fecha"` (mismas reglas de la fase 3: global, valor no válido → «Sin agrupar»). Por debajo de 1280 px, el control sigue en la segunda fila. |
| **Fecha que usa** | `creada` de la canción (cuándo se añadió), en la **hora local** del equipo. |
| **Grupos** | En este orden, de más reciente a más antiguo; solo se muestran los que tienen canciones: **Hoy** (el día de calendario de hoy) · **Ayer** · **Esta semana** (desde el lunes de esta semana, sin hoy ni ayer) · **Este mes** (desde el día 1 del mes actual, sin lo anterior) · **un grupo por mes y año** para todo lo anterior («Octubre de 2026», «Diciembre de 2025»), también de años anteriores · **Sin agrupar** al final. |
| **Solapes** | Cada canción va a un único grupo: el primero de la lista que la contiene. Si «Ayer» o «Esta semana» caen en el mes anterior, mandan ellos; el mes anterior recibe el resto de sus días. |
| **Sin fecha válida** | Una canción sin `creada` válida (ausente, ilegible o la fecha por defecto que main asigna a esas canciones) va al grupo **«Sin agrupar»**, con la explicación `bib.grupo.sinFecha.ayuda` en el lugar del tema del grupo **(decisión provisional, 0147 §7: es el nombre que usó el usuario; la explicación evita confundirlo con la opción del control)**. La interfaz no escribe ninguna fecha: main lee esas canciones con la fecha por defecto (`CREADA_POR_DEFECTO`) sin escribir nada y el resumen trae **`creada: null`**, que es lo que manda la canción a este grupo ([0145](../preguntas/0145-contratos-de-las-fases-8-y-9-para-las-specs.md) §7). Las 18 canciones actuales ya la tienen. |
| **Fecha futura** | Una `creada` posterior al momento actual (reloj del equipo cambiado) cuenta como **Hoy**. |
| **Orden dentro del grupo** | Por `creada`, de la más reciente a la más antigua (en las demás agrupaciones sigue siendo `modificada`). En «Sin agrupar», por `modificada`. |
| **Cambio de día** | Los grupos se calculan al mostrar la vista; si la app sigue abierta al pasar la medianoche, se recalculan la próxima vez que se vuelve a la vista (regla de «no reordenar bajo el cursor»). |
| **Encabezado** | Como los de la fase 3 (`h2`, plegable, recuento, «{v} de {n}» con búsqueda o filtro), **sin** tema de grupo ni [Tema…] (una fecha no admite tema). |
| **Búsqueda, filtro, selección, plegado, teclado** | Como en las demás agrupaciones: solo grupos con coincidencias, casilla tri-estado en modo selección, plegado por sesión, *roving tabindex* entre grupos. |
| **Canción nueva** | Aparece en «Hoy» (o lo crea arriba) sin reordenar el resto hasta volver a la vista. |
| **Editar datos** | No cambia la fecha: la tarjeta no se mueve. |

### Microcopy (fase 8, biblioteca)
| Clave | Texto |
|---|---|
| `bib.agrupar` | Agrupar por · Sin agrupar · Artista · Álbum · Fecha de añadido |
| `bib.grupo.fecha.hoy` | Hoy |
| `bib.grupo.fecha.ayer` | Ayer |
| `bib.grupo.fecha.semana` | Esta semana |
| `bib.grupo.fecha.mes` | Este mes |
| `bib.grupo.fecha.mesAnio` | {Mes} de {año} (mes con mayúscula inicial: «Octubre de 2026») |
| `bib.grupo.sinFecha` | Sin agrupar |
| `bib.grupo.sinFecha.ayuda` | No tienen fecha de añadido válida. · (n = 1) No tiene fecha de añadido válida. |
| `bib.accion.editar` | Editar |
| `bib.accion.editar.aria` | Editar «{título}» |

### Criterios de aceptación de la fase 8 (biblioteca)
- B8-1. Las tarjetas Lista y Letra lista (también incompletas) muestran «▶ Reproducir» y «✎ Editar» en una fila desde 240 px de ancho; «Editar» abre el editor de esa canción; E con la tarjeta enfocada hace lo mismo; los borradores y las Dañadas no cambian.
- B8-2. Durante una sesión en otra pantalla, «Editar» y E muestran `edi.bloqueo` y no navegan; «A la cola» sigue en el lugar de «Reproducir». En modo selección no se ven los botones.
- B8-3. «Agrupar por» ofrece cuatro opciones; «Fecha de añadido» se conserva al volver de otra vista y al reiniciar.
- B8-4. Con el reloj simulado el miércoles 2026-11-18 a las 10:00 y canciones creadas el 18-11, el 17-11, el 16-11 (lunes), el 03-11, el 20-10, el 15-12-2025 y una sin `creada` válida, los grupos son exactamente Hoy (1), Ayer (1), Esta semana (1), Este mes (1), Octubre de 2026 (1), Diciembre de 2025 (1) y Sin agrupar (1), en ese orden (test unitario de la función de agrupación). Con el reloj el lunes 2026-11-02 (la semana empieza ese día), una canción del 01-11 va a «Ayer» y una del 31-10 a «Octubre de 2026»; no aparece «Esta semana».
- B8-5. Dentro de un grupo por fecha las tarjetas van por `creada` descendente; los encabezados no tienen [Tema…]; la búsqueda y el filtro ocultan los grupos sin coincidencias y muestran «{v} de {n}».
- B8-6. El grupo «Sin agrupar» va al final con `bib.grupo.sinFecha.ayuda`; una `creada` futura cuenta como «Hoy».
- B8-7. Captura `docs/ux/revisiones/0.2.1-fase-8/biblioteca-1280x800-100-fecha.png` con al menos cuatro grupos de fecha y una tarjeta Lista y una Letra lista con sus dos botones.

## 0.2.2 · Feature 8 — Acciones por lotes en la Biblioteca

Origen: [plan 0.2.2, feature 8](../versiones/0.2.2/plan-4.md) y propuesta [028](../propuestas/028-acciones-por-lotes-en-la-biblioteca.md), que reactiva la [006](../propuestas/006-exportar-varias-canciones-a-video.md). Exportar varias canciones a video: [10 · 0.2.2 · Feature 8](10-exportacion.md#022--feature-8--exportar-varias-canciones). Depende de la feature 5 («Preparar» y el estado «Lista para revisar», que define otro diseñador en esta misma spec y en la 04) y comparte menú con la feature 9 (paquete y letra, más abajo). Contratos pendientes: [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md). Decisiones provisionales: [0158](../preguntas/0158-decisiones-provisionales-de-ux-de-las-features-8-a-11.md). Esta sección **amplía** la selección múltiple de la [fase 3](#selección-múltiple-y-aplicar-tema); lo no mencionado sigue igual.

**Sustituye**: el wireframe de la barra del «Modo selección» y la fila «Aplicar tema…» de su tabla (la barra tiene más acciones), el texto de `bib.sel.noEditable`, y el significado de **Supr** mientras dura el modo selección.

### Barra de selección

```
≥ 1280 px (una fila)
│ ☑ 5 seleccionadas · 1 fuera de la vista  [⚙ Preparar (2 de 5)] [Aplicar tema…] [Más acciones ▾]   [Seleccionar visibles] [Quitar selección] [Terminar] │

< 1280 px (dos filas)
│ ☑ 5 seleccionadas · 1 fuera de la vista      [⚙ Preparar (2 de 5)] [Aplicar tema…] [Más acciones ▾] │
│                                       [Seleccionar visibles] [Quitar selección] [Terminar] │

Menú «Más acciones»
┌──────────────────────────────────┐
│ ☰ A la cola (3 de 5)             │
│ 🎞 Exportar video… (3 de 5)       │
│ ▣ Exportar paquete…              │  feature 9
│ ♪ Exportar la letra (.lrc)… (4 de 5) │  feature 9
│ ✎ Editar datos…                  │
│ ──────────────────────────────── │
│ 🗑 Eliminar…                      │  destructivo
└──────────────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| **Preparar** | Botón secundario con icono `wand-sparkles`. Lanza la preparación desatendida (feature 5) en las seleccionadas a las que aplica. Va a la vista porque es la acción que más trabajo quita (**decisión provisional**). |
| **Aplicar tema…** | Sin cambios (fase 3). |
| **Más acciones** | Botón secundario con chevron que abre un menú (`role="menu"`; ↑/↓, Inicio/Fin, Intro, Esc devuelve el foco al botón). Orden del wireframe; «Eliminar…» al final, tras un separador, en color `error` con icono. |
| **Recuento en cada acción** | Si la acción vale para **todas** las seleccionadas, su texto no lleva cifra. Si vale para una parte: «({a} de {n})». Si no vale para ninguna: `aria-disabled` (enfocable) con el motivo `bib.acc.ninguna.*` en tooltip y `aria-describedby`. Sin selección, todas inactivas con `bib.sel.ninguna`. Una acción **no** se desactiva porque alguna canción no aplique. |
| **Ancho** | A 1024 px con el panel de cola abierto, la primera fila cabe sin partirse: contador, «Preparar», «Aplicar tema…» y «Más acciones». Si aun así no cabe (textos largos con recuento), «Aplicar tema…» pasa al principio del menú. |

### A qué canciones aplica cada acción

La decisión la da main para cada canción en el momento de abrir la confirmación; la tabla es lo que el usuario ve.

| Acción | Aplica a | No aplica a (motivo que se muestra) |
|---|---|---|
| Preparar | Borradores a los que les falta algún paso que la preparación puede hacer sola (descargar, separar, buscar la letra, comprobarla, ajustar los fines) | Listas y Letra lista (`bib.acc.motivo.yaLista`) · borradores ya «Lista para revisar» (`…yaPreparada`) · canciones que ya se están preparando o esperan en cola (`…enCurso`) · Dañadas (`…danada`) |
| A la cola | Listas y Letra lista, también incompletas | Borradores y Dañadas (`…noLista`) |
| Exportar video… | Listas y Letra lista, también incompletas | Borradores (`…noLista`) · canciones que ya se están exportando (`…exportando`) · Dañadas |
| Exportar paquete… (feature 9) | Todas las que se pueden seleccionar | — |
| Exportar la letra (.lrc)… (feature 9) | Canciones con al menos una línea con inicio | Sin letra o sin ninguna línea sincronizada (`…sinTiempos`) |
| Editar datos… | Todas las que se pueden seleccionar | — |
| Eliminar… | Todas las que se pueden seleccionar | La canción que suena en la otra pantalla (`bib.cola.activaBloqueada`) |

- Las **Dañadas con `cancion.json` ilegible** siguen sin poder seleccionarse (fase 3): se eliminan o reparan desde su menú ⋯ **(decisión provisional)**. Cambia su tooltip (`bib.sel.noEditable`), que ya no habla solo de temas.
- **Durante una sesión en otra pantalla**: todas las acciones siguen disponibles (preparar es trabajo en segundo plano, no edición; el editor sigue bloqueado). «Eliminar…» excluye la canción activa.

### Reglas comunes

1. **Confirmación con lista.** Toda acción (salvo «A la cola») abre un diálogo de 560 px con la lista completa de seleccionadas, ordenada como en la Biblioteca sin agrupar, con una nota por canción y scroll propio hasta 280 px. Las que no aplican aparecen al final, atenuadas (`texto-3`), con su motivo; no son un error.
2. **El botón dice a cuántas afecta** («Preparar 2 canciones»). Con 0 está inactivo con su motivo.
3. **Lotes cortos** (editar datos, eliminar, exportar la letra): el diálogo pasa a «{verbo}… {i} de {n}», no se cierra con Esc hasta terminar y acaba en el **resultado por canción** de «Aplicar tema…» (✓ hecho, – omitida con su motivo, ✕ error con [Copiar detalles]). Si todo fue bien, el diálogo se cierra solo y sale un toast; el resultado solo se muestra si hubo algo omitido o fallido.
4. **Trabajos largos**: no esperan con un diálogo abierto. «Preparar» mete las canciones en la **cola de preparación** de la feature 7 ([04 · 0.2.2 · Feature 7](04-progreso-pipeline.md#022--feature-7--cola-de-preparación-de-un-lote)), con su progreso global, su pausa y su resumen final. «Exportar video…» usa la cola de exportación con su propio diálogo de lote (spec 10). «Exportar paquete…» es un solo trabajo (feature 9). Los tres se siguen en las tarjetas y en el panel de actividad.
5. **Lo hecho queda hecho.** Un fallo en una canción no deshace las anteriores ni detiene las siguientes, salvo las excepciones que cada acción indica.
6. **Al terminar o al encolar** se sale del modo selección y el foco va a «Seleccionar». Con fallos en un lote corto, se sigue en el modo con las fallidas seleccionadas y el foco en la acción (como en la fase 3).
7. **`CONFIRMACION_OBSOLETA`**: si la selección cambió entre abrir el diálogo y confirmar (una canción se eliminó, cambió de estado), la lista se actualiza con `tema.obsoleto` y hay que confirmar otra vez.

### Preparar

```
┌ Preparar 2 canciones ────────────────────────────────────────┐
│ Shinobi Karaoke hará sola lo que falta en cada una: separar  │  `bib.acc.preparar.explicacion`
│ las pistas, buscar la letra, comprobarla con la voz y        │
│ ajustar los fines. Quedarán como «Lista para revisar».       │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Semestre de Otoño — Artista                              │ │
│ │   Buscará la letra                                       │ │
│ │ Cursiva la Letra — Artista                               │ │
│ │   Separará las pistas y buscará la letra                 │ │
│ │ Bohemian Rhapsody — Queen                                │ │  atenuadas
│ │   Ya está lista: no se prepara                           │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ⓘ Para buscar la letra se envían el título y el artista de   │  `bib.acc.preparar.privacidad`
│   cada canción a LRCLIB.                                     │
│                         [Cancelar] [Preparar 2 canciones]    │
└──────────────────────────────────────────────────────────────┘
```

| Aspecto | Comportamiento |
|---|---|
| Qué hace | Lo mismo que «Preparar» de una sola canción (feature 5), una tras otra, en las colas de trabajos que ya existen. **No** sustituye una letra ya elegida ni tiempos ya puestos: cada canción continúa desde su primer paso pendiente. |
| Nota por canción | La calcula main: `bib.acc.preparar.nota.*` según lo que le falte (descargar, separar, letra, fines). |
| **Canciones con letra sin marca** (`prepararFinesSinMarca`, revisión 2026-11-22) | Entran en el lote con la nota `bib.acc.preparar.nota.finesSinMarca` y solo recibirán los fines que faltan. Si hay alguna, el diálogo añade bajo la lista el aviso `bib.acc.preparar.aviso.finesSinMarca` (`info`) y **ese mismo diálogo es la confirmación**: no hay un segundo diálogo. Main recibe `preparar(ids, { finesSinMarca: true })`. Si el usuario no quiere tocarlas, las desmarca de la selección antes. |
| Privacidad | La nota `bib.acc.preparar.privacidad` aparece siempre que alguna canción vaya a buscar letra. Pulsar «Preparar» es una búsqueda iniciada por el usuario: funciona aunque el interruptor «Buscar la letra automáticamente» de la feature 5 esté apagado. |
| Motor de sincronía (feature 10) | Si alguna canción usará «Ajustar los silencios» porque falta el modelo de su idioma, no se avisa aquí: lo dice el resultado de cada canción (spec 04, feature 10). |
| Al confirmar | El diálogo se cierra, se sale del modo selección y aparece el toast `bib.acc.preparar.toast` con [Ver actividad] (abre el panel de actividad). Las canciones entran **al final de la cola de preparación**, en el orden de la lista; si ya había una tanda en marcha, se suman a ella (feature 7). Las tarjetas muestran las líneas de paso de la feature 5. |
| Seguimiento | El de la cola de preparación (spec 04, feature 7): botón «Preparando {i} de {n}», progreso global, [Pausar], [Cancelar lo que falta…], grupos «En cola», «Con error» y «Terminadas». Esta feature no añade otro panel. |
| Resultado por canción | El de la feature 5: «Lista para revisar», «Elige la letra», «No encontramos la letra», «Letra pendiente» o error. Ninguna pasa sola a «Lista». |
| Fin | Con **2 o más** canciones: el toast `act.cola.fin` y el diálogo «Resultado de la preparación» de la feature 7. Con **una**: el toast de esa canción (feature 5). Con la feature 11, las filas «Lista para revisar» de ese diálogo añaden `bib.revision.linea` («· 4 líneas por revisar») **(petición a la feature 7)**. |
| Fallos | Un fallo no detiene la cola; las paradas automáticas (sin espacio, motor por reparar, tres errores iguales seguidos) son las de la feature 7. |

### A la cola

- Sin diálogo. Añade las Listas seleccionadas **al final de la cola, en el orden visual** de la Biblioteca (el de los grupos si hay agrupación), como «Agregar al final» repetido.
- Toast `bib.acc.cola.toast` con [Deshacer] (quita todas las entradas añadidas por esa acción). Con la cola llena (`COLA_LLENA`): entran las que caben y el toast usa la variante «parcial». En espera sin candidata, el toast añade [▶ Iniciar ahora]; en fin de la cola, empieza la cuenta de la primera (reglas de la fase 4).
- Sin sesión, prepara la cola (panel P6) y abre el panel.

### Editar datos…

```
┌ Editar datos de 5 canciones ─────────────────────────────────┐
│ [☐] Artista   [ (varios)                              ]      │
│ [☑] Álbum     [ A Night at the Opera                  ]      │
│ Solo cambian los campos marcados. El título se cambia        │  `bib.acc.datos.ayuda`
│ canción a canción.                                           │
│                                                              │
│ Cambiará el álbum de 4 canciones; 1 ya lo tiene.             │  `bib.acc.datos.impacto`
│ ⚠ 3 cambiarán de aspecto: usarán el tema de su nuevo álbum.  │  `bib.acc.datos.aspecto`
│ [▸ Ver las canciones]                                        │
│                          [Cancelar] [Cambiar 4 canciones]    │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| Campos | «Artista» y «Álbum», cada uno con su casilla. El campo muestra el valor común si todas lo comparten; si no, el marcador `bib.acc.datos.varios` y queda vacío al enfocarlo. Escribir en un campo marca su casilla; desmarcarla restaura el valor mostrado. |
| Vaciar | Un campo **marcado y vacío** quita ese dato: bajo el campo aparece `bib.acc.datos.vaciar` («Quedarán sin álbum.»). |
| Impacto | Lo calcula main y se recalcula con 300 ms de espera tras la última tecla: cuántas cambian, cuántas ya tenían ese valor y cuántas cambian de **tema efectivo** por la herencia (con la lista revelable y el destino de cada una, como `bib.grupo.impacto`). Las personalizadas y las de tema asignado no cambian de aspecto. |
| Botón | Inactivo sin ninguna casilla marcada (`bib.acc.datos.nada`) o si ninguna canción cambiaría. |
| Al aplicar | «Cambiando… {i} de {n}». Las tarjetas se mueven a su grupo nuevo al terminar el lote (no una a una), sin perseguir el foco: el foco va a «Seleccionar» y se anuncia `bib.acc.datos.toast`. |
| Foco inicial | En la primera casilla. Esc = Cancelar. |

### Eliminar…

```
┌ ¿Eliminar 5 canciones? ──────────────────────────────────────┐
│ Se moverán a la papelera de tu sistema, con sus pistas y su  │  `bib.acc.eliminar.cuerpo`
│ letra. Podrás recuperarlas desde allí.                       │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Bohemian Rhapsody — Queen · Lista                        │ │
│ │ La flaca — Jarabe de Palo · Borrador                     │ │
│ │   Se cancelará su separación                             │ │
│ │ Despacito — Luis Fonsi · Lista · En la cola              │ │
│ │   También se quitará de la cola                          │ │
│ │ Lucía — Sin artista · No se elimina:                     │ │  atenuada
│ │   se está reproduciendo en la otra pantalla              │ │
│ └──────────────────────────────────────────────────────────┘ │
│ ⚠ 2 de ellas están listas para cantar.                       │  `bib.acc.eliminar.listas`
│ [☐] Entiendo que se eliminarán 12 canciones.                 │  solo con 10 o más
│                        [Cancelar] [Eliminar 4 canciones]     │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| Entrada | «Eliminar…» de «Más acciones» o **Supr** con el foco en la rejilla, en modo selección y con alguna canción seleccionada. Fuera del modo selección, Supr sigue eliminando la tarjeta enfocada. |
| Lista | Cada canción con su estado y lo que arrastra: trabajo en curso que se cancela (separación, descarga, preparación, exportación), entradas de la cola que se quitan. |
| Aviso de listas | `bib.acc.eliminar.listas` si entre las que se eliminan hay Listas o Letra lista (es donde está el trabajo hecho). |
| Casilla de 10 o más | Con **10 o más** canciones a eliminar, el botón destructivo está inactivo hasta marcar `bib.acc.eliminar.entiendo` **(decisión provisional)**. |
| Botones | Foco inicial en «Cancelar». «Eliminar {n} canciones» es destructivo. Esc = Cancelar. |
| Al confirmar | «Eliminando… {i} de {n}». Cada canción: se cancelan sus trabajos, se quita de la cola y su carpeta va a la papelera. |
| Fin | Todo bien: el diálogo se cierra, toast `bib.acc.eliminar.toast` y foco en «Seleccionar» (si la biblioteca quedó vacía, en «Añadir canción» del estado vacío). Con fallos: resultado por canción con `bib.acc.eliminar.fallo` y [Reintentar las que faltan]. |
| Deshacer | No hay en la app: se recuperan desde la papelera del sistema (como hoy). |

### Seguimiento y resultado de los trabajos largos

| Acción | Dónde se sigue | Cómo termina |
|---|---|---|
| Preparar | Cola de preparación (spec 04, feature 7): un solo panel para lo que llega de «Añadir canción», de un lote importado y de «Preparar». | Toast `act.cola.fin` y diálogo «Resultado de la preparación» (feature 7), con [Reintentar las fallidas] y [Ver en la biblioteca]. |
| Exportar video… | Diálogo de lote de spec 10 (H) y fila del lote en el panel de actividad. | Un toast `exp.lote.toast` y el resultado I de spec 10. |
| Exportar paquete… | Diálogo «Creando el paquete» y su fila en el panel de actividad (feature 9). | Toast `paq.toast.ok` o estado «Paquete creado». |

- Cerrar la app con cualquiera de ellos en marcha: diálogo de cierre de spec 04 §3. La preparación se retoma sola al reabrir (feature 5); las exportaciones y los paquetes se cancelan con limpieza, como hoy.
- Ninguno bloquea la Biblioteca: se puede seguir seleccionando y lanzar otra acción.

### Estados (feature 8)

| Estado | Presentación |
|---|---|
| Sin selección | Todas las acciones inactivas con `bib.sel.ninguna`. |
| Acción que no aplica a ninguna | `aria-disabled` con `bib.acc.ninguna.*`. |
| Calculando la confirmación (> 300 ms) | Diálogo con la lista en esqueleto y el botón inactivo con `bib.acc.calculando`. |
| Aplicando (lote corto) | Botón «{verbo}… {i} de {n}», controles inactivos, sin Esc. |
| En cola / en curso (trabajo largo) | Tarjetas con su línea de paso; cola de preparación o fila del lote en el panel de actividad. |
| Resultado parcial | Diálogo de resultado con filas ✓ / – / ✕. |
| Error al abrir la confirmación | Toast `bib.toast.errorgenerico`; la selección no cambia. |
| Biblioteca vacía | Sin modo selección (como hoy). |

### Teclado y accesibilidad (feature 8)

- La barra de selección es una `toolbar` con nombre `bib.acc.barra`; Tab entra en ella y ←/→ recorren sus botones.
- «Más acciones»: `aria-haspopup="menu"`, `aria-expanded`. Cada ítem inactivo conserva el foco y describe su motivo.
- **Supr** en modo selección abre «Eliminar…» de la selección. No hay más atajos de una tecla (evita lotes accidentales).
- Los diálogos atrapan el foco; la lista es `role="list"` y cada fila se lee como «{título}, {artista}: {nota}». El resultado y el resumen se anuncian una vez (`role="status"`); los fallos, con `role="alert"`.
- Los recuentos del botón («2 de 5») forman parte de su nombre accesible: «Preparar, 2 de 5 seleccionadas».
- Nada depende solo del color: cada resultado lleva icono y texto.

### Microcopy (feature 8)

| Clave | Texto |
|---|---|
| `bib.sel.noEditable` | Esta canción no se puede abrir. Usa su menú ⋯ para eliminarla o repararla. |
| `bib.acc.barra` | Acciones para las canciones seleccionadas |
| `bib.acc.preparar` | Preparar · (parte) Preparar ({a} de {n}) — nombre accesible: Preparar, {a} de {n} seleccionadas |
| `bib.acc.mas` | Más acciones |
| `bib.acc.menu` | A la cola · Exportar video… · Exportar paquete… · Exportar la letra (.lrc)… · Editar datos… · Eliminar… · (parte) {acción} ({a} de {n}) |
| `bib.acc.ninguna.preparar` | Ninguna de las seleccionadas necesita preparación. |
| `bib.acc.ninguna.cola` | Solo las canciones listas se pueden poner en la cola. |
| `bib.acc.ninguna.exportar` | Solo las canciones listas se pueden exportar desde aquí. |
| `bib.acc.ninguna.letra` | Ninguna de las seleccionadas tiene letra sincronizada. |
| `bib.acc.motivo.yaLista` | Ya está lista: no se prepara |
| `bib.acc.motivo.yaPreparada` | Ya está lista para revisar |
| `bib.acc.motivo.enCurso` | Ya se está preparando |
| `bib.acc.motivo.danada` | Está dañada |
| `bib.acc.motivo.noLista` | Aún no está lista |
| `bib.acc.motivo.exportando` | Ya se está exportando |
| `bib.acc.motivo.sinTiempos` | No tiene letra sincronizada |
| `bib.acc.motivo.activa` | No se elimina: se está reproduciendo en la otra pantalla |
| `bib.acc.motivo.EDICION_BLOQUEADA` | No se ha cambiado: está sonando en la otra pantalla. Edítala cuando termine. (resultado de «Editar datos…» de varias; 0292) |
| `bib.acc.calculando` | Comprobando las canciones… |
| `bib.acc.preparar.titulo` | Preparar {n} canciones · Preparar 1 canción |
| `bib.acc.preparar.explicacion` | Shinobi Karaoke hará sola lo que falta en cada una: separar las pistas, buscar la letra, comprobarla con la voz y ajustar los fines. Quedarán como «Lista para revisar». |
| `bib.acc.preparar.nota` | Buscará la letra · Separará las pistas y buscará la letra · Descargará el audio, separará las pistas y buscará la letra · Ya tiene letra: comprobará la letra y ajustará los fines · Separará las pistas |
| `bib.acc.preparar.nota.finesSinMarca` | Ya tiene letra (puede tener cambios tuyos): solo pondrá los fines que faltan |
| `bib.acc.preparar.aviso.finesSinMarca` | {k} de estas canciones tienen una letra de una versión anterior, que puede tener cambios tuyos. En ellas solo pondremos fin a las líneas que no lo tienen, donde la voz se para claramente. No moveremos ningún inicio ni la letra entera, y podrás quitar esos fines desde el editor. · (k = 1) 1 de estas canciones tiene … |
| `bib.acc.preparar.privacidad` | Para buscar la letra se envían el título y el artista de cada canción a LRCLIB. |
| `bib.acc.preparar.boton` | Preparar {n} canciones · Preparar 1 canción |
| `bib.acc.preparar.toast` | {n} canciones en cola para preparar. Puedes seguir usando Shinobi Karaoke. — [Ver actividad] · (n = 1) «{título}» está en cola para preparar. — [Ver actividad] |
| `bib.acc.cola.toast` | {n} canciones se agregaron al final de la cola. — [Deshacer] · (parcial) Se agregaron {a} de {n} canciones: la cola está llena. — [Deshacer] · (en espera sin candidata) — [▶ Iniciar ahora] [Deshacer] |
| `bib.acc.datos.titulo` | Editar datos de {n} canciones |
| `bib.acc.datos.campos` | Artista · Álbum — casillas: Cambiar el artista · Cambiar el álbum |
| `bib.acc.datos.varios` | (varios) |
| `bib.acc.datos.ayuda` | Solo cambian los campos marcados. El título se cambia canción a canción. |
| `bib.acc.datos.vaciar` | Quedarán sin artista. · Quedarán sin álbum. |
| `bib.acc.datos.impacto` | Cambiará el {artista/álbum} de {a} canciones; {b} ya lo tienen. · (los dos) Cambiará el artista o el álbum de {a} canciones. · (ninguna) Todas tienen ya esos datos. |
| `bib.acc.datos.aspecto` | ⚠ {k} cambiarán de aspecto: usarán el tema de su nuevo {artista/álbum}. · (k = 1) ⚠ 1 cambiará de aspecto: usará el tema de su nuevo {artista/álbum}. |
| `bib.acc.datos.nada` | Marca el artista o el álbum para cambiarlo. |
| `bib.acc.datos.boton` | Cambiar {n} canciones · Cambiar 1 canción · (aplicando) Cambiando… {i} de {n} |
| `bib.acc.datos.toast` | Datos cambiados en {n} canciones. |
| `bib.acc.eliminar.titulo` | ¿Eliminar {n} canciones? · ¿Eliminar «{título}»? |
| `bib.acc.eliminar.cuerpo` | Se moverán a la papelera de tu sistema, con sus pistas y su letra. Podrás recuperarlas desde allí. |
| `bib.acc.eliminar.nota` | Se cancelará su {separación/descarga/preparación/exportación} · También se quitará de la cola |
| `bib.acc.eliminar.listas` | ⚠ {k} de ellas están listas para cantar. · (k = 1) ⚠ 1 de ellas está lista para cantar. · (todas) ⚠ Todas están listas para cantar. |
| `bib.acc.eliminar.entiendo` | Entiendo que se eliminarán {n} canciones. |
| `bib.acc.eliminar.boton` | Eliminar {n} canciones · Eliminar 1 canción · (aplicando) Eliminando… {i} de {n} |
| `bib.acc.eliminar.toast` | {n} canciones se movieron a la papelera. |
| `bib.acc.eliminar.fallo` | No se pudo mover a la papelera. — [Copiar detalles] |
| `bib.acc.reintentar` | Reintentar las que faltan · Reintentar las fallidas |
| `bib.acc.resultado.fila` | Hecho · Omitida: {motivo} · {motivo de fallo} |

### Criterios de aceptación de la feature 8 (biblioteca)

- F8-1. En modo selección, la barra muestra «Preparar», «Aplicar tema…» y «Más acciones»; el menú contiene, en este orden, A la cola, Exportar video…, Exportar paquete…, Exportar la letra (.lrc)…, Editar datos… y, tras un separador, Eliminar… A 1024 × 576 con el panel de cola abierto, la primera fila no se parte.
- F8-2. Con una selección de 2 borradores sin letra, 2 Listas y 1 «Lista para revisar», los textos son «Preparar (2 de 5)», «A la cola (2 de 5)» y «Exportar video… (2 de 5)»; «Editar datos…» y «Eliminar…» no llevan cifra. Con solo Listas seleccionadas, «Preparar» está `aria-disabled` con `bib.acc.ninguna.preparar` y sigue enfocable.
- F8-3. «Preparar» abre la confirmación con una nota por canción y las que no aplican al final con su motivo; el botón dice a cuántas afecta; al confirmar, cada canción aplicable entra en preparación (comprobado en el gestor de trabajos), se sale del modo selección y aparece `bib.acc.preparar.toast`. La nota de privacidad aparece si alguna va a buscar letra. Una canción con la letra ya elegida la conserva.
- F8-4. Las canciones de «Preparar» entran al final de la cola de preparación de la feature 7 en el orden de la lista: el botón superior dice «Preparando {i} de {n}», y al terminar una tanda de 2 o más aparece una sola vez `act.cola.fin` con [Ver resultado]; con una sola canción aparece el toast de su resultado (feature 5). No hay un segundo panel ni un segundo resumen propios de esta feature.
- F8-5. Lanzar «Preparar» con una tanda ya en marcha suma las canciones a esa tanda (el total sube y la barra no retrocede); un fallo en una canción no detiene las demás.
- F8-6. «A la cola» añade las Listas seleccionadas al final en el orden visual, sin diálogo, y [Deshacer] las quita todas; con la cola a 2 entradas del límite y 5 seleccionadas, entran 2 y el toast usa la variante parcial.
- F8-7. «Editar datos…» con el álbum marcado y cinco canciones (una ya con ese álbum, tres que heredarán otro tema): muestra «Cambiará el álbum de 4 canciones; 1 ya lo tiene», el aviso de aspecto con 3 y la lista revelable; al aplicar, las tarjetas quedan en su grupo nuevo, el foco en «Seleccionar» y se anuncia el resultado. Un campo marcado y vacío deja las canciones «Sin álbum». Sin casillas marcadas, el botón está inactivo con su motivo. El título de ninguna canción cambia.
- F8-8. «Eliminar…» y Supr (en modo selección con selección) abren la confirmación con el foco en «Cancelar», la lista con estado y arrastres de cada canción y el aviso de listas; con 10 o más, el botón destructivo solo se activa al marcar la casilla; al confirmar, cada carpeta va a la papelera del sistema, sus trabajos se cancelan antes y sus entradas de la cola se quitan. La canción que suena en la otra pantalla no se elimina y lo dice su fila.
- F8-9. Con un fallo simulado al mover a la papelera una de cuatro canciones, las otras tres quedan eliminadas, el resultado muestra la fallida con `bib.acc.eliminar.fallo` y «Reintentar las que faltan» solo reintenta esa.
- F8-10. Si una canción seleccionada cambia de estado entre abrir la confirmación y confirmar (doble), no se aplica nada y la lista se actualiza con el aviso de confirmación obsoleta.
- F8-11. Las Dañadas con `cancion.json` ilegible no se pueden seleccionar y su tooltip es el texto nuevo de `bib.sel.noEditable`.
- F8-12. Durante una sesión en otra pantalla, «Preparar», «A la cola», «Exportar video…», «Editar datos…» y «Eliminar…» funcionan; ninguna abre el editor. La canción que **está sonando** no se edita ni se elimina: sale omitida con su motivo (`bib.acc.motivo.EDICION_BLOQUEADA` en «Editar datos…», `bib.acc.motivo.activa` en «Eliminar…») y las demás se procesan (ADR 0017 §9; 0292).
- F8-13. Todo el flujo (entrar en el modo, seleccionar, abrir «Más acciones», confirmar, leer el resultado) es operable solo con teclado; el foco nunca queda en `body`; el resultado se anuncia una vez.
- F8-14. Capturas en `docs/ux/revisiones/0.2.2-feature-8/` con nombre `biblioteca-{ancho}x{alto}-{escala}-{estado}.png` a 1280 × 800 al 100 % y 1280 × 720 al 125 %: `barra-acciones`, `menu-mas-acciones`, `dialogo-preparar`, `dialogo-editar-datos`, `dialogo-eliminar`, `dialogo-eliminar-diez`, `resultado-eliminar-parcial`.

**Verificación manual** (guía de `docs/Test-manuales/0.2.2/`): preparar de una vez los 5 borradores reales sin letra y comprobar que el resumen coincide con lo que muestran las tarjetas; eliminar un lote y recuperarlo desde la papelera del sistema en Windows, macOS y Linux; encolar 10 canciones y cantar las dos primeras.

**Lo que esta feature necesita de las features 5 y 7**: (1) que «Preparar» de una canción sea una operación de main que se pueda pedir para varias y que diga, sin ejecutarla, si aplica y qué hará (la nota de la confirmación); (2) que continúe desde el primer paso pendiente sin sustituir letra ni tiempos (ya lo dice 04 · Feature 5, «Lo que la preparación no toca nunca»); (3) que las canciones de «Preparar» cuenten en la tanda y en el resumen de la cola de preparación igual que las de un lote importado; (4) que el diálogo «Resultado de la preparación» admita el dato de líneas por revisar de la feature 11.

## 0.2.2 · Feature 9 — Copia de seguridad, paquete de canción y exportar la letra

Origen: [plan 0.2.2, feature 9](../versiones/0.2.2/plan-4.md) y propuesta [025](../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md). Copia de seguridad de toda la biblioteca: [08 · 0.2.2 · Feature 9](08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad). Mapa y flujo: [00 · 0.2.2](00-mapa-de-vistas.md#022--features-8-a-11). Exportar la letra desde el editor: [06 · 0.2.2 · Feature 9](06-editor.md#022--feature-9--exportar-la-letra-desde-el-editor). Contratos pendientes: [0157](../preguntas/0157-contratos-de-las-features-8-a-11-para-las-specs.md). Decisiones provisionales: [0158](../preguntas/0158-decisiones-provisionales-de-ux-de-las-features-8-a-11.md). Esta sección define el **paquete**, cómo se exporta y se importa desde la Biblioteca, y la exportación de la letra a `.lrc`.

**Sustituye**: la regla «Arrastrar un archivo sobre la ventana abre la vista 03» **solo** para archivos de paquete (abren el diálogo de importar); el menú ⋯ de la tarjeta (ítems nuevos); el estado vacío (un enlace más).

### Conceptos

| Concepto | Definición |
|---|---|
| **Paquete** | Un único archivo con una o varias canciones y los temas que usan, para guardarlas o llevarlas a otro equipo propio. Extensión `.shinobi` **(provisional; el formato y la extensión los fija el arquitecto)**. |
| **Paquete completo** | Lleva el audio. Por canción: sus datos (título, artista, álbum, fechas, origen), la letra con todos sus tiempos (líneas, fines, tiempos por palabra y su origen, marcas de revisión), el estilo y la apariencia, el estado (borrador, Lista, Letra lista), la mezcla original, las pistas separadas de voz e instrumental y la miniatura. Unos 70–100 MB por canción. |
| **Paquete ligero** | Lo mismo **sin audio** (sin mezcla ni pistas): letra, tiempos, estilo, datos y miniatura. Menos de 1 MB por canción. Sirve para guardar el trabajo de sincronía; el audio se vuelve a obtener. |
| **Temas en el paquete** | El tema que usa cada canción (asignado o heredado de su álbum, su artista o el predeterminado), una sola vez aunque lo usen varias. Una canción con tema personalizado lo lleva dentro de sí misma. Las asignaciones de artista y álbum y el tema predeterminado **solo** viajan en la copia de seguridad (spec 08). |
| **Copia de seguridad** | Un paquete con **todas** las canciones, el catálogo de temas completo con sus asignaciones y, aparte, los ajustes. Se crea y se restaura desde Ajustes (spec 08) con el mismo diálogo de importar. |
| **Qué no lleva nunca** | Videos exportados, la cola de reproducción, el motor de audio y sus modelos, las cachés (formas de onda), los registros, los consentimientos (aviso de YouTube, modelo Rápido) y el `.bak` de cada canción. |
| **Misma canción** | Dos canciones son la misma si tienen el mismo identificador interno (la que salió de este equipo o de una copia suya). Dos canciones con el mismo título y artista pero distinto identificador son canciones distintas. |

**Copia personal, no compartir.** La visión excluye «compartir o publicar». El paquete existe para proteger el trabajo y moverlo entre equipos del mismo usuario. La interfaz nunca usa las palabras «compartir» ni «enviar», no ofrece subirlo a ningún sitio y muestra el aviso `paq.aviso.derechos` en todo diálogo que cree un paquete **(decisión provisional: aviso siempre visible, sin casilla de aceptación)**.

### Puntos de entrada

| Desde | Elemento | Disponible cuando |
|---|---|---|
| Tarjeta, menú ⋯ (Lista, Letra lista, Borrador, Dañada solo por pistas) | **«Exportar paquete…»** (`paq.menu.exportar`, icono `package`), después de «Exportar video…» (o de «Editar datos» en un borrador) | Siempre. También durante una sesión en otra pantalla (solo lee). |
| Tarjeta, menú ⋯ | **«Exportar la letra (.lrc)…»** (`lrc.menu`, icono `file-music`), después de «Exportar paquete…» | La canción tiene al menos una línea con inicio. Si no: `aria-disabled` con `lrc.motivo.sinTiempos`. |
| Selección múltiple, «Más acciones» (feature 8) | «Exportar paquete…» y «Exportar la letra (.lrc)…» | Reglas de la feature 8. |
| Estado vacío de la Biblioteca | Enlace **«Restaurar una copia o importar un paquete…»** (`paq.vacio.enlace`, botón fantasma bajo «Añadir canción») | Biblioteca sin canciones. |
| Ajustes › Copia de seguridad (spec 08) | [Crear copia de seguridad…] · [Restaurar o importar…] | Siempre. |
| Arrastrar un archivo `.shinobi` sobre la ventana | Abre el diálogo de importar con ese archivo | En la Biblioteca y en Ajustes, sin diálogo abierto. Con varios archivos, se usa el primero y se avisa con `paq.arrastrar.varios`. |
| Editor › Funciones (spec 06) | «Exportar la letra (.lrc)…» | Como en la tarjeta. |

**Nota de coordinación** (feature 7, vista 03): conviene un enlace «¿Tienes un paquete de Shinobi Karaoke? Importar paquete…» en «Añadir canción» que abra este mismo diálogo; lo decide quien lleva esa spec.

### Exportar paquete

```
┌ Exportar paquete ────────────────────────────────────────────┐
│ 3 canciones                                    [▸ Ver cuáles] │
│                                                              │
│ Qué incluye                                                  │
│ ◉ Completo, con el audio                    unos 290 MB      │
│   Letra, tiempos, estilo, temas y las pistas de cada         │
│   canción. Al importarlo se puede cantar al momento.         │
│ ○ Ligero, sin audio                       menos de 1 MB      │
│   Letra, tiempos, estilo y temas. Al importarlo en otro      │
│   equipo habrá que volver a añadir el audio de cada canción. │
│                                                              │
│ Guardar como                                                 │
│ [D:\Copias\3 canciones de Shinobi Karaoke 2026-11-21.shinobi] [Cambiar…] │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ⚠ Es una copia para ti. El audio y la letra de las       │ │  `paq.aviso.derechos`
│ │   canciones tienen derechos de autor: úsala para guardar │ │
│ │   tu trabajo o llevarlo a otro equipo tuyo. Pasarla a    │ │
│ │   otras personas puede infringir esos derechos y queda   │ │
│ │   bajo tu responsabilidad.                               │ │
│ └──────────────────────────────────────────────────────────┘ │
│                              [Cancelar] [Exportar paquete]   │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| Cabecera | Una canción: «{título}» · {artista}. Varias: «{n} canciones» con la lista revelable (título — artista · estado). |
| **Qué incluye** | Grupo de radio. Por defecto «Completo» **(decisión provisional)**; se recuerda la última elección **mientras la app está abierta**; al reiniciar vuelve a «Completo» (revisión 2026-11-22, 0292: es lo más seguro, porque un paquete ligero no lleva el audio). A la derecha de cada opción, su tamaño estimado (`paq.tamano`; lo da main sumando los archivos; mientras se calcula, «calculando…»). |
| Canción sin audio o a medias | Un borrador sin pistas (o sin mezcla) se exporta con lo que tenga guardado; la lista lo anota con `paq.nota.sinAudio`. Una canción con un trabajo en curso **sí entra**: su `cancion.json` y los archivos de los pasos ya completados; si se está separando, entra **sin pistas** y al importarla se comporta como la de un paquete ligero (borrador sin audio). La lista la anota con `paq.nota.enCurso`. |
| **Guardar como** | Como en «Exportar video» (spec 10): campo de solo lectura + [Cambiar…] (diálogo «Guardar» del sistema, desde main, con el filtro de la extensión). Nombre propuesto: una canción, `{título} — {artista}.shinobi`; varias, `{n} canciones de Shinobi Karaoke {AAAA-MM-DD}.shinobi`. Carpeta: la última usada para paquetes; si no, Documentos. No se puede guardar dentro de la carpeta de datos de la app. |
| Notas | En línea, como en spec 10: archivo existente (`paq.aviso.existe`: se sustituye solo al terminar bien), espacio insuficiente (`paq.aviso.espacio`), y **siempre** `paq.aviso.derechos` (con la variante «ligero» si se eligió sin audio). |
| **Exportar paquete** | Primario. Main valida el destino antes de empezar (carpeta sin permiso: error bajo el campo, como V35 de spec 10). Después el diálogo pasa a «Creando el paquete». |
| Teclado | Foco inicial en la opción elegida de «Qué incluye»; ↑/↓ cambian; Esc = Cancelar. |

**Creando el paquete** (mismo diálogo; es un trabajo largo cancelable que sigue en segundo plano)
```
┌ Creando el paquete ──────────────────────────────────────────┐
│ 3 canciones · completo                                       │
│ Guardando «La flaca»… 2 de 3              quedan unos 20 s   │
│ ██████████████░░░░░░░░░░░░░░░                                │
│ Puedes cerrar este cuadro: el paquete se sigue creando.      │
│ [Cancelar]                       [Seguir en segundo plano]   │
└──────────────────────────────────────────────────────────────┘
```
- Se escribe en un temporal en la carpeta de destino y solo al terminar pasa a ser el archivo (como los videos). Cancelar o fallar borra el temporal; un archivo previo con ese nombre queda intacto.
- Aparece en el panel de actividad como un trabajo (`act.paq`), con [Ir] y [✕]. Cuenta en el diálogo de cierre de la app.
- **Fin**: con el diálogo abierto, estado «Paquete creado» con el nombre, el tamaño real, la carpeta y [Mostrar en la carpeta] (primario, foco) [Cerrar]. Con el diálogo cerrado, toast `paq.toast.ok` con [Mostrar en la carpeta].
- **Canciones que no se pudieron leer** (una pista borrada a mitad, `cancion.json` ilegible): el paquete se crea con las demás y el final lista las omitidas con su motivo (resultado por canción de la feature 8).
- **Fallo**: `SIN_ESPACIO`, `DESTINO_NO_DISPONIBLE` o `ERROR_INTERNO` con los textos de spec 10 adaptados (`paq.error.*`), [Reintentar] y [Copiar detalles].

### Importar un paquete (y restaurar una copia)

Mismo diálogo para un paquete de canciones y para una copia de seguridad; la copia añade la parte de temas y ajustes (spec 08).

**1. Elegir y leer.** El diálogo «Abrir» del sistema (filtro `.shinobi`) o el archivo arrastrado. Mientras main lo lee: diálogo con `paq.imp.leyendo` y barra indeterminada, [Cancelar].

**2. Revisar**
```
┌ Importar paquete ────────────────────────────────────────────┐
│ 3 canciones de Shinobi Karaoke 2026-11-21.shinobi            │
│ Creado el 21 nov 2026 con Shinobi Karaoke 0.2.2 · completo   │
│ 3 canciones · 2 temas · 290 MB                               │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ ✚ Arrópame — Artista                                     │ │
│ │   Nueva                                                  │ │
│ │ ⟲ A Pesar de Mí — Artista                                │ │
│ │   Ya la tienes. La del paquete es más antigua            │ │
│ │   (20 nov; la tuya, 21 nov).  [Omitir ▾]                 │ │
│ │ = ¿Y Ahora Qué? — Artista                                │ │
│ │   Ya la tienes igual: se omite                           │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Para las que ya tienes: [Omitir|Sustituir|Conservar las dos] │
│ Temas: 1 nuevo · 1 ya lo tienes                              │
│ Hacen falta 96 MB; tienes 120 GB libres.                     │
│                           [Cancelar] [Importar 1 canción]    │
└──────────────────────────────────────────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| Resumen | Nombre del archivo, fecha y versión con que se creó, si es completo o ligero, número de canciones y temas y tamaño. Una copia de seguridad lo dice en el título («Restaurar copia de seguridad»). |
| Lista | Una fila por canción con icono + texto: **Nueva** (✚) · **Ya la tienes** (⟲), con cuál es más reciente por su fecha de modificación · **Ya la tienes igual** (=): mismo identificador y misma fecha de modificación; se omite siempre. `role="list"`, scroll propio hasta 280 px. |
| **Para las que ya tienes** | Control segmentado que fija la respuesta de todas las «Ya la tienes»: **Omitir** (por defecto; no toca la tuya) · **Sustituir** (la del paquete ocupa el lugar de la tuya; **la tuya va a la papelera del sistema**, recuperable) · **Conservar las dos** (la del paquete entra como una canción nueva con el título `paq.imp.tituloCopia`). Cada fila «Ya la tienes» tiene además su propio selector para cambiar solo esa; al usarlo, el control general muestra «Mixto». |
| Sustituir con un paquete ligero | Solo se sustituyen la letra, los tiempos, el estilo, los datos y el estado; **el audio que ya tienes se conserva**. Es el caso «recuperar mi sincronía». **No va nada a la papelera** (la canción sigue siendo la misma carpeta): la versión anterior de sus datos queda como copia de seguridad de la canción (su `.bak`), igual que tras cualquier guardado **(decisión provisional, 0158 n.º 23)**. La fila lo dice con `paq.imp.nota.ligeroSustituir` y el resultado con `paq.imp.fila.sustituidaLigera`. |
| Nueva desde un paquete ligero | Entra como **borrador sin audio**, con su letra y sus tiempos. Su tarjeta muestra «Falta descargar el audio» (origen YouTube; «Continuar» la descarga y la separa) o «Falta preparar el audio» (origen archivo; «Continuar» pide el archivo). Una Lista o Letra lista entra como borrador (no se puede cantar sin pistas); al volver a tener pistas, el usuario la marca otra vez. La fila lo avisa con `paq.imp.nota.ligeroNueva`. |
| Canción parecida | Si una «Nueva» coincide en título, artista y duración (± 2 s) con una de la biblioteca, la fila añade `paq.imp.nota.parecida` (informativo; se importa igual). |
| Temas | Línea de resumen con lista revelable. Reglas: un tema del paquete **idéntico** a uno tuyo (mismo identificador y mismo aspecto) se reutiliza; uno con el mismo identificador y **distinto aspecto** entra como copia con el nombre `paq.imp.temaCopia` y las canciones importadas usan la copia (tus canciones no cambian); uno nuevo cuyo nombre ya existe entra con ese mismo sufijo. Las canciones importadas de un **paquete de canciones** que heredaban su tema del álbum, del artista o del predeterminado quedan con ese tema **asignado a la canción**, para verse igual que en origen **(decisión provisional)**. Con el catálogo en solo lectura (`TEMAS_SOLO_LECTURA`) no se importan temas: las canciones entran con su aspecto guardado y la nota `paq.imp.temasSoloLectura`. |
| Espacio | `paq.imp.espacio` con lo que hace falta según lo elegido; si no cabe, `aviso` y el botón inactivo. |
| Botón | «Importar {n} canciones» con las que entrarán (nuevas + sustituidas + duplicadas). Con 0: inactivo con `paq.imp.nada`. |
| Foco | Inicial en la lista (primera fila con decisión; si no hay, en el botón). Esc = Cancelar. |

**3. Importando**: «Importando «{título}»… {i} de {n}» con barra; [Cancelar] detiene la importación **al momento**: la canción que se estaba copiando **no** se importa (se descarta su carpeta de preparación), las ya importadas se quedan y las que faltaban salen en el resultado como `paq.imp.motivo.CANCELADO` (respuesta a 0259 n.º 3). Cada canción se copia a una carpeta de preparación y solo aparece en la Biblioteca cuando está completa (nunca una canción a medias). Como trabajo, aparece en el panel de actividad (`act.paq`, «Importando paquete · {i} de {n}») y el diálogo se puede cerrar con «Seguir en segundo plano», como al crear un paquete.

**4. Resultado** (resultado por canción de la feature 8)
```
│ Se importaron 2 de 3 canciones.                              │
│ ✓ Arrópame — Importada                                       │
│ ✓ A Pesar de Mí — Sustituida (la anterior está en la papelera) │
│ ✕ Sinmigo — Sus archivos están dañados en el paquete.        │
│ Temas: 1 importado («Neón (importado)»).                     │
│                                              [Cerrar]        │
```
- **Una fila por canción del paquete**, con icono + texto: ✓ `paq.imp.fila` (importada, sustituida, sustituida con paquete ligero, importada como copia) · – `paq.imp.motivo.*` (omitida, con su motivo) · ✕ `paq.imp.fallo.*` (error, con [Copiar detalles] en la fila). Tabla de motivos abajo. Lista con scroll propio (máx. 280 px), `role="list"`.
- Con el diálogo cerrado al terminar: toast `paq.imp.toast` (o `paq.imp.toast.parcial` si hubo omitidas o errores, con [Ver resultado]).
- Al cerrar: la Biblioteca pasa al filtro *Todas* si el actual ocultaría alguna importada, la primera importada recibe el foco y las importadas se resaltan 2 s (borde `info`; sin transición con movimiento reducido). Toast `paq.imp.toast`.
- Las canciones importadas conservan su **fecha de añadido** y su fecha de modificación de origen.

**Motivos del resultado por canción** (códigos de main; respuesta a [0259](../preguntas/0259-detalles-de-datos-de-la-copia-que-la-spec-no-precisa.md) n.º 4)

| Resultado · código | Icono | Clave | Texto |
|---|---|---|---|
| importada | ✓ | `paq.imp.fila.importada` | Importada |
| sustituida (paquete completo) | ✓ | `paq.imp.fila.sustituida` | Sustituida (la anterior está en la papelera) |
| sustituida (paquete ligero) | ✓ | `paq.imp.fila.sustituidaLigera` | Sustituidas la letra, los tiempos y el estilo; tu audio se conserva |
| importada como copia | ✓ | `paq.imp.fila.copia` | Importada como «{título} (importada)» |
| omitida · `IGUAL` | – | `paq.imp.motivo.IGUAL` | Omitida: ya la tenías igual |
| omitida · `OMITIDA` | – | `paq.imp.motivo.OMITIDA` | Omitida: conservaste la tuya |
| omitida · `CANCION_MAS_NUEVA` | – | `paq.imp.motivo.CANCION_MAS_NUEVA` | Omitida: es de una versión más nueva de Shinobi Karaoke |
| omitida · `EN_CURSO` | – | `paq.imp.motivo.EN_CURSO` | Omitida: la tuya tenía un trabajo en curso. Vuelve a importarla cuando termine |
| omitida · `CANCION_EN_REPRODUCCION` | – | `paq.imp.motivo.CANCION_EN_REPRODUCCION` | Omitida: la tuya estaba sonando. Vuelve a importarla cuando termine |
| omitida · `CANCELADO` | – | `paq.imp.motivo.CANCELADO` | No importada: cancelaste la importación |
| error · `PAQUETE_INCOMPLETO` | ✕ | `paq.imp.fallo.incompleta` | Sus archivos están dañados en el paquete. No se ha importado. |
| error · `PAQUETE_NO_VALIDO` | ✕ | `paq.imp.fallo.noValida` | Sus datos no son válidos. No se ha importado. |
| error · `SIN_ESPACIO` | ✕ | `paq.imp.fallo.espacio` | No quedaba espacio en el disco. Libera espacio y vuelve a importarla. |
| error · `ERROR_INTERNO` (y cualquier otro) | ✕ | `paq.imp.fallo.guardar` | No se pudo guardar. — [Copiar detalles] |

`paq.imp.resultado` cuenta como importadas las ✓. Un código que no esté en la tabla usa `paq.imp.fallo.guardar`.

**Errores de lectura** (paso 1; el diálogo muestra el error con [Elegir otro archivo] y [Cerrar])

| Código (provisional) | Título | Explicación |
|---|---|---|
| `PAQUETE_NO_VALIDO` | Este archivo no es un paquete de Shinobi Karaoke. | Elige un archivo `.shinobi` creado con «Exportar paquete» o «Crear copia de seguridad». |
| `PAQUETE_VERSION_NUEVA` | Este paquete es de una versión más nueva de Shinobi Karaoke. | Actualiza la aplicación para poder importarlo. No se ha cambiado nada. |
| `PAQUETE_INCOMPLETO` | El paquete está dañado o incompleto. | Puede que la copia se interrumpiera o que el archivo se cortara al copiarlo. No se puede abrir y no se ha cambiado nada. Si tienes otra copia de este paquete, prueba con ella. |

**Paquete cortado frente a canción dañada** ([ADR 0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md), respuesta a 0157 §5). El índice de un paquete está al final del archivo: un paquete **cortado** (truncado) no se puede listar, así que se rechaza **entero** en el paso 1 con `PAQUETE_INCOMPLETO` y no llega al paso 2 (no hay lista parcial). Como la app escribe los paquetes en un temporal y solo los renombra al terminar, esto solo pasa con copias rotas fuera de la app. Lo que sí se detecta **canción a canción** es un archivo **dañado** dentro de un paquete que se puede leer (su comprobación no coincide con la del manifiesto): esa canción falla en el paso 3 con `paq.imp.fallo.incompleta` en el resultado y las demás se importan.
| `SIN_ESPACIO` | No queda espacio en el disco. | Libera espacio y vuelve a intentarlo. Las canciones ya importadas se conservan. |

### Exportar la letra a `.lrc`

- **Una canción**: «Exportar la letra (.lrc)…» abre directamente el diálogo «Guardar» del sistema con el nombre `{título} — {artista}.lrc` (carpeta: la última usada para letras; si no, Documentos). Al guardar: toast `lrc.toast.ok` con [Mostrar en la carpeta]. Cancelar el diálogo no hace nada. Sin diálogo propio: no hay opciones que elegir.
- **Varias** (selección): diálogo del sistema «Elegir carpeta»; se escribe un `.lrc` por canción con su nombre propuesto (si el nombre ya existe en la carpeta, se añade « (2)», « (3)»…; nunca se sustituye un archivo). Resultado por canción si alguna se omitió o falló; si no, toast `lrc.toast.varias`.
- **Qué contiene** (LRC simple, por línea, UTF-8):
  - Cabecera `[ti:]`, `[ar:]`, `[al:]` (si lo hay), `[length:]` y `[re:Shinobi Karaoke]`.
  - Una marca `[mm:ss.cc]` por línea con inicio, con el desplazamiento de la letra ya aplicado.
  - **Fin de línea antes de un silencio**: si entre el fin efectivo de una línea y el inicio de la siguiente hay 2 s o más, se escribe una marca vacía en el fin (`[mm:ss.cc]`), que es como los reproductores de LRC borran la línea. Al volver a importar ese `.lrc` en Shinobi Karaoke, esa marca es una pausa con tiempo y la línea recupera su fin **(decisión provisional)**.
  - Las pausas no se escriben aparte: un silencio de 2 s o más tras una línea queda como marca vacía en su fin (y tras la última línea) ([ADR 0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md) §4, respuesta a 0255). Las líneas **sin inicio** se omiten.
  - **Sin tiempos por palabra** (ni hechos a mano ni automáticos): 0.2.2 exporta LRC por línea **(decisión provisional)**.
- **Avisos**: si se omitieron líneas sin inicio, el toast usa la variante `lrc.toast.omitidas`. La letra es para uso personal: lo recuerda `paq.aviso.derechos` en Ajustes (spec 08); aquí no se añade diálogo.
- **Errores**: carpeta sin permiso o disco lleno → toast `error` `lrc.toast.error` con [Copiar detalles].

### Estados (feature 9)

| Estado | Presentación |
|---|---|
| Vacío (biblioteca sin canciones) | Enlace «Restaurar una copia o importar un paquete…» bajo «Añadir canción». «Exportar paquete» no existe sin canciones. |
| Calculando el tamaño | «calculando…» junto a cada opción; «Exportar paquete» disponible. |
| Creando el paquete | Barra con canción actual e {i} de {n}; fila en el panel de actividad. |
| Paquete creado | Nombre, tamaño, carpeta y [Mostrar en la carpeta]. |
| Paquete creado con omitidas | Además, la lista de omitidas con su motivo. |
| Leyendo un paquete | Barra indeterminada + [Cancelar]. |
| Paquete no válido / más nuevo / dañado | Error con [Elegir otro archivo]. |
| Revisando | Lista con Nueva / Ya la tienes / Ya la tienes igual. |
| Nada que importar | Botón inactivo con `paq.imp.nada` (todas iguales u omitidas). |
| Importando | Barra con {i} de {n}; [Cancelar]. |
| Resultado | Filas ✓ / – / ✕ y resumen de temas. |
| Canción importada sin audio | Borrador con «Falta descargar el audio» o «Falta preparar el audio» y su letra ya sincronizada. |

### Teclado y accesibilidad (feature 9)

- Los tres diálogos son modales estándar (atrapan el foco, `aria-labelledby` = título del estado). Durante «Creando el paquete», Esc equivale a «Seguir en segundo plano» (nunca cancela), como en la exportación de video.
- Las filas de la lista de importación se leen como «{título}, {artista}: {estado}[, {decisión}]». El selector de cada fila es un `select` nativo con nombre `paq.imp.aria.decision`.
- Estados con icono + texto (✚ Nueva, ⟲ Ya la tienes, = Igual): nunca solo color.
- Hitos anunciados (`role="status"`): paquete leído, 25/50/75 % al crear, creado, importación terminada. Errores con `role="alert"`.
- El aviso de derechos es texto en `texto-1` sobre `aviso-tenue` con icono (contraste ≥ 4,5:1) y está en el `aria-describedby` del botón «Exportar paquete».
- Sin atajos de teclado propios.

### Microcopy (feature 9)

| Clave | Texto |
|---|---|
| `paq.menu.exportar` | Exportar paquete… |
| `paq.vacio.enlace` | Restaurar una copia o importar un paquete… |
| `paq.arrastrar.varios` | Los paquetes se importan de uno en uno. Se abrirá el primero. |
| `paq.exp.titulo` | Exportar paquete |
| `paq.exp.cabecera` | {n} canciones · «{título}» · {artista} — [Ver cuáles] |
| `paq.exp.incluye` | Qué incluye |
| `paq.exp.completo` | Completo, con el audio — Letra, tiempos, estilo, temas y las pistas de cada canción. Al importarlo se puede cantar al momento. |
| `paq.exp.ligero` | Ligero, sin audio — Letra, tiempos, estilo y temas. Al importarlo en otro equipo habrá que volver a añadir el audio de cada canción. |
| `paq.tamano` | unos {tamaño} · menos de 1 MB · calculando… |
| `paq.exp.guardar` | Guardar como — [Cambiar…] |
| `paq.exp.nombre` | {título} — {artista}.shinobi · {n} canciones de Shinobi Karaoke {AAAA-MM-DD}.shinobi |
| `paq.nota.sinAudio` | Sin pistas todavía: se guarda sin audio |
| `paq.nota.enCurso` | Se está procesando: se guarda como está ahora · (separándose) Se está separando: se guarda sin pistas |
| `paq.aviso.derechos` | Es una copia para ti. El audio y la letra de las canciones tienen derechos de autor: úsala para guardar tu trabajo o llevarlo a otro equipo tuyo. Pasarla a otras personas puede infringir esos derechos y queda bajo tu responsabilidad. · (ligero) Es una copia para ti. La letra de las canciones tiene derechos de autor: úsala para guardar tu trabajo o llevarlo a otro equipo tuyo. Pasarla a otras personas puede infringir esos derechos y queda bajo tu responsabilidad. |
| `paq.aviso.existe` | Ya hay un archivo con este nombre. Se sustituirá solo cuando el paquete nuevo esté terminado; si cancelas o falla, se conserva. |
| `paq.aviso.espacio` | Puede que no quepa: ocupará unos {tamaño} y quedan {libre} libres en ese disco. |
| `paq.exp.boton` | Exportar paquete · (archivo existente) Exportar y sustituir |
| `paq.exp.progreso.titulo` | Creando el paquete |
| `paq.exp.progreso` | Guardando «{título}»… {i} de {n} · (una) Guardando «{título}»… |
| `paq.exp.segundoPlano` | Puedes cerrar este cuadro: el paquete se sigue creando. — [Cancelar] [Seguir en segundo plano] |
| `paq.exp.ok.titulo` | Paquete creado |
| `paq.exp.ok` | {nombre} · {n} canciones · {tamaño} · En {carpeta} — [Cerrar] [Mostrar en la carpeta] |
| `paq.exp.omitidas` | {k} canciones no se pudieron guardar: · (k = 1) 1 canción no se pudo guardar: |
| `paq.toast.ok` | Paquete creado: {n} canciones, {tamaño}. — [Mostrar en la carpeta] |
| `paq.toast.cancelado` | Paquete cancelado. No se ha guardado nada. |
| `paq.error.SIN_ESPACIO` | No queda espacio en el disco. Libera espacio o guarda el paquete en otra carpeta. — [Reintentar] |
| `paq.error.DESTINO_NO_DISPONIBLE` | No se puede guardar en esa carpeta. No tienes permiso para escribir en ella o el disco no está disponible. Elige otra con «Cambiar…». |
| `paq.error.generico` | Algo salió mal al crear el paquete. Vuelve a intentarlo. — [Copiar detalles] [Reintentar] |
| `act.paq` | Creando paquete · {i} de {n} · Importando paquete · {i} de {n} |
| `paq.imp.titulo` | Importar paquete · (copia de seguridad) Restaurar copia de seguridad |
| `paq.imp.leyendo` | Leyendo el paquete… |
| `paq.imp.resumen` | Creado el {fecha} con Shinobi Karaoke {versión} · {completo/ligero} · {n} canciones · {t} temas · {tamaño} |
| `paq.imp.estado.nueva` | Nueva |
| `paq.imp.estado.existe` | Ya la tienes. La del paquete es más reciente ({fecha}; la tuya, {fecha}). · Ya la tienes. La del paquete es más antigua ({fecha}; la tuya, {fecha}). |
| `paq.imp.estado.igual` | Ya la tienes igual: se omite |
| `paq.imp.estado.noDisponible` | (deja de usarse: un paquete cortado se rechaza entero con `PAQUETE_INCOMPLETO` y una canción dañada se detecta al importarla, con `paq.imp.fallo.incompleta`) |
| `paq.imp.paraExistentes` | Para las que ya tienes: Omitir · Sustituir · Conservar las dos · (varias respuestas) Mixto |
| `paq.imp.aria.decision` | Qué hacer con «{título}» |
| `paq.imp.nota.sustituir` | La tuya irá a la papelera de tu sistema. |
| `paq.imp.nota.ligeroSustituir` | Se sustituyen la letra, los tiempos y el estilo. Tu audio se conserva y la versión anterior se guarda como copia de la canción. |
| `paq.imp.nota.ligeroNueva` | Sin audio: entrará como borrador y habrá que volver a añadir su audio. |
| `paq.imp.nota.parecida` | Tienes otra canción con el mismo título y artista. Se importará como una canción aparte. |
| `paq.imp.tituloCopia` | {título} (importada) |
| `paq.imp.temas` | Temas: {a} nuevos · {b} ya los tienes[ · {c} entran como copia] — [Ver los temas] |
| `paq.imp.temaCopia` | {nombre} (importado) |
| `paq.imp.temasSoloLectura` | Tus temas son de una versión más nueva y no se pueden cambiar: las canciones entrarán con su aspecto guardado. |
| `paq.imp.espacio` | Hacen falta {tamaño}; tienes {libre} libres. · (no cabe) ⚠ Hacen falta {tamaño} y solo tienes {libre} libres. |
| `paq.imp.boton` | Importar {n} canciones · Importar 1 canción · (copia) Restaurar {n} canciones |
| `paq.imp.nada` | No hay nada que importar: ya tienes todas estas canciones. |
| `paq.imp.progreso` | Importando «{título}»… {i} de {n} |
| `paq.imp.resultado` | Se importaron {a} de {n} canciones. · (todas) Se importaron {n} canciones. |
| `paq.imp.fila` | (ver la tabla «Motivos del resultado por canción»: `paq.imp.fila.*`, `paq.imp.motivo.*`, `paq.imp.fallo.*`) |
| `paq.imp.toast.parcial` | Se importaron {a} de {n} canciones. — [Ver resultado] |
| `paq.imp.segundoPlano` | Puedes cerrar este cuadro: la importación sigue. — [Cancelar] [Seguir en segundo plano] |
| `paq.imp.fallo.incompleta` | Sus archivos están dañados en el paquete. No se ha importado. |
| `paq.imp.fallo.guardar` | No se pudo guardar. — [Copiar detalles] |
| `paq.imp.toast` | {n} canciones importadas. · (n = 1) «{título}» importada. |
| `paq.imp.error` | (títulos y textos de la tabla «Errores de lectura») — [Elegir otro archivo] [Cerrar] |
| `lrc.menu` | Exportar la letra (.lrc)… |
| `lrc.motivo.sinTiempos` | Esta canción aún no tiene ninguna línea sincronizada. |
| `lrc.nombre` | {título} — {artista}.lrc · (sin artista) {título}.lrc |
| `lrc.toast.ok` | Letra exportada. — [Mostrar en la carpeta] |
| `lrc.toast.omitidas` | Letra exportada sin {k} líneas que aún no tienen tiempo. — [Mostrar en la carpeta] |
| `lrc.toast.varias` | {n} letras exportadas a «{carpeta}». — [Mostrar la carpeta] |
| `lrc.toast.error` | No se pudo guardar la letra en esa carpeta. — [Copiar detalles] |

### Criterios de aceptación de la feature 9 (biblioteca)

- F9-1. El ⋯ de una tarjeta Lista, Letra lista o Borrador muestra «Exportar paquete…» y «Exportar la letra (.lrc)…»; en una canción sin ninguna línea con inicio, el segundo está `aria-disabled` con `lrc.motivo.sinTiempos`.
- F9-2. «Exportar paquete» muestra las dos opciones con su tamaño estimado (± 10 % del tamaño real en el completo; test con una biblioteca semilla), el destino propuesto con la extensión del paquete y, siempre, `paq.aviso.derechos` (variante ligera al elegir «Ligero»). La palabra «compartir» no aparece en ningún texto de la feature.
- F9-3. Exportar un paquete completo de 3 canciones crea un único archivo en el destino; durante la creación no existe ningún archivo con el nombre final (solo el temporal); cancelar a mitad no deja nada en la carpeta y conserva un archivo previo con ese nombre; al terminar, «Mostrar en la carpeta» lo abre.
- F9-4. El trabajo aparece en el panel de actividad con [Ir] y [✕], cuenta en el indicador y en el diálogo de cierre de la app; con el diálogo cerrado, al terminar sale `paq.toast.ok`.
- F9-5. Importar en una biblioteca vacía un paquete completo de 3 canciones (una Lista, una Letra lista, un borrador) deja las 3 con su estado, letra, tiempos, tiempos por palabra hechos a mano, estilo, tema y fecha de añadido idénticos a los de origen (comparación de `cancion.json` salvo rutas), y la Lista se reproduce al momento.
- F9-6. Importar un paquete con una canción nueva, una ya existente modificada después en la biblioteca y una idéntica muestra «Nueva», «Ya la tienes. La del paquete es más antigua» e «Ya la tienes igual: se omite»; con «Omitir» (por defecto) el botón dice «Importar 1 canción» y la existente no cambia byte a byte.
- F9-7. «Sustituir» deja la canción del paquete en la biblioteca y la anterior en la papelera del sistema; «Conservar las dos» añade una canción nueva con el título «{título} (importada)» y otro identificador, sin tocar la existente. El selector de una fila cambia solo esa canción y el control general pasa a «Mixto».
- F9-8. Un paquete **ligero** importado en un equipo sin la canción crea un borrador sin audio con su letra y sus tiempos, cuya tarjeta dice «Falta descargar el audio» (origen YouTube) o «Falta preparar el audio» (archivo); tras volver a obtener el audio y separar, los tiempos siguen ahí. Importado con «Sustituir» sobre una canción existente con pistas, cambia letra, tiempos y estilo y conserva las pistas (los archivos de audio no cambian byte a byte).
- F9-9. Temas: un tema idéntico no se duplica; uno con el mismo identificador y otro aspecto entra como «{nombre} (importado)» y las canciones existentes que usaban el original no cambian de aspecto; una canción importada que heredaba su tema del álbum queda con ese tema asignado y se ve igual que en origen.
- F9-10. Un archivo que no es un paquete, uno de un esquema más nuevo y uno truncado muestran `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA` y `PAQUETE_INCOMPLETO` con sus textos; en ninguno de los tres casos cambia la biblioteca. Un paquete truncado se rechaza **entero** en el paso 1 (no se muestra ninguna lista parcial). Con un paquete legible de 3 canciones en el que un archivo de una de ellas no coincide con su comprobación del manifiesto, se importan las otras 2 y el resultado muestra la tercera con ✕ y `paq.imp.fallo.incompleta`.
- F9-11. Cancelar una importación a mitad conserva las canciones ya importadas completas, no importa la que se estaba copiando y no deja ninguna a medias (la carpeta de preparación queda vacía); el resultado muestra las pendientes como `paq.imp.motivo.CANCELADO`.
- F9-17. Cada código de la tabla «Motivos del resultado por canción» produce su icono y su texto (test con un doble de main que devuelve uno de cada); «Sustituir» con un paquete ligero muestra `paq.imp.fila.sustituidaLigera`, no envía nada a la papelera y deja el `.bak` de la canción con los datos anteriores.
- F9-12. Arrastrar un `.shinobi` sobre la Biblioteca abre el diálogo de importar con ese archivo; arrastrar un audio sigue abriendo la vista 03. El estado vacío muestra el enlace de restaurar o importar.
- F9-13. «Exportar la letra (.lrc)…» abre el diálogo «Guardar» del sistema con el nombre propuesto y escribe un LRC en UTF-8 con la cabecera, una marca por línea con inicio (con el desplazamiento aplicado), marcas vacías en el fin de las líneas seguidas de 2 s o más de silencio (y tras la última línea), ninguna marca propia para las pausas y sin las líneas sin inicio (test de la función pura con una letra de ejemplo: texto exacto esperado). Volver a importar ese archivo en una canción nueva da los mismos inicios (± 10 ms) y los mismos fines en las líneas con marca vacía.
- F9-14. Exportar la letra de 4 canciones seleccionadas, una sin tiempos, escribe 3 archivos en la carpeta elegida sin sustituir ninguno existente (añade « (2)») y el resultado lista la omitida con su motivo.
- F9-15. Todos los diálogos de la feature son operables solo con teclado, Esc no cancela un paquete en creación, y los estados de la lista de importación se distinguen sin color.
- F9-16. Capturas en `docs/ux/revisiones/0.2.2-feature-9/` con nombre `biblioteca-{ancho}x{alto}-{escala}-{estado}.png` a 1280 × 800 al 100 % y 1280 × 720 al 125 %: `exportar-paquete`, `exportar-paquete-ligero`, `creando-paquete`, `paquete-creado`, `importar-revisar`, `importar-conflictos`, `importar-resultado`, `paquete-version-nueva`, `vacio-con-enlace`, `tarjeta-sin-audio`.

**Verificación manual**: crear una copia completa de la biblioteca real, restaurarla en otro equipo (o en otra carpeta de datos del canal de desarrollo) y cantar una canción; llevar un paquete ligero a un equipo sin esas canciones, volver a descargar una de YouTube y comprobar si la letra sigue cuadrando con el audio nuevo; abrir un `.lrc` exportado en un reproductor externo que muestre letras (por ejemplo VLC con el archivo junto al audio) y comprobar que las líneas se borran en los silencios largos.

## 0.2.2 · Feature 11 — Revisión guiada en la Biblioteca

Origen: [plan 0.2.2, feature 11](../versiones/0.2.2/plan-4.md) y propuesta [023](../propuestas/023-revision-guiada-de-lineas-dudosas.md). El recorrido, los motivos y las marcas viven en el editor: [06 · 0.2.2 · Feature 11](06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas). El estado «Lista para revisar», su tarjeta y sus botones «Revisar» y «Probar» los define la **feature 5** (otro diseñador, en esta spec). Aquí solo se dice **qué añade la revisión guiada a esa tarjeta** y cuándo una canción pasa a «Lista».

### Cuándo pasa una canción de «Lista para revisar» a «Lista»

- **Nunca sola.** La app prepara y señala; el paso a «Lista» o «Letra lista» lo da siempre el usuario.
- **Las líneas dudosas no bloquean.** Las condiciones para marcar como lista son las de siempre (pistas separadas y todas las líneas con inicio). Con líneas dudosas sin revisar, la app **avisa una vez** antes de marcar (`edi.revision.pendientes` en el editor; `bib.revision.dialogo` aquí) y deja seguir **(decisión provisional)**.
- **Dónde se marca**: en el editor (botones del dock y final de la revisión guiada, spec 06) y, desde la tarjeta, con los ítems nuevos del menú ⋯ (abajo).

### Qué añade a la tarjeta «Lista para revisar»

```
│ Semestre de Otoño                │
│ Artista · 3:48                   │
│ ◐ Neón · del álbum               │
│ (◔ Lista para revisar)      [⋯]  │  insignia de la feature 5
│ Letra elegida automáticamente    │  línea de origen de la feature 5 (si aplica)
│ ⚑ 4 líneas por revisar           │  ← nuevo: `bib.revision.linea` (t-pequeno, icono `flag` 14 px)
│ [Revisar]  [▶ Probar]            │  feature 5
```
La tarjeta completa está en [Feature 5 · Tarjeta «Lista para revisar»](#tarjeta-lista-para-revisar); aquí solo se define la línea ⚑ y los ítems del menú.

| Elemento | Comportamiento |
|---|---|
| **Línea de revisión** | Bajo la **insignia** «◔ Lista para revisar» de la feature 5 (y bajo su línea de origen, si la hay), en el sitio de la línea de paso: una «Lista para revisar» no tiene línea de paso propia. Texto: `bib.revision.linea` con el número de líneas dudosas **pendientes** (las que la app señala y el usuario aún no ha dado por buenas ni ha corregido). Con 0: `bib.revision.sinDudas` con icono `check` en `texto-2`. **Sin recuento** (main aún no lo ha calculado, p. ej. una canción hecha a mano que nunca pasó por la preparación): no hay línea, y el número se ve en el editor (revisión de capturas, 2026-11-22). El número lo da main en el resumen de la canción y se actualiza en vivo. Icono + texto; color `aviso` solo en el icono. |
| **«Revisar»** (feature 5) | Abre el editor con la **revisión guiada ya empezada** en la primera línea pendiente (spec 06). Con 0 pendientes, abre el editor con el panel de fin de revisión («No vemos nada raro…»), desde donde se marca como lista. |
| **Menú ⋯** | En un borrador «Lista para revisar» se añaden, tras «Probar» (en esta tarjeta «Revisar» sustituye a «Continuar»; orden completo en el menú ⋯ de la feature 5): **«Marcar como lista»** y **«Marcar como letra lista»** (`bib.revision.menu`). Hacen lo mismo que los botones del dock del editor, sin abrirlo: con líneas pendientes, antes muestran `bib.revision.dialogo`; al marcar, la tarjeta se resalta 2 s y sale `bib.toast.lista` / `bib.toast.letraLista` (con el aviso de primera activación de «Letra lista» si no está silenciado). **(Decisión provisional.)** Durante una sesión en otra pantalla siguen disponibles (no abren el editor). |
| **[Marcar como lista] del toast tras «Probar»** (`bib.prep.toast.probada`, feature 5) | Misma regla que el ítem del menú: con líneas pendientes muestra antes `bib.revision.dialogo`. |
| **Qué líneas cuentan** (revisión 2026-11-22, **decisión provisional, 0158 n.º 22**) | **La misma regla que el editor** ([06 · F11-E12](06-editor.md#marcar-como-lista-con-líneas-pendientes)): el diálogo `bib.revision.dialogo` solo sale si hay **pendientes importantes** (`sinVoz`, `vozTarde`, `reconocimiento`, o `finCorta`/`finTarde` con fin fijado), y su `{n}` es ese número. Una misma canción no puede preguntar en un sitio y no en el otro. La **línea ⚑ de la tarjeta** muestra en cambio el **total** de pendientes: es lo que recorre «Revisar» y lo que dirá el editor («quedan {p} de {t}»). Por eso una tarjeta puede decir «⚑ 3 líneas por revisar» y marcarse sin diálogo si ninguna es importante. El resumen de la canción lleva los dos números (main). |
| **Tarjetas Lista y Letra lista** | No muestran línea de revisión aunque el editor señale líneas (evita insistir en canciones que el usuario ya dio por terminadas). La revisión sigue disponible en el editor. |
| **Lectores de pantalla** | `bib.aria.tarjeta` añade la línea de revisión a la línea de paso. |

```
┌ ¿Marcar como lista sin revisar? ─────────────────────────────┐
│ «Semestre de Otoño» tiene 4 líneas que conviene escuchar     │
│ antes de cantarla. Puedes revisarlas ahora (son un par de    │
│ minutos) o marcarla igualmente y revisarlas después.         │
│                [Cancelar] [Marcar igualmente] [Revisar ahora] │
└──────────────────────────────────────────────────────────────┘
```
«Revisar ahora» es el primario y tiene el foco inicial; Esc = Cancelar.

### Microcopy (feature 11, biblioteca)

| Clave | Texto |
|---|---|
| `bib.revision.linea` | {n} líneas por revisar · (n = 1) 1 línea por revisar |
| `bib.revision.sinDudas` | Sin líneas dudosas |
| `bib.revision.menu` | Marcar como lista · Marcar como letra lista |
| `bib.revision.dialogo` | Título: ¿Marcar como lista sin revisar? · Cuerpo: «{título}» tiene {n} líneas que conviene escuchar antes de cantarla. Puedes revisarlas ahora (son un par de minutos) o marcarla igualmente y revisarlas después. · (n = 1) «{título}» tiene 1 línea que conviene escuchar antes de cantarla. … — [Cancelar] [Marcar igualmente] [Revisar ahora] |

### Criterios de aceptación de la feature 11 (biblioteca)

- F11-B1. Una tarjeta «Lista para revisar» con 4 líneas dudosas pendientes muestra «⚑ 4 líneas por revisar»; al dar por buenas dos en el editor y volver, muestra 2; con 0, «Sin líneas dudosas». Las tarjetas Lista y Letra lista no muestran esa línea.
- F11-B2. «Revisar» abre el editor con la revisión guiada activa en la primera línea pendiente (y, con 0 pendientes, con el panel de fin de revisión).
- F11-B3. «Marcar como lista» del ⋯ de una «Lista para revisar» (y [Marcar como lista] del toast tras «Probar») con al menos una pendiente **importante** muestra `bib.revision.dialogo` con `{n}` = número de importantes y el foco en «Revisar ahora»; «Marcar igualmente» la marca sin abrir el editor y la tarjeta pasa a «✓ Lista» con su toast; sin pendientes importantes (aunque haya otras: p. ej. solo `muyCorta` o `finTarde` sobre un fin automático), marca sin diálogo, y la línea ⚑ seguía mostrando el total. La decisión de preguntar es la misma que en el editor para la misma canción (test con el mismo fixture en los dos sitios). Ninguna canción pasa a «Lista» sin una acción del usuario (test: tras una preparación desatendida completa, `estado` sigue siendo `borrador`).
- F11-B4. Captura `docs/ux/revisiones/0.2.2-feature-11/biblioteca-1280x800-100-lista-para-revisar.png` con una tarjeta con líneas por revisar, una sin líneas dudosas y el menú ⋯ abierto.

**Lo que esta feature necesita de la feature 5**: (1) que el botón «Revisar» de la tarjeta navegue al editor pidiendo la revisión guiada; (2) sitio para una segunda línea bajo «Lista para revisar»; (3) que el resumen de la canción lleve el número de líneas dudosas pendientes y, aparte, el de pendientes importantes; (4) que «Lista para revisar» siga siendo un borrador (`estado: borrador`) hasta que el usuario marque.

## 0.2.2 · Feature 5 — «Lista para revisar» y bandeja de pendientes

Origen: [plan 0.2.2, feature 5](../versiones/0.2.2/plan-4.md) y [propuesta 020](../propuestas/020-preparacion-desatendida.md). La cadena de preparación, sus reglas y sus avisos: [04 · 0.2.2 · Feature 5](04-progreso-pipeline.md#022--feature-5--preparación-desatendida). Letra: [05 · 0.2.2 · Feature 5](05-letra.md#022--feature-5--preparación-desatendida-la-vista-letra). Contratos pendientes: [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md). Decisiones provisionales: [0154](../preguntas/0154-decisiones-provisionales-de-ux-de-las-features-4-a-7.md). Esta sección **amplía** la vista.

**Sustituye**: las filas «Sin letra» y «Todo hecho salvo marcar» de la tabla «Línea de paso de un borrador», la fila «Borrador» de «Estados», la anatomía de la tarjeta de un borrador terminado y el menú ⋯ del borrador (ítems nuevos). El wireframe de la feature 11 de esta spec usa ya la **insignia** «◔ Lista para revisar» definida aquí (no «✎ Borrador» con una línea de paso); su línea «⚑ {n} líneas por revisar» ocupa el sitio de la línea de paso, bajo la línea de origen.

### Cómo se relacionan los estados

El estado **guardado** sigue teniendo dos valores (borrador y lista). «Lista para revisar» es un borrador al que ya no le falta nada salvo el visto bueno del usuario; se **deriva**, no se guarda.

| Lo que ve el usuario | Estado guardado | Qué significa | Filtro | Acción principal |
|---|---|---|---|---|
| **✎ Borrador** | borrador | Falta algo: lo está haciendo la app (descargar, separar, buscar la letra) o lo tiene que hacer el usuario (elegir o añadir la letra, sincronizar líneas). | Borradores | Continuar · Reintentar · Elegir la letra · Añadir la letra |
| **◔ Lista para revisar** | borrador | Pistas separadas y letra con **todas** las líneas con inicio. Da igual si lo hizo la app o el usuario. Solo falta escucharla y marcarla. | Borradores (y su casilla de la bandeja) | Revisar · Probar |
| **✓ Lista** | lista | El usuario la dio por buena; se canta con barrido. | Listas | Reproducir · Editar |
| **▤ Letra lista** | lista | El usuario la dio por buena; se canta sin barrido. | Listas | Reproducir · Editar |
| **✕ Dañada** | — | No se puede abrir o le faltan las pistas. | Todas | Menú de recuperación |

- El paso de «Lista para revisar» a «Lista» o «Letra lista» lo da **siempre el usuario** (editor, o menú ⋯ con la feature 11). La app nunca lo da sola **(decisión provisional: no hay ajuste «marcar como Letra lista automáticamente»)**.
- Una «Lista para revisar» **no** se puede poner en la cola de reproducción, ni reproducir en otra pantalla, ni exportar a video desde la tarjeta: para eso hay que marcarla. Sí se puede **probar** (abajo).
- Si a una «Lista para revisar» se le borra el tiempo de una línea o se le quita la letra, vuelve a «✎ Borrador» con su línea de paso.

### Tarjeta «Lista para revisar»

```
┌──────────────────────────┐
│ PORTADA 16:9             │  sin botón ▶ redondo (no es una Lista)
├──────────────────────────┤
│ Semestre de Otoño                │
│ Artista · 3:48                   │
│ ◐ Neón · del álbum               │
│ (◔ Lista para revisar)      [⋯]  │  ← insignia: icono `list-checks` + texto, colores de `info`
│ Letra elegida automáticamente    │  ← línea de origen (t-pequeno, texto-2); solo si la eligió la app
│ ⚑ 4 líneas por revisar           │  ← feature 11 (si existe)
│ [Revisar]  [▶ Probar]            │
└──────────────────────────┘
```

| Elemento | Comportamiento |
|---|---|
| **Insignia** | `bib.estado.revisar` con icono `list-checks` 14 px, fondo `info-tenue` y texto `info`. `title` con `bib.estado.revisar.ayuda`. Se distingue de «✎ Borrador» (contorno `aviso`) y de «✓ Lista» (`exito`) por icono y texto, no solo por color. |
| **Línea de origen** | `bib.prep.origen.auto` mientras la letra la haya elegido la app y la canción no se haya revisado (0153 §4). Si además se corrigió el desfase: `bib.prep.origen.autoCorregida`. Cuando la letra la eligió, pegó o importó el usuario, no hay línea de origen. |
| **Revisar** (secundario, icono `list-checks`) | Abre el Editor de la canción (con la feature 11, en su revisión guiada). Es la acción de la **portada**, de **Intro** y de **Espacio**. Durante una sesión en otra pantalla: candado y diálogo `edi.bloqueo`. |
| **▶ Probar** (fantasma, icono `play`) | Abre el reproductor local a pantalla completa con la canción tal como está, igual que «▶ Reproducir» de una Lista (pantalla de título, instrumental, voz guía con su ajuste), pero **sin** cambiar su estado. Al salir se vuelve a la Biblioteca con el foco en la tarjeta y aparece el toast `bib.prep.toast.probada` con [Marcar como lista] y [Revisar] (10 s). [Marcar como lista] hace lo mismo que el botón del editor (con el aviso de líneas dudosas de la feature 11 si procede). Durante una sesión en otra pantalla: `aria-disabled` con `bib.prep.probar.sesion` (solo hay un transporte audible). **(Decisión provisional: una «Lista para revisar» se puede probar desde la Biblioteca, pero no encolar.)** |
| **Ancho** | Los dos botones caben en una fila desde 240 px, como «Reproducir» y «Editar». |
| **Menú ⋯** | *Revisar*, *Probar*, *(feature 11: Marcar como lista · Marcar como letra lista)*, *Editar datos*, *Aplicar tema…*, *(feature 9: Exportar paquete… · Exportar la letra…)*, *Mostrar en la carpeta*, *Eliminar…*. «Revisar» sustituye a «Continuar». |
| **Modo selección** | Se puede seleccionar; los botones se ocultan como en las demás tarjetas. |
| **Lectores de pantalla** | `bib.aria.tarjeta` usa como estado «Lista para revisar» y, como línea de paso, la de origen (y la de la feature 11). |
| **Al llegar a este estado con la Biblioteca abierta** | La insignia y los botones cambian en vivo, sin mover la tarjeta ni el foco (regla de siempre). |

### Línea de paso de un borrador: filas nuevas

Se añaden a la tabla de la spec base (misma prioridad: trabajo activo, luego problemas, luego lo que falta):

| Situación | Texto | Extra |
|---|---|---|
| Buscando la letra (trabajo vivo) | ⟳ Buscando la letra… | barra indeterminada |
| Comprobando la letra con la voz | ⟳ Comprobando la letra… | barra indeterminada |
| Ajustando los fines | ⟳ Ajustando los fines… | barra indeterminada |
| Hay candidatas y ninguna segura | Elige la letra · {n} candidatas | botón **Elegir la letra** (abre Letra, spec 05) |
| No se encontró ninguna | No encontramos la letra | botón **Añadir la letra** |
| Instrumental según LRCLIB | Instrumental, según LRCLIB | botón **Añadir la letra** |
| La búsqueda falló por red o servicio | Letra pendiente: sin conexión | botón **Reintentar** (repite la búsqueda sin salir de la Biblioteca) |
| Sin letra y sin búsqueda (interruptor desactivado o canción anterior a 0.2.2) | Falta la letra | botón **Continuar** (como hoy) y «Preparar» en el ⋯ |
| Todo hecho salvo marcar | (no hay línea de paso: la tarjeta pasa a «Lista para revisar») | Revisar · Probar |

- «Elige la letra», «No encontramos la letra» e «Instrumental…» van en `texto-1` con icono `circle-alert` en `aviso` (necesitan al usuario); «Letra pendiente…» con icono `wifi-off` en `texto-2`; «Falta la letra» sigue en `texto-2` sin icono.
- Si la separación sigue en curso y la letra ya tiene resultado, manda el trabajo activo (regla de siempre); el resultado de la letra se ve al terminar.

### «Preparar» una canción

Ítem nuevo del menú ⋯ de un **borrador**, tras «Continuar»: **«Preparar»** (`bib.prep.menu`, icono `wand-sparkles`). Es la misma operación que lanza la feature 8 para varias canciones.

| Aspecto | Comportamiento |
|---|---|
| **Qué hace** | Continúa la cadena de la spec 04 desde el primer paso pendiente: descargar (YouTube con la descarga pendiente), separar, buscar la letra, comprobarla, ajustar los fines. Nunca sustituye una letra existente ni toca tiempos editados. |
| **Cuándo aparece** | En borradores a los que les falta algún paso que la app puede hacer sola. No aparece en «Lista para revisar», Listas, Letra lista ni Dañadas, ni en una canción que ya se está preparando. |
| **Privacidad** | Es una búsqueda **iniciada por el usuario**: funciona aunque «Buscar la letra automáticamente» esté desactivado. El ítem lleva la descripción `bib.prep.menu.ayuda` (segunda línea del ítem, `texto-3`) cuando va a buscar letra. |
| **Al pulsar** | Sin diálogo. Toast `bib.prep.toast.preparando`; la tarjeta muestra su línea de paso. Con una sola canción, el resultado llega con el toast de la spec 04. |
| **Canciones de antes de 0.2.2** | Los borradores que ya existen no se preparan solos al actualizar: se preparan con este ítem o con «Preparar» de la selección múltiple **(decisión provisional)**. Los que **no tienen letra** siguen la cadena completa. Los que **ya tienen letra** de una versión anterior (sin la marca de letra intacta; main lo dice con `prepararFinesSinMarca`) no reciben «Preparar»: reciben **«Ajustar los fines…»** (fila siguiente), que **solo** pone fin a las líneas que no lo tienen, donde la voz se para claramente, y **solo tras confirmar**. Nunca mueve inicios ni fines ya puestos, nunca toca las palabras ni corrige el desfase, y no busca letra ni usa la red (revisión 2026-11-22, [ADR 0025](../adr/0025-preparacion-desatendida-y-datos-de-la-cancion-automaticos.md), respuesta a [0278](../preguntas/0278-las-letras-del-mvp-y-de-0-2-1-no-tienen-intacta-y-preparar-no-hace-nada.md); provisional, 0154 n.º 18). |
| **«Ajustar los fines…»** (tarjetas con `prepararFinesSinMarca`) | Ítem del menú ⋯ (`bib.prep.fines.menu`, icono `wand-sparkles`) en el sitio de «Preparar», en borradores, «Lista para revisar» y **también en Lista y Letra lista** con letra sin marca y alguna línea sin fin (la canción no cambia de estado). El nombre es otro porque hace otra cosa: no prepara la canción, solo pone fines. Abre siempre el diálogo de confirmación `bib.prep.fines.dialogo` (abajo; foco inicial en [Cancelar]). Al confirmar: `preparar([id], { finesSinMarca: true })`, toast `bib.prep.fines.toast` con [Ver la letra] (abre el editor) y, al terminar, `bib.prep.fines.toast.fin` con el número de fines puestos. Sin líneas sin fin, el ítem no aparece. Durante una sesión en otra pantalla, como «Preparar» (disponible: no toca lo que suena). |

**Diálogo `bib.prep.fines.dialogo`** (480 px)
```
┌ ¿Ajustar los fines de «Semestre de Otoño»? ──────────────────┐
│ Esta letra viene de una versión anterior de Shinobi Karaoke  │
│ y puede tener cambios tuyos.                                 │
│ · Solo pondremos fin a las 31 líneas que no lo tienen, donde │
│   la voz se para claramente.                                 │
│ · No moveremos ningún inicio, ni los fines que ya tienes, ni │
│   la letra entera.                                           │
│ · Podrás quitar esos fines desde el editor («Quitar esos     │
│   fines»).                                                   │
│                              [Cancelar] [Ajustar los fines]  │
└──────────────────────────────────────────────────────────────┘
```
Foco inicial en [Cancelar]; Esc = Cancelar (no cambia nada).

**Lo que esta sección ofrece a las features 8 y 11** (respuesta a sus notas de coordinación): (1) «Preparar» es una operación de main que se pide para una o varias canciones y que, sin ejecutarse, dice para cada una si aplica y qué hará (0153 §7); (2) continúa desde el primer paso pendiente sin sustituir letra ni tiempos; (3) el resultado por canción es uno de: lista para revisar, elige la letra, no encontramos la letra (o instrumental), letra pendiente, error o cancelada; (4) al cerrar y reabrir, las preparaciones en cola se retoman solas (spec 04); (5) «Revisar» navega al editor y la feature 11 decide el modo; (6) hay sitio para una línea bajo la insignia; (7) «Lista para revisar» es siempre `estado: borrador`.

### Bandeja de pendientes

Una fila bajo la barra de herramientas, **solo si hay algo pendiente**:

```
│ [Todas 29|Listas 12|Borradores 17]  Agrupar por […]  [☑ Seleccionar]  [🔍 …]              │
│ Pendientes de ti:  [◔ 9 listas para revisar]  [! 3 esperan letra]  [✕ 1 con error]        │
```

| Casilla | Cuenta |
|---|---|
| **Listas para revisar** | Borradores en «Lista para revisar». |
| **Esperan letra** | Borradores sin letra que necesitan al usuario o a la red: «Elige la letra», «No encontramos la letra», «Instrumental…», «Letra pendiente…» y «Falta la letra». |
| **Con error** | Borradores con un paso en error o interrumpido. |

| Aspecto | Regla |
|---|---|
| **Qué son** | Botones de alternancia (`aria-pressed`) con icono, número y texto. Solo se muestran los que tienen 1 o más canciones; si todos están a 0, la fila no existe. Los números se actualizan en vivo. |
| **Pulsar uno** | Filtra la rejilla a esas canciones: el filtro de estado pasa a «Borradores» y se aplica además la casilla. Se combina con la búsqueda y la agrupación. Solo una casilla activa a la vez. |
| **Quitarlo** | Pulsar de nuevo la casilla o elegir cualquier opción del filtro de estado. |
| **Persistencia** | Como el filtro de estado: dura la sesión. |
| **Con selección múltiple** | La combinación natural: casilla «Esperan letra» → «Seleccionar visibles» → «Preparar» (feature 8). La bandeja sigue visible en el modo selección. |
| **Sin resultados** | Si la casilla activa se queda en 0 (porque las canciones cambiaron de estado), se desactiva sola y la rejilla vuelve a «Borradores». Con búsqueda sin coincidencias, los mensajes de siempre. |
| **Ancho** | Una fila a 1024 px; con el panel de cola abierto, las casillas pueden pasar a una segunda línea sin partir su texto. |
| **Teclado y lectores** | Grupo con nombre `bib.bandeja.titulo`; cada casilla anuncia su número y si está activa. El cambio de resultados se anuncia con `bib.anuncio.resultados` (fase 3). |

### Avisos de reanudación

Encima de la bandeja, como aviso en línea (`info`) que se puede cerrar:

| Situación | Aviso |
|---|---|
| Al abrir la app había preparaciones a medias y se han retomado (spec 04) | `bib.prep.retomando` con [Detener] (pausa la cola; el aviso pasa al de abajo). Se cierra solo cuando terminan. |
| Al abrir la app la cola estaba en pausa | `bib.prep.enPausa` con [Reanudar]. |

### Estados (0.2.2 · feature 5, biblioteca)

| Estado | Presentación |
|---|---|
| Vacío | Biblioteca vacía: sin bandeja. |
| Cargando / procesando | Tarjetas con las líneas ⟳ nuevas. |
| Necesita al usuario | Línea con `circle-alert` y su botón; cuenta en «Esperan letra». |
| Sin red | «Letra pendiente: sin conexión» con [Reintentar]; la separación no se ve afectada. |
| Error | Como en 0.2.1 (insignia y línea de error); cuenta en «Con error». |
| Éxito | Tarjeta «Lista para revisar». |
| Sesión en otra pantalla | «Revisar», «Elegir la letra» y «Añadir la letra» muestran `edi.bloqueo`; «Probar» inactivo; «Preparar» y [Reintentar] siguen disponibles (no editan nada que suene). |

### Microcopy (0.2.2 · feature 5, biblioteca)

| Clave | Texto |
|---|---|
| `bib.estado.revisar` | Lista para revisar |
| `bib.estado.revisar.ayuda` | Ya tiene pistas y letra sincronizada. Escúchala y márcala como lista para poder cantarla. |
| `bib.prep.origen.auto` | Letra elegida automáticamente |
| `bib.prep.origen.autoCorregida` | Letra elegida automáticamente · desfase corregido |
| `bib.accion.revisar` | Revisar |
| `bib.accion.revisar.aria` | Revisar «{título}» |
| `bib.accion.probar` | Probar |
| `bib.accion.probar.aria` | Probar «{título}» a pantalla completa |
| `bib.prep.probar.sesion` | No se puede probar mientras el reproductor está abierto en otra pantalla. |
| `bib.prep.toast.probada` | ¿Qué tal «{título}»? — [Marcar como lista] [Revisar] |
| `bib.paso.letra.buscando` | Buscando la letra… |
| `bib.paso.letra.comprobando` | Comprobando la letra… |
| `bib.paso.letra.fines` | Ajustando los fines… |
| `bib.paso.letra.elige` | Elige la letra · {n} candidatas · (n = 1) Elige la letra · 1 candidata |
| `bib.paso.letra.noEncontrada` | No encontramos la letra |
| `bib.paso.letra.instrumental` | Instrumental, según LRCLIB |
| `bib.paso.letra.pendiente` | Letra pendiente: sin conexión · Letra pendiente: el servicio no responde |
| `bib.accion.elegirLetra` | Elegir la letra |
| `bib.accion.anadirLetra` | Añadir la letra |
| `bib.prep.menu` | Preparar |
| `bib.prep.menu.ayuda` | Busca la letra en LRCLIB con el título y el artista |
| `bib.prep.toast.preparando` | Preparando «{título}». Te avisaremos al terminar. |
| `bib.prep.fines.menu` | Ajustar los fines… |
| `bib.prep.fines.dialogo` | Título: ¿Ajustar los fines de «{título}»? · Cuerpo: Esta letra viene de una versión anterior de Shinobi Karaoke y puede tener cambios tuyos. · Solo pondremos fin a las {n} líneas que no lo tienen, donde la voz se para claramente. · No moveremos ningún inicio, ni los fines que ya tienes, ni la letra entera. · Podrás quitar esos fines desde el editor («Quitar esos fines»). — [Cancelar] [Ajustar los fines] · (n = 1) … a la línea que no lo tiene … |
| `bib.prep.fines.toast` | Ajustando los fines de «{título}»… — [Ver la letra] |
| `bib.prep.fines.toast.fin` | Pusimos fin a {k} de {n} líneas de «{título}». Las demás no tenían una pausa clara. — [Ver la letra] · (k = 0) No encontramos pausas claras en «{título}»: no hemos cambiado nada. |
| `bib.bandeja.titulo` | Pendientes de ti: |
| `bib.bandeja.revisar` | {n} listas para revisar · (n = 1) 1 lista para revisar |
| `bib.bandeja.letra` | {n} esperan letra · (n = 1) 1 espera letra |
| `bib.bandeja.error` | {n} con error |
| `bib.prep.retomando` | Retomando {n} canciones que quedaron a medias al cerrar. — [Detener] · (n = 1) Retomando 1 canción que quedó a medias al cerrar. — [Detener] |
| `bib.prep.enPausa` | Hay {n} canciones en pausa, a medio preparar. — [Reanudar] · (n = 1) Hay 1 canción en pausa, a medio preparar. — [Reanudar] |
| `bib.menu.revisar` | Revisar · Probar |

### Criterios de aceptación (0.2.2 · feature 5, biblioteca)

- F5-B1. Un borrador con la separación completada y todas sus líneas con inicio muestra la insignia «Lista para revisar» (icono y texto, colores `info`), sin línea «Falta…», con «Revisar» y «▶ Probar» en una fila desde 240 px; cuenta en el filtro *Borradores* y no en *Listas*; su `estado` guardado es `borrador`.
- F5-B2. Portada, Intro, Espacio y «Revisar» abren el editor de esa canción; «Probar» abre el reproductor a pantalla completa sin cambiar el estado y, al salir, el foco vuelve a la tarjeta y aparece `bib.prep.toast.probada`, cuyo [Marcar como lista] la deja «✓ Lista».
- F5-B3. Una «Lista para revisar» no ofrece «A la cola», «Reproducir en otra pantalla…» ni «Exportar video…»; durante una sesión, «Revisar» muestra `edi.bloqueo` y «Probar» está `aria-disabled` con su motivo.
- F5-B4. Cada resultado de la preparación muestra su línea de paso y su botón según la tabla: «Elige la letra · {n} candidatas» → Letra en A con las candidatas; «No encontramos la letra» → Letra con su banner; «Letra pendiente…» → [Reintentar] repite la búsqueda sin salir de la Biblioteca.
- F5-B5. Con la letra elegida por la app, la tarjeta muestra `bib.prep.origen.auto` (o `.autoCorregida`) hasta que la canción se revisa; con la letra elegida por el usuario, no la muestra.
- F5-B6. «Preparar» del ⋯ de un borrador sin letra lanza la búsqueda aunque el interruptor de Ajustes esté desactivado, muestra `bib.prep.toast.preparando` y la tarjeta pasa por las líneas ⟳; no aparece en «Lista para revisar», Listas ni Dañadas. En un borrador con letra del usuario, no la sustituye.
- F5-B12. Una canción con letra anterior a 0.2.2 sin marca y líneas sin fin (fixture con `prepararFinesSinMarca`) muestra en el ⋯ «Ajustar los fines…» y no «Preparar»; también si es Lista. Pulsarlo abre `bib.prep.fines.dialogo` con el número de líneas sin fin y el foco en [Cancelar]; Cancelar o Esc no llaman a main. Confirmar llama a `preparar([id], { finesSinMarca: true })` y, al terminar, solo cambian los `fin_ms` que eran `null` (ahora con `origen_fin: "preparacion"`); todos los `inicio_ms`, los fines ya fijados, las palabras y `offset_ms` son idénticos (comparación del archivo), no hubo ninguna petición de red y el estado de la canción no cambia. «Quitar esos fines» del editor los devuelve a `null`.
- F5-B13. En «Preparar» de la selección múltiple, una canción así sale con `bib.acc.preparar.nota.finesSinMarca` y el diálogo muestra `bib.acc.preparar.aviso.finesSinMarca`; confirmar ese diálogo vale como confirmación (no aparece otro) y main recibe `finesSinMarca: true`.
- F5-B7. Con 9 listas para revisar, 3 que esperan letra y 1 con error, la bandeja muestra las tres casillas con sus números; pulsar una filtra la rejilla a esas canciones con el filtro en *Borradores*; pulsarla de nuevo o elegir otro filtro la quita; con todo a 0 la fila no existe.
- F5-B8. Al cambiar de estado una canción con la Biblioteca abierta, su tarjeta y los números de la bandeja se actualizan sin mover el foco ni reordenar.
- F5-B9. Tras reabrir la app con preparaciones a medias aparece `bib.prep.retomando`; [Detener] pausa la cola y muestra `bib.prep.enPausa`; [Reanudar] la retoma.
- F5-B10. `bib.aria.tarjeta` dice «Lista para revisar» y la línea de origen; cada casilla de la bandeja anuncia número y estado; todo se opera con teclado.
- F5-B11. Capturas en `docs/ux/revisiones/0.2.2-feature-5/`, nombre `biblioteca-1280x800-100-{estado}.png`: `lista-para-revisar` (con una Lista, una Lista para revisar, un «Elige la letra» y un «No encontramos la letra»), `bandeja`, `bandeja-filtrada`, `retomando`, y `biblioteca-1024x640-100-bandeja`.

**Verificación manual** (guía de `docs/Test-manuales/0.2.2/`): con la biblioteca real, usar «Preparar» en los 5 borradores sin letra del lote del 10 de noviembre y anotar a qué estado llega cada uno; comprobar que la diferencia entre «Borrador», «Lista para revisar» y «Lista» se entiende de un vistazo en una TV; probar una canción desde la tarjeta y marcarla como lista desde el toast.

## 0.2.2 · Feature 7 — Lotes en la Biblioteca

Origen: [plan 0.2.2, feature 7](../versiones/0.2.2/plan-4.md) y [propuesta 021](../propuestas/021-importacion-por-lotes.md). El lote se arma en [03 · 0.2.2 · Feature 7](03-anadir-cancion.md#022--feature-7--importación-por-lotes) y avanza en [04 · 0.2.2 · Feature 7](04-progreso-pipeline.md#022--feature-7--cola-de-preparación-de-un-lote). Aquí solo está lo que cambia en la Biblioteca.

**Sustituye**: el criterio 9 (arrastrar sobre la ventana) y las claves `bib.arrastrar.varios` y `bib.vacia.cuerpo`.

| Elemento | Comportamiento |
|---|---|
| **Arrastrar sobre la ventana** | Un archivo: como hoy (abre la vista 03 con él). **Varios archivos o una carpeta**: abre la vista 03 en modo lote con todos (ya no se usa solo el primero ni se muestra «Añade las canciones de una en una»). Los archivos de paquete (`.shinobi`, feature 9) no entran en el lote: si se sueltan solos, los atiende la feature 9; mezclados con audio, se ignoran con el aviso `add.lote.paqueteIgnorado` (spec 03). |
| **Zona de soltar** | Al arrastrar varios elementos, el velo de la ventana dice `bib.arrastrar.soltarVarios`. |
| **Al confirmar un lote** (spec 03) | Se vuelve a la Biblioteca: filtro en «Todas», agrupación como estuviera, las canciones nuevas ya en su sitio (en «Fecha de añadido», en «Hoy»). La primera tarjeta nueva recibe el foco y se desplaza a la vista. Aviso en línea `bib.import.anadidas` con [Ver actividad] (abre el panel de actividad); se cierra solo al terminar la tanda o con [×]. Se anuncia una vez. |
| **Tarjetas del lote** | Las líneas de paso de siempre («En cola para descargar», «En cola para separar», ⟳ …) y las de la feature 5. Sin marca propia de «lote». |
| **Seguimiento** | La bandeja de pendientes (feature 5) es el resumen permanente del lote: listas para revisar, esperan letra, con error. El resumen de la tanda está en el panel de actividad (spec 04). |
| **Estado vacío** | `bib.vacia.cuerpo` menciona que se pueden añadir varias a la vez. |
| **Rendimiento** | Añadir 50 canciones de golpe no bloquea la rejilla más de 1 s ni mueve el foco fuera de la primera tarjeta nueva. |

### Microcopy (0.2.2 · feature 7, biblioteca)

| Clave | Texto |
|---|---|
| `bib.arrastrar.soltarVarios` | Suelta para añadir {n} canciones · (carpeta) Suelta para añadir las canciones de la carpeta |
| `bib.import.anadidas` | Se añadieron {n} canciones y se están preparando solas. — [Ver actividad] · (búsqueda automática desactivada) Se añadieron {n} canciones. Se están separando; la letra tendrás que buscarla tú. — [Ver actividad] |
| `bib.vacia.cuerpo` | Añade tu primera canción desde un archivo de tu ordenador o un enlace de YouTube, o varias a la vez desde una carpeta o una lista. Shinobi Karaoke separará la voz para que puedas cantar encima. |

`bib.arrastrar.varios` deja de usarse.

### Criterios de aceptación (0.2.2 · feature 7, biblioteca)

- F7-B1. Arrastrar 3 archivos de audio (o una carpeta con 3) sobre la ventana abre la vista 03 en modo lote con 3 filas; arrastrar 1 se comporta como en 0.2.1. No aparece «Añade las canciones de una en una.».
- F7-B2. Tras confirmar un lote de 5, la Biblioteca muestra las 5 tarjetas nuevas con su línea de paso, el foco en la primera, el aviso `bib.import.anadidas` y el botón de actividad con «Preparando {i} de 5».
- F7-B3. Con 50 canciones añadidas de una vez (dobles), la rejilla responde en menos de 1 s y el foco no se pierde.
- F7-B4. Captura `docs/ux/revisiones/0.2.2-feature-7/biblioteca-1280x800-100-lote-anadido.png`.

## 0.2.3 · Feature 1 — Coros en la letra exportada

Origen: [plan 5](../versiones/0.2.3/plan-5.md) y [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md) n.º 8. Amplía [«Exportar la letra a `.lrc`»](#exportar-la-letra-a-lrc) (desde la tarjeta, la selección y Editor › Funciones). La tarjeta de la Biblioteca **no cambia** en 0.2.3 (no muestra cantantes).

- El `.lrc` **no lleva cantantes** (no hay un estándar). Las líneas de **Coro** se escriben **entre paréntesis** si su texto no los tiene ya, para que al volver a importarlas la sugerencia «Marcarlas como coro» las reconozca. Las demás líneas, igual que en 0.2.2.
- El paquete de canción y la copia de seguridad llevan el reparto con la canción (sin interfaz nueva).

- C1-B1. Exportar a `.lrc` una canción con dos líneas de coro, una guardada como «de puntillas» y otra como «(uh, uh)», escribe «(de puntillas)» y «(uh, uh)» (sin paréntesis dobles); ninguna línea lleva nombre de cantante.
- C1-B2. Exportar e importar un paquete de una canción con reparto conserva cantantes, nombres, partes y nivel de coros.
