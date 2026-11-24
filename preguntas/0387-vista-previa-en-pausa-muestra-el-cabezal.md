# 0387 — Vista previa en pausa: ¿el cabezal o la línea seleccionada?
- De: disenador-ux
- Para: usuario
- Estado: Abierta
- Bloquea: no

## Contexto

Incidencia I-2 de las pruebas en Windows ([nota](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md)): al pausar, la vista previa del editor enseñaba la línea seleccionada (la 1) aunque el cabezal estuviera a minutos de distancia. No era un fallo de programación: la spec 06 lo pedía así desde el MVP, para juzgar los colores de la línea en pausa. Para ti es un fallo («pausa para ver dónde va y ve el principio de la canción»), y tienes razón: se cambia el diseño. Spec: [06 · Vista previa en pausa: manda el cabezal (I-2)](../ux/06-editor.md#vista-previa-en-pausa-manda-el-cabezal-i-2).

## Pregunta

¿Te sirve esta regla? Se aplica ya como provisional.

## Opción provisional tomada (si no bloquea)

1. **En pausa se ve el instante del cabezal**: exactamente lo que se vería en el reproductor en ese momento (también en un hueco entre líneas y con voces a la vez).
2. **Para ver la línea que estás editando**: con la canción en pausa, al seleccionar una línea (o hacer clic en la ya seleccionada) o cambiar sus tiempos, la vista previa la muestra como antes (mitad resaltada) con una pequeña etiqueta «Línea {n} (en pausa)». En cuanto reproduces, pausas o mueves el cabezal, vuelve a mandar el cabezal.
3. **La selección no salta al pausar.** Alternativa descartada: que al pausar se seleccione la línea que suena. Se descarta porque el gesto habitual es «escucho, pauso donde empieza la línea que arreglo y pulso I»: si la selección saltara, la I iría a la línea anterior. Dónde está el cabezal lo dicen la vista previa, el ▶ de la lista y la línea de tiempo.
4. Con el editor preciso abierto, seleccionar palabras o mover sus bordes no cambia la vista previa a «línea»: se sigue viendo el barrido palabra a palabra en el punto del cabezal.

Si prefieres que la selección siga al cabezal al pausar (aceptando el riesgo de la I), dilo y se cambia.

## Respuesta
