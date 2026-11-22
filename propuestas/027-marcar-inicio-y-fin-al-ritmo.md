# 027 — Marcar inicio y fin al ritmo manteniendo la tecla

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.6)
- Fecha: 2026-11-21
- Relacionadas: spec [06](../ux/06-editor.md) («Sincronizar al ritmo» y «Marcar al vuelo» de la fase 9); [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md) (decisión 5); propuestas 016 y 019

## Problema
«Sincronizar al ritmo» marca solo el inicio de cada línea. El fin queda automático y hay que volver sobre él.

- En las 8 canciones sin palabras importadas, 176 de 314 líneas siguen con el fin automático y 138 lo tienen fijado después, una a una o con «Ajustar los silencios».
- Con letra de LRCLIB los inicios ya vienen puestos. No existe una pasada rápida solo para los fines.
- El editor preciso ya tiene el gesto para palabras: pulsar marca el inicio y, si se mantiene 300 ms o más, soltar marca el fin. Las líneas no lo tienen, así que el mismo editor enseña dos gestos distintos.

## Propuesta
Llevar el gesto del editor preciso al modo «Sincronizar al ritmo», y añadir una pasada «Repasar los fines».

Detalles para decidir:

- **Mantener para el fin.** En «Sincronizar al ritmo», pulsar la tecla marca el inicio de la línea, como hoy. Si se mantiene 300 ms o más, al soltar se fija el fin. Una pulsación corta deja el fin automático. Quien no cambie de costumbre no nota nada.
- **Repasar los fines.** Variante del modo para letras que ya tienen inicios: la canción suena, cada línea se resalta al llegar su inicio y el usuario pulsa una vez cuando deja de sonar la voz. No toca los inicios. Una canción de 4 minutos se repasa en 4 minutos.
- **Ayuda visual.** Durante el modo, la línea de tiempo muestra la voz y el fin recién marcado, para ver si se soltó tarde.
- **Deshacer.** Como hoy: Retroceso deshace la última marca; toda la pasada es un paso del historial.
- **Texto del banner.** «Pulsa cuando empiece cada línea. Mantén pulsado hasta que termine para marcar también su final.»

## Valor y coste
- Valor: medio. Es la alternativa sin modelos a la 019: da fines hechos por una persona en una sola pasada. Unifica el gesto con el editor preciso.
- Coste estimado: S–M. El gesto y el tratamiento de la latencia ya existen en la ventana del editor preciso; hay que llevarlos al modo de líneas y diseñar la variante de repaso.
- Riesgos o dudas abiertas:
  - **Solo si la 019 se aplaza o su prueba técnica no convence.** Si la alineación da buenos fines, esta pasada manual sobra.
  - Soltar la tecla es menos preciso que pulsarla: los fines tenderán a llegar tarde. Se puede compensar con una constante medida.
  - En canciones rápidas, mantener pulsado hasta el fin de una línea y pulsar el inicio de la siguiente se pisan: el inicio siguiente debe cerrar la línea anterior.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
