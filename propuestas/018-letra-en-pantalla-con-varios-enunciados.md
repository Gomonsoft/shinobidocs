# 018 — Letra en pantalla con varios enunciados, enunciado pasado y transiciones con movimiento

- Estado: En discusión
- Origen: usuario (2026-11-21); feature 1 del [plan de 0.2.2](../versiones/0.2.2/plan-4.md)
- Fecha: 2026-11-21
- Relacionadas: specs [07 · Reproductor](../ux/07-reproductor.md), [06 · Editor](../ux/06-editor.md) (panel Estilo, vista previa), [10 · Exportación](../ux/10-exportacion.md), [sistema visual §10](../ux/sistema-visual.md); ADR [0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md) (temas y herencia), [0018](../adr/0018-estilo-ampliado-espera-letra-lista-y-ajuste-de-silencios.md) (estilo ampliado, reemplazo por canción), [0019](../adr/0019-exportacion-de-video-render-por-fotograma-y-worker-pyav.md) (render por fotograma)
- Exploración de diseño: [`docs/versiones/0.2.2/exploracion/letra-en-pantalla.md`](../versiones/0.2.2/exploracion/letra-en-pantalla.md)
- Maqueta para ver las animaciones (doble clic): [`diseno/letra-en-pantalla.html`](diseno/letra-en-pantalla.html)

## Problema

El reproductor muestra dos líneas (la actual y la siguiente) y, en las pausas, casi nada. El cambio de línea es brusco: la actual desaparece y la siguiente salta a su sitio. Quien canta no ve la estrofa que viene ni dónde quedó lo que acaba de cantar.

En la biblioteca de referencia hay una canción con 101 líneas en 3:29 (mediana de 1,65 s por línea y líneas de 0,27 s): con dos líneas no da tiempo a anticipar. En el otro extremo hay pausas instrumentales de hasta 19 s en las que hoy se ve una sola línea esperando.

## Propuesta

Mostrar de 2 a 7 líneas a la vez (5 por defecto): la que suena, a su tamaño de siempre y anclada en una altura fija; debajo, las siguientes, más pequeñas y tenues; encima, opcionalmente, la que se acaba de cantar, que sube y se apaga hasta un gris derivado del color de la letra. El cambio de línea se anima con uno de dos tipos: «Desplazamiento» (todo el bloque sube un puesto) o «Fundido» (cada línea se funde hacia su nuevo sitio con poco recorrido).

Los ajustes van en el tema, en una sección nueva «Letra en pantalla» del panel Estilo del editor, heredables y con «Cambiar solo en esta canción», igual que los indicadores de espera. El detalle (puestos, tamaños, duraciones, casos límite, convivencia con los indicadores de espera, «Letra lista», 4:3, video) está en la exploración.

## Valor y coste

- Valor: alto para quien canta. Anticipa la estrofa, da continuidad a lo cantado y aprovecha las pausas largas. Es la mejora más visible del reproductor desde los indicadores de espera, y se ve igual en el video exportado.
- Coste estimado: **L**. Piezas:
  - modelo de render (`render.ts`): de «actual + siguiente» a una lista de líneas con puesto, todo como función del tiempo;
  - `PantallaLetra` y su CSS: varias líneas, transiciones, gris derivado y suelo de contraste;
  - esquema del estilo y reemplazo por canción (ADR nuevo o revisión del 0018);
  - panel Estilo del editor: sección «Letra en pantalla» y su ejemplo;
  - specs 06, 07, 10 y sistema visual; pruebas del modelo y guía manual de legibilidad.
- Riesgos o dudas abiertas:
  - rendimiento al mover hasta 8 líneas por fotograma en un equipo modesto, en la ventana secundaria y en la captura para video;
  - legibilidad real a 5 m de las líneas al 60 % (solo se puede comprobar en una TV);
  - cambio de aspecto de toda la biblioteca al actualizar si se acepta que lo existente pase a 5 líneas;
  - las cifras de la exploración se midieron a mano sobre 12 canciones; conviene repetirlas con un script.

Decisiones que necesita el usuario (con la recomendación del diseñador), en el apartado h) de la exploración:

| N.º | Decisión | Recomendación |
|---|---|---|
| 1 | Dónde viven los ajustes | En el tema, con «Cambiar solo en esta canción» |
| 2 | Qué pasa con las bibliotecas y temas existentes | Pasan a 5 líneas |
| 3 | «Líneas ya cantadas» por defecto | 1 |
| 4 | Línea ya cantada también con 3 líneas | No (solo con 4 o más, como se pidió) |
| 5 | Hasta 2 líneas ya cantadas con 6 y 7 | Sí |
| 6 | Segunda animación y opción sin animación | «Fundido», y además «Sin animación» |
| 7 | Fin de línea con hueco corto | Dos tiempos: sube al acabar; la siguiente entra en su inicio |
| 8 | Pausas largas | Líneas siguientes a la vista con los indicadores; la cantada se retira a los 2 s |
| 9 | Líneas de dos renglones | Conservan su forma en todos los puestos |
| 10 | Tamaño de la línea activa con 6 y 7 | Igual que hoy |
| 11 | Exportación | Usa lo del tema; sin control propio en el diálogo |

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
