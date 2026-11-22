# Plan 5 · Versión 0.2.3 — Varios cantantes y coros

- Estado: Aprobada por el usuario (2026-11-22), por definir. Se empieza al terminar 0.2.2.
- Origen: propuesta [036](../../propuestas/036-varios-cantantes-y-coros.md).
- Base: [exploración UX](../0.2.2/exploracion/varios-cantantes-y-coros.md) y [factibilidad técnica](../0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md).

## Alcance

| Feature | Qué incluye | Tamaño |
|---|---|---|
| 1 · Cantantes por línea | El usuario añade los cantantes de la canción (hasta 4), más «Todos» y «Coro». Cada línea entera se asigna a uno. Un carril por cantante en la línea de tiempo, visible desde que se añade. Colores por cantante e insignia en pantalla. | M–L (unas 9 tareas) |
| 2 · Voz en los coros | En las líneas de coro, la voz original suena al nivel elegido para la canción, en el reproductor, la vista previa del editor y la exportación. | S–M (unas 5 tareas) |

Una canción de un solo cantante no cambia: sin cantantes añadidos no hay carriles, insignias ni colores nuevos.

## Fuera de esta versión

- Voces a la vez (dos líneas distintas cantadas simultáneamente): necesita una prueba técnica antes.
- Cambio de cantante dentro de una línea.
- Separar la voz principal de los coros: el modelo que lo hace no tiene una licencia comprobada.

## Preparación en 0.2.2

Seis ajustes sin efecto visible, ya añadidos a las tareas 0287, 0289, 0290, 0293, 0294 y 0296 ([plan 4](../0.2.2/plan-4.md)).

## Pendiente antes de implementar

- Specs en `docs/ux/` (editor, reproductor, exportación, sistema visual) a partir de la exploración.
- ADR del modelo de datos del reparto y del audio de los coros.
- Desglose en tareas y backlog.
- Decisiones provisionales abiertas: preguntas [0160](../../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md) (UX) y [0165](../../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md) (técnicas).
