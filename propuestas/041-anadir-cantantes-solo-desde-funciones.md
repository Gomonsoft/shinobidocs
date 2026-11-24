# 041 — Añadir cantantes solo desde Funciones, sin la franja «Suelta aquí para un cantante nuevo»

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md), caso 2 (arrastre entre carriles, paso 2.4); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-2
- Fecha: 2026-11-23
- Relacionadas: spec [06 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea) (C1-E14, C1-E15), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), incidencia I-1 de la misma nota

## Problema

Al arrastrar una región entre carriles aparece, justo debajo del último cantante, la franja «Suelta aquí para un cantante nuevo». En un dúo queda pegada al carril del cantante 2, que es el destino más habitual: soltar unos píxeles más abajo crea un cantante que nadie pidió. El usuario prefiere no poder crear cantantes arrastrando.

En su captura (ilustrativa: la canción es un dúo y no tiene tercer cantante) se ve un «Cantante 3» con 1 línea creado así, con su carril y su fila en Funciones › «Cantantes y coros».

## Propuesta

Quitar la franja de destino «cantante nuevo» del arrastre. Los cantantes se añaden y se quitan solo desde Funciones › «Cantantes y coros» («+ Añadir cantante»), que ya existe. El arrastre queda para mover líneas entre carriles que ya existen. Si se mantiene «¿Quién canta?» › «Añadir cantante» (menú y tecla C) lo decide el diseñador: el usuario pidió que «desde Funciones se controle todo eso».

## Valor y coste

- Valor: evita cantantes creados por accidente; un solo sitio para gestionar el reparto; la línea de tiempo no cambia de alto al empezar un arrastre.
- Coste: sin estimar (lo valora el arquitecto). Se quita comportamiento: fila virtual `nuevo` de la pista, criterio del paso 2.4 de la guía y lo que la spec 06 diga del destino «cantante nuevo».
- Riesgos: la única reproducción automática de la incidencia I-1 (pantalla vacía) fue al soltar sobre esa franja; quitarla puede ocultar la causa sin arreglarla. Conviene encontrar la excepción antes.

## Valoración de diseño

(Diseñador UX, 2026-11-23. No cambia ninguna spec: es para que el usuario decida.)

**Recomendación: hacerla, en 0.2.3 antes de publicar, pero solo después de encontrar la causa de la incidencia I-1.** El plan 6 lo fija así: la franja «Suelta aquí para un cantante nuevo» **no se quita hasta conocer la causa** de la pantalla en negro. La única vez que la reproducción automática vació la pantalla fue al soltar sobre esa franja; quitarla antes podría esconder el fallo sin arreglarlo (y el fallo también salió con un doble clic y en Estilo, sin franja). Primero se arregla la causa; después se quita la franja como decisión de producto.

**Valoración.** El usuario tiene razón en lo esencial: un destino que **crea** algo no debe estar pegado al destino más habitual (el carril del Cantante 2) en un gesto impreciso como arrastrar. Además, crear cantantes es algo que se hace una o dos veces por canción, y asignar líneas, decenas de veces: no tiene sentido que compartan el gesto. Con la franja fuera, la línea de tiempo tampoco crece al empezar un arrastre en una canción de 2 o 3 cantantes (en un dúo sigue apareciendo la franja «Todos»: ver la propuesta 042).

**Opciones** (la recomendada primero):

| | Qué cambia | A favor | En contra |
|---|---|---|---|
| **A · Crear solo en Funciones** (recomendada) | Sin franja en el arrastre. El menú «¿Quién canta?» pierde «+ Añadir cantante» (y su tecla A dentro del menú); «Nombres de los cantantes…» pasa a llamarse **«Cantantes y coros…»** y abre Funciones con el foco en «+ Añadir cantante» (o en el nombre del cantante, si se llega desde una línea). En una canción de un solo cantante, el menú muestra «Cantante 1 ✓», «Coro» y «Repartir entre varios cantantes…», que lleva a Funciones. | Es lo que pidió el usuario («que desde Funciones se controle todo eso»). Un solo sitio para crear, nombrar y quitar. Ninguna vía rápida crea cantantes por error. | Empezar un dúo desde una línea cuesta un paso más (ir a Funciones y volver). La guía ya empieza por Funciones, así que en la práctica no cambia el recorrido. |
| B · Quitar solo la franja | Sin franja; el menú conserva «+ Añadir cantante», que crea el cantante y le asigna la selección. | Cambio mínimo. El menú es una elección explícita: no se crea un cantante por mala puntería. | Quedan dos sitios para crear cantantes; el usuario pidió uno. |
| C · Conservar la franja, más apartada | Franja separada del último carril y con un aviso con «Deshacer» al crear. | No quita nada. | No responde a lo pedido; sigue siendo un destino que crea algo en un gesto impreciso. |

**Qué pasa con cada vía en la opción A**:
- **Arrastre**: solo mueve líneas entre carriles que existen (y a «Todos» en un dúo, que es una parte, no un cantante nuevo). Soltar debajo del último carril no hace nada: cancela sin crear un paso de deshacer, como soltar fuera.
- **Tecla C**: sigue igual (abre «¿Quién canta?»; dentro, 1–4, T y C). Solo desaparece la A.
- **Alt + 1…4**: sigue sin crear nada. Con un cantante que no existe, el anuncio podría añadir dónde se crea: «Esta canción no tiene cantante 3. Añádelo en Funciones › Cantantes y coros.»
- **Alt + ↑/↓**: no cambia (nunca creó cantantes).
- **Coro**: asignar al Coro con el menú, C › C o «Marcarlas como coro» sigue igual. No crea un cantante.

**Reglas que toca**: C1-E5 (el menú deja de crear el Cantante 2), C1-E14 y C1-E15 (su última frase, sobre la franja), C1-E24 (capturas `menu-quien-canta` y `arrastre-carril`), la fila «Soltar en “+ Nuevo cantante”» y el menú «¿Quién canta?» de la spec 06, los textos `edi.partes.nuevoCarril`, `edi.partes.anadir` (solo en Funciones) y `edi.partes.anuncio.nuevo` (sin la variante «con líneas»), y el paso 2.4 de la guía manual. El ADR 0029 §3 nombra la franja. La regla de oro no se toca (sin reparto no hay arrastre entre carriles). Accesibilidad: crear sigue siendo posible solo con teclado desde Funciones.

**Preguntas para el usuario**:
1. ¿Quitamos también «+ Añadir cantante» del menú «¿Quién canta?», para que crear cantantes sea solo cosa de Funciones (recomendado), o basta con quitar la franja del arrastre?
2. Para la incidencia I-1: ¿recuerdas cómo aparecieron el Cantante 3 (sin líneas) y el 4 (con una línea)? Por ejemplo, soltando una línea un poco por debajo del Cantante 2, desde el menú o desde Funciones. Ayuda a saber si la franja tuvo que ver.

## Valoración técnica

(Arquitecto, 2026-11-23. Leído el código de `c6c0ba8`; nada ejecutado. No cambia ningún ADR salvo la mención de la franja en el ADR 0029 §3, que se anotaría como revisión.)

**Recomendación: aprobarla ya y hacerla en 0.2.3, pero solo después de encontrar la causa de I-1** (regla del plan 6). Si la causa no aparece antes de publicar, la franja se queda en 0.2.3 y se quita en la versión siguiente: quitarla no arregla I-1 (dos de las cuatro pantallas en negro fueron sin arrastre: un doble clic y un clic en Estilo) y sí borraría el único camino con el que se ha reproducido de forma automática.

**Código que desaparecería (verificado).**
- `renderer/src/vistas/editor/PistaSincronia.tsx`:
  - la fila virtual `{ id: 'nuevo', virtual: true }` que `filas` añade bajo el último cantante durante el arrastre (si hay menos de 4 cantantes);
  - el tipo `FilaCarril.id: Parte | 'nuevo'` y `asignar?(destino: Parte | 'nuevo', …)` pasan a `Parte`;
  - las ramas `f.id === 'nuevo'` / `f.id !== 'nuevo'` de `altoFila`, del motivo de carril prohibido, de «sin líneas» y del dibujo (el texto `P.nuevoCarril`);
  - en `franjasDeDestino`, el sumando de esa franja: el alto extra que `alArrastrar` pide al editor al empezar un arrastre baja de hasta 2 franjas a 0 o 1 (queda la de «Todos» en un dúo, y la del Coro si se aprueba la 042 con franja).
- `renderer/src/vistas/editor/Editor.tsx`: la rama `destino === 'nuevo'` de `asignarDesdeArrastre` (la acción `anadir_cantante` con `asignarA` desde el arrastre y su anuncio).
- `renderer/src/vistas/editor/partes.ts`: el texto `nuevoCarril` («Suelta aquí para un cantante nuevo»).
- Si además se quita «+ Añadir cantante» del menú «¿Quién canta?» (opción A del diseño): `anadirCantanteDesdeMenu` en `Editor.tsx` y su entrada y tecla en el menú. La acción `anadir_cantante` del reducer (`estado.ts`) **se queda**: la usa Funciones (`anadirCantanteSinLineas`). Su parámetro `asignarA` quedaría sin uso y se podría retirar.

**Coste: pequeño** (se quita código). Pruebas de feedback: `PistaSincronia.carriles.test.tsx` (las dos pruebas que esperan la franja pasan a comprobar que no aparece y que soltar por debajo del último carril no crea nada ni deja un paso de deshacer), `Editor.reparto.test.tsx` (la prueba de C1-E8 «un cantante nuevo trae su carril vacío» se queda: crea desde Funciones), y las del menú si se quita su entrada. E2E: `editor-reparto.spec.ts` (si alguna prueba crea con el menú) y las capturas `menu-quien-canta` y `arrastre-carril` de `capturas-023.spec.ts`. Manual: el paso 2.4 de la guía de la feature 1 cambia de criterio.

**Riesgos.**
- **Esconder I-1**: el principal, ya dicho. La prueba E2E de arrastre con ratón que pide el punto 1b del plan 6 debe soltar también sobre la franja **antes** de quitarla, con el registro de errores del renderer activo (punto 1a), para que, si el fallo está en ese camino, quede la pila.
- **Pista para I-1 (supuesto, sin reproducir):** soltar en la franja es el único gesto que, en un mismo paso, crea un cantante, cambia el número de carriles y devuelve el alto que pidió `alArrastrar`; es decir, la lista de filas y la geometría cambian a la vez que el editor se redimensiona. Quien busque la causa debería empezar por ahí (índices de fila calculados con la lista anterior, `destinoDe` con `tops` viejos). No explica los otros dos disparadores, así que no es la causa completa.
- **Crear cantantes cuesta un paso más** desde una línea. Técnico, ninguno.

**Compatibilidad de datos: ninguna.** No cambia el esquema; los cantantes ya creados (también los creados sin querer en 0.2.3-alpha.1) siguen ahí y se quitan desde Funciones como hoy. 0.2.1 y 0.2.2 no se ven afectadas.

**Video exportado y rendimiento.** Ninguno: solo toca el editor. La línea de tiempo deja de crecer al empezar un arrastre en canciones de 2 (sin «Todos») a 3 cantantes, un cambio de alto menos durante el gesto.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
