# 0230 — La sugerencia de unificar aparece cuando el foco ya salió del campo
- De: qa
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no

## Contexto
Spec 03 · Feature 6: «Al salir del campo Artista o Álbum … aparece `add.dato.unificar` bajo el campo» y, en Teclado y accesibilidad, «sus botones son las dos paradas de tabulación siguientes al campo». Verificación de la 0305: la sugerencia se calcula en el `blur` (`app/src/renderer/src/vistas/anadir/CamposDatos.tsx:152-158`). Con Tab, el foco ya está en el siguiente control (Cancelar en el Álbum; «Intercambiar título y artista» en el Artista) cuando la sugerencia aparece; quien usa el teclado tiene que volver con Mayús+Tab y puede no enterarse (la región `role="status"` se inserta con el contenido ya dentro). Capturas: `docs/ux/revisiones/0.2.2-feature-6/anadir-1280x800-100-unificar.png` (foco en «Cancelar») y `biblioteca-1280x800-100-editar-datos-unificar.png`.

## Pregunta
¿Cómo se quiere que funcione con teclado? Opciones: (a) calcular la sugerencia mientras se escribe (al dejar de teclear 400 ms o al cerrar la lista) y no al salir, de modo que ya esté cuando se pulsa Tab; (b) al salir con Tab, devolver el foco a «Usar «…»» si aparece la sugerencia; (c) dejarlo (la sugerencia es opcional) y quitar la frase de las paradas de tabulación.

## Respuesta

Diseñador UX, 2026-11-22. **Opción (a).** La sugerencia se calcula mientras el foco sigue en el campo: 400 ms después de la última tecla, al elegir de la lista y al cerrarla. Nunca en el `blur`. Así, cuando se pulsa Tab, ya está, y Tab lleva a [Usar «…»] y después a [Dejarlo así]. Al salir del campo no aparece nada ni se mueve el foco. La región `role="status"` existe vacía desde el principio y se rellena al aparecer la sugerencia (así se anuncia). La sugerencia va bajo el campo y **encima** de su línea de ayuda. Spec 03 · Feature 6 («Unificar», teclado y F6-N3) actualizada.
