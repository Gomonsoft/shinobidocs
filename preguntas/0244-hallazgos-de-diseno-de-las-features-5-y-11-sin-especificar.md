# 0244 — Hallazgos de diseño de las features 5 y 11 que la spec no dice (0.2.2, alpha.2)

- De: qa
- Para: diseñador-ux
- Estado: Respondida
- Bloquea: no

## Contexto

Capturas en `docs/ux/revisiones/0.2.2-feature-5/` y `0.2.2-feature-11/`. Lo que sigue lo hace la app y **no está en la spec** (o la contradice en el detalle).

1. **Scroll para llegar a los menús ⋯ a 1024 × 576/640.** Con la bandeja «Pendientes de ti» y la cabecera de la Biblioteca, la primera fila de tarjetas empieza hacia y = 280-290 px; a 1024 × 640 solo cabe la línea de estado y el ⋯ de la primera fila (`biblioteca-1024x640-100-bandeja.png`), y los botones de la tarjeta quedan bajo el borde; a 1024 × 576 hay que desplazar para llegar a más. En Ajustes, la sección «Letras y preparación automática» empuja «Temas» y sus filas con ⋯ por debajo de 800 px. Es una vista con scroll propio y no hay un criterio de «sin scroll» para la Biblioteca ni para Ajustes, así que lo tomo por **conforme**. Lo que sí sorprende: `MenuContextual.tsx:151` cierra el menú al desplazar **cualquier** contenedor (`scroll` en captura), y la spec del menú (`sistema-visual.md`, «Menú contextual») no lo dice. ¿Se acepta (y se escribe) o el menú debería seguir a su botón?
2. **Autoescucha y zoom al entrar con «Revisar».** Conforme a la spec (F11-E4 y «Al llegar a una línea»: suena el tramo de −0,5 s a +0,5 s y la línea de tiempo hace «Zoom a la línea» si la región mide < 120 px), con `revision_autoescucha` marcada por defecto. Pero con una canción **hecha a mano** que se deriva «Lista para revisar» (02, tabla de estados: «da igual si lo hizo la app o el usuario»), pulsar «Revisar» empieza a sonar solo sin que el usuario haya pedido escuchar nada. ¿Es la intención también para canciones propias?
3. **Cuerpo de «Elige la letra» frente a la lista.** En `letra-1280x800-100-elige-la-letra.png`, «No la elegimos por ti porque ninguna es la coincidencia exacta de título, artista y duración» convive con un candidato marcado «Coincide con tu audio» y otro «Va 0,8 s adelantada: la corregiremos». Cierto técnicamente (sin artista no hay coincidencia exacta), pero el usuario ve tres letras que «encajan» y ninguna elegida. ¿Se aclara el motivo `sinExacta` («Falta el artista»)?
4. **Progreso a 1280 × 800 no cabe sin scroll.** Con el bloque de resultado (R1, R2, R3, R4) bajo «Escucha el resultado», el botón primario queda en el borde inferior (`progreso-1280x800-100-elige-la-letra.png`, `-lista-para-revisar.png`): hay scroll de página y el título se sale por arriba. La spec 04 pone «Volver a la biblioteca» como primario con el foco, no el de R1-R3; ¿los botones de R deben verse sin desplazar, p. ej. subiendo el bloque sobre «Escucha el resultado»?
5. **«Terminado» sigue arriba a la derecha** y el título sigue siendo «Preparando tu canción» con la preparación ya terminada (R1-R4). ¿Intencionado?
6. **Resultado de la tarea 0337 / R1–R6 de la feature 11:** las capturas nuevas (ver `0.2.2-feature-11/`) cumplen R1, R2, R3, R5 y R6; R4 se confirma: el fixture fija el fin de la línea 2 (`fin_ms` explícito), así que «El fin llega 3,0 s después de la voz» sin la variante automática y el recuento de 2 son correctos.

## Pregunta

Tus decisiones sobre 1–5.

## Opción provisional

Ninguna: todo queda como está.

## Respuesta

Diseñador UX, 2026-11-22.

1. **Se acepta y se escribe** (sistema visual, «Menú contextual»): el menú se cierra al desplazar la página o un contenedor de su botón (no con su propio desplazamiento) y al redimensionar; abierto con teclado, el foco vuelve a su botón. No sigue al botón. El scroll de la Biblioteca y de Ajustes a 1024 × 576/640 es conforme.
2. **Cambia (provisional para el usuario, 0158 n.º 24)**: al empezar el recorrido (abrir con «Revisar», R o [Revisar ahora]) la **primera línea no suena sola**, en ninguna canción; foco en [✓ Está bien] y «▶ Escuchar otra vez» la hace sonar. Desde la segunda, la autoescucha como siempre. El zoom no cambia. Spec 06 (fila «Al llegar a una línea» y F11-E4).
3. **Se aclara**: motivo nuevo `let.prep.motivo.sinArtista` («falta el artista de la canción: escríbelo arriba y vuelve a buscar, o elige tú»), con prioridad cuando el artista está vacío; y `sinExacta` reescrito («aunque alguna encaja con tu audio, ninguna coincide a la vez en título, artista y duración con tu canción»). Spec 05; vale igual para R2 de la spec 04.
4. **Cambia**: con resultado, el bloque R va **justo bajo el título**, antes de subpasos y escucha; su botón es el primario con el foco y [Volver a la biblioteca] pasa a secundario en la misma fila. Lo de debajo puede desplazarse. Spec 04 (fila «Con resultado…» y F5-P13).
5. **Título: cambia** a `prog.prep.titulo.fin` según el resultado, sin subtítulo. **«✓ Terminado»** de la barra superior es el indicador de actividad (4 s y se va): conforme.
6. Anotado; R4 queda conforme. Revisión: [0.2.2-feature-11/revision.md](../ux/revisiones/0.2.2-feature-11/revision.md).
