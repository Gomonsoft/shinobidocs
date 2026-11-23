# Informe de la feature 1 · Cantantes por línea (0.2.3)

- Tarea: [0349](../../tareas/0349-verificacion-e-informe-de-la-feature-1-de-0-2-3.md) · ADR [0029](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) · Specs: [06](../../ux/06-editor.md#023--feature-1--cantantes-por-línea), [07](../../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla), [10](../../ux/10-exportacion.md#023--feature-1--cantantes-en-el-video)
- Verificación de QA: 2026-11-23, Mac M1 (Retina), Node 24, HEAD `d50facd` de la rama `version-0.2.3` (la build de `out/` es de ese commit; en el árbol había ediciones ajenas sin commit en la línea de tiempo, que **no** están medidas aquí).
- Revisión del diseñador: [revisión](../../ux/revisiones/0.2.3-feature-1/revision.md) (anterior a las correcciones del último commit; algunas capturas están regeneradas y sin revisar).

## Veredicto: **lista con reservas**

La regla de oro se cumple con medidas propias (abajo). Las reservas, que no cambian los datos de nadie:

1. **El CI de Linux falla en dos pruebas E2E** que en macOS pasan ([pregunta 0385](../../preguntas/0385-fallos-de-e2e-solo-en-linux-del-ci-en-0-2-3.md)): C1-E23 (texto de la fila a 256 px: **88,2 px** frente a ≥ 96) y `temas-editor.spec.ts:577` (el botón «Más acciones del tema» se sale del panel a 300 px). No son reproducibles en macOS (barras superpuestas y otra tipografía).
2. **Sin prueba automática** (verificados solo por captura del diseñador o por la guía manual): C1-E9 (límite de 4 cantantes), C1-E13 (etiquetas), C1-E14 (arrastre real), C1-E15 en parte, C1-E20 (todo con teclado), C1-E24.
3. Las capturas regeneradas tras las correcciones del diseñador (`funciones-cuatro`, `estilo-colores`, `arrastre-carril`, `estilo-voces`) están por revisar por él.

## Cifras medidas por QA

| Qué | Resultado |
|---|---|
| `typecheck`, `lint`, `format:check` | limpios |
| Vitest completo (tras dos arreglos de pruebas míos, ver abajo) | 363 archivos, **4 896 pasan**, 13 omitidas, 76 s |
| pytest del worker | **400 pasan**, 7 deseleccionadas, 65 s |
| Críticos (`--grep @critico`, sin recompilar) | **2 de 2** (16,9 s y 7,7 s) |
| Regresión E2E completa, pasada 1 | **240 pasan**, 3 fallan, 91 omitidas (7,4 min) |
| Regresión E2E completa, pasada 2 | **241 pasan** (más una prueba de diagnóstico mía, ya retirada), 2 fallan, 91 omitidas (6,6 min) |
| E2E del reparto (`editor-reparto.spec.ts`) | **7 de 7** en las dos pasadas |
| Pruebas de reparto en Vitest (cuenta de `it`/`test` por archivo) | `reparto` 24, `zonas` 33, `PantallaLetraReparto` 18, `servicio.reparto` 11, más `Editor.reparto`, `PistaSincronia.carriles`, `MenuQuienCanta`, `PanelEstilo.partes`, `estado.reparto`, `partes`, `Rieles.reparto` |

### Regla de oro: una canción de un solo cantante se ve, se guarda y se exporta igual que en 0.2.2

Comprobación independiente, con tres copias del código (`v0.2.2` en la rama `version-0.2.2` a `633eb59`, `552fbb2` y HEAD) en worktrees aparte y datos temporales (`npm run semilla` en una carpeta temporal; nada en la carpeta de datos real):

| Comprobación | Resultado |
|---|---|
| Semilla de siempre (20 canciones) creada con el código de 0.2.2 y con el de HEAD | `cancion.json` de las 20 **idénticos byte a byte**; solo cambia `config.json` (dos ajustes nuevos con su valor por defecto: `editor.carriles_juntos: false` y `exportacion.coros: true`) |
| Abrir y guardar sin cambios (`abrirEdicion` + `guardarTiempos` de `ServicioLetras`, 12 canciones con letra legible) | **12 de 12 con bytes idénticos** al archivo de entrada, en 0.2.2 y en HEAD |
| Guardar un cambio real (inicio de la 1.ª línea + 10 ms) | misma salida en 0.2.2 y en HEAD salvo la marca `modificada` (11 canciones; en 1 canción las dos versiones rechazan el cambio por el mismo motivo) |
| Fotogramas del reproductor cada 25 ms (≈ 9 880 por canción, 12 canciones, `fotogramaEn`) | **hash idéntico** en 0.2.2 y en HEAD (12 de 12) |
| Lo mismo por el camino nuevo (`zonasDeLetra` + `fotogramasDeZonas`) | **una sola zona** y hash idéntico al de 0.2.2 (12 de 12) |
| Exportación | `mezclar` del worker sin envolvente: hash idéntico en 0.2.2 y en HEAD para 0, −3,5 y +6 dB, con y sin voz; el plan de `servicio.ts` solo añade `voz_envolvente` con coros, y con la semilla no hay |
| Canciones dañadas de la semilla (parseo) | el mismo resultado en las dos versiones |

Límite honesto: no he comparado capturas píxel a píxel (C1-E1 pide «capturas comparadas»); lo cubren los fotogramas del modelo y la captura `sin-reparto` que el diseñador dio por buena.

### Medidas de la línea de tiempo (C1-E15), HEAD, a 1280 × 720

| Caso | Scroll de página | Zona superior (≥ 136) | Carriles | «Juntar carriles» |
|---|---|---|---|---|
| Dúo con coro, 100 % | 0 | 235 px | 4 | normal |
| 4 cantantes + Todos + Coro (6 carriles), 100 % | 0 | **171 px** | 6 | normal |
| 6 carriles, 125 % | 0 | **171 px** | 6 | normal |
| 6 carriles, 1024 × 576 | 0 | 143 px | se juntan solos | inactivo, «Separar carriles», solo icono (50 px) |
| Dúo, 1024 × 576 | 0 | 143 px | se juntan solos | igual |

## Veredicto por criterio

«Prueba» = Vitest o E2E que lo comprueba; «medido» = lo medí yo; «guía» = pasa a la guía manual.

| Criterio | Veredicto | Evidencia |
|---|---|---|
| C1-E1 sin reparto | **Cumple** | Regla de oro (arriba); Vitest «una canción de un solo cantante se ve como en 0.2.2» (con mi arreglo de espera); captura revisada |
| C1-E2, E3 vías y selección múltiple | Cumple (parcial) | E2E: C › 2 con tres líneas y Ctrl + Z, fila «Canta», Alt + ↓; Vitest `estado.reparto`, `ListaLineas`; el arrastre real: guía 2 |
| C1-E4 asignar no toca otros campos | Cumple | `servicio.reparto.test` (11 pruebas) |
| C1-E5, E7 | Cumple | `MenuQuienCanta.test`; capturas |
| C1-E6 Alt + 1…4 | Cumple (parcial) | Vitest; teclados es/us y AltGr: guía 1.8 |
| C1-E8 carril vacío | Cumple | E2E «un cantante nuevo trae su carril vacío y Alt + ↓ le lleva una línea» |
| C1-E9 máximo de 4 | Sin prueba automática | Vitest de reparto (`reparto.test`); la captura no lo mostraba; está regenerada, sin revisar |
| C1-E10, E11 | Cumple | `partes.test`, `reparto.test` |
| C1-E12 sugerencia de coro | **Cumple** | E2E «Marcarlas como coro…» |
| C1-E13 carriles y etiqueta de 96 px | Cumple | `PistaSincronia.carriles.test`; 96 px en HEAD (`pistaSincronia.module.css`) |
| C1-E14 arrastre entre carriles | **Parcial** | Vitest de la pista y franjas de destino en HEAD (`distribucion.ts`); no hay E2E con ratón real: guía 2 |
| C1-E15 alto y 1024 × 576 | **Cumple (medido)** | tabla de arriba |
| C1-E16 «Juntar carriles» | Cumple | Vitest; recordarlo al reiniciar: guía 2.8 |
| C1-E17, E18 colores | Cumple | `PanelEstilo.partes.test` y `temas.test` |
| C1-E19 contraste | Cumple | `contraste.test` (0347) y captura `aviso-parte` |
| C1-E20 solo teclado | Parcial | E2E de C y Alt; el flujo entero: guía 1.5 |
| C1-E21, E22 | Cumple | Vitest (modo «Sincronizar al ritmo» y lectura tolerante, `letra.test` con copia congelada de 0.2.2) |
| C1-E23 anchos 256/300 px | **No cumple en Linux** | E2E `editor-reparto:174` pasa en macOS y falla en el CI de Linux (88,2 px frente a 96): [pregunta 0385](../../preguntas/0385-fallos-de-e2e-solo-en-linux-del-ci-en-0-2-3.md) |
| C1-E24 capturas | Cumple con reservas | 57 de editor + 19 de reproductor; cuatro regeneradas pendientes de revisión |
| C1-E25 «Varias voces» | Cumple | Vitest de la sección Estilo (0363) y E2E del deslizador/estilo en `editor-reparto` |
| C1-R1…R5 zonas, barrido, Todos, coro | Cumple | `zonas.test` (33), `PantallaLetraReparto.test` (18); mismas zonas sin recolocar; capturas revisadas |
| C1-R6, R7 tamaños e insignia | Cumple (visual) | capturas; medidas exactas en `zonas.test` |
| C1-R8…R11 | Cumple | Vitest y capturas |
| C1-R12 capturas | Cumple | 19 |
| C1-V1, V2 video | Cumple (modelo) | Vitest; el video real en un reproductor externo: guía 6 |

## Hallazgos

- **Defectos de producto**: los dos de Linux (pregunta 0385). Con `chip más ancho + 8 px` el texto de la fila depende de la tipografía; el segundo (`temas-editor:577`) es una prueba de 0.2.2 que pasaba en `633eb59` y falla en `d50facd`.
- **Pruebas que arreglé** (no son del producto): `Editor.reparto.test.tsx` «una canción de un solo cantante se ve como en 0.2.2» (en el CI de Ubuntu la primera pulsación de C llegaba antes de tener línea principal y el menú no aparecía: espera con repetición) y `main/exportacion/servicio.test.ts` «voz en los coros… lote» (en Windows las rutas llevan `\` y el `includes('/id/')` no encontraba nada: se normaliza).
- **Compatibilidad** ([pregunta 0386](../../preguntas/0386-0-2-1-descarta-el-reparto-al-guardar-una-cancion.md)): medido con el esquema real de cada versión, 0.2.1 lee una canción con reparto **sin** `parte`/`partes` (las descarta), de modo que si se guarda allí el reparto se pierde; 0.2.2 la conserva.

## Pasa a la guía manual

[Guía de la feature 1](../../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md): dúo real con ratón y sin ratón, arrastre real, coros de las 2 canciones, insignias a 5 m, cuarteto a 3–4 m, daltonismo, ventana secundaria, video, abrir en 0.2.1 y volver, y el coro que no cabe (limitación aceptada, pregunta 0360).

## Suite crítica

**No se añade un caso de reparto.** El flujo principal no tiene pasos nuevos (el reparto es opcional) y la rama sin reparto es la que cubren los dos críticos (2 de 2). El reparto vive en `editor-reparto.spec.ts` (secundaria, 7 pruebas, ≈ 30 s).
