# Revisión de capturas · 0.2.2 · Feature 5 (preparación desatendida)

- Revisor: diseñador UX. Fecha: 2026-11-22.
- Criterios: F5-B11 ([02](../../02-biblioteca.md#022--feature-5--lista-para-revisar-y-bandeja-de-pendientes)), F5-P12 ([04](../../04-progreso-pipeline.md#022--feature-5--preparación-desatendida)), F5-L8 ([05](../../05-letra.md#022--feature-5--preparación-desatendida-la-vista-letra)), F5-E5 ([06](../../06-editor.md#022--feature-5--preparación-desatendida-lo-que-el-editor-cuenta)), F5-J8 ([08](../../08-ajustes-y-acerca.md#022--feature-5--letras-y-preparación-automática)) y F6-N7/N8 ([03](../../03-anadir-cancion.md#022--feature-6--datos-de-la-canción-automáticos)). Hallazgos de QA: [0244](../../../preguntas/0244-hallazgos-de-diseno-de-las-features-5-y-11-sin-especificar.md) (respondida).
- Revisadas **las 17 capturas**, una a una.

**Veredicto: aprobada con correcciones menores.** Nada bloquea alpha.2: P1 es un cambio de la spec decidido en esta revisión (0244 n.º 4 y 5) y se corrige después.

## Por captura

| Captura | Resultado | Notas |
|---|---|---|
| `biblioteca-…-lista-para-revisar` | Conforme | Están las cuatro tarjetas pedidas. La «Lista para revisar» lleva la insignia `info`, la línea de origen, «⚑ 2 líneas por revisar», [Revisar] y [Probar]. «Elige la letra · 3 candidatas» y «No encontramos la letra» llevan icono y botón. La bandeja tiene sus tres casillas. |
| `biblioteca-…-bandeja` | Conforme | Casilla con foco y sin pulsar. |
| `biblioteca-…-bandeja-filtrada` | Conforme, con nota | El filtro pasa a «Borradores» y la casilla queda activa con 2 tarjetas. La segunda «Lista para revisar» no tiene línea ⚑ ni «Sin líneas dudosas»: no tiene recuento (no pasó por la preparación). La spec ya dice que, sin recuento, no hay línea (02 · F11, revisión de hoy). |
| `biblioteca-1024x640-100-bandeja` | Conforme | La bandeja cabe en una fila; las tarjetas necesitan scroll (0244 n.º 1: conforme). |
| `biblioteca-…-retomando` | Conforme | Aviso `info` sobre la bandeja con [Detener]; tarjeta «Separando 2 %». |
| `editor-…-preparacion-automatica` | Conforme, con **P3** | Bloque «Preparación automática» como primera sección de Funciones, con sus tres renglones y acciones. El banner de la lista sale desplazado y solo se lee su final: no se puede comprobar su texto. |
| `anadir-…-editar-datos-lrclib` (F6-N7/N8) | Conforme | Sugerencia «LRCLIB la llama «…», de «…».» con [Usar estos datos], y álbum con «Tomado de LRCLIB» y [Quitar]. Es el diálogo «Editar datos» de la Biblioteca; el nombre `anadir-` del archivo no importa. |
| `progreso-…-preparando` | Conforme, con **P2** | Subpasos nuevos, búsqueda en paralelo con la separación, [Volver a la biblioteca] primario y [Ver la letra]. «Comprobar la letra con la voz» sale en ○ sin `prog.prep.esperaSeparacion`. |
| `progreso-…-lista-para-revisar` | **No conforme: P1** | R1 correcto en contenido, pero queda al final: hay que desplazar (el título se sale por arriba) y no hay [Volver a la biblioteca]. El título sigue siendo «Preparando tu canción». |
| `progreso-…-elige-la-letra` | **No conforme: P1, P4** | R2 cortado por abajo. El motivo es `sinExacta` con el artista vacío. |
| `progreso-…-no-encontrada` | **No conforme: P1** | R3 cortado por abajo. |
| `progreso-…-letra-pendiente` | **No conforme: P1** | R4 cortado por abajo. Lo demás es correcto (⚠ en «Buscar la letra», «Sin conexión»). |
| `letra-…-elegida-sola` | Conforme | Aviso `let.prep.elegida` (variante corregida) con [Ver otras candidatas] y [×], y la línea de C con [Quitar la corrección]. |
| `letra-…-elige-la-letra` | **No conforme: P4** | Lista comprobada y ordenada con el aviso de motivo. Con el artista vacío, el motivo debería ser `sinArtista`. |
| `ajustes-…-letras` | Conforme | Casilla marcada y texto de privacidad. |
| `ajustes-…-letras-desactivada` | Conforme | Texto de la variante desactivada. |
| `ajustes-…-letras-pendientes` | Conforme | `aj.prep.pendientes` con [Verlos en la Biblioteca]. |

El «✓ Terminado» de la barra superior en varias capturas es el indicador de actividad (4 s): conforme (0244 n.º 5).

## No conformidades

| N.º | Criterio | Qué se ve | Qué debería verse | Gravedad |
|---|---|---|---|---|
| **P1** | Spec 04, fila nueva «Con resultado (R1–R4): orden y título» y F5-P13 (0244 n.º 4 y 5) | El bloque de resultado queda al final, bajo la escucha y cortado por el borde a 1280 × 800; el título sigue en «Preparando tu canción»; no hay [Volver a la biblioteca]. | Título `prog.prep.titulo.fin` según el resultado, sin subtítulo · bloque R justo bajo el título · su botón es el primario con el foco · [Volver a la biblioteca] secundario en la misma fila · subpasos y escucha debajo. Todo el bloque visible sin desplazar a 1280 × 800 y a 1024 × 640. | Se corrige después (cambio de spec de esta revisión) |
| **P2** | Spec 04, «En espera de la separación» | «Comprobar la letra con la voz» en ○, sin texto. | Bajo el subpaso, `prog.prep.esperaSeparacion` («Empezará al terminar la separación.»). | Se corrige después |
| **P3** | F5-E5 (captura) | El banner `edi.banner.preparada` sale desplazado en la lista. | Repetir la captura con la lista arriba para leer el banner entero. | Se corrige después (QA) |
| **P4** | `let.prep.motivo.sinArtista` (0244 n.º 3) | «ninguna es la coincidencia exacta…» con el artista vacío. | Con el artista vacío: «Elige la letra. No la elegimos por ti porque falta el artista de la canción: escríbelo arriba y vuelve a buscar, o elige tú.» (también en R2). Con artista: el texto nuevo de `sinExacta`. | Se corrige después |
