# Informe de la feature 3 · Voces a la vez (0.2.3, provisional)

- Tarea: [0361](../../tareas/0361-verificacion-e-informe-de-la-feature-3-de-0-2-3.md) · ADR [0029 §7 y «Resultado de la prueba técnica»](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) · Specs: [06](../../ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto) y [07](../../ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto) (criterios C1S-)
- Verificación de QA: 2026-11-23, Mac M1, HEAD `d50facd` (cifras globales: [informe de la feature 1](informe-feature-1.md#cifras-medidas-por-qa)).
- Revisión del diseñador: [revisión](../../ux/revisiones/0.2.3-feature-3/revision.md) (solo del reproductor; las capturas del editor de esta feature no estaban entonces: la correcta de «Juntar carriles con solapes» está en la carpeta pero sin revisar).
- Estado de producto: **provisional**, pendiente de la confirmación del usuario (pregunta 0165, fila 10).

## Veredicto: **lista con reservas**

La regla del fin por parte y todo lo que depende de ella se comportan como se pidió en las medidas propias de abajo, y **una letra sin solapes no cambia** (medida). Reservas:

1. **Nunca se ha visto con un dúo real**: ni a oído, ni a 5 m, ni en un video: toda la verificación es con letras inventadas. La feature es provisional por eso.
2. El editor con regiones solapadas era el punto de riesgo (0359, «no se prototipó»): se comprueba por Vitest y por un E2E (alargar el fin de Ana sobre la línea de Luis); el arrastre real y el menú con motivos, solo a mano (guía 1).
3. **Compatibilidad** con versiones anteriores: aceptada (pregunta 0365), con la salvedad de la pregunta 0386.
4. La corrección 3 del diseñador (**bloquea** el editor de la feature: «Juntar carriles» con solapes en sub-filas) estaba siendo reescrita en el árbol de trabajo durante esta verificación (sin commit): lo medido corresponde al commit.

## Medidas propias

### Letras con reparto y sin solapes no cambian con la feature 3

300 letras aleatorias generadas por mí (4 partes, pausas, líneas sin inicio; 192–225 son válidas según el invariante, el resto las rechaza igual cualquier versión), ejecutadas con tres copias del código: `552fbb2` (antes de las reglas de voces a la vez), `24259a2` (con las reglas y las zonas, sin el editor ni la pantalla de 0359 y 0360) y HEAD.

| Función | Consultas | `552fbb2` frente a HEAD |
|---|---|---|
| `letraSchema.parse` (aceptación y rechazo) | 300 | idéntico |
| `validarInvariantesLetra` | 192 | idéntico |
| `finEfectivo` | 4 003 | idéntico |
| `exportarLrc` | 192 | idéntico |
| `detectarDudosas` | 192 | idéntico |
| `limitesInicio` y `ajustarInicio` | 6 824 | idéntico |
| `ajustarFin` con −300 ms | 3 412 | idéntico |
| `ajustarFin` +300 ms y `fijarFin` | 6 824 | **distinto por diseño**: el fin de una línea ya puede pasar el inicio de la siguiente de otra parte que no choca (la regla nueva) |
| Fotogramas por zona cada 250 ms durante 120 s (`zonasDeLetra` + `fotogramasDeZonas`) | 192 letras × 480 instantes | `24259a2` frente a HEAD: **idéntico** |

Y la otra cara: 6 639 ediciones del fin sobre 225 letras: **2 073 crean voces a la vez**, **0 resultados violan los invariantes** y **0 solapes ocurren entre líneas que chocan** (misma parte, Todos con un cantante, coro con coro, pausas). Las 12 canciones de la semilla de una sola voz: bytes y fotogramas idénticos a 0.2.2 (ver el informe de la feature 1).

### Compatibilidad con versiones anteriores (medida con el esquema real de cada versión)

| Canción | 0.2.1 | 0.2.2 | 0.2.3 |
|---|---|---|---|
| «Voces a la vez: dúo con coro» | **Rechazada**: «La línea 1 (…) termina en 6000 ms, después del inicio de la siguiente (4500 ms)» → dañada | **Rechazada**, igual | Se lee |

Una canción dañada no se reescribe: la guía comprueba que `cancion.json` no cambia (guía 5).

**Texto propuesto para las notas de la versión**: «Las canciones con voces a la vez (frases de partes distintas que se solapan) no se pueden abrir en versiones anteriores de Shinobi Karaoke: se ven como dañadas, pero no se pierde nada y vuelven a funcionar en 0.2.3. Si abres en 0.2.1 una canción con reparto y la guardas, el reparto se pierde.»

### Rendimiento de la pantalla (medida repetida con la 0364 real, tarea 0360)

La hizo el programador con `SPIKE_ZONAS_REALES=1` (1920 × 1080, 3 rondas, Mac M1); **QA no la ha repetido**: base 18,1 ms por fotograma; 3 zonas 16,9 (0,94 ×); 4 zonas a 30 FPS 16,8 (0,93 ×); 5 zonas 16,8 (0,93 ×); a 60 FPS, base 17,2 y 4 zonas 16,7 (0,97 ×); 0 fotogramas sin asentar y 0 reintentos en los 7 escenarios. Límite pedido: 1,25 ×. Por debajo.

## Veredicto por criterio

| Criterio | Veredicto | Evidencia |
|---|---|---|
| C1S-E1 tiradores de fin con partes distintas | Cumple | E2E «voces a la vez: alargar el fin de Ana sobre la línea de Luis se permite y se guarda» y medidas de arriba; el tirador real: guía 1.2 y 1.3 |
| C1S-E2 regiones completas e icono de capas | Cumple (Vitest, captura) | `Editor.solapes.test`; captura `solape-carriles` revisada |
| C1S-E3 asignar a la misma parte | Cumple (Vitest) | reducer, menú, atajos y arrastre rechazan con `edi.partes.solapaMisma`; el arrastre real: guía 1.4 |
| C1S-E4 funciones automáticas | Cumple (Vitest) | silencios, encaje, dudosas y `.lrc` excluyen o agrupan las líneas que suenan a la vez |
| C1S-E5 sin solapes igual que antes | **Cumple (medido)** | tabla de arriba |
| C1S-E6 «Juntar carriles» con solapes | **Sin revisar** | corrección 3 del diseñador (sub-filas) en reescritura; test geométrico y captura `juntos-solapes` por revisar |
| C1S-E7 «Todas en un bloque» con solapes | Cumple (Vitest) | nota `edi.pantalla.bloqueSolapes` y «Ver en zonas» (pregunta 0380) |
| C1S-R1 zonas con barrido a la vez | Cumple (Vitest, capturas) | `zonas.test`, `PantallaLetraReparto.test`; capturas `dos-voces`, `tres-voces-con-coro` revisadas |
| C1S-R2 Todos sin solape y espera tras un solape | Cumple | capturas `todos-sin-solape` y `espera-tras-solape` |
| C1S-R3 60 FPS | Cumple (medida del programador) | arriba; no repetida por QA |
| C1S-R4 color exacto durante un solape | **No comprobado** | el diseñador lo marcó «a comprobar» (lo ya cantado se veía más pálido); falta una prueba de píxeles sin desenfoque o repetir la captura tras la subida de opacidad |

## Hallazgos

- Ningún defecto de producto encontrado en esta feature con las comprobaciones hechas.
- La interfaz de solapes no se ha usado nunca con ratón real (0359 «no se prototipó»); el único E2E es el del tirador de Ana sobre Luis.
- El resultado del CI para esta feature es el de la ejecución 45244958888 (`d50facd`): ninguna de sus pruebas falla; los fallos de esa ejecución son de la feature 1 (Linux) y de pruebas inestables o de plataforma (ver el informe de la feature 1 y `docs/pruebas.md`).

## Pasa a la guía manual

[Guía de la feature 3](../../Test-manuales/0.2.3/feature-3-voces-a-la-vez.md): la canción de la semilla en el editor, un dúo real con frases cruzadas (reproductor y video), cómo se ve sin solapes, abrir en 0.2.1 y en 0.2.2.
