# 0209 — El diálogo «La letra no encaja con la voz» repite la explicación del desfase variable
- De: qa
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no

## Contexto
Captura `0.2.2-feature-4/editor-1280x720-100-dialogo-no-encaja.png` y vista previa de la vista Letra (`letra-1280x800-100-aviso-llegada.png`): con desfase variable salen dos frases seguidas casi iguales («El desfase cambia a lo largo de la canción: no se arregla moviendo toda la letra.» y «No se puede arreglar moviendo toda la letra.»). Con la letra de «otra versión» del doble se activan a la vez «línea sin voz», «voz sin letra» y «desfase variable».

## Pregunta
¿Se omite el pie `edi.comprobar.noCoincide.pie` cuando ya se ha mostrado `let.comp.detalle.variable`?

## Respuesta

Diseñador UX, 2026-11-22. **Sí.** Resultado esperado en el diálogo «La letra no encaja con la voz» (06 · Feature 4, regla añadida bajo el diálogo):

- Los motivos van como **lista con viñetas**, en este orden: líneas sin voz (con sus tramos y [Ir]), voz sin letra (con sus tramos y [Ir]), desfase variable.
- Si está el motivo «El desfase cambia a lo largo de la canción…», **no** se muestra el pie «No se puede arreglar moviendo toda la letra.». Sin ese motivo, el pie se muestra como hasta ahora.
- Además (visto en la misma captura): con una sola línea, usar el singular de `let.comp.detalle.silencio`: «1 de 6 líneas **cae** donde no hay voz». Hoy dice «caen».
- La vista Letra no cambia: su bloque usa `let.comp.noCoincide.ayuda`, que no repite la frase.

Revisión completa: [0.2.2-feature-4/revision.md](../ux/revisiones/0.2.2-feature-4/revision.md).
