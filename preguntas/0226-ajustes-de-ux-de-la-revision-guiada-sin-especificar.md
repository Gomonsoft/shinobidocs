# 0226 — Detalles de la revisión guiada que la spec no fija (0.2.2, feature 11)

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (opción conservadora aplicada en la tarea [0335](../tareas/0335-modo-revisar-en-el-editor.md))

## Contexto y opción tomada

La spec [06 · Feature 11](../ux/06-editor.md) deja estos detalles abiertos; se aplicó lo más sencillo y se revisará con las capturas:

1. **⚑ en la pestaña «Sincronía»** (recorrido activo y otra pestaña abierta): se usa el punto de aviso del control segmentado (`aviso`, como en «Estilo») con el texto accesible «Hay una revisión en curso», no un icono ⚑.
2. **⚑ en la lista**: ocupa la columna de 14 px de la izquierda de la fila; si esa fila está sonando, esa columna muestra el icono ▶ y el motivo sigue en el nombre accesible.
3. **«Línea dudosa siguiente»** de la cabecera de la lista: botón icono con ⚑ + ▼ (dos iconos de 14 px), junto al de «Editor preciso».
4. **«Fin al final de la voz» en una línea con palabras a mano**: no hay confirmación; junto al botón se muestra `edi.preciso.aviso.tirador` y el cambio se deshace con Ctrl/Cmd + Z.
5. **Sin ninguna dudosa desde el principio** (`edi.revision.nada.fin`): solo el texto y «Probar a pantalla completa (F)»; no se repite «Si todo cuadra, usa «Marcar como lista»».
6. **`edi.revision.faltaInicio`**: se muestra en la tarjeta de una línea mientras solo queden líneas sin inicio pendientes (con ellas la revisión no puede llegar a su fin).
7. **Zoom de la línea de tiempo al llegar a una línea**: «Zoom a la línea» solo si su región mide menos de 120 px o no cabe entera en la vista.
8. **Resalte de 2 s del botón del dock** al terminar: contorno `info` en «Marcar como lista» (borrador) o «Hecho» (Lista y Letra lista), mediante el atributo `data-resaltado-revision`.

## Respuesta

Diseñador UX, 2026-11-22. Spec actualizada en [06 · Feature 11](../ux/06-editor.md#022--feature-11--revisión-guiada-de-líneas-dudosas).

1. **Cambia.** En la pestaña «Sincronía», un icono `flag` de 12 px en `texto-2` a la derecha del texto, **no** el punto `aviso`: en «Estilo» el punto significa «problema de contraste» y una revisión en curso no es un problema. Nombre accesible: «Sincronía, hay una revisión en curso». Sin color de estado, sin animación. Desaparece al terminar el recorrido.
2. **Se acepta** como está: columna izquierda de 14 px; mientras la fila suena manda el ▶ y al dejar de sonar vuelve la ⚑. Queda escrito en la spec.
3. **Se acepta** (es lo que dice la spec: icono `flag` + chevron).
4. **Se acepta sin confirmación**, con una condición: al aplicar «Fin al final de la voz» sobre una línea con palabras hechas a mano debe salir el toast de la regla 8.2, `edi.toast.palabras`, con [Deshacer], que devuelve fin y palabras en un paso. El aviso previo `edi.preciso.aviso.tirador` junto al botón se mantiene. **Si hoy no sale el toast, hay que añadirlo.** Decisión provisional para el usuario en [0158](0158-decisiones-provisionales-de-ux-de-las-features-8-a-11.md) n.º 20.
5. **Se acepta**: es el texto de la spec (`edi.revision.nada.fin` y «Probar a pantalla completa (F)»).
6. **Se acepta**: es lo que pide la spec.
7. **Se acepta**: es la regla de la spec (menos de 120 px o no cabe).
8. **Se acepta**: contorno `info` de 2 s en «Marcar como lista» o «Hecho», sin animación con movimiento reducido.

## Pendiente de otras features (no es una duda)

`edi.banner.revision` (borrador preparado por la app) y «Sincronizar esta línea con la voz» dependen de las features 5 y 10; no se han implementado todavía.
