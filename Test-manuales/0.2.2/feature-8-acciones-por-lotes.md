# Guía manual · 0.2.2 · Feature 8 · Acciones por lotes en la Biblioteca

- Versión: 0.2.2-alpha.3 · Feature 8
- Specs: [02 · Feature 8](../../ux/02-biblioteca.md#022--feature-8--acciones-por-lotes-en-la-biblioteca) · [10 · Feature 8](../../ux/10-exportacion.md#022--feature-8--exportar-varias-canciones) · ADR: [0026](../../adr/0026-importacion-por-lotes-y-acciones-por-lotes-en-la-biblioteca.md) §4 y §5
- Informe de QA: [informe-feature-8](../../versiones/0.2.2/informe-feature-8.md)
- Duración estimada: 75 min
- Requisitos: una biblioteca con al menos 8 canciones **reales** de estados distintos (Lista, Letra lista, borrador sin letra, borrador con letra, una en «Lista para revisar»); una carpeta de destino; un USB o disco externo; opcional: segunda pantalla para el reproductor y un lector de pantalla. **Haz una copia de tu biblioteca antes de empezar** (Ajustes › Copia de seguridad): el caso 4 elimina canciones.

## Preparación

1. Usa tu biblioteca real o una copia (`SHINOBI_DATOS`). Para el caso 4, apunta cuántas canciones tienes y cuáles vas a eliminar.
2. Anota el sistema operativo (el caso 4 se repite en cada uno).

## Casos

### 1. Barra de selección y recuentos

Criterios: F8-1, F8-2, F8-11, F8-13.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | «Seleccionar» y marca 5 canciones mezcladas: 2 borradores sin letra, 2 Listas y 1 «Lista para revisar» | La barra muestra «Preparar», «Aplicar tema…» y «Más acciones». El menú trae, en este orden, A la cola, Exportar video…, Exportar paquete…, Exportar la letra (.lrc)…, Editar datos… y, tras un separador, Eliminar… | ☐ |
| 1.2 | Mira los recuentos | «Preparar (2 de 5)», «A la cola (2 de 5)» y «Exportar video… (2 de 5)» (ver la nota de QA: el diálogo de «Preparar» cuenta también las Listas a las que pondría fines) | ☐ |
| 1.3 | Selecciona solo Listas | «Preparar» queda inactivo con su motivo, pero se puede enfocar | ☐ |
| 1.4 | Intenta seleccionar una canción dañada | No se puede; su pista dice que use el menú ⋯ | ☐ |
| 1.5 | Haz todo el recorrido solo con teclado (Tab, flechas, Espacio, Intro, Esc) | El foco nunca queda perdido en el cuerpo de la página | ☐ |

### 2. «Preparar» por lotes con red real

Criterios: F8-3, F8-4, F8-5. Este caso hace peticiones a LRCLIB.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Selecciona 3 borradores sin letra y 1 con letra anterior a 0.2.2 → Preparar | El diálogo lista cada canción con su nota. Avisa de que se envían título y artista a LRCLIB y, para la que ya tiene letra, de que solo se pondrán los fines que faltan | ☐ |
| 2.2 | Confirma | Se sale del modo selección, aparece el aviso con «Ver actividad» y las canciones entran al final de la cola | ☐ |
| 2.3 | Lanza «Preparar» con una tanda ya en marcha | Se suma a la tanda: el total sube y la barra no retrocede. Un fallo no detiene a las demás | ☐ |
| 2.4 | Una canción con la letra ya elegida | La conserva; no se le cambia la letra | ☐ |

### 3. Exportar tres canciones reales a una carpeta (y a un USB)

Criterios: F8-V1 a V9 y «Hecha cuando».

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Selecciona 3 Listas reales → Más acciones → Exportar video… | «Exportar 3 videos» con la duración total, las mismas opciones que para una canción, la carpeta propuesta y la estimación sumada | ☐ |
| 3.2 | Deja en la carpeta un video con el nombre que tendría una de ellas | El aviso «1 de estas canciones ya tienen un video…» y «Ver cuáles» muestra cada nombre. «Omitir esa canción» baja el número del botón | ☐ |
| 3.3 | «Conservar los dos» y exporta | Los nuevos se guardan con « (2)» sin tocar los existentes. Se procesan de uno en uno | ☐ |
| 3.4 | Abre cada video resultante en un reproductor | Tienen la letra, el estilo de su canción y el audio elegido | ☐ |
| 3.5 | Repite con «Sustituir» y cancela a mitad con «Cancelar las que faltan» | Los videos terminados se conservan; el que se sustituía **conserva el anterior** si se cancela antes de terminar; no queda ningún archivo temporal | ☐ |
| 3.6 | **Carpeta en un USB**: exporta 3 canciones al USB y **desconéctalo a mitad** | El lote se detiene con «No se puede guardar en esa carpeta…»; las que faltan quedan «No se intentó»; el botón «Cambiar opciones» vuelve al formulario. Vuelve a conectarlo y usa «Reintentar las fallidas» | ☐ |
| 3.7 | Al terminar un lote con el diálogo cerrado | **Un solo** aviso del sistema (ninguno por video) con [Ver resultado]. En el resultado, «Mostrar la carpeta» **abre la carpeta de verdad** en el explorador del sistema | ☐ |
| 3.8 | Borra la carpeta de destino y pulsa «Mostrar la carpeta» | Aviso «La carpeta ya no está disponible» | ☐ |
| 3.9 | Con el reproductor abierto en otra pantalla, lanza el lote | Se puede lanzar y el formulario avisa de la sesión. Cierra la app con el lote en marcha: el diálogo cuenta **todas** sus exportaciones | ☐ |

### 4. Eliminar por lotes y recuperar de la papelera

Criterios: F8-8, F8-9, F8-10, F8-12. **Hazlo en cada sistema (Windows, macOS y Linux) que tengas.**

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Selecciona 3 canciones sin importancia → Eliminar… (o Supr) | Confirmación con el foco en «Cancelar», la lista con el estado de cada una y el aviso si alguna está lista para cantar | ☐ |
| 4.2 | Confirma | Cada canción va a la **papelera del sistema** (no desaparece del disco sin más) y el resultado lo dice con el nombre de cada una | ☐ |
| 4.3 | **Recupera una de la papelera** (macOS: «Poner de nuevo»; Windows: «Restaurar»; Linux: «Restaurar» en la papelera) y reinicia la app | La canción vuelve a aparecer en la biblioteca con su letra y su estilo | ☐ |
| 4.4 | Selecciona 10 o más → Eliminar… | El botón rojo solo se activa tras marcar «Entiendo que se eliminarán N canciones» | ☐ |
| 4.5 | Con el reproductor sonando una canción en la otra pantalla, inclúyela en la selección | Sale omitida con «No se elimina: se está reproduciendo» y las demás se procesan | ☐ |
| 4.6 | Elimina una canción que se está separando | Su trabajo se cancela antes y desaparece de la cola | ☐ |
| 4.7 | Anota **cómo se llama la carpeta en la papelera** y si se puede identificar la canción | Anótalo: la carpeta se llama con el identificador, no con el título | ☐ |

### 5. «Editar datos…» y «A la cola»

Criterios: F8-6, F8-7, F8-12.

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 5.1 | Selecciona 5 canciones, marca «Cambiar el álbum» y escribe uno | «Cambiará el álbum de N canciones; k ya lo tienen», el aviso de las que cambian de aspecto y la lista. Al aplicar, las tarjetas cambian de grupo y se anuncia el resultado | ☐ |
| 5.2 | Marca un campo y déjalo vacío | Las canciones quedan «Sin álbum» (o «Sin artista»). El título no cambia nunca | ☐ |
| 5.3 | Con una canción sonando en la otra pantalla, inclúyela | Sale omitida («Edítala cuando termine») y las demás cambian | ☐ |
| 5.4 | «A la cola» con varias Listas | Se añaden al final en el orden visual, sin diálogo, con [Deshacer] | ☐ |
| 5.5 | Con la cola a 2 entradas del límite, añade 5 | Entran 2 y el aviso usa la variante parcial | ☐ |

### 6. Lector de pantalla

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 6.1 | Con VoiceOver, NVDA u Orca abre «Preparar», «Editar datos…» y «Eliminar…» | El título del diálogo se anuncia, las notas se leen por fila, el resultado se anuncia **una vez** | ☐ |
| 6.2 | En el diálogo de exportar varias | La lista «Ver cuáles» se puede recorrer; el progreso del lote se anuncia sin repetirse | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|
| | | | |
