# 0280 — Qué hace hoy «comprobar la letra con la voz» con tus canciones, y qué necesitamos de ti

- De: arquitecto
- Para: usuario
- Estado: Abierta
- Bloquea: no (se aplica la opción prudente de abajo; las features 4 y 5 quedan «hechas con reservas»)

## Contexto

Probamos con 18 canciones de tu biblioteca (en una copia; tus archivos no se tocaron) si la app puede saber sola que una letra de LRCLIB es la de tu canción y si va adelantada o atrasada. Lo intentamos de tres maneras: por dónde hay voz, por dónde empieza cada línea y con el modelo que escucha las palabras. **Las tres dan lo mismo: con letras de LRCLIB (que no marcan dónde acaba cada línea) y con voces que casi no paran, la app no puede estar segura.** Nunca se equivocó en contra tuya, pero tampoco puede confirmar las buenas.

**Qué hace la 0.2.2, por tanto**
- Al comprobar una letra dice «No está claro» y por qué. No la mueve sola ni elige sola. Si una letra parece de otra versión, sí te avisa.
- La preparación automática busca la letra, separa las pistas y te deja la canción en «Elige la letra», con las candidatas ya ordenadas. Eliges con un clic y ella sigue hasta «Lista para revisar».
- «Ajustar los fines…» pone fin a las líneas que no lo tienen, también en tus canciones Lista, siempre preguntando antes y sin mover ningún inicio. Se quita con «Quitar esos fines».
- Corregir un desfase lo haces tú, a oído, en el editor. Las notas de la versión no prometen otra cosa.

**La sincronía automática con la voz (feature 10)**: el modelo encuentra la letra en la voz, pero no sabemos aún si pone bien el fin de cada línea. Para saberlo hay que compararlo con fines puestos a mano por ti. Es opcional: 1,2 GB por idioma y unos 3 GB de memoria mientras trabaja.

## Pregunta

1. **¿Te vale la opción prudente** (más «No está claro» y más «Elige la letra», a cambio de no equivocarse en silencio)? Es la que está aplicada.
2. **Elegir sola sin comprobar** (no aplicada): cuando LRCLIB tiene **una sola** letra con tiempos y su duración coincide con la de tu audio, ¿quieres que la preparación la elija y la marque «sin comprobar con tu audio»? Quedaría «Lista para revisar», nunca «Lista». Alguna vez podría ser la letra de otra versión.
3. **Canciones con fines puestos a mano**: es lo único que puede desbloquear la comprobación y la sincronía automática. Necesitamos al menos 8, idealmente las del otro equipo con las que se calibró todo, en una copia de su carpeta. ¿Puedes dárnoslas, o dejarnos ejecutar la prueba en ese equipo? Solo se anotan cifras, nunca letras ni títulos.
4. **¿La sincronía automática con la voz pasa a la 0.2.3?** Es mi recomendación y está aplicada por defecto: no depende solo de nosotros (necesita el punto 3) y la 0.2.2 ya está completa sin ella. Si prefieres esperar a tenerla en 0.2.2, dilo.
5. **Permiso para probar con red real**: falta probar «Preparar» buscando de verdad en LRCLIB con algunos borradores sin letra y un álbum pequeño. Se envían título, artista, álbum y duración. ¿Lo autorizas, y con qué canciones?

## Opción provisional tomada

La 1 (prudente) y la 4 (sincronía con la voz a 0.2.3), por la regla del plan. La 2 no se aplica sin tu «sí». La 3 y la 5 esperan a tu respuesta.

Detalle técnico: preguntas 0275, 0295, 0305, 0310 y 0311; ADR 0024, 0025 y 0028.
