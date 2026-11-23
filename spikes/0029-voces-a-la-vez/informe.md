# Informe de la prueba técnica de voces a la vez (tarea 0356, ADR 0029 §7)

- Fecha: 2026-11-23. Código medido: rama `version-0.2.3`, commit `552fbb2` (instantánea con `git archive`, así que los cambios en curso de otros programadores no mezclan los resultados).
- Equipo: MacBook Air M1 de 8 GB (el de referencia, C1S-R3), macOS, Electron 45.2.2 / Chromium 156. **Con otros tres programadores usando la máquina a la vez**: cifras con ± 30 % de ruido entre rondas (ver §2).
- Datos: una letra **inventada** (`datos/letraInventada.ts`: «Luciérnagas en el tejado», 13 líneas, cantantes Marta e Iván). Ninguna letra ni título reales, sin red, nada escrito en la carpeta de datos del usuario. No hay dúo real anotado por el usuario.

## Veredicto

**SIRVE CON CONDICIONES.** Los tres criterios de ADR 0029 §7 se cumplen; cuatro condiciones (preguntas 0365–0368) hay que resolverlas antes de 0357. Ninguna tumba la feature.

| Criterio | Veredicto | Resumen |
|---|---|---|
| 1 · Regla «inicios crecientes + fin por parte» con los tres patrones; pruebas existentes sin cambios | **Sirve con condiciones** | Los tres patrones caben con un único desvío de 1 ms. De las 908 pruebas existentes que tocan la regla (51 archivos, entre ellas `letra`, `render`, `pantalla`, `encaje`, `dudosas`, `silencios` y `lrc`), **0 cambian de resultado** con el parche. Condiciones: 0365 (0.2.2 rechazaría la canción), 0366 (regla exacta) y 0368 (orden de lectura) |
| 2 · Captura a 1920 × 1080 con 3 zonas ≤ 1,25 × 0.2.2 con 5 líneas; 60 FPS con 4 zonas sin perder fotogramas | **Sirve** | Razón 1,01 con 3 zonas (1,02 con 4, 1,01 con 5). A 60 FPS con 4 zonas: 1 800 fotogramas, 0 sin asentar. Con la salvedad de que el prototipo no es la implementación real de 0364 |
| 3 · Cinco funciones automáticas con comportamiento definido y sin falsos positivos | **Sirve con condiciones** | Silencios y dudosas excluyen, el encaje fusiona, el `.lrc` escribe una sola marca vacía por grupo: 0 falsos positivos en la letra de la prueba (sin adaptador: 4 en silencios, 1 en dudosas, 1 marca de `.lrc` equivocada, 2 falsos en el encaje). La alineación (ADR 0028) no existe todavía: solo se fija la regla. Condición: 0367 |

## 1 · Criterio 1: la regla con los tres patrones

### Qué se probó

La regla (parche en memoria de 5 archivos de `app/src/shared`, sin tocar `app/`; `parche/reglaFinPorParte.mts`, tamaño real con `parche/diff.mts`: **5 archivos, +52 −13 líneas**, de las que ≈ 30 son las tres ayudas nuevas `chocan`, `siguienteQueChoca` y `anteriorQueChoca`):

- Los inicios siguen **estrictamente crecientes en toda la letra** (dos que empiezan a la vez se separan 1 ms).
- El fin **fijado** y las palabras de una línea pueden pasar del inicio de una línea de otra parte, no del de la siguiente que **choca**: misma parte; «Todos» con cantantes pero no con el coro; **una pausa choca con todo**.
- El fin **automático** sigue siendo «hasta la siguiente línea de cualquier parte» (si no, un dúo alterno se solaparía solo). **Esto afina el texto de ADR 0029 §7** (pregunta 0366).

Funciones cambiadas (8 en 5 archivos): `validarInvariantesLetra`, `finEfectivo`, `moverInicioLinea` (`letra.ts`); `limitarFin` (`letras/tiempos.ts`); `cargarBorrador` y `limitesEditorDe` (`letras/palabras.ts`); `normalizarLetra` paso 4 (`letras/normalizar.ts`); `lineasConFinNoValido` (`derivados.ts`). Un parche solo con las tres primeras no basta: `normalizarLetra` (usada por `aplicarTextoEditado`) recortaría los solapes al corregir cualquier coma en la vista Letra, y el editor preciso no dejaría alargar la línea.

### Los tres patrones (`pruebas/criterio1.test.ts`, `datos/letraInventada.ts`)

| Patrón de las referencias | Líneas | Resultado |
|---|---|---|
| Dúo en dos bloques avanzando a la vez | l01–l04 (c1 y c2 con 500 y 200 ms de diferencia) | Válida. Inicios en el orden de la letra, desvío 0 |
| La misma frase por dos cantantes | l05–l06 (mismo texto, mismo inicio) | Válida. l06 se separa **1 ms** (único desvío de toda la letra); «Todos» (l07) no se solapa con c1 ni c2 |
| Coro mientras canta la principal | l08–l12 (l09 dentro de l08; l11 cruza el límite entre l10 y l12) | Válida. Desvío 0 |

Con la regla de 0.2.2 la misma letra da 7 problemas y `letraSchema.safeParse` falla (ver condición 1).

### Pruebas existentes

`regresion.sh`: 908 pruebas de 51 archivos (`shared/letra`, `encaje`, `dudosas`, `silencios`, `derivados`, `coros`, `escucha`, `reparto`, `cancion`, `shared/letras/**` incluidas `lrc`, `palabras`, `tiempos`, `editar`, `normalizar`; `main/letras/**`, `main/copias/**`, `main/preparacion/servicio`, `karaoke/render`, `pantalla`, `PantallaLetra*`, `vistas/editor/estado*`, `lineaTiempo`, `guardado`, `vistas/letra/**`). Sin parche y con parche: **0 pruebas distintas** (una prueba de `paqueteHostil` falló en una pasada de cada modo por carga de la máquina y pasó al repetirla).

Además, una prueba de propiedades con **2 000 letras aleatorias sin solapes** (semilla fija; mitad con partes asignadas al azar, mitad sin ellas), comparando contra el código original: `validarInvariantesLetra`, `finEfectivo` y `moverInicioLinea` dan lo mismo en las 2 000; `ajustarFin`, `fijarFin`, `limitesEditorDe` y `normalizarLetra` dan lo mismo **en las 1 000 letras sin partes**. En las 1 000 con partes, `normalizarLetra` también coincide y solo difieren `ajustarFin` (97), `fijarFin` (26) y `limitesEditorDe` (455): es la libertad nueva de la regla (el fin ahora puede llegar hasta el inicio de la siguiente de SU parte; el aviso `fin_siguiente` ya no salta). No es una regresión.

### Condiciones

1. **0365 · Una canción con solapes no se abre en 0.2.2 ni 0.2.1.** `letraSchema` valida los invariantes **al leer** y `cancion.letra` es `letraSchema.nullable()`: el `cancion.json` entero falla y se vería como dañada. ADR 0029 §6 («0.2.2 lo conserva») deja de ser cierto con solapes. Una canción **sin solapes** sigue abriéndose igual (prueba de propiedades).
2. **0366 · El fin automático y lo que «choca»** (arriba).
3. **0368 · El texto tiene que ir en orden de inicio.** Si el coro está escrito antes que la principal a la que acompaña, la principal tendría que adelantarse 1 501 ms (o reordenar el texto). Con letras de LRC o LRCLIB el orden ya es temporal; con dúos escritos por cantante no. La app no tiene «mover línea».
4. Las líneas con palabras hechas a mano siguen perdiéndolas al mover un inicio (regla de 0.2.2, ADR 0021 §4); no cambia, pero en un dúo se notará más.

## 2 · Criterio 2: coste del render con zonas

### Cómo

El **mismo `AppExportacion` y `PantallaLetra` de producción** (instantánea del commit `552fbb2`) compilados con el Vite de `app/` en una carpeta temporal (no es `npm run build`), cargados en una ventana offscreen de Electron a 1920 × 1080, escala 1, 240 Hz, con la misma doble captura de `ventana.ts` (`capturePage` ×2 y `equals`, hasta 3 reintentos). La única sustitución: `karaoke/zonas.ts` por un prototipo (`rendimiento/zonasPrototipo.ts`, 57 líneas) que reparte la letra en una zona por parte (coro arriba con media altura, cada cantante igual, «Todos» repetido, fin resuelto en la letra entera). 3 rondas por escenario en orden alterno, 10 s de video por ronda (300 o 600 fotogramas), 20 de calentamiento, con una línea activa en cada zona (fines de 3,95 s cada 4 s).

| Escenario | Zonas | Líneas en el DOM (máx.) | FPS | Fotogramas | Pintar (ms) | 1 captura (ms) | Captura real ×2 (ms) | **Fotograma total (ms)** | p95 (ms) | Por ronda (ms) | **Razón total / solo captura vs 0.2.2** | Sin asentar |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| base (0.2.2, 5 líneas) | 1 | 5 | 30 | 900 | 4,1 | 7,6 | 14,0 | **18,2** | 21,9 | 17,0 / 18,6 / 18,8 | 1,00 / 1,00 | 0 |
| z3 | 3 | 6 | 30 | 900 | 4,2 | 7,5 | 14,2 | **18,4** | 22,3 | 17,3 / 18,8 / 19,1 | **1,01** / 0,99 | 0 |
| z4_30 | 4 | 8 | 30 | 900 | 4,2 | 7,6 | 14,4 | **18,6** | 22,8 | 17,1 / 18,8 / 19,9 | 1,02 / 1,00 | 0 |
| z5 | 5 | 10 | 30 | 900 | 4,3 | 7,3 | 14,0 | **18,3** | 22,3 | 17,9 / 17,6 / 19,4 | 1,01 / 0,97 | 0 |
| base_60 | 1 | 5 | 60 | 1 800 | 4,4 | 6,9 | 13,7 | **18,0** | 22,2 | 17,6 / 18,2 / 18,4 | 1,00 / 1,00 | 0 |
| **z4_60** | 4 | 8 | **60** | 1 800 | 4,1 | 7,2 | 14,2 | **18,3** | 22,6 | 18,3 / 18,2 / 18,3 | **1,01** / 1,05 | **0** |
| inventada (la letra de la prueba) | 3 | 5 | 30 | 4 050 | 4,4 | 7,3 | 15,2 | 19,5 | 26,2 | 17,9 / 17,7 / 22,9 | 1,07 / 0,97 | 0 |

(Datos crudos: `rendimiento/medicion-1920x1080.json`; tabla generada con `rendimiento/resumir.mts`.)

### Lectura

- El criterio pide ≤ 1,25 ×. Con 3 zonas el fotograma completo cuesta **1,01 ×** el de 0.2.2 con 5 líneas y la captura sola 0,99 ×; con 4 y 5 zonas, 1,02 × y 1,01 ×. El coste lo domina la captura de 1920 × 1080 (≈ 14 ms de 18), que no depende del número de nodos; pintar son ≈ 4 ms en todos los casos.
- A 60 FPS con 4 zonas: 1 800 fotogramas (3 rondas × 600), **0 sin asentar y 0 reintentos** (1 en el escenario base de 60 FPS). En una exportación cada fotograma se pide por índice, así que «no perder fotogramas» equivale a que ninguno se capture con el cuadro anterior; la doble captura ya lo detecta y no saltó. El ritmo (18,3 ms por fotograma ≈ 55 por segundo) es el mismo que el de 0.2.2.
- Sobre la letra inventada completa (3 zonas, 4 050 fotogramas): 1,07 × con una ronda más lenta (22,9 ms) que coincide con carga de otros procesos; las otras dos rondas dan 17,9 y 17,7. Los 7 reintentos de cuadro viejo se resolvieron todos.

### Modelo (`pruebas/criterio2Modelo.test.ts`, `fotogramaEn` real)

- Las tres referencias dan una línea activa por zona a la vez: A (l01+l02, l03+l04), B (l05+l06; «Todos» l07 repetido en c1 y c2), C (l08+l09, l10+l11, l12+l11). Máximo de zonas activas a la vez en la letra: 2.
- Muestreo cada 10 ms durante toda la canción en cada zona: nunca hay una línea en movimiento sin un único cambio en curso («nunca dos cambios a la vez» se conserva por zona).
- Sin reparto el modelo es idéntico al de 0.2.2 (`toEqual` cada 250 ms).
- **Hallazgo para 0364 y 0360**: el fin **automático** de una línea no puede calcularse dentro de la subsecuencia de la zona: con la subsecuencia cruda una línea de c1 sigue activa hasta la siguiente de c1 aunque otra voz haya entrado en medio. El prototipo resuelve el fin en la letra entera antes de repartir; la 0364 en curso ya hace lo mismo (`conFin` en `zonas.ts`).

### Límites de esta medida

- No es la implementación real de 0364 (en curso por otro programador): no incluye `S_zona`, `subidaAlSalir`, opacidad por zona ni los tamaños distintos de la zona del coro (1 línea); todas las zonas del prototipo muestran 2 líneas, así que el número de nodos es una cota superior. Esos cálculos se hacen una vez por tamaño de ventana, no por fotograma.
- Intenté medir también la 0364 real del árbol de trabajo (`SPIKE_ZONAS_REALES=1 construir.mts`): estaba a medio hacer y las zonas salían sin texto en mi arnés, así que **no cuenta**. Hay que repetirlo cuando la 0364 esté cerrada.
- Un solo equipo (M1, macOS), 1080p. Sin Windows, Linux ni 4K.

## 3 · Criterio 3: las cinco funciones con solapes

Detalle en `pruebas/criterio3.test.ts` (funciones reales de `app/src/shared` + `prototipo/solapes.ts`, 140 líneas). La voz de prueba es la «perfecta»: la unión de los intervalos reales de todas las líneas, porque la voz separada mezcla a todos. Cuatro grupos de dos líneas y uno de tres (11 de 13 líneas solapadas); «Todos» (l07, l13) no se solapa.

| Función | Código real, regla nueva, sin adaptador | Comportamiento definido | Resultado con el adaptador |
|---|---|---|---|
| Ajustar los silencios | 6 cambios, **4 sobre líneas solapadas** (el coro l09 pasa de 33 000 a 35 100 porque la voz mezclada sigue con l08) | **Excluir** las líneas solapadas y decirlo (`edi.partes.solapaExcluidas`) | 2 cambios, ambos fuera de solapes; las 11 solapadas quedan idénticas. Sobre la letra sin solapes, igual que la función real |
| Encaje (Comprobar la letra) | `tramosDe` recorta cada tramo al inicio del siguiente: F0 = 0,972, 1 línea sin voz y 1 tramo de voz sin letra, falsos | **Fusionar** los tramos solapados en uno (`aplanarSolapes`) **sin tocar `encaje.ts`** | F0 = 1, 0 falsos; con la voz desplazada 700 ms propone `desfasada` de exactamente 700 ms |
| Líneas dudosas | 1 falso positivo (l09, «fin corto») | **Excluir** las solapadas, salvo «sin inicio» | 0 falsos; un fallo real fuera de solapes (l07 sin voz) se sigue detectando; «Está bien» (`revisada`) vale mientras el fin efectivo no cambia |
| Exportar `.lrc` | Marca vacía a los 33 s **dentro** de l08, que sigue hasta los 35 s | **Una sola marca vacía por grupo**, en el fin de la línea que acaba la última | Sin la marca falsa; orden temporal intacto; reimportar da las 13 líneas |
| Alineación (ADR 0028) | `shared/alineacion.ts` aún no existe | **Excluir** las solapadas (como silencios y dudosas) | Solo probado el predicado (`solapadas`): quedarían l07 y l13 |

Observaciones: (a) en todas las funciones lo único que hay que tocar es la entrada o el resultado, no su código: el predicado `solapadas(letra, duración)` (barrido por inicio sobre los tramos de `finEfectivo`) y tres adaptadores finos bastan. (b) Con el fin automático conservador (cualquier parte) los solapes solo nacen de fines fijados a mano o con los tiradores: la preparación desatendida y «Ajustar los silencios» no los crean nunca. (c) `revisada` no necesita regla nueva: con el fin automático sin cambios, no se invalida más que hoy.

## 4 · Cuántas piezas dependen de «las líneas no se solapan»

Medido con búsquedas en el árbol del commit `552fbb2` y con el parche (no es una estimación):

| Qué | Cantidad | Detalle |
|---|---|---|
| Archivos de producción que llaman a `finEfectivo` | **19** | Reciben el nuevo valor sin cambiar: `render`, `comprobacion`, `RielPanel`, `estado`, `Editor`, `PanelSincronia`, `DialogoAjustarSilencios`, `lineaTiempo`, `dudosas`, `derivados`, `escucha`, `silencios`, `letra`, `palabras`, `coros`, `encaje`, `lrc`, `retirar`, `tiempos` |
| Funciones que codifican «el límite es la siguiente línea con inicio» y **cambian** | **8 en 5 archivos** | Las del parche (+52 −13 líneas) |
| Funciones que se **adaptan sin cambiar su código** | 4 + 1 futura | `proponerAjusteSilencios`, `detectarDudosas`, `evaluarEncaje`, `exportarLrc`/`letraALrc*` (+ alineación) |
| Interfaz | 3 | `PistaSincronia` (regiones solapadas en carriles, tiradores), `PanelSincronia` (aviso y mensaje de límite), `ListaLineas` (icono `layers`); el editor preciso ya sale en `limitesEditorDe` |
| Render | 0 en `render.ts`; 1 en `PantallaLetra` | Una zona = una subsecuencia con el fin resuelto; falta «indicadores de espera solo cuando no suena ninguna zona» (C1S-R1) |
| Main | 0 aparte de `letra.ts` | `ServicioLetras` valida con `letraSchema`, que hereda la regla; queda decidir 0365 |
| **Pruebas existentes que se rompen** | **0** de 908 ejecutadas (51 archivos) | No ejecuté las de componentes del editor (`Editor.*.test.tsx`, etc.): las corre el CI |

La estimación del ADR («unas 20 piezas») se confirma en número de **consumidores** (19), pero solo **8 funciones** codifican la regla y el cambio es pequeño y localizado.

### Coste estimado de 0357–0360 (estimación del programador, no medida)

| Tarea | Tamaño del plan | Estimación tras la prueba | Por qué |
|---|---|---|---|
| 0357 · Fin por parte en las reglas | M–L | **M** | El parche ya existe y pasa las 908 pruebas; quedan ≈ 30 pruebas nuevas, la decisión 0365 (y lo que implique) y que el parche tome la parte tolerante (`parteDe(linea, letra)`) en vez de `parte ?? 'c1'` |
| 0358 · Funciones automáticas | M | **M** | Predicado + fusión + exclusión + vista `.lrc` (≈ 140 líneas ya escritas en el prototipo) + textos y resumen en la interfaz de cada función; `alineacion.ts` aún no existe |
| 0359 · Editor con regiones solapadas | M | **M, con riesgo** | **No se prototipó** (es interfaz): tiradores limitados por su carril, carril prohibido en el arrastre, regiones completas; depende de 0345 |
| 0360 · Pantalla y video | S–M | **S** | El modelo funciona (criterio 2); falta la regla de espera y la medida real con 0364 |

## 5 · Riesgos

1. **Compatibilidad (0365)**: una canción con solapes no se abre en 0.2.2 ni 0.2.1 (se vería dañada). Mitigable con «solo escribir solapes con reparto», con un campo nuevo o subiendo `esquema_cancion`.
2. **Orden de lectura (0368)**: dúos escritos por cantante obligan a reordenar el texto, y la app no tiene «mover línea».
3. **Regla del fin automático (0366)**: si el arquitecto prefiere «por parte» también en el automático, hay que reabrir las funciones automáticas (silencios, dudosas, preparación) y el modelo de render; la prueba se hizo con la opción conservadora.
4. **Voces reales**: la prueba se hizo con voz sintética «perfecta»; con una voz real mezclada (reverb, cantantes que se pisan a medias) la exclusión será más frecuente de lo que sugiere la letra inventada (11 de 13 líneas ya están excluidas): una canción con muchos solapes casi no recibirá ayuda automática.
5. **Palabras por línea**: al mover un inicio, la regla de 0.2.2 descarta las palabras hechas a mano de la línea y de la anterior que choca; en un dúo con solapes sucederá más.
6. **Medida**: ± 30 % de ruido entre rondas por la carga de la máquina, un solo equipo (aunque la razón entre escenarios se mantiene en cada ronda).

## 6 · Lo que no pude comprobar

- La **0364 real** (zonas): estaba en obras en el árbol y no pintaba en mi arnés (§2). Repetir con `SPIKE_ZONAS_REALES=1`.
- La **interfaz del editor** (0359): carriles solapados, tiradores, arrastre con carril prohibido. No se prototipó.
- La **alineación forzada** (ADR 0028): el módulo no existe; solo el predicado.
- Un **dúo real**: nadie lo ha anotado; el usuario puede aportarlo (solo cifras en el informe).
- **Voz real** y a oído: nada de audio.
- Otros equipos y sistemas (Windows, Linux, Intel), 4K y el modo «Solo letra».
- Las pruebas de componente del editor (`Editor.*.test.tsx`) con el parche: las corre el CI.
- Lectura real en el binario de 0.2.2: se usó `letraSchema` del código actual, que lleva ese `superRefine` desde el MVP; no se abrió una canción con solapes en una app 0.2.2.

## 7 · Texto propuesto para ADR 0029 («Resultado de la prueba técnica de voces a la vez»)

> **Resultado (2026-11-23, tarea 0356): sirve con condiciones.** Criterio 1: la regla («inicios crecientes en toda la letra; el fin fijado y las palabras no pasan del inicio de la siguiente línea que choca: misma parte, «Todos» con cantantes, coro con coro, pausa con todo; el fin automático sigue llegando a la siguiente línea de cualquier parte») representa los tres patrones con un desvío de 1 ms; ninguna de las 908 pruebas existentes cambia; el cambio es de 8 funciones en 5 archivos (+52 −13 líneas). Criterio 2: 1,01 × (3 zonas) y 1,02 × (4 zonas) el coste de 0.2.2 con 5 líneas; 4 zonas a 60 FPS sin fotogramas perdidos (prototipo; repetir con 0364). Criterio 3: silencios, dudosas y alineación **excluyen** las líneas solapadas, el encaje las **fusiona** y el `.lrc` escribe una sola marca vacía por grupo; 0 falsos positivos. Condiciones: 0365 (una canción con solapes no se abre en 0.2.2 ni 0.2.1), 0366, 0367 y 0368. Ajustes a 0357–0360: ver el informe del spike.

## Cómo repetirlo

Ver `README.md` de esta carpeta.
