# 0340 — Detalles de la selección múltiple y del chip en la lista que la spec no fija

- De: programador
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no (opción conservadora aplicada en las tareas 0342–0344)

## Contexto

Tareas 0342, 0343 y 0344 (editor, feature 1 de 0.2.3). La spec 06 · «Lista de líneas» describe el chip, la selección múltiple y el menú, pero deja sin decir lo siguiente.

## Aplicado (conservador)

1. **Chip clicable dentro de una fila `role="option"`.** La fila es un `<button>`; meter otro botón dentro es HTML inválido y un `button` hermano rompe `listbox › option`. El chip de la lista es un `<span aria-hidden>` con clic de ratón (área de 24 × 24); su nombre accesible `edi.partes.chip` va en el `aria-label` de la fila («…, Canta: Luis») y por teclado se llega con C o con el menú contextual. El chip del panel, del riel y de la barra del editor preciso sí tienen nombre propio. Si el diseñador prefiere un botón por fila (un tab stop por línea o `tabindex="-1"`), hay que cambiar la estructura de la fila.
2. **Clic secundario con varias seleccionadas.** Sobre una fila ya seleccionada se conserva la selección (esa fila pasa a ser la principal, así «Borrar tiempos de esta línea» y «Editor preciso» actúan sobre la fila donde se hizo clic); sobre una fila no seleccionada, vuelve a una sola (como en 0.2.2).
3. **`aria-current`.** Con una sola línea seleccionada la fila sigue marcando `aria-current` solo la que suena (0.2.2). Con varias, la principal lo lleva además (spec «Accesibilidad»).
4. **Aspecto de la principal frente a las demás seleccionadas.** La spec dice «la principal, el tratamiento de siempre» y «las demás, fondo-2 y barra izquierda de 3 px acento-texto», que es lo mismo que ya lleva toda fila seleccionada. Con varias, la principal añade un contorno de 1 px `acento-texto` para distinguirla (la spec dibuja ▶ y ▌ solo en el boceto).
5. **Alt + ↑/↓** recorre cantantes → Todos (con 2 o más, aunque el carril de Todos aún no exista en un dúo) → Coro, también en canciones sin reparto (Cantante 1 → Coro); sin reparto es la única forma de crear un coro con teclado además del menú. No da la vuelta en los extremos. Con partes distintas seleccionadas parte de la de la principal.
6. **«Nombres de los cantantes…»** del menú solo abre «Funciones» (la sección «Cantantes y coros» es de 0346): el foco en el nombre del primer cantante queda para esa tarea.

## Pregunta

¿Se confirman 1–6 o se cambia alguno? (1 y 4 son los que pueden pedir retoques visuales; los capturaré para las revisiones `seleccion-multiple` y `menu-quien-canta`).

## Respuesta
(pendiente)
