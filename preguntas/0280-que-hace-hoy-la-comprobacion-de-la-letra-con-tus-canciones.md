# 0280 — Qué hace hoy «comprobar la letra con la voz» con tus canciones, y qué necesitamos de ti

- De: arquitecto
- Para: usuario
- Estado: Abierta
- Bloquea: no (se aplica la opción prudente de abajo; las features 4 y 5 quedan «hechas con reservas»)

## Contexto

Hasta hoy, la comprobación de la letra (feature 4) y la preparación automática (feature 5) solo se habían probado con voces inventadas y con 10 canciones tuyas revisadas a mano, en otro equipo. Hoy se han probado por primera vez con 18 canciones de tu biblioteca del MVP (en una copia; tus archivos no se tocaron). Casi todas tienen la letra tal como vino de LRCLIB: cada línea dice cuándo empieza, pero no cuándo acaba, y no están revisadas a mano. Detalle técnico en [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md).

**Qué funciona**
- Cuando la app propone «Corregir el desfase», corrige bien, y «Deshacer» o «Quitar la corrección» lo deja como estaba en un paso. Se comprobó con dos canciones tuyas.
- Abrir tu biblioteca no cambia ningún archivo de tus canciones.
- La letra en pantalla con 5 y 7 líneas se ve bien con tus líneas más largas.

**Qué no funciona con letras de LRCLIB sin fines**
- Si la letra va 0,8 s adelantada o atrasada, la app **no lo nota**: en ningún caso propuso corregirla. Con una canción lenta llegó a decir «La letra coincide con la voz» con 3 s de desfase.
- En la mitad de tus canciones la voz suena casi sin pausas. Ahí la comprobación no distingue la letra buena de la de otra canción: aceptó letras de otras canciones en 6 de 272 pruebas.
- Cuatro letras buenas salían «puede ser otra versión» por un fallo en la regla. Se corrige.
- «Preparar» no hacía nada con las letras de versiones anteriores, porque no sabe si las tocaste a mano.

**Qué se aplica mientras tanto (provisional)**
- La app **ya no dice «coincide»** cuando no puede saberlo: dice «No está claro» y explica por qué (la voz casi no tiene pausas, o mover la letra apenas cambia nada).
- **No corrige el desfase sola ni elige la letra sola** salvo con una comprobación fiable. Con letras de LRCLIB sin fines, lo normal será que la canción quede en «Elige la letra» para que la elijas tú, y que el desfase lo ajustes a oído en el editor. Es menos automático, pero evita que la app elija una letra equivocada o mueva una letra que estaba bien.
- «Preparar» sobre una canción con letra de una versión anterior **te pedirá confirmación**. Luego solo pondrá fin a las líneas que no lo tienen, donde la voz se para claramente. No moverá ningún inicio, y esos fines se pueden quitar.

**Actualización tras aplicar la opción prudente** (medida con las mismas 18 canciones; pregunta 0295):
- La app **ya no se equivoca**: no aceptó ninguna letra de otra canción, no dio por buena ninguna letra desplazada y no corrigió mal ninguna.
- Pero con tus letras de LRCLIB **no puede confirmar ninguna**: dice «No está claro» en todas las que son correctas. Avisó bien de las tres que parecen de otra versión o se van desfasando, y de una cuyos fines cortan la voz.
- En la práctica, hoy la preparación automática **no elegirá la letra sola**: cada canción llegará a «Elige la letra» con las candidatas ya buscadas y ordenadas, y tú eliges con un clic. Corregir el desfase lo harás a oído en el editor. Las notas de la versión no prometerán que corrige desfases.
- Probamos otra forma de comprobar, por **dónde empieza** cada línea, y tampoco sirve con estas letras: las de LRCLIB no marcan bien cuándo arranca la voz. Queda la alineación automática de la feature 10, que se está probando, o medir con tus canciones revisadas (punto 2).
- Novedad: «Ajustar los fines…» también funcionará en tus canciones **Lista**, sin cambiar su estado y siempre con confirmación. Solo pone fin a las líneas que no lo tienen, y lo puedes quitar en el editor con «Quitar esos fines».

## Pregunta

1. **¿Te parece bien la opción prudente** (más «No está claro» y más «Elige la letra», a cambio de no equivocarse en silencio)? La alternativa es automatizar más con más riesgo de error. No la recomiendo hasta tener las medidas del punto 2.
2. **Canciones revisadas a mano**: para saber si la comprobación funciona con letras bien hechas y ajustarla, necesitamos al menos **8 canciones** que hayas revisado tú con cuidado, con el **fin de cada línea puesto**. Mejor si son de varios artistas y alguna tiene la voz casi continua; pueden ser las 10 del otro equipo. ¿Puedes prepararlas o decirnos cuáles son? Basta con una copia de su carpeta. Solo se anotan cifras, nunca letras ni títulos.
3. **Elegir sola sin poder comprobar (opción B, no aplicada)**: si una canción tiene **una sola** letra con tiempos en LRCLIB y su duración coincide con la de tu audio, ¿quieres que la preparación la elija sola y la marque «sin comprobar con tu audio»? La canción quedaría «Lista para revisar», nunca «Lista», así que la escucharías antes de cantarla. Es más automático, pero alguna vez podría elegir la letra de otra versión. Por defecto, no.
4. **Permiso para probar con red real**: falta probar «Preparar» de verdad, buscando la letra en LRCLIB, sobre algunos borradores sin letra y un álbum pequeño, para ver cuántas canciones caen en «Elige la letra» y si alguna elección automática se equivoca. Se envían título, artista, álbum y duración a LRCLIB. ¿Lo autorizas, y con qué canciones?

## Opción provisional tomada

La 1 (prudente), ya decidida en ADR 0024 y 0025 (revisiones del 2026-11-22). Los puntos 2, 3 y 4 esperan tu respuesta; en el 3, mientras no digas otra cosa, la app no elige sola. Sin ellos, las features 4 y 5 se publican «hechas con reservas», y las notas de la versión dicen que con letras de LRCLIB sin fines la app no detecta desfases.
