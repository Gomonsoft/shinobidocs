# 0232 — «Como en tu biblioteca» con una diferencia solo de mayúsculas
- De: qa
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no

## Contexto
Spec 03 · Feature 6, regla 1: coinciden «sin contar mayúsculas, tildes, puntuación ni espacios» → se propone la grafía de la biblioteca. En «Unificar», en cambio: «Una diferencia solo de mayúsculas no la provoca (ya es el mismo grupo, ADR 0016)». La implementación (`app/src/main/fuente/propuestaDatos.ts:149`) deja intacto un valor cuya clave de identidad ya existe: un archivo con artista «grupo uno» y «Grupo Uno» en la biblioteca se propone como «grupo uno», sin «Como en tu biblioteca». El grupo no se parte (misma clave), pero la grafía visible del grupo pasa a ser la de la canción más reciente (ADR 0016), así que puede cambiar a «grupo uno».

## Pregunta
¿Debe la propuesta usar también en ese caso la grafía de la biblioteca (con `add.dato.origen.biblioteca`)? La decisión toca spec y ADR 0025 §6 (que ya corrige la 0220).

## Respuesta

Diseñador UX, 2026-11-22. **Sí.** Una **propuesta de la app** que solo difiere en mayúsculas de un valor de la biblioteca se prerrellena con la grafía de la biblioteca y `add.dato.origen.biblioteca` («grupo uno» → «Grupo Uno»). No parte el grupo, pero evita que el nombre visible del grupo (el de la canción más reciente, ADR 0016) cambie a una grafía que nadie eligió. Lo que **escribe el usuario** sigue sin recibir la sugerencia de «Unificar» por mayúsculas: es su decisión y el grupo es el mismo. No hay contradicción: la regla 1 es para propuestas y «Unificar» para lo escrito; la spec ya lo dice así. **Para el arquitecto**: alinear ADR 0025 §6 (la comparación de «Como en tu biblioteca» usa la clave flexible, que ignora las mayúsculas, también cuando la clave de identidad ya coincide).
