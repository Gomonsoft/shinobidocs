# 031 — Listas guardadas y cola que no se pierde

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.12); amplía la propuesta [005](005-cola-persistente-entre-sesiones.md)
- Fecha: 2026-11-21
- Relacionadas: spec [02](../ux/02-biblioteca.md) (fase 4, panel de cola); [ADR 0017](../adr/0017-ventana-secundaria-sesion-en-vivo-y-cola-de-reproduccion.md); [pregunta 0049](../preguntas/0049-politica-cola-de-reproduccion.md); propuestas 005, 006, 028 y 034

## Problema
La cola es lo único que hay que rehacer en cada evento, y es lo único que no se guarda.

- La cola vive en memoria: se pierde al salir de la app o si la app se cae (decisión 0049). La propuesta 005 ya lo recoge como «Idea».
- No hay listas: quien canta siempre las mismas 10 canciones con sus amigos las busca y las encola cada vez.
- La Biblioteca agrupa por artista, álbum o fecha, pero no deja crear un grupo propio («Cumpleaños», «Las fáciles»).
- El usuario tiene una segunda pantalla recordada para la sesión: usa o piensa usar la cola en eventos. No hay evidencia de uso real de la cola en los datos, porque no se guarda.

## Propuesta
Dos pasos sobre la misma idea:

1. **La cola sobrevive** (es la propuesta 005). Se guarda en disco y, al abrir la app, se ofrece recuperarla: «Tenías 8 canciones en cola. [Recuperar] [Descartar]».
2. **Listas guardadas.** Guardar la cola con un nombre, y cargarla después en la cola entera o canción a canción.

Detalles para decidir:

- **Guardar.** En el panel de cola: «Guardar como lista…» pide un nombre. También «Añadir a una lista» desde el menú ⋯ de una canción y desde la selección múltiple (028).
- **Ver.** «Agrupar por» gana la opción «Listas»: cada lista es un grupo con sus canciones en su orden. Una canción puede estar en varias.
- **Usar.** En el encabezado de la lista: «A la cola» (todas, en orden) y, con la 006 o la 028, «Exportar video…» para todo el repertorio.
- **Canciones que ya no están.** Una canción eliminada o que volvió a borrador aparece atenuada en la lista y no entra en la cola, con el motivo, como una entrada no disponible de la cola actual.
- **Sin cuentas ni nube.** Las listas viven en la carpeta de datos y entran en la copia de seguridad (025).

## Valor y coste
- Valor: medio-alto para quien hace eventos; nulo para quien solo crea y prueba canciones.
- Coste estimado: M. La parte 1 es S–M (persistencia y revalidación, ya estimada en la 005). La parte 2 añade un archivo de listas, la agrupación y las acciones.
- Riesgos o dudas abiertas:
  - **Contradice la decisión 0049** («al salir de la app, se vacía»). Solo el usuario puede cambiarla.
  - Sin evidencia de uso de la cola en eventos reales, y QA no pudo probar con dos pantallas. Conviene esperar a un evento de verdad antes de construir las listas.
  - Riesgo de convertir la Biblioteca en un gestor de listas de reproducción: mantenerlo en una opción de «Agrupar por», sin vista nueva.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
