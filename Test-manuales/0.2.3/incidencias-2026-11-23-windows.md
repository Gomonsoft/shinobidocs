# Incidencias de las pruebas manuales · 2026-11-23 · Windows 11

> Notas tomadas mientras el usuario ejecuta las guías de 0.2.2 y 0.2.3. Lo medido lleva su fuente; lo supuesto está marcado como «supuesto». Nadie ha tocado código: la sesión del Mac implementa.

## Resumen para la sesión que implementa

Unas 5 horas de uso real de la app instalada, con la biblioteca del usuario: 7 canciones añadidas desde YouTube con letra de LRCLIB y un dúo repartido de principio a fin (caso 1 de la guía de la feature 1). Por orden de importancia:

| Id | Qué | Tipo | Gravedad | Estado |
|---|---|---|---|---|
| I-1 | El editor queda en negro (el árbol de React se desmonta) y no deja rastro en `app.log`. 4 veces en una hora, con disparadores distintos; después, 3 horas sin fallo | Fallo | Alta | **Sin causa ni reproducción fiable.** Falta la excepción. Segundo defecto, seguro: no hay límite de errores ni registro de los errores del renderer |
| Medida | La elección automática de la letra no funcionó en ninguna canción (0 de 7): letras correctas dan `no_coincide` por ir adelantadas 130–460 ms | Criterio de «hecha» de 0.2.2 (features 4 y 5) | Alta | Medido en 2 canciones; faltan las otras 5 |
| I-3 | Editor preciso: doble clic en una palabra con la canción sonando reproduce 1,5 s y vuelve a donde estaba | Fallo (confirmado por el usuario: debe reproducir desde ahí y no volver) | Media | Medido sobre un video |
| I-2 | Al pausar en el editor, la vista previa y la selección muestran la línea seleccionada, no el instante del cabezal | Fallo o diseño (lo decide el diseñador) | Media | Ocurre siempre; 3 capturas |
| M-4 | «Ajustar los silencios» pone el fin en la primera pausa interior y deja fuera la voz que sigue (41 % de las líneas con silencio en 6 canciones) | Regla diseñada; propuesta 043 | Media | Verificado en el código y medido |
| M-2 | No crear cantantes arrastrando; gestionarlos solo desde Funciones | Propuesta 041 | — | Pendiente de decisión |
| M-3 | Carril del Coro opcional | Propuesta 042 | — | Pendiente de decisión |
| M-1 | Que se vea de antemano quién canta después | Propuesta 040 | — | Pendiente de decisión |

Otros datos: repartir el dúo llevó unos 30 minutos (la guía espera «unos pocos»); corregir la letra conservó tiempos y cantante; no existe ninguna prueba E2E que arrastre regiones con el ratón entre carriles; la preparación registró 0 fines en las dos canciones medidas.

Capturas y video del usuario: `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\` en el equipo Windows (no están en el repositorio). Guías ejecutadas: solo el caso 1 de la feature 1 de 0.2.3; el resto sigue sin ejecutar.

## Entorno

- Equipo: Windows 11 Pro 10.0.26200.
- App **instalada** desde una compilación local de `version-0.2.3` (`npm run build` + `npm run empaquetar`, NSIS): `Shinobi Karaoke 0.2.3-alpha.1 (local, sin número, commit c6c0ba8)`, comprobado en Ajustes › Acerca de y en `app.log`.
- Datos: carpeta real `C:\Users\Gogo\AppData\Local\ShinobiKaraoke`, con copia completa previa en `…\Local\ShinobiKaraoke-copia-2026-11-23-antes-de-0.2.3` (28 463 archivos, 7 221 642 796 bytes, iguales a los del original).

## I-1 · El editor se queda en negro al arrastrar una región al carril de otro cantante

- **Guía y paso:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), caso 1 (reparto de un dúo real), durante el reparto con ratón; el gesto es el del caso 2, paso 2.1 (arrastrar el cuerpo de una región al carril de otro cantante).
- **Gravedad:** alta. Bloquea el caso 2 y obliga a reiniciar la app. Ocurrió **2 veces**.
- **Qué hizo el usuario:** en el editor de un dúo real con reparto activo, arrastró una línea del carril del cantante 1 hacia el carril del cantante 2.
- **Esperado (C1-E14):** la región se asigna al carril de destino sin cambiar tiempos.
- **Ocurrido:** toda la ventana queda vacía, con el fondo oscuro de la app; solo siguen la barra de título y el menú (Archivo, Edición, Ver). No hay mensaje de error. Captura del usuario: `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\pantalla editor en negro.png` (no copiada al repositorio).
- **Canción:** `46700fe1-9c89-4dc4-a1a8-69ca20d8b555` (borrador, preparada sola: «lista para revisar (dudosas=7)»). Estado en disco tras el fallo: 36 líneas con `inicio_ms` y `fin_ms`; `partes.cantantes` = `c1` y `c2`, sin `todos` ni `coro` declarados; líneas 5, 6 y 10 en `c2`, línea 8 en `todos`, el resto sin `parte` (cantante 1). Carriles visibles, por tanto: cantante 1, cantante 2 y Todos, con la franja «Suelta aquí para un cantante nuevo» durante el arrastre. El `cancion.json` es válido: las asignaciones anteriores se guardaron y el fallo no lo corrompió.
- **Registro de la app** (`registros\app.log`, hora UTC; el fallo cae entre las 22:31 y las 22:39):

  ```
  2026-11-23T22:03:24.002Z [INFO] [arranque] Shinobi Karaoke 0.2.3-alpha.1 (local, sin número, commit c6c0ba8)
  2026-11-23T22:31:03.892Z [INFO] [letras] búsqueda cancion=46700fe1-… candidatos=7 duracion_ms=855 error=-
  2026-11-23T22:31:48.779Z [INFO] [preparacion] preparacion 46700fe1-…: lista para revisar (dudosas=7)
  2026-11-23T22:33:21.158Z [INFO] [arranque] Shinobi Karaoke 0.2.3-alpha.1 (local, sin número, commit c6c0ba8)
  2026-11-23T22:33:21.281Z [INFO] [runtime] Comprobación barata del runtime: correcta (73 ms)
  ```

  **El registro no recoge nada del fallo**: ni error ni aviso, solo el arranque siguiente. `worker-2026-11-23.log` tampoco.
- **Lectura del código (sin ejecutar, para orientar a quien lo arregle):**
  - Medido: el proceso de la ventana no se cayó (el menú sigue y main no registró `render-process-gone`). La ventana vacía con el fondo de la app es lo que deja React cuando una excepción durante el renderizado desmonta el árbol.
  - Medido: en `app/src` no hay ningún límite de errores (`ErrorBoundary`/`componentDidCatch`) ni un manejador que lleve los errores del renderer a `app.log`. Por eso no hay mensaje ni registro. Es un segundo defecto, independiente de la causa: un fallo de interfaz deja la app en negro y sin rastro.
  - Supuesto: la excepción nace en el arrastre entre carriles de `PistaSincronia.tsx` (`alMoverRegion` → `setArrastre`, filas virtuales de `filas`, `solapaAl` al pasar sobre un carril, `alArrastrar` que cambia el alto del editor). No se ha reproducido con consola abierta: **falta el mensaje y la pila de la excepción**.
- **Intentos de reproducción automática** (Playwright-Electron sobre `out/` de `c6c0ba8`, datos temporales, prueba temporal ya borrada; ratón real de Playwright sobre el cuerpo de la región):
  - Medido: **no existe ninguna prueba E2E que arrastre una región con el ratón entre carriles** (`editor-reparto.spec.ts` asigna con teclado y con la fila «Canta»).
  - Semilla («Reparto: dúo con coros» y «Voces a la vez: dúo con coro»), una región de `c1` al carril `c2`, 1280 × 800: **no falla** (2 de 2).
  - Copia temporal de la canción afectada, 1280 × 800 (2 regiones visibles con el zoom inicial), todas las visibles a `c2`: **no falla**.
  - Copia temporal de la canción afectada, 1713 × 1336 y «Ver canción completa» (36 regiones visibles): 36 arrastres a `c2`, 36 a `todos` (con Ctrl + Z tras cada uno) y después la región 0 (`c1`) soltada sobre la franja «Suelta aquí para un cantante nuevo»: **`#root` quedó con 0 hijos una vez** (la misma pantalla vacía). En esa ejecución no se imprimieron los errores capturados. **Repetida 4 veces con captura (`pageerror`, `console.error`, `window.onerror`, `unhandledrejection`): no volvió a vaciarse y no se capturó ninguna excepción.** No es determinista con este guion.
  - Observado sin confirmar: a 1713 × 1336 con la canción completa a la vista, en esas 4 repeticiones la franja «cantante nuevo» no llegó a aparecer durante el arrastre de la región 0 (a 1280 × 800 sí aparece). Puede ser del gesto sintético; conviene mirarlo a mano.
- **Tercera vez (17:14, hora local):** el usuario informa de la pantalla en negro otra vez, ahora **al hacer doble clic en la línea del cantante 3** (sin arrastre). Reinició la app (`app.log`: arranque a las 23:14:45 UTC; de nuevo sin ninguna entrada del fallo). Con esto el fallo deja de ser «del arrastre»: lo común a las tres veces es el editor con reparto y un puntero sobre la línea de tiempo.
  - Estado de la canción en disco unos minutos después: `partes.cantantes` = `c1`, `c2`, `c3` (sin nombre y **sin ninguna línea**) y `c4` (sin nombre, con 1 línea, la 20.ª). Poco después el usuario ya había quitado esos cantantes. Es decir, durante la sesión hubo un tercer y un cuarto cantante creados sin querer (ver M-2).
  - Reproducción automática sobre una copia temporal con ese estado recreado (`c3` vacío y `c4` con una línea; y también `c3` con una línea): un clic y doble clic en la región del cantante añadido, doble clic en tres puntos de cada carril (`c1` a `c4`, Todos, Coro) y en sus etiquetas, y doble clic en la fila de la lista: **no falla** (0 errores capturados, `#root` intacto).
  - Lectura: en una sesión recién abierta no se reproduce con ninguno de los gestos; el fallo necesita algo que se acumula en una sesión real de trabajo (supuesto: historial de deshacer, audio sonando, revisión guiada abierta, cantantes añadidos y quitados, o el zoom de la línea de tiempo). **Hace falta capturarlo en vivo.**
- **Cuarta vez (hacia las 17:30, hora local):** pantalla en negro al hacer clic, en Estilo › «Letra en pantalla» › «Varias voces», en la opción de zonas («Cada una en su zona»). Sin arrastre y sin tocar la línea de tiempo. Estilo de la canción en disco en ese momento: `pantalla` = 6 líneas, 1 pasada, transición «desplazamiento», `zonas: "una"` (el clic no llegó a guardarse); fuente Atkinson Hyperlegible Next; fondo degradado radial; colores propios para `c2` y `todos`. `app.log`: nada.
  - Valoración del usuario: «parece que es al refrescar el editor, después de usarlo un tiempo; aún no hay causa específica»; «parece que son crash constantes» (4 en algo más de una hora de uso).
  - Lectura: los cuatro disparadores (arrastrar una región, doble clic en una línea, cambiar «Varias voces») solo tienen en común que **obligan al editor a redibujarse**, y ninguno falla en una sesión recién abierta. Supuesto: una excepción que depende de algo acumulado durante el uso (no del gesto). Un intento de reproducir el clic de Estilo sobre una copia temporal no llegó a ejecutarse (la prueba temporal no encontró el control) y se abandonó.
- **Pendiente:** el mensaje y la pila de la excepción, capturados en una sesión real del usuario (build sin empaquetar sobre una copia temporal de la biblioteca, con el puerto de depuración escuchado desde esta sesión). Y, aparte de la causa, lo ya dicho: sin límite de errores ni registro del renderer, cualquier excepción deja la app en negro sin rastro.

## I-2 · Al pausar en el editor, la vista previa muestra un instante anterior al del cabezal

- **Guía y paso:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), caso 1, mientras se escucha el dúo ya repartido en el editor (no es un paso numerado: es el uso normal de reproducir y pausar). Falta saber si ocurre también sin reparto (sería entonces de 0.2.2 o anterior).
- **Gravedad:** media (supuesto: no afecta a los datos; confunde al ajustar la sincronía). Por confirmar si es intermitente.
- **Qué hizo el usuario:** reprodujo la canción en el editor y pulsó pausa.
- **Esperado:** la vista previa queda en el mismo instante que el cabezal y el contador del transporte.
- **Ocurrido:** en palabras del usuario, la pausa «no muestra exactamente dónde está el reproductor, se va al pasado». Captura: `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\Pausa no sincroniza reproductor.png` (no copiada al repositorio).
- **Lo que se lee en la captura** (medido sobre la imagen):
  - Transporte en pausa: `00:23.3 / 04:01`; el cabezal de la línea de tiempo está entre la región de la línea 1 y la de la línea 2.
  - Línea 1: inicio `00:19.83`, fin `00:22.25` (panel Sincronía). Línea 2: inicio `00:24.16`.
  - La vista previa muestra la línea 1 **a medio barrer** (solo la primera palabra en el color de lo cantado) y la línea 2 debajo, sin empezar. A los 23,3 s la línea 1 terminó hace más de 1 s: ese barrido corresponde a un instante entre 19,83 y 22,25 s, es decir, entre 1 y 3,5 s **antes** del cabezal.
  - La lista de líneas tiene seleccionada la línea 1 y el panel dice «Línea 1 de 36», también por detrás del cabezal.
  - Contexto: canción `46700fe1-9c89-4dc4-a1a8-69ca20d8b555`, borrador con reparto (cantante 1, cantante 2, Todos), escucha «Original», velocidad 1×, ventana de unos 1718 × 1386, banner «Revisión terminada» abierto (el editor se abrió en revisión guiada).
- **Registro de la app:** sin entradas entre el arranque de las 22:41:27 UTC y la captura (23:02 UTC). El renderer no escribe en `app.log`.
- **Ampliación (17:06, dos capturas más y respuesta del usuario):** pausó con el **botón** y dice que pasa **siempre**. Capturas `Pausa no sincroniza reproductor (2).png` y `(3).png`:
  - Pausa en `00:31.9` y pausa en `02:06.0` (cabezal sobre la línea 20 aprox., en el carril del cantante 2).
  - En las **tres** capturas la vista previa es **idéntica**: la línea 1 con su primera palabra barrida y la línea 2 debajo, y el panel dice «Línea 1 de 36» con la línea 1 seleccionada.
  - Lectura (medida sobre las imágenes): al pausar, la vista previa no se queda «un poco antes» del cabezal; **vuelve a la línea seleccionada** (la 1), en un punto fijo de su barrido, esté donde esté el cabezal (a 2 min de distancia en la tercera captura). La selección tampoco sigue al cabezal durante la reproducción.
  - Supuesto: puede ser el comportamiento previsto de la vista previa en pausa (mostrar la línea seleccionada) y que lo que falte sea que la selección siga al cabezal, o que en pausa mande el cabezal. Lo decide el diseñador con la spec 06; para el usuario es un fallo: pausa para ver dónde va y ve el principio de la canción.
- **Sin investigar en el código.** Queda por saber si ocurre en una canción sin reparto y en 0.2.1 (sería anterior a esta versión).

## M-1 · Mejora pedida: que se vea de antemano quién canta después

- **Guía y paso:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), caso 4 (legibilidad en pantalla), paso 4.1 («se sabe quién canta de un vistazo»), con el dúo real en el reproductor.
- **No es un fallo de lo especificado:** es una petición de cambio de diseño. Registrada como propuesta [040](../../propuestas/040-anticipar-quien-canta-despues.md) para que el usuario y el diseñador decidan.
- **Lo que pide el usuario:** «no se sabe quién cantará después; lo conveniente es que se ilumine de antemano el cantante que cantará, no que se quede solo en gris/opaco».
- **Lo que se ve en la captura** (`No se sabe cual sera el siguiente cantante en cantar.png`): reproductor en pausa a los `00:23`, entre el fin de la línea 1 (22,25 s) y el inicio de la línea 2 (24,16 s). Zona del cantante 1 arriba con dos líneas y zona del cantante 2 abajo con otras dos; las cuatro líneas y las dos insignias tienen la misma atenuación, sin nada que distinga que la siguiente en entrar es la del cantante 1.

## M-2 · Mejora pedida: no crear cantantes arrastrando

- **Guía y paso:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), caso 2, paso 2.4 (arrastrar una región a «Suelta aquí para un cantante nuevo»).
- **No es un fallo de lo especificado** (el paso 2.4 espera justo eso): es una petición de cambio. Propuesta [041](../../propuestas/041-anadir-cantantes-solo-desde-funciones.md).
- **Lo que pide el usuario:** que no se pueda añadir otro cantante arrastrando; «es mejor que desde Funciones se controle todo eso».
- **Captura** (`Cantantes y coros cambio.png`, ilustrativa según el usuario: la canción no tiene cantante 3): arrastre en curso con la franja «Suelta aquí para un cantante nuevo» visible bajo los cantantes, y un «Cantante 3» con 1 línea ya creado, con carril propio y fila en Funciones › «Cantantes y coros». Relación con I-1: la única vez que la reproducción automática vació la pantalla fue al soltar sobre esa franja.

## M-3 · Mejora pedida: carril del Coro opcional

- **Guía y paso:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), uso general de la línea de tiempo con reparto.
- **No es un fallo:** petición de cambio. Propuesta [042](../../propuestas/042-carril-del-coro-opcional.md).
- **Lo que pide el usuario:** en una canción sin coros, una casilla para activar o desactivar la línea de tiempo del Coro; «no todas las canciones lo necesitan».
- **Captura** (la misma): carril «Coro» vacío («Arrastra aquí las líneas de Coro») y fila «Coro · Sin líneas» en Funciones.

## I-3 · Editor preciso: tras doble clic en una palabra con la canción sonando, el cabezal va a la palabra y al cabo de 1,5 s salta de vuelta a donde estaba

- **Guía y paso:** fuera de las guías de 0.2.3 (editor preciso de palabras, anterior a esta versión); visto durante el caso 1 de [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md) al ajustar una línea de «Todos». Falta saber si pasa igual en 0.2.1.
- **Gravedad:** media (no toca datos; impide escuchar la línea desde una palabra mientras la canción suena).
- **Qué hizo el usuario:** con «Editor preciso · Línea 9 de 36» abierto y la canción **reproduciéndose**, hizo doble clic en la palabra 1 de la línea «para reproducir desde ahí». Lo hizo dos veces.
- **Esperado por el usuario:** que la reproducción siga desde esa palabra.
- **Ocurrido:** el cabezal va al principio de la palabra, suena aproximadamente 1,5 s y **salta de vuelta** al punto donde estaba antes del doble clic (más ~0,25 s), y sigue desde ahí hasta pasar a la línea siguiente.
- **Video del usuario:** `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\Editor de palabra al dar doble click para reproducir desde ahi luego salta a otra.mp4` (11,5 s, 2560 × 1440, no copiado al repositorio).
- **Medido sobre el video** (un fotograma cada 0,5 s; la posición del cabezal se convierte a tiempo con la escala del propio diálogo, 58,32–64,57 s, error estimado ±0,1 s). Palabra 1: inicio `00:58.82`, fin `00:59.06` (0,24 s).

  | Instante del video | Cabezal (tiempo de la canción) | Qué pasa |
  |---|---|---|
  | 0,0–1,5 s | 61,5 s, quieto | En pausa |
  | 2,0–5,5 s | 61,6 → 63,5 s | Reproduciendo de forma continua |
  | 6,0 s | **58,7 s** | Primer doble clic en la palabra 1: el cabezal va justo antes de su inicio |
  | 6,5–7,0 s | 59,0 → 59,2 s | Suena desde la palabra |
  | 7,5 s | **63,7 s** | Salto: vuelve a donde estaba a los 5,5 s (63,5 s) + ~0,25 s |
  | 8,0 s | 64,0 s | Sigue desde ahí |
  | 8,5 s | **58,7 s** | Segundo doble clic en la palabra 1 |
  | 9,0–9,5 s | 59,0 → 59,2 s | Suena desde la palabra |
  | 10,0 s | **64,2 s** | Salto de vuelta (64,0 s + ~0,25 s) |
  | 10,5–11,0 s | 64,5 → 64,8 s | Sale de la línea; la vista previa pasa a las líneas siguientes |

- **Lectura:** las dos veces el patrón es idéntico: se escucha un tramo corto alrededor de la palabra y la reproducción **retoma la posición anterior**. Supuesto, sin mirar el código: el clic en una palabra lanza una escucha corta de esa palabra («Escuchar al ajustar» está en el panel) y, al terminar, restaura la posición de la reproducción que estaba en marcha. Si es así, funciona como se diseñó con la canción en pausa, pero con la canción sonando el resultado es un salto que el usuario lee como fallo. Lo decide el diseñador con la spec 06: o el doble clic «reproduce desde aquí» y no vuelve, o la escucha corta no debería retomar una reproducción en marcha.
- **Confirmado por el usuario (2026-11-23):** lo esperado es que **el doble clic en una palabra reproduzca desde ahí y no vuelva**. Queda como fallo (o como cambio de comportamiento, si la spec 06 dice otra cosa), no como duda de diseño.
- **No medido:** el audio (no se ha escuchado), ni si el salto ocurre también con un solo clic o con la canción en pausa.
- **Registro de la app y escucha de errores:** sin excepciones ni errores de consola en ese rato.

## Ejecución · primer dúo real completado (2026-11-23, hacia las 18:40)

- **Guía:** [Feature 1 · Cantantes por línea](feature-1-cantantes-por-linea.md), caso 1 (repartir un dúo real de principio a fin), con ratón. **Completado**: el usuario terminó la canción «sin ningún problema aparente».
- **Estado final en disco** (canción `46700fe1-…`): `estado: lista`; 36 líneas, todas con inicio, fin y tiempos por palabra; reparto de 2 cantantes con nombre: 14 líneas del cantante 1, 9 del cantante 2 y 13 de Todos; sin coro; ninguna línea empieza antes de que acabe la anterior (sin voces a la vez); «Varias voces» = cada una en su zona.
- **Observaciones del usuario:**
  - «Todas las líneas se ajustaron a mano»: la sincronía que dejó la preparación desatendida (letra de LRCLIB, «lista para revisar», 7 dudosas) no bastó. Dato para la calibración de las features 4, 5 y 11 de 0.2.2. Falta preguntar cuánto se desviaba.
  - «Tuve que volver a corregir la letra para añadir y separar secciones». Falta preguntar si al corregir la letra se conservaron los tiempos y el reparto de las líneas tocadas (relacionado con la propuesta 039).
- **No anotado por el usuario:** el tiempo que tardó en repartir (paso 1.4).
- **Estabilidad:** tras las 4 pantallas en negro de I-1 (entre las 16:30 y las 17:30), **más de una hora de edición continua sin ningún fallo**, con la escucha de errores conectada desde las 17:30: 0 excepciones, 0 errores de consola, memoria de la interfaz estable (104–122 MB). I-1 sigue sin causa.
- **Respuestas del usuario (después):**
  - Al corregir la letra para añadir y separar secciones, **las líneas tocadas conservaron sus tiempos y su cantante**; solo hubo que asignar el inicio a las líneas nuevas. Correcto.
  - Tiempo de reparto (paso 1.4): **unos 30 minutos** sin contar pausas, para una canción de 4:01 y 36 líneas. La guía da como referencia «unos pocos minutos para una canción de 4 min»: queda muy por encima. Ese rato incluye las 4 pantallas en negro de I-1 y los cantantes creados sin querer (M-2); el usuario no ha separado cuánto fue repartir y cuánto ajustar.
  - El ajuste a mano de la sincronía automática lo valorará con otra canción (pendiente).

## M-4 · «Ajustar los silencios» corta la línea en una pausa interior (verificado: es la regla diseñada)

- **Guía y paso:** fuera de las guías de 0.2.3; corresponde a la [calibración de silencios](../0.2.0/fase-5-calibracion-de-silencios.md) y a las features 5 y 11 de 0.2.2 (fines de la preparación). Visto al ajustar a mano varias canciones reales.
- **Lo que dice el usuario:** «sugiero respetar los tiempos de inicio que ya da la letra»; «se salta la regla en ajustar silencios: a veces en una sola línea hay un silencio y luego sigue la última palabra antes del inicio que nos dio la línea siguiente». Pidió verificar si es parte del ajuste automático y del algoritmo de silencios.
- **Verificado en el código** (`app/src/shared/silencios.ts`): **sí, es el algoritmo, y hace lo que se diseñó.** `buscarFinVoz` devuelve el fin de la voz anterior al **primer** silencio de al menos 400 ms dentro de la ventana de la línea (de su inicio al inicio de la siguiente), más 100 ms de margen. No mira si después de esa pausa vuelve a haber voz antes del inicio siguiente. Lo usan el botón «Ajustar los silencios» del editor y los fines de la preparación desatendida (`servicio.ts`, `pasoFines`).
- **Los inicios no se tocan** (verificado): ni «Ajustar los silencios» ni la preparación cambian `inicio_ms`. En las 8 canciones modificadas hoy `offset_ms` vale 0 y no hay `desfase_corregido_ms`: la preparación no desplazó ninguna letra. Los inicios que hay son los de LRCLIB o los que puso el usuario.
- **Aclaración del usuario:** lo de «respetar los inicios» viene de que ha visto **desfases en un par de canciones** y preguntaba si hay algún ajuste automático después de que la API da los inicios. Respuesta verificada: existe uno solo, la corrección de desfase de la preparación (features 4 y 5 de 0.2.2): si la comprobación con la voz da el veredicto «desfasada», la letra se guarda con un `offset_ms` global (los `inicio_ms` no cambian) y se anota en `desfase_corregido_ms`. **En esta biblioteca no se ha aplicado nunca**: de las 21 canciones, 0 tienen `offset_ms` distinto de 0, `desfase_corregido_ms` o `preparacion.desfase_ms`. Los desfases que vio vienen, por tanto, de los tiempos de LRCLIB frente a su audio (supuesto: otra edición o un vídeo con introducción distinta), y la comprobación con la voz **no los detectó o no los corrigió**. Falta que el usuario diga qué canciones para medir su desfase con `calibrar:encaje` (dato para el caso 1 de la guía de la feature 4 y el caso 9 de la feature 5).
- **Medido** (solo lectura sobre la biblioteca real, mismo algoritmo y parámetros, voz detectada desde `pistas/voz.flac` en bloques de 10 ms; sin escuchar). «Queda voz» = 150 ms o más por encima del umbral entre el fin que calcula el algoritmo y el inicio de la línea siguiente:

  | Canción | Líneas con siguiente | El algoritmo encuentra un silencio | Queda voz después | Casos mayores |
  |---|---|---|---|---|
  | `f9b6d795` | 43 | 14 | 5 | 180–310 ms |
  | `8eb78deb` | 41 | 12 | 7 | 150–570 ms |
  | `76299aed` | 29 | 5 | 1 | 150 ms |
  | `46700fe1` | 35 | 20 | 6 | 200–400 ms |
  | `4cad645e` | 27 | 4 | 4 | 2 380 y 1 517 ms |
  | `701572c1` | 24 | 11 | 4 | 6 828, 4 600, 4 330 y 4 220 ms |
  | **Total** | 199 | **66** | **27** (41 %) | |

  En las líneas con `origen_fin: silencios` o `preparacion`, el fin guardado coincide con el calculado aquí (diferencias de 10 a 300 ms por el tamaño de bloque), así que la medida reproduce lo que hizo la app. En `701572c1` y `4cad645e` el usuario ya había corregido a mano varios de esos fines (el guardado está segundos después del que daría el algoritmo).
- **Límite de la medida:** «voz después» también cuenta respiraciones, restos de la separación y la entrada adelantada de la línea siguiente. Los casos de 150–300 ms pueden ser eso; los de más de 1,5 s (6 líneas) son, con poca duda, texto de la misma línea.
- **Registrado** como propuesta [043](../../propuestas/043-fin-de-linea-tras-la-ultima-voz-antes-del-inicio-siguiente.md) (cambia una regla de un ADR aceptado: lo deciden el usuario y el arquitecto).

## Medida · versión automática frente a la ajustada a mano (2026-11-23, con red real autorizada por el usuario)

> Dato para las calibraciones pendientes de 0.2.2: [feature 4](../0.2.2/feature-4-comprobar-la-letra-con-la-voz.md) caso 1, [feature 5](../0.2.2/feature-5-preparacion-desatendida.md) caso 9 y [feature 11](../0.2.2/feature-11-revision-guiada.md) caso 1. Solo cifras: ni texto de la letra ni títulos.

- **Canciones:** `46700fe1` (dúo, 4:01, vídeo `Z4BPMfYLQRc`, LRCLIB `8558385`) y `701572c1` (4:13, vídeo `Xm5P_LrMipA`, LRCLIB `4124109`). Las dos ya estaban en la biblioteca desde esos mismos vídeos (`fuente.youtube_id` coincide con los enlaces que dio el usuario), así que **no se volvieron a descargar ni a separar**: el audio es el mismo y el cálculo es determinista.
- **Método:** red real solo contra LRCLIB (`GET /api/get/{id}` y `/api/search` con título y artista; 4 peticiones, HTTP 200, 234–378 ms). La letra recibida se convierte con el `lrcALetra` de la app; el encaje se calcula con `evaluarEncajeConPicos` y los fines con `proponerAjusteSilencios` (variante prudente de la preparación) sobre la caché de picos de la propia canción. Se compara con el `cancion.json` actual, en solo lectura. Las líneas se emparejan por texto normalizado.
- **Límite:** la «versión automática» es una **reconstrucción** con el código de `c6c0ba8`, no una copia de lo que la app guardó en su día. En los fines no coincide con el registro: `preparacion.fines.lineas` vale 0 en las dos canciones, mientras que la regla prudente pondría 19 y 9. Supuesto: la letra se eligió con la vista Letra abierta (`aplicarFinesPreparacion` no escribe si la canción está en edición) o ya no estaba `intacta`. Los inicios sí son comparables sin reservas.

### Resultados

| | `46700fe1` (dúo) | `701572c1` |
|---|---|---|
| Resultados de LRCLIB (sincronizados) | 7 (7) | 1 (1) |
| Duración del registro frente al audio | 242 s frente a 241,85 s (−147 ms) | 253 s frente a 253,37 s (+373 ms) |
| Líneas LRCLIB → final | 35 → 36 | 25 → 25 |
| Líneas con el mismo texto | 34 (una línea partida en dos) | 25 |
| Palabras LRCLIB → final | 167 → 167 | 181 → 181 |
| **Encaje de la app sobre la letra de LRCLIB** | **`no_coincide`** (F 0,917 · I 0,886 · desfase medido −40 ms) | **`no_coincide`** (F 0,804 · I 0,72 · desfase medido **+340 ms**, con el que I sube a **1,00**) |
| Encaje de la app sobre la letra final | `coincide` (+20 ms) | `coincide` (+80 ms) |
| **Inicios, final − LRCLIB** (mediana · media · mín · máx) | **+120** · +136 · −224 · +610 ms | **+460** · +439 · −290 · +860 ms |
| Inicios movidos ≤ 100 ms / 101–300 / 301–1000 / > 1000 | 15 / 13 / 6 / 0 (de 34) | 1 / 8 / 16 / 0 (de 25) |
| Inicios sin tocar | 1 | 0 |
| **Fines, final − automática** (mediana · mín · máx) | **−150** · −709 · +666 ms | +373 · −703 · **+5 347** ms |
| Fines adelantados / atrasados más de 100 ms | 24 / 3 | 9 / 16 |
| Fines movidos más de 1 s | 0 | 7 (seis de 4,0 a 5,3 s) |
| Tiempos por palabra hechos a mano | 36 líneas, 167 palabras | 0 |
| Reparto | 14 / 9 / 13 (cantante 1 / cantante 2 / Todos) | sin reparto |

### Lectura

1. **No son ediciones distintas de la canción.** La duración del registro de LRCLIB y la del audio difieren 0,15 y 0,37 s. El desfase que vio el usuario no viene de una introducción más larga: es la sincronía de la propia letra.
2. **La letra de LRCLIB va adelantada de forma sistemática.** En `701572c1` casi todo (23 de 25 inicios) se movió hacia más tarde, con mediana +460 ms: es un **desfase global**. La app lo mide (+340 ms, y con él la señal de inicios pasa de 0,72 a 1,00) pero **no lo corrige porque `desfaseMinimoMs` vale 500 ms**; además, sin corregir, da `no_coincide` y no elige la letra sola (el registro de la canción lo confirma: `busqueda.no_elige: "duda"`, la eligió el usuario). Con el desfase aplicado, 16 de los 25 inicios habrían quedado a 300 ms o menos de donde los dejó el usuario (hoy son 9).
3. **Un adelanto de solo 130 ms basta para suspender la comprobación.** En `46700fe1` el texto es el mismo, la duración coincide y los inicios están a una mediana de 120 ms de los definitivos, pero la app da `no_coincide` (I = 0,886 frente al mínimo 0,90: la ventana de 400 ms tras cada inicio no encuentra voz en 4 de 35 líneas). Con la letra final, `coincide`. Dato para subir la tolerancia de la señal de inicios o medirla con un pequeño adelanto.
4. **El trabajo de texto fue pequeño; el de tiempos, casi todo.** En el dúo solo cambió una línea (partida en dos) y ninguna palabra; el usuario tocó 33 de 34 inicios, todos los fines y puso tiempo a mano a 167 palabras. En la otra canción, el texto no cambió y se tocaron los 25 inicios y los 25 fines.
5. **Los fines automáticos quedan largos en lo normal y cortos donde hay pausas.** En el dúo el usuario adelantó 24 de 34 fines (mediana −150 ms): la regla deja la línea un poco más larga de lo que él quiere (margen de cola de 100 ms más el tamaño de bloque). En `701572c1`, en cambio, 7 fines se atrasaron más de 1 s: tres porque la regla cortó en la primera pausa interior (líneas 5, 9 y 21: 4,0–4,4 s antes; es M-4) tres porque el fin automático (el inicio del elemento siguiente de la letra) llegaba 4,6–5,3 s antes de donde el usuario puso el fin (líneas 8, 17 y 18), y uno de 1,0 s en la última línea.
6. **Confirmado por el usuario: en todas las canciones de hoy la app le mandó elegir la letra entre las opciones.** Ninguna llegó sola a «Lista para revisar» por elección automática. Cuadra con lo medido: las dos letras dan `no_coincide` aunque son la letra correcta, de la misma duración y con el mismo texto, así que `elegirLetra` no elige (ADR 0025 §3, condición 3). Es el resultado real del caso 1 de la guía de la [feature 5](../0.2.2/feature-5-preparacion-desatendida.md) («un vídeo llega solo a Lista para revisar», criterio de «hecha») con las canciones del usuario: **0 de 7** canciones con letra de LRCLIB añadidas hoy. Causa medida en estas dos: letras de LRCLIB adelantadas entre 130 y 460 ms, por debajo de los 500 ms a partir de los cuales la app corrige, pero suficientes para suspender la señal de inicios.
7. **Sigue pendiente:** por qué la preparación registró 0 fines en las dos (supuesto: al elegir el usuario la letra desde la vista Letra, la canción está en edición o la letra ya no cuenta como `intacta`, y `pasoFines` no escribe).
