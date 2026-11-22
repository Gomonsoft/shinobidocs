# 0170 — Decisiones provisionales de UX de 0.2.3 (varios cantantes y coros)

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (opciones recomendadas aplicadas en las specs)

## Contexto

Specs de 0.2.3 escritas: [06 · Feature 1](../ux/06-editor.md#023--feature-1--cantantes-por-línea) y [Feature 2](../ux/06-editor.md#023--feature-2--voz-en-los-coros) (editor), [07 · Feature 1](../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla) y [Feature 2](../ux/07-reproductor.md#023--feature-2--voz-en-los-coros) (pantalla y audio), [10 · 0.2.3](../ux/10-exportacion.md#023--feature-1--cantantes-en-el-video) (video), [05 · 0.2.3](../ux/05-letra.md#023--feature-1--cantantes-al-corregir-o-cambiar-la-letra), [02 · 0.2.3](../ux/02-biblioteca.md#023--feature-1--coros-en-la-letra-exportada) y [sistema visual · 0.2.3](../ux/sistema-visual.md#023--varios-cantantes-y-coros). Las decisiones de la exploración siguen en [0160](0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md) salvo donde esta pregunta las cambia. Contratos técnicos: ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) y [0030](../adr/0030-voz-original-en-las-lineas-de-coro.md).

## A. Tus tres referencias: qué cubre 0.2.3 y qué no

| Referencia | Qué muestra | En 0.2.3 |
|---|---|---|
| Dúo con dos bloques (arriba y abajo) | Cada cantante en su zona; texto sin cantar blanco; barrido de un color por cantante; los dos bloques avanzan **a la vez** | **Sí**: zona por cantante, barrido en el color de cada uno, texto sin cantar en el color de la letra. **Avanzar a la vez**: solo si entra la parte condicionada (abajo). |
| Dúo con cuatro líneas | Texto **sin cantar** teñido del color del cantante; barrido común; lo que cantan juntos, como dos líneas iguales a la vez | **En parte**: «Todos» se dibuja repetido en la zona de cada cantante (como esa referencia). **No** se tiñe el texto sin cantar (resta contraste a la letra; el modelo deja sitio para añadirlo después si lo pides, ADR 0029 §6). |
| Coros | Coro entre paréntesis, en su color y en su zona, junto a la voz principal en el centro | **Sí**: paréntesis, color propio y **zona propia del coro (arriba)**. Que el coro barra **mientras** canta la principal: solo con la parte condicionada. |

**Voces a la vez** (dos partes cantando al mismo tiempo): el plan 5 la dejaba fuera. Tras tu indicación de hoy, la spec la diseña **aparte y condicionada a la factibilidad que dictamine el arquitecto** ([06](../ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto), [07](../ux/07-reproductor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto)). El arquitecto la propone como feature 3 de 0.2.3 con una prueba técnica previa (ADR 0029 §7 y [propuesta 037](../propuestas/037-prueba-tecnica-de-voces-a-la-vez.md)). **Mi recomendación**: aceptar que la disposición por zonas entre ya (no hay que rehacerla si luego llegan las voces a la vez: cada zona es independiente) y dejar que la prueba decida si las voces a la vez entran en 0.2.3 o después. **El alcance lo decides tú.**

## B. Tu indicación del 2026-11-22: qué he entendido

«Todos» es sobre todo para 3 o más cantantes, pero se puede usar en un dueto; y dueto, trío, «Todos» y coro tienen **la misma base**: líneas de tiempo separadas, colores distintos y espacios separados. Aplicado así:

- **Editor**: un carril por cantante (desde que se añade), un carril de **Coro** siempre que la canción tenga reparto y uno de **Todos** (siempre con 3 o más cantantes; en un dueto, solo cuando tiene líneas).
- **Pantalla**: **una zona por parte** (franja fija): cada cantante en la suya, el coro en la suya. Así se sabe quién canta por posición, además de por color e insignia.
- **Color por parte**: del tema; el Cantante 1 usa el color de lo ya cantado.
- Una canción de un solo cantante **sin coros** no cambia en nada.

## Pregunta

Decisiones de diseño nuevas, con la opción aplicada (provisional). Responde solo las que quieras cambiar.

1. **Un cantante con coros**: **A (aplicada)** dos carriles (Cantante 1 y Coro) y dos zonas en pantalla, sin insignias. · B: sin carriles ni zonas; el coro solo con paréntesis y color.
2. **«Todos» en un dueto**: **A (aplicada)** se puede elegir, pero va al final del menú tras un separador y su carril solo aparece cuando tiene líneas; con 3 o más cantantes va junto a los cantantes y su carril está siempre. · B: igual en todos los casos.
3. **Insignia de «Todos»**: **A (aplicada)** «A·L» con 2 cantantes; con 3 o 4, un icono de dos personas (las iniciales no caben). · B: siempre las iniciales. Iniciales repetidas: dos letras («An», «Al»); con nombres predeterminados, el número («1», «2»).
4. **Zonas en pantalla**: **A (aplicada)** coro **arriba** (con la mitad de alto), cantantes debajo en orden; «Todos» sin zona propia: su línea se repite en la zona de cada cantante (como tu referencia del dúo). Cada zona de cantante muestra su línea y la siguiente; la del coro, una. · B: «Todos» con zona propia en el centro. · C: coro abajo.
5. **Onda en la línea de tiempo**: **A (aplicada)** de fondo detrás de todos los carriles. · B: en su propia fila.
6. **Sustituir la letra de una canción con reparto**: **A (aplicada)** se pierde quién canta cada línea, pero se conservan los cantantes, sus nombres y el volumen de los coros (con un aviso). · B: se pierde todo.
7. **Zonas y «Letra en pantalla»**: **A (aplicada)** con zonas, «Líneas a la vez» y «Líneas ya cantadas» no se aplican (cada zona muestra 2 líneas); el tema puede elegir **«Todas en un bloque»** para ver la canción con reparto como en 0.2.2 (con colores e insignias). · B: sin esa opción.
8. **Texto sin cantar**: **A (aplicada)** en el color de la letra; solo el barrido toma el color de cada cantante (tu primera referencia). · B: teñirlo también con el color del cantante (tu segunda referencia; resta contraste).
9. **Casilla «Incluir la voz en los coros» del video**: **A (aplicada)** marcada la primera vez y se recuerda la última elección. · B: siempre marcada al abrir.
10. **Alcance de las voces a la vez** (ver §A): **A (recomendada)** que lo decida la prueba técnica del arquitecto. · B: dejarlas fuera de 0.2.3 sin prueba. · C: meterlas en 0.2.3 en cualquier caso.

**Pendiente tuyo**: las imágenes de referencia que mencionaste en `docs/Img` no están en el repositorio; las he visto fuera de él, sin copiarlas (llevan logotipos de terceros). Si quieres que queden como referencia, haría falta una versión propia sin marcas.

## Opción provisional tomada (si no bloquea)

La A en todos los puntos.

## Respuesta
