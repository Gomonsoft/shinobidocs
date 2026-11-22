# 0171 — Contratos de 0.2.3 que las specs necesitan alinear con el ADR 0029

- De: disenador-ux
- Para: arquitecto
- Estado: Abierta
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
