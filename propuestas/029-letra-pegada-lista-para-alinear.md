# 029 — Letra pegada lista para alinear: limpieza asistida, idioma y estribillos

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.5)
- Fecha: 2026-11-21
- Relacionadas: spec [05](../ux/05-letra.md) (vista B y §6 «Renglones de estructura»); [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md); propuesta 019 (etapa 2)

## Problema
Pegar una letra es el único camino cuando LRCLIB no tiene la canción, y es todo manual.

- La ayuda pide al usuario que borre a mano los renglones que no se cantan, «como «[Estribillo]» o «(x2)»». La spec 05 §6 descartó el filtrado automático por el riesgo de borrar versos reales.
- Una letra copiada de una web trae además créditos, nombres de sección, anotaciones entre paréntesis y estribillos escritos una sola vez con «(x2)».
- Después hay que sincronizar todas las líneas al ritmo.
- En la biblioteca real nadie ha pegado una letra: 12 de 12 vienen de LRCLIB. No se puede saber si es porque no hizo falta o porque el camino cuesta demasiado.
- La alineación automática (019) necesita saber el idioma y que el texto sea exactamente lo que se canta.

## Propuesta
Al pegar o importar una letra sin tiempos, la app propone una versión limpia y el usuario la acepta o la corrige viendo qué cambia.

Detalles para decidir:

- **Limpieza asistida, nunca en silencio.** Bajo el área de texto: «Hemos encontrado 4 renglones que no parecen cantarse. [Ver y quitar]». La lista muestra cada renglón con su casilla. Nada se borra sin confirmación.
- **Qué se detecta.**
  - Marcas de sección entre corchetes o solas en su renglón: «[Estribillo]», «Coro:», «Verso 2».
  - Repeticiones: «(x2)», «(bis)». Se ofrece **expandirlas**, repitiendo el bloque, en vez de quitarlas.
  - Créditos y restos de la web: «Letra de…», «Compositores:».
  - Marcas de tiempo sueltas (ya se tratan como LRC).
- **Estribillos repetidos.** Los bloques de texto que se repiten se detectan comparando el texto, sin escuchar el audio. Sirve para dos cosas: avisar si un estribillo aparece menos veces de las habituales («el estribillo aparece 1 vez: ¿falta repetirlo?») y, en la sincronía manual, ofrecer reutilizar los tiempos relativos del primer estribillo al marcar el inicio del siguiente.
- **Idioma.** Se detecta del texto y se muestra en el resumen: «Letra en español». Se puede cambiar. Es el dato que elige el modelo de alineación (019).
- **También para LRCLIB.** Las letras «Solo texto» de LRCLIB pasan por la misma limpieza.

## Valor y coste
- Valor: medio hoy; alto si se aprueba la etapa 2 de la 019, porque entonces «pegar la letra y listo» pasa a ser un camino real.
- Coste estimado: S–M. Reglas de texto y detección de idioma en el proceso principal o en el renderer, una lista de confirmación y un campo de idioma en la canción.
- Riesgos o dudas abiertas:
  - Falsos positivos: un verso real entre paréntesis o que empieza por «Coro». Por eso siempre hay vista previa y casillas.
  - Reutilizar los tiempos de un estribillo falla si la segunda vez se canta distinto; debe ser una oferta, no automático.
  - **Solo si se aprueba la etapa 2 de la 019.** Sin alineación, la limpieza ahorra poco frente al trabajo de sincronizar todo a mano. La detección de idioma sí es necesaria ya para la etapa 1.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
