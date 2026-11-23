# Plan 5 · Versión 0.2.3 — Varios cantantes y coros

- Estado: Aprobada por el usuario (2026-11-22). **Definida por el arquitecto** (ADR 0029 y 0030, tareas 0340–0366, [backlog](backlog.md)); specs del diseñador terminadas y alineadas con los ADR (preguntas 0171 y 0175 respondidas). Se empieza cuando 0.2.2 esté integrada en su PR hacia `develop`.
- Origen: propuesta [036](../../propuestas/036-varios-cantantes-y-coros.md); voces a la vez, propuesta [037](../../propuestas/037-prueba-tecnica-de-voces-a-la-vez.md).
- Base: [exploración UX](../0.2.2/exploracion/varios-cantantes-y-coros.md) y [factibilidad técnica](../0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md).
- Indicación del usuario (2026-11-22): «Todos» se piensa para 3 o más cantantes, pero se puede usar en un dúo; dúo, trío, «Todos» y coro tienen la misma base: **una línea de tiempo por parte, con su color y su espacio en pantalla**. Referencias visuales: 3 capturas de karaokes comerciales que aportó el usuario (fuera del repositorio; no se copian).

## Alcance

| Feature | Qué incluye | Tamaño | Tareas | ADR | Entrega | Estado |
|---|---|---|---|---|---|---|
| 0 · Contratos | Esquemas del reparto, funciones puras, IPC, configuración y dobles | M | [0340](../../tareas/0340-contratos-compartidos-de-0-2-3.md) | 0029, 0030 | — | Definida |
| 1 · Cantantes por línea | El usuario añade los cantantes de la canción (hasta 4), más «Todos» y «Coro». Cada línea entera se asigna a uno. Un carril por cantante en la línea de tiempo, visible desde que se añade. **Cada parte con su color y su zona en pantalla**; insignia con la inicial; coro entre paréntesis. | L | 0341–0349, 0362–0364 | [0029](../../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md) | alpha.1 | Definida (spec lista) |
| 2 · Voz en los coros | En las líneas de coro, la voz original suena al nivel elegido para la canción, en el reproductor, la vista previa del editor y la exportación. | M | 0350–0354, 0365, 0366 | [0030](../../adr/0030-voz-original-en-las-lineas-de-coro.md) | alpha.1 | Definida (spec lista) |
| 3 · Voces a la vez | Líneas de partes distintas que se solapan en el tiempo, cada una en su zona con su barrido. **La prueba técnica sirve** (2026-11-23, ADR 0029, «Resultado…»): entra en alpha.2, pendiente de la confirmación del usuario (pregunta 0165, fila 10). Una canción con solapes se ve dañada en versiones anteriores (sin perder nada) | M (prueba) + L | 0356 · 0357–0361 | 0029 §7 y «Resultado» | alpha.2 | Prueba superada; pendiente de confirmación |
| 10 (de 0.2.2) · Sincronizar con la voz | Etapa 1 de la alineación forzada: fines y palabras propuestos sobre la voz separada. **Pasada a 0.2.3 de forma provisional** (pregunta [0280](../../preguntas/0280-que-hace-hoy-la-comprobacion-de-la-letra-con-tus-canciones.md), punto 4, pendiente del usuario). **Condicionada** a la fase 2 de la prueba técnica [0328](../../tareas/0328-prueba-tecnica-de-alineacion-forzada.md), que necesita canciones con fines hechos a mano del usuario. Si entra, empieza por la acción explícita del editor, sin automatismos (propuesta [038](../../propuestas/038-sincronizar-con-la-voz-solo-a-peticion.md)) | L | 0329–0333 (de 0.2.2, sin tareas nuevas) | [0028](../../adr/0028-sincronia-automatica-por-alineacion-forzada-prueba-tecnica-y-etapa-1.md) (Propuesto) | alpha.2 o posterior, solo si la fase 2 sirve | Condicionada |
| — | Cierre de cada entrega | S | [0355](../../tareas/0355-cierre-de-una-entrega-0-2-3-alpha.md) | 0020 | — | Definida |

Una canción de un solo cantante no cambia: sin cantantes añadidos no hay carriles, zonas, insignias ni colores nuevos.

## Fuera de esta versión

- Cambio de cantante dentro de una línea.
- Separar la voz principal de los coros: el modelo que lo hace no tiene una licencia comprobada.
- Texto aún sin cantar teñido con el color de su cantante (una de las referencias): el modelo lo admite más adelante (ADR 0029 §6), pero no entra (decisión 7 de 0160; el usuario puede pedirlo en 0165).
- Voces a la vez **si su prueba técnica no sirve** (feature 3).
- Sincronizar con la voz (feature 10 de 0.2.2) **si la fase 2 de su prueba no sirve o no llega**: se aplica el plan B de ADR 0028 §4 (propuesta 027) en la versión que decida el usuario.

## Preparación en 0.2.2

Seis ajustes sin efecto visible, ya añadidos a las tareas 0287, 0289, 0290, 0293, 0294 y 0296 ([plan 4](../0.2.2/plan-4.md)). Con las zonas por parte, **cinco criterios más** en 0287, 0288, 0289, 0290 y 0296 (pasados a las tareas el 2026-11-22): ver el [backlog](backlog.md#preparación-pedida-a-022-sin-efecto-visible).

## Pendiente antes de implementar

- Specs en `docs/ux/` (editor, reproductor, exportación, Letra, Biblioteca y sistema visual): **hechas**. Quedan dos retoques pequeños del diseñador (respuesta a [0171](../../preguntas/0171-contratos-de-0-2-3-para-las-specs.md), §2 y §4).
- Decisiones provisionales abiertas: preguntas [0160](../../preguntas/0160-decisiones-provisionales-de-ux-de-varios-cantantes-y-coros.md) y [0170](../../preguntas/0170-decisiones-provisionales-de-ux-de-0-2-3.md) (UX) y [0165](../../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md) (técnicas, con la ampliación de 0.2.3).
- 0.2.2 integrada en `develop`. **Excepción decidida por la sesión principal (2026-11-23)**: la implementación empezó en la rama `version-0.2.3`, creada a partir de `version-0.2.2` antes de integrarla. Los arreglos que lleguen a 0.2.2 se traen a 0.2.3.
