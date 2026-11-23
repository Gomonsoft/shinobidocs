# 0232 — «Como en tu biblioteca» con una diferencia solo de mayúsculas
- De: qa
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no

## Contexto
Spec 03 · Feature 6, regla 1: coinciden «sin contar mayúsculas, tildes, puntuación ni espacios» → se propone la grafía de la biblioteca. En «Unificar», en cambio: «Una diferencia solo de mayúsculas no la provoca (ya es el mismo grupo, ADR 0016)». La implementación (`app/src/main/fuente/propuestaDatos.ts:149`) deja intacto un valor cuya clave de identidad ya existe: un archivo con artista «grupo uno» y «Grupo Uno» en la biblioteca se propone como «grupo uno», sin «Como en tu biblioteca». El grupo no se parte (misma clave), pero la grafía visible del grupo pasa a ser la de la canción más reciente (ADR 0016), así que puede cambiar a «grupo uno».

## Pregunta
¿Debe la propuesta usar también en ese caso la grafía de la biblioteca (con `add.dato.origen.biblioteca`)? La decisión toca spec y ADR 0025 §6 (que ya corrige la 0220).

## Respuesta
(pendiente)
