# 042 — Carril del Coro opcional en la línea de tiempo

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real sin coros (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-3
- Fecha: 2026-11-23
- Relacionadas: spec [06 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md), propuesta [041](041-anadir-cantantes-solo-desde-funciones.md)

## Problema

Con el reparto activo, la línea de tiempo muestra siempre el carril del Coro, aunque la canción no tenga ninguna línea de coro («Arrastra aquí las líneas de Coro», «Sin líneas» en Funciones). En un dúo sin coros ocupa alto de la línea de tiempo sin servir para nada. En palabras del usuario: «no todas las canciones lo necesitan».

## Propuesta

Una casilla para activar o desactivar el carril del Coro de la canción, en Funciones › «Cantantes y coros». Apagada, el carril no se muestra en la línea de tiempo. Queda para el diseñador: el valor inicial, qué pasa si la canción ya tiene líneas de coro (no dejar apagarla, o avisar), si la sugerencia «N líneas van entre paréntesis» la enciende sola, y si la preferencia es de la canción o de la app.

## Valor y coste

- Valor: menos carriles en pantalla en los dúos sin coros (más alto para la onda y menos destinos donde soltar por error); relacionado con el límite de alto que obliga a «Juntar carriles» en ventanas pequeñas.
- Coste: sin estimar (lo valora el arquitecto). Si la preferencia se guarda en la canción, toca el esquema de `partes`.
- Riesgos: que un coro existente quede oculto; compatibilidad con canciones ya repartidas en 0.2.3-alpha.1.

## Valoración de diseño

(Diseñador UX, 2026-11-23. No cambia ninguna spec: es para que el usuario decida.)

**Recomendación: hacerla con cambios, en 0.2.3 antes de publicar: sin casilla.** El carril del Coro se ve solo cuando la canción tiene alguna línea de coro, como ya pasa con «Todos» en un dúo. Es la misma regla que ya sigue la pantalla (la zona del Coro solo existe si hay líneas de coro), así que el editor y lo que ve el público quedan alineados, y no hay nada que configurar ni recordar.

**Valoración.** El carril del Coro vacío se puso para poder arrastrarle la primera línea. Pero en un dúo sin coros ocupa 32 px de una línea de tiempo que ya va justa (con 4 carriles a 1024 × 576 se juntan solos) y es otro destino donde soltar por error (la queja de la propuesta 041). Una casilla resolvería el sitio, pero añade un ajuste que el usuario tiene que descubrir y una regla extra («¿qué pasa si la apago con coros?»).

**Opciones** (la recomendada primero):

| | Cómo queda | A favor | En contra |
|---|---|---|---|
| **A · Sin casilla: el carril aparece con el primer coro** (recomendada) | Sin líneas de coro, no hay carril del Coro. El primer coro se crea con el menú «¿Quién canta?» › Coro (o C › C), con «Marcarlas como coro» y, durante un arrastre, con una franja «Coro» que aparece bajo el último carril (igual que la de «Todos» en un dúo). Al quitar la última línea de coro, el carril desaparece. En Funciones la fila «Coro · Sin líneas» sigue, como recordatorio de que existe. | Nada que configurar. No puede quedar un coro oculto. Sin dato nuevo en la canción: vale tal cual para las canciones repartidas con 0.2.3-alpha.1. Menos alto en dúos sin coros. | Una franja más durante el arrastre (cambia el alto de la línea de tiempo mientras dura, como la de Todos). Variante posible: sin franja, el primer coro solo con el menú, C › C o la sugerencia. |
| B · Casilla «Carril del Coro» en Funciones (lo propuesto) | Casilla en «Cantantes y coros». Si se elige: **valor inicial** encendida si la canción tiene coros y apagada si no; **con coros**, encendida e inactiva, con el motivo «Tiene {n} líneas de coro» (nunca se oculta un coro que existe); **«Marcarlas como coro»** la enciende sola; **preferencia de la app** («Mostrar el carril del Coro sin coros», apagada por defecto) mejor que de la canción, porque no es un dato de la canción y así no toca su formato. | Control explícito, como pidió el usuario. | Con esos valores, la casilla solo sirve para ver un carril vacío a voluntad: es la opción A más un ajuste. Un control más que explicar y probar. |
| C · Dejarlo como está, más bajo | El carril vacío del Coro se reduce a una franja fina (unos 12 px) con su etiqueta, y crece al tener líneas. | Sigue siendo destino de arrastre sin ocupar casi nada. | Sigue a la vista sin servir en un dúo sin coros; una franja de 12 px no es un objetivo de 24 px (accesibilidad). |

**Detalle de A que hay que fijar en la spec si se aprueba**: **Alt + ↓** desde el último carril debe llegar también al Coro aunque no se vea su carril (hoy ya llega así a «Todos» en un dúo), para que el primer coro se pueda crear solo con teclado. En una canción con un solo cantante y sin coros no cambia nada (sigue sin reparto).

**Reglas que toca**: C1-E8 («El carril del Coro existe siempre que la canción tenga reparto» pasa a «solo con líneas de coro»), C1-E13 (carriles con reparto), C1-E15 (cuenta de carriles a 1280 × 720 y 1024 × 576), la regla de carriles de la spec 06 («Coro, siempre que la canción tenga reparto») y la función `carriles` del ADR 0029 §3. **Regla de oro**: no se toca (sin reparto no hay carriles). Compatibilidad: ninguna, porque se calcula. Contraste, daltonismo, movimiento y video: no les afecta.

**Preguntas para el usuario**:
1. ¿Te basta con que el carril del Coro aparezca solo cuando la canción tiene coros (recomendado), o quieres además una casilla para verlo vacío cuando quieras?
2. Para crear el primer coro arrastrando: ¿quieres la franja «Coro» durante el arrastre (recomendado, como la de «Todos»), o prefieres que el primer coro se marque solo con el menú, la tecla C o «Marcarlas como coro»?

## Valoración técnica

(Arquitecto, 2026-11-23. Leído el código de `c6c0ba8`; nada ejecutado.)

**Recomendación: hacerla en 0.2.3, derivada y sin casilla** (opción A del diseño): el carril del Coro se ve solo si la canción tiene alguna línea de coro. **No guardar la preferencia en `partes`.** Si el usuario quiere de todos modos una casilla, que sea preferencia de la app (`config.editor`), no de la canción.

**Dónde vive hoy (verificado).** La lista de carriles es `carriles(letra)` en `shared/reparto.ts`: los cantantes, «Todos» si hay 3 o más cantantes o alguna línea de Todos, y **siempre** `coro`. «Todos» ya sigue la regla derivada: en un dúo sin líneas de Todos no tiene carril y aparece como franja virtual solo durante el arrastre (`filas` en `PistaSincronia.tsx`). La pantalla ya hace lo mismo con su zona: `zonasDeLetra` solo crea la zona del Coro si hay líneas de coro.

**Las dos maneras de hacerlo.**

| | Qué cambia | Coste | Datos |
|---|---|---|---|
| **Derivada** (recomendada) | En `carriles`, `coro` solo si `lineasDe(letra).some(parte === 'coro')`. Si el diseño quiere la franja «Coro» durante el arrastre, se añade como la de «Todos» (`filas` y `franjasDeDestino`). `Alt + ↓` ya llega al Coro aunque no se vea su carril: `parteVecina` (`vistas/editor/partes.ts`) recorre el orden de las partes, no la lista de carriles; basta una prueba que lo fije. | **Pequeño**: `shared/reparto.ts` y `PistaSincronia.tsx`. | Ninguno |
| Preferencia en la canción (`partes.carril_coro`) | Campo nuevo en `partesSchema` (lectura, tolerante) y en `partesEscrituraSchema` (escritura, estricto), en `normalizarReparto` (para que una canción sin reparto siga sin `partes`), en el guardado del editor y en la casilla de Funciones. | **Medio**: `shared/letra.ts`, `shared/reparto.ts`, `main/` (escritura), editor y pruebas de esquema. | Ver abajo |

**Compatibilidad de datos.**
- **Derivada**: ninguna. Las canciones repartidas con 0.2.3-alpha.1 sin coros pierden el carril vacío al abrirlas, sin escribir nada; las que tienen coros lo conservan.
- **En `partes`**: 0.2.3-alpha.1 lee `partes` con un esquema no estricto que **descarta** las claves que no conoce, así que una canción abierta y guardada con la alfa perdería la preferencia. 0.2.1 descarta `partes` entero al guardar (pregunta 0386). Y un campo más es otro caso de «canción sin reparto que deja de serlo» en `normalizarReparto`. Mucho coste para un dato que, en la práctica, se deduce de las líneas.
- **Ninguna de las dos** puede ocultar un coro existente si se sigue la regla «con líneas de coro, el carril se ve» (en la derivada es automática).

**Pruebas de feedback**: `reparto.test.ts` (`carriles` sin y con coro; un dúo, un trío, un solo cantante con coro), `PistaSincronia.carriles.test.tsx` (sin carril del Coro vacío; franja virtual si se aprueba), `Editor.reparto.test.tsx` (C1-E8: el texto «Arrastra aquí las líneas de Coro» deja de existir en un dúo sin coros; `Alt + ↓` llega al Coro), `distribucion.test.ts` si alguna prueba cuenta carriles para «Juntar carriles». E2E: `editor-reparto.spec.ts` y las capturas de `capturas-023.spec.ts` que muestran el carril vacío.

**Riesgos.** Que el primer coro sea difícil de crear si no hay franja ni carril: quedan el menú «¿Quién canta?» › Coro, C › C, «Marcarlas como coro» y `Alt + ↓`, todos independientes de la lista de carriles. Que el carril aparezca y desaparezca al asignar o quitar la última línea de coro (el alto de la línea de tiempo cambia en ese momento): es lo mismo que ya pasa con «Todos».

**Video exportado y rendimiento.** Ninguno en el video (la pantalla ya derivaba la zona del Coro). En el editor, un carril menos en los dúos sin coros: más alto para la onda y «Juntar carriles» se dispara menos en ventanas pequeñas.

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
