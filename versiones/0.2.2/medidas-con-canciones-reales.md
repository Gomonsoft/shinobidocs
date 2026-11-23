# Medidas con canciones reales (biblioteca del MVP 0.1.0) · 0.2.2

- Fecha: 2026-11-22. Ejecuta: `qa`, Mac M1 (Retina), Node 24, `version-0.2.2`, commit **f2b66bf** (copia limpia con `git worktree`, ya eliminada; ver «Cómo se midió»).
- Material: **18 canciones** de la biblioteca del MVP 0.1.0 del usuario, en una **copia de trabajo** fuera del repositorio. Aquí solo hay cifras: **ningún texto de letra, título, artista ni audio**. Las canciones se nombran «canción 1…18» (tabla de correspondencia abajo).
- Sin red: la app se arrancó siempre con `SHINOBI_E2E=1`, `SHINOBI_LRCLIB_URL=http://127.0.0.1:1` (cerrada) y `preparacion.automatica` apagado. La actualización de yt-dlp salió como «simulada» en el registro y `actualizaciones.ultima_comprobacion` sigue en `null`: no se consultó LRCLIB, YouTube ni GitHub.
- **Advertencia sobre el material**: el usuario avisó de que el estado «Lista» **no** significa «revisada a mano con cuidado» (se puso así por haberlo usado en un entorno real). Además, **16 de las 17 letras con tiempos vienen de LRCLIB (`origen: lrclib`) y casi no tienen fines**: solo una línea por canción lleva `fin_ms` (la última, que añadió el MVP) salvo las canciones 10 y 17, que tienen fines y tiempos por palabra en casi todas las líneas. La canción 9 no tiene ningún fin. Es decir, **la mayoría son «LRC sin fines» sin revisar**, no las «letras propias revisadas con fines» con las que se calibró el ADR 0024. Esto condiciona la lectura de todas las cifras de feature 4 y 11.

| Canción | id (8 primeros) | | Canción | id | | Canción | id |
|---|---|---|---|---|---|---|---|
| 1 | 0928137e | | 7 | 76a5239f | | 13 | ca2bf253 |
| 2 | 18a9c864 | | 8 | 78b9d69d | | 14 | e0cea680 |
| 3 | 24728256 | | 9 | 8275d460 | | 15 | e1b65f41 |
| 4 | 2fec1a9d | | 10 | 8766c2f2 | | 16 | f413b443 |
| 5 | 4dabb6ff | | 11 | 906aeca5 | | 17 | f538b75e |
| 6 | 613de88b | | 12 | b688c62b | | 18 | fd955121 |

## Resumen

1. Las 18 se leen; ninguna «Dañada»; **no se reescribe ningún `cancion.json` al abrir** (suma de control idéntica tras abrir y generar picos). 14 salen «Lista», 3 «Lista para revisar» (7, 8, 9) y 1 borrador sin tiempos (1).
2. **Feature 4 (encaje): las constantes del ADR 0024 NO aguantan con estas 18.** Propias aceptadas **8/17** (el ADR midió 10/10), ajenas aceptadas **6/272** (el ADR: 0/90), y con una letra desplazada ±0,8 s: **0/34 corregidas y 14/34 siguen saliendo «Coincide con tu audio»**. Con «sin fines + prudentes» se corrige el 35 % de los desplazamientos (36/102 con error ≤ 200 ms), pero las ajenas aceptadas suben a 18/272. **El criterio de adopción de los fines prudentes (pregunta 0222): NO se cumple.**
3. **Feature 11 (dudosas)**: 95 de 942 líneas señaladas (**10,1 %**), 13 de 17 canciones ≤ 10 %; 55 «importantes». Dominan `finCorta` (33), `muyCorta` (22) y `finTarde` (19). El 10 % no es concluyente porque no están revisadas: dos canciones con letra que no corresponde al audio (5 y 8) y una con tiempos por palabra (17) aportan 53 de las 95; sin ellas es el 5,5 %.
4. En la app, la corrección de desfase funciona (propone, aplica, un paso de deshacer), pero **con una letra de LRCLIB desplazada ±0,8 s no llega a proponerse** (0/8 casos en 2 canciones; además la lenta dice «La letra coincide con la voz» aun con 3 s de desfase).
5. **Compatibilidad**: esquema 1 (el mismo que 0.2.2); `Preparar` no hace nada con estas letras («NADA_QUE_HACER») porque les falta `letra.intacta`; para probar la parte local hubo que añadirlo en la copia.
6. Reproductor: 5 y 7 líneas con subrayado, en 16:9 y 4:3 aproximado, sin solapes, sin desbordes ni recortes en las líneas reales más largas (83 caracteres, 2 renglones, nunca 3).

## Cómo se midió

- Copia de trabajo `…/shinobi-pruebas-0.2.2/` (la prepara la sesión principal; no se tocó el original). `config.json` con `preparacion.automatica: false`.
- Compilación y lanzamiento desde un `git worktree` temporal de f2b66bf (con `node_modules` y `worker/.venv` enlazados), porque otro programador usaba el árbol principal. Eliminado al terminar.
- La app se gobernó con Playwright-Electron (`_electron.launch`, `SHINOBI_DATOS` apuntando a la copia) desde scripts desechables de la carpeta temporal (no entran en el repositorio). Para las cifras de las secciones 3 y 4 se usaron `npm run calibrar:encaje -- <biblioteca> [--variantes]` y `npm run calibrar:dudosas -- <biblioteca>` tal como están, más un análisis desechable que llama a las mismas funciones de `shared/` (`evaluarEncaje`, `detectarDudosas`, `proponerAjusteSilencios`) para desglosar por canción y variante; no cambia ninguna constante.
- Las pruebas de la app modificaron la copia (offset de las canciones 6, 11, 13, 14; fines y `preparacion` de 7, 8 y 9; estilo de 11 y 18). Al terminar se **restauraron los 18 `cancion.json`** a su contenido inicial (suma de control igual a la del primer arranque). Los `.bak` reflejan el último guardado del MVP, salvo los de 7, 8 y 9 que ahora contienen la versión que yo había marcado como `intacta`. La copia sigue siendo utilizable.
- Trampa que cuesta tiempo: **al abrir la app se crea `biblioteca/.importando/`**; cualquier script que recorra `biblioteca/` sin filtrar nombres con forma de UUID falla (`calibrar:*` ya filtra con `stat`, mis análisis no).

## 1. Preparación de los datos

- **Lectura**: `biblioteca.listar()` devuelve las 18; `danada: false` en todas; ninguna incompleta. Derivadas: 14 `lista`, 3 `borrador` con `estadoPreparacion: lista_para_revisar` (7, 8, 9: LRCLIB sin revisar) y 1 `borrador` con 38 líneas sin sincronizar (canción 1, letra manual sin tiempos). Todas con modalidad «karaoke».
- **No hay migración**: los `cancion.json` no cambian (suma de control de los 18 idéntica tras abrir la app y después de generar los picos). Lo que sí escribe 0.2.2 al arrancar: `config.json` (añade 43 claves (8 de primer nivel) con sus valores por defecto: `actualizaciones`, `alineacion`, `biblioteca`, `copias`, `editor.*`, `exportacion.*`, `preparacion.*`, `reproductor.subrayar_cantado`…; deja `config.json.bak`), y carpetas `electron/`, `trabajos/` y `biblioteca/.importando/`.
- **Picos de la voz**: no se generan al abrir la biblioteca. Los pide el renderer al abrir **el editor** (`PistaOndaVoz.tsx`, `picosBase.ts`) o **la vista Letra** (`usePicosLetra.ts`) y, en separaciones nuevas, el main al terminar (ADR 0024 §2). Para las 18 se llamó a `window.shinobi.picos.solicitar(id)` por IPC y se esperó a `lista`: **0,5–1,5 s por canción, 10 s en total**, sin volver a separar (`pistas/.picos-voz-v1-<hash>.bin`, de 104 a 260 KB). La caché depende de la identidad del archivo `voz.flac` (inodo, tamaño y fechas), así que en la copia hubo que regenerarla; copiar la carpeta de otro equipo no trae picos válidos.
- El recuento de líneas por revisar (`revision` del resumen, pregunta 0241/tarea 0377) **no existe aún en f2b66bf** (la tarea 0377 está en el árbol de otro programador): las tres «Lista para revisar» no muestran recuento en este commit.

## 2. Feature 4 · encaje con `calibrar:encaje`

Comandos: `npm run calibrar:encaje -- <copia>/biblioteca` y `… --variantes`. 17 canciones evaluadas (la 1 no tiene tiempos: «se omite»). Las letras se evalúan con `offset_ms: 0`.

### Cifras (17 canciones, 272 pares, 102 desplazamientos de ≥ 0,5 s)

| Variante | Propias aceptadas | Ajenas aceptadas | Desplazadas recuperadas (script, ±50 ms) | Desplazadas con `desfasada` y error ≤ 200 ms |
|---|---|---|---|---|
| **tal cual** (el criterio principal) | **8/17** (47 %) | **6/272** (2,2 %) | 2/102 | 2/102 |
| sin fines (como un LRC de LRCLIB) | 10/17 (59 %) | 9/272 (3,3 %) | 2/102 | 2/102 |
| sin fines + prudentes | 13/17 (76 %) | 18/272 (6,6 %) | 0/102 | 36/102 |

(El script cuenta «recuperada» con ±50 ms; con fines prudentes todas las `desfasada` caen a 100 ms del desplazamiento aplicado —sesgo constante de −100 ms de esa variante—, por eso el script da 0 y la columna de ±200 ms da 36.)

Desplazamientos, sobre las 17 letras «tal cual», por magnitud (34 casos por magnitud: ±):

| Magnitud | Siguen «coincide» | `desfasada` | `dudosa` | `no_coincide` |
|---|---|---|---|---|
| ±0,4 s | 14 | 0 | 6 | 14 |
| ±0,8 s | 14 | 0 | 2 | 18 |
| ±1,5 s | 11 | 2 | 4 | 17 |
| ±3 s | 5 | 5 | 4 | 20 |

Solo `desfasada` en 7 casos de 102 (canciones 6, 10 y 14), con error de 20 a 320 ms. Una letra desplazada un segundo y medio o 0,8 s sigue aceptándose como correcta en un tercio de los casos.

**Criterio de adopción de los fines prudentes (pregunta 0222): NO se cumple.** (a) sin fines, propias < 90 %: sí (59 %); (b) con prudentes, propias ≥ 90 %: **no** (76 %); (c) ajenas = 0 en las tres variantes: **no** (6, 9 y 18). Hay que decir que (c) ya falla con las letras tal cual, sin fines prudentes. La respuesta de la pregunta 0222 dice «si no se cumple, se queda como está»: se queda. Pero ver pregunta 0275 (la corrección de desfase con letras sin fines no funciona) y 0277.

### Frente al ADR 0024 (equipo original: 10/10 propias, 0/90 ajenas, ±0,8 s recuperados salvo la canción sin huecos)

| | ADR 0024 (10 canciones revisadas, con fines) | Estas 18 (LRC de LRCLIB, casi sin fines) |
|---|---|---|
| Propias aceptadas | 10/10 | 8/17 |
| Ajenas aceptadas | 0/90 | 6/272 |
| ±0,8 s corregido | sí (menos en la canción sin huecos) | 0/34 (tal cual y sin fines) |
| Ganancia de F a ±0,8 s | +0,016 a +0,21 | mediana 0,006; ≥ 0,02 (el mínimo para proponer) solo en 6 de 34, todos con `d*` espurio y desfase variable |

**Las constantes no aguantan**, pero las dos medidas **no son comparables sin ajustar**: el ADR midió letras con fines y las canciones reales son LRC sin fines. Dicho esto, el caso «LRC sin fines» **es el del flujo principal de la feature 5** (LRCLIB casi nunca trae fines), así que el resultado cuenta aunque los datos no sean de referencia.

### Por canción (tal cual; F y I en 0–1; `d*` en ms; «var.» = desfase variable; voz % = parte del tiempo entre la primera y la última línea que `detectarVoz` marca con voz)

| Canción | Líneas (con fin / con palabras) | Duración | Voz % | Veredicto | F(0) | I(0) | d* | F(d*) | Ganancia | Var. | Sin fines | + prudentes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 28 (1 / 0) | 193 s | 79 | **no_coincide** | 0,908 | 1,000 | 1300 | 0,910 | 0,002 | sí | no_coincide | no_coincide |
| 3 | 62 (1 / 0) | 192 s | 99 | coincide | 0,988 | 0,984 | 60 | 0,988 | 0,000 | no | coincide | coincide |
| 4 | 113 (1 / 0) | 234 s | 91 | coincide | 0,954 | 0,956 | 0 | 0,954 | 0,000 | no | coincide | coincide |
| 5 | 49 (1 / 0) | 245 s | 77 | **no_coincide** | 0,827 | 0,776 | 3440 | 0,858 | 0,031 | sí | no_coincide | no_coincide |
| 6 | 25 (1 / 0) | 227 s | 70 | coincide | 0,919 | 1,000 | −280 | 0,920 | 0,001 | no | coincide | coincide |
| 7 | 52 (1 / 0) | 264 s | 95 | coincide | 0,982 | 1,000 | 100 | 0,982 | 0,000 | no | coincide | coincide |
| 8 | 50 (1 / 0) | 185 s | 81 | **no_coincide** | 0,950 | 0,740 | 0 | 0,950 | 0,000 | no | no_coincide | no_coincide |
| 9 | 86 (0 / 0) | 186 s | 94 | **no_coincide** | 0,937 | 0,988 | −3560 | 0,951 | 0,014 | sí | no_coincide | coincide |
| 10 | 36 (31 / 36) | 227 s | 65 | coincide | 0,952 | 1,000 | −320 | 0,954 | 0,002 | no | coincide | coincide |
| 11 | 46 (1 / 0) | 161 s | 91 | coincide | 0,955 | 1,000 | 0 | 0,955 | 0,000 | no | coincide | coincide |
| 12 | 36 (1 / 0) | 130 s | 87 | **dudosa** | 0,842 | 0,972 | −940 | 0,866 | 0,024 | no | dudosa | no_coincide |
| 13 | 33 (1 / 0) | 183 s | 97 | coincide | 0,979 | 1,000 | −520 | 0,982 | 0,003 | sí | coincide | coincide |
| 14 | 62 (1 / 0) | 150 s | 93 | coincide | 0,929 | 0,984 | 20 | 0,929 | 0,000 | no | coincide | coincide |
| 15 | 59 (1 / 0) | 325 s | 65 | **no_coincide** | 0,849 | 0,983 | −1500 | 0,872 | 0,023 | sí | no_coincide | coincide |
| 16 | 31 (1 / 0) | 186 s | 70 | **dudosa** | 0,907 | 0,968 | −60 | 0,908 | 0,001 | no | dudosa | coincide |
| 17 | 73 (73 / 73) | 311 s | 79 | **no_coincide** | 0,815 | 1,000 | 120 | 0,819 | 0,004 | no | coincide | coincide |
| 18 | 101 (1 / 0) | 209 s | 92 | **no_coincide** | 0,954 | 0,990 | 720 | 0,956 | 0,002 | sí | coincide | coincide |

### Las 9 que no salen «coincide» y por qué (hipótesis)

- **Canciones 2, 9, 16 y 18 (4 de 9): fallo de la regla de veredicto, no de F/I.** Con `d = 0` ya cumplen F ≥ 0,88 e I ≥ 0,95 (F(0)/I(0): 0,908/1,000; 0,937/0,988; 0,907/0,968; 0,954/0,990). El veredicto se decide en `d*`: en 2, 9 y 18 hay un `d*` espurio de 0,7 a 3,6 s con **ganancia de F ≤ 0,014 (curva plana)** y la mitad primera y segunda de la canción dan `d*` distintos (`desfaseVariable`), y `encaje.ts` (rama «`|d*| ≥ 500` y coincide en `d*` y `desfaseVariable` → `no_coincide`») lo declara «otra versión» aunque `d = 0` ya coincidía. En la 16, `|d*| = 60 < 500` y se usa el veredicto de `d*` (I(d*) = 0,935 < 0,95) en vez del de `d = 0` (I = 0,968): sale `dudosa`. Con el veredicto de `d = 0` cuando no se propone corrección, **12/17 propias** serían aceptadas (en vez de 8/17). Es el mismo síntoma que el ADR vio en la canción rápida (d* = 1180, ganancia 0,002), pero allí el veredicto era `coincide`.
- **Canciones 5 y 8: la letra parece no corresponder a esta versión del audio** (fuera del criterio): 5 tiene I(0) = 0,776, 4 líneas sin voz y 21 s de voz sin letra; 8 tiene I(0) = 0,740 con 5 líneas sin voz y la **última línea acaba 28 s después de la duración del audio**. Son LRC de LRCLIB sin revisar (8 es «Lista para revisar»; 5 es «Lista»).
- **Canción 12**: F(0) = 0,842 con 87 % de voz y un tramo de 2 s con voz sin letra; `d*` = −940 ms (hipótesis: letra con un ritmo algo distinto del audio); dudosa en tal cual y sin fines, `no_coincide` con prudentes.
- **Canción 15**: F(0) = 0,849, `d*` = −1500 ms y la letra se va desplazando (los cuartos de la canción dan `d*` de −820, −1500, −1820 y −2140 ms): **LRC de otra versión con otro ritmo**. Con fines prudentes sale `coincide`.
- **Canción 17**: tiene fines hechos a mano y tiempos por palabra en las 73 líneas; sus **fines sueltos bajan F a 0,815**, y al quitárselos (sin fines) sube a 0,939. Los fines a mano del MVP no son la referencia limpia que se suponía.
- **Densidad de voz (hipótesis principal de las ajenas)**: 8 de las 17 voces tienen ≥ 90 % de voz detectada entre la primera y la última línea (3: 99; 13: 97; 7: 95; 9: 94; 14: 93; 18: 92; 4 y 11: 91). **Las 6 ajenas aceptadas tal cual y las 18 con prudentes usan siempre una voz de ese grupo** (3, 9, 18, 14, 4 y 7). Con la voz cubriendo casi todo el audio, cualquier letra con líneas continuas cubre voz y F sube sin importar el texto; la métrica no discrimina. El ADR 0024 ya lo preveía («la canción rápida sin huecos»), pero en esta biblioteca es la **mitad** de las canciones, no una. Subir el umbral relativo de voz no lo arregla (prueba hecha con `umbralRelativoDb` de −30 a −12 dB: con −16 dB solo 2/17 propias aceptadas y 1 ajena; con −12 dB 1/17 y 0 ajenas).
- Un caso extremo de ajena: la letra de la canción 9 sobre la voz de la 18 sale **`desfasada` con `d*` = +5000 ms (el límite de la búsqueda)**, con F 0,916 e I 0,977: la preparación o la comprobación diferida la **corregirían sola** 5 s. En el ADR, las ajenas tenían F máxima 0,914; aquí hay ajenas con F de hasta 0,989 (canción 3 sobre la voz de la 9), de modo que **ningún umbral de F separa propias de ajenas**.

### Sensibilidad (qué haría falta; solo medido, no recomendado sin decisión del arquitecto)

- `gananciaMinimaF` 0,02 → 0,01 / 0,005 / 0,002: desplazadas corregidas con `desfasada` y error ≤ 200 ms (de 102): tal cual 2 → 3 / 9 / 12; sin fines 2 → 5 / 8 / 10; con prudentes 36 → 44 / 48 / 48; **propias marcadas `desfasada` por error: 0/17 en todos los casos**. En las letras tal cual, bajar la ganancia a 0,005 recupera 9 de 102 y deja 6 `desfasada` con error mayor de 200 ms; **la métrica sin fines es muy poco sensible al desplazamiento** (F apenas cambia porque cada línea ocupa hasta el inicio de la siguiente).
- Con fines prudentes, el sesgo de `d*` es de −100 ms de forma sistemática (30 de 34 dentro de 200 ms a cualquier magnitud), 0 `desfasada` con el signo equivocado.

## 3. Feature 11 · dudosas con `calibrar:dudosas`

Comando: `npm run calibrar:dudosas -- <copia>/biblioteca`. Con las marcas «está bien» ignoradas (aquí no hay). Cifras de `calibrar:dudosas` y desglose de `importantes` (`contarImportantes`) con el mismo módulo.

| Canción | Líneas | Señaladas | % | Importantes | finCorta | finTarde | vozTarde | sinVoz | muyCorta | muyLarga | Tras fines prudentes (señaladas / %) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 28 | 1 | 3,6 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 / 3,6 |
| 3 | 62 | 1 | 1,6 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 1 / 1,6 |
| 4 | 113 | 2 | 1,8 | 2 | 0 | 0 | 2 | 0 | 0 | 0 | 4 / 3,5 |
| 5 | 49 | **15** | **30,6** | 10 | 2 | 4 | 5 | 4 | 0 | 0 | 12 / 24,5 |
| 6 | 25 | 2 | 8,0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 1 / 4,0 |
| 7 | 52 | 2 | 3,8 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 / 1,9 |
| 8 | 50 | **12** | **24,0** | 12 | 0 | 0 | 7 | 5 | 0 | 0 | 16 / 32,0 |
| 9 | 86 | 8 | 9,3 | 1 | 1 | 1 | 0 | 1 | 6 | 0 | 7 / 8,1 |
| 10 | 36 | 1 | 2,8 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 1 / 2,8 |
| 11 | 46 | 2 | 4,3 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 2 / 4,3 |
| 12 | 36 | 3 | 8,3 | 0 | 2 | 0 | 0 | 0 | 1 | 0 | 1 / 2,8 |
| 13 | 33 | 1 | 3,0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 / 0 |
| 14 | 62 | 1 | 1,6 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 / 1,6 |
| 15 | 59 | 8 | 13,6 | 2 | 0 | 7 | 1 | 0 | 0 | 1 | 2 / 3,4 |
| 16 | 31 | 1 | 3,2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 / 0 |
| 17 | 73 | **26** | **35,6** | 24 | 24 | 0 | 0 | 0 | 5 | 0 | 26 / 35,6 |
| 18 | 101 | 9 | 8,9 | 0 | 0 | 2 | 0 | 0 | 7 | 0 | 8 / 7,9 |
| **Total** | **942** | **95** | **10,1** | **55** | 33 | 19 | 15 | 10 | 22 | 1 | 84 / 8,9 |

- **13 de 17 canciones ≤ 10 %** (superan: 5, 8, 15 y 17). **Global 10,1 %** (95/942). Sin las canciones 5 y 8 (letra de otra versión) y 17 (tiempos por palabra hechos en el MVP): **42 de 770 = 5,5 %**.
- **Motivos que dominan**: `finCorta` 33 (24 de ellos en la canción 17: sus fines coinciden con el final de la última palabra y la voz sigue, es decir, el fin de línea hecho por la sincronía por palabras del MVP queda antes que la voz); `muyCorta` 22 (canciones rápidas: 9, 18, 17, 11; > 25 caracteres/s); `finTarde` 19 (7 en la 15 y el resto repartidas: **vienen de los fines automáticos** —`finEfectivo` = inicio de la siguiente— de las letras sin fines); `vozTarde` 15 (en 5, 8, 4 y 15) y `sinVoz` 10 (en 5, 8 y 9): sobre todo letras que no corresponden al audio.
- **Importantes**: 55 de 942 (5,8 %); 46 de ellas en las canciones 5, 8 y 17 y las otras 9 repartidas (una por canción en 2, 3, 7, 9 y 10, y 2 en 4 y en 15).
- Los fines prudentes (la preparación del feature 5) **no bajan el recuento en conjunto** (95 → 84 en total, pero 8 sube de 12 a 16 por `muyCorta`): fijan fines que reducen `finTarde` (19 → 2) y crean `muyCorta` (22 → 32).
- **Lectura**: el criterio «≤ 10 % en canciones ya revisadas» **no se puede dar por cumplido ni por incumplido con estas canciones** (no están revisadas a mano). Lo que sí dice la medida es que, sobre LRC de LRCLIB **sin revisar**, el detector señala poco (5,5 %) donde la letra corresponde al audio y mucho donde no (24–36 %): se comporta como se pretende, y la tasa alta de la 17 es un efecto de sus fines por palabra, no un exceso de umbrales.

## 4. Feature 4 en la app (editor, «Comprobar la letra con la voz…»)

Editor → Sincronía → Funciones → «Comprobar la letra con la voz…» (selectores de `editor.spec.ts`). Se desplazó la letra editando `offset_ms` en el `cancion.json` de la copia con la app cerrada (signo negativo = la letra va adelantada). Se anotan las salidas de la app y el `cancion.json` resultante (solo cifras).

| Canción (ritmo) | `offset_ms` inicial | Resultado de «Comprobar» |
|---|---|---|
| 13 (lenta, 4,7 caracteres/s) | −800 | «La letra coincide con la voz.» (aviso, sin propuesta) |
| 13 | +800 | «La letra coincide con la voz.» |
| 13 | −3000 / +3000 | «La letra coincide con la voz.» |
| 11 (rápida, 16 caracteres/s) | −800 | «La letra no encaja con la voz… No se puede arreglar moviendo toda la letra.» |
| 11 | +800 | «La letra no encaja con la voz… El desfase cambia a lo largo de la canción…» |
| 11 | −3000 / +3000 | «No está claro si la letra coincide…» / «La letra no encaja con la voz…» |
| 14 | ±3000 | **«¿Corregir el desfase de la letra?»: «va 3,0 s atrasada/adelantada»**; al corregir, `offset_ms` = 20 (y `desfase_corregido_ms` = −2980 / +3020) |
| 6 | +1500 / −1500 | «va 1,8 s atrasada» / «1,2 s adelantada»; al corregir, `offset_ms` = −280 / −320 (queda con su sesgo propio, F(0) → d* = −280 ms) |
| 6 | +800 | «La letra coincide con la voz.» |

- **La corrección y el deshacer funcionan** (canciones 14 y 6, 4 casos): el diálogo propone, «Corregir el desfase» escribe `offset_ms` y `desfase_corregido_ms` (sin tocar los tiempos de línea; `intacta` no existía), sale el aviso «Desfase corregido: toda la letra N s…», aparece **[Quitar la corrección]** y **Cmd+Z lo revierte en un solo paso** (`offset_ms` vuelve al valor inicial y `desfase_corregido_ms` desaparece del archivo; queda `desfase_descartado: true`, como dice el ADR 0024 «Revisión 0207»).
- **Lo que no pasa es lo importante**: con ±0,8 s **no se propuso corrección en ningún caso: 0/5 con la letra tal cual** (canciones 13, 11 y 6; «coincide» en 3 y «no encaja» en 2) **y 0/4 tras «Ajustar los silencios»**. La guía (caso 1.3) esperaba «Toda la letra va 0,8 s…; corregir la deja donde estaba (± 50 ms)». Con las dos canciones elegidas **la comprobación da por buena una letra 3 s desplazada** (canción 13: 97 % de voz detectada).
- Se probó también «Ajustar los silencios» del editor antes de comprobar (canciones 13 y 11, ±0,8 s): cambió solo 2 de 33 y 3–7 de 46 líneas (el editor ajusta sobre la letra desplazada) y el resultado no cambió. No se midió la variante de la preparación en el editor.
- La banner «Esta letra va … s respecto a la voz» no salió en ningún caso (solo se muestra en borradores; las canciones usadas son «Lista»).

## 5. Feature 5 · parte local sin red (letra con tiempos y sin fines)

- **«Preparar» no hace nada con estas letras**: `preparacion.previsualizar` y `preparar` devuelven `NADA_QUE_HACER` para las canciones 1, 7, 8 y 9 y `YA_LISTA` para las «Lista». Motivo (`shared/derivados.ts:270-278`): `comprobando` y `ajustando_fines` solo aplican con `letra.intacta === true` y `intacta` **no existe en las letras del MVP** (lo pone main al guardar una letra nueva). Ver pregunta 0278.
- Para medir la parte local se añadió `intacta: true` a 7, 8 y 9 en la copia (aceptable: «puedes editar»). Con eso `previsualizar` da `comprobando` + `ajustando_fines`; `preparar` las acepta y termina en segundos:

| Canción | Fines antes | Fines puestos (`origen_fin: "preparacion"`) | `preparacion.fines` | Señaladas antes → después (importantes) |
|---|---|---|---|---|
| 7 | 1 | 3 | `silencios`, 3 líneas | 2 → 1 (1 → 1) |
| 8 | 1 | 8 | `silencios`, 8 líneas | 12 → 16 (12 → 13) |
| 9 | 0 | 1 | `silencios`, 1 línea | 8 → 7 (1 → 1) |

  Las cifras de después coinciden con las del script (`calibrar:dudosas` con fines prudentes en memoria): 1, 16 y 7. La preparación escribió `preparacion` (`estado: lista_para_revisar`, `origen: manual`, `dudosas`, `dudosas_importantes`) y **retira `letra.intacta`** al fijar los fines (los fines cambian tiempos). Las otras líneas no cambian; los fines puestos son pocos (1–8 de 52–86 líneas): **el modo prudente solo fija el fin donde hay un silencio claro**, el resto sigue como LRC sin fin.
- El recuento por canción (`revision`) no aparece en el resumen de este commit (0377 pendiente); sale en `preparacion.dudosas` del `cancion.json`.
- «Preparar» con letra ausente (búsqueda en LRCLIB) **no se probó**: necesita red.

## 6. Features 1 y 2 · letra en pantalla y subrayado (sin capturas)

Medido con el DOM del reproductor (`[data-linea]`, opacidad > 0,3 como «visible»), muestreando cada 100 ms durante 52 s por configuración (4 ventanas de 13 s alrededor de las 3 líneas **más largas** de la canción y la línea central), con `estilo.letra.subrayar_cantado: true`, transición «Desplazamiento». Canciones: 11 (46 líneas, la más larga: 83 caracteres) y 18 (101 líneas, 63 caracteres, rápida). Aviso: el 4:3 exacto no cupo (la ventana no baja de 1024 de ancho y la pantalla limita el alto); se usó **1024 × 750 (1,37:1)**; el intento de 1440 × 1080 quedó en 1440 × 757 (1,9:1) y su resultado equivale al 16:9.

| Canción | Ventana | Líneas / pasadas | Visibles (mín–máx) | Con 2 renglones (% de muestras·nodo) | Solapes | Fuera de zona (v / h) | Recortes (ancho) | Y mín–máx del bloque (fracción del alto) |
|---|---|---|---|---|---|---|---|---|
| 11 | 1280×720 | 5 / 1 | 5–5 | 16 % | 0 | 0 / 0 | 0 | 0,196–0,753 |
| 11 | 1280×720 | 7 / 2 | 6–7 | 12 % | 0 | 0 / 0 | 0 | 0,149–0,817 |
| 11 | 1440×757 | 5 / 1 | 5–5 | 15 % | 0 | 0 / 0 | 0 | 0,208–0,751 |
| 11 | 1440×757 | 7 / 2 | 6–7 | 11 % | 0 | 0 / 0 | 0 | 0,149–0,808 |
| 11 | 1024×750 | 5 / 1 | 4–5 | 42 % | 0 | 0 / 0 | 0 | 0,173–0,799 |
| 11 | 1024×750 | 7 / 2 | 6–7 | 38 % | 0 | 0 / 0 | 0 | 0,122–**0,862** |
| 18 | 1280×720 | 5 / 1 | 4–5 | 8 % | 0 | 0 / 0 | 0 | 0,199–0,739 |
| 18 | 1280×720 | 7 / 2 | 6–7 | 8 % | 0 | 0 / 0 | 0 | 0,149–0,814 |
| 18 | 1440×757 | 5 / 1 | 5–5 | 0 % | 0 | 0 / 0 | 0 | 0,218–0,723 |
| 18 | 1440×757 | 7 / 2 | 6–7 | 0 % | 0 | 0 / 0 | 0 | 0,166–0,796 |
| 18 | 1024×750 | 5 / 1 | 5–5 | 33 % | 0 | 0 / 0 | 0 | 0,195–0,795 |
| 18 | 1024×750 | 7 / 2 | 6–7 | 30 % | 0 | 0 / 0 | 0 | 0,122–0,853 |

- **Ninguna línea real desborda ni se recorta**: 0 solapes, 0 recortes de ancho y 0 muestras fuera de [9 %, 88 %] de la altura; ninguna línea pasa de 2 renglones (83 caracteres a 1024 de ancho).
- «Visibles 6–7» con 7 líneas es el cambio de línea (una sale mientras otra entra en menos de 0,3 de opacidad): 7–11 % de las muestras; con 5 líneas, 1 muestra de 520 con 4. No hay muestras con menos de 6 (7 líneas) ni de 4 (5 líneas).
- **Anclas**: con 5 líneas el bloque queda entre el 17 y el 22 % (arriba) y el 72 y el 80 % (abajo) del alto; con 7 líneas, entre el 12 y el 17 % y el 80 y el 86 %. Los límites del código son 10 % y 86 % (`pantalla.ts`: `LIMITE_SUPERIOR`, `LIMITE_INFERIOR`): **la canción 11 con 7 líneas en 4:3 llega al 86,2 %**, a dos milésimas del límite (caja del nodo, no del glifo; no es un defecto visible, pero sin margen).
- El cambio 16:9 → 4:3 mueve las líneas largas a 2 renglones (de 16 % a 42 % de las muestras en la 11), y todas siguen cabiendo.
- No se midió fluidez (fotogramas) ni exportación de vídeo; sigue siendo manual (guías de las features 1 y 2).

## 7. Compatibilidad con el MVP 0.1.0

- **Versión de esquema**: `esquema: 1` en las 18 (0.2.2 sigue en `VERSION_ESQUEMA_CANCION = 1`: no hay migración). Claves de primer nivel: `esquema, id, creada, modificada, estado, metadatos, fuente, pistas, letra, estilo, pasos`. `letra`: `origen`, `lrclib_id`, `offset_ms`, `lineas` (cada línea: `id, tipo, texto, inicio_ms, fin_ms, palabras`).
- **Campos de 0.2.x que faltan** (la lectura es tolerante, todo se rellena por defecto): `letra.intacta`, `letra.desfase_corregido_ms`, `letra.desfase_descartado`, `origen_fin` y `revisada` por línea, `metadatos.origen`, `estilo.pantalla`, `estilo.letra.subrayar_cantado`, `preparacion`. Resultado: `Preparar`/comprobación diferida **no se activan** (`intacta` ausente), el recuento de «por revisar» solo existe con `preparacion`, y el reproductor usa 5 líneas, 1 ya cantada y desplazamiento (5.1 de la guía de la feature 1: fecha de `cancion.json` sin cambios tras abrir y reproducir).
- **Al abrir**: nada se reescribe en las canciones. Se crean los picos (`pistas/.picos-voz-v1-*.bin`) y se reescribe `config.json` (43 claves nuevas por defecto, deja `config.json.bak`).
- **`.bak`**: el MVP **ya escribía** `cancion.json.bak` en cada guardado (las 18 lo tienen, 20–209 bytes menores que el actual; contienen la versión anterior al último guardado). 0.2.2 mantiene esa copia: tras «Preparar» el `.bak` de la canción es la versión previa.
- **Al guardar con 0.2.2**: lo escrito es mínimo y aditivo. «Preparar»: añade el objeto `preparacion` y `origen_fin: "preparacion"` solo en las líneas que cambian; no toca `texto`, `inicio_ms` ni `palabras`; retira `intacta`. «Corregir el desfase»: `offset_ms` y `desfase_corregido_ms` (y `desfase_descartado: true` tras quitar la corrección). Reproducir con ajustes de estilo en el editor añadiría `estilo.pantalla` y `subrayar_cantado` (en las pruebas se escribieron a mano y se restauraron). Una línea del MVP no gana ningún campo.
- Dato raro para vigilar (no es defecto de 0.2.2): en la canción 8 la última línea acaba 28 s después de la duración del audio; la app la lee sin quejarse (no se marca «Dañada»), y `finEfectivo` la usa tal cual. Pregunta 0279.

## 8. Prueba técnica 0328 (alineación forzada, feature 10): ¿sirven estas 18?

**No se ejecutó.** Como material:

- **17 de 18** tienen voz separada (`pistas/voz.flac`, modelo «calidad» de Roformer) y letra con tiempos **por línea**; la canción 1 tiene voz pero **no tiene tiempos** (38 líneas sin sincronizar), por lo que serviría como caso «solo texto».
- **Tiempos por palabra**: solo las canciones **10** (36 de 36 líneas) y **17** (73 de 73). Su reparto **no es proporcional a los caracteres** (1 de 27 y 1 de 72 líneas lo parecen), así que no son un reparto automático; el MVP no guardaba su origen (no existe `origen_palabras`), de modo que **no se puede decir si son manuales o de la sincronía por palabras del MVP**, y el usuario ha dicho que no están revisadas a mano con cuidado. Son 109 líneas: muestra pequeña.
- **Advertencia**: sus fines **no son una referencia revisada**: 16 de 17 no los tienen (LRC) y los de la 17 coinciden con el final de la última palabra pero la voz sigue (24 de 73 líneas `finCorta`). Para evaluar la alineación forzada por la **voz** (no por los fines) sirven los inicios de línea, que además en LRCLIB suelen estar bien (el encaje de las canciones 3, 4, 7, 10, 11, 13 y 14 con F(0) ≥ 0,93 y desfase 0 lo apoya). El idioma no se guarda en el `cancion.json`; no se miró el texto.

## 9. Qué cambia en los criterios de «hecha»

**Feature 4** (informe y tarea 0301): el criterio «10/10 propias, 0/90 ajenas, ±0,8 s corregido» **no se da por cumplido; se mide como no cumplido con LRC sin fines** (8/17, 6/272, 0/34), y como **no concluyente** para «letras propias revisadas con fines» (no hay ninguna revisada en esta biblioteca; solo las canciones 10 y 17 tienen fines, y los de la 17 empeoran F). Lo que queda para el usuario es la medida con **canciones que él haya revisado a mano con fines** y la decisión del arquitecto sobre cómo detectar desfases en letras sin fines (pregunta 0275). La parte «propone, aplica y deshace en un paso» **sí está comprobada con canciones reales** (canciones 6 y 14, 4 casos).

**Feature 5** (informe y tarea 0312): el criterio de adopción de fines prudentes **se mide: NO se cumple** (propias prudentes 76 %, ajenas 18/272), y se queda como está, **con la salvedad de que «sin cambios» deja la corrección de desfase ciega en letras de LRCLIB** (pregunta 0275/0277). No se da por cumplido nada que dependa de la red (búsqueda y elección de LRCLIB real), ni los 5 borradores del usuario, ni el número de canciones que caen en «Elige la letra» en una preparación real. Nuevo hallazgo: las **letras de 0.2.1 y del MVP no son elegibles para `Preparar`** (falta `intacta`), así que el rescate de los 5 borradores del usuario no pasaría por ahí aunque tengan letra (pregunta 0278).

**Feature 11** (informe y tarea 0337): «≤ 10 % en las revisadas» **sigue sin poder darse por cumplido ni por incumplido**: se midió el 10,1 % global y 13 de 17 canciones ≤ 10 % sobre letras **sin revisar**, y el desglose por motivo. Se añaden dos reservas medibles: los fines por palabra del MVP generan `finCorta` masivo (24 de 73 líneas) y los fines automáticos (`finEfectivo`) generan `finTarde` (19). Pregunta 0279.

## 10. Defectos y preguntas nuevas

| Pregunta | Para | Resumen | Gravedad |
|---|---|---|---|
| [0275](../../preguntas/0275-la-correccion-de-desfase-no-funciona-con-letras-sin-fines-y-las-constantes-no-aguantan.md) | arquitecto | Con LRC sin fines, F no cambia con el desplazamiento: 0/34 corregidas a ±0,8 s y 14/34 siguen «coincide». Ajenas 6/272. | Alta |
| [0276](../../preguntas/0276-veredicto-no-coincide-con-f0-e-i0-que-ya-coinciden.md) | arquitecto (y programador) | 4 de 17 propias con F(0)/I(0) buenos salen `no_coincide`/`dudosa` por la rama de `d*` y `desfaseVariable`. | Media |
| [0277](../../preguntas/0277-criterio-de-adopcion-de-los-fines-prudentes-no-se-cumple.md) | arquitecto | Resultado de la pregunta 0222: NO. Alternativas medidas. | Media |
| [0278](../../preguntas/0278-las-letras-del-mvp-y-de-0-2-1-no-tienen-intacta-y-preparar-no-hace-nada.md) | arquitecto | `Preparar` y la comprobación diferida ignoran las letras anteriores a 0.2.2 (sin `intacta`). | Media |
| [0279](../../preguntas/0279-dudosas-con-datos-reales-fines-por-palabra-fin-mas-alla-del-audio-y-criterio-del-10.md) | arquitecto | Dudosas con datos reales: `finCorta` por fines por palabra, `muyCorta`, fin más allá del audio, criterio del 10 %. | Baja |

No se encontró ningún **defecto de código** (excepciones, bloqueos, datos perdidos) con datos reales; los hallazgos son de efectividad de las constantes y de compatibilidad. Reproductor, lectura de la biblioteca, picos, corrección/deshacer y la preparación local funcionaron.

## 11. Qué queda de verdad para el usuario

1. Repetir `calibrar:encaje` y `calibrar:dudosas` con **canciones suyas revisadas a mano con fines** (las 10 del ADR), para ver si el criterio «10/10 y 0 ajenas» se cumple con letras con fines, y comparar con estas cifras.
2. Probar **con red real** «Preparar» sobre un borrador sin letra y el lote (guía de la feature 5): elección de LRCLIB, canciones que caen en «Elige la letra», desfase corregido solo.
3. Oído: que una letra corregida (canciones con `desfasada`) suena donde se canta, y la **fluidez** del reproductor a 5/7 líneas (guías 1 y 2); exportación a vídeo.
4. Decidir (con el arquitecto) qué debe hacer la app con letras de LRCLIB sin fines desplazadas (0275) y con las letras anteriores a 0.2.2 (0278).

## 12. Reproducir

1. `git worktree add --detach <ruta> f2b66bf`; enlazar `app/node_modules` y `worker/.venv`; `cd app && npm run build`.
2. Copia de la biblioteca en una carpeta (`config.json` con `preparacion.automatica: false`). Arrancar la app **solo** con `SHINOBI_E2E=1`, `SHINOBI_LRCLIB_URL=http://127.0.0.1:1` y `SHINOBI_DATOS=<copia>` (Playwright-Electron: `_electron.launch({ args: ['.'], cwd: '<ruta>/app', env })`), y llamar `window.shinobi.picos.solicitar(id)` por canción hasta `lista`.
3. `npm run calibrar:encaje -- <copia>/biblioteca [--variantes]` y `npm run calibrar:dudosas -- <copia>/biblioteca`. Las dos imprimen **títulos** (columna final): no los pegues en informes.
