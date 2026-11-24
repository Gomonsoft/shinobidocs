# Plan 6 · Correcciones tras las pruebas manuales en Windows (0.2.3-alpha.1)

- Fecha: 2026-11-23
- Origen: [incidencias-2026-11-23-windows](../../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md) y la orden del usuario de ese día.
- Rama: `version-0.2.3` (PR #19, borrador, hacia `develop`). No se etiqueta, publica ni fusiona sin orden expresa.

## Orden pedido por el usuario

| N.º | Qué | Quién | Tareas | Preguntas |
|---|---|---|---|---|
| 1a | I-1, lo seguro: los errores del renderer llegan a `app.log` con su pila; límite de errores en la interfaz (pantalla de error con salida, en vez de la ventana en negro) | diseñador (spec de la pantalla de error) → programador | 0396–0398 | 0387–0389, 0399–0401 |
| 1b | I-1, la causa: búsqueda con el registro ya activo; prueba E2E que arrastra regiones con el ratón entre carriles (incluida la franja «cantante nuevo») | programador | 0396–0398 | 0399–0401 |
| 2 | Elección automática de la letra (0 de 7): revisión de los umbrales del encaje y de `desfaseMinimoMs` con los datos de la nota; causa de los 0 fines de la preparación | arquitecto → programador | 0392–0395 | 0393–0395 |
| 3 | I-3: doble clic en una palabra del editor preciso con la canción sonando reproduce desde ahí y no vuelve | programador (el diseñador ajusta la spec 06) | 0399–0400 | 0402–0404 |
| 4 | I-2: qué muestran la vista previa y la selección al pausar; decide el diseñador con la spec 06 (para el usuario es un fallo) | diseñador → programador | 0399–0400 | 0387–0389 |
| 5 | Propuestas 040 a 043: **no se implementan**. Valoración de diseño y técnica para que el usuario decida | diseñador y arquitecto | — | 0390–0392, 0396–0398 |

## Reglas de este plan

- La franja «Suelta aquí para un cantante nuevo» (propuesta 041) no se quita hasta conocer la causa de I-1.
- Un solo agente ejecuta `npm run build` y Playwright a la vez: el programador de I-1. El resto usa typecheck, lint y Vitest; sus E2E se ejecutan al final.
- Lo que cambie un criterio de «hecha» de 0.2.2 (features 4 y 5) se anota en `docs/versiones/0.2.2/traspaso.md`.
- Decisiones abiertas: opción recomendada, anotada como provisional en una pregunta `Para: usuario`.
- Al terminar: CI en verde y aviso al usuario del commit que debe instalar la sesión de Windows.

## Estado

(se actualiza al cerrar cada punto)

- **Punto 2** (2026-11-23, arquitecto): decidido y desglosado. ADR 0024 y 0025, revisiones del 2026-11-23. Tareas 0392 (ventana de inicio a 800 ms), 0393 (elegir sin comprobar), 0394 (fines aplazados con el editor abierto) y 0395 (interfaz; espera la pregunta 0394 al diseñador). 0393 y 0395 se entregan juntas. Provisional para el usuario: pregunta 0393.
- **Puntos 1a y 1b** (2026-11-23): hechos. Causa encontrada y corregida (la vista previa reutilizaba un fotograma tras cambiar el número de zonas con el audio sonando); sin confirmar con la pila real del equipo Windows (pregunta 0401). Tareas 0396–0398.
- **Punto 2:** implementado (tareas 0392–0395). Capturas F5-L13 y F5-B18 pendientes.
- **Puntos 3 y 4:** hechos (tareas 0399 y 0400; preguntas 0387 y 0388, provisionales).
- **Punto 5:** valoraciones de diseño y técnica escritas en las propuestas 040–043; decide el usuario. Pasan a la versión siguiente.
- **Publicación:** por orden del usuario del 2026-11-23, esta rama se fusiona y se publica como `0.2.3-alpha.2`; lo pendiente (guías manuales, preguntas `Para: usuario`, propuestas) pasa a la versión siguiente.
