# 0259 — Detalles de datos de la copia y del paquete que las specs no precisan (0.2.2, feature 9)

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no

## Contexto

Al implementar el lote E aparecieron cuatro detalles que ni ADR 0027 ni las specs fijan del todo.

## Pregunta

1. **«Sustituir» con un paquete ligero** (el caso «recuperar mi sincronía») no manda nada a la papelera: solo cambia `cancion.json` y la versión anterior queda en su `.bak`. La spec 02 enseña «Sustituida (la anterior está en la papelera)» para toda sustitución. ¿Se muestra otro texto para este caso (p. ej. «Sustituida: la anterior se guardó como copia de la canción»)? El resultado por canción ya distingue ambos casos solo por el contexto; si hace falta, se añade un campo.
2. **Ajustes que viajan**: se excluye además `editor.paneles.preciso.geometria` (posición de la ventana del editor preciso: depende de las pantallas, como `reproductor.secundaria`). Se incluye `exportacion.factor_corrector` (ADR: «`exportacion` sin `carpeta`»), aunque mide la velocidad de este equipo.
3. **Cancelar una importación** descarta la canción en curso (no la termina), las ya importadas se quedan y las pendientes salen como `omitida` con motivo `CANCELADO`; la spec dice «detiene tras la canción en curso».
4. **Motivos de `omitida`** en el resultado de importar: `IGUAL`, `OMITIDA` (la eligió el usuario), `CANCION_EN_REPRODUCCION`, `EN_CURSO`, `CANCION_MAS_NUEVA`, `CANCELADO`; y de `error`: `PAQUETE_INCOMPLETO` (archivo dañado: `paq.imp.fallo.incompleta`), `PAQUETE_NO_VALIDO`, `SIN_ESPACIO`, `ERROR_INTERNO`.

## Opción provisional tomada (si no bloquea)

Las descritas arriba; para 1, la 0326 usa el mismo texto de la spec.

## Respuesta

Diseñador UX, 2026-11-22. Spec actualizada: [02 · Feature 9](../ux/02-biblioteca.md#022--feature-9--copia-de-seguridad-paquete-de-canción-y-exportar-la-letra) y [08 · Feature 9](../ux/08-ajustes-y-acerca.md#022--feature-9--copia-de-seguridad).

1. **Se acepta** lo que hace main. Con un paquete ligero no va nada a la papelera; queda el `.bak`. La interfaz lo dice distinto: `paq.imp.fila.sustituidaLigera` («Sustituidas la letra, los tiempos y el estilo; tu audio se conserva») y la nota de revisión `paq.imp.nota.ligeroSustituir`. **Hace falta distinguirlo en el resultado**: la 0326 no debe deducirlo «por el contexto». Main debe devolver en el resultado de esa canción `ligera: true` (o un resultado `sustituida_ligera`). Provisional para el usuario en 0158 n.º 23.
2. **Excluir la geometría del editor preciso: sí.** **`exportacion.factor_corrector`: no debe viajar** (mide la velocidad de este equipo, como el perfil de hardware); main debe excluirlo de la copia. Las demás opciones de `exportacion` (sin carpetas) sí viajan.
3. **Se acepta** descartar la canción en curso al cancelar: no deja nada a medias y responde al momento. La spec dice ahora eso, y las pendientes salen como `paq.imp.motivo.CANCELADO`.
4. **Textos con clave para cada motivo** en la tabla nueva «Motivos del resultado por canción». Un código desconocido usa `paq.imp.fallo.guardar`. Criterio nuevo F9-17.
