# 07 — Reproductor a pantalla completa

- Paso del pipeline: 6 (Reproductor)
- ADRs: [0005](../adr/0005-letras-y-formato-de-sincronia.md) (`finEfectivo`, desplazamiento), [0006](../adr/0006-persistencia-y-modelo-de-datos.md) (`cancion.json`, `incompleta`, `config.reproductor`), [0010](../adr/0010-editor-motor-de-audio-reloj-y-guardado.md) (reloj, `PantallaLetra`, render compartido), [0011](../adr/0011-reproductor-pantalla-completa-y-reutilizacion-del-motor.md) (`MotorReproductor`, pantalla completa, reposo)
- Restricciones: [arquitectura.md §7 y "Restricciones e implicaciones para UX" §2, §5](../arquitectura.md)
- Valores fijos de render: [sistema-visual.md §10](sistema-visual.md)
- Preguntas: [0005](../preguntas/0005-viabilidad-detalles-ux-fase-0.md) §6, §8, §11, §12 y [0006](../preguntas/0006-ajustes-specs-ux-tras-0005.md) §4 (respondidas); [0025](../preguntas/0025-detalles-tecnicos-del-editor-fase-5.md) §1 y §8 (respondida: el reproductor llega en la Fase 6, un solo volumen); [0030](../preguntas/0030-voz-original-en-el-reproductor.md) (usuario, respondida 2026-11-06: **voz guía** = `voz.flac` mezclada sobre el instrumental con volumen propio, tecla para silenciarla y nivel recordado; no se usa la mezcla original); [0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md) (arquitecto: pantalla completa, motor con dos pistas a la vez, silencio previo, pistas que faltan, pantalla encendida, configuración de la voz guía; abierta, opción provisional tomada)
- Revisión: 2026-11-06, puesta al día para la Fase 6 (ver "Cambios de esta revisión" al final).
- 0.2.0, fase 4 (2026-11-11): reproductor en otra pantalla (ventana secundaria), transición con cuenta entre canciones de la cola, en espera, fin de la cola, fallo de una entrada, reanudación y recuperación. Ver [Fase 4 de 0.2.0 — ventana secundaria y cola](#fase-4-de-020--ventana-secundaria-y-cola). Preguntas: [0048](../preguntas/0048-escucha-editor-durante-evento.md) y [0049](../preguntas/0049-politica-cola-de-reproduccion.md) (respondidas), [0058](../preguntas/0058-interfaz-de-la-sesion-en-vivo-y-la-cola.md) (arquitecto → UX, respondida), [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) (usuario, respondida: 1B, 2A, 3B, 4A), [0060](../preguntas/0060-letra-y-controles-de-sonido-durante-la-sesion.md) (usuario, respondida: 1A, 2A) y [0061](../preguntas/0061-reproductor-en-otra-pantalla-con-wayland.md) (arquitecto → UX, respondida).
- 0.2.0, fase 5 (2026-11-20): degradados radial y cónico con movimiento ligado a la canción, indicadores de espera (puntos, barra y cuenta 3·2·1) y modo Letra lista sin barrido. Ver [Fase 5 de 0.2.0 — estilo, espera y Letra lista](#fase-5-de-020--estilo-espera-y-letra-lista).
- 0.2.1, fases 8 y 9 (2026-11-21): barrido progresivo en lugar de las palabras importadas, barrido palabra a palabra con las hechas a mano, sin `,` / `.` en la prueba desde el editor y barra de espera como barra de carga. Ver [Fase 8 de 0.2.1](#fase-8-de-021--sin-palabras-importadas-ni-desplazamiento-y-barra-de-carga).
- 0.2.2, features 1 y 2 (2026-11-21): de 2 a 7 líneas a la vez con línea ya cantada y cambio de línea animado ([Feature 1](#022--feature-1--letra-en-pantalla-con-varios-enunciados)), y subrayado de lo ya cantado para que el resaltado no dependa solo del color ([Feature 2](#022--feature-2--resaltado-que-no-depende-solo-del-color)). Decisiones provisionales: [0155](../preguntas/0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md). Contratos: [0156](../preguntas/0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md).
- 0.2.2, feature 5 (2026-11-22): entrada «Probar» desde la tarjeta «Lista para revisar» en la tabla [Entrada](#entrada) (nota pedida en [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) §6).

## Objetivo
Cantar: instrumental + letra sincronizada con el estilo de la canción, **a pantalla completa, sin distracciones y legible a unos 5 m** (salón, televisor de 55", proyector). Empieza al instante y se sale con una tecla.

Usuario/tarea principal: "Ponme esta canción para cantarla ya". Secundaria (desde el editor): "Quiero ver cómo queda de verdad antes de darla por lista".

Qué **no** hace el reproductor (MVP): no hay listas de reproducción ni "siguiente canción", no cambia la velocidad ni el tono (siempre 1×), no edita la letra ni el estilo, no tiene puntuación ni micrófono.

## Datos que usa (resumen para implementar)
- **Canción**: `biblioteca.obtener(id)` (desde la Biblioteca, también con «Probar» de una «Lista para revisar») o la instantánea en memoria del editor (desde "Probar a pantalla completa"; incluye cambios aún no guardados). Usa `metadatos.titulo`, `metadatos.artista`, `metadatos.duracion_ms`, `letra` (`lineas[]`, `offset_ms`), `estilo`, `fuente.ganancia_db` y `pistas.instrumental`. La duración real para la barra y el final es la del `AudioBuffer` decodificado.
- **Audio**: `MotorReproductor` (`karaoke/motorReproductor.ts`, [ADR 0011](../adr/0011-reproductor-pantalla-completa-y-reutilizacion-del-motor.md) §3), siempre a 1×; no es el `MotorAudio` del editor, que al abrir "Probar" libera sus buffers (`liberarAudio()`). Modo `karaoke`: suenan **a la vez y sincronizadas** dos pistas, `instrumental` (siempre) y `voz` (voz guía, §"Voz guía"); si la voz falla, suena solo el instrumental. Modo `original`: solo en la vista previa del editor sin pistas separadas suena `original` (`fuente/mezcla.flac`), sola y sin voz guía. Nunca se usa la original como guía.
- **Ganancias**: general = `10^(ganancia_db/20) × volumen` (0 si `silenciado`), aplicada a todo; instrumental × 1; voz × `voz_guia` (0 si `voz_guia_silenciada`).
- **Volumen general**: `config.reproductor.volumen` (0–1) y `silenciado`, el **único volumen general de la app**, compartido con el editor ([0025](../preguntas/0025-detalles-tecnicos-del-editor-fase-5.md) §8). Se lee al entrar y se escribe con `config.actualizar`, como mucho una vez cada 500 ms mientras cambia.
- **Voz guía**: campos nuevos `config.reproductor.voz_guia` (0–1, por defecto 0,3) y `voz_guia_silenciada` (por defecto `true`: la primera vez se canta sin voz). Mismo ritmo de escritura. Solo los usa el reproductor (el editor tiene su propio selector de pista). Contrato en [0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md) §6.
- **Render**: `PantallaLetra` (ADR 0010 §4) con tamaño de contenedor = pantalla completa. Tiempo de letra = tiempo de canción − `offset_ms`. Líneas sin inicio omitidas, pausas no dibujadas, fin de línea con `finEfectivo`.
- **Lista incompleta**: indicador derivado `incompleta` y `lineasSinSincronizar` del resumen de la canción (spec 02).

## Wireframes

### A — Reproduciendo, controles ocultos (estado normal)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                      (fondo: sólido o degradado del estilo)              │
│                                                                          │
│                 ███████████████░░░░░░░░░░░░░░░                           │
│                 Is this the real life? Is this just                      │ ← línea actual (centro al 45 % del alto)
│                                                                          │    barrido en color de resaltado
│                     Caught in a landslide                                │ ← siguiente (70 % del tamaño)
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```
Sin cursor, sin controles, sin ningún texto de interfaz.

### B — Controles visibles
```
┌──────────────────────────────────────────────────────────────────────────┐
│ [✕ Salir]                                    Bohemian Rhapsody · Queen   │ ← franja superior (0–12 % del alto)
│                                              ⚠ Faltan 3 líneas por sinc… │   (solo si incompleta, t-pequeno)
│                                                                          │
│                    (letra igual que en A)                                │ ← zona 25 %–75 %: nunca hay controles
│                                                                          │
│ 01:12 ━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 05:55   │ ← franja inferior (82–100 % del alto)
│ [⏮]  [ ❚❚ ]  [↺5]  [5↻]       [🎤 Voz ━━●━━━ 30 %]  [🔊 ━━━━●━]  [⌨]  [⛶] │
└──────────────────────────────────────────────────────────────────────────┘
```
Voz guía silenciada (estado por defecto):
```
│                               [🎤̸ Voz ━━○━━━ 30 %]                       │ ← icono mic-off, deslizador y cifra en texto-2 (atenuados), nivel conservado
```
- Franja superior: degradado negro `rgba(0,0,0,0.6)` sólido bajo los controles (alto de la fila + 16 px) que se desvanece a 0 por debajo. Izquierda: [✕ Salir]. Derecha: «título · artista» en `t-cuerpo-fuerte` `#FFFFFF`, una línea con "…"; debajo, solo en una lista incompleta, `rep.incompleta` en `t-pequeno` con el icono ⚠ en `aviso`. El centro queda libre para la etiqueta `rep.original` (§"Estados").
- Franja inferior: degradado negro, `rgba(0,0,0,0.7)` sólido bajo las dos filas de controles, que se desvanece a 0 por encima. Fila 1: tiempo actual, barra de tiempo, duración (`t-tiempo`, `#FFFFFF`). Fila 2 izquierda: ⏮, ▶/❚❚, ↺5, 5↻. Derecha: **control de voz guía** (botón 🎤 + etiqueta "Voz" + deslizador de 96 px + porcentaje `t-tiempo`; §"Voz guía"), volumen general (botón silenciar + deslizador de 120 px), ⌨ Atajos, ⛶. Entre el control de voz y el general, 24 px de separación para que no se confundan.
- En la vista previa del editor sin pistas separadas el control de voz guía no aparece y su hueco se cierra.

### C — Pantalla de título (inicio)
```
│                                                                          │
│                         Bohemian Rhapsody                                │ ← título, tamaño de línea actual
│                              Queen                                       │ ← artista, 50 %
│                                                                          │
│            ┌────────────────────────────────────────────────┐            │
│            │ ⚠ Faltan 3 líneas por sincronizar: no se verán. │            │ ← solo en lista incompleta
│            └────────────────────────────────────────────────┘            │
```
Seguida de la entrada de la primera línea:
```
│                               ●●●                                        │ ← indicador de entrada (color de resaltado)
│                     Is this the real life?                               │ ← primera línea, como "siguiente"
```

### D — Pantalla final
```
│                         Bohemian Rhapsody                                │
│                              Queen                                       │
│                                                                          │
│            [ ↻ Otra vez ]   [ ✕ Volver a la biblioteca ] (foco)          │
│                       Se cerrará en 10 s…                                │
```
Fondo y fuente del estilo; título y artista como en C. Botones grandes (44 px) con el estilo de los controles (fondo `rgba(0,0,0,0.6)`, texto `#FFFFFF`, radio `r-m`). Desde el editor, el segundo botón es "Volver al editor".

### E — Error
```
┌──────────────────────────────────────────────────────────────────────────┐
│                          (fondo fondo-0)                                 │
│                                                                          │
│                ⚠  No se puede reproducir esta canción.                  │ ← t-subtitulo, texto-1
│      Falta su pista instrumental. Puedes volver a separarla desde la     │ ← t-cuerpo, texto-2
│      biblioteca: menú ⋯ › Re-separar pistas.                             │
│                                                                          │
│          [Copiar detalles]   [Volver a la biblioteca] (primario, foco)   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Componentes e interacciones

### Entrada
| Desde | Comportamiento |
|-------|----------------|
| Biblioteca: botón "▶ Reproducir" de la tarjeta, botón redondo de la portada, clic en la portada o Intro con la tarjeta enfocada, "Reproducir" del menú ⋯ (solo canciones Lista, spec 02) | Se abre el reproductor encima de la Biblioteca (que se queda montada, con su filtro, búsqueda y desplazamiento), la ventana pasa a pantalla completa y se muestra al instante el fondo del estilo con la pantalla de título. En cuanto el instrumental y la voz están decodificados (en paralelo, < 1 s en una canción de 4 min) empieza desde 0 con el silencio previo si hace falta (§"Inicio y silencio previo"). |
| Toast `bib.toast.lista` → [▶ Reproducir] | Igual que el botón de la tarjeta. El toast se cierra al pulsarlo. |
| Biblioteca: «▶ Probar» de una tarjeta **«Lista para revisar»** o «Probar» de su menú ⋯ (0.2.2, [spec 02 · Feature 5](02-biblioteca.md#tarjeta-lista-para-revisar)) | Igual que «▶ Reproducir» de una Lista (reproductor **local**, encima de la Biblioteca, pantalla de título, instrumental y voz guía con su ajuste, empieza desde 0 con el silencio previo), con la canción **guardada** (`biblioteca.obtener(id)`, sin instantánea del editor) y **sin cambiar su estado** (sigue siendo borrador). Requisitos: pistas separadas y al menos una línea con inicio; las líneas sin inicio se omiten como siempre (una «Lista para revisar» las tiene todas, así que no se muestra `rep.incompleta`). **No usa la cola ni la sesión en otra pantalla**: no se puede encolar ni reproducir en otra pantalla, y durante una sesión «Probar» está inactivo (spec 02). Al salir (Esc, ✕ o pantalla final) se vuelve a la Biblioteca con el foco en la tarjeta y aparece `bib.prep.toast.probada` (spec 02). Contrato: [0153](../preguntas/0153-contratos-de-las-features-4-a-7-para-las-specs.md) §6. |
| Editor: "Probar a pantalla completa" o **F** (spec 06) | Tras vaciar el guardado pendiente del editor (spec 06 §"Guardado"), se abre encima del editor (que se queda montado, con su historial de deshacer, selección y pista) usando la instantánea en memoria del editor (letra, estilo y desplazamiento actuales). Empieza en `máx(0, tiempo mostrado de la línea seleccionada − 3 s)`; si la línea no tiene inicio, en la posición actual del editor. El audio del editor se pausa antes. |
| En todos los casos | Los controles se muestran 3 s y se ocultan (§"Ocultar controles"). El foco va a la superficie del reproductor (`tabindex="-1"`), para que los atajos funcionen sin hacer clic. |

### Inicio y silencio previo
El cantante siempre tiene una pantalla de título y una cuenta de entrada antes de la primera línea, aunque la voz empiece en el primer segundo de la canción.
- Sea `t1` el tiempo mostrado (`inicio_ms + offset_ms`) de la primera línea con inicio. Si `t1 < 6 s`, antes del audio hay un **silencio previo** de `6 s − t1` en el que el tiempo avanza desde `−(6 s − t1)` hasta 0. Así la secuencia es siempre, como mínimo: título 2 s → primera línea visible como "siguiente" 1 s → `●●●` 3 s (un punto menos por segundo) → la línea empieza.
- Con `t1 ≥ 6 s` no hay silencio previo: el título dura hasta `t1 − 4 s` (sistema-visual §10).
- El silencio previo solo se aplica al **empezar desde el principio**: al entrar en 0 (Biblioteca, o editor con inicio calculado 0), con ⏮ / Inicio / 0 y con "Otra vez". Buscar con la barra, ← o J hasta 0 no lo aplica.
- Durante el silencio previo: la barra de tiempo marca 00:00; Espacio lo pausa y lo reanuda donde estaba; buscar con la barra o con →/L lo cancela y suena desde el punto elegido; ⏮ lo reinicia.
- La primera línea **siempre** es una entrada: muestra `●●●` en los 3 s previos aunque el hueco desde 0 sea < 4 s (cambio en `render.ts`; afecta igual a la vista previa del editor, que debe coincidir con el reproductor).
- Sin ninguna línea con inicio (lista incompleta extrema): la pantalla de título dura toda la canción, sin silencio previo.

### Letra
| Elemento | Comportamiento |
|----------|----------------|
| Línea actual + siguiente | Centradas, tamaños, posición y sombra de sistema-visual §10, con la fuente, el color de letra y el color de resaltado del estilo. Máximo 2 líneas a la vez. |
| Resaltado | Por palabra si la línea trae tiempos de palabra (◆); si no, barrido lineal entre el inicio y el fin efectivo (`finEfectivo`). |
| Cambio de línea | La siguiente sube a la posición actual en 200 ms (instantáneo con movimiento reducido). |
| Huecos | Al llegar al fin efectivo, la línea actual desaparece y queda solo la siguiente. **Indicador de entrada `●●●`** (3 puntos en `color_resaltado`, encima de la siguiente línea, uno menos por segundo en los 3 s previos) antes de: la primera línea, y toda línea cuyo hueco desde el fin efectivo de la anterior es ≥ 4 s. Entre líneas seguidas (hueco < 4 s) no hay indicador. |
| Pausas (♪) | No se dibujan; solo cuentan como hueco. |
| Líneas sin inicio | Se omiten: su hueco se comporta como cualquier otro (si es ≥ 4 s, sale `●●●` antes de la siguiente). Ningún aviso mientras se canta. |
| En pausa | La letra se **congela** en el fotograma de ese instante (mismo barrido, mismas líneas). No se usa el modo estático del editor (línea seleccionada a medias). |

### Controles
| Elemento | Comportamiento |
|----------|----------------|
| ✕ Salir | Sale del reproductor (§"Salida"). Tooltip `rep.tooltip.salir`. |
| Barra de tiempo | Clic o arrastre para buscar; al soltar, suena desde ahí si estaba sonando. `role="slider"`, `aria-valuetext` como en el editor ("1 minuto 12 segundos de 5 minutos 55"); con el foco, ←/→ ±5 s. Sin marcas de líneas. |
| ⏮ | Vuelve al principio con pantalla de título y silencio previo. Mantiene el estado (sonando o en pausa). |
| ▶ / ❚❚ | Reproduce / pausa. En pausa, el botón muestra ▶ y la franja inferior añade `rep.pausa` "❚❚ En pausa" a la derecha de 5↻. |
| ↺5 / 5↻ | −5 s / +5 s (acotado a 0 y a la duración; +5 s en los últimos 5 s lleva al final). |
| 🎤 Voz + deslizador | Botón que silencia / reactiva la voz guía y deslizador de su nivel (§"Voz guía"). |
| Volumen general | Botón silenciar/activar + deslizador 0–100 % (paso 1 %; con el foco, flechas ±10 %). Mover el volumen con el sonido silenciado lo activa. Se aplica después de la igualación `ganancia_db`, al instrumental y a la voz guía. |
| ⌨ Atajos | Abre el diálogo de atajos (como F1). |
| ⛶ | Alterna pantalla completa / ventana sin salir del reproductor (para usarlo en una ventana, p. ej. en un segundo monitor). Icono y tooltip según el estado: `rep.tooltip.ventana` / `rep.tooltip.completa`. |
| Estilo de los botones | Botones icono de 44 × 44 px, iconos de 28 px, `#FFFFFF` sobre las franjas oscuras, sin fondo propio; hover: fondo `rgba(255,255,255,0.12)`, `r-m`. Foco: anillo doble (sistema-visual §7). Tooltip con nombre + atajo. |

### Ocultar controles
- Las franjas y el cursor se ocultan a los **3 s** sin actividad (fundido de 200 ms; instantáneo con movimiento reducido).
- Actividad que los muestra y reinicia la cuenta: mover el ratón, hacer clic en la superficie (el clic **no** pausa), Tab o Mayús+Tab.
- Los **atajos** (tabla siguiente) no muestran las franjas: solo el indicador breve (§"Indicador breve"). Excepción: Espacio/K al pausar (las franjas aparecen porque en pausa siempre se ven).
- No se ocultan: en pausa, durante la pantalla final, en el estado de error, con el puntero encima de una franja, con un diálogo o un tooltip abiertos, ni mientras se arrastra la barra o el volumen.
- Si al ocultarse el foco estaba en un control, vuelve a la superficie del reproductor (nunca queda un foco invisible).
- Durante el silencio previo y la pantalla de título rigen las mismas reglas.

### Voz guía
Decisión del usuario en [0030](../preguntas/0030-voz-original-en-el-reproductor.md): la voz separada (`voz.flac`) suena **encima** del instrumental, con un nivel propio, para elegir mucha, poca o ninguna guía. El instrumental suena siempre.
- **Mezcla**: voz e instrumental arrancan, se pausan, buscan y terminan **juntas** (mismo instante de `start()`, sin desfase audible entre ellas). La voz pasa por su propia ganancia (`voz_guia`) y después por el volumen general, así que M y el volumen general afectan a las dos.
- **Control** (franja inferior, wireframe B): botón icono 🎤 de 44 px + etiqueta "Voz" (`t-pequeno`, `#FFFFFF`) + deslizador de 96 px (0–100 %, paso 1 %; con el foco, flechas ±10 %) + porcentaje (`t-tiempo`, ancho fijo para "100 %").
  - Botón 🎤: silencia / reactiva la voz guía (`aria-pressed="true"` cuando suena). Silenciada: icono `mic-off`, deslizador y cifra en `texto-2` (siguen operables) y el nivel **no cambia**.
  - Mover el deslizador con la voz silenciada la reactiva. Llevarlo a 0 % equivale a "sin guía" pero **no** la marca como silenciada.
  - Reactivar con el nivel en 0 % lo sube a 30 % (si no, la tecla parecería no hacer nada).
- **Teclas**: **V** silencia / reactiva la voz guía. **Mayús + ↑ / ↓** sube / baja su nivel ±10 % (y la reactiva si estaba silenciada). Se eligió V por "voz" y porque no choca con ningún atajo de la app; las flechas con Mayús siguen el patrón de ↑/↓ del volumen general.
- **Se recuerda**: nivel (`voz_guia`) y silencio (`voz_guia_silenciada`) persisten entre canciones y reinicios, como el volumen general. Por defecto: 30 % y **silenciada**, de modo que quien no la toca canta sin voz y la primera V da una guía suave.
- **Carga**: al entrar se decodifican las dos pistas en paralelo y el audio empieza cuando las dos están listas (< 1 s en 4 min). Si la voz no se puede cargar, se canta igual con el instrumental: el control de voz queda `aria-disabled` con el tooltip `rep.voz.nodisponible`, V no hace nada y la canción se comprueba como en el error de pista que falta (al volver aparece "Dañada"; [0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md) §4).
- **Indicador breve**: `rep.ind.voz` "Voz {n} %" al cambiar el nivel o reactivarla; `rep.ind.vozsilenciada` "Voz silenciada" al silenciarla. No hay etiqueta permanente en pantalla: la guía la elige quien canta.
- **Desde el editor**: con pistas separadas, el mismo control y los mismos valores recordados. Sin pistas separadas (suena `original`), el control no aparece y V / Mayús + ↑↓ no hacen nada.

### Atajos de teclado
Activos con el foco en la superficie del reproductor o en cualquier control, salvo donde se indica. Todos llaman a `preventDefault`.

| Tecla | Acción |
|-------|--------|
| Espacio / K | Reproducir / pausa (con el foco en un botón, Espacio e Intro activan ese botón, como en el resto de la app) |
| ← / → | −5 s / +5 s |
| J / L | −10 s / +10 s |
| ↑ / ↓ | Volumen +10 % / −10 % |
| M | Silenciar / activar sonido |
| V | Silenciar / reactivar la voz guía (conserva su nivel) |
| Mayús + ↑ / ↓ | Voz guía +10 % / −10 % |
| Inicio / 0 | Volver al principio (con título y silencio previo) |
| F | Pantalla completa / ventana |
| Esc | Cierra el diálogo o tooltip abierto; si no hay ninguno, **sale del reproductor con una sola pulsación**, también en pantalla completa |
| , / . | **Solo desde el editor**: desplazamiento de toda la letra −/+ 100 ms (§"Prueba desde el editor") |
| F1 / ? | Diálogo "Atajos de teclado" (pausa la reproducción; al cerrarlo sigue en pausa) |

No funcionan en el reproductor: Ctrl/Cmd + N, Ctrl/Cmd + , y el zoom de la interfaz (Ctrl/Cmd + + / − / 0), como dice spec 00 §6. El menú de la aplicación y F11 / Ctrl+Cmd+F siguen funcionando y equivalen a ⛶.

### Indicador breve
- Cada atajo (y cada clic en ⏮, ↺5, 5↻, 🎤, silenciar; no al arrastrar deslizadores, que ya muestran su valor) muestra un indicador de **600 ms** (1 s para el desplazamiento): píldora `rgba(0,0,0,0.6)` con texto `#FFFFFF` de `máx(20 px, 3 % del alto)`, centrada en horizontal con su centro al **12 % del alto** (nunca en la franja central). Un nuevo indicador sustituye al anterior.
- Textos: `rep.ind.*` (▶, ❚❚, −5 s, +5 s, −10 s, +10 s, Volumen 60 %, Silenciado, Al principio, Voz 30 %, Voz silenciada, desplazamiento).

### Salida
| Vía | Comportamiento |
|-----|----------------|
| Esc, ✕ Salir, "Volver a la biblioteca" / "Volver al editor" de la pantalla final o del error, fin de la cuenta atrás de la pantalla final | Se detiene el audio, se libera el motor del reproductor y se vuelve a la vista de origen. La ventana recupera el estado que tenía **antes** de entrar (si ya estaba a pantalla completa, sigue así; si era una ventana normal o maximizada, vuelve a serlo). |
| Vuelta a la Biblioteca | Mismo filtro, búsqueda y desplazamiento; foco en la tarjeta de la canción (también si se entró desde el toast). Sin toast. |
| Vuelta al editor | Ver §"Prueba desde el editor". |
| Toasts retenidos | Los toasts de la app que lleguen mientras el reproductor está abierto (p. ej. una separación que termina) no se muestran encima de la letra: se retienen y aparecen al salir (como máximo los 3 más recientes). Las notificaciones del sistema siguen sus reglas (spec 04): con el reproductor en primer plano la ventana tiene el foco, así que no salen. |

### Pantalla final
- Cuando el audio llega al final: se muestra el wireframe D, las franjas se ocultan y el cursor se ve. Foco en "Volver a la biblioteca" / "Volver al editor".
- Cuenta atrás `rep.cierre` de 10 s, actualizada cada segundo; al llegar a 0 sale sola (§"Salida"). Cualquier actividad (mover el ratón, una tecla, Tab) **detiene** la cuenta atrás: el texto desaparece y la pantalla espera.
- "Otra vez" (o Espacio/K con el foco en la superficie): vuelve al principio con pantalla de título y silencio previo, y suena.
- ←, J o la barra de tiempo (las franjas se ven al mover el ratón) vuelven a un punto anterior y siguen sonando: la pantalla final se cierra.

### Prueba desde el editor ("Probar a pantalla completa")
- **Pista**: instrumental + voz guía si la separación está completada; si no, la original sola con la etiqueta `rep.original` arriba en el centro, siempre visible (también con los controles ocultos), y sin el control de voz guía.
- **Desplazamiento** con **,** / **.**: −/+ 100 ms, en el rango −30,00 s … +30,00 s (en el tope no cambia y el indicador añade `edi.offset.rango`). Se aplica al instante a la letra. Indicador 1 s con el valor **total**: `rep.offset` ("Desplazamiento: +0,25 s"). El reproductor no escribe en disco: cada cambio pasa al estado del editor, que lo autoguarda como cualquier cambio suyo (también si se cierra la ventana con el reproductor abierto), y todos los cambios de una misma prueba forman **un solo paso** de deshacer.
- **Pantalla final**: "Otra vez" + "Volver al editor".
- **Al volver al editor** (Esc, ✕, pantalla final): el editor queda **en pausa** con el cabezal en la posición en que estaba el reproductor; la línea seleccionada pasa a ser la que sonaba (o la última que había empezado) en ese instante, y la lista se desplaza hasta ella; si aún no había empezado ninguna, la selección no cambia. Se restauran la pista de escucha y la velocidad que tenía el editor. El foco vuelve al botón "Probar a pantalla completa". El historial de deshacer se conserva (más el paso del desplazamiento, si lo hubo).
- No se muestra `rep.incompleta` (el editor ya lo indica).

### Legibilidad a distancia
- **Referencia**: televisor de 55" 16:9 (≈ 68,5 cm de alto de imagen) visto a 5 m.
- Línea actual: `máx(32 px, 7,5 % del alto)` (sistema-visual §10) = ≈ 5,1 cm de cuerpo; altura de mayúscula ≈ 0,7 em ≈ 3,6 cm. Regla orientativa: mayúscula ≥ 1/150 de la distancia (3,3 cm a 5 m) → **cumple**. Línea siguiente (70 %): ≈ 2,5 cm, legible a 5 m (≈ 1/200) para anticipar. Una línea larga reducida al mínimo del 75 % queda en ≈ 2,7 cm (≈ 1/185).
- **Sin tope en píxeles**: el tamaño depende solo del alto de la pantalla, para que una TV 4K con escalado 100 % (2160 px CSS de alto) no lo reduzca (antes `clamp(…, 140px)` lo dejaba en el 6,5 %; se quita en sistema-visual §10).
- Máximo 2 líneas visibles (actual + siguiente) para que el ojo no busque.
- Mientras se canta, la franja central 25 %–75 % del alto no tiene ningún elemento de interfaz (ni controles, ni indicador, ni avisos, ni etiquetas).
- Sombra fija de §10 para separar la letra de los degradados; el contraste del estilo se revisa en el editor (spec 06, sistema-visual §9).
- La letra no se mueve durante el barrido (sin escala ni rebote).
- Los textos que sí deben leerse de lejos y aparecen sobre el fondo del estilo (píldora `rep.incompleta` de la pantalla de título, indicador breve, etiquetas de pista) usan `máx(t-cuerpo, 2,2 % del alto)` (≈ 24 px en 1080p). Los controles de las franjas son para quien maneja el equipo: tamaños fijos del sistema visual.
- Mientras suena, la pantalla no se apaga ni salta el salvapantallas ([0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md) §5).

## Estados
| Estado | Presentación |
|--------|--------------|
| Vacío | No aplica: solo se abre con canciones Lista (Biblioteca) o desde el editor. |
| Cargando | Fondo del estilo + pantalla de título (sin `●●●`). Si tarda > 1 s, spinner de 24 px + `rep.cargando` bajo el artista, en `#FFFFFF` sobre la píldora de §10. Los controles funcionan salvo los de reproducción (inactivos); Esc sale. |
| Silencio previo / pantalla de título | Wireframe C. |
| Reproduciendo | Wireframe A (o B con actividad). |
| En pausa | Wireframe B con `rep.pausa`, letra congelada, cursor visible. |
| Final | Wireframe D con cuenta atrás de 10 s. |
| Error: falta la pista (instrumental, o la original en la vista previa) | Wireframe E con `rep.error.titulo` + `rep.error.pistas` (o `rep.error.mezcla`), [Copiar detalles] y [Volver a la biblioteca] / [Volver al editor] (primario, foco). Desde la Biblioteca, la canción pasa a "Dañada" ("Faltan las pistas separadas", spec 02) sin reiniciar la app ([0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md) §4). `role="alert"`. |
| Error: el archivo existe pero no se puede leer (decodificación) | Igual con `rep.error.audio`. La canción no se marca Dañada. |
| Voz guía silenciada / sonando | Solo cambia el control de la franja inferior (icono `mic-off` y atenuado / icono `mic` y `#FFFFFF`). Nada sobre la letra. |
| Voz guía no disponible (falta o no se lee `voz.flac`) | Suena el instrumental; control `aria-disabled` con `rep.voz.nodisponible`. |
| Vista previa sin instrumental | Etiqueta `rep.original` arriba en el centro, siempre visible. |
| Lista incompleta | `rep.incompleta` en la pantalla de título (píldora, wireframe C) y en la franja superior con los controles visibles; nada mientras se canta. Se anuncia una vez a lectores de pantalla al empezar. No aplica desde el editor. |
| Fuente no disponible | No aplica en el MVP (solo fuentes incluidas). Por robustez: si la familia no carga, se usa Atkinson Hyperlegible Next sin aviso. |
| Ventana sin foco / minimizada | La reproducción continúa; al volver, la letra está en su sitio. Los controles siguen sus reglas. |
| Modo ventana (⛶ / F) | Mismo reproductor ocupando toda la ventana de la app (sin barra superior). Las proporciones de §10 se calculan sobre el alto de la ventana. |

## Accesibilidad
- Región `role="region"` con nombre `rep.aria.region`; la letra (`PantallaLetra`) es `aria-hidden` (se lee cantando, no con lector de pantalla).
- Anuncios `aria-live="polite"` solo en hitos: al empezar (`rep.aria.inicio`, más `rep.incompleta` una vez si aplica), pausa / reanudación, cambios de volumen y voz (el texto del indicador breve), `rep.aria.fin` y la cuenta atrás de la pantalla final solo al aparecer. Los errores, con `role="alert"`. Nunca cada línea ni el tiempo.
- Todo es operable con teclado: atajos de la tabla, Tab recorre [✕ Salir] → barra de tiempo → ⏮ → ▶/❚❚ → ↺5 → 5↻ → 🎤 → nivel de voz → silenciar → volumen → ⌨ → ⛶ (orden visual). Los dos deslizadores tienen nombres distintos (`rep.aria.vozguia`, `rep.aria.volumen`) y `aria-valuetext` "30 %" (con "silenciada" si lo está). Los botones tienen nombre accesible (`rep.tooltip.*` sin el atajo y con `aria-keyshortcuts`).
- Foco visible con el **anillo doble** (sistema-visual §7) sobre cualquier fondo; nunca queda un foco en un control oculto.
- Contraste: los controles y sus textos son `#FFFFFF` sobre ≥ 60 % de negro, lo que da ≥ 5,7:1 incluso sobre un fondo de estilo blanco (`#FFFFFF` sobre `#666666`); la píldora de §10 igual. El contraste de la letra depende del estilo y lo avisa el editor.
- Movimiento reducido: sin fundidos de las franjas ni transición entre líneas.
- Diálogo de atajos: el componente de diálogo del sistema visual, con la tabla de esta spec (las filas que no aplican, como , / . desde la Biblioteca o V sin pistas separadas, no aparecen).

## Microcopy
| Clave | Texto |
|-------|-------|
| `rep.salir` | Salir |
| `rep.pausa` | ❚❚ En pausa |
| `rep.cargando` | Cargando… |
| `rep.otravez` | Otra vez |
| `rep.volver.biblioteca` | Volver a la biblioteca |
| `rep.volver.editor` | Volver al editor |
| `rep.cierre` | Se cerrará en {n} s… |
| `rep.original` | Vista previa con la canción original: aún no hay pista instrumental. |
| `rep.voz` | Voz |
| `rep.ind.voz` | Voz {n} % |
| `rep.ind.vozsilenciada` | Voz silenciada |
| `rep.voz.nodisponible` | La voz guía no está disponible en esta canción. |
| `rep.aria.vozguia` | Volumen de la voz guía |
| `rep.aria.volumen` | Volumen general |
| `rep.incompleta` | ⚠ Faltan {n} líneas por sincronizar: no se verán. · (n = 1) ⚠ Falta 1 línea por sincronizar: no se verá. |
| `rep.offset` | Desplazamiento: {+/−n,nn} s |
| `rep.ind.*` | ▶ · ❚❚ · −5 s · +5 s · −10 s · +10 s · Volumen {n} % · Silenciado · Al principio |
| `rep.error.titulo` | No se puede reproducir esta canción. |
| `rep.error.pistas` | Falta su pista instrumental. Puedes volver a separarla desde la biblioteca: menú ⋯ › Re-separar pistas. |
| `rep.error.mezcla` | Falta el audio de la canción. |
| `rep.error.audio` | No se ha podido leer su audio. Si vuelve a pasar, copia los detalles para pedir ayuda. |
| `rep.copiar` | Copiar detalles |
| `rep.tooltip.*` | Salir (Esc) · Reproducir (Espacio) · Pausa (Espacio) · Al principio (Inicio) · Retroceder 5 s (←) · Avanzar 5 s (→) · Silenciar la voz guía (V) · Activar la voz guía (V) · Voz guía (Mayús + ↑ ↓) · Silenciar (M) · Activar sonido (M) · Volumen (↑ ↓) · Atajos de teclado (F1) · Pantalla completa (F) · Ver en una ventana (F) |
| `rep.atajos.titulo` | Atajos de teclado |
| `rep.aria.region` | Reproductor de «{título}» |
| `rep.aria.inicio` | Reproduciendo «{título}», de {artista}. |
| `rep.aria.fin` | Fin de la canción. |

Formato: tiempos de la barra `mm:ss` (`h:mm:ss` desde 1 h), coma decimal en el desplazamiento ("+0,25 s"), signo siempre visible (también "+0,00 s").

## Criterios de aceptación

**Entrada y salida**
1. Desde la Biblioteca, en una canción Lista, un clic en "▶ Reproducir", en el botón redondo o en la portada, Intro con la tarjeta enfocada o "Reproducir" del menú ⋯ abre el reproductor: la ventana pasa a pantalla completa y el fondo del estilo con la pantalla de título se ve en < 200 ms; con la primera línea a ≥ 6 s, el instrumental suena en < 1 s (canción de 4 min).
2. [▶ Reproducir] del toast `bib.toast.lista` abre el reproductor igual que el botón de la tarjeta y cierra el toast.
3. Esc sale del reproductor con **una** pulsación, también en pantalla completa (si hay un diálogo abierto, la primera pulsación lo cierra). ✕ Salir hace lo mismo.
4. Al salir, la ventana vuelve al estado que tenía antes de entrar (ventana, maximizada o pantalla completa); en la Biblioteca se conservan filtro, búsqueda y desplazamiento, y el foco está en la tarjeta de la canción.
5. F y ⛶ alternan pantalla completa y ventana sin salir del reproductor ni cortar el audio; el icono y el tooltip reflejan el estado, también si se cambia con el menú, F11 o el botón verde de macOS.

**Inicio, letra y sincronía**
6. Con la primera línea en `t1 < 6 s`, al empezar desde el principio hay un silencio previo de `6 s − t1`; en todos los casos se ve el título ≥ 2 s, la primera línea como siguiente y `●●●` que se apaga uno por segundo en los 3 s previos (test del modelo de render con `t1` = 0,5 s, 3 s, 5,9 s y 20 s).
7. El silencio previo se aplica al entrar en 0, con ⏮ / Inicio / 0 y con "Otra vez"; no al buscar hasta 0; Espacio lo pausa y una búsqueda lo cancela.
8. Se ven como máximo la línea actual y la siguiente, con los tamaños, posición y sombra de sistema-visual §10 (sin tope en píxeles: 162 px de cuerpo con 2160 px CSS de alto) y con la fuente y los colores del estilo de la canción.
9. La línea actual se resalta por palabra si tiene tiempos de palabra y, si no, con barrido lineal entre su inicio y su fin efectivo; el desfase visual respecto al audio es ≤ 50 ms (con `outputLatency` y `offset_ms` aplicados).
10. `●●●` aparece antes de la primera línea y antes de cada línea precedida por un hueco ≥ 4 s (desde el fin efectivo anterior, contando pausas y líneas omitidas), y no aparece con huecos < 4 s.
11. En pausa la letra se queda congelada en el fotograma de ese instante (no muestra la línea "a medias" del modo estático del editor).
12. El audio suena siempre a 1×, con ganancia `10^(ganancia_db/20) × volumen`.

**Controles y teclado**
13. Las franjas y el cursor se ocultan a los 3 s sin actividad y reaparecen al mover el ratón, hacer clic o pulsar Tab; no se ocultan en pausa, con el puntero sobre una franja, con un diálogo abierto ni arrastrando; al ocultarse, el foco vuelve a la superficie; los controles nunca ocupan la franja central 25 %–75 % del alto.
14. Todos los atajos de la tabla funcionan (también con el foco en un control, salvo Espacio/Intro sobre un botón, que lo activan) y muestran el indicador breve de 600 ms (1 s el desplazamiento) centrado al 12 % del alto, sin mostrar las franjas.
15. ←/→ ±5 s, J/L ±10 s, ⏮ y la barra de tiempo buscan con el audio acotado a [0, duración]; la barra es un `slider` con `aria-valuetext` en palabras.
16. El volumen es el de `config.reproductor` (el mismo del editor): ↑/↓ ±10 %, M silencia, mover el volumen silenciado activa el sonido, y el valor persiste entre canciones y reinicios (escritura como mucho cada 500 ms).
17. Ctrl/Cmd + N, Ctrl/Cmd + , y el zoom de la interfaz no hacen nada en el reproductor.
18. F1, ? o ⌨ abren el diálogo de atajos y pausan; al cerrarlo sigue en pausa.

**Voz guía** ([0030](../preguntas/0030-voz-original-en-el-reproductor.md))
19. Con pistas separadas suenan a la vez el instrumental y `voz.flac`, arrancando, pausando y buscando juntas (mismo `start()`; test con el doble de `AudioContext`); la voz se oye con ganancia `voz_guia` × la general, y M y el volumen general afectan a las dos; nunca suena `mezcla.flac` salvo en la vista previa sin pistas.
19b. V y 🎤 silencian y reactivan la voz guía sin cambiar su nivel; Mayús + ↑/↓ y el deslizador cambian el nivel ±10 % / 1 % y la reactivan; reactivar con 0 % la pone en 30 %; cada cambio muestra `rep.ind.voz` o `rep.ind.vozsilenciada`.
19c. El nivel y el silencio de la voz guía persisten en `config.reproductor.voz_guia` / `voz_guia_silenciada` entre canciones y reinicios (como mucho una escritura cada 500 ms); sin configuración previa valen 30 % y silenciada.
19d. Si `voz.flac` no se puede cargar, la canción se canta con el instrumental, el control de voz es `aria-disabled` con `rep.voz.nodisponible` y la canción aparece "Dañada" al volver a la Biblioteca; en la vista previa sin pistas separadas el control no aparece.

**Final**
20. Al terminar el audio aparece la pantalla final con el foco en "Volver a la biblioteca" (o "Volver al editor") y la cuenta atrás de 10 s; sin actividad sale sola a los 10 s; cualquier actividad detiene la cuenta atrás; "Otra vez" reinicia con título y silencio previo.

**Estados y errores**
21. Mientras carga se ve el fondo del estilo con la pantalla de título; a partir de 1 s, además `rep.cargando` con spinner; Esc funciona durante la carga.
22. Si falta el instrumental, se muestra el wireframe E con `rep.error.pistas` y el foco en "Volver a la biblioteca", y al volver la tarjeta aparece como "Dañada" con "Faltan las pistas separadas" sin reiniciar la app (test E2E borrando `pistas/instrumental.flac` de una canción de la semilla).
23. Si el archivo existe pero no se puede decodificar, se muestra `rep.error.audio` con [Copiar detalles] y la canción no cambia de estado.
24. En una canción Lista incompleta el reproductor funciona con normalidad, omite las líneas sin inicio, muestra `rep.incompleta` (singular con n = 1) en la pantalla de título y en la franja superior con los controles visibles, lo anuncia una vez a lectores de pantalla y no muestra ningún aviso en la zona de la letra mientras se canta.
25. Los toasts que llegan con el reproductor abierto no se muestran sobre él y aparecen al salir (como máximo los 3 más recientes).
26. Mientras suena, la pantalla del equipo no se apaga ni salta el salvapantallas; en pausa o al salir vuelve a hacerlo según el sistema.

**Desde el editor**
27. "Probar a pantalla completa" o F (spec 06) abre el reproductor tras vaciar el guardado, desde `máx(0, línea seleccionada − 3 s)` (o la posición actual si la línea no tiene inicio), con la letra, el estilo y el desplazamiento del editor aunque aún no estuvieran guardados.
28. Sin pistas separadas suena la original con `rep.original` siempre visible y sin control de voz guía; con pistas, suenan instrumental y voz guía con los valores recordados.
29. , / . cambian el desplazamiento ±100 ms dentro de ±30 s con el indicador `rep.offset` (valor total); al volver, el editor muestra el nuevo desplazamiento, lo autoguarda y un solo Ctrl/Cmd + Z deshace todos los cambios de desplazamiento de esa prueba.
30. Al volver al editor (Esc, ✕ o pantalla final), el editor está en pausa con el cabezal en la posición del reproductor, la línea que sonaba seleccionada y visible, la misma pista y velocidad de antes, el historial de deshacer intacto y el foco en "Probar a pantalla completa"; `rep.incompleta` nunca se muestra en este caso.

**Accesibilidad y legibilidad**
31. Los controles tienen contraste ≥ 4,5:1 sobre sus franjas con cualquier fondo de estilo (prueba con un estilo sólido `#FFFFFF`) y foco visible con el anillo doble; ningún control enfocado queda oculto.
32. Los anuncios a lectores de pantalla se limitan a los hitos de §"Accesibilidad"; la letra es `aria-hidden`.
33. Con 1920 × 1080 y con 3840 × 2160 (escalado 100 % y 200 %), la línea actual mide el 7,5 % del alto y ningún elemento de interfaz se dibuja entre el 25 % y el 75 % del alto mientras suena una línea (captura E2E con los controles visibles).

## Cambios de esta revisión (2026-11-06)
Respecto a la versión de la Fase 0, sin cambiar el alcance:
- Base técnica: `MotorAudio` y `PantallaLetra` de la Fase 5 (ADR 0010); datos que usa; un solo volumen compartido con el editor.
- Inicio: silencio previo cuando la primera línea entra antes de 6 s y `●●●` siempre antes de la primera línea (cambio en `render.ts` y en sistema-visual §10).
- Letra congelada en pausa (no el modo estático del editor). Audio siempre a 1×.
- Legibilidad: sin tope de 140 px; cálculo para una TV de 55" a 5 m; tamaños relativos para la píldora, el indicador y las etiquetas.
- Controles: reglas exactas de ocultación y foco, botón de atajos, indicador breve al 12 % del alto (antes "central", que invadía la letra), pantalla final con cuenta atrás que se detiene con cualquier actividad.
- Voz guía (decisión de [0030](../preguntas/0030-voz-original-en-el-reproductor.md)): `voz.flac` sobre el instrumental, nivel propio recordado, V para silenciarla y Mayús + ↑/↓ para su nivel. Sustituye a la opción provisional de cambiar a la canción original.
- Salida: restaura el estado previo de la ventana; foco en la tarjeta; toasts retenidos.
- Desde el editor: instantánea en memoria, desplazamiento como un paso de deshacer, vuelta con cabezal y selección en la línea que sonaba.
- Errores separados (falta la pista / no se puede leer), con la canción marcada Dañada al momento ([0031](../preguntas/0031-detalles-tecnicos-del-reproductor-fase-6.md)).
- Pantalla encendida mientras suena.
- Criterios renumerados (1–33).

## Primera fase de 0.2.0 — Fin de línea y barrido

- El intervalo activo incluye su inicio y excluye su fin. Con líneas 00:12.40–00:15.80 y 00:17.10–00:20.30, en 00:15.80 desaparece la actual y la siguiente queda visible en su posición de espera, sin resaltado. En 00:17.10 esa línea pasa a activa. Buscar dentro del hueco reconstruye el mismo estado. Aplicar el desplazamiento global por igual a ambos extremos. Los indicadores existentes de primera entrada y huecos largos conservan sus reglas.
- El barrido de una línea partida recorre los renglones visuales en orden de lectura. Para anchos de 120 y 60 px, al 50 % se pintan 90 px del primer renglón y 0 px del segundo. Al 75 % se pintan 120 y 15 px. Los tiempos de palabras importadas se mantienen aunque sus fragmentos se distribuyan entre varios renglones.
- Redimensionar durante la reproducción recalcula los renglones en la nueva disposición y pinta el avance del reloj actual. La capa de resaltado es decorativa y el texto tiene una sola representación accesible.
- Verificar el reparto de anchos y fronteras con Vitest, y con un E2E de ventana angosta verificar orden de pintado y redimensión durante reproducción. Probar también la vista previa del editor, que usa el mismo render.

## Fase 4 de 0.2.0 — ventana secundaria y cola

Origen: [plan, fase 4, features 10 y 11](../versiones/0.2.0/plan-2.md#fase-4--reproducción-en-eventos), decisiones del usuario en [0048](../preguntas/0048-escucha-editor-durante-evento.md) y [0049](../preguntas/0049-politica-cola-de-reproduccion.md) y acuerdos de la [ronda 4](../versiones/0.2.0/discusion/r4-disenador-ux.md). Contratos (sesión, fases, revisión, ids de entrada, IPC por rol, pantallas, reposo): [ADR 0017](../adr/0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md). Correspondencia de estados de esta spec con las fases de main: S1 = `transicion`; S2 = `espera`; S3 = `fin_de_cola` (al añadir una canción pasa a `transicion`, S1, según [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §3 B); S4 = `error`; reproduciendo / en pausa / cargando = `reproduciendo` / `pausada` / `cargando`. La cola y los controles de operación de la ventana principal están en [02 · Fase 4](02-biblioteca.md#fase-4-de-020--ventana-secundaria-y-cola); el bloqueo de edición en [06 · Fase 4](06-editor.md#fase-4-de-020--ventana-secundaria-y-cola); la duración de la cuenta en [08 · Fase 4](08-ajustes-y-acerca.md#fase-4-de-020--ventana-secundaria-y-cola). Esta sección **amplía** la spec: el reproductor local (desde la Biblioteca sin sesión y «Probar a pantalla completa» del editor) **no cambia**.

### Conceptos

| Término | Definición |
|---|---|
| **Reproductor en otra pantalla** (ventana secundaria) | Una segunda ventana, de rol fijo, que solo muestra el reproductor. Hay como máximo una. Es la **única** que suena durante la sesión (un solo motor de audio). La pantalla elegida decide dónde se ve; el sonido sale siempre por la salida de audio habitual del sistema. |
| **Sesión** | Desde que se abre la ventana secundaria hasta que se cierra (por el usuario, por caída o al salir de la app). Mientras dura, el editor y la vista Letra están bloqueados (spec 06). |
| **Cola** | Una **entrada activa** (la que suena, está en pausa, terminó o falló en la secundaria) y una lista ordenada de **pendientes**. Cada entrada tiene su propio id: la misma canción puede estar varias veces. Vive en memoria mientras la app esté abierta; puede existir sin sesión (preparada antes de abrir o conservada al cerrar). |
| **Candidata** | La primera pendiente. Es la que anuncian la cuenta y la tarjeta «A continuación». La calcula main tras cada cambio de la cola. |
| **Última reproducida** | Tras «Cerrar y conservar cola», la entrada que llegó a sonar en último lugar, con su segundo si se interrumpió o marcada como terminada. Es contexto para reabrir; no es una pendiente. |

### Estados de la ventana secundaria

| Estado | Qué ve el público | Se llega por |
|---|---|---|
| Reproduciendo / en pausa | Wireframes A–C de esta spec con las diferencias de «Diferencias con el reproductor local» | Inicio de una entrada, reanudación |
| **Cuenta entre canciones** (transición) | Wireframe S1 | Fin natural de la activa con candidata; «Siguiente»; «Pasar a la siguiente canción»; **añadir una canción con S3 en pantalla**. («Iniciar» en espera y «Empezar ya» en la cuenta empiezan la candidata al momento, con su pantalla de título) |
| **En espera** | Wireframe S2 | Sesión abierta con la cola vacía; «Detener cuenta»; reabrir tras una canción terminada; «Descartar» un fallo sin pendientes |
| **Fin de la cola** | Wireframe S3 | Fin natural de la activa sin pendientes |
| **Fallo de una entrada** | Wireframe S4 | La activa o la candidata no se puede reproducir al consumirla |
| Cargando | Fondo del estilo + pantalla de título (como hoy, §"Estados") | Toda entrada que empieza |

### Wireframes

**S1 — Cuenta entre canciones** (4 s por defecto, configurable en Ajustes)
```
┌──────────────────────────────────────────────────────────────────────────┐
│ (fondo del estilo de la CANDIDATA)                                       │
│                                                                          │
│                              ╭─────────╮                                 │
│                            ╭─┤         ├─╮   ← anillo que se vacía       │
│                            │ │    3    │ │     (centro al 45 % del alto) │
│                            ╰─┤         ├─╯                               │
│                              ╰─────────╯                                 │
│                          Siguiente canción                               │
│                                                                          │
│                                          ┌──────────────────────────────┐│
│                                          │ A CONTINUACIÓN               ││ ← tarjeta inferior derecha
│                                          │ La flaca                     ││
│                                          │ Jarabe de Palo               ││
│                                          └──────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────────┘
```

**S2 — En espera** (con candidata / sin candidata)
```
┌──────────────────────────────────────┐   ┌──────────────────────────────────────┐
│ (fondo del estilo de la candidata)   │   │ (fondo-0)                            │
│                                      │   │                                      │
│                                      │   │          ◆ Shinobi Karaoke           │
│                                      │   │   Enseguida empieza la siguiente     │
│                                      │   │              canción                 │
│               ┌────────────────────┐ │   │                                      │
│               │ A CONTINUACIÓN     │ │   │                                      │
│               │ La flaca           │ │   │                                      │
│               │ Jarabe de Palo     │ │   │                                      │
│               └────────────────────┘ │   │                                      │
└──────────────────────────────────────┘   └──────────────────────────────────────┘
```

**S3 — Fin de la cola**
```
│                         Bohemian Rhapsody                                │ ← como la pantalla final D
│                              Queen                                       │
│                  ┌──────────────────────────┐                            │
│                  │      Fin de la cola       │                           │ ← píldora §10
│                  └──────────────────────────┘                            │
│            [ ↻ Otra vez ]   [ ✕ Cerrar reproductor ]                     │ ← solo con actividad (ratón, Tab)
```
Sin cuenta atrás de cierre: la ventana **no se cierra sola** (cerrarla dejaría el escritorio a la vista del público). Si se añade una canción a la cola, **empieza la cuenta** configurada hacia ella (S1), igual que al terminar una canción con cola, con «Detener cuenta» y «Empezar ya» (decisión del usuario en [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §3, opción B).

**S4 — Fallo de una entrada** (mensaje breve para el público; la causa está en la principal)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                          (fondo-0)                                       │
│                                                                          │
│              ⚠  Esta canción no se puede reproducir ahora.               │ ← máx(24 px, 3,2 % del alto), #FFFFFF
│                           «La flaca»                                     │ ← máx(t-cuerpo, 2,2 % del alto), texto-2
│                                                                          │
│     [ ⏭ Pasar a la siguiente canción ]   [ ✕ Cerrar reproductor ]       │ ← solo con actividad
└──────────────────────────────────────────────────────────────────────────┘
```
Sin pendientes, el primer botón no aparece y el texto añade `rep.cola.fallo.fin`.

### Apertura y foco
- La abre la principal (diálogo «Abrir el reproductor en otra pantalla», spec 02). La ventana aparece en la pantalla elegida, a pantalla completa si se marcó, **sin quitar el foco a la principal** (el operador sigue en la Biblioteca). Si la pantalla elegida es la principal y se marcó «Pantalla completa», sí la cubre y recibe el foco.
- Sin barra superior, sin menú de la app propio y sin zoom de la interfaz. Título de la ventana: `rep.cola.ventana` (lo ve el sistema operativo y Alt + Tab).
- Inicios posibles (ADR 0017 §11, `sesion.abrir`): **con una canción** («Reproducir en otra pantalla…» del menú de una Lista, spec 02): esa canción empieza al momento y las pendientes que hubiera siguen detrás; **con la cola**: con pendientes y sin última reproducida, empieza la primera al momento (pantalla de título y silencio previo); con la cola vacía, S2 sin candidata; **reanudar**: con una última reproducida, ver §"Reabrir con la cola conservada".
- **Linux con Wayland** (`colocacion: 'sistema'`, [0061](../preguntas/0061-reproductor-en-otra-pantalla-con-wayland.md)): la ventana se abre donde decide el sistema, en ventana; el operador la lleva a la pantalla del público y pulsa F (texto `ses.wayland` en el diálogo de la principal).
- Pantalla encendida **durante toda la sesión**, también en pausa, en cuenta, en espera, en el fin de la cola y en un fallo: una pantalla de evento no debe apagarse. Se libera al terminar la sesión por cualquier causa (ADR 0017 §4; decisión del usuario en [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §2).

### Diferencias con el reproductor local
Todo lo de esta spec vale en la secundaria salvo:

| Aspecto | En la ventana secundaria |
|---|---|
| Franja superior | Izquierda: [✕ Cerrar reproductor] (`rep.cola.cerrar`). Derecha: «título · artista». **No** se muestra `rep.incompleta` (ni en la franja ni en la pantalla de título): el público no lo necesita; el aviso está en la entrada de la cola de la principal. |
| Franja inferior | Igual, con [⏭] tras 5↻ (`rep.cola.siguiente`; inactivo sin pendientes, tooltip `rep.cola.siguiente.no`). ⏮ es «Reiniciar canción» (mismo comportamiento: principio con título y silencio previo). En S1 y S2 la franja inferior solo tiene [▶ Empezar ya] / [▶ Iniciar «{título}»], [❚❚ Detener cuenta] (solo en S1), volumen, voz guía, ⌨ y ⛶. |
| Pantalla final | No existe. Con candidata → S1. Sin pendientes → S3. |
| Error de pista o de audio (wireframe E) | Lo sustituye S4. La canción se marca Dañada igual que hoy si faltan pistas (criterio 22). |
| Salida | No hay «Volver a la biblioteca». Cerrar = terminar la sesión (§"Cerrar el reproductor con cola"). |
| Esc | Cierra un diálogo o tooltip; si no hay, **en pantalla completa pasa a ventana**; en ventana no hace nada. Nunca pide el cierre de la sesión (un Esc accidental en un evento no debe dejar la pantalla vacía). |
| Toasts | La secundaria nunca muestra toasts; los de la app salen en la principal como siempre (no se retienen). |
| Desplazamiento `,` `.` | No aplica (solo desde el editor). |
| Tema | La entrada usa el estilo resuelto **al empezar** (instantánea, [ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md)); un cambio de tema durante la canción se ve en la siguiente entrada. |

Atajos añadidos o distintos (se añaden al diálogo de atajos solo en la secundaria):

| Tecla | Acción |
|---|---|
| Espacio / K | Reproducir / pausa. En S1: «Empezar ya». En S2 con candidata: «Iniciar». |
| Mayús + N | Siguiente: interrumpe la activa y empieza la cuenta de la candidata (sin pendientes no hace nada y muestra `rep.cola.siguiente.no` como indicador breve). Con Mayús para evitar pulsaciones accidentales. |
| Esc | Ver tabla anterior. |
| Ctrl/Cmd + W | Cerrar reproductor (con la confirmación de cola si hay pendientes). También el botón de cerrar de la ventana y Alt + F4. |
| F | Pantalla completa / ventana (igual que hoy). |

### Cuenta entre canciones (S1)
- **Cuándo**: al terminar de forma natural la activa con una candidata disponible; con «Siguiente» (principal o secundaria) con «Pasar a la siguiente canción» (ADR 0017 §7: `sesion.siguiente` empieza la cuenta como un fin natural) y al **añadir una canción mientras se ve S3** («Fin de la cola»; [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §3 B). Así el público siempre ve qué viene. Nunca tras un fallo sin acción explícita.
- **Duración**: la de Ajustes (`aj.rep.cuenta`, `config.reproductor.transicion_s`, 4 s por defecto). El número empieza en esa cifra y baja uno por segundo; al pasar de 1 la candidata se convierte en la activa y empieza con su pantalla de título y su silencio previo. La fecha límite es de main (ADR 0017): la secundaria solo la dibuja.
- **Fondo**: el del estilo de la **candidata** (anticipa la canción). Si aún no se ha resuelto, `fondo-0`.
- **Número**: centrado con su centro al 45 % del alto (donde estará la letra), `máx(64 px, 18 % del alto)`, `#FFFFFF` 700 con la sombra de §10, sobre un disco `rgba(0,0,0,0.6)` de 1,6 × el alto del número. No usa el color de letra del estilo: así el contraste es ≥ 5,7:1 con cualquier fondo. Debajo, `rep.cola.cuenta` («Siguiente canción») en `máx(t-cuerpo, 2,2 % del alto)`.
- **Animación**: anillo de 0,6 % del alto alrededor del disco (pista `rgba(255,255,255,0.35)`, relleno `#FFFFFF`) que se vacía de forma continua en sentido horario durante toda la cuenta; cada número entra con una escala de 0,9 → 1 y fundido en 200 ms. **Movimiento reducido**: sin anillo ni escala; el número cambia de golpe una vez por segundo.
- **Tarjeta «A continuación»**: abajo a la derecha (margen 4 % del ancho y 6 % del alto), máx. 40 % del ancho, fondo `rgba(0,0,0,0.6)`, radio `r-l`, relleno 1 × 1,25 em. Etiqueta `rep.cola.aContinuacion` en mayúsculas `máx(t-pequeno, 1,8 % del alto)` 600; título `máx(20 px, 3,2 % del alto)` 600, una línea con «…»; artista `máx(t-cuerpo, 2,2 % del alto)`. Todo `#FFFFFF`.
- **Cambia la candidata durante la cuenta** (reordenar, quitar, «Reproducir a continuación» en la principal): la tarjeta y el fondo pasan a la nueva (fundido 200 ms; inmediato con movimiento reducido) y la cuenta **vuelve a empezar** desde la duración completa. Si el id de la candidata no cambia (p. ej. se reordenan pendientes posteriores), nada cambia y la cuenta sigue.
- **Se quedan sin pendientes durante la cuenta**: la cuenta se cancela y se pasa a S3 con la entrada que terminó.
- **«Detener cuenta»** (principal o franja de S1): pasa a S2 con la candidata. **«Empezar ya»** (o Espacio): la candidata empieza al momento.
- **Congelada** mientras se confirma el cierre (§"Cerrar el reproductor con cola"): el número y el anillo se quedan quietos; nada cambia en pantalla. Con «Cancelar», sigue **desde donde se detuvo**.
- **Revalidación**: al terminar la activa, si la primera pendiente ya se sabe no disponible (borrada, vuelta a borrador o dañada), no hay cuenta: S4. Al consumirla, main comprueba de nuevo canción, estado Lista y pistas; si falla, S4 en lugar de su pantalla de título.

### En espera (S2)
- Con candidata: fondo de su estilo y solo la tarjeta «A continuación»; nada en el centro. Con actividad, la franja inferior ofrece [▶ Iniciar «{título}»] (`rep.cola.iniciar`).
- Sin candidata: `fondo-0`, «◆ Shinobi Karaoke» en `texto-3` a `máx(32 px, 6 % del alto)` y `rep.cola.espera` debajo en `texto-2`.
- **Añadir a la cola en espera (S2) no arranca solo**: la nueva candidata se ve en la tarjeta y la empieza el operador («Iniciar» en la principal, en el toast de la principal o en la secundaria). Es distinto de S3, donde añadir sí empieza la cuenta: a S2 se llega por una decisión explícita del operador (detener la cuenta, descartar un fallo, abrir con la cola vacía o tras una canción terminada). Excepción: abrir la sesión con pendientes y sin última reproducida empieza la primera (§"Apertura y foco").

### Fin de la cola (S3)
- Al terminar la activa sin pendientes. Mismo fondo, título y artista que la pantalla final D, con la píldora `rep.cola.fin`. «Otra vez» repite la misma entrada desde el principio; «Cerrar reproductor» termina la sesión (sin pendientes, sin confirmación).
- Si llega una pendiente (añadida desde la principal), pasa a **S1** con ella como candidata y la cuenta completa configurada; «Detener cuenta» lleva a S2 y «Empezar ya» la empieza al momento. Si se añaden varias seguidas, la candidata es la primera y la cuenta no se reinicia mientras su id no cambie (regla general de S1).

### Fallo de una entrada (S4)
- **Cuándo**: al consumir una entrada (empezar, reanudar, avanzar) main o la secundaria detectan que no se puede reproducir, o al terminar la activa la primera pendiente ya está marcada no disponible. Causas que distingue la principal (`cola.causa.*`, spec 02, a partir de `MotivoNoDisponible` y del error del motor): ya no está en la biblioteca, ya no está lista, faltan las pistas, no se puede leer el audio.
- **No avanza solo**: el avance requiere «Pasar a la siguiente canción» (principal, o la secundaria con actividad), que **descarta la entrada fallida** y empieza la cuenta de la siguiente. Sin pendientes, el botón es «Descartar» (`cola.descartar`) y lleva a S2 sin candidata.
- `role="alert"` con `rep.cola.fallo` y el título. Los controles de reproducción no se muestran.

### Reabrir con la cola conservada
Tras «Cerrar y conservar cola» (o una caída), la principal guarda la última reproducida. Al volver a abrir el reproductor (spec 02):
- **Interrumpida a mitad** (la canción no había terminado): empieza **en el mismo segundo**, sin pantalla de título ni silencio previo, y en el mismo estado en que se cerró (si estaba en pausa, abre en pausa en ese segundo; ADR 0017 §8). Indicador breve `rep.cola.reanudada` durante 2 s (al 12 % del alto) y anuncio `rep.cola.aria.reanudada`. «Reiniciar canción» (⏮ en la secundaria, ↺ en la principal) vuelve al principio con título y silencio previo **sin tocar el orden de pendientes**. Si se cerró durante el silencio previo o la pantalla de título, empieza desde el principio.
- **Terminada** (se cerró en la cuenta o en S3): abre en S2 con la primera pendiente como candidata (o S2 sin candidata si no quedan) y el operador la inicia. La última reproducida se muestra como contexto en la principal.
- **Ya no disponible** al reabrir: S4 con su causa y «Pasar a la siguiente canción».
- La posición pertenece a la **entrada**: si la misma canción está dos veces, solo se reanuda la que se interrumpió.

### Cerrar el reproductor con cola
- **Vías**: [✕ Cerrar reproductor] de la secundaria o de la principal, Ctrl/Cmd + W en la secundaria, botón de cierre de su ventana, Alt + F4 (Esc no, ver «Diferencias»). Todas pasan por **la misma confirmación**, una sola vez.
- **Sin pendientes**: cierra al momento, sin diálogo; la cola queda vacía y no hay última reproducida.
- **Con pendientes**: diálogo `ses.cierre` (texto en spec 02) en la ventana **donde se pidió el cierre**: quien pulsó lo ve donde está mirando (en la secundaria, con el componente de diálogo y el anillo doble, sobre el fondo de la canción). La otra ventana lo indica: la principal muestra `ses.cierre.esperando` en el panel y desactiva sus controles de sesión; la secundaria no muestra nada al público. Mientras está abierto: la canción que suena **sigue sonando**; una cuenta en curso queda congelada; si la canción termina, **no** empieza la cuenta (queda como «terminada») y el diálogo no cambia.
- **«Cerrar y conservar cola»**: main guarda la última reproducida (entrada, segundo y estado, o «terminada») y los pendientes en su orden, y cierra. **«Cerrar y eliminar cola»**: vacía la cola y cierra. **«Cancelar»**: vuelve la sesión tal como estaba (cuenta descongelada).
- Una caída o la desconexión del último monitor **nunca** eliminan la cola (§"Recuperación").

### Recuperación (lado de la secundaria)
| Situación | Comportamiento |
|---|---|
| Se desconecta la pantalla de la secundaria | Main la lleva a la pantalla primaria **en ventana** (80 % del área útil, centrada, sin robar el foco) para no tapar al operador. **El audio sigue sonando** y la cola no cambia (decisión del usuario en [0059](../preguntas/0059-conductas-de-la-sesion-en-vivo-ante-incidencias.md) §1, ADR 0017 §3). La principal muestra `ses.rec.monitor` (spec 02) con [Mover a…]. |
| Vuelve a conectarse esa pantalla | No se mueve sola. La principal ofrece `ses.rec.vuelve` con [Llevar el reproductor allí] (`sesion.moverAPantalla`), que la devuelve y restaura pantalla completa si la tenía. |
| La secundaria se cierra o su contenido se cae | Termina la sesión **conservando la cola** (sin diálogo): la última reproducida queda «interrumpida» en el último segundo conocido por main. Se libera el bloqueo de edición y el de reposo. No se reabre sola. La principal muestra `ses.rec.caida` con [Volver a abrir]. |
| La secundaria deja de responder | La principal muestra `ses.rec.noResponde` con [Esperar] y [Cerrar y volver a abrir] (cierre forzado que conserva la cola como en una caída, y abre el diálogo de pantallas). Si vuelve a responder, el aviso desaparece solo. |
| Linux con Wayland (`colocacion: 'sistema'`) | Main no puede mover la ventana: «Mover a…», «Cambiar de pantalla…» y «Llevar el reproductor allí» se sustituyen por la instrucción `ses.wayland` como información ([0061](../preguntas/0061-reproductor-en-otra-pantalla-con-wayland.md)). |
| Se cierra la app | Confirmación de la principal (`ses.salir`, spec 02; decisión del usuario en 0059 §4). En Windows y Linux la app sale y la cola se pierde; en macOS, cerrar la ventana principal no sale de la app: la secundaria se cierra y la cola se conserva. |

### Accesibilidad (secundaria)
- La región conserva `rep.aria.region`. Anuncios `aria-live="polite"` solo en hitos: inicio de cada entrada (`rep.aria.inicio`), **inicio de la cuenta** (`rep.cola.aria.cuenta`, una vez, nunca cada segundo), **cambio de candidata** durante la cuenta (`rep.cola.aria.cambio`, una vez por cambio), en espera, fin de la cola, reanudación. Los fallos, `role="alert"`.
- El número de la cuenta y la tarjeta son `aria-hidden` (lo dice el anuncio).
- Orden de tabulación de la franja inferior: el de hoy con [⏭] tras 5↻; en S1/S2/S3/S4, los botones visibles en orden visual. Foco visible con el anillo doble.
- Movimiento reducido: sin anillo ni escala en la cuenta, sin fundido de la tarjeta ni de las franjas.
- Contraste: número, etiqueta y tarjeta en `#FFFFFF` sobre `rgba(0,0,0,0.6)` (≥ 5,7:1 con cualquier fondo, como los controles).

### Microcopy (fase 4, reproductor)
| Clave | Texto |
|---|---|
| `rep.cola.ventana` | Shinobi Karaoke · Reproductor |
| `rep.cola.cerrar` | Cerrar reproductor (tooltip: Cerrar reproductor (Ctrl/Cmd + W)) |
| `rep.cola.siguiente` | Siguiente (tooltip: Siguiente canción (Mayús + N)) |
| `rep.cola.siguiente.no` | No hay canciones a continuación. |
| `rep.cola.reiniciar` | Reiniciar canción (tooltip de ⏮: Reiniciar canción (Inicio)) |
| `rep.cola.cuenta` | Siguiente canción |
| `rep.cola.aContinuacion` | A continuación |
| `rep.cola.empezarYa` | Empezar ya |
| `rep.cola.detener` | Detener cuenta |
| `rep.cola.iniciar` | Iniciar «{título}» |
| `rep.cola.espera` | Enseguida empieza la siguiente canción |
| `rep.cola.fin` | Fin de la cola |
| `rep.cola.fallo` | Esta canción no se puede reproducir ahora. |
| `rep.cola.fallo.fin` | No hay más canciones en la cola. |
| `rep.cola.pasar` | Pasar a la siguiente canción |
| `rep.cola.reanudada` | Reanudada en {mm:ss} |
| `rep.cola.aria.cuenta` | A continuación: «{título}», de {artista}. Empieza en {n} segundos. |
| `rep.cola.aria.cambio` | Cambió la siguiente canción: «{título}», de {artista}. Empieza en {n} segundos. |
| `rep.cola.aria.espera` | En espera. · (con candidata) En espera. A continuación: «{título}». |
| `rep.cola.aria.fin` | Fin de la cola. |
| `rep.cola.aria.reanudada` | Reproducción reanudada en {mm:ss}. |

### Criterios de aceptación de la fase 4 (reproductor)
- P1. Con dos pantallas, abrir el reproductor en la segunda con «Pantalla completa» lo muestra a pantalla completa allí, sin barra superior ni menú propio, y el foco del teclado sigue en la ventana principal. Sin «Pantalla completa», se abre en una ventana en esa pantalla. F y ⛶ alternan sin cortar el audio.
- P2. Durante la sesión suena **un solo** motor: la principal no reproduce audio (comprobación en E2E de que solo la secundaria crea `AudioContext` con fuentes activas). El sonido sale por la salida predeterminada del sistema aunque la imagen esté en otra pantalla.
- P3. Al terminar una canción con pendientes aparece S1 con el fondo de la candidata, el número de la duración configurada (4 por defecto) bajando uno por segundo, el anillo vaciándose y la tarjeta «A continuación» abajo a la derecha con título y artista; al pasar de 1, la candidata empieza con su pantalla de título. Con 3 s y con 10 s configurados, la cuenta dura eso.
- P4. Con movimiento reducido, S1 no tiene anillo ni escala y el número cambia de golpe cada segundo; la tarjeta cambia sin fundido.
- P5. Reordenar durante la cuenta de modo que cambie la candidata actualiza tarjeta y fondo y reinicia la cuenta a la duración completa, con un único anuncio `rep.cola.aria.cambio`; reordenar pendientes posteriores no reinicia ni anuncia nada. Quitar la única pendiente durante la cuenta lleva a S3.
- P6. Eventos duplicados o tardíos (dos «fin» de la misma entrada, un «fin» de una entrada ya sustituida) no producen doble avance ni saltan una pendiente (E2E con eventos inyectados).
- P7. Sin pendientes, al terminar la canción se ve S3 con «Fin de la cola», sin cuenta atrás de cierre; la ventana sigue abierta; añadir una canción empieza S1 con ella como candidata y la duración configurada (4 s por defecto), con un único anuncio `rep.cola.aria.cuenta`; «Detener cuenta» pasa a S2 y «Empezar ya» la empieza al momento; añadir otra durante esa cuenta no la reinicia. En S2 (p. ej. tras «Detener cuenta»), añadir una canción no empieza la cuenta.
- P8. Si la candidata se borra o pierde sus pistas antes de consumirse, no hay cuenta ni avance: S4 con `rep.cola.fallo` y el título; la principal muestra la causa; solo «Pasar a la siguiente canción» avanza, descartando la entrada fallida y empezando la cuenta de la siguiente.
- P9. Con pendientes, cerrar la secundaria por cualquiera de sus vías muestra una sola vez el diálogo de cierre en la ventana donde se pidió (la principal muestra entonces `ses.cierre.esperando`); mientras está abierto la canción sigue sonando y una cuenta en curso queda congelada (el número no cambia en 5 s); «Cancelar» la reanuda desde el mismo número.
- P10. Tras «Cerrar y conservar cola» a mitad de una canción en 02:13, reabrir empieza esa entrada en 02:13 (± 1 s) y en el mismo estado (sonando o en pausa), sin pantalla de título, con el indicador `rep.cola.reanudada`; «Reiniciar canción» la lleva al principio con título y silencio previo y el orden de pendientes no cambia. Con la misma canción dos veces en la cola, solo se reanuda la entrada interrumpida.
- P11. Tras cerrar y conservar durante la cuenta, reabrir muestra S2 con la candidata que se anunciaba y no empieza hasta «Iniciar».
- P12. Esc en la secundaria a pantalla completa la pasa a ventana y nunca cierra la sesión; Ctrl/Cmd + W cierra (con diálogo si hay pendientes).
- P13. Desconectar la pantalla de la secundaria la recoloca en ventana en la pantalla primaria sin cortar el audio ni cambiar la cola; cerrar la secundaria a la fuerza (proceso del renderer terminado) termina la sesión conservando la cola y libera el bloqueo de reposo y el de edición.
- P14. La pantalla del equipo no se apaga en ningún estado de la sesión (incluidos S2 y S3) y vuelve a apagarse según el sistema al terminar la sesión.
- P15. La secundaria no muestra `rep.incompleta` ni toasts; la principal sí recibe sus toasts durante la sesión.
- P16. Capturas en `docs/ux/revisiones/fase-4/` con nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080 y 1280 × 720: `cuenta`, `cuenta-reducido`, `espera`, `espera-vacia`, `fin-cola`, `fallo`, `reanudada`.

## Fase 5 de 0.2.0 — estilo, espera y Letra lista

Origen: [plan, fase 5, features 8, 9 y 12](../versiones/0.2.0/plan-2.md#fase-5--estilo-espera-y-letra-lista) y [0048](../preguntas/0048-escucha-editor-durante-evento.md) (Letra lista). Configuración en el editor: [06 · Fase 5](06-editor.md#fase-5-de-020--estilo-espera-y-letra-lista). Valores de render: [sistema visual · fase 5](sistema-visual.md#020--estilo-espera-y-letra-lista-fase-5). Contratos: [ADR 0018](../adr/0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) y [0101](../preguntas/0101-contratos-de-la-fase-5-para-las-specs.md). Decisiones provisionales: [0100](../preguntas/0100-decisiones-provisionales-de-la-fase-5.md) y [0110](../preguntas/0110-decisiones-provisionales-de-ux-de-la-fase-5.md).

Esta sección **amplía** la spec y vale igual para el reproductor local, la prueba desde el editor, la ventana secundaria y la vista previa del editor (mismo render; la vista previa siempre con barrido). **Sustituye** la fila «Huecos» de la tabla «Letra» (el `●●●` pasa a ser uno de tres indicadores configurables) y amplía la fila «Resaltado» con el modo Letra lista. Controles, atajos, pantalla de título, silencio previo, pantalla final, cola y voz guía no cambian.

### Fondo con degradado y movimiento
- **Formas**: lineal (como hoy), radial y cónico, con el centro y el ángulo del estilo (detalle en 06 · G).
- **Fase del movimiento**: la da **la posición de la canción** (tiempo de audio, sin el desplazamiento de la letra), igual que en la vista previa del editor y en el video: en el mismo instante, la misma fase. Durante el **silencio previo** el tiempo es negativo y el fondo ya se mueve (la fase sigue al reloj, ADR 0018 §2), así que llega a 0:00 en la fase 0. En **pausa** el fondo se queda quieto; al **buscar** (barra, ←/→, J/L, ⏮) salta a la fase del destino. La **pantalla final** se queda en la fase del último instante.
- **Fuera de una canción en curso** (secundaria: cuenta entre canciones S1, en espera S2, fallo S4) el fondo de la candidata se ve **quieto en fase 0**. En «Fin de la cola» (S3) se queda en la fase del final, como la pantalla final.
- **Movimiento reducido** (`prefers-reduced-motion: reduce` del sistema donde se ve la ventana): fase 0 siempre.
- El movimiento se pinta al ritmo de la pantalla, sin afectar al reloj del audio ni al barrido. Si la ventana está oculta puede dejar de pintarse; al volver, la fase es la del tiempo actual.
- Sin elementos de interfaz nuevos.

### Indicadores de espera

**Hueco con barra, cuenta y puntos** (los tres a la vez; cada uno puede faltar sin que nada se mueva)
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬                    │ ← barra (se encoge hacia el centro)
│                                  2                                       │ ← cuenta, centro al 45 % (donde entrará la línea)
│                                 ●●                                       │ ← puntos, posición de siempre
│                         Caught in a landslide                            │ ← siguiente línea, en su posición de espera
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

| Aspecto | Comportamiento |
|---|---|
| **En qué huecos** | Con los indicadores **propios de la canción** o, si no tiene, los del **estilo efectivo** (resueltos al empezar la canción): en cada hueco entre líneas **≥ silencio mínimo**, y en la **primera entrada** si está marcada «Antes de la primera línea» (sin umbral). Sin línea siguiente (tras la última) no hay indicadores. El hueco va del fin efectivo de la línea anterior al inicio de la siguiente (líneas omitidas cuentan como hueco, como hoy); la primera entrada dura **4 s**, desde que desaparece el título hasta el inicio de la primera línea (ADR 0018 §3), y también lleva barra si está activa. |
| **Puntos ●●●** | Sin cambios: tres puntos sobre la línea siguiente que se apagan uno por segundo en los 3 s previos. |
| **Barra** | Aparece al empezar el hueco con el **40 % del ancho** del área, centrada, y se **encoge hacia el centro de forma continua** hasta desaparecer justo en el inicio de la línea siguiente («termina al entrar el siguiente verso»). Grosor `máx(4 px, 0,8 % del alto)`, extremos redondeados, sombra de §10. Su centro está a 0,9 × el tamaño de la línea actual **por encima** del 45 % del alto. |
| **Cuenta 3·2·1** | Ocupa los **últimos 3 s disponibles**: muestra el tiempo que queda redondeado hacia arriba («3» de 3,0 a 2,0 s, «2», «1»). En un hueco de menos de 3 s empieza por el número que corresponda (2,5 s → «3» durante 0,5 s, «2», «1»). Centro al **45 % del alto** (el sitio donde entrará la línea), en la fuente de la canción y al **tamaño de la línea actual**, con la sombra de §10. Cada número entra con fundido y escala 0,9 → 1 en 150 ms; desaparece al instante cuando empieza la línea, que ocupa ese sitio. |
| **Color** | Barra, cuenta y puntos en el **color de lo ya cantado**; en **Letra lista**, en el **color de la letra**. |
| **El texto no se mueve** | Durante el hueco la posición de la línea actual está vacía y la siguiente sigue en su posición de espera. Los indicadores ocupan **posiciones reservadas fijas**: mostrarlos, ocultarlos o combinarlos nunca cambia la posición ni el tamaño de ninguna línea. |
| **Buscar y pausar** | Todo se deriva del tiempo de la canción: al buscar dentro de un hueco aparecen al instante la barra con el ancho de ese momento y el número que toca; en pausa se congelan; al buscar fuera, desaparecen. |
| **Prioridad sobre la interfaz** | Son contenido de la letra (como el barrido), no interfaz: pueden estar en la franja central mientras no se canta. El indicador breve, la etiqueta `rep.original` y las franjas no los tapan (franjas en 0–12 % y 82–100 %). |
| **Movimiento reducido** | Sin fundido ni escala en los números ni en los puntos. La barra sigue encogiéndose de forma continua (es contenido, como el barrido; sistema-visual §4). |
| **Lectores de pantalla** | La letra y los indicadores son `aria-hidden`. Un único anuncio por hueco: al **empezar un hueco entre líneas** que muestra indicadores y dura ≥ 2 s, `rep.espera.aria` con los segundos que faltan (redondeados); también una vez si una búsqueda cae dentro de ese hueco. Nunca cada segundo, ni en la primera entrada (ya está `rep.aria.inicio`), ni al pausar. |

### Modo Letra lista
- **Resaltado**: la línea actual se muestra **entera en el color de la letra** desde su inicio hasta su fin efectivo, **sin barrido ni resaltado por palabra** (también en líneas con tiempos de palabra). La línea siguiente, el tamaño, la posición, la sombra y la transición entre líneas (200 ms; inmediata con movimiento reducido) no cambian, así que la actual se distingue por tamaño y posición.
- Los indicadores de espera usan el color de la letra. El color de lo ya cantado no aparece en ningún momento.
- **Dónde**: reproductor local, ventana secundaria, «Probar a pantalla completa» de una canción Letra lista (06 · LL) y exportación (fase 6). La modalidad se toma **al empezar** la canción o la entrada de la cola (instantánea): cambiarla en el editor mientras suena se ve en la siguiente reproducción.
- No hay ninguna etiqueta para el público. Controles, voz guía, atajos, pantalla final y cola: igual que una Lista.
- Contraste: solo cuenta el de la letra frente al fondo (el editor lo avisa como siempre).

### Estados (fase 5, reproductor)
| Estado | Presentación |
|---|---|
| Hueco con indicadores | Wireframe anterior con los indicadores activos para ese hueco. |
| Hueco sin indicadores (corto o sin elegir) | Como hoy: solo la línea siguiente en espera. |
| Letra lista, cantando | Línea actual uniforme en el color de la letra. |
| Fondo en movimiento, en pausa | Quieto en la fase de ese instante. |
| Movimiento reducido | Fondo en fase 0; números sin animación. |

### Microcopy (fase 5, reproductor)
| Clave | Texto |
|---|---|
| `rep.espera.aria` | La letra sigue en {n} segundos. · (n = 1) La letra sigue en 1 segundo. |

### Criterios de aceptación de la fase 5 (reproductor)
- R1. Un estilo radial y uno cónico se ven en el reproductor igual que en la vista previa del editor en el mismo instante (comparación de la geometría calculada y captura).
- R2. Con movimiento, en el mismo tiempo de canción el reproductor y la vista previa tienen la misma fase (test unitario compartido); en pausa el fondo no cambia en 5 s; al buscar salta a la fase del destino; al llegar a 0:00 tras el silencio previo, el fondo está en fase 0.
- R3. Con movimiento reducido emulado, el reproductor local y la secundaria muestran la fase 0 en todo momento.
- R4. En la secundaria, la cuenta entre canciones y la espera muestran el fondo de la candidata quieto en fase 0.
- R5. Las cajas de la línea siguiente y de la línea actual tienen las mismas coordenadas con 0, 1, 2 y 3 indicadores activos (test geométrico del render en un hueco y en el instante de entrada).
- R6. En un hueco de 8 s entre líneas (umbral 4 s, barra activa), la barra mide el 40 % del ancho al empezar, el 20 % a los 4 s y 0 en el inicio de la siguiente (test del modelo de render ± 1 px); en la primera entrada empieza al terminar la pantalla de título.
- R7. Con la cuenta activa, en un hueco de 8 s no hay número hasta 3 s antes; luego «3», «2», «1» cambian en los segundos enteros y desaparecen en el inicio de la línea; en un hueco propio de 2,5 s se ve «3» durante 0,5 s.
- R8. Tras la última línea no hay indicadores; un hueco < umbral no muestra ninguno; con «Antes de la primera línea» desmarcada, la primera entrada tampoco. Buscar dentro de un hueco muestra al instante el estado correcto y en pausa se congela.
- R9. Una canción de 0.1.0 se ve exactamente igual que antes: `●●●` antes de la primera línea y en huecos ≥ 4 s, sin barra ni cuenta (test de regresión del modelo de render).
- R10. Con movimiento reducido, los números y los puntos cambian sin fundido ni escala y la barra sigue encogiéndose.
- R11. Al empezar un hueco de 8 s con indicadores (cambio de `clave` del fotograma al empezar la espera; los cambios por dígito no se anuncian) se anuncia una vez `rep.espera.aria` («La letra sigue en 8 segundos.»); no hay anuncios por segundo, en la primera entrada ni al pausar.
- R12. En una canción Letra lista, durante una línea (también con tiempos de palabra) ningún píxel de la letra tiene el color de lo ya cantado (captura a mitad de línea) y los indicadores usan el color de la letra; en la misma canción, la vista previa del editor sí muestra el barrido.
- R13. Una Letra lista se reproduce desde la Biblioteca, entra en la cola y se reproduce sin barrido en la secundaria; la modalidad se fija al empezar la reproducción. Con el reproductor abierto en otra pantalla no se puede cambiar (la edición está bloqueada: `EDICION_BLOQUEADA`); con el reproductor local, un cambio hecho después solo afecta a la siguiente reproducción.
- R14. Capturas en `docs/ux/revisiones/0.2.0-fase-5/` con nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080 y 1280 × 720: `hueco-tres-indicadores`, `hueco-cuenta`, `hueco-barra`, `letra-lista`, `fondo-radial`, `fondo-conico`.

**Verificación manual** (guía de la fase 5): legibilidad de la cuenta y la barra a 5 m en una TV de 55" y en un proyector, con fondos degradados claros y oscuros; sensación de las velocidades del movimiento y que no maree; el movimiento fluido en la secundaria de un equipo modesto con dos pantallas; que la Letra lista se lea bien sin barrido en una canción rápida.

## Fase 8 de 0.2.1 — sin palabras importadas ni desplazamiento, y barra de carga

Origen: [plan 0.2.1, fases 8 y 9](../versiones/0.2.1/plan-3.md#fase-8--sincronía-y-editor-más-simples) y palabras del usuario: «la barra no debería ser encogida al centro sino ser una barra de carga con los colores de letra, tanto de contraste de barrido como el otro». Editor: [06 · Fase 8](06-editor.md#fase-8-de-021--sincronía-y-editor-más-simples) y [06 · Fase 9](06-editor.md#fase-9-de-021--editor-preciso-de-línea). Valores: [sistema visual · 0.2.1](sistema-visual.md#021--sincronía-editor-preciso-y-barra-de-carga-fases-8-y-9). Vale igual para el reproductor local, la prueba desde el editor, la ventana secundaria, la vista previa del editor y el video ([10](10-exportacion.md), mismo render).

**Sustituye**: la fila «Resaltado» de «Letra»; la fila «, / .» de «Atajos de teclado»; la viñeta «Desplazamiento» de «Prueba desde el editor» y la frase «(1 s para el desplazamiento)» de «Indicador breve»; la frase del historial de deshacer «(más el paso del desplazamiento, si lo hubo)»; la fila «Barra» de «Indicadores de espera» (fase 5) y su mención «se encoge hacia el centro» del wireframe; la frase «Los tiempos de palabras importadas se mantienen…» de la primera fase de 0.2.0 (ahora, «los tiempos por palabra hechos a mano»); los criterios 9, 14 (desplazamiento), 29, 30 (paso del desplazamiento), R6 y R10.

### Resaltado
- **Por palabra** solo si la línea tiene tiempos por palabra **hechos a mano** en el editor preciso (06 · Fase 9): cada palabra se llena entre su inicio y su fin, el barrido espera entre palabras y el espacio que sigue a una palabra se pinta al empezar la siguiente.
- En cualquier otro caso, **también con palabras importadas** (LRCLIB, LRC mejorado), barrido progresivo entre el inicio y el fin efectivo de la línea. Las palabras importadas tampoco cuentan para el fin automático ([0145](../preguntas/0145-contratos-de-las-fases-8-y-9-para-las-specs.md) §1).
- En **Letra lista**, sin barrido (sin cambios).

### Prueba desde el editor sin desplazamiento
- **,** y **.** no hacen nada en el reproductor (tampoco desde el editor). Se retiran el indicador `rep.offset` y la fila del diálogo de atajos. Los cambios de la prueba ya no crean ningún paso de deshacer.
- `letra.offset_ms` se sigue aplicando a la letra como siempre (decisión D3).

### Barra de espera como barra de carga

```
│                                                                          │
│                ▕██████████████░░░░░░░░░░░░░░░░░░░░░░▏                    │ ← barra de carga (ancho fijo)
│                                  2                                       │    relleno: color de lo ya cantado
│                                 ●●                                       │    pista: color de la letra
│                         Caught in a landslide                            │
```

| Aspecto | Comportamiento |
|---|---|
| **Forma** | Barra de **ancho fijo**: una **pista** con el color de la letra y un **relleno** con el color de lo ya cantado que crece **de izquierda a derecha**, de 0 al empezar el hueco hasta el 100 % justo en el inicio de la línea siguiente («avanza hasta la entrada del verso»). Avance lineal con el tiempo de la canción, como el barrido. |
| **Tamaño y posición** | Ancho **40 % del ancho del área**, centrada (el mismo ancho con el que empezaba la barra anterior). Grosor `máx(6 px, 1 % del alto)` (≈ 11 px en 1080p; antes `máx(4 px, 0,8 %)`, más fina porque no tenía pista). Extremos redondeados (pista y relleno). Misma posición reservada: centro a `45 % − 0,9 × S`. La sombra de §10 se aplica a la pista. |
| **Aparece y desaparece** | Aparece al empezar el hueco con el relleno a 0 y desaparece al instante en el inicio de la línea. En la **primera entrada** empieza al terminar la pantalla de título (4 s antes de la primera línea). |
| **Buscar, pausar** | Derivada del tiempo: al buscar dentro de un hueco aparece con el relleno de ese instante; en pausa se congela. |
| **Letra lista** | Pista con el **color de la letra al 35 % de opacidad** y relleno con el **color de la letra** al 100 % **(decisión provisional, [0147](../preguntas/0147-decisiones-provisionales-de-ux-de-0-2-1.md) §8)**. Justificación: en Letra lista el color de lo ya cantado no aparece en ningún momento (fase 5); el mismo color con dos intensidades conserva la lectura de «barra que se llena» y el relleno, que es lo que informa, tiene el contraste de la letra. En el editor la vista previa sigue usando los colores de karaoke (06 · 8.7). |
| **Movimiento reducido** | Sin cambios: el relleno avanza de forma continua (es contenido, como el barrido; sistema-visual §4). No hay animaciones de entrada ni salida. |
| **Coherencia** | Una sola función de render para editor, reproductor, secundaria y video: en el mismo instante del mismo hueco, la barra tiene el mismo ancho de relleno relativo en todos (± 1 px a la misma resolución). |
| **Contraste** | Los cubre el aviso de contraste existente: la pista con «Letra vs fondo», el relleno con «Resaltado vs fondo» y su diferencia con «Resaltado vs letra» (ΔE ≥ 25). En Letra lista, solo cuenta el de la letra. Sin avisos nuevos. |

### Criterios de aceptación de la fase 8 (reproductor)
- R8-1. Una línea con palabras importadas (Final Ruin) se pinta con barrido progresivo entre su inicio y su fin efectivo en el reproductor local, la secundaria y el video (test del modelo de render), y una con palabras hechas a mano se pinta palabra a palabra con sus tiempos.
- R8-2. Con el reproductor abierto desde el editor, `,` y `.` no cambian nada ni muestran indicador; el diálogo de atajos no tiene esa fila; al volver, el historial de deshacer del editor no tiene pasos nuevos.
- R8-3. En un hueco de 8 s entre líneas (umbral 4 s, barra activa), la pista mide el 40 % del ancho durante todo el hueco y el relleno mide 0 al empezar, el 50 % de la pista a los 4 s y el 100 % en el inicio de la línea siguiente, creciendo desde el borde izquierdo (test del modelo de render ± 1 px); en la primera entrada empieza al terminar la pantalla de título. Sustituye a R6.
- R8-4. La pista usa `letra.color` y el relleno `color_resaltado`; en Letra lista, la pista es `letra.color` al 35 % y el relleno `letra.color`, y ningún píxel tiene `color_resaltado` (captura a mitad de un hueco).
- R8-5. Con movimiento reducido emulado, el relleno sigue avanzando de forma continua. Sustituye a R10 en lo que se refiere a la barra.
- R8-6. En el mismo tiempo de canción, la vista previa del editor, el reproductor y un fotograma exportado dan el mismo modelo de barra (pista, relleno y posición relativos; test compartido).
- R8-7. Capturas en `docs/ux/revisiones/0.2.1-fase-8/` con nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080 y 1280 × 720: `barra-carga-inicio`, `barra-carga-mitad`, `barra-carga-letra-lista`, `palabras-importadas-progresivo`.

**Verificación manual** (guía de 0.2.1): la barra de carga se entiende a 5 m en una TV de 55" con fondos claros y oscuros y con un tema de colores parecidos; en Letra lista se distingue el relleno de la pista.

## 0.2.2 · Feature 1 — Letra en pantalla con varios enunciados

Origen: [plan 0.2.2, feature 1](../versiones/0.2.2/plan-4.md#feature-1--letra-en-pantalla-con-varios-enunciados-propuesta-018), [propuesta 018](../propuestas/018-letra-en-pantalla-con-varios-enunciados.md) y [exploración](../versiones/0.2.2/exploracion/letra-en-pantalla.md) (datos medidos, referentes y alternativas descartadas). Las once decisiones del plan se aplican **por defecto** y son **provisionales** hasta que el usuario las vea ([0155](../preguntas/0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md)). Configuración en el editor: [06 · Feature 1](06-editor.md#022--feature-1--letra-en-pantalla). Valores: [sistema visual · Feature 1](sistema-visual.md#022--feature-1--letra-en-pantalla). Video: [10 · Feature 1](10-exportacion.md#022--feature-1--letra-en-pantalla-en-el-video). Contratos técnicos (esquema, modelo de render, gris y suelo de contraste): [ADR 0022](../adr/0022-letra-en-pantalla-varias-lineas-y-subrayado-de-lo-cantado.md), que responde a [0156](../preguntas/0156-contratos-de-las-features-1-a-3-de-0-2-2-para-las-specs.md) §1–§13.

Vale igual para el reproductor local, la prueba desde el editor, la ventana secundaria, la vista previa del editor y el video (un solo modelo de render, función pura del tiempo de la canción).

**Sustituye**: las filas «Línea actual + siguiente», «Cambio de línea» y la frase «la línea actual desaparece y queda solo la siguiente» de «Letra»; «Máximo 2 líneas visibles (actual + siguiente) para que el ojo no busque» de «Legibilidad a distancia»; «sin transición entre líneas» de «Accesibilidad» (ver «Movimiento reducido»); el criterio 8 (número de líneas); en la primera fase de 0.2.0, «en 00:15.80 desaparece la actual» (ahora empieza su salida hacia el puesto de la línea ya cantada); en la fase 5, las posiciones «al 45 % del alto» de la barra y la cuenta (ahora **relativas al centro de la línea activa**), la fila «El texto no se mueve» (se precisa abajo) y el criterio R9 en lo que toca al número de líneas; en «Modo Letra lista», «la transición entre líneas (200 ms)». Controles, atajos, pantalla de título, silencio previo, pantalla final, cola, voz guía y las reglas de cuándo sale cada indicador de espera **no cambian**.

### Conceptos

| Término | Definición |
|---|---|
| **Línea** | Un enunciado de la letra (`tipo: "linea"`) con inicio. Ocupa uno o dos renglones en pantalla. Las líneas sin inicio y las pausas (♪) no cuentan: no ocupan puesto. |
| **Activa** | La línea que suena: desde su inicio hasta su fin efectivo. |
| **Futuras** | Las siguientes líneas con inicio, en orden. |
| **Ya cantada** (pasada) | Una línea cuyo fin efectivo ya pasó y que sigue a la vista, encima de la activa. |
| **Puesto** | Lugar de una línea respecto a la activa: 0 = activa; +1, +2… = futuras, hacia abajo; −1, −2 = ya cantadas, hacia arriba. |
| `S` | Tamaño de la línea activa: `máx(32 px, 7,5 % del alto)`, como hasta ahora. **No cambia con el número de líneas.** |
| `N`, `P`, `F` | Líneas a la vez (2–7), líneas ya cantadas (0–2) y futuras: `F = N − 1 − P`. |
| **Ancla** | Altura fija del centro de la línea activa para una configuración. No cambia en toda la canción. |
| **Hueco** | Tiempo entre el fin efectivo de una línea y el inicio de la siguiente. |
| `D` | Duración nominal del cambio de línea: 350 ms («Desplazamiento»), 250 ms («Fundido») o 0 («Sin animación» y movimiento reducido). |

### Configuración que usa

El bloque **«Letra en pantalla»** del estilo, resuelto al empezar la canción o la entrada de la cola (instantánea), con la misma precedencia que los indicadores de espera: el propio de la canción si lo tiene y, si no, el del estilo efectivo.

| Dato | Valores | Si falta el dato |
|---|---|---|
| Líneas a la vez (`N`) | 2, 3, 4, 5, 6, 7 | **5** |
| Líneas ya cantadas | 0, 1, 2 | **1** |
| Cambio de línea | Desplazamiento · Fundido · Sin animación | **Desplazamiento** |

- **Líneas ya cantadas efectivas** (`P`): `mín(elegidas, máximo para N)`; el máximo es 0 con 2 o 3 líneas, 1 con 4 o 5 y 2 con 6 o 7.
- **Bibliotecas y temas existentes**: no tienen el dato, así que se ven con 5 líneas, 1 ya cantada y desplazamiento desde que se instala 0.2.2, **sin reescribir ningún archivo** (decisión provisional 2). Para volver al aspecto de 0.2.1 se elige «2» en el tema.
- Con **2 líneas** y «Sin animación», el fotograma es el de 0.2.1: activa al 45 % y siguiente al 70 %.
- **Volver a 0.2.1**: una canción o un tema de 0.2.2 se abre en 0.2.1 con 2 líneas; si 0.2.1 lo vuelve a guardar, pierde estos ajustes y al regresar a 0.2.2 se ve con los predeterminados (ADR 0022 §1). Se avisa en las notas de la versión.

### Wireframes

**Predeterminado: 5 líneas, 1 ya cantada, a mitad de una línea**
```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                                                                          │
│                     y la ciudad se queda sin voz                         │ ← −1 ya cantada: 60 %, gris
│                                                                          │
│              ████████████████░░░░░░░░░░░░░░░░░                           │
│              Guardo en la manga un verso doblado                         │ ← 0 activa: S, centro al 39,3 %
│                                                                          │
│                  que nadie sabe de dónde llegó                           │ ← +1: 70 %
│                   Paso a paso, sin hacer ruido                           │ ← +2: 60 %, más tenue
│                   cruzo la noche de puntillas                            │ ← +3: 60 %, más tenue
│                                                                          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

**Pausa larga con los tres indicadores** (la línea ya cantada se retiró a los 2 s)
```
│                                                                          │
│                ▕██████████████░░░░░░░░░░░░░░░░░░░░░░▏                    │ ← barra: ancla − 0,9 × S
│                                  2                                       │ ← cuenta: en el ancla (puesto de la activa, vacío)
│                                 ●●                                       │ ← puntos: sobre la línea +1
│                  que nadie sabe de dónde llegó                           │ ← +1
│                   Paso a paso, sin hacer ruido                           │ ← +2
│                   cruzo la noche de puntillas                            │ ← +3
```

**2 líneas** (aspecto de 0.2.1)
```
│                 ███████████████░░░░░░░░░░░░░░░                           │
│                 Is this the real life? Is this just                      │ ← activa, centro al 45 %
│                     Caught in a landslide                                │ ← +1: 70 %
```

### Puestos y ancla

Tamaño, opacidad y color de cada puesto: [sistema visual · Feature 1](sistema-visual.md#022--feature-1--letra-en-pantalla). Resumen: la activa a `S` y al 100 %; la +1 al 70 % de `S` y al 100 % (como hoy); las demás futuras al 60 % de `S`, cada vez más tenues; las ya cantadas al 60 % de `S`, en gris.

| N | Sin ya cantadas (P = 0) | 1 ya cantada | 2 ya cantadas |
|---|---|---|---|
| 2 | activa + 1 futura · ancla al **45,0 %** | no disponible | no disponible |
| 3 | activa + 2 futuras · 38,0 % | no disponible | no disponible |
| 4 | activa + 3 futuras · 34,3 % | 1 + activa + 2 futuras · 42,9 % | no disponible |
| **5** | activa + 4 futuras · 30,7 % | **1 + activa + 3 futuras · 39,3 %** (predeterminado) | no disponible |
| 6 | activa + 5 futuras · 27,1 % | 1 + activa + 4 futuras · 35,6 % | 2 + activa + 3 futuras · 42,9 % |
| 7 | activa + 6 futuras · 23,4 % | 1 + activa + 5 futuras · 32,0 % | 2 + activa + 4 futuras · 39,3 % |

- El ancla se calcula para que el bloque, con todas las líneas de un renglón, quede centrado en el 47 % del alto (fórmula en el sistema visual). Con 2 líneas se conserva el 45 % de siempre.
- La línea activa **no se mueve de altura** en toda la canción: ni al cambiar de línea, ni al vaciarse los puestos futuros al final, ni con líneas de dos renglones.
- El bloque mayor (7 líneas) ocupa del 18 % al 76 % del alto con líneas de un renglón: fuera de las franjas de controles (0–12 % y 82–100 %). La regla «ningún elemento de interfaz entre el 25 % y el 75 %» no cambia (la letra no es interfaz). Con los controles visibles, una franja puede tapar una línea lejana durante 3 s; se acepta.

### Línea ya cantada

| Aspecto | Comportamiento |
|---|---|
| **Cuándo existe** | Con `P ≥ 1`. Una línea pasa a ya cantada al **salir** (ver «Cambio de línea»): sube al puesto −1, encoge al 60 % y pierde el color. |
| **Color** | **Gris de la letra**: el gris neutro con la misma luminancia que el color de letra del estilo (sistema visual), al 55 % de opacidad (40 % en el puesto −2). Con letra blanca es blanco al 55 %. |
| **De qué color parte** | Del color de lo ya cantado (la línea termina barrida entera) y se funde a gris durante la salida. En Letra lista, del color de la letra a gris. |
| **Contraste** | Mínimo 3:1 contra el peor punto del fondo (suelo de contraste del sistema visual). No se exige distinguirla por color de las futuras: se distingue por su posición, encima de la activa. Sin avisos nuevos. |
| **Retirada** | Si tras su fin pasan **2 s** sin que empiece otra línea, todas las ya cantadas se funden en su sitio durante 400 ms y desaparecen. **No vuelven** al acabar la pausa: tras un hueco de más de 2 s solo pueden ser ya cantadas las líneas posteriores a ese hueco. |
| **Sin ya cantadas** (`P = 0`) | Al salir, la línea sube hacia el puesto −1 y se funde hasta desaparecer (antes desaparecía de golpe). |
| **Con 2** | La anterior pasa de −1 a −2 (40 %) y la que estaba en −2 sube un puesto más y se funde. |

### Cambio de línea

Cada línea produce dos sucesos, conocidos de antemano:

| Suceso | Instante | Qué mueve |
|---|---|---|
| **Entrada** de una línea | Su inicio | Las futuras suben un puesto: la +1 pasa a activa (crece del 70 % al 100 %), las demás de +k a +k−1 y aparece una nueva por abajo. |
| **Salida** de una línea | Su fin efectivo | La activa pasa a −1 (encoge al 60 % y se vuelve gris). Las ya cantadas suben un puesto y la más antigua se funde. |

Según el hueco entre el fin de una línea y el inicio de la siguiente:

| Caso | Condición | Qué se ve |
|---|---|---|
| **Relevo** (el más frecuente: 2 de cada 3 cambios en las canciones de referencia, ADR 0022) | Hueco **menor que `D`** | **Un solo movimiento** del bloque entero, en el inicio de la línea siguiente. La línea que acaba espera en su sitio, barrida entera, ese instante (menos de 350 ms). |
| **Dos tiempos** (decisión provisional 7) | Hueco **igual o mayor que `D`**, o no hay línea siguiente | Al acabar la línea, sale (sube y se apaga) y el puesto de la activa queda libre; al empezar la siguiente, sube el resto. Es el fin de línea visible de 0.2.0. |

**Duración**
- **Entrada y relevo**: `mín(D, 60 % de la duración de la línea que entra)`, contando su duración de inicio a fin efectivo. Si queda **por debajo de 120 ms, el cambio es instantáneo**. Así el movimiento termina siempre antes de que esa línea acabe, y dos cambios nunca se solapan ni se acumulan en cola. Ejemplos: una línea de 0,27 s entra en 162 ms; una de 15 ms (dato de sincronía defectuoso) cambia al instante.
- **Salida en dos tiempos**: `D` completa (el hueco es al menos `D`, así que termina antes de la entrada siguiente).
- **Curva** (los dos tipos): desaceleración cúbica, `1 − (1 − x)³`, sin rebote: recorre el 78 % del camino en el primer 40 % del tiempo.

**Tipos**

| Tipo | Qué se ve | `D` |
|---|---|---|
| **Desplazamiento** (predeterminado) | Cada línea viaja de forma continua de su puesto al siguiente: posición, tamaño, opacidad y color se interpolan con la curva. La línea que entra por abajo llega desde el puesto siguiente al último con opacidad 0. | 350 ms |
| **Fundido** | Nadie viaja. En cada puesto, la línea que lo deja se funde mientras sube 0,3 × `S`, y la que llega aparece desde 0,3 × `S` más abajo, ya con el tamaño y el color de su puesto nuevo. Va mejor en canciones rápidas, para quien se marea con desplazamientos largos y en video a 24–30 FPS. | 250 ms |
| **Sin animación** | Los puestos cambian al instante. Es también lo que se ve con movimiento reducido. | 0 |

- El **barrido** avanza con su reloj de siempre mientras la línea entra: es del texto y viaja con él. En «Fundido», el barrido se ve en la copia que llega al puesto de la activa.
- Durante un cambio puede haber **una línea más** que `N` a la vista (la que entra por abajo y la que sale por arriba). En reposo, nunca más de `N`.

**Casos límite** (iguales para los tres tipos)

| Caso | Comportamiento |
|---|---|
| **Buscar** (barra, ←/→, J/L, ⏮) | Se pinta el estado del instante de destino. **El salto no se anima.** Si el destino cae dentro de un cambio de línea, se ve en ese punto y continúa. Buscar a un instante pinta lo mismo que llegar a él reproduciendo. |
| **Pausa** | La letra se congela en el fotograma exacto, también a mitad de un cambio. |
| **Reanudar** | Continúa desde ese mismo punto, sin reiniciar la animación. |
| **Movimiento reducido** | Como «Sin animación»: puestos al instante, también la retirada de las ya cantadas y la aparición del bloque. Se conservan puestos, tamaños, opacidades y el gris (son estados, no movimiento). El barrido y la barra de espera siguen avanzando (son contenido). |
| **Cambio de tamaño de la ventana** | Se recalculan renglones y puestos y se pinta el instante actual. |
| **Últimas líneas** | Los puestos futuros se van quedando vacíos; el ancla no cambia. |
| **Líneas sin inicio** (lista incompleta) | No ocupan puesto: las futuras son las siguientes líneas con inicio. |

### Líneas de dos renglones y recorte

- Los renglones de cada línea se calculan **una vez, a tamaño `S`**, con la regla de siempre (88 % del ancho, máximo 2 renglones equilibrados y, si no cabe, reducción hasta el 75 %). En los demás puestos la línea es **esa misma forma reducida** al 70 % o al 60 % (decisión provisional 9).
- Consecuencia: una línea de dos renglones ocupa dos renglones pequeños también como futura o ya cantada, aunque reducida cabría en uno. A cambio, **no se recoloca ninguna palabra** en toda su vida y el barrido por renglón de 0.2.0 no cambia.
- El bloque crece desde la activa: una línea de dos renglones por debajo empuja hacia abajo a las siguientes; una por encima, hacia arriba; la activa crece la mitad hacia cada lado y su centro no se mueve.
- **Recorte**: una futura cuyo borde inferior pase del **86 % del alto** no se dibuja (ni las que van detrás); una ya cantada cuyo borde superior quede por encima del **10 %**, tampoco. **Nunca se dibuja una línea cortada.** Una línea que deja de caber o vuelve a caber se funde con el cambio de línea que lo provoca.

### Convivencia con lo existente

| Con | Comportamiento |
|---|---|
| **Indicadores de espera** | Mismas posiciones reservadas, ahora **relativas al ancla**: barra a 0,9 × `S` por encima, cuenta en el puesto de la activa, puntos sobre la línea +1. La separación de 0,6 × `S` a cada lado de la activa garantiza que la barra no toque la línea ya cantada ni los puntos toquen la +1. Mostrar u ocultar indicadores no mueve ninguna línea. Con 2 líneas todo queda donde estaba. |
| **Indicadores y salida de la línea** | Durante la salida en dos tiempos, los indicadores del hueco **aparecen con el avance de esa salida** (su opacidad sigue la misma curva), para que la línea que sube no cruce la barra. Su contenido (relleno de la barra, número) sigue el tiempo como siempre. Con `D = 0` aparecen al instante. |
| **Primera entrada** | Pantalla de título hasta 4 s antes de la primera línea, como hoy. Después: puesto de la activa libre (ahí van los indicadores) y las futuras +1…+F ya a la vista. El bloque aparece con un fundido de 250 ms (instantáneo con `D = 0`). El silencio previo no cambia. |
| **Pausas largas** (decisión provisional 8) | Indicadores en sus sitios y **todas las futuras a la vista** durante el hueco: se puede leer la estrofa que viene. La línea ya cantada se retira a los 2 s, haya o no indicadores. |
| **Pausas (♪)** | Siguen sin dibujarse: solo cuentan como hueco. |
| **Final de canción** | La última línea sale, pasa a ya cantada y a los 2 s se retira: quedan el fondo y, al acabar el audio, la pantalla final (sin cambios). |
| **Letra lista** | Sin color de lo ya cantado en ningún momento, tampoco durante un cambio: la activa se distingue por tamaño, puesto y opacidad; la ya cantada, por gris, tamaño y puesto. El paso a gris es aquí la única señal de avance. Indicadores en el color de la letra, como hoy. |
| **Barrido palabra a palabra** (0.2.1) | Sin cambios y solo en la activa. Una futura no tiene barrido; una ya cantada no lo necesita. |
| **4:3** | Mismas reglas. Hay más líneas de dos renglones (≈ 1 de cada 3 frente a 1 de cada 9), así que el recorte actúa más con 6 y 7 líneas. |
| **Ventana secundaria y cola** | Nada nuevo: la configuración viaja en el estilo de la instantánea de cada entrada. La cuenta entre canciones, la espera y la tarjeta «A continuación» no cambian. |
| **Modo ventana (⛶ / F)** | Las proporciones se calculan sobre el alto de la ventana, como hoy. |

### Legibilidad a distancia (TV de 55", 68,5 cm de alto de imagen, a 5 m)

| Puesto | Cuerpo | Altura de mayúscula | Relación con 5 m | Lectura |
|---|---|---|---|---|
| Activa | 5,1 cm | 3,6 cm | 1/139 | Cumple la regla de 1/150, como hoy, con cualquier `N` (decisión provisional 10). |
| +1 (70 %) | 3,6 cm | 2,5 cm | 1/200 | Legible para anticipar, como hoy. |
| Resto (60 %) | 3,1 cm | 2,2 cm | 1/232 | Se lee con algo de esfuerzo a 5 m y con comodidad a 3–4 m. Es contexto: reconocer la estrofa, no leerla palabra a palabra. |

La línea que se canta no se lee peor con 7 líneas; lo que aumenta es el ruido visual. Por eso el predeterminado es 5.

### Estados (feature 1, reproductor)

| Estado | Presentación |
|---|---|
| Cantando una línea | Activa en el ancla con su barrido; ya cantadas arriba y futuras abajo, según `N` y `P`. |
| Cambio de línea en curso | Bloque en movimiento o fundido, según el tipo. |
| Hueco menor que `D` | La línea que acaba espera en su sitio hasta el relevo. |
| Hueco de `D` a 2 s | Puesto de la activa libre; ya cantada arriba; futuras abajo. |
| Hueco de más de 2 s | Como el anterior, sin ya cantadas; indicadores si tocan. |
| Antes de la primera línea (tras el título) | Puesto de la activa libre; futuras a la vista; indicadores si tocan. |
| Tras la última línea | Ya cantada 2 s; luego solo el fondo. |
| En pausa | Fotograma congelado, también a mitad de un cambio. |
| Movimiento reducido o «Sin animación» | Los mismos puestos, sin interpolaciones. |
| Letra lista | Igual, sin color de lo ya cantado. |

### Accesibilidad (feature 1, reproductor)

- La letra sigue siendo `aria-hidden`; no hay anuncios nuevos. `rep.espera.aria` no cambia.
- **Movimiento reducido** (`prefers-reduced-motion: reduce` del sistema donde se ve la ventana): ninguna interpolación de posición, tamaño ni opacidad entre puestos. Además, quien no quiera reducir todo el movimiento del sistema puede elegir «Fundido» (recorrido corto) o «Sin animación» en el tema.
- La letra no rebota ni se desenfoca. Ningún movimiento dura más de 400 ms ni parpadea.
- El estado de una línea nunca depende solo del color: activa, futura y ya cantada se distinguen por **puesto y tamaño**.
- Contraste: las líneas atenuadas mantienen 3:1 siempre que la letra lo tenga al 100 %; si no, lo dice el aviso de contraste de siempre en el editor.

### Microcopy (feature 1, reproductor)

Sin textos nuevos en el reproductor. Los del panel Estilo están en [06 · Feature 1](06-editor.md#microcopy-feature-1-editor).

### Criterios de aceptación de la feature 1 (reproductor)

**Puestos**
- F1-R1. Con «Líneas a la vez» de 2 a 7, en reposo (a mitad de una línea y a mitad de un hueco) se dibujan como máximo `N` líneas; durante un cambio de línea, como máximo `N + 1` (test del modelo de render).
- F1-R2. Con 2 líneas y «Sin animación», el modelo del fotograma coincide con el de 0.2.1: activa con su centro al 45 % y siguiente al 70 % (test de regresión del modelo).
- F1-R3. Para cada combinación de la tabla «Puestos y ancla», el centro de la activa está en el porcentaje indicado ± 0,5 % del alto y es el mismo en todos los instantes de la canción (test geométrico a 1920 × 1080 y 1280 × 720, con líneas de uno y de dos renglones).
- F1-R4. La línea activa mide el 7,5 % del alto con cualquier `N`; la +1 mide el 70 % de la activa y las demás el 60 %.
- F1-R5. Una canción sin el bloque «Letra en pantalla» (biblioteca de 0.2.1) se reproduce con 5 líneas, 1 ya cantada y desplazamiento, y abrirla o reproducirla no reescribe `cancion.json` ni `temas.json`.

**Línea ya cantada**
- F1-R6. Con 1 ya cantada, al salir una línea pasa al puesto −1 al 60 % de tamaño, con el gris de la letra y el 55 % de opacidad (o la del suelo de contraste, si es mayor). Con 2, la anterior pasa a −2 al 40 %. Con 0, la línea que sale no queda a la vista al terminar la salida.
- F1-R7. Con «2» elegido y 5 líneas, se ve 1 ya cantada; con 3 líneas, ninguna (test del modelo con el valor efectivo).
- F1-R8. En un hueco de 8 s, las ya cantadas están a la vista hasta 2,0 s después del fin de la línea y han desaparecido a los 2,4 s; al entrar la línea siguiente no reaparecen, y cuando esa línea sale es la única ya cantada aunque `P = 2`.
- F1-R9. Tras la última línea no queda ninguna línea en pantalla 2,4 s después de su fin.

**Cambio de línea**
- F1-R10. «Desplazamiento»: a mitad de un relevo de 350 ms (t = 175 ms), el centro, la escala, la opacidad y el color de cada línea son los interpolados entre sus dos puestos con `1 − (1 − x)³` (test del modelo, ± 1 px a 1080p).
- F1-R11. «Fundido»: durante el cambio ninguna línea se dibuja a más de 0,3 × `S` del centro de un puesto entero, y la duración nominal es 250 ms.
- F1-R12. Con un hueco de 100 ms entre dos líneas hay un solo movimiento, que empieza en el inicio de la segunda; con un hueco de 1,3 s, la primera sale en su fin efectivo, el puesto de la activa queda libre y la segunda entra en su inicio (test del modelo con las líneas 00:12.40–00:15.80 y 00:17.10–00:20.30).
- F1-R13. Una línea de 0,27 s entra en 162 ms; una de 0,15 s y una de 15 ms cambian al instante; en una secuencia de diez líneas de 0,3 s no hay ningún salto de posición entre fotogramas consecutivos mayor que el de la curva (test del modelo a 60 FPS).
- F1-R14. Buscar a cualquier instante pinta el mismo modelo que llegar a él reproduciendo (función pura del tiempo: test con 50 instantes al azar, incluidos instantes dentro de un cambio). El salto no produce animación.
- F1-R15. En pausa a mitad de un cambio, la letra queda congelada (dos fotogramas separados 1 s son iguales); al reanudar continúa desde el mismo avance.
- F1-R16. Con movimiento reducido emulado no hay ninguna interpolación de posición, tamaño ni opacidad entre puestos (ni en la retirada ni en la aparición del bloque); la línea ya cantada sigue viéndose en gris; el barrido y la barra de espera siguen avanzando.

**Dos renglones y recorte**
- F1-R17. Una línea de 60 caracteres tiene los mismos cortes de renglón en todos los puestos por los que pasa, a 16:9 y a 4:3.
- F1-R18. Ninguna línea se dibuja cortada: con 7 líneas en 4:3 y líneas de dos renglones, la futura cuya caja pasa del 86 % del alto no se dibuja, ni las siguientes; lo mismo por encima del 10 %.

**Convivencia**
- F1-R19. En un hueco de 8 s con indicadores, la barra, la cuenta y los puntos tienen las mismas coordenadas relativas al ancla con 0, 1, 2 y 3 indicadores activos y con cualquier `N` y `P`; no solapan ninguna línea en reposo; las futuras están a la vista durante todo el hueco. Amplía R5.
- F1-R20. Las reglas de cuándo sale cada indicador (umbral, primera entrada, últimos 3 s de la cuenta, relleno de la barra) dan el mismo resultado que en 0.2.1 para la misma canción (tests R7, R8 y R8-3 sin cambios en sus valores, con las posiciones referidas al ancla).
- F1-R21. En Letra lista ningún píxel de la letra tiene el color de lo ya cantado, tampoco a mitad de la salida de una línea (captura) ni en ningún tipo de cambio.
- F1-R22. El barrido palabra a palabra de una línea con tiempos hechos a mano avanza igual que en 0.2.1 mientras la línea entra (mismo ancho pintado relativo para el mismo tiempo).
- F1-R23. La vista previa del editor, el reproductor, la ventana secundaria y un fotograma exportado dan el mismo modelo en el mismo instante, también a mitad de un cambio de línea (test compartido).
- F1-R24. Con el fondo `#F2E8D5` y letra `#111111`, y con el tema «Shinobi», cada puesto atenuado tiene contraste ≥ 3:1 contra el peor punto del fondo (test del suelo de contraste).
- F1-R25. Capturas en `docs/ux/revisiones/0.2.2-feature-1/` con nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080 y 1280 × 720: `cinco-lineas`, `siete-lineas-dos-cantadas`, `dos-lineas`, `cambio-desplazamiento-mitad`, `cambio-fundido-mitad`, `pausa-larga-indicadores`, `dos-renglones`, `letra-lista`, y `cuatro-tercios-siete-lineas` a 1440 × 1080.

**Verificación manual** (guía de 0.2.2): legibilidad a 5 m en una TV de 55" con 5 y con 7 líneas; que ninguna de las dos animaciones maree en la canción rápida de referencia (101 líneas en 3:29); 4:3 en proyector con 5 y con 7; fluidez en la ventana secundaria de un equipo modesto con el fondo en movimiento; que el relevo y los dos tiempos se entiendan en los primeros versos de una canción lenta.

## 0.2.2 · Feature 2 — Resaltado que no depende solo del color

Origen: [plan 0.2.2, feature 2](../versiones/0.2.2/plan-4.md#features-de-la-versión) y [propuesta 033](../propuestas/033-legibilidad-y-resaltado-accesible.md). Configuración: [06 · Feature 2](06-editor.md#022--feature-2--resaltado-que-no-depende-solo-del-color) (tema) y [08 · Feature 2](08-ajustes-y-acerca.md#022--feature-2--subrayar-siempre-lo-ya-cantado) (este equipo). Valores: [sistema visual · Feature 2](sistema-visual.md#022--feature-2--resaltado-accesible). **Alcance (decisión provisional, [0155](../preguntas/0155-decisiones-provisionales-de-ux-de-0-2-2-features-1-a-3.md)):** de la propuesta 033 entran el **subrayado de lo ya cantado** y el **aviso de colores que se confunden**; el fondo de lectura, el contorno de la letra y el tema «Alta legibilidad» quedan para más adelante.

Vale para el reproductor local, la prueba desde el editor, la ventana secundaria, la vista previa del editor y el video. Esta sección **amplía** la spec; no sustituye nada.

### Problema

En karaoke, la parte cantada de la línea activa se distingue de la que falta **solo por el color**. Para una persona con daltonismo, dos colores de luminosidad parecida pueden verse casi iguales. Las demás distinciones de la pantalla ya no dependen del color: la línea activa, las futuras y la ya cantada se distinguen por puesto y tamaño (feature 1).

### Subrayado de lo ya cantado

```
│              Guardo en la manga un verso doblado                         │ ← activa
│              ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔                                            │ ← subrayado: llega hasta donde llega el barrido
│                  que nadie sabe de dónde llegó                           │ ← +1 (sin subrayado)
```

| Aspecto | Comportamiento |
|---|---|
| **Cuándo se ve** | Si el estilo de la canción tiene «Subrayar lo ya cantado» **o** este equipo tiene activado «Subrayar siempre lo ya cantado» en Ajustes. Se resuelve al empezar la canción o la entrada de la cola. Por defecto, apagado: nada cambia en las canciones existentes. |
| **Qué es** | Una línea bajo el texto de la **línea activa**, en el color de lo ya cantado, que **avanza con el barrido**: en cada instante mide exactamente lo que mide la parte pintada de cada renglón. No aparece de golpe ni tiene animación propia. |
| **Dos renglones** | Cada renglón tiene su subrayado; avanzan en orden de lectura, como el barrido. |
| **Palabra a palabra** (0.2.1) | Sigue el relleno de cada palabra: espera entre palabras donde espera el barrido. **Los espacios entre palabras no se subrayan**: el subrayado queda en tramos, uno por palabra, como el propio barrido (que no pinta los espacios) **(decisión provisional, [0215](../preguntas/0215-espacio-entre-palabras-en-el-subrayado.md); 0155 n.º 14)**. En una línea sin tiempos por palabra (barrido progresivo), el subrayado es continuo, espacios incluidos. |
| **Otras líneas** | Las futuras no llevan subrayado. La línea ya cantada **tampoco**: ya se distingue por su puesto. |
| **Cambio de línea** (feature 1) | El subrayado es parte de la línea activa y viaja con ella. Al salir la línea, se funde con el avance de la salida y ha desaparecido al llegar al puesto −1. En «Fundido», lo lleva solo la copia del puesto de la activa. |
| **La letra no se mueve** | El subrayado cabe en la caja de la línea: activarlo no cambia la posición ni el tamaño de ninguna línea ni indicador. |
| **Letra lista** | No hay barrido, así que no hay subrayado en el reproductor ni en el video. (La vista previa del editor sí lo muestra, porque siempre enseña el barrido.) |
| **Barra de espera** | Con el subrayado activo, la pista de la barra usa el color de la letra al **35 % de opacidad** (como en Letra lista) y el relleno, el color de lo ya cantado: el avance se lee por la forma y la intensidad, no solo por el tono. Puntos y cuenta no cambian (no dependen del color para entenderse). |
| **Pausa y búsqueda** | Derivado del tiempo, como el barrido: en pausa se congela; al buscar, mide lo que toca. |
| **Movimiento reducido** | Sigue avanzando: es contenido, como el barrido. |
| **Video** | Usa **solo** lo que diga el estilo de la canción; el ajuste de este equipo no se aplica (10 · Feature 2). |
| **Contraste** | El subrayado tiene el color de lo ya cantado: lo cubre «Resaltado vs fondo» (≥ 3:1). Sin comprobaciones nuevas en el reproductor. |

### Estados (feature 2, reproductor)

| Estado | Presentación |
|---|---|
| Subrayado apagado | Como hasta ahora. |
| Subrayado activo, cantando | Línea bajo la parte cantada de la activa. |
| Subrayado activo, hueco con barra | Barra con la pista al 35 %. |
| Subrayado activo, Letra lista | Sin subrayado (no hay barrido). |

### Accesibilidad (feature 2, reproductor)

- Cumple «el color nunca es el único portador de significado» también en la letra: con el subrayado, el avance se ve por **forma**.
- El subrayado es decorativo para lectores de pantalla (la letra es `aria-hidden`).

### Criterios de aceptación de la feature 2 (reproductor)

- F2-R1. Con el subrayado activo, a mitad de una línea de un renglón el subrayado mide lo mismo que la parte pintada del barrido (± 1 px a 1080p) y empieza en el borde izquierdo del texto; al 0 % no se ve y al 100 % ocupa todo el ancho del texto (test del modelo de render).
- F2-R2. En una línea de dos renglones de 120 y 60 px, al 75 % el subrayado mide 120 px en el primero y 15 px en el segundo.
- F2-R3. En una línea con tiempos por palabra hechos a mano, entre el fin de una palabra y el inicio de la siguiente el subrayado no avanza; cada palabra tiene su tramo de subrayado, que mide lo mismo que su parte pintada (± 1 px), y el espacio entre dos palabras no se subraya nunca (ni antes ni después de empezar la segunda). Con barrido progresivo (sin tiempos por palabra), el subrayado es continuo.
- F2-R4. Las cajas de todas las líneas y de los indicadores tienen las mismas coordenadas con el subrayado activo y apagado (test geométrico con 2, 5 y 7 líneas).
- F2-R5. Las líneas futuras y la ya cantada no tienen subrayado; a mitad de la salida de una línea el subrayado tiene la opacidad `1 − avance`, y al terminarla no existe.
- F2-R6. En una canción Letra lista con el subrayado activo (por el tema o por Ajustes), el reproductor no dibuja ningún subrayado ni ningún píxel del color de lo ya cantado.
- F2-R7. Con el subrayado activo, la pista de la barra de espera es el color de la letra al 35 % y el relleno el color de lo ya cantado; apagado, la pista es el color de la letra al 100 % (como en 0.2.1).
- F2-R8. Con «Subrayar siempre lo ya cantado» activado en Ajustes, una canción cuyo tema no lo tiene se reproduce con subrayado en el reproductor local y en la ventana secundaria; al desactivarlo, la siguiente reproducción sale sin él.
- F2-R9. Capturas en `docs/ux/revisiones/0.2.2-feature-2/` con nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080: `subrayado-mitad`, `subrayado-dos-renglones`, `subrayado-barra-espera`, y una con letra `#E53935` y resaltado `#43A047` (`subrayado-rojo-verde`).

**Verificación manual** (guía de 0.2.2): con un simulador de daltonismo (o un filtro de escala de grises del sistema) y el par rojo/verde anterior, el avance se sigue sin el color; el subrayado se ve a 5 m en una TV de 55" y no molesta la lectura de la línea siguiente.

## 0.2.3 · Feature 1 — Cantantes por línea en pantalla

Origen: [plan 5, feature 1](../versiones/0.2.3/plan-5.md) y [exploración §6](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md#6-reproductor-y-exportación-cómo-se-pinta). Conceptos (parte, cantante, Todos, Coro, inicial): [06 · 0.2.3 · Feature 1](06-editor.md#023--feature-1--cantantes-por-línea). Valores: [sistema visual · 0.2.3](sistema-visual.md#023--varios-cantantes-y-coros). Decisiones provisionales: [0160](../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md) n.º 7–11 y [0170](../preguntas/0170-decisiones-provisionales-de-ux-de-0-2-3.md).

Vale para el reproductor local, «Probar» desde el editor y desde la Biblioteca, la ventana secundaria y la cola, la vista previa del editor y el video (mismo render). **Una canción sin reparto se ve exactamente igual que en 0.2.2** (bloque de líneas de la feature 1). Una canción **con reparto** (2 o más cantantes, o coros) usa la **disposición por zonas**: base común de dueto, trío, «Todos» y coro, indicación del usuario del 2026-11-22 ([0170](../preguntas/0170-decisiones-provisionales-de-ux-de-0-2-3.md) §B).

### Disposición por zonas

Cada parte tiene **su espacio en pantalla**: una **zona**, una franja horizontal fija para toda la canción. Así se ve quién canta por **posición** (además de por insignia y color), como en las referencias del usuario (un cantante arriba, otro abajo; el coro en su zona). La disposición vale igual si las líneas van una tras otra como si dos zonas cantan a la vez ([sección condicionada](#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto)).

| Regla | Valor |
|---|---|
| **Qué zonas hay** | Una por cantante de la canción (con o sin líneas aún por cantar) y una de **Coro** si la canción tiene líneas de coro. **Todos** no tiene zona propia en pantalla: su línea se dibuja **a la vez en la zona de cada cantante**, en el color de Todos y con la misma insignia (como la referencia del dúo en que cada voz lleva la misma frase) **(provisional, 0170 n.º 4)**. Máximo 5 zonas (4 cantantes + Coro). |
| **Orden** | De arriba abajo: **Coro arriba del todo** (como en la referencia de coros del usuario: el coro por encima de la voz principal) y después Cantante 1, 2, 3, 4 **(provisional, 0170 n.º 4)**. Fijo en toda la canción: una zona nunca cambia de sitio. |
| **Área y altura** | Las zonas se reparten la franja del **12 % al 86 %** del alto, separadas 0,3 × `S`. Las de cantante tienen el mismo alto; la de Coro, **la mitad** de una de cantante. Con 4 cantantes y coro, cada zona de cantante mide ≈ 14 % del alto: cabe una línea de dos renglones al 75 % de `S` (sin la siguiente). |
| **Qué muestra cada zona** | Zona de cantante: la **línea en curso** de esa parte (la que suena; si no suena ninguna, la **próxima** de esa parte) y, debajo, si cabe entera, la **siguiente** de esa parte al 70 % (2 líneas). Zona de Coro: solo la línea en curso o próxima (1 línea). Ninguna línea ya cantada: al acabar, la línea sale de su zona (el «Cambio de línea» del tema: desplazamiento hacia arriba dentro de la zona, fundido o sin animación). |
| **Quién canta ahora** | La zona que suena: línea al 100 % de opacidad con su barrido. Las demás: su próxima línea al **55 %** de opacidad (con el suelo de contraste de 0.2.2) y sin barrido. La diferencia se lee por opacidad, barrido e insignia, no solo por color. |
| **Tamaño** | `S` de siempre si cabe; si la línea en curso (hasta 2 renglones) no cabe en el alto de su zona, la zona usa `S_zona = alto de la zona / (2 × 1,2 + 0,7 × 1,2 si hay siguiente)`, con un mínimo del **75 % de `S`**; por debajo, la zona deja de mostrar la siguiente. Se calcula **una vez por canción y tamaño de ventana**, igual para todas las zonas de cantante (no por línea). |
| **«Letra en pantalla» del tema** | En canciones con reparto, «Líneas a la vez» y «Líneas ya cantadas» no se aplican (cada zona muestra su línea y la siguiente); «Cambio de línea» sí, dentro de cada zona. El editor lo dice bajo esos controles (`edi.pantalla.zonas`). |
| **«Varias voces: todas en un bloque»** | El tema puede elegir no usar zonas (`estilo.pantalla.zonas = "una"`, [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) §4 bis; control en [06](06-editor.md#023--feature-1--cantantes-por-línea), «Letra en pantalla»): entonces la canción con reparto se ve en el bloque único de 0.2.2 (con `N`, `P` y ancla), con los colores, las insignias y los paréntesis de esta sección. Por defecto, zonas. |
| **Indicadores de espera** | Se dibujan **en la zona de la línea que viene**, con las mismas posiciones relativas a esa línea (barra encima, cuenta en su sitio, puntos sobre ella) y en el color de su parte. Si la línea que viene es de **Todos** (que se repite en todas las zonas de cantante), se dibujan **una sola vez, en la primera zona de cantante** (la del Cantante 1), en el color de Todos: repetirlos en cada zona sería ruido y todos los cantantes miran la misma cuenta. |
| **Pantalla de título, silencio previo, final** | Sin cambios. |

**Dueto con coro** (Ana canta; Luis y el coro esperan)
```
┌──────────────────────────────────────────────────────────────────────────┐
│  zona Coro (mitad de alto)                                               │
│                     (de puntillas)                                       │  ← próxima del coro, 55 %, sin insignia
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │  (las zonas no tienen borde: la línea solo indica el reparto)
│  zona Cantante 1                                                         │
│         ╭A╮ ████████████████░░░░░░░░░░░░░░░░░░                           │  ← suena: 100 %, barrido en el color de Ana
│             Guardo en la manga un verso doblado                          │
│                 ╭A╮ paso a paso, sin hacer ruido                         │  ← siguiente de Ana, 70 %
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│  zona Cantante 2                                                         │
│                 ╭L╮ que nadie sabe de dónde llegó                        │  ← próxima de Luis, 55 %
│                 ╭L╮ y la ciudad se queda sin voz                         │  ← siguiente de Luis, 70 % × 55 %
└──────────────────────────────────────────────────────────────────────────┘
```

**Línea de Todos** (cantan los dos): la misma frase en la zona de Ana y en la de Luis, las dos con el barrido en el color de Todos y la insignia «A·L» (con 3 o 4 cantantes, el icono `users`).

**Un solo cantante con coros**: dos zonas, la del Cantante 1 (sin insignias) y la del Coro, abajo.

### Reglas de color

| Elemento | Sin reparto | Con coros (1 cantante) | Con varios cantantes |
|---|---|---|---|
| Texto sin cantar | Color de la letra | Color de la letra | Color de la letra: **no se tiñe** con el color del cantante **(decisión provisional 7 de 0160, revisada con las referencias del usuario en 0170 §A)** |
| Barrido (lo ya cantado) | Color de lo ya cantado | En líneas de coro, el color del Coro | **Color de la parte** de la línea (Cantante 1 = color de lo ya cantado) |
| Subrayado (0.2.2 · F2) | Color de lo ya cantado | El de la línea | El de la línea (el mismo que su barrido) |
| Línea que acaba | Gris de la letra (0.2.2 · F1) | Sale de su zona pasando a gris (no se queda como «ya cantada») | Igual; la insignia también pasa a gris |
| **Letra lista** (sin barrido) | Color de la letra | Líneas de coro enteras en el color del Coro | **Texto entero en el color de su parte** (decisión 9 de 0160); la que suena, al 100 %, y las demás zonas al 55 % |
| Puntos ●●● y relleno de la barra de espera | Color de lo ya cantado (Letra lista: de la letra) | Color de la parte de la **línea que viene** | Color de la parte de la **línea que viene**: anuncian quién entra (decisión 10 de 0160). La pista de la barra y la cuenta 3·2·1 no cambian. |

### Señales que no dependen del color

1. **Insignia de cantante** (solo con varios cantantes). Píldora a la izquierda del **primer renglón** de cada línea, con la **inicial** del cantante (o «A·L» / icono `users` para Todos) en el color de la letra y borde en el color de la parte. Las líneas de Coro **no** llevan insignia: las identifican los paréntesis. La insignia viaja con su línea (tamaño, opacidad y gris) y **no mueve el texto**: el texto sigue centrado y la insignia cuelga a su izquierda. Para que quepa, con varios cantantes el ancho máximo de línea baja del 88 % al **80 %** en toda la canción (también en la zona del coro, para que las formas sean estables). Medidas: sistema visual.
2. **Paréntesis** en las líneas de coro, dibujados por la app (el texto guardado no cambia); si el texto ya empieza por «(» y acaba en «)», no se añaden otros. Forman parte del texto a efectos de renglones y barrido: se barren con la primera y la última palabra.
3. **Zona** (posición fija por parte) y **opacidad** (la zona que suena, al 100 %; las demás, al 55 %).

### Casos

| Caso | Comportamiento |
|---|---|
| **Paso de un cantante a otro** | La línea que acaba sale de su zona (con el cambio de línea del tema) y la siguiente de esa parte sube a su sitio; a la vez, la zona que entra pasa de 55 % a 100 % en el inicio de su línea (en `D`, sin movimiento). Nada cambia de zona. |
| **Dos líneas seguidas de la misma parte** | Sin hueco (menor que `D`): relevo de 0.2.2 dentro de la zona. **Con hueco**: no hay «dos tiempos»; al acabar la línea, sale y **la siguiente sube en el mismo cambio** a su sitio, donde espera al 55 % hasta su inicio (`subidaAlSalir`, [ADR 0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) §4 bis: sin líneas ya cantadas, el «dos tiempos» dejaría vacío el sitio de la próxima). |
| **Zona sin más líneas** | Queda vacía hasta el final (no se recolocan las demás). |
| **Línea de dos renglones** | Insignia junto al primer renglón; el segundo, sin insignia. Si con la siguiente no cabe en la zona, la siguiente no se dibuja (nunca una línea cortada). |
| **Barrido palabra a palabra** | Igual, en el color de la parte. |
| **Pausa y búsqueda** | Derivado del tiempo, como siempre: buscar pinta lo mismo que llegar reproduciendo. |
| **Movimiento reducido** | Cambios instantáneos dentro de cada zona y cambio de opacidad sin transición. |
| **Ventana secundaria y cola** | El reparto y los colores viajan en la instantánea de cada entrada. La tarjeta «A continuación» no cambia. |
| **Contraste** | Cada color de parte tiene el aviso del editor (≥ 3:1 con el fondo); en el reproductor no hay avisos. La insignia, con texto en el color de la letra, se lee como la letra. |

### Accesibilidad (0.2.3 · feature 1, reproductor)

- Quién canta se sabe **sin color**: por la zona (posición fija), la insignia (iniciales o icono) y, en el coro, los paréntesis; quién canta **ahora**, por la opacidad y el barrido. Con un filtro de escala de grises se sigue sabiendo.
- La letra sigue siendo `aria-hidden`; sin anuncios nuevos.
- Legibilidad a 5 m: con 1 o 2 cantantes (y coro) la línea que suena conserva `S`; con 3 o 4, puede bajar hasta el 75 % de `S` (relación ≈ 1/185 a 5 m en una TV de 55": se lee bien a 3–4 m). Se anota en la verificación manual.

### Microcopy (0.2.3 · feature 1, reproductor)

Sin textos nuevos (las insignias son iniciales del nombre de cada cantante).

### Criterios de aceptación (0.2.3 · feature 1, reproductor)

- C1-R1. Una canción sin reparto da el mismo modelo de fotograma que en 0.2.2 en 50 instantes (test de regresión del modelo), con el ancho de línea al 88 %.
- C1-R2. Un dueto con coro tiene tres zonas (Coro, Cantante 1 y Cantante 2, de arriba abajo) dentro del 12 %–86 % del alto, con la del coro a la mitad del alto de las otras y una sola línea; ninguna zona cambia de posición en toda la canción (test geométrico en 50 instantes a 1920 × 1080 y 1280 × 720). Un solo cantante con coros tiene dos zonas; un trío sin coro, tres.
- C1-R3. Mientras canta Luis, su zona muestra su línea al 100 % con el barrido en el color de su ranura, la insignia «L» y, si está activo, el subrayado de su color; la zona de Ana muestra su próxima línea al 55 % sin barrido; el texto sin cantar de las dos es el color de la letra.
- C1-R4. Una línea de Todos se dibuja a la vez en la zona de cada cantante, con el barrido en el color de Todos e insignia «A·L» (con 3 cantantes, el icono `users`); dos cantantes «Ana» y «Alba» llevan «An» y «Al».
- C1-R5. Una línea de coro se dibuja en la zona del coro, entre paréntesis y sin insignia; «(de puntillas)» guardado con paréntesis no se dibuja con dos.
- C1-R6. Con varios cantantes, ninguna línea pasa del 80 % del ancho; con 4 cantantes y coro, la línea que suena mide al menos el 75 % de `S` y ninguna línea se dibuja cortada ni fuera de su zona.
- C1-R7. La insignia mide lo indicado en el sistema visual y está a la izquierda del primer renglón sin solaparlo.
- C1-R8. En Letra lista, el texto de cada línea va entero en el color de su parte, sin barrido ni subrayado.
- C1-R9. En un hueco antes de una línea de Luis, los indicadores de espera se dibujan en la zona de Luis, en su color; antes de una línea de Todos, una sola vez, en la zona del Cantante 1 y en el color de Todos; la cuenta 3·2·1 no cambia de forma.
- C1-R10. «Líneas a la vez» y «Líneas ya cantadas» del tema no cambian nada en una canción con reparto en zonas; «Cambio de línea» sí (dentro de cada zona). Con «Todas en un bloque» en el tema, la canción se ve con el modelo de bloque de 0.2.2 (mismo fotograma que una sin reparto salvo colores, insignias y paréntesis).
- C1-R11. La vista previa del editor, el reproductor, la ventana secundaria y un fotograma exportado dan el mismo modelo (zonas, colores, insignias, paréntesis) en el mismo instante (test compartido, amplía F1-R23).
- C1-R12. Capturas en `docs/ux/revisiones/0.2.3-feature-1/`, nombre `reproductor-{ancho}x{alto}-{estado}.png` a 1920 × 1080 y 1280 × 720: `duo-canta-1`, `duo-canta-2`, `duo-todos`, `duo-coro`, `solo-coros`, `cuarteto-coro`, `letra-lista-duo`, `espera-zona`, `escala-de-grises` (filtro de grises sobre `duo-canta-2`), y `cuatro-tercios-duo` a 1440 × 1080.

**Verificación manual** (guía de 0.2.3): un dúo real cantado por dos personas en una TV a 5 m: ¿cada uno sabe a tiempo cuándo entra mirando solo su zona?; las insignias se leen a esa distancia; un cuarteto a 3–4 m; la paleta predeterminada con un simulador de deuteranopía.

### Voces a la vez (condicionada a la factibilidad que dictamine el arquitecto)

> **Condicionada**: solo si el arquitecto dictamina que entra en 0.2.3 (ver [06 · sección condicionada](06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto)). Si no, no se implementa nada de esto.

La disposición por zonas no cambia: lo único nuevo es que **varias zonas pueden sonar a la vez**.

| Aspecto | Comportamiento |
|---|---|
| **Varias zonas activas** | Cada zona cuya línea suena está al 100 % y barre con **sus** tiempos; las que no, al 55 %. |
| **Coro que acompaña** | El coro barre en su zona mientras la voz principal barre en la suya (el caso de la referencia de coros del usuario). |
| **Todos con solape** | No aplica: Todos ya ocupa las zonas de todos los cantantes; una línea de un cantante no puede solaparse con una de Todos (lo impide el editor). |
| **Indicadores de espera** | Solo cuando **ninguna** zona suena; en la zona de la próxima línea. |
| **Rendimiento** | Hasta 5 barridos a la vez; lo mide la prueba técnica del arquitecto (factibilidad §4.3). |

- C1S-R1. En un tramo en que se solapan una línea de Ana y una de coro, las dos zonas están al 100 % y cada barrido avanza con sus propios tiempos (test del modelo en 10 instantes del solape).
- C1S-R2. Fuera de los solapes, el modelo es idéntico al de la disposición sin solapes (mismos tests C1-R2 a C1-R9).
- C1S-R3. En la exportación a 60 FPS de un solape de 4 zonas no se pierden fotogramas en el equipo de referencia del arquitecto (medida de la prueba técnica).

## 0.2.3 · Feature 2 — Voz en los coros

Origen: [plan 5, feature 2](../versiones/0.2.3/plan-5.md) y [factibilidad §2](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md#2-audio). Nivel y concepto: [06 · 0.2.3 · Feature 2](06-editor.md#023--feature-2--voz-en-los-coros). Amplía [«Voz guía»](#voz-guía); lo demás del audio no cambia.

| Aspecto | Comportamiento |
|---|---|
| **Nivel de la voz en cada instante** | `máx(voz guía efectiva, nivel de coros en ese instante)`. La voz guía efectiva es `voz_guia` o 0 si está silenciada; el nivel de coros es `voz_en_coros` dentro de un tramo de coro (con sus rampas de 150 ms) y 0 fuera. Ejemplos: voz guía silenciada (el estado de fábrica) → solo suenan los coros, al 50 %; voz guía al 30 % → 30 % fuera de los coros y 50 % en ellos; voz guía al 100 % → no se nota nada. |
| **V (silenciar la voz guía)** | **No** silencia los coros: son parte de la canción (decisión 19 de 0160). En canciones con coros y nivel > 0, el indicador breve dice `rep.ind.vozsilenciada.coros` en lugar de `rep.ind.vozsilenciada`. |
| **Mayús + ↑/↓ y el deslizador de la voz guía** | Cambian solo la voz guía; el nivel de coros es de la canción y no se toca desde el reproductor. |
| **Volumen general y M** | Afectan a todo, como hoy. |
| **Buscar, pausar, reanudar** | El nivel deriva del tiempo: al buscar a mitad de un coro, la voz ya está en su nivel, sin rampa audible desde 0. Mismo instante de arranque que las fuentes (sin desfase). |
| **Silencio previo** | Sin caso especial (el tramo está en tiempo de canción). |
| **Sin voz separada o voz ilegible** | No hay voz en los coros; el resto, como `rep.voz.nodisponible`. |
| **Ventana secundaria y cola** | Igual, con el nivel de cada canción de su instantánea. |
| **Sin coros, o nivel 0 %** | Como en 0.2.2. |

### Microcopy (0.2.3 · feature 2, reproductor)

| Clave | Texto |
|---|---|
| `rep.ind.vozsilenciada.coros` | Voz silenciada · coros al {n} % |

### Criterios de aceptación (0.2.3 · feature 2, reproductor)

- C2-R1. Con la voz guía silenciada y nivel de coros 50 %, la ganancia programada de la voz (doble de `AudioContext`) es 0,5 ± 1 dB en el centro de cada línea de coro y 0 a más de 450 ms de cualquier tramo; las rampas de entrada y salida duran 150 ms y son lineales.
- C2-R2. Dos líneas de coro separadas por 800 ms forman un solo tramo (la ganancia no baja entre ellas); separadas por 1,2 s, dos.
- C2-R3. Con la voz guía al 30 %, la ganancia es 0,3 fuera de los coros y 0,5 dentro; al 80 %, 0,8 en todas partes.
- C2-R4. Buscar al centro de un coro deja la ganancia en 0,5 en el primer bloque de audio (sin rampa desde 0); pausar y reanudar no cambian el nivel; los tramos se calculan con la misma función que el editor y la exportación (test compartido de `tramosCoro`).
- C2-R5. V en una canción con coros muestra `rep.ind.vozsilenciada.coros` y los coros siguen sonando; en una sin coros, `rep.ind.vozsilenciada` como siempre.
- C2-R6. En la ventana secundaria, dos canciones seguidas con niveles 20 % y 70 % suenan cada una con el suyo.

**Verificación manual** (guía de 0.2.3): con 3 canciones con coros, sin voz guía y con voz guía al 30 %: ¿se oyen chasquidos al entrar o salir de un coro?; ¿se cuela la voz principal donde canta a la vez (límite esperado)?; ¿el 50 % por defecto se oye bien en las tres?
