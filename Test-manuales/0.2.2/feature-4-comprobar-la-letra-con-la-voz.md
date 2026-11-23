# Guía manual · Feature 4 · Comprobar la letra con la voz

> **No ejecutada todavía.** El caso 1 es el criterio de «hecha» de la feature con canciones reales y **está pendiente del usuario**: en el equipo del agente no existe tu biblioteca, así que no se pudo comprobar. Los demás casos cubren lo que las pruebas (que usan voz sintética y letras inventadas) no pueden.

- Versión: 0.2.2 · Feature 4
- Specs: [05 · Feature 4](../../ux/05-letra.md) (F4-L1 a L12) · [06 · Feature 4](../../ux/06-editor.md) (F4-E1 a E11) · ADR [0024](../../adr/0024-encaje-de-la-letra-con-la-voz-y-lineas-dudosas.md) · Informe: [informe-feature-4](../../versiones/0.2.2/informe-feature-4.md)
- Duración estimada: 2 h (más el tiempo de copiar la biblioteca)
- Requisitos: tu biblioteca real (al menos 10 canciones Lista con letra revisada y su voz separada), un lector de pantalla, la app empaquetada o `npm run dev`.

## Casos

### 1. Calibración con tu biblioteca (criterio de «hecha», PENDIENTE DEL USUARIO)

Objetivo (ADR 0024 §«Calibración»): con las 10 canciones Lista con picos, la regla «F(d\*) ≥ 0,88 e I(d\*) ≥ 0,95» acepta **10 de 10** letras propias y **0 de 90** letras ajenas; una letra propia desplazada ±0,8 s sale `desfasada` con `d` ≈ 0,8 s; ninguna letra correcta sale `desfasada`.

> **Actualización 2026-11-22**: el script ya existe (`npm run calibrar:encaje -- <carpeta-de-biblioteca> [--variantes]`, solo imprime cifras y títulos) y se ejecutó con 18 canciones del MVP (LRC de LRCLIB sin fines, sin revisar): propias 8/17, ajenas 6/272, ±0,8 s corregido 0/34 ([medidas](../../versiones/0.2.2/medidas-con-canciones-reales.md)). Ese resultado **no es el criterio de «hecha»** (el ADR midió letras revisadas con fines): repítelo con tus canciones **revisadas a mano con fines**. En 1.3, con una letra sin fines (de LRCLIB) **no esperes** que se proponga corregir 0,8 s: anótalo (pregunta 0275).

Los pasos son:

1. Copia tu carpeta de datos (**Ajustes → Abrir carpeta de datos**) a un sitio **fuera del repositorio**, p. ej. `~/copia-shinobi`. Solo se lee; no ejecutes el script sobre la carpeta viva.
2. Abre cada una de las canciones en la app una vez, en la copia o antes de copiar, para que existan los picos (`pistas/.picos-voz-v1-*.bin`) en cada `biblioteca/<id>/pistas/`.
3. Desde `app/`: `npm run calibrar:encaje -- ~/copia-shinobi/biblioteca` (nombre previsto; solo imprime cifras, ninguna letra).
4. Anota: nº de propias aceptadas / total, nº de ajenas aceptadas / 90, y para cada desplazamiento (±0,4, ±0,8, ±1,5, ±3 s) cuántas salen `desfasada` y con qué `d`.
5. Si no sale 10/10 y 0/90, ajusta `PARAMETROS_ENCAJE` (`app/src/shared/encaje.ts`) y deja una nota con fecha en el ADR 0024.

Mientras el script no exista, la comprobación equivalente a mano: para 3 canciones tuyas, abre cada una en el editor, pestaña Funciones, y pulsa «Comprobar la letra con la voz…».

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 1.1 | Letras propias (10 canciones): «Comprobar la letra con la voz…». | Todas: «La letra coincide con la voz.» (ninguna `desfasada`, ninguna `no_coincide`). Anota cuáles fallan. | ☐ |
| 1.2 | Pon la letra de **otra** de tus canciones sobre cada audio (al menos 5 pares). | «La letra no encaja con la voz.» en todas. Ninguna aceptada. | ☐ |
| 1.3 | Desplaza una letra propia 0,8 s a mano (la que tenga voz con huecos) y comprueba. | «Toda la letra va 0,8 s adelantada/atrasada…»; corregir la deja donde estaba (± 50 ms). | ☐ |
| 1.4 | Repite 1.3 en tu canción más rápida y sin huecos. | Puede no recuperarse (curva plana, previsto en el ADR). Anota qué sale. | ☐ |

### 2. Vista Letra

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 2.1 | Añade una canción por archivo y, **mientras se separa**, abre Letra y busca. | Los candidatos con tiempos dicen «Se comprobará con tu audio al terminar la separación» (F4-L6, captura `comprobacion-pendiente` que no se pudo automatizar). | ☐ |
| 2.2 | Espera a que termine la separación sin salir de Letra. | Los textos se actualizan sin reordenar ni mover la selección; si el mejor no es el seleccionado, aparece «Ya hemos comprobado las letras con tu audio…» con [Seleccionarla]. | ☐ |
| 2.3 | Elige una letra desfasada, «Usar esta letra». | «Movimos toda la letra X s…»; [Quitar la corrección] la deja como estaba sin tocar ningún tiempo; [Corregir el desfase] la vuelve a corregir. | ☐ |
| 2.4 | Elige una letra de «otra versión». | «La letra no coincide…» con [Ver por qué] y [Buscar otra letra]. | ☐ |
| 2.5 | Elige la letra **antes** de separar y no la toques; deja terminar la separación. | Se corrige sola si estaba desfasada, con aviso y [Deshacer] (F4-L7). Si antes cambiaste un tiempo, no se corrige y se ofrece la propuesta. | ☐ |
| 2.6 | Pega o importa un archivo LRC. | La letra guardada muestra su veredicto; una letra sin tiempos no muestra comprobación (F4-L9). | ☐ |
| 2.7 | Sin conexión, abre una canción con letra ya guardada. | La comprobación de la letra guardada sigue funcionando. | ☐ |

### 3. Editor

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 3.1 | Abre un borrador con la letra movida 1 s y otro con 3 s. | Banner «Esta letra va … s adelantada/atrasada respecto a la voz.» con [Corregir el desfase] y [Ahora no]. En una canción Lista no sale. | ☐ |
| 3.2 | Corrige, escucha la canción y revisa que la letra coincide a oído. | La letra suena donde se canta. Un Ctrl/Cmd + Z lo deshace en un solo paso. | ☐ |
| 3.3 | Una canción con intro hablada o coros largos. | No se marca `desfasada` por error; si sale «No está claro…», el texto es comprensible. | ☐ |
| 3.4 | Con la letra de otra versión, abre el diálogo y pulsa [Ir] en un tramo. | Se cierra, el cabezal queda al principio del tramo y la línea de tiempo lo muestra. | ☐ |
| 3.5 | Comprueba que no existe atajo de una tecla para comprobar o corregir; `,` y `.` no hacen nada (F4-E9). | Correcto. | ☐ |

### 4. Accesibilidad y viewports

| # | Paso | Resultado esperado | OK |
|---|---|---|---|
| 4.1 | Con un lector de pantalla recorre la lista de candidatos. | El nombre de cada opción incluye su comprobación; «Ya hemos comprobado…» se anuncia una vez sin mover el foco; corregir y quitar se anuncian (F4-L10). | ☐ |
| 4.2 | Opera todo solo con el teclado. | Todo es alcanzable. | ☐ |
| 4.3 | En los seis viewports de la subfase 2.1 (por ejemplo 1024 × 576, 1280 × 720, 1280 × 800, 1366 × 768, 1440 × 900, 1920 × 1080), abre la sección y los dos diálogos. | Sin scroll de página; a 300 px de panel el botón no se parte (F4-E10). | ☐ |

## Ejecuciones

| Fecha | Persona | Equipo y SO | Pantallas / audio | Resultado | Notas |
|---|---|---|---|---|---|
| | | | | ✅ / ⚠️ / ❌ | |

## Incidencias

| Caso | Qué pasó | Gravedad | Tarea o pregunta creada |
|---|---|---|---|

