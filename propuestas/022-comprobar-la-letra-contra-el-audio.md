# 022 — Comprobar la letra contra el audio y corregir el desfase

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.5); retirada del desplazamiento global en 0.2.1
- Fecha: 2026-11-21
- Relacionadas: spec [05](../ux/05-letra.md); [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md), [ADR 0015](../adr/0015-linea-de-tiempo-y-picos-de-voz.md) (picos de voz), [ADR 0021](../adr/0021-sincronia-simplificada-y-editor-preciso-de-linea.md) §8; propuestas 019, 020 y 023

## Problema
La app elige y muestra letras sin escuchar el audio.

- Para saber si una letra corresponde a la versión del audio, el usuario solo tiene la duración («7 s más larga que tu audio») y una vista previa de 15 líneas. Una letra de otra versión, o con una estrofa de más o de menos, se descubre al cantar.
- El «Desplazamiento de toda la letra» se retiró en 0.2.1 porque nadie lo usaba (`offset_ms` 0 en las 12 canciones). El caso sigue existiendo: una letra de LRCLIB adelantada o atrasada en bloque. Hoy se corregiría línea a línea.
- La preparación desatendida (020) necesita un criterio para elegir candidato que no sea solo la duración.

## Propuesta
Cuando la voz está separada, comparar los tiempos de cada letra candidata con los momentos en que la voz suena, dar una puntuación de coincidencia y, si toda la letra va desplazada, corregirla sola.

Detalles para decidir:

- **Cómo se mide, sin modelos nuevos.** Los picos de la pista de voz ya se calculan para la línea de tiempo. Con ellos se obtiene dónde hay voz. Se mide: qué parte de los inicios de línea cae donde empieza a sonar la voz, cuánta voz queda sin ninguna línea (estrofa que falta) y cuántas líneas caen en silencio (estrofa que sobra).
- **Desfase global.** Se prueba a desplazar la letra entre −5 y +5 s y se toma el desplazamiento que mejor encaja. Si mejora de forma clara, se aplica a los tiempos.
- **En la vista Letra.** Cada candidato gana una segunda línea junto a la de duración: «Coincide con tu audio», «Va 0,8 s adelantada: la corregiremos» o «No coincide con tu audio: puede ser otra versión». El orden de la lista usa esta puntuación.
- **En el editor.** Acción «Comprobar la letra con la voz» en «Funciones», con el mismo resultado y la corrección como un paso de deshacer.
- **Antes de separar.** Sin pista de voz no hay comprobación: se muestra solo la duración, como hoy, y la comprobación llega al terminar la separación.
- **Dónde se guarda el desfase.** Decisión del arquitecto: reescribir los tiempos (el campo `offset_ms` se conserva pero ya no tiene interfaz) o usar `offset_ms`.

## Valor y coste
- Valor: alto. Evita terminar una canción con la letra equivocada, recupera sin controles lo que hacía el desplazamiento manual y hace segura la elección automática de la 020.
- Coste estimado: M. Función pura sobre picos y tiempos (como `proponerAjusteSilencios`), textos en la vista Letra y acción en el editor.
- Riesgos o dudas abiertas:
  - Umbrales por calibrar. Hay 12 canciones con letra correcta como caso positivo; los negativos habría que fabricarlos (letra de otra canción, letra desplazada).
  - Los coros y los «oh» sin letra cuentan como voz sin línea y pueden bajar la puntuación de una letra correcta.
  - Un desfase que no es constante (versión con otro arreglo) no se arregla con un desplazamiento: ahí el mensaje debe ser «otra versión», no una corrección.
  - No vale para letras sin tiempos; eso es la etapa 2 de la 019.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
