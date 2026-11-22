# 08 — Ajustes y Acerca de

- Paso del pipeline: — (transversal)
- ADRs: [0002](../adr/0002-licencia-del-proyecto.md), [0003](../adr/0003-fuente-de-audio.md), [0004](../adr/0004-separacion-voz-instrumental.md), [0006](../adr/0006-persistencia-y-modelo-de-datos.md)
- Restricciones: [arquitectura.md "Restricciones e implicaciones para UX" §7](../arquitectura.md)
- Preguntas respondidas: [0003](../preguntas/0003-elegir-calidad-o-rapidez-separacion.md) (sustituida en parte), [0019](../preguntas/0019-calidad-por-defecto-y-rapido-con-consentimiento.md) (sin elección de modo: sección informativa y "Volver a Calidad"), [0047](../preguntas/0047-temas-asignados-edicion-y-borrado.md) (tema predeterminado y borrado de temas)
- 0.2.0, fase 3 (2026-11-09): sección «Temas» con el tema predeterminado y la gestión del catálogo; «Volver» regresa a la vista de origen. Ver [Fase 3 · Temas y biblioteca](#fase-3-de-020--temas-y-biblioteca). Respondidas: [0052](../preguntas/0052-predeterminado-y-canciones-que-dependen-de-el.md) (A1, B1, C1) y [0055](../preguntas/0055-textos-de-predeterminado-anterior-y-ajustes-de-la-fase-3.md) (textos de «Tema predeterminado anterior», aviso de referencias que faltan).
- 0.2.0, fase 4 (2026-11-11): sección «Reproductor» con la duración de la cuenta entre canciones de la cola ([0049](../preguntas/0049-politica-cola-de-reproduccion.md): configurable, 4 s por defecto). Ver [Fase 4 de 0.2.0 — ventana secundaria y cola](#fase-4-de-020--ventana-secundaria-y-cola).
- 0.2.0, fase 10 (2026-11-21): **número de compilación** `<versión>-<N>` en «Acerca de» (con el canal y el commit, y [Copiar versión]) y **línea de versión** común a todos los «Copiar detalles» y a «Copiar información para soporte». Ver [Fase 10 de 0.2.0 — número de compilación](#fase-10-de-020--número-de-compilación). Pregunta abierta: [0142](../preguntas/0142-numero-de-compilacion-canal-de-desarrollo-y-notas.md) (origen de N, commit y canal; provisional tomado).

## Objetivo
Una vista mínima para: (1) ver **con qué modelo se separa la voz** y, solo si se usa el modelo Rápido, **volver al modelo Calidad** (decisión del usuario, 0019: no se puede elegir modo; Rápido solo se ofrece tras un fallo de Calidad, specs 01 y 04); (2) consultar **Acerca de / Licencias** (obligatorio: GPL-3.0 y créditos de terceros) y releer el aviso de YouTube. Nada más en el MVP.

## Wireframe
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ‹ Biblioteca │ Ajustes                                                    │
├──────────────────────────────────────────────────────────────────────────┤
│  Separación de voz                                                       │
│  Tu equipo: tarjeta gráfica NVIDIA (8 GB)                                │
│  Modelo en uso: Calidad                                                  │
│  Deja poca voz de fondo. Una canción de 4 minutos tarda entre 1 y 2      │
│  minutos en tu equipo.                                                   │
│ ──────────────────────────────────────────────────────────────────────── │
│  Acerca de Shinobi Karaoke                                               │
│  Versión 0.1.0 · Software libre con licencia GPL-3.0 o posterior.        │
│  [Ver licencia]  [Créditos y licencias de terceros]  [Web del proyecto]  │
│  [Aviso sobre YouTube]  [Abrir carpeta de datos]  [Copiar información    │
│   para soporte]                                                          │
│  Letras: LRCLIB (lrclib.net). Separación: audio-separator y MelBand      │
│  RoFormer (Kimberley Jensen); modelo Rápido: comunidad UVR.              │
└──────────────────────────────────────────────────────────────────────────┘
```

**Variante con el modelo Rápido** (el usuario lo aceptó tras un fallo de Calidad; `separacion.modo = 'rapido'` con consentimiento y modelo verificado)
```
│  Separación de voz                                                       │
│  Tu equipo: sin tarjeta gráfica compatible (se usa el procesador)        │
│  Modelo en uso: Rápido                                                   │
│  Más ligero; puede dejar algo de voz de fondo. Una canción de 4 minutos  │
│  tarda entre 3 y 7 minutos en tu equipo.                                 │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ ⚠ Lo usas bajo tu responsabilidad desde el 5 nov 2026: sus       │    │
│  │   autores no han declarado licencia. Créditos y licencias        │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Modelo Calidad: deja menos voz de fondo. En tu equipo, una canción de   │
│  4 minutos tardaría entre 6 y 15 minutos. Hay que descargar 913 MB.      │
│  [ Volver a Calidad… ] (secundario)                                      │
│  El cambio se aplica a las próximas separaciones. Las canciones ya       │
│  separadas no cambian.                                                   │
```

**Volviendo a Calidad** (sustituye al botón; el modelo Rápido sigue en uso mientras tanto)
```
│  Descargando el modelo Calidad… 34 % · 310 MB de 913 MB    [ Cancelar ]  │
│  ████████████░░░░░░░░░░░░░░░░░░░░░░░                                     │
│  Mientras tanto se sigue usando el modelo Rápido.                        │
```

**Error al volver a Calidad**
```
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ ✕ Sin conexión a internet. Comprueba tu conexión y vuelve a      │    │
│  │   intentarlo. Sigues usando el modelo Rápido.                    │    │
│  │   [ Reintentar ]                                                 │    │
│  └──────────────────────────────────────────────────────────────────┘    │
```

**Diálogo "¿Volver al modelo Calidad?"** (siempre, también si Calidad ya está descargado: desde Ajustes no se puede volver a Rápido)
```
┌────────────────────────────────────────────────────────────┐
│ ¿Volver al modelo Calidad?                                 │
│                                                            │
│ Deja menos voz de fondo, pero en tu equipo cada canción de │
│ 4 minutos tardará entre 6 y 15 minutos en separarse.       │
│ Hay que descargar 913 MB.        (solo si no está)         │
│                                                            │
│ Desde Ajustes no podrás volver al modelo Rápido: solo se   │
│ ofrece si el modelo Calidad falla.                         │
│                                                            │
│   [ Cancelar ] (secundario)  [ Volver a Calidad ] (primario,│
│                                                foco inicial)│
└────────────────────────────────────────────────────────────┘
```

(Tamaños de modelo y tiempos: se leen del manifiesto de runtime — Rápido 59 MB, Calidad 913 MB — y la estimación de tiempo es el factor medido en este equipo tras la primera separación con ese modelo o, si no hay, el de referencia del manifiesto (o la estimación del ADR 0004 si es `null`), × 4 min. En los textos van como `{n}`, `{a}`, `{b}`; las cifras de los ejemplos son ilustrativas.)

## Componentes e interacciones
| Elemento | Comportamiento |
|----------|----------------|
| Sección "Separación de voz" | **Solo informativa**: no hay grupo de radio ni forma de elegir modelo (ni Automático, ni Calidad, ni Rápido). Muestra el equipo (`aj.sep.equipo`), el **modelo efectivo** (el que usará la próxima separación: si el modo guardado es Rápido pero falta su modelo o el consentimiento, Calidad) y su estimación de tiempo para 4 minutos (`aj.sep.tiempo`, o `aj.sep.tiempo.aprox` si el factor no está medido). Con Calidad no hay acciones. |
| Equipo (`aj.sep.equipo`) | NVIDIA usable: "tarjeta gráfica NVIDIA ({n} GB)"; Apple Silicon: "Mac con chip Apple"; sin GPU: "sin tarjeta gráfica compatible (se usa el procesador)"; NVIDIA rebajada por el diagnóstico: "tarjeta gráfica NVIDIA (no se puede usar: se usa el procesador)". |
| Aviso de Rápido | Solo con Rápido en uso: banner `aviso` en línea con `aj.sep.rapido.aviso` (fecha de `rapido_aceptado`, formato largo local) y enlace "Créditos y licencias" (abre el mismo diálogo de créditos). |
| "Volver a Calidad…" | Solo con Rápido en uso. Bajo la descripción de Calidad (`aj.sep.calidad.info`, con `aj.sep.descarga` si Calidad no está descargado y verificado). Abre el diálogo `aj.sep.dialogo` (Esc = Cancelar; foco inicial en "Volver a Calidad"). Al confirmar → `runtime.volverACalidad()`: si hay que descargar, el botón se sustituye por la barra en línea (`aj.sep.descargando` + [Cancelar] + `aj.sep.mientras`); el modelo en uso **solo cambia** cuando Calidad está descargado y verificado. Éxito: la sección pasa a la variante Calidad, toast `aj.sep.toast.calidad` y anuncio a lectores de pantalla. Cancelar la descarga: vuelve el botón, sin mensaje (lo descargado se conserva y la próxima vez continúa). Error: banner `error` en línea con el texto del código (`SIN_CONEXION`, `SIN_ESPACIO`, servidor, verificación: mismos textos que B4 de la spec 01) + `aj.sep.error.sigue` y [Reintentar] (repite sin diálogo). |
| Salir de Ajustes durante la descarga | La descarga continúa en segundo plano; al volver a Ajustes se ve su progreso. Al cerrar la app se interrumpe sin diálogo (se conserva lo descargado). Detalle técnico en [0021](../preguntas/0021-detalles-tecnicos-de-la-oferta-de-rapido-y-volver-a-calidad.md) §2. |
| Separaciones en curso o en cola | La separación en curso no cambia; cada separación de la cola usa el modelo vigente **al empezar** ([0005](../preguntas/0005-viabilidad-detalles-ux-fase-0.md) §10). La vista de progreso muestra el modelo realmente usado. |
| Ver licencia | Diálogo con el texto de la GPL-3.0 (desplazable). |
| Créditos y licencias de terceros | Diálogo con `THIRD_PARTY_NOTICES.md` renderizado (UVR y autores de modelos, fuentes OFL, FFmpeg, yt-dlp, Electron…). |
| Aviso sobre YouTube | Diálogo de solo lectura con el texto del aviso legal (spec 03) y la fecha de aceptación. |
| Abrir carpeta de datos | Abre el directorio de datos en el explorador del sistema. |
| Copiar información para soporte | Copia versión, SO con su versión (p. ej. `macOS 14.5`) y arquitectura real, perfil de hardware, **modelo de separación en uso** (`calidad` o `rapido (aceptado el AAAA-MM-DD)`) y dispositivo (`cuda`/`cpu`), versión de yt-dlp y fecha de su última comprobación (útil ante `YOUTUBE_BLOQUEADO`, ya que se actualiza solo). Los datos que aún no existen (p. ej. abierto desde B1, B6 o B0 de la spec 01, sin motor instalado) se copian como `sin instalar`, nunca se omite la línea ni falla. Toast "Información copiada". |
| Diálogo Acerca de desde el primer arranque (B1, B5, B6 de la spec 01) | Mismo bloque "Acerca de", sin la sección "Separación de voz". "Abrir carpeta de datos" se muestra solo si la carpeta existe. "Aviso sobre YouTube" muestra "No aceptado todavía" si procede. |
| Teclado | Ctrl/Cmd+, abre esta vista; Esc vuelve. |

## Estados
| Estado | Presentación |
|--------|--------------|
| Normal | Wireframe. |
| Normal con Rápido | Variante con el modelo Rápido. |
| Volviendo a Calidad | Barra en línea en lugar del botón, con Cancelar; Rápido sigue en uso. |
| Error al volver a Calidad | Banner `error` en línea con el texto del primer arranque + `aj.sep.error.sigue` y [Reintentar]; el modelo no cambia. |
| Sin motor instalado (diálogo Acerca de del primer arranque) | Sin sección "Separación de voz". |

## Microcopy
| Clave | Texto |
|-------|-------|
| `aj.titulo` | Ajustes |
| `aj.sep.titulo` | Separación de voz |
| `aj.sep.equipo` | Tu equipo: {descripción} |
| `aj.sep.modelo` | Modelo en uso: Calidad · Modelo en uso: Rápido |
| `aj.sep.desc.calidad` | Deja poca voz de fondo. |
| `aj.sep.desc.rapido` | Más ligero; puede dejar algo de voz de fondo. |
| `aj.sep.tiempo` | Una canción de 4 minutos tarda entre {a} y {b} minutos en tu equipo. |
| `aj.sep.tiempo.aprox` | Una canción de 4 minutos tarda entre {a} y {b} minutos en tu equipo, aproximadamente. |
| `aj.sep.rapido.aviso` | Lo usas bajo tu responsabilidad desde el {fecha}: sus autores no han declarado licencia. — Créditos y licencias |
| `aj.sep.calidad.info` | Modelo Calidad: deja menos voz de fondo. En tu equipo, una canción de 4 minutos tardaría entre {a} y {b} minutos. |
| `aj.sep.descarga` | Hay que descargar {n}. ({n} con unidad, del manifiesto: "913 MB") |
| `aj.sep.boton.calidad` | Volver a Calidad… |
| `aj.sep.nota` | El cambio se aplica a las próximas separaciones. Las canciones ya separadas no cambian. |
| `aj.sep.dialogo.titulo` | ¿Volver al modelo Calidad? |
| `aj.sep.dialogo` | Deja menos voz de fondo, pero en tu equipo cada canción de 4 minutos tardará entre {a} y {b} minutos en separarse. [Hay que descargar {n}.] Desde Ajustes no podrás volver al modelo Rápido: solo se ofrece si el modelo Calidad falla. — [Cancelar] [Volver a Calidad] |
| `aj.sep.descargando` | Descargando el modelo Calidad… {p} % · {x} MB de {y} MB |
| `aj.sep.mientras` | Mientras tanto se sigue usando el modelo Rápido. |
| `aj.sep.error.sigue` | Sigues usando el modelo Rápido. |
| `aj.sep.toast.calidad` | Ya usas el modelo Calidad. |
| `aj.acerca.titulo` | Acerca de Shinobi Karaoke |
| `aj.acerca.version` | Versión {v} · Software libre con licencia GPL-3.0 o posterior. |
| `aj.acerca.botones` | Ver licencia · Créditos y licencias de terceros · Web del proyecto · Aviso sobre YouTube · Abrir carpeta de datos · Copiar información para soporte |
| `aj.acerca.creditos` | Letras: LRCLIB (lrclib.net). Separación: audio-separator y MelBand RoFormer (Kimberley Jensen); modelo Rápido: comunidad UVR. |

## Criterios de aceptación
1. La vista se abre con ⚙ o Ctrl/Cmd+, y la sección "Separación de voz" muestra el equipo, el modelo efectivo y su tiempo estimado para 4 minutos; **no** hay grupo de radio ni ningún control para elegir modelo (tampoco Automático). Un `automatico` guardado se muestra como Calidad.
2. Con Calidad en uso la sección no tiene acciones ni menciona el modelo Rápido.
3. Con Rápido en uso se muestran el aviso `aj.sep.rapido.aviso` con la fecha del consentimiento y el enlace a créditos, la descripción de Calidad (con el tamaño de descarga si falta) y "Volver a Calidad…".
4. "Volver a Calidad…" siempre pide confirmación con `aj.sep.dialogo` (con la frase de descarga solo si Calidad falta). Al confirmar, si falta, se descarga con barra en línea y cancelación; el modelo en uso solo cambia cuando Calidad está verificado. Al terminar: variante Calidad + toast `aj.sep.toast.calidad`. Al cancelar: vuelve el botón y sigue Rápido. Con error: texto del código + `aj.sep.error.sigue` + [Reintentar]; sigue Rápido.
5. El cambio de modelo no altera canciones ya separadas ni la separación en curso.
6. "Ver licencia" y "Créditos y licencias de terceros" muestran los textos completos sin conexión.
7. "Aviso sobre YouTube" muestra el texto del aviso y la fecha de aceptación (o "No aceptado todavía").
8. La vista es operable con teclado y Esc vuelve a la Biblioteca.
9. "Copiar información para soporte" incluye el modelo en uso (con la fecha del consentimiento si es Rápido), el dispositivo, la versión de yt-dlp y la fecha de su última comprobación; sin motor instalado copia `sin instalar` en los campos que falten y funciona igual desde el diálogo Acerca de del primer arranque ([0013](../preguntas/0013-huecos-ux-de-la-fase-2.md)).

## Fase 3 de 0.2.0 · Temas y biblioteca

Origen: [plan, fase 3, feature 5](../versiones/0.2.0/plan-2.md#5-temas-guardables--l) y [0047](../preguntas/0047-temas-asignados-edicion-y-borrado.md) («El tema predeterminado se tiene que habilitar en ajustes; si se borra, asignar un tema aleatorio a cada nueva canción»). Conceptos, diálogos de nombre, impacto y eliminación: [Editor · Fase 3](06-editor.md#fase-3-de-020--temas-y-biblioteca). Esta sección **amplía** el objetivo de la vista: además de separación y Acerca de, Ajustes es **el lugar donde se administra el catálogo de temas**. Se edita el **aspecto** de un tema solo desde el editor, porque necesita una canción para la vista previa; aquí se gestiona todo lo demás.

**Sustituye**: «Esc vuelve a la Biblioteca» (fila «Teclado» y criterio 8): ahora «Volver» y Esc regresan a la **vista de origen** (Biblioteca o el editor de la canción desde la que se abrió, por ⚙, Ctrl/Cmd + , o «Administrar temas…»). El botón dice `aj.volver.biblioteca` o `aj.volver.editor`.

### Dónde vive el catálogo
- **Ajustes › Temas** (sección nueva, entre «Separación de voz» y «Acerca de»): tema predeterminado y lista de temas con sus acciones. Es el único lugar con la **lista completa**.
- **Editor › Estilo**: elegir, editar el aspecto, guardar como nuevo, renombrar, duplicar y eliminar **el tema efectivo** de esa canción, y «Administrar temas…», que trae aquí.
- **Biblioteca**: asignar a artista y álbum, y aplicar a varias canciones.
No hay un diálogo aparte de gestión: así no se duplica la lista ni sus estados.

### Wireframe
```
│  Temas                                                                   │  h2
│                                                                          │
│  Tema predeterminado                                                     │  h3
│  Lo usan las canciones que no tienen tema propio, ni de su álbum ni de   │
│  su artista.                                                             │
│  [▣ Noche ninja                                           ▾ ]            │  selector
│  Ahora lo usan 9 canciones.                                              │
│                                                                          │
│  Tus temas (4)                                                           │  h3
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ [▣] Neón            14 canciones · artista Queen, 1 álbum     [⋯]  │  │
│  │ [▣] Noche ninja     Predeterminado · 9 canciones              [⋯]  │  │
│  │ [▣] Papel           Sin usar                                  [⋯]  │  │
│  │ [▣] Sol             3 canciones                               [⋯]  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│  Para cambiar el aspecto de un tema, abre una canción que lo use:        │
│  Editor › Estilo › Editar tema.                                          │
│ ──────────────────────────────────────────────────────────────────────── │
│  Separación de voz …  /  Acerca de …                                     │
```
Orden de secciones: Separación de voz · **Temas** · Acerca de.

**Sin predeterminado** (elegido así o tras borrarlo):
```
│  [ Ninguno · un tema al azar para cada canción nueva        ▾ ]          │
│  Cada canción nueva recibe al crearse un tema al azar de tus temas, si   │
│  su álbum o su artista no tienen tema. La elección se mantiene al        │
│  reabrirla.                                                              │
```
**Catálogo vacío**:
```
│  Tema predeterminado                                                     │
│  Las canciones nuevas usan el estilo incluido de Shinobi Karaoke hasta   │
│  que crees un tema.                                                      │  (sin selector)
│  Tus temas (0)                                                           │
│  Aún no tienes temas. Crea uno desde el editor de una canción: Estilo ›  │
│  Tema personalizado › Guardar como tema nuevo…                           │
```

### Componentes e interacciones
| Elemento | Comportamiento |
|---|---|
| **Selector «Tema predeterminado»** | Opciones: los temas por orden alfabético (con su muestra) y, al final, `aj.temas.ninguno`. Debajo, `aj.temas.predet.usos` (con `predeterminadoUsos` de `CatalogoIpc`) o `aj.temas.predet.azar`. Elegir otra opción: si alguna canción sigue hoy al predeterminado (`predeterminadoUsos` > 0), pide confirmación con `aj.temas.dialogo.predet` o `aj.temas.dialogo.ninguno` (con el recuento de `temas.previsualizar`, que es la autoridad) (mismo componente de impacto que el editor: recuento, desglose, «Ver las canciones», foco inicial en «Cancelar», `tema.obsoleto`). Sin canciones afectadas, se aplica directamente. Toast `aj.temas.toast.predet`. El foco se queda en el selector. |
| Qué cambia al cambiar el predeterminado | Decisión del usuario en [0052](../preguntas/0052-predeterminado-y-canciones-que-dependen-de-el.md) ([ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md) §6). Las canciones contadas son las que siguen al predeterminado (`predeterminadoUsos`; las que heredan sin base y sin tema de álbum ni artista). **(A1) De un tema a otro**: pasan al nuevo (vínculo vivo), con `aj.temas.dialogo.predet`. **De «Ninguno…» a un tema**: las que hoy usan el estilo incluido sin base pasan al tema, con la variante «sin anterior» del mismo diálogo. **(B1) De un tema a «Ninguno…»**: **no cambian de aspecto**; conservan el tema que usaban, siguen vinculadas a él (editarlo las cambia; borrarlo las congela como a cualquier otra) y su procedencia pasa a «Tema predeterminado anterior» (`tema.origen.anterior`). Confirmación `aj.temas.dialogo.ninguno`. **(C1) Elegir un predeterminado nuevo** no cambia las canciones con un tema al azar, con predeterminado anterior o con el estilo incluido fijado al crearse. Nunca cambian las personalizadas ni las que tienen tema de canción, álbum o artista. |
| **Quitar el predeterminado: progreso y fallos** | Al confirmar `aj.temas.dialogo.ninguno`, main guarda una a una las canciones afectadas y después el catálogo. El botón pasa a «Quitando…» (cargando) y, con más de 5 canciones, se muestra `aj.temas.ninguno.progreso` con `hechas`/`total` del evento `temas:progreso` (región `role="status"`, anunciada al empezar y al terminar). No se puede cancelar a medias. **Éxito**: se cierra, el selector queda en «Ninguno…», toast `aj.temas.toast.predet` (variante ninguno) y foco en el selector. **Fallo de una canción**: main se detiene sin escribir el catálogo; ninguna canción ha cambiado de aspecto y el tema sigue siendo el predeterminado. El diálogo muestra `aj.temas.ninguno.parcial` con la lista de lo que falta: la canción que falló (✕, «No se pudo guardar.» y [Copiar detalles] con su código) y, detrás, las que no se llegaron a intentar (–, «Pendiente», en `texto-3`, sin [Copiar detalles]), más la nota `tema.parcial.notaPendientes` si hay pendientes. Es el mismo componente que el fallo a mitad de eliminar ([06 · «Lista de canciones tras un fallo a mitad»](06-editor.md#diálogos), [0056](../preguntas/0056-destino-respaldo-y-canciones-pendientes.md)), con foco en [Reintentar]. Siguen [Reintentar] (nueva previsualización: solo cuenta las que faltan, porque las ya guardadas ya conservan el tema) y [Cerrar] (foco al selector, que sigue en el tema). Las ya guardadas muestran desde ese momento «Tema predeterminado anterior» con el mismo aspecto; no hay nada que deshacer. |
| **Lista «Tus temas»** | `role="list"`; cada fila: muestra 64 × 36 (16:9), nombre (`t-cuerpo-fuerte`), etiqueta «Predeterminado» si lo es, usos efectivos (`aj.temas.usos` con `usos.total` de `CatalogoIpc`) y grupos asignados (`aj.temas.grupos` con `grupos` de `CatalogoIpc`, nombres visibles que da main), y ⋯. Usos y grupos se refrescan con cada `temas:cambiado` (main lo agrupa en 250 ms); el renderer no los recalcula. Orden alfabético. Navegación: Tab entra en la lista una vez (*roving tabindex* con ↑/↓ entre filas, Inicio/Fin); Tab siguiente va al ⋯ de la fila activa; tecla Menú o Mayús + F10 en la fila abre su ⋯. |
| **⋯ de un tema** | «Usar como predeterminado» (oculto si ya lo es; mismo flujo que el selector) · «Renombrar…» · «Duplicar…» · separador · «Eliminar…» (destructivo). Los diálogos son los del editor (`tema.dialogo.renombrar`, `tema.dialogo.duplicar`, `tema.dialogo.eliminar`). |
| Nota de edición | `aj.temas.editarNota`, en `texto-3`. No es un enlace (no hay una canción concreta a la que ir). |
| Tras duplicar | La fila nueva aparece en su posición alfabética, recibe el foco y se anuncia `tema.toast.creado`. |
| Tras renombrar | La fila se recoloca en orden alfabético y conserva el foco. |
| **Tras eliminar** | La fila desaparece; el foco pasa a la fila siguiente, si no a la anterior, si no al encabezado «Tus temas» (`tabindex="-1"`). Si era el predeterminado, el selector pasa a «Ninguno…» y se anuncia `aj.temas.anuncio.predetBorrado` además del toast `tema.toast.eliminado`. |
| Se crea una canción nueva | Recibe, en este orden: tema de su álbum o artista si existe; si no, el predeterminado (vínculo vivo); si no hay predeterminado, un tema al azar del catálogo (fijado en la canción, estable al reabrir); si el catálogo está vacío, el estilo incluido. Ver precedencia en el [editor](06-editor.md#conceptos-y-procedencia). |

### Migración desde 0.1.0
- Las canciones existentes quedan como «Tema personalizado» (editor, T1).
- En el primer arranque de 0.2.0, main crea el catálogo con **un tema** a partir de `config.estilo_predeterminado` y lo marca como predeterminado ([ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md) §1). Nombre visible ([0054](../preguntas/0054-detalles-de-interfaz-de-temas-y-biblioteca.md) §1): **«Shinobi»** si es el estilo de fábrica y **«Mi estilo»** si el usuario lo había cambiado con «Usar este estilo en canciones nuevas». Una canción creada justo después de actualizar se ve igual que una creada justo antes. El catálogo solo queda vacío si el usuario borra todos los temas.

### Estados y errores
| Estado | Presentación |
|---|---|
| Normal | Wireframe. |
| Sin predeterminado | Selector en «Ninguno…» con `aj.temas.predet.azar`. |
| Catálogo vacío | Sin selector; `aj.temas.vacio.predet` y `aj.temas.vacio.lista`. |
| Cargando | La sección muestra 3 filas esqueleto (< 1 s esperado), como la Biblioteca. |
| **Catálogo apartado por ilegible** | Main aparta el archivo (`temas.json.danado`) y empieza un catálogo nuevo (ADR 0016 §1). Mientras `CatalogoIpc.apartado` no sea `null`, la sección muestra arriba el aviso `aviso` `aj.temas.apartado` con [Abrir carpeta de datos] y ✕ (nombre `aj.temas.apartado.cerrar`). El aviso sigue saliendo en cada visita y tras reiniciar hasta que el usuario pulsa ✕, que llama a `temas.descartarAvisoApartado()`; solo vuelve con otro incidente. Al pulsar ✕ el aviso se oculta en el momento y el foco pasa al encabezado `h2` «Temas» (`tabindex="-1"`). Si la llamada falla, sigue oculto en esta sesión y volverá al reiniciar, sin toast. Las canciones que apuntaban a temas perdidos se ven con su respaldo. |
| **Catálogo en solo lectura** (`TEMAS_SOLO_LECTURA`, esquema más nuevo) | Aviso `aviso` `aj.temas.soloLectura`. Lista visible si main la entrega, sin ⋯; selector inactivo con el mismo motivo. Ninguna acción escribe. |
| **Escritura interrumpida** (renombrar, duplicar, predeterminado) | El diálogo o el selector conservan el valor anterior; toast `tema.toast.error` con [Reintentar] y [Copiar detalles]. |
| **Borrado pendiente** (`borradoPendiente` en el catálogo: fallo a mitad o app cerrada durante un borrado) | Es el **único sitio** donde se retoma fuera del diálogo original ([0054](../preguntas/0054-detalles-de-interfaz-de-temas-y-biblioteca.md) §5). La fila del tema muestra el aviso en línea `aj.temas.pendiente` con [Terminar de eliminar] (`temas.reanudarBorrado`, abre el progreso del diálogo de eliminar) y [Cancelar el borrado] (`temas.cancelarBorrado`, toast `tema.toast.borradoCancelado`). El tema no se ofrece en selectores mientras tanto; su ⋯ solo tiene esas dos acciones. No se reanuda solo al arrancar ni hay aviso al abrir la app; el editor y la Biblioteca remiten aquí (`tema.borradoPendiente`, `bib.grupo.temaBorrando`). Otra operación sobre ese tema responde `BORRADO_PENDIENTE` y se muestra el mismo texto. |
| **Referencias que faltan tras restaurar copias** | Si `CatalogoIpc.referenciasFaltantes` > 0 (canciones que apuntan a un tema, directo o como base, que no está en el catálogo; los grupos no pueden faltar), aviso `aviso` bajo «Tus temas»: `aj.temas.faltan` con ese recuento. Es informativo: cada canción se resuelve desde el editor (D4) o con «Aplicar tema…» en la Biblioteca. Si el tema vuelve a aparecer (p. ej. se restaura el catálogo), el recuento baja a 0 y el aviso desaparece con el siguiente `temas:cambiado`. En solo lectura main da 0 y solo se ve `aj.temas.soloLectura`. |
| **Confirmación obsoleta** | En cualquier diálogo de impacto de esta sección: `tema.obsoleto` y recálculo (ver editor). |
| Nombre repetido al renombrar o duplicar | `tema.nombre.repetido` en el campo. |

### Accesibilidad
- `h2` «Temas», `h3` «Tema predeterminado» y «Tus temas ({n})». El selector se describe con su explicación y la línea de usos (`aria-describedby`).
- Cada fila de la lista tiene nombre `aj.temas.aria.fila`. Las muestras son decorativas.
- El foco tras acciones destructivas sigue la tabla; nunca queda en `body`. Los cambios de predeterminado y los borrados se anuncian una vez (`aria-live="polite"`).

### Microcopy (fase 3, Ajustes)
| Clave | Texto |
|---|---|
| `aj.volver.biblioteca` / `aj.volver.editor` | ‹ Biblioteca · ‹ Volver al editor |
| `aj.temas.titulo` | Temas |
| `aj.temas.predet.titulo` | Tema predeterminado |
| `aj.temas.predet.ayuda` | Lo usan las canciones que no tienen tema propio, ni de su álbum ni de su artista. |
| `aj.temas.predet.usos` | Ahora lo usan {n} canciones. · 1 canción · (0) Ahora no lo usa ninguna canción; lo usarán las nuevas. |
| `aj.temas.ninguno` | Ninguno · un tema al azar para cada canción nueva |
| `aj.temas.predet.azar` | Cada canción nueva recibe al crearse un tema al azar de tus temas, si su álbum o su artista no tienen tema. La elección se mantiene al reabrirla. |
| `aj.temas.dialogo.predet` | Título: ¿Usar «{nuevo}» como tema predeterminado? · Cuerpo: Cambiará el aspecto de {n} canciones que usan el predeterminado «{anterior}». · (n = 1) Cambiará el aspecto de 1 canción que usa el predeterminado «{anterior}». · (sin anterior) Cambiará el aspecto de {n} canciones que ahora usan el estilo incluido de Shinobi Karaoke. · Nota: No cambian las canciones con tema personalizado, las que tienen tema propio, de álbum o de artista, ni las que recibieron un tema al azar o conservan un predeterminado anterior. — [▸ Ver las canciones] [Cancelar] [Usar «{nuevo}»] |
| `aj.temas.dialogo.ninguno` | Título: ¿Quitar el tema predeterminado? · Cuerpo: Las {n} canciones que usan «{anterior}» lo conservarán y seguirán recibiendo sus cambios. Su aspecto no cambia. · (n = 1) La canción que usa «{anterior}» lo conservará y seguirá recibiendo sus cambios. Su aspecto no cambia. · Nota: Las canciones nuevas recibirán un tema al azar. — [▸ Ver las canciones] [Cancelar] [Quitar predeterminado] |
| `aj.temas.ninguno.quitando` | Quitando… |
| `aj.temas.ninguno.progreso` | Guardando {i} de {n} canciones… |
| `aj.temas.ninguno.parcial` | No se pudo quitar el predeterminado: falló al guardar «{título}» y se detuvo. Faltan {f} canciones por guardar. «{anterior}» sigue siendo el predeterminado y ninguna canción ha cambiado de aspecto. · (f = 1) No se pudo quitar el predeterminado: falló al guardar «{título}». Falta esa canción por guardar. «{anterior}» sigue siendo el predeterminado y ninguna canción ha cambiado de aspecto. — [Reintentar] [Cerrar]. Filas y nota: `tema.parcial.fila.error`, `tema.parcial.fila.pendiente`, `tema.parcial.notaPendientes` (spec 06). `{f}` = filas `error` + `pendiente`. |
| `aj.temas.toast.predet` | Tema predeterminado: «{tema}». · (ninguno) Sin tema predeterminado: las canciones nuevas recibirán un tema al azar. |
| `aj.temas.origen.anterior` | Tema predeterminado anterior. Es la misma cadena que `tema.origen.anterior` (spec 06); en `textos.ts` hay una sola. |
| `aj.temas.lista.titulo` | Tus temas ({n}) |
| `aj.temas.usos` | {n} canciones · 1 canción · Sin usar |
| `aj.temas.grupos` | artista {artista} · {x} artistas · 1 álbum · {y} álbumes |
| `aj.temas.etiqueta.predet` | Predeterminado |
| `aj.temas.menu` | Usar como predeterminado · Renombrar… · Duplicar… · Eliminar… |
| `aj.temas.editarNota` | Para cambiar el aspecto de un tema, abre una canción que lo use: Editor › Estilo › Editar tema. |
| `aj.temas.vacio.predet` | Las canciones nuevas usan el estilo incluido de Shinobi Karaoke hasta que crees un tema. |
| `aj.temas.vacio.lista` | Aún no tienes temas. Crea uno desde el editor de una canción: Estilo › Tema personalizado › Guardar como tema nuevo… |
| `aj.temas.apartado` | No se pudieron leer tus temas y se empezó una lista nueva. El archivo dañado se guardó como «temas.json.danado» en la carpeta de datos. Las canciones que los usaban se ven con el aspecto guardado en cada una. — [Abrir carpeta de datos] |
| `aj.temas.soloLectura` | Tus temas se guardaron con una versión más nueva de Shinobi Karaoke. Aquí no se pueden usar ni cambiar; las canciones se ven con el aspecto guardado en cada una. Actualiza la app para usarlos. |
| `aj.temas.apartado.cerrar` | Cerrar aviso |
| `aj.temas.pendiente` | La eliminación de este tema quedó a medias: faltan {k} de {n} canciones por guardar su aspecto. — [Terminar de eliminar] [Cancelar el borrado] |
| `aj.temas.faltan` | {n} canciones usan temas que no están en tu lista (por ejemplo, al restaurar una copia). Se ven con el aspecto guardado en cada una. · (n = 1) 1 canción usa un tema que no está en tu lista (por ejemplo, al restaurar una copia). Se ve con el aspecto guardado en ella. |
| `aj.temas.anuncio.predetBorrado` | Ya no hay tema predeterminado. Las canciones nuevas recibirán un tema al azar. |
| `aj.temas.aria.fila` | {tema}[, predeterminado], {usos}[, {grupos}] |

### Criterios de aceptación de la fase 3 (Ajustes)
- A1. Ajustes muestra la sección «Temas» entre «Separación de voz» y «Acerca de», con el selector de predeterminado y la lista de temas con muestra, nombre, etiqueta de predeterminado, usos efectivos y grupos.
- A2. Elegir un predeterminado se guarda y persiste al reabrir Ajustes y al reiniciar; si hay canciones que heredan el predeterminado, antes se confirma con recuento y desglose (foco en «Cancelar»); sin ellas, se aplica sin diálogo.
- A3. Con predeterminado «Noche ninja», una canción nueva sin tema de álbum ni artista abre con procedencia «Tema predeterminado» y «Noche ninja»; con tema de artista, usa el del artista.
- A4. Al eliminar el tema predeterminado, el diálogo incluye la frase de canciones nuevas; tras confirmar, las canciones que lo usaban quedan como «Tema personalizado» con el mismo aspecto, el selector pasa a «Ninguno…», se anuncia `aj.temas.anuncio.predetBorrado` y el foco va a la fila siguiente.
- A5. Sin predeterminado y con 3 temas, cada canción nueva recibe uno de esos 3 (procedencia «Elegido al azar al crear la canción»), el mismo al cerrar y reabrir la app; con tema de álbum o artista, recibe ese. Con el catálogo vacío, recibe el estilo incluido (procedencia «Estilo incluido de Shinobi Karaoke»).
- A6. Renombrar y duplicar desde ⋯ usan los diálogos del editor, validan nombre vacío y repetido, y dejan el foco en la fila correspondiente.
- A7. Con un `temas.json` ilegible (y sin `.bak` válido), la app arranca, la sección muestra `aj.temas.apartado` y una lista nueva; con un catálogo de esquema más nuevo, `aj.temas.soloLectura`, sin acciones que escriban. El resto de Ajustes funciona.
- A7b. En una biblioteca de 0.1.0 sin cambiar el estilo predeterminado, tras actualizar hay un tema «Shinobi» marcado como predeterminado; si se había usado «Usar este estilo en canciones nuevas», se llama «Mi estilo». Una canción nueva se ve igual que antes de actualizar.
- A8. Con una canción cuya referencia no existe en el catálogo, aparece `aj.temas.faltan` en singular («1 canción usa un tema…»); con dos, en plural; al restaurar el tema, desaparece. El texto nunca menciona grupos.
- A7c. Tras apartar un catálogo ilegible, `aj.temas.apartado` sigue visible al salir y volver a Ajustes y tras reiniciar la app; al pulsar ✕ desaparece, el foco va al encabezado «Temas» y no vuelve a salir al reiniciar.
- A9. Una escritura interrumpida al eliminar (o cerrar la app a mitad) deja el tema en la lista con `aj.temas.pendiente`, sin reanudarse solo al arrancar; [Terminar de eliminar] lo completa y [Cancelar el borrado] lo deja disponible con las canciones ya convertidas como «Tema personalizado» sin cambio visible.
- A10. Abierta desde el editor (⚙, Ctrl/Cmd + , o «Administrar temas…»), «‹ Volver al editor» y Esc regresan al editor de esa canción con su pestaña Estilo; abierta desde la Biblioteca, vuelven a la Biblioteca (criterio 8 revisado).
- A11. Toda la sección es operable con teclado (lista con ↑/↓, menú con tecla Menú o Mayús + F10) y el foco nunca queda en `body` tras eliminar.
- A12. Capturas en `docs/ux/revision-fase-3/` (ver [README](revision-fase-3/README.md)), nombre `ajustes-{ancho}x{alto}-{escala}-{estado}.png` a 1280 × 800 al 100 %: `temas`, `temas-sin-predeterminado`, `temas-vacio`, `temas-apartado`, `temas-solo-lectura`, `temas-borrado-pendiente`, `dialogo-predeterminado`, `dialogo-quitar-predeterminado`, `dialogo-eliminar-predeterminado`, `temas-faltan`.
- A13. (B1) Con «Noche ninja» como predeterminado y 3 canciones que lo siguen (una de YouTube), elegir «Ninguno…» muestra `aj.temas.dialogo.ninguno` con 3 canciones y foco en «Cancelar»; al confirmar, ninguna cambia de aspecto ni de portada, su procedencia pasa a «Tema predeterminado anterior» (editor) y «predeterminado anterior» (tarjeta), y una canción nueva recibe un tema al azar. Editar después «Noche ninja» cambia esas 3 canciones.
- A14. (A1 y C1) Con «Noche ninja» como predeterminado, elegir «Neón» cambia las canciones que lo seguían; las que tienen un tema al azar, «Tema predeterminado anterior» o el estilo incluido fijado no cambian y no se cuentan en el diálogo. Desde «Ninguno…», elegir un tema muestra la variante «sin anterior» si hay canciones con estilo incluido sin base, y se aplica sin diálogo si no hay ninguna.
- A15. Con un fallo simulado en la segunda de cuatro canciones al quitar el predeterminado, el diálogo muestra `aj.temas.ninguno.parcial` con «Faltan 3 canciones» y el título de la segunda; la lista tiene 3 filas (la segunda con ✕ y [Copiar detalles]; la tercera y la cuarta con «Pendiente» en `texto-3` y sin [Copiar detalles]), la nota `tema.parcial.notaPendientes` y el foco en [Reintentar]; el selector sigue en «Noche ninja», ninguna canción cambia de aspecto y la primera ya muestra «Tema predeterminado anterior»; [Reintentar] confirma solo las 3 que faltan y termina con el selector en «Ninguno…». Con más de 5 canciones se ve `aj.temas.ninguno.progreso` avanzando.

## Fase 4 de 0.2.0 — ventana secundaria y cola

Origen: [plan, fase 4, feature 11](../versiones/0.2.0/plan-2.md#11-cola--m) y [0049](../preguntas/0049-politica-cola-de-reproduccion.md) («contador en el centro y animado con tiempo configurable, por defecto 4 segundos»). Cómo se ve la cuenta: [07 · Fase 4, «Cuenta entre canciones»](07-reproductor.md#cuenta-entre-canciones-s1). Esta sección **amplía** la vista con una sección nueva; lo demás no cambia.

Orden de secciones: Separación de voz · Temas · **Reproductor** · Acerca de.

### Wireframe
```
│  Reproductor                                                             │  h2
│                                                                          │
│  Cuenta entre canciones                                                  │  etiqueta
│  [ 4 s (predeterminado)  ▾ ]                                             │  selector (2 · 3 · 4 · 5 · 8 · 10 · 15 s)
│  Cuando termina una canción y hay otra en la cola, la pantalla del       │
│  reproductor cuenta estos segundos antes de empezarla.                   │  ayuda (t-pequeno, texto-3)
```

### Componentes e interacciones
| Elemento | Comportamiento |
|---|---|
| **Cuenta entre canciones** | Selector (no campo numérico: menos errores y valores que se distinguen) con 2 s · 3 s · 4 s (predeterminado) · 5 s · 8 s · 10 s · 15 s. Se guarda al elegir en `config.reproductor.transicion_s` con `config.actualizar` ([ADR 0017](../adr/0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md) §12) y persiste entre reinicios. Un valor válido del esquema (1–30) que no está en la lista (archivo editado a mano) se añade como opción extra «{n} s» y se respeta; un valor no válido se muestra y usa como 4 s. Sin acciones de confirmación ni toast de éxito: el valor elegido queda visible. |
| Efecto durante una sesión | Se aplica a la **siguiente** cuenta que empiece. Una cuenta en marcha no cambia (tampoco si se reinicia por cambio de candidata: usa la duración con que empezó). |
| Fallo al guardar | El selector vuelve al valor anterior y aparece el toast `aj.rep.toast.error` con [Copiar detalles]. |
| Teclado | Selector nativo accesible; foco y Esc como el resto de la vista. |

No hay otros ajustes del reproductor en Ajustes: la pantalla y la pantalla completa se recuerdan desde el diálogo de apertura (spec 02), y el volumen y la voz guía desde el propio reproductor (spec 07). El selector de dispositivo de audio queda como mejora futura de prioridad baja ([0048](../preguntas/0048-escucha-editor-durante-evento.md)).

### Estados
| Estado | Presentación |
|---|---|
| Normal | Wireframe con el valor guardado. |
| Sin valor guardado | 4 s (predeterminado). |
| Error al guardar | Valor anterior + toast. |

### Microcopy (fase 4, Ajustes)
| Clave | Texto |
|---|---|
| `aj.rep.titulo` | Reproductor |
| `aj.rep.cuenta` | Cuenta entre canciones |
| `aj.rep.cuenta.opcion` | {n} s · (4) 4 s (predeterminado) |
| `aj.rep.cuenta.ayuda` | Cuando termina una canción y hay otra en la cola, la pantalla del reproductor cuenta estos segundos antes de empezarla. |
| `aj.rep.toast.error` | No se pudo guardar el ajuste. — [Copiar detalles] |

### Criterios de aceptación de la fase 4 (Ajustes)
- AR1. Ajustes muestra la sección «Reproductor» entre «Temas» y «Acerca de» con el selector «Cuenta entre canciones» en 4 s por defecto; la etiqueta y la ayuda están asociadas al selector (`aria-describedby`).
- AR2. Elegir 10 s persiste al salir, al volver y al reiniciar; la siguiente cuenta de la secundaria dura 10 s. Cambiarlo durante una cuenta no altera la que está en marcha.
- AR3. Con un fallo de escritura simulado, el selector vuelve al valor anterior y aparece `aj.rep.toast.error`.
- AR4. Captura `docs/ux/revision-fase-4/ajustes-1280x800-100-reproductor.png`.

## Fase 10 de 0.2.0 — número de compilación

Origen: [plan, fase 10, feature 14](../versiones/0.2.0/plan-2.md#14-estructura-de-releases--m), punto 3 («`<versión>-<N>`, con N = número de commits, visible en «Acerca de» y en los detalles de error que se copian»), y [propuesta 017](../propuestas/017-estructura-de-releases.md). Problema que resuelve: el error de exportación de alpha.1 solo decía «Versión: 0.2.0-alpha.1» y no había forma de saber de qué commit salió esa compilación. Detalles técnicos (origen de N, del commit y del canal): [0142](../preguntas/0142-numero-de-compilacion-canal-de-desarrollo-y-notas.md), con provisional tomado. Dónde se publica cada canal: [09 · §3 y §3b](09-descarga-e-instalacion.md#3-notas-de-cada-release).

Esta sección **amplía** el bloque «Acerca de» (también el diálogo Acerca de del primer arranque, que es el mismo bloque) y **sustituye**: la fila «Copiar información para soporte» (primera línea), `aj.acerca.version` y el criterio 9 (se añade la línea de versión).

### Conceptos
| Concepto | Definición |
|---|---|
| **Número de compilación** | `<versión>-<N>`: la versión de `app/package.json` del commit construido, un guion y N, el número de commits de su historial. Ejemplo: `0.2.0-alpha.2-1234`. Lo que se ve y se copia es siempre esta cadena; nunca se separa en dos datos. |
| **Commit** | Hash corto del commit construido (7 caracteres, provisional 0142), p. ej. `3f9c2a1`. Va siempre junto al número allí donde se copia: dos ramas pueden dar el mismo N. |
| **Canal** | De dónde sale la compilación. `publicada`: construida por la etiqueta de una versión (`v0.2.0-alpha.2`) y publicada en las *Releases* del repositorio principal. `desarrollo`: construida por el CI sin etiqueta (compilación nocturna de `develop` en `shinobi-karaoke-builds`, o ensayo del workflow). `local`: construida en el equipo de quien desarrolla (`npm run dev`, `npm run empaquetar`); **no lleva número**. |
| **Previa** | Una versión `publicada` con sufijo (`-alpha.N`, `-beta.N`, `-rc.N`). Se deduce del número; no es otro canal. |
| **Identificador de compilación** | Cadena única que se copia en todos los sitios: `{número} ({canal}, commit {hash})`. Ver `aj.compilacion.id`. |

### Wireframe

Bloque «Acerca de» de una **versión preliminar publicada**:
```
│  Acerca de Shinobi Karaoke                                               │  h2
│  Versión 0.2.0-alpha.2-1234 · Software libre con licencia GPL-3.0 o      │  aj.acerca.version
│  posterior.                                                              │
│  Versión preliminar publicada · commit 3f9c2a1      [ Copiar versión ]   │  aj.acerca.canal.previa (t-pequeno, texto-2) + botón fantasma
│  [Ver licencia]  [Créditos y licencias de terceros]  [Web del proyecto]  │
│  …                                                                       │
```

**Versión estable publicada**:
```
│  Versión 0.3.0-1302 · Software libre con licencia GPL-3.0 o posterior.   │
│  Versión publicada · commit 8d41b07                 [ Copiar versión ]   │
```

**Compilación de desarrollo** (canal `desarrollo`):
```
│  Versión 0.2.0-alpha.3-1260 · Software libre con licencia GPL-3.0 o      │
│  posterior.                                                              │
│  ⚠ Compilación de desarrollo: no es una versión publicada y puede        │  aviso (color `aviso`, icono ⚠)
│    fallar. · commit 9e07c55                         [ Copiar versión ]   │
```

**Compilación local** (canal `local`, sin número):
```
│  Versión 0.2.0-alpha.3 · Software libre con licencia GPL-3.0 o posterior.│
│  Compilación local, sin número de compilación · commit 9e07c55           │  (sin «· commit …» si no se sabe)
│                                                     [ Copiar versión ]   │
```

### Componentes e interacciones
| Elemento | Comportamiento |
|---|---|
| **Línea de versión** (`aj.acerca.version`) | `{v}` es el número de compilación; en `local`, solo la versión. El número va en `t-cuerpo` como el resto de la línea (no monoespaciado: se lee como una versión). El texto es **seleccionable** con el ratón (`user-select: text`) y se puede copiar con Ctrl/Cmd + C. |
| **Línea de canal** | Justo debajo, en `t-pequeno`. `publicada` sin sufijo: `aj.acerca.canal.publicada` en `texto-2`. `publicada` con sufijo: `aj.acerca.canal.previa` en `texto-2`. `desarrollo`: `aj.acerca.canal.desarrollo` en color `aviso` con icono ⚠ (decorativo, `aria-hidden`; el texto ya lo dice). `local`: `aj.acerca.canal.local` en `texto-3`. El hash va en fuente monoespaciada. El commit **no es un enlace**: abrir GitHub no ayuda a quien usa la app, y quien lo necesita lo pega en una incidencia. |
| **Copiar versión** | Botón fantasma pequeño, al final de la línea de canal (en ventanas estrechas pasa a la línea siguiente, alineado a la izquierda). Copia `aj.acerca.copiado`: `Shinobi Karaoke {identificador}` (una sola línea, la misma que encabeza «Copiar información para soporte»). Toast `aj.acerca.toast.version`. Si el portapapeles falla, toast `error` `aj.acerca.toast.versionError`. El foco se queda en el botón. |
| **Copiar información para soporte** | Sin cambios salvo la **primera línea**, que pasa de `Shinobi Karaoke {versión}` a `Shinobi Karaoke {identificador}`. El resto de líneas y su orden no cambian. |
| **«Copiar detalles» (todas las specs)** | Ver [«Línea de versión en los detalles copiados»](#línea-de-versión-en-los-detalles-copiados). |
| Información aún no cargada | Como hoy: la línea de versión y la de canal no se muestran hasta tener `sistema.info()`; no hay esqueleto (llega en < 100 ms). [Copiar versión] tampoco aparece hasta entonces. |
| Datos de compilación ausentes | Si una compilación empaquetada no trae número ni canal (fallo del empaquetado), se muestra como `local`; nunca se inventa un número ni se muestra `undefined` o `null`. Sin hash: se omite «· commit …» y en el identificador se escribe `sin commit`. |
| Teclado | [Copiar versión] está en el orden de tabulación entre la línea de canal y [Ver licencia]. |

### Línea de versión en los detalles copiados
Regla **transversal**: todo texto que la app copia para que el usuario lo pegue en una incidencia termina con **la misma línea de versión**, `aj.detalles.version`:

```text
Versión: 0.2.0-alpha.2-1234 (publicada, commit 3f9c2a1)
```

- Es **la última línea** del bloque, siempre, también cuando el bloque acaba con líneas de registro (primer arranque, spec 01). Donde el bloque ya llevaba la versión (spec 01, «versión, SO, fase…»; spec 10, «Versión: 0.2.0-alpha.1»), esta línea la **sustituye**: no se repite.
- Aplica a **todos** los [Copiar detalles]: primer arranque (01), añadir canción (03), progreso (04), Biblioteca (02: toasts y listas de fallos de temas), editor (06: temas y listas de fallo a mitad), reproductor (07), Ajustes (08: temas y reproductor) y exportación (10). Una fila de una lista de fallos copia su código **y** la línea de versión.
- «Copiar información para soporte» no lleva `Versión:` al final: su primera línea (`Shinobi Karaoke {identificador}`) ya da lo mismo.
- Nunca incluye rutas, nombres de usuario ni el título de las canciones más allá de lo que ya copiaba cada spec.
- La línea sale de una **sola función compartida** (la misma que da `{identificador}`), para que los 9 sitios no puedan divergir.

Ejemplo, error de exportación (spec 10) en una compilación de desarrollo:
```text
ERROR_INTERNO: El codificador terminó con un error.
Perfil: 1920 × 1080 · 30 FPS · Solo instrumental
Formato: MKV (AV1 + Opus)
Posición: 1:23 de 3:45
Versión: 0.2.0-alpha.3-1260 (desarrollo, commit 9e07c55)
```

### Estados
| Estado | Presentación |
|---|---|
| Publicada estable | Número + `aj.acerca.canal.publicada`. |
| Publicada previa | Número + `aj.acerca.canal.previa`. |
| Desarrollo | Número + `aj.acerca.canal.desarrollo` en `aviso`. |
| Local | Solo la versión + `aj.acerca.canal.local` (con o sin commit). |
| Cargando | Sin líneas de versión ni botón (como hoy). |
| Error al copiar | Toast `aj.acerca.toast.versionError`; nada más cambia. |

### Accesibilidad
- La línea de canal es texto normal, no un `role="status"`: no cambia mientras la vista está abierta.
- El canal `desarrollo` no se comunica solo con color: el texto dice «Compilación de desarrollo». `aviso` sobre `fondo-1` da 10,1:1 y `texto-3` 6,1:1 (sistema visual).
- [Copiar versión] tiene nombre accesible `aj.acerca.copiarVersion.aria`, que incluye el número para que se oiga qué se copia. El toast se anuncia con el gestor de toasts (`aria-live="polite"`).

### Microcopy (fase 10, Acerca de)
| Clave | Texto |
|---|---|
| `aj.acerca.version` | Versión {v} · Software libre con licencia GPL-3.0 o posterior. ({v}: número de compilación, o la versión sola en `local`. **Sustituye** al de la fase 0) |
| `aj.acerca.canal.publicada` | Versión publicada · commit {hash} |
| `aj.acerca.canal.previa` | Versión preliminar publicada · commit {hash} |
| `aj.acerca.canal.desarrollo` | Compilación de desarrollo: no es una versión publicada y puede fallar. · commit {hash} |
| `aj.acerca.canal.local` | Compilación local, sin número de compilación · commit {hash} · (sin commit) Compilación local, sin número de compilación |
| `aj.acerca.copiarVersion` | Copiar versión |
| `aj.acerca.copiarVersion.aria` | Copiar versión {v} |
| `aj.acerca.copiado` | Shinobi Karaoke {identificador} |
| `aj.acerca.toast.version` | Versión copiada. |
| `aj.acerca.toast.versionError` | No se pudo copiar la versión. |
| `aj.compilacion.id` | {número} ({canal}, commit {hash}) · (local con commit) {versión} (local, sin número, commit {hash}) · (local sin commit) {versión} (local, sin número, sin commit) · (sin commit en otro canal) {número} ({canal}, sin commit). `{canal}` es literalmente `publicada`, `desarrollo` o `local`: es texto para incidencias y no se traduce ni cambia con la previa. |
| `aj.detalles.version` | Versión: {identificador} |

### Criterios de aceptación de la fase 10 (Acerca de)
- AC1. En una compilación construida por la etiqueta `v0.2.0-alpha.2` con N = 1234 y commit `3f9c2a1…`, Acerca de (en Ajustes y en el diálogo del primer arranque) muestra «Versión 0.2.0-alpha.2-1234 · Software libre…» y debajo «Versión preliminar publicada · commit 3f9c2a1». En una estable (`v0.3.0`), «Versión publicada · commit …».
- AC2. En una compilación del CI sin etiqueta, la línea de canal es `aj.acerca.canal.desarrollo`, en color `aviso` con ⚠, y el número sigue el formato `<versión>-<N>`.
- AC3. En `npm run dev`, la versión no lleva `-<N>` y la línea dice «Compilación local, sin número de compilación» (con «· commit …» solo si se conoce). Nunca aparecen `undefined`, `null`, `NaN` ni un número vacío (`0.2.0-alpha.3-`).
- AC4. [Copiar versión] copia exactamente una línea, `Shinobi Karaoke 0.2.0-alpha.2-1234 (publicada, commit 3f9c2a1)`, y muestra `aj.acerca.toast.versionError` si el portapapeles falla. Es alcanzable con Tab y su nombre accesible incluye el número.
- AC5. «Copiar información para soporte» empieza por la misma línea que copia [Copiar versión]; el resto del bloque no cambia (criterio 9).
- AC6. Cada [Copiar detalles] de las specs 01, 02, 03, 04, 06, 07, 08 y 10 termina con `Versión: {identificador}` como última línea, una sola vez. El error de exportación ya no termina con «Versión: 0.2.0-alpha.1» sin número ni commit. Un test unitario de la función compartida cubre los cuatro casos de `aj.compilacion.id`.
- AC7. El número y el hash de AC1 corresponden al commit construido: `git rev-list --count <hash>` da N y `git rev-parse --short=7` da el hash (comprobación de la tarea, según la respuesta a 0142).
- AC8. Captura `docs/ux/revision-fase-10/ajustes-1280x800-100-acerca-{previa|desarrollo|local}.png`.

## 0.2.2 · Feature 2 — Subrayar siempre lo ya cantado

Origen: [plan 0.2.2, feature 2](../versiones/0.2.2/plan-4.md#features-de-la-versión) y [propuesta 033](../propuestas/033-legibilidad-y-resaltado-accesible.md). Qué es el subrayado: [07 · Feature 2](07-reproductor.md#022--feature-2--resaltado-que-no-depende-solo-del-color). La casilla del tema: [06 · Feature 2](06-editor.md#022--feature-2--resaltado-que-no-depende-solo-del-color). **Decisión provisional** ([0155](../preguntas/0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md) §6): además del tema, un ajuste de este equipo, porque quien no distingue los colores lo necesita en todas las canciones y no tema a tema (por ejemplo, un invitado en una fiesta).

Esta sección **amplía** la sección «Reproductor» (fase 4) con una casilla, debajo de «Cuenta entre canciones».

### Wireframe
```
│  Reproductor                                                             │  h2
│  Cuenta entre canciones                                                  │
│  [ 4 s (predeterminado)  ▾ ]                                             │
│  …                                                                       │
│                                                                          │
│  ☐ Subrayar siempre lo ya cantado                                        │  casilla
│    Añade una línea bajo la parte cantada en todas las canciones, aunque  │  ayuda (t-pequeno, texto-3)
│    su tema no la tenga. Ayuda a quien no distingue bien los colores. No  │
│    cambia tus temas ni los videos que exportes.                          │
```

### Componentes e interacciones
| Elemento | Comportamiento |
|---|---|
| **Subrayar siempre lo ya cantado** | Casilla, desmarcada por defecto. Se guarda al cambiarla (sin botón de guardar ni toast de éxito) y persiste entre reinicios. |
| Efecto | En **este equipo**, el reproductor local, la ventana secundaria, «Probar a pantalla completa» y la vista previa del editor muestran el subrayado en todas las canciones con barrido, tenga o no su tema la casilla marcada. Se aplica a la **siguiente** canción que empiece; la que está sonando no cambia. No se aplica a Letra lista (no hay barrido) ni a los videos exportados. No modifica ninguna canción ni ningún tema. |
| Fallo al guardar | La casilla vuelve a su valor anterior y aparece el toast `aj.rep.toast.error` con [Copiar detalles]. |
| Teclado | Espacio la cambia; foco y Esc como el resto de la vista. |

### Microcopy (feature 2, Ajustes)
| Clave | Texto |
|---|---|
| `aj.rep.subrayado` | Subrayar siempre lo ya cantado |
| `aj.rep.subrayado.ayuda` | Añade una línea bajo la parte cantada en todas las canciones, aunque su tema no la tenga. Ayuda a quien no distingue bien los colores. No cambia tus temas ni los videos que exportes. |

### Criterios de aceptación de la feature 2 (Ajustes)
- F2-A1. La sección «Reproductor» muestra la casilla «Subrayar siempre lo ya cantado», desmarcada sin configuración previa, con su ayuda asociada (`aria-describedby`).
- F2-A2. Marcarla persiste al salir, al volver y al reiniciar; la siguiente canción que empieza (reproductor local y secundaria) lleva subrayado aunque su tema no lo tenga; `cancion.json` y `temas.json` no cambian.
- F2-A3. Con un fallo de escritura simulado, la casilla vuelve al valor anterior y aparece `aj.rep.toast.error`.
- F2-A4. Captura `docs/ux/revision-0.2.2-feature-2/ajustes-1280x800-100-reproductor-subrayado.png`.

## 0.2.2 · Feature 3 — Aviso de versión nueva

Origen: [plan 0.2.2, feature 3](../versiones/0.2.2/plan-4.md#features-de-la-versión) y [propuesta 026](../propuestas/026-aviso-de-version-nueva.md): la **opción B** de la [pregunta 0037](../preguntas/0037-autoactualizacion-de-la-app.md) (avisar, **sin** descargar ni instalar nada). Canales y número de compilación: [Fase 10](#fase-10-de-020--número-de-compilación) y [ADR 0020](../adr/0020-publicacion-en-github-releases-y-politica-de-versiones.md). Textos fuera de la app: [09 · Feature 3](09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva). Marco de la ventana: [00 · features 1 a 3](00-mapa-de-vistas.md#022--features-1-a-3). Valores: [sistema visual · Feature 3](sistema-visual.md#022--feature-3--aviso-de-versión-nueva). Contratos (consulta, configuración, comparación, enlaces y pruebas): [ADR 0023](../adr/0023-aviso-de-version-nueva-con-github-releases.md), que responde a [0156](../preguntas/0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md) §14–§20. Decisiones provisionales: [0155](../preguntas/0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md) §9–§13.

Esta sección **amplía** el bloque «Acerca de» (también el diálogo Acerca de del primer arranque) con el bloque «Actualizaciones», y añade un aviso al principio de la vista y un punto en el botón ⚙ de la barra superior.

### Objetivo
Que quien usa una versión antigua se entere de que hay otra, **sin interrumpirle** cuando viene a cantar y **sin que la app haga nada por su cuenta**: ni descarga ni instala. Tarea: «¿Tengo la última versión? Si no, ¿qué trae y de dónde la bajo?».

Qué **no** hace: no descarga el instalador dentro de la app, no instala, no reinicia, no muestra diálogos ni toasts, no avisa en la ventana del público, no cuenta usuarios ni envía estadísticas.

### Conceptos
| Concepto | Definición |
|---|---|
| **Versión instalada** | La versión de esta compilación, sin el número de compilación (`0.2.2-alpha.1`). La comparación usa la **versión**, no el número `-<N>`. |
| **Versión disponible** | La mayor versión **publicada** que le corresponde a esta instalación según su canal (tabla siguiente). «Mayor» según el orden de SemVer: `0.2.2-alpha.2` > `0.2.2-alpha.1`; `0.2.2` > `0.2.2-rc.1`. |
| **Versión nueva** | Hay versión disponible y es **mayor** que la instalada. |
| **Vista** | La versión nueva que el usuario ya ha visto anunciada en Ajustes. Sirve para apagar el punto de ⚙. |

**Qué versiones cuentan, según el canal de la compilación** (canales de la fase 10)

| Compilación instalada | Se comprueba | Versiones que cuentan |
|---|---|---|
| Publicada **estable** (sin sufijo) | Sí | Solo estables. |
| Publicada **preliminar** (`-alpha.N`, `-beta.N`, `-rc.N`) | Sí | Preliminares y estables. |
| **Desarrollo** (nocturna o ensayo del CI) | **No**: nunca se conecta para esto | — |
| **Local** | **No** | — |

- No hay forma de «apuntarse» a las preliminares desde una estable (decisión provisional): quien quiera probarlas las instala desde la página de versiones y, a partir de ahí, recibe avisos de preliminares.
- Los borradores y las compilaciones de desarrollo (`shinobi-karaoke-builds`) nunca cuentan.

### Cuándo se comprueba
| Momento | Regla |
|---|---|
| **Al arrancar** | Poco después de mostrarse la ventana, sin retrasar el arranque, si el aviso está activado y han pasado **24 h** desde la última comprobación con respuesta. También durante el primer arranque. |
| **Con la app abierta** | Cada 24 h desde la última comprobación con respuesta. |
| **A mano** | «Buscar actualizaciones», en cualquier momento, **también con el aviso desactivado**. |
| **Nunca** | Con el aviso desactivado (salvo a mano) y en compilaciones de desarrollo y locales. |

- Como mucho **una consulta automática al día** por instalación. Una consulta que falla no muestra nada y se reintenta más adelante (ADR 0023 §3). Al volver el equipo del reposo se aplica la misma regla de las 24 h.
- La comprobación no bloquea nada: mientras dura no hay ningún indicador, salvo en la búsqueda a mano.

### Qué sale del equipo (privacidad)
- **Una petición** a GitHub, donde se publican las versiones, para leer la lista de versiones publicadas. Nada más.
- La petición lleva solo el **nombre y la versión de la app** y los datos técnicos de cualquier petición web (por ejemplo, el idioma preferido). **No lleva** ningún identificador de la instalación o del equipo, ni el sistema operativo, ni datos de la biblioteca, las canciones, los temas o la configuración. No hay cuentas ni cookies.
- GitHub ve la **dirección IP** desde la que llega, como en cualquier visita a una web. La app no puede evitarlo y lo dice.
- La app **no abre** ninguna dirección que venga en la respuesta: los enlaces de «Ver novedades» y «Descargar» los construye ella con la versión, siempre dentro del repositorio del proyecto.
- El aviso se puede **desactivar** con una casilla en este mismo bloque; desactivado, la app no se conecta para esto.
- Es un acceso a internet nuevo. Se dice en tres sitios: bajo la casilla (`aj.act.privacidad`), en la bienvenida del primer arranque ([01 · Feature 3](01-primer-arranque.md#022--feature-3--mención-del-aviso-de-versión-nueva)) y en las notas de la versión ([09 · Feature 3](09-descarga-e-instalacion.md#022--feature-3--aviso-de-versión-nueva)).

### Dónde se ve
| Sitio | Qué | Cuándo |
|---|---|---|
| **Botón ⚙ de la barra superior** | Un punto (sistema visual) y el tooltip `aj.act.tooltip` | Hay versión nueva, el aviso está activado y esa versión aún no está «vista». En todas las vistas con barra superior. |
| **Principio de la vista Ajustes** | Aviso en línea `info` con `aj.act.banner` y [Ver], que desplaza la vista hasta «Actualizaciones» y le da el foco | Hay versión nueva y el aviso está activado. |
| **Ajustes › Acerca de › Actualizaciones** | Estado completo, acciones y casilla | Siempre (según el canal). |

- **Sin diálogo al arrancar y sin toast**: no interrumpe a quien viene a cantar.
- El punto se apaga al **abrir Ajustes** con esa versión anunciada (queda «vista») y no vuelve hasta que haya otra versión más nueva. El aviso de Ajustes y la línea de Acerca de siguen mientras la versión instalada sea antigua.
- **No se ve** en el reproductor (local o en otra pantalla), en el primer arranque (no hay barra superior; sí en su diálogo Acerca de) ni en ningún diálogo.

### Wireframes

Bloque «Actualizaciones», dentro de «Acerca de», justo debajo de la línea de canal y antes de [Ver licencia].

**Al día**
```
│  Acerca de Shinobi Karaoke                                               │  h2
│  Versión 0.2.2-alpha.2-1410 · Software libre con licencia GPL-3.0 o …    │
│  Versión preliminar publicada · commit 3f9c2a1      [ Copiar versión ]   │
│                                                                          │
│  Actualizaciones                                                         │  h3
│  ✓ Tienes la última versión.                                             │  aj.act.alDia
│  Comprobado hoy a las 18:42.               [ Buscar actualizaciones ]    │  aj.act.comprobado (texto-3) + fantasma
│  ☑ Avisarme cuando haya una versión nueva                                │  casilla
│    Como mucho una vez al día, Shinobi Karaoke pregunta a GitHub, donde   │  aj.act.privacidad (t-pequeno, texto-2)
│    se publican las versiones, cuál es la última. No envía datos tuyos    │
│    ni de tus canciones: solo la petición, con el nombre y la versión de  │
│    la app. GitHub ve tu dirección IP y el idioma de tu equipo, como      │
│    cualquier web que visitas.                                            │
│                                                                          │
│  [Ver licencia]  [Créditos y licencias de terceros]  …                   │
```

**Hay una versión nueva**
```
│  Actualizaciones                                                         │
│  ⬆ Hay una versión nueva: 0.2.2-alpha.3 (versión preliminar)             │  aj.act.nueva
│  Tienes la 0.2.2-alpha.2. La app no se actualiza sola: descarga la nueva │  aj.act.nueva.ayuda (texto-2)
│  e instálala encima. Tus canciones no se tocan.                          │
│  [ Ver novedades ]  [ Descargar ]                                        │  secundarios
│  Comprobado hoy a las 18:42.               [ Buscar actualizaciones ]    │
│  ☑ Avisarme cuando haya una versión nueva …                              │
```

**Después de pulsar «Descargar»**
```
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │ ⓘ Se ha abierto tu navegador para descargar la versión           │    │  aj.act.descargando
│  │   0.2.2-alpha.3. Cuando termine, cierra Shinobi Karaoke y abre   │    │
│  │   el archivo descargado. Es una versión preliminar: haz antes    │    │  (frase de la preliminar: solo si lo es)
│  │   una copia de seguridad.   [Guía de instalación]                │    │
│  └──────────────────────────────────────────────────────────────────┘    │
```

**Buscando (a mano)**
```
│  ✓ Tienes la última versión.                                             │
│  Comprobado ayer.                          [ ◌ Buscando… ]               │
```

**No se pudo comprobar (solo tras buscar a mano)**
```
│  ✓ Tienes la última versión.                                             │  (último resultado conocido)
│  ⚠ No se pudo comprobar ahora. Revisa tu conexión a internet e inténtalo │  aj.act.error
│    más tarde.                                                            │
│  Última comprobación: ayer.                [ Buscar actualizaciones ]    │
```

**Aviso desactivado**
```
│  ✓ Tienes la última versión.                                             │  (o «Aún no se ha comprobado.»)
│  Comprobado el 18 nov 2026.                [ Buscar actualizaciones ]    │
│  ☐ Avisarme cuando haya una versión nueva                                │
│    El aviso está desactivado: Shinobi Karaoke no busca versiones nuevas  │  aj.act.desactivado
│    por su cuenta. Puedes buscarlas a mano.                               │
```

**Compilación de desarrollo o local** (sin botón ni casilla)
```
│  Actualizaciones                                                         │
│  Las compilaciones de desarrollo no buscan versiones nuevas. Las         │  aj.act.desarrollo
│  versiones publicadas están en la web del proyecto.                      │
```

**Aviso al principio de Ajustes**
```
│ ‹ Biblioteca │ Ajustes                                                    │
├──────────────────────────────────────────────────────────────────────────┤
│  ┌ ⬆ Hay una versión nueva: 0.2.2-alpha.3.                    [ Ver ] ┐  │  aj.act.banner
│  └────────────────────────────────────────────────────────────────────┘  │
│  Separación de voz …                                                     │
```

**Barra superior**
```
│ [◆ Shinobi Karaoke]  ‹contexto›                [⟳ 1 en curso] [⚙•] [+ Añadir]│
```

### Componentes e interacciones
| Elemento | Comportamiento |
|---|---|
| **Línea de estado** | Una de: `aj.act.alDia`, `aj.act.nueva`, `aj.act.nunca` (aún sin ninguna comprobación con respuesta). Muestra siempre el **último resultado conocido**, también sin conexión y tras reiniciar. Si la versión instalada alcanza o supera la disponible (se actualizó), pasa sola a «al día». |
| **Etiqueta de preliminar** | `aj.act.nueva` añade «(versión preliminar)» si la versión nueva lleva sufijo. Una estable no lleva etiqueta. |
| **Ver novedades** | Abre en el navegador la página de esa versión (`…/releases/tag/v{versión}`), con sus notas y sus archivos. |
| **Descargar** | Abre en el navegador la **descarga directa del instalador de este sistema** para esa versión: Windows, `Shinobi-Karaoke-Windows-x64.exe`; Mac, `Shinobi-Karaoke-Mac-chip-Apple.dmg`; Linux, el AppImage si la app se está ejecutando como AppImage y el `.deb` si no (ADR 0023 §5). Si esa versión no trae ese archivo, abre la **página de la versión**. Después muestra el aviso en línea `aj.act.descargando` con [Guía de instalación] (abre `INSTALAR.md`, sección «Actualizar a una versión nueva»). La app **no** descarga nada por sí misma ni se cierra. El foco se queda en el botón. |
| **Buscar actualizaciones** | Botón fantasma. Al pulsarlo pasa a «Buscando…» (cargando, ancho fijo, `aria-disabled`) hasta tener respuesta (máximo 10 s). Con respuesta: actualiza la línea de estado y la fecha, y lo anuncia (`role="status"`). Con fallo: muestra `aj.act.error` bajo el último resultado conocido; desaparece con la siguiente comprobación con respuesta o al salir de Ajustes. Funciona con el aviso desactivado. |
| **Fecha** | `aj.act.comprobado`: «hoy a las {hh:mm}», «ayer» o la fecha corta local. Tras un fallo a mano, `aj.act.ultima`. |
| **Avisarme cuando haya una versión nueva** | Casilla, **marcada por defecto** (decisión provisional). Se guarda al cambiarla y persiste. Desmarcada: no hay consultas automáticas, y el punto de ⚙ y el aviso del principio de Ajustes no se muestran; la línea de estado conserva el último resultado y bajo la casilla aparece `aj.act.desactivado` en lugar de `aj.act.privacidad`. Volver a marcarla lanza una comprobación si han pasado 24 h. Fallo al guardar: la casilla vuelve a su valor y sale `aj.rep.toast.error`. |
| **Aviso del principio de Ajustes** | Aviso en línea `info` con `aj.act.banner` y [Ver]: desplaza hasta «Actualizaciones» y pone el foco en su `h3` (`tabindex="-1"`). No se puede cerrar: desaparece al actualizar o al desactivar el aviso. |
| **Punto de ⚙** | Decorativo. El botón pasa a llamarse `aj.act.tooltip` (tooltip y nombre accesible). Se apaga al abrir Ajustes. |
| **Compilación de desarrollo o local** | El bloque solo muestra `aj.act.desarrollo` o `aj.act.local`. Sin botón, sin casilla, sin punto ni aviso, y sin ninguna conexión. La casilla guardada por una versión publicada en la misma carpeta de datos no se toca. |
| **Diálogo Acerca de del primer arranque** | Mismo bloque y mismos estados. No hay punto (no hay barra superior). |
| **Sesión en otra pantalla** | El punto y el aviso solo existen en la ventana principal. La ventana del público no muestra nada. |
| **Relación con el número de compilación** | El aviso nombra la **versión** («0.2.2-alpha.3»), sin `-<N>`: la app no conoce el número de la versión publicada sin descargarla. Se ve en las notas de esa versión («Compilación», spec 09 §3) y, una vez instalada, en la línea de versión. |
| Teclado | Orden: [Copiar versión] → [Ver novedades] → [Descargar] → [Buscar actualizaciones] → casilla → [Ver licencia]… |

### Estados
| Estado | Presentación |
|---|---|
| Aún no se ha comprobado | `aj.act.nunca`; sin fecha. |
| Al día | `aj.act.alDia` + fecha. |
| Versión nueva (estable o preliminar) | `aj.act.nueva` + ayuda + [Ver novedades] [Descargar]; punto en ⚙ hasta abrir Ajustes; aviso al principio de Ajustes. |
| Tras «Descargar» | Además, aviso en línea `aj.act.descargando`. |
| Buscando a mano | Botón «Buscando…». |
| Sin red o error, **automático** | **Nada**: ni mensaje, ni punto, ni cambio en lo que se veía. Queda en el registro de la app. |
| Sin red o error, **a mano** | `aj.act.error` bajo el último resultado. |
| Aviso desactivado | Casilla desmarcada + `aj.act.desactivado`; sin punto ni aviso. |
| Desarrollo / local | Solo `aj.act.desarrollo` / `aj.act.local`. |
| Versión instalada mayor que todas las publicadas | Al día. |
| Respuesta sin ninguna versión válida para el canal | Al día. |
| Cargando la información del sistema | El bloque no se muestra hasta tener `sistema.info()`, como la línea de versión. |

### Accesibilidad
- `h3` «Actualizaciones» dentro de «Acerca de». La línea de estado lleva icono **y** texto; el punto de ⚙ no es la única señal (nombre accesible y tooltip).
- **Sin anuncios al arrancar**: detectar una versión nueva en segundo plano no interrumpe al lector de pantalla. Se anuncian solo el resultado de «Buscar actualizaciones» y su error, los dos con `role="status"` (no bloquean nada, así que no usan `alert`).
- La casilla se describe con `aj.act.privacidad` o `aj.act.desactivado` (`aria-describedby`).
- «Ver novedades», «Descargar» y «Guía de instalación» abren el navegador: su nombre accesible lo dice (`aj.act.aria.externo`).
- Todo operable con teclado; el foco no se pierde al cambiar de estado (se queda en el botón pulsado).
- Sin animaciones: el punto no parpadea.

### Microcopy (feature 3, Ajustes)
| Clave | Texto |
|---|---|
| `aj.act.titulo` | Actualizaciones |
| `aj.act.alDia` | Tienes la última versión. |
| `aj.act.nunca` | Aún no se ha comprobado si hay una versión nueva. |
| `aj.act.nueva` | Hay una versión nueva: {versión} · (preliminar) Hay una versión nueva: {versión} (versión preliminar) |
| `aj.act.nueva.ayuda` | Tienes la {instalada}. La app no se actualiza sola: descarga la nueva e instálala encima. Tus canciones no se tocan. |
| `aj.act.novedades` | Ver novedades |
| `aj.act.descargar` | Descargar |
| `aj.act.descargando` | Se ha abierto tu navegador para descargar la versión {versión}. Cuando termine, cierra Shinobi Karaoke y abre el archivo descargado. · (si se abrió la página de la versión) Se ha abierto tu navegador en la página de la versión {versión}. Descarga el archivo de tu sistema, cierra Shinobi Karaoke e instálalo. · (si es preliminar, se añade) Es una versión preliminar: haz antes una copia de seguridad. — [Guía de instalación] |
| `aj.act.guia` | Guía de instalación |
| `aj.act.buscar` | Buscar actualizaciones · (cargando) Buscando… |
| `aj.act.comprobado` | Comprobado hoy a las {hh:mm}. · Comprobado ayer. · Comprobado el {fecha}. |
| `aj.act.ultima` | Última comprobación: hoy a las {hh:mm}. · Última comprobación: ayer. · Última comprobación: {fecha}. · (ninguna) Aún no se ha podido comprobar. |
| `aj.act.error` | No se pudo comprobar ahora. Revisa tu conexión a internet e inténtalo más tarde. |
| `aj.act.avisar` | Avisarme cuando haya una versión nueva |
| `aj.act.privacidad` | Como mucho una vez al día, Shinobi Karaoke pregunta a GitHub, donde se publican las versiones, cuál es la última. No envía datos tuyos ni de tus canciones: solo la petición, con el nombre y la versión de la app. GitHub ve tu dirección IP y el idioma de tu equipo, como cualquier web que visitas. |
| `aj.act.desactivado` | El aviso está desactivado: Shinobi Karaoke no busca versiones nuevas por su cuenta. Puedes buscarlas a mano. |
| `aj.act.desarrollo` | Las compilaciones de desarrollo no buscan versiones nuevas. Las versiones publicadas están en la web del proyecto. |
| `aj.act.local` | Las compilaciones locales no buscan versiones nuevas. |
| `aj.act.banner` | Hay una versión nueva: {versión}. — [Ver] |
| `aj.act.tooltip` | Ajustes · hay una versión nueva (el tooltip conserva el atajo: «Ajustes · hay una versión nueva (Ctrl+,)») |
| `aj.act.aria.externo` | {texto del botón} (se abre en el navegador) |
| `aj.act.anuncio` | (tras buscar a mano) Tienes la última versión. · Hay una versión nueva: {versión}. |

Formato: las versiones se escriben tal cual (`0.2.2-alpha.3`), sin «v». Fechas en formato corto local («18 nov 2026»), horas en 24 h.

Si la feature 9 (copia de seguridad) no estuviera en la misma versión, la frase de la preliminar pasa a: «Es una versión preliminar: copia antes la carpeta «biblioteca» (Abrir carpeta de datos).»

### Criterios de aceptación de la feature 3 (Ajustes y marco)

**Comprobación y canales**
- F3-A1. En una compilación `publicada` con el aviso activado y sin comprobación previa, al arrancar se hace **una** consulta (doble HTTP); un segundo arranque antes de 24 h no hace ninguna; con la última comprobación a más de 24 h, hace una. La ventana principal es interactiva antes de que la consulta termine.
- F3-A2. Con la versión instalada `0.2.2-alpha.1` y publicadas `v0.2.2-alpha.2`, `v0.2.1` y un borrador `v0.2.2-alpha.3`, la versión nueva es `0.2.2-alpha.2` con «(versión preliminar)». Con la instalada `0.2.1` (estable) y publicadas `v0.2.2-alpha.2` y `v0.2.1`, está al día; al publicarse `v0.2.2`, la versión nueva es `0.2.2` sin etiqueta. Con la instalada `0.2.2-rc.1` y publicada `v0.2.2`, la versión nueva es `0.2.2` (test unitario de la comparación con estos casos y con `alpha.10` > `alpha.9`).
- F3-A3. En una compilación `desarrollo` y en una `local` no se hace ninguna consulta (el doble HTTP no recibe peticiones en 5 min ni al arrancar), el bloque muestra solo `aj.act.desarrollo` / `aj.act.local` y no hay botón, casilla, punto ni aviso.
- F3-A4. Una etiqueta que no cumple el formato de versiones del ADR 0020 se ignora; una respuesta vacía, mal formada o sin versiones válidas deja el estado «al día» o el anterior, sin error visible.

**Privacidad**
- F3-A5. La petición capturada por el doble HTTP no lleva cookies, `Referer`, identificador de instalación, sistema operativo ni ningún dato de la biblioteca: solo la ruta de la lista de versiones, un `User-Agent` con el nombre y la versión de la app y las cabeceras de la lista del ADR 0023 §1.
- F3-A6. Con la casilla desmarcada no hay ninguna consulta automática (ni al arrancar ni a las 24 h) y «Buscar actualizaciones» sí hace una. El valor persiste al reiniciar.
- F3-A7. La app nunca abre una URL tomada de la respuesta: «Ver novedades» y «Descargar» abren exactamente `https://github.com/Gomonsoft/shinobi-karaoke/releases/tag/v{versión}` y `…/releases/download/v{versión}/{archivo}` (comprobado con una respuesta del doble que trae otras direcciones).
- F3-A8. El texto `aj.act.privacidad` está visible bajo la casilla sin abrir nada más, y asociado a ella.

**Dónde se ve**
- F3-A9. Al detectarse una versión nueva no aparece ningún diálogo ni toast, ni se anuncia nada a lectores de pantalla; el botón ⚙ muestra el punto y su nombre accesible es `aj.act.tooltip` en la Biblioteca y en el espacio de canción.
- F3-A10. Al abrir Ajustes se ve `aj.act.banner` al principio; [Ver] desplaza hasta «Actualizaciones» y pone ahí el foco. Al volver, el punto ya no está, y no reaparece tras reiniciar hasta que haya una versión más nueva; el aviso de Ajustes y la línea `aj.act.nueva` siguen.
- F3-A11. Con el reproductor abierto (local o en otra pantalla) no se ve ningún aviso de versión; la ventana secundaria no lo muestra nunca.
- F3-A12. El bloque «Actualizaciones» aparece también en el diálogo Acerca de del primer arranque, con los mismos estados.

**Acciones y errores**
- F3-A13. «Buscar actualizaciones» muestra «Buscando…», no admite una segunda pulsación mientras tanto y, con respuesta, actualiza el estado y la fecha y lo anuncia una vez.
- F3-A14. Sin red: la comprobación automática no muestra nada y conserva el último resultado conocido (también tras reiniciar); la búsqueda a mano muestra `aj.act.error` bajo el último resultado, con `aj.act.ultima`, y el botón vuelve a estar disponible. Un 403 o un 429 de GitHub se tratan igual.
- F3-A15. «Descargar» abre el navegador con el instalador de este sistema (`.exe` en Windows, `.dmg` en Mac, AppImage o `.deb` en Linux según cómo se ejecute la app) y muestra `aj.act.descargando` con [Guía de instalación]; si la versión no trae ese archivo, abre la página de la versión y muestra esa variante del texto. La app sigue abierta y no ha escrito ningún archivo de instalación.
- F3-A16. Con una versión nueva preliminar, `aj.act.descargando` incluye la frase de la copia de seguridad; con una estable, no.
- F3-A17. Tras instalar la versión nueva y arrancar, el estado es «al día» sin esperar a otra consulta, y no hay punto ni aviso.
- F3-A18. Todo el bloque es operable con teclado en el orden indicado, y los botones que abren el navegador lo dicen en su nombre accesible.
- F3-A19. Capturas en `docs/ux/revision-0.2.2-feature-3/` con nombre `ajustes-1280x800-100-{estado}.png`: `actualizaciones-al-dia`, `actualizaciones-nueva-preliminar`, `actualizaciones-nueva-estable`, `actualizaciones-descargando`, `actualizaciones-error`, `actualizaciones-desactivado`, `actualizaciones-desarrollo`, `aviso-principio`, y `biblioteca-1280x800-100-punto-ajustes.png`.

**Verificación manual** (guía de 0.2.2, con dos versiones publicadas de verdad): instalar la anterior, arrancar con red y comprobar que aparece el punto y que «Descargar» baja el instalador correcto en Windows, Mac y Linux; instalar encima y comprobar que las canciones siguen y el estado pasa a «al día»; arrancar sin red y comprobar que no hay ningún mensaje; comprobar con un monitor de red que solo sale una petición a GitHub.

## 0.2.2 · Feature 9 — Copia de seguridad

Origen: [plan 0.2.2, feature 9](../versiones/0.2.2/plan-4.md) y propuesta [025](../propuestas/025-copia-de-seguridad-y-paquete-de-cancion.md). El paquete, el diálogo de importar, los conflictos, los errores de lectura y el aviso de derechos están en [02 · 0.2.2 · Feature 9](02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra). Esta sección **amplía** la vista con una sección nueva; lo demás no cambia.

Orden de secciones (con lo que añadan las demás features de 0.2.2, que deciden su sitio): Separación de voz · Sincronía automática (feature 10) · Temas · Reproductor · **Copia de seguridad** · Acerca de.

### Wireframe

```
│  Copia de seguridad                                                      │  h2
│  Guarda todas tus canciones, tus temas y tus ajustes en un archivo, para │  `aj.copia.ayuda`
│  no perder tu trabajo o para llevarlo a otro equipo tuyo.                │
│                                                                          │
│  Última copia: 12 nov 2026 · 17 canciones · 1,7 GB · completa            │  `aj.copia.ultima`
│  ⓘ Desde entonces has añadido o cambiado 6 canciones.                    │  `aj.copia.recordatorio` (solo si aplica)
│                                                                          │
│  [ Crear copia de seguridad… ]   [ Restaurar o importar… ]               │  secundarios
```

**Sin ninguna copia todavía**
```
│  Aún no has hecho ninguna copia de seguridad.                            │  `aj.copia.nunca`
│  ⓘ Tienes 12 canciones listas. Una copia las protege si se estropea el   │  `aj.copia.recordatorio.nunca` (con 3 o más Listas)
│    disco o cambias de equipo.                                            │
```

**Diálogo «Crear copia de seguridad»** (el de «Exportar paquete» de spec 02, con otra cabecera y una casilla)
```
┌ Crear copia de seguridad ────────────────────────────────────┐
│ Toda tu biblioteca: 17 canciones y 5 temas                   │
│                                                              │
│ Qué incluye                                                  │
│ ◉ Completa, con el audio                     unos 1,7 GB     │
│   Todo lo necesario para cantar en otro equipo sin volver a  │
│   descargar ni separar nada.                                 │
│ ○ Ligera, sin audio                        menos de 2 MB     │
│   Letras, tiempos, estilos y temas. El audio habría que      │
│   volver a añadirlo canción a canción.                       │
│ [☑] Incluir mis ajustes                                      │
│                                                              │
│ Guardar como                                                 │
│ [D:\Copias\Copia de Shinobi Karaoke 2026-11-21.shinobi] [Cambiar…] │
│ ⚠ Es una copia para ti. (…)                                  │  `paq.aviso.derechos`
│                    [Cancelar] [Crear copia de seguridad]     │
└──────────────────────────────────────────────────────────────┘
```

### Componentes e interacciones

| Elemento | Comportamiento |
|---|---|
| **Qué incluye una copia** | Todas las canciones que se pueden leer (borradores, Listas, Letra lista y Dañadas solo por pistas), el catálogo de temas completo con las asignaciones de artista y álbum y el tema predeterminado, y, si se marca, los ajustes. Las canciones con `cancion.json` ilegible se omiten y se listan al final. No incluye lo de «Qué no lleva nunca» (spec 02). |
| **Incluir mis ajustes** | Marcada por defecto. Lleva las preferencias que no dependen del equipo: agrupación de la Biblioteca, cuenta entre canciones, volumen y voz guía del reproductor, opciones recordadas de exportación (sin las carpetas), distribución de paneles del editor y los interruptores de automatismos de 0.2.2. **No** lleva el estado de la instalación, el perfil de hardware, el modelo de separación, las carpetas recordadas, la pantalla del reproductor ni los consentimientos (aviso de YouTube, modelo Rápido), que se piden de nuevo en cada equipo. |
| **Completa / Ligera** | Como en el paquete (spec 02). Por defecto «Completa». Con la ligera, la restauración en otro equipo deja las canciones como borradores sin audio. |
| **Crear copia de seguridad…** | Abre el diálogo. Al confirmar, el trabajo sigue las reglas de «Creando el paquete» de spec 02: temporal en el destino, cancelable, en segundo plano, fila en el panel de actividad, cuenta en el diálogo de cierre. Mientras se crea, el botón pasa a «Ver la copia en curso» y la sección muestra `aj.copia.creando` con su barra. |
| Canciones con trabajos en curso | Se guardan como estén en ese momento; si se están separando, entran sin pistas. La nota `aj.copia.nota.enCurso` lo dice en el diálogo si hay alguna. |
| **Última copia** | Fecha, número de canciones, tamaño y tipo de la última copia terminada bien **en este equipo**. No se guarda la ruta en la interfaz (la carpeta puede no existir ya); el texto completo incluye el nombre del archivo en `title`. |
| **Recordatorio** | Nota `info` (nunca un diálogo, un toast ni una insignia fuera de Ajustes): con copia previa, si desde entonces se han añadido o modificado **5 o más** canciones (`aj.copia.recordatorio`); sin ninguna copia, si hay **3 o más** canciones Lista (`aj.copia.recordatorio.nunca`). **(Decisión provisional: solo en Ajustes y sin copias automáticas.)** |
| **Restaurar o importar…** | Abre el diálogo «Abrir» del sistema y después el diálogo de importar de spec 02. Sirve igual para una copia de seguridad y para un paquete de canciones. |
| Restaurar una copia: qué añade al diálogo de importar | Título «Restaurar copia de seguridad». Bajo la lista de canciones: (1) línea de temas con las reglas de spec 02; (2) **asignaciones**: las de artista y álbum de la copia se restauran solo donde este equipo no tiene ya una para ese artista o álbum; el tema predeterminado, solo si aquí no hay ninguno (`aj.copia.rest.asignaciones`, con lista revelable de las que no se aplican); (3) casilla **«Restaurar también mis ajustes»** (`aj.copia.rest.ajustes`), visible si la copia los lleva: **marcada** si la biblioteca está vacía (equipo nuevo) y **desmarcada** si ya hay canciones. |
| Restaurar **no borra nada** | Restaurar **añade** lo que falta y pregunta por lo que ya existe (Omitir por defecto). Nunca elimina canciones ni temas que no estén en la copia. Lo dice `aj.copia.rest.noBorra` en el diálogo. |
| Al terminar de restaurar | Resultado por canción (spec 02) con el resumen de temas, asignaciones y ajustes. Si se restauraron ajustes, se aplican al momento y se anuncia `aj.copia.rest.ajustesAplicados`. Se vuelve a la Biblioteca con las canciones importadas resaltadas. |
| Durante una sesión en otra pantalla | Crear una copia: permitido (solo lee). Restaurar o importar: permitido; «Sustituir» no está disponible para la canción que suena (su fila queda en «Omitir» con `bib.cola.activaBloqueada`). |
| Teclado | Los dos botones están en el orden de tabulación de la vista; los diálogos, como en spec 02. |

### Estados

| Estado | Presentación |
|---|---|
| Sin copias | `aj.copia.nunca` (y el recordatorio si aplica). |
| Con copia | `aj.copia.ultima` (y el recordatorio si aplica). |
| Biblioteca vacía | «Crear copia de seguridad…» `aria-disabled` con `aj.copia.vacia`; «Restaurar o importar…» disponible. |
| Creando | `aj.copia.creando` con barra y «Ver la copia en curso». |
| Copia creada | Toast `aj.copia.toast.ok`; la línea «Última copia» se actualiza. |
| Copia creada con canciones omitidas | Estado final del diálogo con la lista de omitidas y su motivo. |
| Error al crear | Los de «Exportar paquete» (`paq.error.*`); la línea «Última copia» no cambia. |
| Restaurando | Diálogo de importar (spec 02). |
| Error al leer la copia | `PAQUETE_NO_VALIDO`, `PAQUETE_VERSION_NUEVA`, `PAQUETE_INCOMPLETO` (spec 02). |

### Accesibilidad

- La sección tiene `h2`; el recordatorio es texto con icono `info` (no `role="alert"`: no interrumpe).
- La barra de «Creando» anuncia inicio, 25/50/75 % y fin.
- Las casillas tienen etiqueta visible y su ayuda en `aria-describedby`.

### Microcopy (feature 9, Ajustes)

| Clave | Texto |
|---|---|
| `aj.copia.titulo` | Copia de seguridad |
| `aj.copia.ayuda` | Guarda todas tus canciones, tus temas y tus ajustes en un archivo, para no perder tu trabajo o para llevarlo a otro equipo tuyo. |
| `aj.copia.nunca` | Aún no has hecho ninguna copia de seguridad. |
| `aj.copia.ultima` | Última copia: {fecha} · {n} canciones · {tamaño} · {completa/ligera} |
| `aj.copia.recordatorio` | Desde entonces has añadido o cambiado {k} canciones. |
| `aj.copia.recordatorio.nunca` | Tienes {k} canciones listas. Una copia las protege si se estropea el disco o cambias de equipo. |
| `aj.copia.crear` | Crear copia de seguridad… · (en curso) Ver la copia en curso |
| `aj.copia.restaurar` | Restaurar o importar… |
| `aj.copia.vacia` | Aún no hay canciones que guardar. |
| `aj.copia.dialogo.titulo` | Crear copia de seguridad |
| `aj.copia.dialogo.cabecera` | Toda tu biblioteca: {n} canciones y {t} temas |
| `aj.copia.completa` | Completa, con el audio — Todo lo necesario para cantar en otro equipo sin volver a descargar ni separar nada. |
| `aj.copia.ligera` | Ligera, sin audio — Letras, tiempos, estilos y temas. El audio habría que volver a añadirlo canción a canción. |
| `aj.copia.ajustes` | Incluir mis ajustes |
| `aj.copia.nombre` | Copia de Shinobi Karaoke {AAAA-MM-DD}.shinobi |
| `aj.copia.nota.enCurso` | {k} canciones se están procesando: se guardarán como están ahora. |
| `aj.copia.boton` | Crear copia de seguridad |
| `aj.copia.creando` | Creando la copia de seguridad… {i} de {n} canciones |
| `aj.copia.toast.ok` | Copia de seguridad creada: {n} canciones, {tamaño}. — [Mostrar en la carpeta] |
| `aj.copia.rest.noBorra` | Restaurar añade lo que falta. No elimina ninguna canción ni ningún tema de tu biblioteca. |
| `aj.copia.rest.asignaciones` | Temas de artistas y álbumes: se restauran {a}; {b} no, porque aquí ya tienen otro. — [Ver cuáles] · (predeterminado) El tema predeterminado de la copia no se aplica: aquí ya tienes uno. |
| `aj.copia.rest.ajustes` | Restaurar también mis ajustes — ayuda: Agrupación de la biblioteca, reproductor, opciones de exportación y distribución del editor. Sustituyen a los de este equipo. |
| `aj.copia.rest.ajustesAplicados` | Ajustes restaurados. |

### Criterios de aceptación de la feature 9 (Ajustes)

- F9-A1. Ajustes muestra la sección «Copia de seguridad» antes de «Acerca de», con `aj.copia.nunca` o `aj.copia.ultima` y los dos botones; con la biblioteca vacía, «Crear copia de seguridad…» está `aria-disabled` con su motivo.
- F9-A2. «Crear copia de seguridad…» genera un único archivo con todas las canciones legibles, el catálogo de temas con asignaciones y predeterminado y (con la casilla marcada) los ajustes; no contiene el motor, los modelos, registros, cachés ni consentimientos (comprobado listando el contenido en un test). Una canción ilegible no impide la copia y aparece como omitida.
- F9-A3. Tras crear la copia, la sección muestra «Última copia: {hoy} · …»; al añadir o modificar 5 canciones aparece `aj.copia.recordatorio` con ese número; sin ninguna copia y con 3 Listas, `aj.copia.recordatorio.nunca`. El recordatorio no aparece en ninguna otra vista ni como toast.
- F9-A4. Restaurar una copia completa en una instalación vacía deja la biblioteca igual que la de origen: mismas canciones y estados, mismos temas, mismas asignaciones de artista y álbum, mismo predeterminado y (con la casilla, marcada por defecto en este caso) mismos ajustes; no restaura consentimientos: el aviso de YouTube se vuelve a pedir.
- F9-A5. Restaurar sobre una biblioteca con canciones: ninguna canción ni tema que no esté en la copia se elimina; las existentes quedan en «Omitir» por defecto; una asignación de álbum que aquí ya existe no se sustituye y se lista en «Ver cuáles»; la casilla de ajustes está desmarcada.
- F9-A6. Cancelar la creación a mitad no deja archivo en el destino y no cambia «Última copia».
- F9-A7. Capturas en `docs/ux/revision-0.2.2-feature-9/` con nombre `ajustes-1280x800-100-{estado}.png`: `copia-nunca`, `copia-ultima-recordatorio`, `copia-dialogo`, `copia-creando`, `restaurar-revisar`.

## 0.2.2 · Feature 10 — Sincronía automática: modelos por idioma

Origen: [plan 0.2.2, feature 10](../versiones/0.2.2/plan-4.md) y propuesta [019](../propuestas/019-sincronia-automatica-por-alineacion-forzada.md). La función está en [06 · 0.2.2 · Feature 10](06-editor.md#022--feature-10--sincronizar-con-la-voz-etapa-1). Esta sección solo define **dónde se ven y se gestionan los modelos** que necesita. **Condición**: se implementa solo si la prueba técnica de la feature cumple su criterio y el arquitecto fija en un ADR el motor, los modelos, sus licencias y sus tamaños; los tamaños e idiomas de los ejemplos son ilustrativos.

**Decisión provisional**: los modelos **no** se descargan en el primer arranque (spec 01 no cambia): pesan del orden de 1 GB por idioma y no todo el mundo los usará. Se descargan la primera vez que se pide «Sincronizar con la voz» en ese idioma (spec 06) o desde aquí.

### Wireframe

```
│  Sincronía automática                                                    │  h2
│  Shinobi Karaoke puede escuchar la voz de una canción para ajustar el    │  `aj.alinear.ayuda`
│  fin de cada línea y marcar sus palabras. Necesita un modelo por idioma. │
│                                                                          │
│  Español     Instalado · 1,2 GB                              [ Quitar ]  │
│  Inglés      No instalado · hay que descargar 1,2 GB       [ Descargar ] │
│  Otros idiomas: todavía no disponibles.                                  │  `aj.alinear.otros`
│                                                                          │
│  [☑] Usarla al preparar canciones automáticamente                        │  `aj.alinear.preparar`
│      Solo en los idiomas instalados. En los demás se usa «Ajustar los    │
│      silencios».                                                         │
```

**Descargando**
```
│  Inglés      Descargando… 34 % · 410 MB de 1,2 GB           [ Cancelar ] │
│              ████████░░░░░░░░░░░░░░░░░                                   │
```

**No disponible en este equipo**
```
│  Sincronía automática                                                    │
│  ⓘ La sincronía automática no está disponible en este equipo. Puedes     │  `aj.alinear.noDisponible`
│    ajustar los fines con «Ajustar los silencios», en el editor.          │
```

### Componentes e interacciones

| Elemento | Comportamiento |
|---|---|
| Lista de idiomas | Una fila por idioma admitido (los que fije el ADR; provisionalmente español e inglés), con su estado: `Instalado · {tamaño}`, `No instalado · hay que descargar {tamaño}`, `Descargando… {p} %`, `Error`. Tamaños leídos del manifiesto, como los modelos de separación. |
| **Descargar** | Empieza la descarga en segundo plano (barra en la fila, [Cancelar]; lo descargado se conserva y la próxima vez continúa). Sigue al salir de Ajustes; al cerrar la app se interrumpe sin diálogo. Errores en línea bajo la fila con los textos de descarga de modelos de spec 01 (`SIN_CONEXION`, `SIN_ESPACIO`, servidor, verificación) y [Reintentar]. Al terminar: toast `aj.alinear.toast.instalado`. |
| **Quitar** | Diálogo `aj.alinear.quitar` (foco en «Cancelar»). Libera el espacio; no cambia ninguna canción ya sincronizada. No disponible mientras ese modelo se está usando (`aj.alinear.quitar.enUso`). |
| **Usarla al preparar canciones automáticamente** | Casilla, marcada por defecto. Controla el paso «Sincronizar con la voz» de la preparación desatendida (feature 5; [04 · Feature 10](04-progreso-pipeline.md#022--feature-10--sincronizar-con-la-voz-en-la-preparación)). La preparación **nunca descarga un modelo por su cuenta**: sin el modelo del idioma, usa «Ajustar los silencios» y lo dice en el resultado. Sin ningún modelo instalado, la casilla sigue marcada y la ayuda añade `aj.alinear.preparar.sinModelos`. |
| No disponible | Si el motor de alineación no se puede usar en este equipo (plataforma, memoria, motor de audio sin esa parte), la sección muestra solo `aj.alinear.noDisponible` (o `aj.alinear.reparar` con [Reparar el motor de audio] si lo que falta es una parte del motor que se puede reinstalar). |
| Copiar información para soporte | Añade una línea `Sincronía automática: {idiomas instalados o «sin modelos» o «no disponible»}`. |

### Estados

| Estado | Presentación |
|---|---|
| Vacío (ningún modelo) | Todas las filas «No instalado» con [Descargar]. |
| Descargando | Barra en la fila + [Cancelar]. |
| Instalado | Tamaño + [Quitar]. |
| Error de descarga | Banner `error` en línea bajo la fila + [Reintentar]. |
| En uso | [Quitar] `aria-disabled` con su motivo. |
| No disponible en el equipo | Solo la nota. |

### Microcopy (feature 10, Ajustes)

| Clave | Texto |
|---|---|
| `aj.alinear.titulo` | Sincronía automática |
| `aj.alinear.ayuda` | Shinobi Karaoke puede escuchar la voz de una canción para ajustar el fin de cada línea y marcar sus palabras. Necesita un modelo por idioma. |
| `aj.alinear.idioma` | Español · Inglés |
| `aj.alinear.estado` | Instalado · {tamaño} · No instalado · hay que descargar {tamaño} · Descargando… {p} % · {x} de {y} |
| `aj.alinear.botones` | Descargar · Cancelar · Quitar · Reintentar |
| `aj.alinear.otros` | Otros idiomas: todavía no disponibles. |
| `aj.alinear.preparar` | Usarla al preparar canciones automáticamente — ayuda: Solo en los idiomas instalados. En los demás se usa «Ajustar los silencios». |
| `aj.alinear.preparar.sinModelos` | Aún no hay ningún modelo instalado: de momento se usará «Ajustar los silencios». |
| `aj.alinear.toast.instalado` | Modelo de {idioma} instalado. |
| `aj.alinear.quitar` | Título: ¿Quitar el modelo de {idioma}? · Cuerpo: Se liberarán {tamaño}. Las canciones ya sincronizadas no cambian. Para volver a usarlo habrá que descargarlo otra vez. — [Cancelar] [Quitar] |
| `aj.alinear.quitar.enUso` | Se está usando ahora. Espera a que termine. |
| `aj.alinear.noDisponible` | La sincronía automática no está disponible en este equipo. Puedes ajustar los fines con «Ajustar los silencios», en el editor. |
| `aj.alinear.reparar` | Falta la parte del motor de audio que hace la sincronía automática. — [Reparar el motor de audio] |

### Criterios de aceptación de la feature 10 (Ajustes)

- F10-A1. Ajustes muestra «Sincronía automática» tras «Separación de voz» con una fila por idioma admitido y su estado y tamaño leídos del manifiesto; el primer arranque no descarga ningún modelo de alineación.
- F10-A2. «Descargar» muestra la barra en la fila con [Cancelar], sigue al salir de la vista y, al terminar, la fila pasa a «Instalado» con `aj.alinear.toast.instalado`; cancelar conserva lo descargado; un error muestra su texto en línea con [Reintentar].
- F10-A3. «Quitar» pide confirmación con el foco en «Cancelar», libera el espacio y no modifica ninguna canción; con una sincronización en curso en ese idioma está `aria-disabled` con su motivo.
- F10-A4. Con la casilla desmarcada, la preparación desatendida no ejecuta «Sincronizar con la voz» aunque el modelo esté instalado; marcada y sin el modelo del idioma, usa «Ajustar los silencios» y no inicia ninguna descarga (comprobado en el gestor de trabajos).
- F10-A5. Con el motor de alineación no disponible (doble), la sección muestra solo `aj.alinear.noDisponible`, sin filas ni casilla.
- F10-A6. Captura `docs/ux/revision-0.2.2-feature-10/ajustes-1280x800-100-{sincronia-automatica|descargando|no-disponible}.png`.

## 0.2.2 · Feature 5 — Letras y preparación automática

Origen: [plan 0.2.2, feature 5](../versiones/0.2.2/plan-4.md) («Privacidad (020): la búsqueda automática envía título y artista a LRCLIB sin que el usuario entre en la vista de Letra. Hay que revisar esa regla del ADR 0005 y añadir un interruptor») y [propuesta 020](../propuestas/020-preparacion-desatendida.md). Qué hace la preparación: [04 · 0.2.2 · Feature 5](04-progreso-pipeline.md#022--feature-5--preparación-desatendida). Revisión del [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md) pendiente del arquitecto: [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) §1. Decisiones provisionales: [0154](../preguntas/0154-decisiones-provisionales-de-ux-de-las-features-4-a-7.md). Esta sección **amplía** la vista con una sección nueva.

Orden de secciones: Separación de voz · Sincronía automática (feature 10) · **Letras y preparación automática** · Temas · Reproductor · Copia de seguridad · Actualizaciones y Acerca de (donde las pongan sus features).

**Qué cambia en la privacidad**: hasta 0.2.1, el título y el artista de una canción solo salían hacia LRCLIB cuando el usuario entraba en el paso «Letra» o pulsaba «Buscar». Con la preparación desatendida salen **al añadir la canción**. El usuario lo sabe antes de que ocurra (texto del formulario «Revisar datos», spec 03) y lo puede apagar aquí.

### Wireframe

```
│  Letras y preparación automática                                         │  h2
│                                                                          │
│  ☑ Buscar la letra automáticamente al añadir una canción                 │  casilla
│    Shinobi Karaoke busca la letra en LRCLIB (lrclib.net), la comprueba   │  aj.prep.privacidad
│    con la voz y deja la canción lista para revisar. Para buscarla se     │  (t-pequeno, texto-2)
│    envían el título, el artista, el álbum y la duración de la canción,   │
│    y nada más: ningún dato tuyo ni de tu equipo. LRCLIB ve tu dirección  │
│    IP, como cualquier web que visitas.              Qué es LRCLIB ↗      │
```

**Desactivada**
```
│  ☐ Buscar la letra automáticamente al añadir una canción                 │
│    Desactivada: la letra solo se busca cuando entras en el paso «Letra»  │  aj.prep.desactivado
│    de una canción o usas «Preparar». Las canciones nuevas se separan y   │
│    se quedan como borradores sin letra.                                  │
```

**Al activarla con borradores sin letra**
```
│    ⓘ Tienes 5 borradores sin letra. La casilla vale para las canciones   │  aj.prep.pendientes
│      que añadas desde ahora; estos se preparan desde la Biblioteca.      │
│                                              [ Verlos en la Biblioteca ] │
```

### Componentes e interacciones

| Elemento | Comportamiento |
|---|---|
| **Buscar la letra automáticamente al añadir una canción** | Casilla, **marcada por defecto**, también al actualizar desde 0.2.1 **(decisión provisional: la idea de la versión es automatizar; el formulario de «Añadir canción» lo avisa cada vez y aquí se apaga)**. Se guarda al cambiarla y persiste entre reinicios. Fallo al guardar: vuelve a su valor y sale `aj.rep.toast.error`. |
| **Marcada** | Toda canción nueva (una a una o en lote) busca su letra al completarse su fuente y sigue la cadena de la spec 04. Bajo la casilla, `aj.prep.privacidad`, siempre a la vista. |
| **Desmarcada** | Ninguna petición a LRCLIB sale sin una acción del usuario: entrar en «Letra», pulsar «Buscar», [Reintentar] de una letra pendiente o «Preparar» (una canción o varias). Bajo la casilla, `aj.prep.desactivado`. El formulario de «Añadir canción» deja de mostrar `add.dato.lrclib` y la tabla de un lote muestra `add.lote.despues.sinLetra`. |
| **Cambiarla con trabajos en cola** | Al desmarcarla, las búsquedas automáticas que aún no han salido **no salen**; las canciones siguen separándose y quedan «Falta la letra». Las ya hechas no se deshacen. Al marcarla, vale para las canciones que se añadan desde ese momento. |
| **Aviso de borradores sin letra** | Al marcar la casilla con borradores «Falta la letra» en la biblioteca: `aj.prep.pendientes` con [Verlos en la Biblioteca], que abre la Biblioteca con la casilla «Esperan letra» de la bandeja activa (spec 02). Desaparece al salir de Ajustes. |
| **Qué es LRCLIB** | Enlace que abre lrclib.net en el navegador del sistema. |
| **Lo que no tiene ajuste** | Comprobar la letra con la voz, corregir el desfase y ajustar los fines no usan red y no tienen casilla propia: van con la preparación. La alineación de la feature 10 tiene su casilla en su sección. Retomar al abrir los trabajos que quedaron a medias tampoco tiene ajuste: se detiene con [Detener] en la Biblioteca. |
| **Copiar información para soporte** | Añade la línea «Búsqueda automática de letra: activada» o «desactivada». |
| **Aviso sobre YouTube** | El diálogo de solo lectura muestra el texto con su punto nuevo sobre listas y álbumes (spec 03, feature 7). |
| **Teclado** | La casilla es una parada de tabulación; Espacio la alterna. |

### Estados

| Estado | Presentación |
|---|---|
| Normal (marcada) | Casilla marcada y `aj.prep.privacidad`. |
| Desactivada | Casilla desmarcada y `aj.prep.desactivado`. |
| Recién activada con borradores sin letra | Además, `aj.prep.pendientes`. |
| Error al guardar | Valor anterior y toast `aj.rep.toast.error`. |
| Sin red | La sección no cambia (no consulta nada). |
| Sin motor instalado (diálogo Acerca de del primer arranque) | La sección no se muestra. |

### Accesibilidad

- La casilla se describe con `aj.prep.privacidad` o `aj.prep.desactivado` (`aria-describedby`); el texto está visible sin abrir nada.
- `aj.prep.pendientes` aparece en una región `role="status"`.

### Microcopy (0.2.2 · feature 5, Ajustes)

| Clave | Texto |
|---|---|
| `aj.prep.titulo` | Letras y preparación automática |
| `aj.prep.casilla` | Buscar la letra automáticamente al añadir una canción |
| `aj.prep.privacidad` | Shinobi Karaoke busca la letra en LRCLIB (lrclib.net), la comprueba con la voz y deja la canción lista para revisar. Para buscarla se envían el título, el artista, el álbum y la duración de la canción, y nada más: ningún dato tuyo ni de tu equipo. LRCLIB ve tu dirección IP, como cualquier web que visitas. |
| `aj.prep.desactivado` | Desactivada: la letra solo se busca cuando entras en el paso «Letra» de una canción o usas «Preparar». Las canciones nuevas se separan y se quedan como borradores sin letra. |
| `aj.prep.lrclib` | Qué es LRCLIB |
| `aj.prep.pendientes` | Tienes {n} borradores sin letra. La casilla vale para las canciones que añadas desde ahora; estos se preparan desde la Biblioteca. — [Verlos en la Biblioteca] · (n = 1) Tienes 1 borrador sin letra. … este se prepara desde la Biblioteca. — [Verlo en la Biblioteca] |
| `aj.soporte.busqueda` | Búsqueda automática de letra: activada · Búsqueda automática de letra: desactivada |

### Criterios de aceptación (0.2.2 · feature 5, Ajustes)

- F5-J1. Ajustes muestra la sección «Letras y preparación automática» con la casilla marcada por defecto (instalación nueva y actualización desde 0.2.1) y el texto `aj.prep.privacidad` visible y asociado a la casilla.
- F5-J2. Con la casilla desmarcada, añadir una canción (o un lote) no produce ninguna petición a LRCLIB (doble de LRCLIB: 0 llamadas hasta entrar en «Letra» o usar «Preparar»); el valor persiste al reiniciar.
- F5-J3. Con la casilla marcada, añadir una canción produce exactamente una búsqueda con título, artista, álbum y duración, y la cabecera `User-Agent` del ADR 0005, sin ningún otro dato.
- F5-J4. Desmarcar la casilla con 3 canciones en cola cuya búsqueda aún no ha salido evita esas 3 búsquedas; las canciones terminan su separación y quedan «Falta la letra».
- F5-J5. Marcar la casilla con borradores «Falta la letra» muestra `aj.prep.pendientes` con el recuento; [Verlos en la Biblioteca] abre la Biblioteca con la casilla «Esperan letra» activa. No se lanza ninguna búsqueda para esos borradores.
- F5-J6. «Copiar información para soporte» incluye `aj.soporte.busqueda`.
- F5-J7. Con un fallo de escritura simulado, la casilla vuelve a su valor y aparece `aj.rep.toast.error`.
- F5-J8. Captura `docs/ux/revision-0.2.2-feature-5/ajustes-1280x800-100-{letras|letras-desactivada|letras-pendientes}.png`.
