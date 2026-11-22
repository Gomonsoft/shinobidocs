# 0175 — Dudas del arquitecto para las specs de 0.2.3

- De: arquitecto
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (las tareas aplican la opción indicada hasta que la spec diga otra cosa)

## Contexto

He definido 0.2.3 con los ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) (reparto, colores, zonas de pantalla y voces a la vez condicionadas) y [0030](../adr/0030-voz-original-en-las-lineas-de-coro.md) (voz en los coros), y las tareas 0340–0361 ([backlog](../versiones/0.2.3/backlog.md)). Las tareas enlazan a tus secciones «0.2.3 · Feature 1/2» y a la sección condicionada de voces a la vez. Lo que sigue lo necesitan las tareas y no lo fijan los ADR.

## Pregunta

1. **Zonas de pantalla** (ADR 0029 §4 bis; tarea 0348): proporción del alto de cada franja con 2, 3 y 4 cantantes y con coro; líneas visibles por zona (¿se reparte `pantalla.lineas` o hay un valor por zona?); separación entre zonas; si la zona del coro va arriba, abajo o se elige. Opción aplicada si no: franjas iguales para los cantantes, el coro con la mitad de alto arriba, 2 líneas por zona de cantante y 1 en la del coro.
2. **«Todos» en pantalla**: zona propia o la misma línea repetida en la zona de cada cantante (una de las referencias). El modelo admite las dos. Opción aplicada si no: repetida en la zona de cada cantante.
3. **Indicadores de espera y cuenta 3·2·1 con zonas**: ¿en la zona de la línea que viene (opción aplicada) o siempre en el centro?
4. **Ajuste «zonas»** del estilo (`estilo.pantalla.zonas`: «por_parte» | «una»): dónde va el control y su texto (tarea 0347). Opción aplicada si no: en «Cantantes y coros» del panel Estilo.
5. **Onda de la línea de tiempo con carriles** (tarea 0345): ¿de fondo detrás de todos los carriles (sugerencia de la factibilidad §5, sin tocar `PistaOndaVoz`) o en su fila «Voz» de 28 px (exploración §3.5)?
6. **Insignia de «Todos» con 3 o 4 cantantes**: «A·L·M» puede no caber a la izquierda de la línea; ¿iniciales hasta 3 y luego «Todos», o un icono?
7. **Casilla del video** (tarea 0353): ¿se recuerda la última elección en `config.exportacion.coros` (opción aplicada) o se abre siempre marcada?
8. **Paréntesis con palabras visibles**: el ADR los pinta con la primera y la última palabra del barrido. Confirma que es lo que quieres ver.

## Opción provisional tomada (si no bloquea)

La indicada en cada punto.

## Respuesta

Diseñador UX, 2026-11-22. Specs: [06 · 0.2.3 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea), [07 · Disposición por zonas](../ux/07-reproductor.md#disposición-por-zonas) y [sistema visual · 0.2.3](../ux/sistema-visual.md#023--varios-cantantes-y-coros). Decisiones de diseño provisionales para el usuario en [0170](0170-decisiones-provisionales-de-ux-de-0-2-3.md).

1. **Zonas**: tu opción, con valores. Área del 12 % al 86 % del alto; separación 0,3 × `S`; zonas de cantante de alto igual; **Coro arriba**, con la mitad de alto. Líneas por zona: **valor fijo**, no se reparte `pantalla.lineas`: 2 por zona de cantante (la en curso o próxima y la siguiente al 70 %, sin ya cantadas) y 1 en la del coro. Tamaño `S_zona = mín(S, lo que cabe)`, mínimo 0,75 × `S` (por debajo, la zona deja la siguiente); en la del coro, mínimo 0,5 × `S`. La zona que suena va al 100 %; las demás al 55 % (con el suelo de contraste). «Líneas a la vez» y «Líneas ya cantadas» no se aplican con zonas; «Cambio de línea» sí, dentro de cada zona.
2. **Todos**: repetida en la zona de cada cantante, en el color de Todos y con su insignia. Sin zona propia.
3. **Indicadores y cuenta**: en la zona de la línea que viene, en el color de su parte (la cuenta conserva su forma).
4. **Control de `estilo.pantalla.zonas`**: no va en «Colores de los cantantes», sino al principio de **«Letra en pantalla»** (es disposición, junto a «Líneas a la vez»): «Varias voces: Cada una en su zona / Todas en un bloque». Visible en canciones con reparto y siempre en D3; forma parte del bloque «Letra en pantalla» (herencia y «Cambiar solo en esta canción»).
5. **Onda**: de fondo detrás de todos los carriles (tu sugerencia). Carril de 32 px, mínimo 24.
6. **Todos con 3 o 4**: icono `users`; con 2 cantantes, «A·L». Iniciales repetidas → dos letras; nombre predeterminado o aún repetidas → número de ranura.
7. **Casilla del video**: se recuerda en `config.exportacion.coros`, marcada la primera vez.
8. **Paréntesis con palabras visibles**: confirmado: «(» con la primera palabra y «)» con la última.

**Una diferencia con el ADR 0029 que te pido alinear** (detalle en [0171](0171-contratos-de-0-2-3-para-las-specs.md) n.º 1): por la indicación del usuario («todos tienen la misma base»), en la spec el carril del **Coro existe siempre** que la canción tiene reparto (aunque no tenga líneas, para poder arrastrarle) y el de **Todos**, siempre con 3 o más cantantes y, en un dúo, solo mientras tiene líneas. `carriles(letra)` del §3 dice «todos/coro solo si tienen alguna línea».
