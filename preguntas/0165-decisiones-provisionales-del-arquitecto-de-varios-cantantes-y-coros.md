# 0165 — Decisiones provisionales del arquitecto sobre «Varios cantantes y coros»

- De: arquitecto
- Para: usuario
- Estado: Abierta (ampliada el 2026-11-22 con la definición de 0.2.3)
- Bloquea: no (se aplica la opción recomendada por defecto). Las filas 2 y 9 conviene decidirlas **antes de empezar las tareas 0287, 0289, 0290, 0293, 0294 y 0296 de 0.2.2**.

## Contexto

Revisé si la función que pediste (dúos, tríos y cuartetos, coros con la voz original a un volumen) se puede hacer y dónde encaja: [factibilidad](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md). Las decisiones de diseño del diseñador están en [0160](0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md); aquí van solo las técnicas que te pueden interesar. Es exploración: la función no está autorizada y no cambia el plan de 0.2.2.

## Pregunta

| N.º | Decisión | Opción aplicada (recomendada) | Alternativa | Dónde |
|---|---|---|---|---|
| 1 | Dónde se guarda el reparto | En la letra de la canción (quién canta cada línea, nombres y volumen de los coros); los colores, en el tema. Sin cambiar la versión de los archivos | Guardarlo aparte de la letra | §1.2 |
| 2 | **Volver a una versión anterior** o importar en 0.2.2 un paquete de 0.2.3 | **0.2.2 ya reconoce y conserva** los datos del reparto aunque no los use (cambio pequeño en 0.2.2, sin nada visible). 0.2.1 abre la canción sin reparto y lo pierde si la guarda, como pasó con los ajustes de 0.2.2 | No preparar 0.2.2: un paquete de 0.2.3 abierto en 0.2.2 perdería el reparto sin avisar | §1.3 |
| 3 | Voz original en los coros | Una sola regla de tiempo para el reproductor, la ventana secundaria, la vista previa del editor y el video. En el editor, una pista mezclada en memoria (≈ 85 MB más mientras se usa) | Una segunda pista sonando a la vez en el editor (más compleja con el bucle y la velocidad lenta) | §2.2 |
| 4 | Voces a la vez (etapa 3) | Las líneas siguen en orden de inicio; solo se permite que el **fin** de una línea pase el inicio de la de otro cantante. Antes, una prueba técnica con 3 dúos | Que cada cantante tenga su propio orden de inicios (más cambios en el editor y en las funciones automáticas) | §3.2 |
| 5 | Cambio de cantante dentro de una línea (etapa 4) | Por palabra; solo en líneas con tiempos por palabra | Partir la línea en trozos enlazados | §7 |
| 6 | Atajo Alt + 1…4 para asignar cantante | Se permite (no choca con la app; se tiene en cuenta el teclado de Mac y la tecla AltGr) | Solo la tecla C y el menú | §5 |
| 7 | Separar la voz principal de los coros | No por ahora: el modelo que lo hace no declara una licencia libre comprobable. Los coros con voz guía dejan oír también a la voz principal si canta a la vez | Usarlo bajo tu responsabilidad, como el modelo Rápido | §2.3 |
| 8 | Letra exportada a `.lrc` | Sin cantantes, pero las líneas de coro entre paréntesis (así, al volver a importarla, se reconocen como coro) | Sin paréntesis | §1.4 |
| 9 | **Dónde meterla** | **0.2.3** con las etapas 1 y 2 (unas 14 tareas), después de las cuatro entregas de 0.2.2; etapas 3 y 4 en 0.3.0. En 0.2.2, solo seis ajustes sin efecto visible | Feature 12 de 0.2.2 en alpha.4 (solo la etapa 1; alarga 0.2.2) | §8 |

Además, al revisar el código he visto un **defecto de 0.2.1** que no depende de esta función: si corriges el texto en la vista Letra, las líneas que no cambian pierden sus palabras hechas a mano con el editor preciso (dejan de pintarse una a una). Recomiendo arreglarlo en la tarea 0296 de 0.2.2.

## Opción provisional tomada (si no bloquea)

La columna «Opción aplicada» de cada fila.

## Respuesta

**Respuesta parcial del usuario (2026-11-22):** fila 9, aceptada: la función va en la versión 0.2.3 y en 0.2.2 solo se prepara. Eso incluye la fila 2 (0.2.2 conserva los datos del reparto) y los seis ajustes, ya añadidos a las tareas 0287, 0289, 0290, 0293, 0294 y 0296. El resto de filas sigue con la opción provisional.


## Ampliación · Definición de 0.2.3 (arquitecto, 2026-11-22)

Al definir la versión ([plan 5](../versiones/0.2.3/plan-5.md), [backlog](../versiones/0.2.3/backlog.md), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) y [0030](../adr/0030-voz-original-en-las-lineas-de-coro.md)) he aplicado estas decisiones provisionales. No bloquean: se implementan así si no dices otra cosa. Las filas 1–9 de arriba que siguen abiertas se mantienen; la 4 queda sustituida por la fila 10.

### Qué cubre 0.2.3 de tus referencias

| Referencia | Qué muestra | ¿Entra en 0.2.3? |
|---|---|---|
| Dúo con dos bloques | Dos cantantes en dos zonas de la pantalla, cada uno con el barrido de su color, avanzando **a la vez** | Las **zonas** y los **colores**: sí (feature 1). Que avancen **a la vez**: solo si sirve la prueba técnica (feature 3) |
| Dúo con cuatro líneas | El texto aún sin cantar ya teñido del color de su cantante; la misma frase en dos líneas, una por cantante, avanzando juntas | El color por cantante: sí, en lo ya cantado. El tinte del texto sin cantar: **no** (fila 13). La misma frase a la vez por dos: con «Todos» (una línea) en 0.2.3; como dos líneas, solo con la feature 3 |
| Coros | Coro entre paréntesis, en su color y en otra zona (arriba o abajo) mientras la voz principal sigue en el centro | Paréntesis, color y **zona propia**: sí (feature 1). Coro y principal **a la vez**: solo con la feature 3 |

### Decisiones

| N.º | Decisión | Opción aplicada (recomendada) | Alternativa | Dónde |
|---|---|---|---|---|
| 10 | **Voces a la vez** (dos líneas de partes distintas al mismo tiempo) | **Entran en 0.2.3 como feature 3, condicionadas a una prueba técnica** con criterio cerrado (como la sincronía automática de 0.2.2). Con tu indicación de «espacios separados», cada parte tiene su zona en pantalla y eso abarata mucho dibujarlas; lo que cuesta es cambiar la regla de los tiempos de la letra, que usan unas 20 piezas. Si la prueba no sirve, quedan para después | (a) Entran sin prueba (más rápido, más riesgo en funciones recién publicadas); (c) quedan para 0.3.0 | ADR 0029 §7, propuesta [037](../propuestas/037-prueba-tecnica-de-voces-a-la-vez.md) |
| 11 | **Zonas de pantalla por parte** | Entran con la feature 1: cada cantante en su franja y el coro en la suya; un ajuste del estilo permite volver a «todas en el mismo bloque». Dónde va «Todos» (zona propia o repetido en la de cada cantante) lo decide el diseñador | Un solo bloque con colores (lo de la exploración) | ADR 0029 §4 bis |
| 12 | **«Todos»** | Siempre disponible, también en un dúo; la interfaz lo presenta pensado para 3 o más (tu indicación) | Solo con 3 o más | ADR 0029 §4 |
| 13 | Texto aún sin cantar teñido del color de su cantante | **No** en 0.2.3 (resta contraste a la letra); el modelo lo admite más adelante sin rehacer nada | Añadirlo como opción del estilo | ADR 0029 §6 |
| 14 | Quitar un cantante | Los demás **no** se renumeran (el Cantante 3 sigue siendo el 3 y conserva su color); sus líneas pasan al Cantante 1 | Renumerar | ADR 0029 §1 y §3 |
| 15 | Sustituir la letra entera (otra de LRCLIB) | Se conservan los cantantes, sus nombres y el volumen de los coros; todas las líneas nuevas pasan al Cantante 1 | Perder también los cantantes | ADR 0029 §2 |
| 16 | Volumen de la voz en los coros | Misma escala que el volumen de la voz guía; manda el mayor de los dos | Escala propia | ADR 0030 §1 |
| 17 | Casilla «Incluir la voz en los coros» del video | Marcada por defecto y la app recuerda tu última elección | Siempre marcada al abrir el diálogo | ADR 0030 §5 |
| 18 | Vista previa del editor con coros | Una pista mezclada en memoria (≈ 85 MB más por 4 min de canción mientras se usa) | Ver fila 3 | ADR 0030 §4 |

### Pendiente de ti (no bloquea)

- Si quieres que la prueba de la feature 3 se haga con **un dúo real tuyo**, hará falta que anotes a mano cuándo empieza y acaba cada frase de cada cantante (la app aún no lo permite); si no, se hace con una letra inventada que reproduce tus tres referencias.
