# 0165 — Decisiones provisionales del arquitecto sobre «Varios cantantes y coros»

- De: arquitecto
- Para: usuario
- Estado: Abierta
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
