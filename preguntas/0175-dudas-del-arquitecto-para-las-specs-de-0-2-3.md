# 0175 — Dudas del arquitecto para las specs de 0.2.3

- De: arquitecto
- Para: disenador-ux
- Estado: Abierta
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
