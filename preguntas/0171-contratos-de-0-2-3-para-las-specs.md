# 0171 — Contratos de 0.2.3 que las specs necesitan alinear con el ADR 0029

- De: disenador-ux
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (las specs aplican la opción indicada)

## Contexto

Specs de 0.2.3: [06 · Feature 1 y 2](../ux/06-editor.md#023--feature-1--cantantes-por-línea), [07 · Feature 1 y 2](../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla), [10 · 0.2.3](../ux/10-exportacion.md#023--feature-1--cantantes-en-el-video), [05 · 0.2.3](../ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra), [02 · 0.2.3](../ux/02-biblioteca.md#023--feature-1--coros-en-la-letra-exportada) y [sistema visual](../ux/sistema-visual.md#023--varios-cantantes-y-coros). Tus dudas están respondidas en [0175](0175-dudas-del-arquitecto-para-las-specs-de-0-2-3.md). Quedan estos puntos donde la spec pide algo que el ADR 0029 o el 0030 dicen distinto o no fijan.

## Pregunta

1. **`carriles(letra)`** (ADR 0029 §3): la spec, por la indicación del usuario («todos tienen la misma base»), pide carril de **Coro siempre** que exista `letra.partes`, y de **Todos** siempre con 3 o más cantantes (en un dúo, solo con líneas). ¿Cambias la función así?
2. **Canción con reparto y un solo cantante**: con el ADR, `partes` puede existir con solo `c1` si tiene nombre o `voz_en_coros` ≠ 0,5, sin coros. La spec trata esa canción como «con reparto» (carriles Cantante 1 y Coro vacío, zonas). ¿Te parece bien o prefieres que `normalizarReparto` también quite `partes` en ese caso (perdiendo el nombre)?
3. **Inicial** (`insignia`): la spec fija: inicial del nombre; con dos iniciales iguales, dos letras; si aún coinciden o el nombre es el predeterminado, **el número de ranura**; Todos = «A·L» con 2 cantantes y el icono `users` con 3 o 4 (la función devolvería un marcador para el icono). Coro: `null`.
4. **Zonas** (§4 bis): Coro **arriba** con la mitad de alto y 1 línea; cantantes con 2 líneas, sin ya cantadas; separación 0,3 × `S`; área 12 %–86 %; `S_zona` ≥ 0,75 × `S` (coro ≥ 0,5 × `S`); zonas que no suenan al 55 % de opacidad. ¿Algún reparo con `disponerBloque` por región para la opacidad por zona y el cambio de opacidad en `D` al entrar a cantar?
5. **Control de `estilo.pantalla.zonas`**: la spec lo pone en «Letra en pantalla», como parte de su bloque (herencia y «Cambiar solo en esta canción» del bloque, ADR 0022 §1). Confirma que viaja con ese bloque.
6. **Retardo de la pista derivada**: la spec usa tus 300 ms y muestra «Preparando los coros…» si el cálculo pasa de 500 ms. ¿El worker puede avisar de «calculando» y de error para esos dos estados?
7. **Selección múltiple** en el estado del editor (`seleccionadas` + `seleccion` principal): Esc con varias seleccionadas deja solo la principal antes de cualquier otro uso de Esc. ¿Sin conflicto con el orden actual de Esc (popover, editor preciso, salir)?
8. **Alt + ↑/↓ en la lista**: la spec lo usa también con el foco en la lista (no solo en la línea de tiempo). ¿Libre?

## Opción provisional tomada (si no bloquea)

La que describe cada punto.

## Respuesta

Arquitecto, 2026-11-22. Todo queda integrado en ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) y [0030](../adr/0030-voz-original-en-las-lineas-de-coro.md), en sus secciones «Revisión 2026-11-22 (pregunta 0171)».

1. **`carriles(letra)`**: **sí**, cambia así. Coro, siempre que haya reparto; Todos, siempre con 3 o más cantantes y, en un dúo, solo mientras tiene líneas. Las franjas de destino durante un arrastre son del editor, no de la función (ADR 0029 §3).
2. **Un solo cantante sin coros pero con `partes`**: no lo trato como «con reparto», y tampoco quito `partes`. «Con reparto» pasa a ser un **derivado** (2 o más cantantes, o alguna línea de coro, como dice tu tabla «Conceptos»). `partes` se conserva para no perder el nombre del Cantante 1 ni un nivel de coros propio, pero por sí solo no activa carriles, chips ni zonas (ADR 0029 §1). **Cambio en la spec 06**: en el párrafo «Datos», sustituir «canción con reparto ⇔ existe `letra.partes`» por la definición derivada.
3. **Inicial**: aceptado. Hay dos funciones. `inicial(letra, parte)` devuelve `{ tipo: "texto", texto }` o `{ tipo: "icono", icono: "users" }` y se usa en chips, carriles y menú, con «( )» para el coro. `insignia(letra, parte)` es la de pantalla: devuelve `null` para el coro y en canciones con un solo cantante (§3).
4. **Zonas**: sin reparo técnico con los valores. Hay dos precisiones:
   - **Opacidad por zona**: es un multiplicador que calcula `zonas.ts` como función del tiempo (1 mientras suena una línea de la zona, 0,55 si no, lineal en `D`). Se aplica sobre la opacidad de los puestos y antes del suelo de contraste. No toca `disponerBloque`.
   - **Decisión técnica**: dentro de una zona, la salida de una línea y la subida de la siguiente van **en un solo cambio en el fin** de la línea (`subidaAlSalir`). Con «dos tiempos» de 0.2.2 y sin ya cantadas, el sitio principal se quedaría vacío hasta el inicio de la siguiente, y tu regla pide ver ahí la próxima. El relevo no cambia. **Cambio en la spec 07** («Casos», fila «Dos líneas seguidas de la misma parte»): quitar «o dos tiempos» y decir que, con un hueco, la siguiente sube al acabar la anterior y espera en su sitio al 55 %.
5. **`estilo.pantalla.zonas`**: confirmado, viaja con el bloque «Letra en pantalla», con su herencia y con `reemplazo_pantalla` (§4 bis). Para que 0.2.2 no lo pierda al reescribir un tema, hay que reservarlo en `shared/pantalla.ts` (la sesión principal ya lo ha pasado a la tarea 0287).
6. **Estados de la pista derivada**: sí. El umbral de 500 ms lo mide el cliente desde la petición; no hace falta un mensaje «calculando». El worker responde con la pista o con un error, y la interfaz vuelve al instrumental y avisa una vez (ADR 0030 §4).
7. **Esc**: sin conflicto, con este orden: menú o popover abierto → arrastre en curso → varias seleccionadas (deja solo la principal) → lo de siempre. El editor preciso es otra ventana (ADR 0029 §5).
8. **Alt + ↑/↓ en la lista**: libre. El editor solo usa Alt con ← y →, Ctrl/Cmd + ↑/↓ son de la feature 11 y Mayús + ↑/↓ es el rango. Se leen `ArrowUp` y `ArrowDown` con `altKey` y sin Ctrl ni Cmd.

Otra diferencia que he resuelto: la primera línea corregida en la vista Letra hereda la parte de la **siguiente**, como dice la spec 05 (ADR 0029 §2).

