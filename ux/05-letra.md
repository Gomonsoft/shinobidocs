# 05 — Letra (buscar en LRCLIB, pegar o importar)

- Paso del pipeline: 3 (Letra)
- ADRs: [0005](../adr/0005-letras-y-formato-de-sincronia.md), [0006](../adr/0006-persistencia-y-modelo-de-datos.md)
- Restricciones: [arquitectura.md "Restricciones e implicaciones para UX" §2–§4, §7](../arquitectura.md)
- Preguntas: [0022](../preguntas/0022-huecos-ux-de-la-vista-letra-fase-4.md) (huecos de la Fase 4; respondida) y [0024](../preguntas/0024-stepper-letra-actual-y-volver-a-letra-desde-el-editor.md) (✓ de Letra en el stepper estando en la vista; respondida). Ver la sección "Casos de la Fase 4" al final (§10: texto demasiado largo).
- 0.2.2 (2026-11-21): cada candidata se comprueba con la voz y se corrige el desfase de toda la letra ([Feature 4](#022--feature-4--comprobar-la-letra-contra-el-audio-y-corregir-el-desfase)); la vista se abre con lo que la preparación desatendida ya encontró ([Feature 5](#022--feature-5--preparación-desatendida-la-vista-letra)).

## Objetivo
Conseguir la letra correcta de la canción con el mínimo esfuerzo: encontrarla en LRCLIB (idealmente ya sincronizada), elegir entre candidatos o, si no hay, pegarla o importarla. **Sin callejones sin salida**: siempre hay una alternativa manual.

Usuario/tarea principal: "Quiero la letra de esta canción, a ser posible ya sincronizada".

## Wireframes

**A — Resultados** (la búsqueda se lanza sola al entrar si la canción no tiene letra)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ ‹ Biblioteca │ «Bohemian Rhapsody» · Queen          ✎ Borrador · guardado │
│   (1)✓ Fuente ──── (2)⟳ Separación 42 % ──── (3)● Letra ──── (4)○ Editor  │
├──────────────────────────────────────────────────────────────────────────┤
│  Letra                                                                   │
│  Título [ Bohemian Rhapsody      ] Artista [ Queen        ] [ Buscar ]    │
│                                                                          │
│  ┌ Resultados (3) ───────────────────┐ ┌ Vista previa ─────────────────┐ │
│  │ ◉ Bohemian Rhapsody — Queen       │ │ [00:00.5] Is this the real life│ │
│  │   A Night at the Opera · 5:55     │ │ [00:04.2] Is this just fantasy │ │
│  │   (◆ Sincronizada por palabra)    │ │ [00:07.9] Caught in a landslide│ │
│  │   ✓ Duración igual que tu audio   │ │ …                              │ │
│  │ ○ Bohemian Rhapsody — Queen       │ │                                │ │
│  │   Live Aid · 6:02                 │ │ 52 líneas                      │ │
│  │   (◇ Sincronizada por línea)      │ │                                │ │
│  │   ⚠ 7 s más larga que tu audio    │ │                                │ │
│  │ ○ Bohemian Rhapsody — Queen       │ │                                │ │
│  │   (▭ Solo texto)                  │ │                                │ │
│  └───────────────────────────────────┘ └────────────────────────────────┘ │
│  Letra: LRCLIB                                                           │
│                                                                          │
│  ¿No es ninguna?  [ Pegar la letra ] [ Importar archivo .lrc o .txt ]    │
│                                          [ Usar esta letra ] (primario)  │
└──────────────────────────────────────────────────────────────────────────┘
```

**B — Pegar la letra**
```
│  Pega la letra                                                           │
│  Una línea de la canción por renglón. Deja un renglón en blanco entre    │
│  estrofas si quieres. Borra los renglones que no se cantan, como         │
│  «[Estribillo]» o «(x2)».                                                │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Is this the real life?                                           │   │
│  │ Is this just fantasy?                                            │   │
│  │ …                                                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  52 líneas · se sincronizarán en el editor                              │
│  (si es LRC:) ⓘ Hemos detectado tiempos de sincronía y los conservaremos.│
│               Ignoraremos 2 renglones sin tiempo.                       │
│                   [ Volver a los resultados ] (fantasma) [ Usar esta letra ]│
```

**C — Letra ya elegida** (al volver a este paso)
```
│  Letra actual · de LRCLIB · sincronizada por línea · 52 líneas           │
│  Letra: LRCLIB                                                           │
│  (tras importar un LRC con renglones ignorados, hasta salir de la vista:)│
│  ⓘ Hemos ignorado 2 renglones sin tiempo del archivo.            [ × ]   │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Área de texto editable con la letra (sin marcas de tiempo)       │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  (si algún renglón empieza por [mm:ss]:)                                 │
│  ⓘ Aquí las marcas como «[01:23.45]» se guardan como texto. Para         │
│    conservar los tiempos, importa el archivo o pega la letra desde       │
│    «Buscar otra letra».                                                  │
│  ⓘ Si cambias el texto de una línea, esa línea tendrá que volver a       │
│    sincronizarse. Las demás conservan su tiempo.                         │
│  [ Buscar otra letra ] [ Importar archivo ]           [ Ir al editor ]   │
```

**C con el área vacía** (0 líneas; ver "Casos de la Fase 4" §2)
```
│  Sin letra todavía. Escribe o pega aquí la letra, o busca otra.          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  (solo si la canción está Lista:)                                        │
│  ⚠ Una canción lista necesita al menos una línea de letra. Este cambio   │
│    no se ha guardado.                                                    │
│  [ Buscar otra letra ] [ Importar archivo ]   [ Ir al editor ] (inactivo)│
```

## Componentes e interacciones
| Elemento | Comportamiento |
|----------|----------------|
| Campos Título / Artista | Prerrellenados con los metadatos; editables (se guardan en la canción al buscar). Intro = Buscar. |
| Buscar | `get` → `search` (ADR 0005). Botón en estado "Buscando…" (normalmente < 2 s, timeout 10 s). Se lanza automáticamente al entrar si no hay letra. |
| Lista de resultados | `role="listbox"`, selección única, flechas ↑/↓ cambian selección y la vista previa; el primero (mejor ordenado) viene seleccionado. Cada candidato: título — artista, álbum · duración, **insignia de sincronía** y **comparación de duración**. |
| Insignia de sincronía | ◆ "Sincronizada por palabra" (`exito`) · ◇ "Sincronizada por línea" (`info`) · ▭ "Solo texto" (`texto-2`). Icono + texto siempre. Una letra por palabra se conserva y se resalta por palabra en el reproductor, aunque en el MVP el editor solo ajusta tiempos de línea ([0002](../preguntas/0002-sincronia-por-palabra-en-mvp.md)). |
| Comparación de duración | Diferencia con la duración real del audio: ≤ 2 s → "✓ Duración igual que tu audio"; 3–10 s → "⚠ {n} s más larga/corta que tu audio" (`aviso`); > 10 s → "⚠ Duración muy distinta: puede ser otra versión" (`aviso`). |
| Vista previa | Primeras ~15 líneas con sus tiempos (si los tiene), desplazable; total de líneas. |
| Usar esta letra | Guarda la letra (`origen: lrclib`, `lrclib_id`), marca el paso Letra como completado y pasa a la vista C con foco en "Ir al editor". Se puede guardar mientras la fuente de YouTube sigue descargándose. Si ya hay una letra con ≥ 1 línea, pide confirmación antes (diálogo `let.dialogo.sustituir`, con dos variantes según tenga o no sincronía; ver "Casos de la Fase 4" §4). |
| Atribución | "Letra: LRCLIB" visible bajo los resultados y en la vista C mientras el origen sea LRCLIB (enlace a lrclib.net en el navegador del sistema). |
| Pegar la letra | Muestra B. Contador de líneas en vivo (no cuenta renglones vacíos). Pegar un texto con marcas `[mm:ss.xx]` se detecta como LRC y se importa con sus tiempos (aviso `let.pegar.lrc` y, si hay renglones con texto sin marca, `let.pegar.ignoradas`). El texto pegado se conserva mientras no se salga de la vista Letra (también al ir a "Volver a los resultados" y volver). "Usar esta letra" pide confirmación como en A. Un texto que supera el límite (512 KB o 5000 renglones) muestra `let.pegar.demasiado` (§10). |
| Importar archivo | Diálogo nativo con filtro `.lrc`, `.txt`. Se aplica igual que "Usar esta letra" (`origen: archivo`); si el archivo no tiene líneas válidas: "Este archivo no contiene letra que podamos leer." La confirmación de sustituir se pide **después** de leer el archivo y solo si es válido; cancelar el selector o el diálogo no cambia nada. Si era un LRC con renglones ignorados, la vista C muestra `let.importar.ignoradas` hasta cerrarlo o salir de la vista. |
| Edición en C | Área de texto con la letra (una línea por renglón). Autoguardado al salir del área o tras 1 s sin escribir. Las líneas cuyo texto no cambia conservan sus tiempos (y sus palabras sincronizadas); las líneas nuevas o modificadas quedan sin sincronizar. Solo cuentan como "sin cambio" las diferencias de espacios (al principio/final o espacios dobles); cambiar mayúsculas, puntuación o una sola letra deja la línea sin sincronizar. Las líneas repetidas (estribillos) se emparejan en orden ([0005](../preguntas/0005-viabilidad-detalles-ux-fase-0.md) §4). El aviso `let.edicion.aviso` cubre este comportamiento. |
| Renglones vacíos | Se guardan como **pausa** (separador de estrofa): en el editor se muestran como fila "♪ pausa" y no requieren sincronía ni cuentan en el número de líneas (ver spec 06). Varios renglones vacíos seguidos = **una** pausa; los del principio y del final se descartan. En un LRC, una marca de tiempo sin texto (`[01:23.45]`) es una pausa **con tiempo**: marca el final de la línea anterior. |
| Ir al editor | Navega a la vista 06 cuando el audio está listo. Si la descarga de YouTube sigue en curso, muestra el estado `let.esperandoAudio` con un indicador giratorio y deja el botón inactivo hasta que `evento:cancion` confirme la fuente completada. No muestra un error de guardado: la letra ya está guardada. |
| Teclado | Foco inicial: lista de resultados (si hay) o campo Título (si no). Ctrl/Cmd+Intro = "Usar esta letra". |

## Estados
| Estado | Presentación |
|--------|--------------|
| Vacío (sin búsqueda aún) | Campos + "Buscar" + alternativas manuales visibles. |
| Cargando | Lista con 3 filas esqueleto + "Buscando la letra…". "Pegar la letra" e "Importar" siguen disponibles. |
| Sin resultados (`LETRA_NO_ENCONTRADA`) | Banner `info`: "**No encontramos la letra.** Revisa el título y el artista (quita cosas como «Remastered» o «Live») y busca de nuevo, o pega la letra tú." + foco en Título. |
| Instrumental (`INSTRUMENTAL`) | Banner `aviso`: "**Esta canción es instrumental**, según LRCLIB. Si tiene letra, pégala o impórtala." |
| Instrumental con candidatos (`instrumental: true` y lista no vacía) | Banner `aviso` `let.aviso.instrumentalConCandidatos` encima de la lista; la lista se muestra y se usa con normalidad (foco en la lista). |
| Letra vacía (C, 0 líneas) | Ver "Casos de la Fase 4" §2. |
| Sin conexión / servicio caído | Banner `aviso` con texto del código + [Reintentar]; alternativas manuales destacadas. |
| Éxito | Vista C. Stepper: Letra ✓. |
| Borrador | Todo se autoguarda; "✎ Borrador · guardado" en la cabecera. |

## Microcopy
| Clave | Texto |
|-------|-------|
| `let.titulo` | Letra |
| `let.boton.buscar` | Buscar |
| `let.buscando` | Buscando la letra… |
| `let.resultados` | Resultados ({n}) |
| `let.sync.palabra` / `linea` / `texto` | Sincronizada por palabra · Sincronizada por línea · Solo texto |
| `let.dur.igual` | Duración igual que tu audio |
| `let.dur.dif` | {n} s más larga que tu audio · {n} s más corta que tu audio |
| `let.dur.muydif` | Duración muy distinta: puede ser otra versión |
| `let.atribucion` | Letra: LRCLIB |
| `let.alternativa` | ¿No es ninguna? |
| `let.boton.pegar` | Pegar la letra |
| `let.boton.importar` | Importar archivo .lrc o .txt |
| `let.boton.usar` | Usar esta letra |
| `let.pegar.titulo` | Pega la letra |
| `let.pegar.ayuda` | Una línea de la canción por renglón. Deja un renglón en blanco entre estrofas si quieres. Borra los renglones que no se cantan, como «[Estribillo]» o «(x2)». |
| `let.pegar.contador` | {n} líneas · se sincronizarán en el editor |
| `let.pegar.lrc` | Hemos detectado tiempos de sincronía y los conservaremos. |
| `let.pegar.ignoradas` | Ignoraremos {n} renglones sin tiempo. · (1) Ignoraremos 1 renglón sin tiempo. |
| `let.pegar.demasiado` | Este texto es demasiado largo para ser una letra. Comprueba que has pegado solo la letra de la canción. |
| `let.error.demasiadoLarga` | El texto es demasiado largo para ser una letra. Este cambio no se ha guardado. |
| `let.importar.ignoradas` | Hemos ignorado {n} renglones sin tiempo del archivo. · (1) Hemos ignorado 1 renglón sin tiempo del archivo. |
| `let.boton.volver` | Volver a los resultados |
| `let.actual` | Letra actual · {origen} · {sincronía} · {n} líneas (con 1: "1 línea") |
| `let.origen.lrclib` / `manual` / `archivo` | de LRCLIB · pegada · de un archivo |
| `let.actual.sync.palabra` / `linea` / `ninguna` / `parte` | sincronizada por palabra · sincronizada por línea · sin sincronizar · sincronizada en parte |
| `let.actual.vacia` | Sin letra todavía. Escribe o pega aquí la letra, o busca otra. |
| `let.error.listaSinLineas` | Una canción lista necesita al menos una línea de letra. Este cambio no se ha guardado. |
| `let.edicion.marcas` | Aquí las marcas como «[01:23.45]» se guardan como texto. Para conservar los tiempos, importa el archivo o pega la letra desde «Buscar otra letra». |
| `let.edicion.aviso` | Si cambias el texto de una línea, esa línea tendrá que volver a sincronizarse. Las demás conservan su tiempo. |
| `let.boton.otra` | Buscar otra letra |
| `let.boton.editor` | Ir al editor |
| `let.esperandoAudio` | Esperando la canción para continuar… |
| `let.editorEsperando` | Espera a que termine la descarga para continuar. |
| `let.editorAudioNoListo` | El audio todavía no está listo para continuar. |
| `let.dialogo.sustituir` | Con sincronía: ¿Sustituir la letra actual? Perderás la sincronía que hayas hecho. — [Cancelar] [Sustituir] |
| `let.dialogo.sustituirTexto` | Sin sincronía: ¿Sustituir la letra actual? Se reemplazará el texto que tienes ahora. — [Cancelar] [Sustituir] |
| `let.aviso.instrumentalConCandidatos` | **La versión más parecida es instrumental**, según LRCLIB. Abajo tienes otras versiones con letra: comprueba que coinciden con tu audio. |
| `let.error.LETRA_NO_ENCONTRADA` | **No encontramos la letra.** Revisa el título y el artista (quita cosas como «Remastered» o «Live») y busca de nuevo, o pega la letra tú. |
| `let.error.INSTRUMENTAL` | **Esta canción es instrumental**, según LRCLIB. Si tiene letra, pégala o impórtala. |
| `let.error.SIN_CONEXION` | **Sin conexión a internet.** Puedes pegar la letra o importar un archivo, y buscarla más tarde. |
| `let.error.SERVICIO_NO_DISPONIBLE` | **El servicio de letras no responde.** Suele ser temporal. Reintenta en unos minutos o pega la letra tú. |
| `let.error.archivo` | Este archivo no contiene letra que podamos leer. |

## Criterios de aceptación
1. Al entrar en el paso sin letra, la búsqueda se lanza automáticamente con título, artista, álbum y duración de la canción.
2. Cada candidato muestra título, artista, álbum (si hay), duración, insignia de sincronía (palabra/línea/texto, con icono y texto) y la comparación de duración con los umbrales indicados.
3. Los resultados aparecen ordenados (palabra > línea > texto, y por cercanía de duración) con el primero seleccionado y su vista previa visible.
4. Las flechas ↑/↓ cambian el candidato seleccionado y actualizan la vista previa.
5. "Usar esta letra" guarda letra y origen, marca el paso Letra como completado y muestra la vista C; si ya había una letra con ≥ 1 línea, pide confirmación antes de sustituir (criterio 16).
6. Cuando el origen es LRCLIB se muestra "Letra: LRCLIB" en la vista y se guarda `lrclib_id`.
7. Sin resultados, instrumental, sin conexión o servicio caído muestran su banner y nunca bloquean: "Pegar la letra" e "Importar" están siempre disponibles.
8. Editar título/artista y pulsar Buscar (o Intro) repite la búsqueda y guarda los metadatos en la canción.
9. Pegar texto plano crea líneas sin sincronizar (renglones vacíos = pausas: varios seguidos forman una sola y se descartan los del principio y del final); pegar texto LRC conserva sus tiempos y lo indica, y sus marcas sin texto se guardan como pausas con tiempo.
10. Importar `.lrc`/`.txt` funciona igual; un archivo sin líneas válidas muestra el error y no modifica la letra existente.
11. En la vista C, las ediciones se autoguardan; las líneas sin cambios (o con cambios solo de espacios) conservan sus tiempos y palabras, y cualquier otro cambio en una línea (mayúsculas, puntuación, letras) la deja sin sincronizar.
12. La búsqueda no bloquea la interfaz y supera el timeout de 10 s con el banner de servicio no disponible.
13. La vista es operable con teclado; Ctrl/Cmd+Intro equivale a "Usar esta letra".
14. **Resumen de C**: `let.actual` usa `let.origen.*` según `origen` y `let.actual.sync.*` según la regla de "Casos de la Fase 4" §1; con 1 línea dice "1 línea". No se muestra el nombre del archivo importado.
15. **Área vacía**: en borrador, se guarda, se muestra `let.actual.vacia`, el stepper pasa a Letra ○, Editor queda no navegable con `paso.motivo.sinLetra` e "Ir al editor" queda inactivo; la vista sigue en C. En una canción lista, no se guarda, se muestra `let.error.listaSinLineas` bajo el área sin borrar lo escrito y el aviso desaparece en cuanto el área tiene ≥ 1 línea (que se guarda con normalidad).
16. **Sustituir**: "Usar esta letra" (A), "Usar esta letra" (B) e "Importar" piden confirmación si la canción ya tiene ≥ 1 línea: `let.dialogo.sustituir` si alguna línea tiene inicio, `let.dialogo.sustituirTexto` si no. Foco inicial en "Cancelar"; Cancelar o Esc no cambian nada. Al importar, el diálogo sale tras leer el archivo y solo si es válido.
17. **Marcas en C**: un texto con `[mm:ss]` escrito o pegado en el área de C se guarda como texto literal; mientras algún renglón empiece por una marca de tiempo se muestra `let.edicion.marcas` (informativo, no bloquea el guardado).
18. **Instrumental con candidatos**: con `instrumental: true` y candidatos, se muestra la lista con `let.aviso.instrumentalConCandidatos` encima; sin candidatos, `let.error.INSTRUMENTAL`.
19. **Renglones ignorados**: al pegar un LRC con renglones de texto sin marca, B muestra `let.pegar.ignoradas` con el recuento en vivo; al importarlo, C muestra `let.importar.ignoradas` (cerrable, desaparece al salir de la vista). Sin renglones ignorados no se muestra nada.
20. **Navegar**: al volver a la vista sin haber elegido letra en los 10 min siguientes, se ven los resultados anteriores sin consultar la red; pasado ese tiempo, o con "Buscar" o "Buscar otra letra", se consulta de nuevo. El texto de B se conserva al pasar a A y volver a B mientras no se salga de la vista Letra.
21. **Texto demasiado largo** (§10): en B, con más de 512 KB (UTF-8) o más de 5000 renglones, se muestra `let.pegar.demasiado` como aviso `error` en línea bajo el área, el contador de líneas y los avisos de LRC no se muestran y "Usar esta letra" queda inactivo; el aviso desaparece en cuanto el texto vuelve a caber. En C, el mismo límite muestra `let.error.demasiadoLarga` bajo el área, sin guardar ni borrar lo escrito y sin el toast genérico de error; si se sale de la vista así, se conserva la última letra guardada. El texto "512 KB" no aparece en la interfaz.
22. **Letra antes de terminar YouTube**: "Usar esta letra", pegar e importar guardan la letra aunque la fuente siga `en_curso`; no se pierde el progreso de descarga. En C aparece el icono giratorio con `let.esperandoAudio`, "Ir al editor" queda inactivo con el motivo `let.editorEsperando`, y la interfaz lo habilita al recibir `evento:cancion` con la fuente `completado`. No aparece "No se pudo guardar la letra" por el estado de la fuente.

## Casos de la Fase 4 (respuesta a `preguntas/0022`)

**§1 Resumen de C.** `Letra actual · {origen} · {sincronía} · {n} líneas`, p. ej. "Letra actual · de LRCLIB · sincronizada por línea · 52 líneas" o "Letra actual · pegada · sin sincronizar · 12 líneas". No se guarda ni se muestra el nombre del archivo. Sincronía, mirando solo los elementos `linea`:
| Condición | Texto |
|-----------|-------|
| Ninguna línea con inicio | sin sincronizar |
| Unas con inicio y otras sin él | sincronizada en parte |
| Todas con inicio y al menos una con palabras | sincronizada por palabra |
| Todas con inicio y ninguna con palabras | sincronizada por línea |

**§2 Área vacía.** En borrador se guarda y la vista se queda en C (no salta a A mientras se está en ella); al volver a entrar más tarde se ve A con la búsqueda automática, como cualquier canción sin letra. En una lista no se guarda (aviso `let.error.listaSinLineas`); no se ofrece "Volver a borrador" aquí: si el usuario quiere rehacer la letra desde cero, tiene "Buscar otra letra", "Importar" o el menú de la Biblioteca. Si sale de la vista con el área vacía, al volver ve la letra guardada.

**§3 Marcas en C.** Texto literal (la detección de LRC solo ocurre en B y al importar), con el aviso informativo `let.edicion.marcas`. Regla del aviso: algún renglón empieza por `[m:ss]` o `[mm:ss.xx]`.

**§4 Confirmación al sustituir.** En los tres caminos (A, B, Importar) y siempre que haya ≥ 1 línea, no solo con sincronía: una letra pegada y retocada también es trabajo. Al importar, después de leer el archivo y solo si es válido (un archivo no válido muestra `let.error.archivo` sin diálogo).

**§5 Instrumental con candidatos.** Texto propio (`let.aviso.instrumentalConCandidatos`), porque `let.error.INSTRUMENTAL` ("es instrumental… pégala") contradice una lista con letras.

**§6 Renglones de estructura.** Sin filtrado automático (riesgo de borrar versos reales); se conservan como líneas y la ayuda de B pide borrarlos.

**§7 Navegación.** Resultados anteriores durante 10 min (caché en memoria del ADR 0005); "Buscar" y "Buscar otra letra" consultan siempre. El texto de B vive en el estado de la vista Letra: se pierde al salir de ella o al usarlo.

**§8 Motivos del stepper.** Ver `00-mapa-de-vistas.md` §2: se mantienen "Primero añade el audio" y "Primero elige una letra", y se añade "Espera a que termine la descarga" para Letra/Editor con la fuente descargándose.

**§9 Renglones ignorados en un LRC.** Sí se avisa (`let.pegar.ignoradas` en B, `let.importar.ignoradas` en C), porque perder versos en silencio rompe "nunca perder trabajo". Cómo llega el recuento al renderer: `preguntas/0023`.

**§10 Texto demasiado largo** (revisión 2026-11-05 del texto que añadió la tarea 0085 sin spec). Se **corrige** "El texto es demasiado largo (máximo 512 KB).":
- "KB" es jerga y el número no ayuda a nadie: una letra real ocupa 2–10 KB, así que quien llega al límite ha pegado otra cosa (una página entera, un libro, un archivo binario). El mensaje dice qué pasó y qué hacer.
- El límite no es solo de bytes: los conversores también rechazan más de 5000 renglones (`ErrorLetraDemasiadoGrande('elementos')`), y para ese caso "máximo 512 KB" era falso.
- Textos: `let.pegar.demasiado` en B y `let.error.demasiadoLarga` en C (antes C mostraba el toast genérico "No se pudo guardar la letra."). Al importar un archivo que supera el límite se mantiene `let.error.archivo`. Criterio 21.

## 0.2.1 — Sin tiempos por palabra importados

Origen: [ADR 0021](../adr/0021-sincronia-simplificada-y-editor-preciso-de-linea.md) §5 y respuesta a [0149](../preguntas/0149-indicador-por-palabra-en-la-vista-letra.md). Desde 0.2.1 una letra de LRCLIB o un LRC mejorado se guarda **solo con los tiempos de línea**; los tiempos por palabra solo nacen en el [editor preciso](06-editor.md#fase-9-de-021--editor-preciso-de-línea).

**Sustituye**: la insignia ◆ del wireframe y de la fila «Insignia de sincronía», la frase «Una letra por palabra se conserva y se resalta por palabra en el reproductor…», la clave `let.sync.palabra` y la fila «Todas con inicio y al menos una con palabras» de §1.
- **Insignia de los candidatos**: un resultado con sincronía por palabra se muestra como ◇ «Sincronizada por línea» (`let.sync.linea`, `info`). Solo quedan dos insignias visibles: ◇ «Sincronizada por línea» y ▭ «Solo texto». La búsqueda sigue **ordenando** primero esos resultados (traen fines de línea): el criterio 3 no cambia, aunque la insignia sea la misma que la de línea.
- **Resumen de C** (§1): «sincronizada por palabra» (`let.actual.sync.palabra`) solo cuando todas las líneas tienen inicio y al menos una tiene tiempos por palabra **hechos a mano** (`origen_palabras: "manual"`). Una letra con palabras importadas (canciones de 0.2.0) se describe como «sincronizada por línea».
- **Claves**: `let.sync.palabra` deja de usarse; `let.actual.sync.palabra` se conserva con la condición nueva.
- **Criterio 2**: la insignia es «línea» o «texto». Criterio nuevo L21-1: un resultado con `hasWordSync` muestra ◇ «Sincronizada por línea», queda primero en el orden si su duración es igual de cercana, y al elegirlo `cancion.json` no tiene `palabras`; el resumen de C de una canción de 0.2.0 con palabras importadas dice «sincronizada por línea».

## 0.2.2 · Feature 4 — Comprobar la letra contra el audio y corregir el desfase

Origen: [plan 0.2.2, feature 4](../versiones/0.2.2/plan-4.md) y [propuesta 022](../propuestas/022-comprobar-la-letra-contra-el-audio.md). Editor: [06 · 0.2.2 · Feature 4](06-editor.md#022--feature-4--comprobar-la-letra-con-la-voz-y-corregir-el-desfase). Contratos técnicos pendientes del arquitecto: [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md). Decisiones marcadas **(decisión provisional)**: [0154](../preguntas/0154-decisiones-provisionales-de-ux-de-las-features-4-a-7.md). Esta sección **amplía** la vista; lo no mencionado sigue igual.

**Se puede hacer sola**: no depende de las features 5, 6 ni 7. La feature 5 la usa para elegir letra sin preguntar.

**Sustituye**: el criterio 3 (orden de los resultados), la fila «Comparación de duración» (ahora cede su sitio a la comprobación cuando esta es concluyente) y el wireframe C (una línea nueva bajo el resumen).

### Concepto

La app compara los **tiempos de la letra** con los **momentos en que suena la voz separada** (los picos de voz que ya usa la línea de tiempo, [ADR 0015](../adr/0015-linea-de-tiempo-y-picos-de-voz.md)). No usa modelos nuevos ni red: funciona sin conexión. Vale para cualquier letra **con tiempos** (LRCLIB, LRC pegado o importado); una letra «Solo texto» no se puede comprobar.

La comprobación da un **veredicto** por letra:

| Veredicto | Qué significa para el usuario | Icono y color | Texto en el candidato |
|---|---|---|---|
| `coincide` | Las líneas empiezan donde empieza la voz. | `check` · `exito` | `let.comp.coincide` |
| `desfasada` | Toda la letra va adelantada o atrasada la misma cantidad `d` (entre 0,5 s y 5 s); movida esa cantidad, coincide. | `move-horizontal` · `info` | `let.comp.adelantada` / `let.comp.atrasada` |
| `dudosa` | Ni encaja con claridad ni falla con claridad (mucha voz sin letra por coros, pocas líneas, voz muy tenue). | `circle-help` · `texto-2` | `let.comp.dudosa` |
| `no_coincide` | Muchas líneas caen en silencio o hay tramos largos de voz sin letra, también después de probar a moverla. Un desfase que no es constante entra aquí: no se arregla moviendo. | `triangle-alert` · `aviso` | `let.comp.noCoincide` |
| `pendiente` | Aún no hay voz separada o su forma de onda se está preparando. | `clock` · `texto-3` | `let.comp.pendiente` |
| `no_disponible` | No se pudo leer la voz (pistas que faltan, error de la forma de onda). | — · `texto-3` | `let.comp.noDisponible` |
| (sin tiempos) | Letra «Solo texto». | — | No se muestra línea de comprobación. |

- **«Adelantada»** = la letra sale antes que la voz; se corrige moviéndola **más tarde**. «Atrasada», al revés.
- El desfase se muestra con un decimal («0,8 s») y se aplica con precisión de milisegundo. Por debajo de 0,5 s no se propone nada: es `coincide` (valor del [ADR 0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) §1, medido con la biblioteca del usuario: por debajo, la medida no distingue una letra correcta; pregunta [0159](../preguntas/0159-decisiones-provisionales-del-arquitecto-de-0-2-2.md) n.º 7).
- Los umbrales entre veredictos los fija el arquitecto y los calibra QA con las 12 canciones Lista del usuario (ADR de la feature 4). La spec fija el comportamiento: ante la duda, `dudosa`, nunca una corrección.
- La corrección nunca deja una línea fuera del audio: si el desplazamiento que mejor encaja sacaría un inicio por debajo de 0 o más allá de la duración, el veredicto es `no_coincide`.

### Wireframes

**A — Resultados con comprobación** (voz ya separada)
```
│  ┌ Resultados (4) ───────────────────┐ ┌ Vista previa ─────────────────┐ │
│  │ ◉ Bohemian Rhapsody — Queen       │ │ ⟷ Va 0,8 s adelantada         │ │
│  │   A Night at the Opera · 5:55     │ │ Toda la letra sale 0,8 s antes │ │
│  │   (◇ Sincronizada por línea)      │ │ que la voz. Al usarla la       │ │
│  │   ⟷ Va 0,8 s adelantada: la       │ │ moveremos 0,8 s más tarde.     │ │
│  │     corregiremos                  │ │ Los tiempos de abajo ya están  │ │
│  │ ○ Bohemian Rhapsody — Queen       │ │ corregidos.                    │ │
│  │   Greatest Hits · 5:54            │ │ ────────────────────────────── │ │
│  │   (◇ Sincronizada por línea)      │ │ [00:01.3] Is this the real life│ │
│  │   ✓ Coincide con tu audio         │ │ [00:05.0] Is this just fantasy │ │
│  │ ○ Bohemian Rhapsody — Queen       │ │ …                              │ │
│  │   (▭ Solo texto)                  │ │ 52 líneas                      │ │
│  │   ✓ Duración igual que tu audio   │ │                                │ │
│  │ ○ Bohemian Rhapsody — Queen       │ │                                │ │
│  │   Live Aid · 6:02                 │ │                                │ │
│  │   (◇ Sincronizada por línea)      │ │                                │ │
│  │   ⚠ No coincide con tu audio:     │ │                                │ │
│  │     puede ser otra versión        │ │                                │ │
│  └───────────────────────────────────┘ └────────────────────────────────┘ │
```

**A — Vista previa de un candidato que no encaja**
```
│ ┌ Vista previa ─────────────────────────────┐
│ │ ⚠ No coincide con tu audio                 │  título del bloque (aviso)
│ │ · 9 de 52 líneas caen donde no hay voz     │  `let.comp.detalle.silencio`
│ │   (de 2:10 a 2:41).                        │
│ │ · Hay voz sin letra de 1:12 a 1:40.        │  `let.comp.detalle.vozSinLetra`
│ │ Puede ser otra versión de la canción.      │  `let.comp.noCoincide.ayuda`
│ │ Prueba con otra letra o revísala en el     │
│ │ editor.                                    │
│ │ ────────────────────────────────────────── │
│ │ [00:00.5] Is this the real life            │
```

**A — Voz sin separar todavía**
```
│  │ ◉ Bohemian Rhapsody — Queen       │
│  │   A Night at the Opera · 5:55     │
│  │   (◇ Sincronizada por línea)      │
│  │   ✓ Duración igual que tu audio   │
│  │   🕒 Se comprobará con tu audio    │
│  │     al terminar la separación     │
```

**A — La separación termina con la vista abierta** (encima de la lista)
```
│  ⓘ Ya hemos comprobado las letras con tu audio. La que mejor coincide   │
│    es la 2.ª.                            [ Seleccionarla ]       [ × ]  │
```

**C — Letra ya elegida** (línea nueva bajo el resumen; una de estas)
```
│  Letra actual · de LRCLIB · sincronizada por línea · 52 líneas           │
│  ✓ Coincide con la voz de tu audio.                                      │
│  ⓘ Movimos toda la letra 0,8 s más tarde para que coincida con la voz.  │
│                                              [ Quitar la corrección ]    │
│  ⟷ Toda la letra va 0,8 s adelantada respecto a la voz.                  │
│                                              [ Corregir el desfase ]     │
│  ⚠ La letra no coincide con la voz de tu audio: puede ser otra versión.  │
│                               [ Ver por qué ]  [ Buscar otra letra ]     │
│  🕒 La comprobaremos con tu audio al terminar la separación.              │
```

### Componentes e interacciones

| Elemento | Comportamiento |
|---|---|
| **Cuándo se comprueba** | En A, al llegar los resultados, cada candidato **con tiempos** se comprueba en segundo plano si la voz está separada y su forma de onda lista. Mientras se calcula (normalmente menos de 1 s para toda la lista), la línea dice `let.comp.comprobando`. No bloquea: la lista se puede usar desde el primer momento. En C, al entrar y tras cada autoguardado que cambie tiempos o texto. |
| **Línea de comprobación del candidato** | Cuarta línea de cada candidato, con icono + texto (nunca solo color). Con veredicto **concluyente** (`coincide`, `desfasada`, `no_coincide`) **sustituye** a la línea de duración, porque dice lo mismo con mejor criterio. Con `dudosa`, `pendiente` y `no_disponible` se muestran las dos (duración y comprobación). Un candidato «Solo texto» conserva solo la de duración. |
| **Orden** (sustituye al criterio 3) | 1.º `coincide` y `desfasada` (iguales entre sí) · 2.º con tiempos y `dudosa`, `pendiente`, `no_disponible` o sin comprobar · 3.º «Solo texto» · 4.º `no_coincide`. Dentro de cada grupo, el orden de siempre (los que traen fines de línea primero y cercanía de duración; el resultado exacto de LRCLIB antes en caso de empate). El primero viene seleccionado. |
| **La comprobación llega después** (la separación termina con A abierta) | Los textos de los candidatos se actualizan en vivo, pero **la lista no se reordena ni cambia la selección** (nada se mueve bajo el cursor). Si el mejor candidato ya no es el seleccionado, aparece encima de la lista el aviso `let.comp.llegada` con [Seleccionarla] (selecciona ese candidato, lo desplaza a la vista y deja el foco en la lista) y [×]. Se anuncia una vez (`role="status"`). El orden nuevo se aplica la próxima vez que se cargue la lista. |
| **Bloque de la vista previa** | Encima de las líneas, con el veredicto del candidato seleccionado. `coincide`: una línea. `desfasada`: `let.comp.desfase.ayuda`; **los tiempos de la vista previa se muestran ya corregidos**. `no_coincide`: hasta tres motivos (`let.comp.detalle.*`, con los tramos en m:ss) y `let.comp.noCoincide.ayuda`. `dudosa`: `let.comp.dudosa.ayuda`. Es texto: no hay gráfico ni reproductor en esta vista. |
| **Usar esta letra** | Sin cambios de flujo. Con `desfasada`, la letra se guarda **ya corregida** (se anunció en el candidato) y C muestra `let.comp.actual.corregida` con [Quitar la corrección] **(decisión provisional: se corrige sin preguntar; el aviso y el botón permiten volver atrás)**. Con `no_coincide` o `dudosa` se guarda igual, sin diálogo extra: el aviso ya está a la vista y C lo repite. Con `pendiente`, se guarda tal cual y se comprueba al terminar la separación (fila siguiente). |
| **Comprobación diferida** (la letra se eligió antes de separar) | Al terminar la separación, main comprueba la letra guardada. Si es `desfasada` y la letra está **intacta** (nadie ha cambiado ningún tiempo desde que se guardó), se corrige sola y queda `let.comp.actual.corregida`. Si el usuario ya ajustó algún tiempo, **no se toca**: C y el editor muestran la propuesta con [Corregir el desfase]. Con la app abierta, toast `let.comp.toast.corregida` con [Deshacer]; dentro de una cola de varias canciones no hay toast por canción (spec 04, feature 7). |
| **Corregir el desfase** (C) | Mueve **toda la letra a la vez** la cantidad propuesta `d`, en una sola escritura. El dato que cambia es el desplazamiento de la letra ([ADR 0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) §1): `letra.offset_ms ← offset_ms + d` (redondeado a 10 ms, dentro de ±30 s) y se anota `letra.desfase_corregido_ms = d`. **Ningún `inicio_ms`, `fin_ms` ni tiempo por palabra cambia en el archivo**; como todas las superficies (vista previa, editor, reproductor, exportación) aplican `offset_ms`, el usuario ve y oye la letra movida `d`, también los fines fijados, las pausas con tiempo y las palabras. No cambia textos, ni el orden, ni la duración de cada línea. La línea de C pasa a `let.comp.actual.corregida`. Foco en [Quitar la corrección]. |
| **Quitar la corrección** | `letra.offset_ms ← offset_ms − desfase_corregido_ms` y se borra `desfase_corregido_ms` ([ADR 0024](../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) §1): la letra vuelve a sonar donde sonaba, también las líneas ajustadas después (sus tiempos guardados no se tocan). La línea pasa a `let.comp.actual.adelantada` / `atrasada` con [Corregir el desfase]. Sin diálogo: es reversible con el otro botón. Disponible mientras exista `letra.desfase_corregido_ms`; desaparece al sustituir la letra. |
| **Ver por qué** (C, `no_coincide`) | Despliega bajo la línea (`aria-expanded`) los mismos motivos del bloque de vista previa. |
| **Pegar e importar** | Un LRC pegado o importado se comprueba igual al llegar a C. No hay comprobación en B (el texto aún no es una letra). |
| **Letra sin tiempos o con menos de 5 líneas con inicio** (`no_comprobable`, ADR 0024 §1) | No se comprueba ni se muestra línea de comprobación. |
| **Canción Lista o Letra lista** | C muestra el veredicto, pero **no** se corrige sola nunca; [Corregir el desfase] sigue disponible. |

### Estados

| Estado | Presentación |
|---|---|
| Vacío (sin resultados o sin letra) | Sin cambios: no hay nada que comprobar. |
| Cargando | Candidatos con `let.comp.comprobando` (texto `texto-3`, sin spinner por fila; un único indicador giratorio junto al título «Resultados»). C: `let.comp.comprobando`. |
| Voz sin separar | `let.comp.pendiente` en cada candidato con tiempos y en C. |
| Error (voz ilegible o forma de onda con error) | `let.comp.noDisponible`, sin acción: la vista funciona como en 0.2.1 (duración y vista previa). No es un banner ni bloquea «Usar esta letra». |
| Sin red | No afecta a la comprobación (es local). Si la búsqueda falla por red, los estados son los de siempre y la comprobación de la letra ya guardada sigue funcionando en C. |
| Éxito | Veredicto en cada candidato; C con su línea. |
| Borrador / Lista | La corrección automática solo ocurre en borradores (ver tabla). |

### Teclado y accesibilidad

- La línea de comprobación forma parte del nombre accesible de la opción del `listbox`: «{título}, {artista}, {álbum}, {duración}, {sincronía}, {comprobación}».
- El bloque de la vista previa es una región con nombre `let.comp.titulo`; cambia con la selección sin anunciarse (lo anuncia la opción).
- `let.comp.llegada` usa `role="status"`; sus botones son paradas de tabulación antes de la lista. No roba el foco.
- [Corregir el desfase], [Quitar la corrección], [Ver por qué] y [Buscar otra letra] son botones secundarios o fantasma en el orden de lectura, tras el resumen de C. El resultado de corregir y de quitar se anuncia con `let.comp.anuncio.*`.
- Ningún veredicto se distingue solo por color: cada uno tiene icono y texto.
- Sin atajos nuevos.

### Microcopy (0.2.2 · feature 4, Letra)

| Clave | Texto |
|---|---|
| `let.comp.titulo` | Comprobación con tu audio |
| `let.comp.comprobando` | Comprobando con tu audio… |
| `let.comp.coincide` | Coincide con tu audio |
| `let.comp.adelantada` | Va {d} s adelantada: la corregiremos |
| `let.comp.atrasada` | Va {d} s atrasada: la corregiremos |
| `let.comp.dudosa` | No está claro si coincide con tu audio |
| `let.comp.noCoincide` | No coincide con tu audio: puede ser otra versión |
| `let.comp.pendiente` | Se comprobará con tu audio al terminar la separación |
| `let.comp.noDisponible` | No se pudo comprobar con tu audio |
| `let.comp.desfase.ayuda` | Toda la letra sale {d} s antes que la voz. Al usarla la moveremos {d} s más tarde. Los tiempos de abajo ya están corregidos. · (atrasada) Toda la letra sale {d} s después que la voz. Al usarla la moveremos {d} s antes. Los tiempos de abajo ya están corregidos. |
| `let.comp.dudosa.ayuda` | Parte de la letra coincide con la voz y parte no. Puede deberse a coros o a partes sin letra. Escúchala en el editor antes de darla por buena. |
| `let.comp.noCoincide.ayuda` | Puede ser otra versión de la canción. Prueba con otra letra o revísala en el editor. |
| `let.comp.detalle.silencio` | {n} de {total} líneas caen donde no hay voz (de {a} a {b}). · (varios tramos) {n} de {total} líneas caen donde no hay voz. · (n = 1) 1 de {total} líneas cae donde no hay voz ({a}). |
| `let.comp.detalle.vozSinLetra` | Hay voz sin letra de {a} a {b}. · (varios) Hay voz sin letra en {k} tramos; el más largo, de {a} a {b}. |
| `let.comp.detalle.variable` | El desfase cambia a lo largo de la canción: no se arregla moviendo toda la letra. |
| `let.comp.llegada` | Ya hemos comprobado las letras con tu audio. La que mejor coincide es la {n}.ª. — [Seleccionarla] |
| `let.comp.actual.coincide` | Coincide con la voz de tu audio. |
| `let.comp.actual.corregida` | Movimos toda la letra {d} s más tarde para que coincida con la voz. — [Quitar la corrección] · (atrasada) Movimos toda la letra {d} s antes para que coincida con la voz. — [Quitar la corrección] |
| `let.comp.actual.adelantada` | Toda la letra va {d} s adelantada respecto a la voz. — [Corregir el desfase] |
| `let.comp.actual.atrasada` | Toda la letra va {d} s atrasada respecto a la voz. — [Corregir el desfase] |
| `let.comp.actual.dudosa` | No está claro si la letra coincide con la voz. Escúchala en el editor. |
| `let.comp.actual.noCoincide` | La letra no coincide con la voz de tu audio: puede ser otra versión. — [Ver por qué] [Buscar otra letra] |
| `let.comp.actual.pendiente` | La comprobaremos con tu audio al terminar la separación. |
| `let.comp.boton.corregir` | Corregir el desfase |
| `let.comp.boton.quitar` | Quitar la corrección |
| `let.comp.boton.porque` | Ver por qué |
| `let.comp.toast.corregida` | Movimos la letra de «{título}» {d} s más tarde para que coincida con la voz. — [Deshacer] · (atrasada) … {d} s antes … |
| `let.comp.anuncio.corregida` | Letra movida {d} s más tarde. · Letra movida {d} s antes. |
| `let.comp.anuncio.quitada` | Corrección quitada: la letra vuelve a sus tiempos anteriores. |
| `let.comp.error.guardar` | No se pudo mover la letra. Vuelve a intentarlo. — [Copiar detalles] |

`{d}` siempre con coma decimal y un decimal («0,8»); `{a}` y `{b}` en m:ss.

### Criterios de aceptación (0.2.2 · feature 4, Letra)

- F4-L1. Con la voz separada, cada candidato con tiempos muestra su línea de comprobación con icono y texto según la tabla de veredictos; un candidato «Solo texto» no la muestra. Con veredicto concluyente no se muestra la línea de duración; con `dudosa`, `pendiente` o `no_disponible`, sí.
- F4-L2. Con fixtures de picos y letra (test de la función pura): una letra con los inicios sobre los arranques de voz da `coincide`; la misma movida −800 ms da `desfasada` con `d = 800 ms` ± 50 ms («adelantada»); movida +1500 ms, «atrasada»; la letra de otra canción da `no_coincide`; una letra con un desfase que crece de 0 a 3 s da `no_coincide` con `let.comp.detalle.variable`; una letra con 2 líneas da «sin comprobar».
- F4-L3. La lista sale ordenada por los cuatro grupos de «Orden» y, dentro de cada uno, como en el criterio 3 original; el primero queda seleccionado con su vista previa.
- F4-L4. Al seleccionar un candidato `desfasada`, la vista previa muestra `let.comp.desfase.ayuda` y los tiempos ya corregidos; al seleccionar uno `no_coincide`, los motivos con sus tramos en m:ss.
- F4-L5. «Usar esta letra» sobre un candidato `desfasada` guarda en `cancion.json` los `inicio_ms`, `fin_ms` y palabras **idénticos** a los del candidato (comparación exacta en ms), `letra.offset_ms = d` redondeado a 10 ms y `letra.desfase_corregido_ms = d`; C muestra `let.comp.actual.corregida`. [Quitar la corrección] deja `offset_ms` en el valor previo (0) y sin `desfase_corregido_ms`, sin tocar ningún tiempo de línea, y muestra la propuesta con [Corregir el desfase], que vuelve a corregir.
- F4-L6. Con la separación en curso, los candidatos con tiempos muestran `let.comp.pendiente` junto a la duración. Al terminar la separación con A abierta, los textos se actualizan sin reordenar ni cambiar la selección y, si el mejor no es el seleccionado, aparece `let.comp.llegada`; [Seleccionarla] lo selecciona.
- F4-L7. Una letra elegida antes de separar y no modificada se corrige sola al terminar la separación si es `desfasada` (C muestra `let.comp.actual.corregida`; toast con [Deshacer] si la app está abierta y no hay cola de varias canciones). Si antes se cambió algún tiempo, no se corrige y C muestra la propuesta. En una canción Lista o Letra lista nunca se corrige sola.
- F4-L8. Con la forma de onda en error o las pistas ausentes, los candidatos muestran `let.comp.noDisponible` y «Usar esta letra» funciona como en 0.2.1. Sin conexión, la comprobación de una letra ya guardada sigue funcionando en C.
- F4-L9. Pegar o importar un LRC muestra en C su veredicto; una letra sin tiempos no muestra línea de comprobación.
- F4-L10. El nombre accesible de cada opción incluye su comprobación; `let.comp.llegada` se anuncia una vez sin mover el foco; corregir y quitar se anuncian con `let.comp.anuncio.*`. Todo es operable con teclado.
- F4-L11. Un fallo de escritura al corregir o quitar deja los tiempos como estaban y muestra `let.comp.error.guardar`.
- F4-L12. Capturas en `docs/ux/revisiones/0.2.2-feature-4/`, nombre `letra-1280x800-100-{estado}.png`: `candidatos-comprobados`, `candidato-desfasado`, `candidato-no-coincide`, `comprobacion-pendiente`, `aviso-llegada`, `actual-corregida`, `actual-propuesta`, `actual-no-coincide`.

**Verificación manual** (guía de `docs/Test-manuales/0.2.2/`): con tres canciones reales ya Listas, abrir Letra › «Buscar otra letra» y comprobar que la letra correcta sale como «Coincide»; con un LRC de esas mismas canciones movido a mano 1 s (editando las marcas), importarlo y comprobar que sale «atrasada 1,0 s» y que al corregir coincide al cantarla; con la letra de una versión en directo, comprobar que sale «No coincide» o «No está claro», nunca una corrección; anotar cualquier canción con coros largos que salga como «No está claro» para calibrar.

## 0.2.2 · Feature 5 — Preparación desatendida: la vista Letra

Origen: [plan 0.2.2, feature 5](../versiones/0.2.2/plan-4.md) y [propuesta 020](../propuestas/020-preparacion-desatendida.md). Cadena completa, estados y reglas de elección: [04 · 0.2.2 · Feature 5](04-progreso-pipeline.md#022--feature-5--preparación-desatendida). Tarjeta y bandeja: [02 · 0.2.2 · Feature 5](02-biblioteca.md#022--feature-5--lista-para-revisar-y-bandeja-de-pendientes). Interruptor: [08 · 0.2.2 · Feature 5](08-ajustes-y-acerca.md#022--feature-5--letras-y-preparación-automática). Esta sección define **qué ve el usuario al entrar en Letra** en una canción que la app ya preparó (o intentó preparar).

**Depende de** la feature 4 para elegir con seguridad. **Sustituye**: el criterio 1 (la búsqueda al entrar) y la regla de 10 minutos de §7 para las canciones con una búsqueda automática hecha.

### Qué se encuentra al entrar

| Resultado de la preparación | Vista | Qué muestra |
|---|---|---|
| **Letra elegida sola** | C | Aviso `let.prep.elegida` sobre el resumen, con [Ver otras candidatas] (pasa a A con la lista ya cargada, la letra actual marcada con `let.prep.actual` y seleccionada) y [×]. El aviso sigue hasta que el usuario lo cierra, cambia el texto, sustituye la letra o marca la canción como lista. |
| **«Elige la letra»** (hay candidatas, ninguna segura) | A | La lista ya cargada, comprobada y ordenada, **sin consultar la red**, con el aviso `let.prep.elige` y su motivo (`let.prep.motivo.*`). Foco en la lista. Al pulsar «Usar esta letra», la preparación **continúa sola** (corrige el desfase si hace falta y ajusta los fines, spec 04) y la canción queda «Lista para revisar». |
| **No encontrada** | A | El banner `let.error.LETRA_NO_ENCONTRADA` de siempre, sin repetir la búsqueda; foco en Título. Editar título o artista y «Buscar» consulta de nuevo. |
| **Instrumental** | A | `let.error.INSTRUMENTAL` (o la lista con `let.aviso.instrumentalConCandidatos`). |
| **Sin conexión o servicio caído durante la preparación** | A | Al entrar se **reintenta** la búsqueda (entrar en la vista es una acción del usuario). Si vuelve a fallar, el banner de siempre con [Reintentar]. |
| **Búsqueda en curso** (se entra mientras la preparación busca) | A, cargando | Se espera a esa misma búsqueda; no se lanza otra. |
| **Búsqueda automática desactivada** (Ajustes) y sin letra | A | Como en 0.2.1: la búsqueda se lanza al entrar. |

- **La lista de la preparación no caduca a los 10 minutos**: main la conserva durante la sesión de la app. Tras reiniciar, o si ya no está en memoria, entrar en A consulta de nuevo (0153 §5). «Buscar» y «Buscar otra letra» consultan siempre.
- **La preparación nunca sustituye una letra que ya existe** (elegida, pegada o importada por el usuario, o elegida sola antes): solo la comprueba (feature 4).
- **Pegar o importar** en una canción «Elige la letra» o «No encontramos la letra» funciona como siempre y saca la canción de ese estado.

### Wireframes

**C con letra elegida sola**
```
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ⓘ Elegimos esta letra por ti: es la coincidencia exacta de       │   │
│  │   LRCLIB y coincide con tu audio.                                │   │
│  │                              [ Ver otras candidatas ]     [ × ]  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  Letra actual · de LRCLIB · sincronizada por línea · 52 líneas           │
│  ✓ Coincide con la voz de tu audio.                                      │
```

**A en «Elige la letra»**
```
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ⓘ Elige la letra. No la elegimos por ti porque hay varias        │   │
│  │   versiones que coinciden con tu audio.                          │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│  Título [ … ] Artista [ … ] [ Buscar ]                                   │
│  ┌ Resultados (3) ───────────────────┐ ┌ Vista previa ─────────────────┐ │
```

### Microcopy (0.2.2 · feature 5, Letra)

| Clave | Texto |
|---|---|
| `let.prep.elegida` | Elegimos esta letra por ti: es la coincidencia exacta de LRCLIB y coincide con tu audio. — [Ver otras candidatas] |
| `let.prep.elegida.corregida` | Elegimos esta letra por ti: es la coincidencia exacta de LRCLIB. Iba {d} s adelantada y la hemos corregido. — [Ver otras candidatas] · (atrasada) … Iba {d} s atrasada … |
| `let.prep.boton.otras` | Ver otras candidatas |
| `let.prep.actual` | Letra actual |
| `let.prep.elige` | **Elige la letra.** No la elegimos por ti porque {motivo}. |
| `let.prep.motivo.varias` | hay varias versiones que coinciden con tu audio |
| `let.prep.motivo.sinArtista` | falta el artista de la canción: escríbelo arriba y vuelve a buscar, o elige tú (tiene prioridad sobre los demás motivos cuando el artista está vacío; respuesta a 0244 n.º 3) |
| `let.prep.motivo.sinExacta` | aunque alguna encaja con tu audio, ninguna coincide a la vez en título, artista y duración con tu canción · (ninguna encaja con el audio) ninguna coincide a la vez en título, artista y duración con tu canción |
| `let.prep.motivo.duda` | no está claro que coincida con tu audio |
| `let.prep.motivo.noCoincide` | ninguna coincide con tu audio |
| `let.prep.motivo.soloTexto` | solo hay letras sin sincronizar |
| `let.prep.motivo.sinComprobar` | no pudimos comprobarla con tu audio |
| `let.prep.continuando` | Terminando de preparar la canción… |

### Criterios de aceptación (0.2.2 · feature 5, Letra)

- F5-L1. En una canción con letra elegida sola, Letra abre en C con `let.prep.elegida` (o `.corregida`) y sin consultar la red; [Ver otras candidatas] muestra A con la lista de la preparación y la letra actual marcada y seleccionada; [×] cierra el aviso y no vuelve a salir.
- F5-L2. En una canción «Elige la letra», Letra abre en A con la lista ya comprobada y ordenada y con `let.prep.elige` y su motivo, sin consultar la red (doble de LRCLIB: 0 peticiones al entrar). «Usar esta letra» guarda, completa la preparación sin más pasos del usuario y la tarjeta pasa a «Lista para revisar».
- F5-L3. En una canción «No encontramos la letra», Letra abre con el banner sin repetir la búsqueda; tras editar el título y pulsar «Buscar» se consulta.
- F5-L4. Si la preparación terminó en `SIN_CONEXION` o `SERVICIO_NO_DISPONIBLE`, entrar en Letra reintenta la búsqueda una vez.
- F5-L5. Entrar en Letra mientras la preparación busca muestra «Buscando la letra…» y no lanza una segunda petición (doble de LRCLIB: una sola búsqueda).
- F5-L6. Una canción con letra (del usuario o elegida sola) no recibe otra letra por «Preparar» ni por la preparación automática: solo cambia su línea de comprobación.
- F5-L7. Con «Buscar la letra automáticamente» desactivado, la vista se comporta como en 0.2.1 (criterio 1 original).
- F5-L8. Capturas en `docs/ux/revisiones/0.2.2-feature-5/`: `letra-1280x800-100-elegida-sola`, `letra-1280x800-100-elige-la-letra`.

## 0.2.3 · Feature 1 — Cantantes al corregir o cambiar la letra

Origen: [plan 5, feature 1](../versiones/0.2.3/plan-5.md). Conceptos: [06 · 0.2.3 · Feature 1](06-editor.md#023--feature-1--cantantes-por-línea). La vista Letra **no asigna** cantantes (eso es del editor); solo cuida de no perder el reparto.

| Caso | Comportamiento |
|---|---|
| **Corregir la letra** (B, texto editado sobre una letra con reparto) | Una línea que no cambia **conserva su parte** (como conserva sus tiempos y sus palabras). Una línea **nueva o cambiada hereda la parte de la línea anterior**; si es la primera, la de la siguiente (decisión 17 de 0160). Las pausas no tienen parte. |
| **Sustituir la letra** («Usar esta letra», «Importar», pegar otra) con reparto | Las líneas son otras: **las asignaciones se pierden**, pero se conservan los cantantes, sus nombres y la voz de los coros **(provisional, 0170 n.º 6; contrato en 0171)**. El diálogo de sustituir añade una frase: `let.dialogo.sustituir.reparto`. |
| **Resumen de C** | Con reparto, una línea más: `let.actual.reparto`. |
| **Una letra con coros entre paréntesis** | La vista no los marca: la sugerencia «Marcarlas como coro» está en el editor. |

| Clave | Texto |
|---|---|
| `let.dialogo.sustituir.reparto` | También se perderá quién canta cada línea (se conservan los nombres de los cantantes). |
| `let.actual.reparto` | {n} cantantes · {k} líneas de coro · (sin coro) {n} cantantes · (un cantante) {k} líneas de coro |

- C1-L1. Corregir una palabra de una línea de Luis la deja de Luis; una línea insertada tras una de Ana es de Ana; las líneas sin cambios conservan su parte, sus tiempos y sus palabras (test de `aplicarTextoEditado` con reparto).
- C1-L2. Sustituir una letra con reparto muestra `let.dialogo.sustituir.reparto`; tras sustituir, todas las líneas son del Cantante 1 y los nombres y el nivel de coros siguen.
- C1-L3. En una canción sin reparto, el diálogo y el resumen no cambian.
