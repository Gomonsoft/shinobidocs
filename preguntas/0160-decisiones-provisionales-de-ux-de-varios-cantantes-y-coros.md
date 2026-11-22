# 0160 — Decisiones provisionales de UX de «Varios cantantes y coros»

- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no (exploración; opciones provisionales aplicadas en el documento)

## Contexto

Pediste empezar a pensar en dúos, tríos, cuartetos y coros: arrastrar la línea de la segunda persona y darle su espacio, opción «todos», voz original a cierto volumen en los coros, y líneas de tiempo y de letra separadas por cantante. Exploración: [varios-cantantes-y-coros.md](../versiones/0.2.2/exploracion/varios-cantantes-y-coros.md). Propuesta: [036](../propuestas/036-varios-cantantes-y-coros.md). Dudas técnicas: [0161](0161-viabilidad-tecnica-de-varios-cantantes-y-coros.md).

Regla de decisión del [plan de 0.2.2](../versiones/0.2.2/plan-4.md#regla-de-decisión): aplico la opción que recomiendo y la marco como provisional. Nada de esto está autorizado para implementarse. La numeración es la de esta pregunta; la tabla §14 de la exploración recoge las mismas decisiones con otro orden.

## Pregunta

**Dónde y cuándo**

1. **Dónde meterla.**
   - **A (provisional).** Versión propia **0.2.3** con la etapa 1 (dúo por líneas) y la 2 (voz en los coros); la 3 (voces a la vez) y la 4 (cambio de cantante a mitad de línea) en 0.3.0. Antes de implementar las features 1 y 2 de 0.2.2, cuatro ajustes de contratos que no cambian nada visible (exploración §11.2).
   - B. Dentro de 0.2.2, como feature 12 en alpha.4 (solo la etapa 1).
   - C. Todo en 0.3.0, sin tocar ahora las features 1 y 2.
2. **Cuatro ajustes en las features 1 y 2 de 0.2.2 ahora** (color de barrido por línea, ancho reservado para la insignia, «enunciado» con alto libre, subrayado y aviso de daltonismo con varios colores).
   - **A (provisional).** Sí, si el arquitecto confirma que no añaden riesgo.
   - B. No; se rehace lo necesario cuando llegue la función.

**Modelo**

3. **Qué se asigna.** **A (provisional):** líneas enteras; el cambio de cantante a mitad de frase, en la etapa 4. · B: palabras desde el principio.
4. **El coro.** **A (provisional):** es una parte más, como un cantante (con paréntesis y su color). · B: una marca que se combina con un cantante («coro de Luis»).
5. **Nombres.** **A (provisional):** de la canción, «Cantante 1…4» por defecto y editables. · B: tomados de la cola de la fiesta (propuesta 034).
6. **Hasta cuántos.** **A (provisional):** 4 cantantes + «Todos» + «Coro». · B: más.

**En pantalla**

7. **Color.** **A (provisional):** lo ya cantado se pinta en el color del cantante; lo que falta por cantar, en el color de letra de siempre. · B: además, teñir el texto sin cantar con el color del cantante.
8. **Señal que no es color.** **A (provisional):** una insignia pequeña con la inicial a la izquierda de cada línea («A·L» cuando cantan todos; el coro, entre paréntesis). La letra pasa a ocupar hasta el 80 % del ancho (antes 88 %) solo en canciones con varios cantantes. · B: sin insignia, solo color (no cumple accesibilidad).
9. **«Letra lista» con varios cantantes.** **A (provisional):** el texto entero en el color del cantante. · B: igual que hoy, sin color.
10. **Puntos y barra de espera.** **A (provisional):** en el color de quien entra a cantar. · B: como hoy.
11. **Paréntesis del coro.** **A (provisional):** los pone la app al dibujar; si el texto ya los tiene, no se duplican. · B: se escriben en el texto.

**Editor**

12. **Cómo se entra.** **A (provisional):** sin modo especial: menú de cada línea («¿Quién canta?»), tecla **C** y sección en «Funciones». · B: un modo «Reparto» obligatorio.
13. **Línea de tiempo.** **A (provisional):** un carril por cantante en uso; se arrastra una línea de un carril a otro (y con Alt + ↑/↓ o el menú); botón «Juntar carriles». · B: una sola pista con colores.
14. **Varias líneas a la vez.** **A (provisional):** se pueden seleccionar varias (Ctrl/Mayús + clic) solo para asignar cantante; los tiempos se siguen editando de uno en uno. · B: también ajustar tiempos en bloque.
15. **Columnas por cantante en la lista («Reparto»).** **A (provisional):** en la etapa 3, cuando hay voces a la vez. · B: ya en la etapa 1.
16. **Líneas entre paréntesis.** **A (provisional):** la app sugiere «Marcarlas como coro» con un botón (2 de tus 17 canciones las tienen). · B: las marca sola, también en la preparación automática.
17. **Cambiar el texto en «Corregir la letra».** **A (provisional):** la línea cambiada se queda con el cantante de la línea anterior. · B: vuelve al Cantante 1.

**Coros con voz**

18. **Volumen.** **A (provisional):** uno por canción, 50 % por defecto, ajustable de 0 a 100 %. · B: uno para toda la app.
19. **Con la voz guía silenciada.** **A (provisional):** los coros suenan igual (son parte de la canción); con la voz guía más alta, manda la más alta. · B: silenciar la voz guía también silencia los coros.
20. **Video «Solo instrumental».** **A (provisional):** casilla «Incluir la voz en los coros», marcada. · B: nunca incluirla.
21. **Límite que conviene saber.** La voz separada lleva juntas la voz principal y los coros: si en una línea de coro también canta la principal, también se oye. Sin opción que elegir; solo para que lo tengas en cuenta.

**Otros**

22. **Exportar la letra a `.lrc`** (feature 9). **A (provisional):** sin información de cantantes. · B: con un prefijo «Nombre:» en cada línea.

## Opción provisional tomada (si no bloquea)

La A en todos los puntos.

## Respuesta

## Indicación del usuario (2026-11-22)

La mayoría de las canciones siguen siendo de un solo cantante: es el usuario quien añade cuántos cantantes (y, con ellos, cuántas líneas de tiempo) tiene cada canción. Confirma el punto de partida de la exploración (canción sin partes = un cantante, «+ Añadir cantante» hasta 4). Pendiente de ajustar en la spec: un cantante recién añadido debe tener su carril visible aunque todavía no tenga líneas, para poder arrastrarlas a él; hoy la exploración solo muestra carriles de las partes «en uso».

**Respuesta parcial del usuario (2026-11-22):** la función va en la versión 0.2.3 (etapas 1 y 2); 0.2.2 solo se prepara. El resto de decisiones sigue con la opción provisional.
