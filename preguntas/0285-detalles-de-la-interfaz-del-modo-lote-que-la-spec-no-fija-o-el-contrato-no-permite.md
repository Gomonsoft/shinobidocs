# 0285 — Detalles del modo lote que la spec no fija o que el contrato no permite (0.2.2, feature 7)

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción conservadora aplicada en 0315 y 0316)

## Contexto

Al implementar las tareas 0315 y 0316 aparecen siete puntos donde la spec 03/04 no se puede cumplir al pie de la letra o no dice nada. En todos se ha aplicado la opción conservadora que se indica.

## Puntos y opción aplicada

1. **Progreso de L1 de archivos** (`add.lote.leyendo`, «Leyendo {i} de {n} archivos…»). `fuente.leerArchivos` es una sola llamada sin eventos de progreso y, con el diálogo nativo, `n` no se conoce hasta leer. Aplicado: barra indeterminada y «Leyendo {n} archivos…» al soltar (n conocido) o «Leyendo los archivos…» al elegir. Si se quiere «{i} de {n}», hace falta un evento de progreso en main.
2. **`add.lote.ofertaLista` con «{n} videos»**: la lista no se consulta hasta pulsar, así que n no existe. Aplicado: «Este video está en una lista.» + [Añadir la lista entera].
3. **`add.lote.anadiendo` «{i} de {n}»**: `fuente.lote` es una sola llamada. Aplicado: «Añadiendo…» con el botón en estado cargando.
4. **Nombre de la carpeta** (`add.lote.origen.carpeta`): con «Elegir carpeta…» main no devuelve la ruta. Aplicado: al arrastrar una carpeta se usa su nombre; con el diálogo, el álbum que salió del nombre de la carpeta; si todos los archivos traen etiqueta de álbum, el origen dice «{n} archivos».
5. **Videos de YouTube**: la lista solo trae título, canal y duración, así que el artista, el título limpio y la miniatura salen de `fuente.infoYoutube` video a video **en segundo plano** (uno cada vez, solo los marcados) mientras la tabla ya está a la vista (línea «Completando los datos…»). Para 50 videos reales son varios minutos; la spec dice «sin consultar video a video» en L1. «Añadir» no espera: crea con lo que haya en la tabla.
6. **Tiempo de un lote de enlaces sueltos**: solo `infoLista` trae `factorMinutos`. Un lote de videos sueltos muestra el resumen sin tiempo (`add.lote.resumen.sinTiempo`).
7. **«Importar paquete…»** (F7-N15): no se muestra todavía; la feature 9 vive en `vistas/biblioteca/paquete/` de otro programador y no hay forma pública de abrir su diálogo desde esta vista.

Textos propios añadidos sin clave en la spec: «Completando los datos…», «Leyendo los archivos…», «Leyendo {n} archivos…», `act.cola.boton` cuenta la canción en curso («Preparando 3 de 5» cuando hay 2 terminadas) mientras el título de la cabecera cuenta las terminadas («2 de 5 canciones»).

## Respuesta

Diseñador UX, 2026-11-22. Spec 03 · Feature 7 y 04 actualizadas.

1. **Conforme**: barra indeterminada con `add.lote.leyendo` («Leyendo {n} archivos…» / «Leyendo los archivos…»).
2. **Conforme**: `add.lote.ofertaLista` sin número.
3. **Conforme**: «Añadiendo…» con el botón cargando.
4. **Conforme**; si main puede devolver el nombre de la carpeta elegida con el diálogo, mejor (no bloquea).
5. **Cambio** (provisional para el usuario, 0154 n.º 20): la tabla se rellena solo con la consulta rápida de la lista; los datos propios de cada video se completan **al descargarlo en la cola**, solo en los campos no editados por el usuario. Necesita un paso en main (arquitecto). Mientras no exista, se acepta lo de hoy **siempre que** cada consulta respete la pausa entre peticiones a YouTube y la tabla muestre `add.lote.completando` («Completando los datos de los videos… {i} de {n}»). No bloquea alpha.3.
6. **Conforme** con `sinTiempo`; cuando main dé `factorMinutos` también en esa lectura, se muestra el tiempo.
7. **Cambio**: el enlace «Importar paquete…» se muestra y abre `abrirImportarPaquete` (la interfaz de paquetes ya lo expone, 0292). No bloquea.

Deudas: (a) la lista de autocompletado de una celda **se pinta por encima de la tabla** (portal) y se cierra al desplazar la tabla: cambio, no bloquea; (b) velo `bib.arrastrar.soltarVarios`: cambio, no bloquea; (c) «Cambiar en Ajustes» debe conservar el formulario (spec 03 · Feature 6) también tras «Elegir archivos…»: cambio, no bloquea (si no se puede ahora, abrir Ajustes en otra ventana no es opción; basta con guardar el estado del formulario al salir y restaurarlo al volver).

Cola (0316): botón `act.cola.boton` = en curso (terminadas + 1); cabecera = terminadas, y su texto dice ahora «{t} de {n} terminadas» para que no parezcan dos números distintos para lo mismo (cambio de texto). «faltan {m}» = canciones: conforme. «Reparar el motor» al flujo de reparación del primer arranque: conforme.