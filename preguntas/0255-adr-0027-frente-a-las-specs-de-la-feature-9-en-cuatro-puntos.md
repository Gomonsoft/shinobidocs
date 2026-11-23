# 0255 — ADR 0027 frente a las specs de la feature 9: cuatro puntos que no coinciden (0.2.2)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (se aplicó la opción conservadora en cada punto; tareas [0323](../tareas/0323-exportar-la-letra-a-lrc.md), [0324](../tareas/0324-escribir-paquetes-y-copias.md) y [0325](../tareas/0325-importar-paquetes-y-restaurar.md))

## Contexto

Al implementar el lote E (ADR [0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md)) el ADR y las specs ([02 · Feature 9](../ux/02-biblioteca.md), [08 · Feature 9](../ux/08-ajustes-y-acerca.md)) dicen cosas distintas en cuatro sitios.

## Pregunta

1. **Canción con un trabajo en curso al exportar.** ADR §2: se **omite** con `EN_CURSO`. Spec 02 («se exporta como está guardada») y spec 08 («si se están separando, entran sin pistas»): se **incluye**. ¿Cuál vale?
2. **Nombre del `.lrc` de varias canciones.** ADR §4: `<Artista> - <Título>.lrc`. Spec 02 (`lrc.nombre`): `{título} — {artista}.lrc`, sin artista `{título}.lrc`, también para varias.
3. **Pausas con tiempo en el `.lrc`.** Spec 02: «se escriben como marcas vacías». ADR §4: «no se escriben aparte» (las representa la marca vacía del fin efectivo si el hueco es de 2 s o más). Con la regla del ADR, una pausa corta (hueco menor de 2 s) no deja rastro.
4. **Entrada con `..`, absoluta o con `\` en un paquete.** El ADR §8 dice «ignorada»; el encargo del lote, «se rechazan».

## Opción provisional tomada (si no bloquea)

1. **El ADR**: la canción se omite con `EN_CURSO` (sus archivos pueden estar a medias y no se quiere un paquete con una pista truncada); el resultado la lista como omitida. Si se prefiere la spec, bastaría exportar `cancion.json` con la instantánea y los archivos que existan, sin pistas, y la 0326 pondría la nota `aj.copia.nota.enCurso`.
2. **La spec** (`{título} — {artista}.lrc`, función `nombreLrc`), para que una y varias canciones den el mismo nombre.
3. **El ADR** (la marca vacía en el fin efectivo con hueco ≥ 2 s y tras la última línea; las pausas no se escriben aparte).
4. **Rechazo del paquete entero** con `PAQUETE_NO_VALIDO` (`yauzl` con `strictFileNames`; también enlaces simbólicos, entradas cifradas o repetidas). Una entrada con nombre **válido pero no declarada** en el manifiesto sí se ignora, como dice el ADR.

## Respuesta

Arquitecto, 2026-11-22. Queda fijado en ADR [0027](../adr/0027-copia-de-seguridad-paquete-de-cancion-y-exportar-lrc.md), «Revisión 2026-11-22 (preguntas 0255–0258)».

1. **Canción con trabajo en curso: manda la spec**, que es más útil para una copia de seguridad. Omitirla entera perdería justo lo valioso (letra, tiempos y estilo) por un archivo a medias. Regla: entra `cancion.json` (instantánea) y **solo los archivos de pasos completados**; nunca un archivo en escritura. Una canción que se está separando entra sin pistas, con `pasos.separacion = "pendiente"`, y al importarla se comporta como un paquete ligero para lo que falta. El diálogo avisa con `aj.copia.nota.enCurso`. El código `EN_CURSO` deja de usarse para omitir. Cambio en la tarea nueva [0376](../tareas/0376-remates-de-copias-y-paquetes.md).
2. **Nombre del `.lrc`**: confirmada la spec (`{título} — {artista}.lrc`, sin artista `{título}.lrc`, igual para una y para varias).
3. **Pausas con tiempo: manda el ADR**. No se escriben aparte; el silencio queda como marca vacía en el fin efectivo de la línea anterior si el hueco es de 2 s o más, y tras la última línea. Así la ida y vuelta con el importador es exacta y los reproductores no borran la línea en silencios cortos. **Cambio de spec para el diseñador** (02 · Feature 9, «Qué contiene», hacia la línea 1435): sustituir «Las pausas con tiempo se escriben como marcas vacías» por «Las pausas no se escriben aparte: un silencio de 2 s o más tras una línea queda como marca vacía en su fin (y tras la última línea)». F9-13 ya lo dice así.
4. **Rutas hostiles: rechazo del paquete entero** con `PAQUETE_NO_VALIDO`: confirmado, es lo más seguro. Incluye `..`, rutas absolutas, `\`, enlaces simbólicos, entradas cifradas y repetidas. Una entrada con nombre válido pero no declarada en el manifiesto se ignora. Corrige el «ignorada» de §8.
