# 033 — Legibilidad y resaltado que no dependa solo del color

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.8 y §3.15)
- Fecha: 2026-11-21
- Relacionadas: [sistema visual](../ux/sistema-visual.md) §9 y §10; specs [06](../ux/06-editor.md) (Estilo) y [07](../ux/07-reproductor.md) («Legibilidad a distancia»); propuesta 018 (letra en pantalla, otro diseñador)

## Problema
La letra cantada se distingue de la que falta por cantar solo por el color.

- El editor avisa si el contraste entre letra y fondo es bajo, pero no comprueba que el color de resaltado se distinga del color de letra para una persona con daltonismo. Dos colores de luminosidad parecida (rojo y verde, por ejemplo) se ven casi iguales.
- La separación entre letra y fondo depende de una sombra fija. Con los degradados en movimiento de 0.2.0, una zona clara del fondo puede pasar por detrás del texto.
- Son valores fijos del sistema visual («no editables en el MVP»): quien ve mal no tiene nada que tocar.

## Propuesta
Tres opciones de estilo, guardadas en el tema como el resto, y un aviso nuevo en el editor:

1. **Refuerzo del resaltado.** Además del color, la parte cantada puede llevar subrayado o un contorno más grueso. Opción del tema: «Solo color» (como hoy), «Color y subrayado», «Color y contorno».
2. **Fondo de lectura.** Una franja oscura semitransparente detrás de las líneas de letra, con opacidad ajustable (0 %, 40 %, 60 %). Garantiza el contraste sobre cualquier degradado.
3. **Contorno de la letra.** Sustituir o reforzar la sombra fija con un contorno: «Sombra» (como hoy), «Contorno fino», «Contorno grueso».
4. **Aviso de diferencia.** En el panel Estilo, si el color de letra y el de resaltado tienen una diferencia de luminosidad baja: «El resaltado puede no distinguirse. Prueba un color más claro o activa el subrayado.» Mismo patrón que el aviso de contraste actual.

Detalles para decidir:

- **Un tema incluido «Alta legibilidad»** con fondo de lectura, contorno grueso y subrayado, para activarlo con un clic.
- **Mismo aspecto en vista previa, reproductor y video**, como exige el render por fotograma del ADR 0019.
- **Letra lista.** Sin barrido no hay resaltado: solo aplican el fondo de lectura y el contorno.

## Valor y coste
- Valor: medio en general, alto para quien lo necesita. Alrededor de 1 de cada 12 hombres tiene alguna forma de daltonismo; en un karaoke con invitados es probable que haya alguien.
- Coste estimado: S–M. Tres campos nuevos en el estilo, su render, los controles del panel y el aviso. Afecta a editor, reproductor y exportación.
- Riesgos o dudas abiertas:
  - **Coordinar con la 018**, que rediseña cuántas líneas se ven, la línea pasada y las transiciones. El fondo de lectura depende de cuántas líneas haya. Conviene diseñarlas juntas.
  - Más opciones en un panel Estilo que el principio del producto quiere simple: agruparlas en una sección plegada «Legibilidad».
  - El subrayado con barrido progresivo debe avanzar con el barrido, no aparecer de golpe.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
