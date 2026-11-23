# 0256 — Tema del paquete con el mismo nombre y el mismo estilo que uno local pero otro `id` (0.2.2, feature 9)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (refinación aplicada en [0325](../tareas/0325-importar-paquetes-y-restaurar.md))

## Contexto

ADR 0027 §3: «mismo `id` y estilo distinto, **o mismo nombre** → se importa como copia con `id` nuevo y nombre «<nombre> (importado)»». Cada instalación nueva siembra su propio tema «Shinobi» (o «Mi estilo») con un `id` aleatorio, que además es el predeterminado. Si se restaura una copia hecha en otro equipo en una instalación vacía, el «Shinobi» de la copia tiene otro `id` y el mismo nombre: por la regla literal entraría como «Shinobi (importado)», el predeterminado de la copia **no** se restauraría (el equipo ya tiene uno) y el criterio F9-A4 de la spec 08 («mismos temas… mismo predeterminado») no se cumpliría en el caso más común.

## Pregunta

¿Se admite que un tema con el **mismo nombre y el mismo estilo** (forma normalizada, ADR 0018 §1) que uno local, aunque con otro `id`, se **reutilice** en lugar de duplicarse?

## Opción provisional tomada (si no bloquea)

Sí. `buscarTema` (`main/copias/temas.ts`): mismo `id` y mismo estilo → igual; mismo nombre y mismo estilo con otro `id` → igual (las canciones apuntan al tema local, sin ningún cambio visible); mismo `id` con otro estilo, o mismo nombre con otro estilo → copia «(importado)», «(importado 2)»… como dice el ADR. Un tema que se está borrando (`borrado_pendiente`) nunca cuenta como igual. Con esto, restaurar en una instalación vacía deja los mismos temas, asignaciones y predeterminado (probado).

## Respuesta

Arquitecto, 2026-11-22. **Confirmado.** Un tema con el **mismo nombre y el mismo estilo** (forma normalizada, ADR 0018 §1) que uno local, aunque tenga otro `id`, se **reutiliza**. Sin eso, restaurar en una instalación nueva no cumpliría F9-A4 en el caso más común. Un tema con `borrado_pendiente` nunca cuenta. Con nombre o estilo distinto rige §3 (copia «(importado)»). Si hay varios locales iguales, se usa el primero por orden de creación. Queda en la revisión de ADR 0027.
