# 0223 — Edición del usuario durante la preparación: ¿detiene o continúa? (0.2.2, feature 5)

- De: programador
- Para: arquitecto
- Estado: Respondida (2026-11-22, arquitecto)
- Bloquea: no (regla intermedia aplicada en la tarea [0308](../tareas/0308-servicio-de-preparacion-desatendida.md))

## Contexto

ADR 0025 §2 y el criterio de la 0308 dicen que la preparación se detiene al «guardar el usuario una letra o tiempos en esa canción»; la spec 04 (F5-P7) dice que si el usuario elige una letra antes de que termine la separación, la preparación **no la sustituye y solo la comprueba**. Además la tarea pide detener con `EDICION_BLOQUEADA`, pero el ADR §2 dice «espera a que salga de la cola».

## Pregunta

¿Se confirma esta lectura conjunta?

1. Aparece una letra (la elige el usuario) mientras se espera: la corrida **continúa**, no busca, no sustituye y solo comprueba (y pone fines solo si la letra sigue `intacta`). 
2. El usuario cambia **tiempos o texto de una letra que ya existía** (no los escribe la corrida): se **detiene**. Si no había hecho nada, retira el registro; si no, queda `detenida`.
3. Sesión en vivo (`edicionBloqueada()`): la corrida **espera** (sondeo de 500 ms) antes de escribir letra o fines; `preparacion.preparar` omite la canción con `EDICION_BLOQUEADA`. La señal de la sesión es global (`ServicioSesion.edicionBloqueada()`), no por canción.

## Opción provisional tomada (si no bloquea)

La lectura anterior. Además: con la separación `pendiente` y sin ningún trabajo que la lance (p. ej. «Preparar» sobre un borrador cuya separación nunca se pidió), la corrida espera indefinidamente en `esperando_separacion` hasta que se cancele; no encola la separación por su cuenta (no está en el ADR).

## Respuesta

Arquitecto, 2026-11-22. Confirmo 1, 2 y 3 (corrigiendo el texto del ADR en 3). El caso de la separación `pendiente` es un **defecto**.

1. **Letra elegida por el usuario durante la corrida**: confirmado. La corrida continúa, no busca ni sustituye, solo comprueba, y pone fines solo si la letra sigue `intacta` (spec 04, F5-P7).
2. **El usuario cambia tiempos o texto de una letra que ya existía**: confirmado, se detiene. Si no había hecho nada, retira el registro; si no, queda `detenida`. Asignar quién canta (0.2.3) no cuenta como edición.
3. **Sesión en vivo**: confirmado esperar antes de escribir letra o fines, con la señal **global**. Es lo correcto porque ADR 0017 §9 bloquea todas las escrituras de letra durante la sesión, no por canción; el «si la canción está en la cola» de ADR 0025 §2 era inexacto y queda corregido. Mientras tanto siguen la descarga, la separación y la búsqueda. `preparacion.preparar` sigue omitiendo con `EDICION_BLOQUEADA` (ADR 0025 §7). El sondeo de 500 ms vale; si `ServicioSesion` emite el fin de la sesión, mejor escucharlo, pero no es obligatorio.
4. **Separación `pendiente` que nadie lanza: defecto.** «Preparar» empieza «desde el primer paso pendiente» (ADR 0025 §7) y la separación lo es. Al llegar a `esperando_separacion` (al preparar o al reanudar), si `pasos.fuente` está completada, `pasos.separacion` está `pendiente` y no hay ningún trabajo de separación de esa canción en `GestorTrabajos`, la corrida **encola la separación** por el mismo camino que al completar la fuente (cola `pesada`). Con la separación en `error`, sigue la regla de §2 (`elige_letra` con candidatos sin encaje); no se reintenta sola. Criterio y test en la tarea [0309](../tareas/0309-tanda-pausa-paradas-y-reanudar-al-abrir.md).

**Cambio de código** (`app/src/main/preparacion/servicio.ts`, en el paso que espera la separación): antes de esperar, si `cancion.pasos.fuente === 'completado' && cancion.pasos.separacion === 'pendiente'` y el gestor no tiene un trabajo `separar` en cola ni en curso para esa canción, llamar al mismo método que encola la separación al completar la fuente. Test: «Preparar» sobre un borrador con la separación pendiente y sin trabajo encola exactamente una separación; con una ya en cola, ninguna.
