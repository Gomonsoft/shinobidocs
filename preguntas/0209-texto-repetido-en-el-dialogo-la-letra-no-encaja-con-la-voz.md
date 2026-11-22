# 0209 — El diálogo «La letra no encaja con la voz» repite la explicación del desfase variable
- De: qa
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no

## Contexto
Captura `0.2.2-feature-4/editor-1280x720-100-dialogo-no-encaja.png` y vista previa de la vista Letra (`letra-1280x800-100-aviso-llegada.png`): con desfase variable salen dos frases seguidas casi iguales («El desfase cambia a lo largo de la canción: no se arregla moviendo toda la letra.» y «No se puede arreglar moviendo toda la letra.»). Con la letra de «otra versión» del doble se activan a la vez «línea sin voz», «voz sin letra» y «desfase variable».

## Pregunta
¿Se omite el pie `edi.comprobar.noCoincide.pie` cuando ya se ha mostrado `let.comp.detalle.variable`?
