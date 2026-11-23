# 0316 — Textos sin clave en los remates de las features 5 y 8 (0.2.2)

- De: programador
- Para: disenador-ux
- Estado: Respondida
- Bloquea: no (texto genérico aplicado)

## Contexto

Al implementar las tareas 0388 y 0389 aparecen textos que la spec no fija.

## Pregunta

1. **«Mostrar la carpeta» del resultado del lote (spec 10 · I)**: si la carpeta ya no existe, `mostrarCarpetaLote` da `DESTINO_NO_DISPONIBLE`. ¿Qué texto y de qué tipo (toast, línea en el diálogo)?
2. **«Ajustar los fines…» (spec 02 · F5-B12)**: textos de los motivos nuevos `SIN_VOZ` y `SIN_PICOS`. Sentido propuesto por el arquitecto: «no tiene la pista de voz: vuelve a separarla» y «no se pudo leer la voz; vuelve a intentarlo».
3. **«Cambiar opciones» del resultado del lote**: la spec lista sin espacio, destino no disponible, perfil no soportado y captura. He añadido también `SIN_CODIFICADOR` (la tabla de errores de la spec 10 lo trata igual: el primario es «Cambiar opciones»). ¿Se confirma?
4. **`exp.lote.aviso.existe`** con k = 1 dice «1 de estas canciones ya tienen…» (la spec solo da el plural). ¿Variante singular?

## Opción provisional tomada (si no bloquea)

1. Toast de aviso «La carpeta ya no está disponible.» (`EXP_LOTE.carpetaNoExiste`, sin clave).
2. El texto genérico de hoy (««{título}» no se puede preparar ahora.»).
3. Incluido `SIN_CODIFICADOR`.
4. El plural de la spec, tal cual.

## Respuesta

Diseñador UX, 2026-11-23. Specs 02 y 10 actualizadas.

1. Toast de aviso `exp.lote.carpetaNoExiste`: «La carpeta «{carpeta}» ya no está disponible. Puede que se haya movido o que el disco esté desconectado.» El diálogo de resultado sigue abierto.
2. `bib.acc.motivo.SIN_VOZ`: «No se pueden ajustar los fines: falta la voz separada. Vuelve a separar las pistas («Re-separar pistas») y prueba de nuevo.» · `bib.acc.motivo.SIN_PICOS`: «No se pudo analizar la voz a tiempo. Vuelve a intentarlo en un momento.» Valen para «Ajustar los fines…» (su toast de fin) y para «Preparar» por lotes, en lugar del texto genérico.
3. **Confirmado**: `SIN_CODIFICADOR` muestra [Cambiar opciones].
4. Variantes singulares de `exp.lote.aviso.existe`: «1 de estas canciones ya tiene un video en esta carpeta: se guardará con « (2)» en el nombre.» · (sustituir) «1 video de esta carpeta se sustituirá cuando el nuevo esté terminado.» · (omitir) «1 canción no se exportará porque ya tiene un video en esta carpeta.»
