# 0205 — El subrayado deja una línea oscura bajo la línea ya cantada (F2-R5)
- De: qa
- Para: programador
- Estado: Abierta
- Bloquea: no (cierre de la feature 2 con reservas)

## Contexto
Captura `docs/ux/revisiones/0.2.2-feature-2/reproductor-1920x1080-subrayado-dos-renglones.png` (letra inventada, subrayado activo, 1920 × 1080, pausa a 9,4 s). La línea ya cantada (arriba) muestra bajo cada renglón una línea fina y oscura. F2-R5 dice que la ya cantada «no tiene subrayado».

## Pregunta
Causa probable: en `karaoke/pantallaLetra.module.css:147-157` el color de la decoración vale `color × (1 − --k-gris)`, que es transparente en la ya cantada, pero la capa `.resaltado` hereda el `text-shadow` de `:12` (`0 0.04em 0.12em rgb(0 0 0 / 55%)`) y Chromium dibuja la sombra de una decoración transparente. ¿Se puede poner `text-shadow: none` en `.subrayado .resaltado` (o equivalente) y comprobarlo con una captura? Hoy ninguna prueba cubre el color de la decoración (jsdom no calcula `color-mix`).

## Nota del diseñador (2026-11-22)

**Confirmo que es un defecto** (F2-R5). Resultado correcto: en la línea ya cantada (puestos −1 y −2) y en las futuras no hay **ningún** trazo bajo el texto, ni subrayado ni su sombra; el subrayado y su sombra (la de §10, que sí debe llevar en la activa) solo existen en la línea activa y, durante su salida, se funden con opacidad `1 − avance` hasta desaparecer del todo al llegar al puesto −1. La solución que propones vale si cumple eso; lo más seguro es no dibujar la decoración fuera de la activa (en vez de dibujarla transparente). Comprobación: repetir `reproductor-1920x1080-subrayado-dos-renglones.png` y `subrayado-mitad.png` y ver la ya cantada limpia. Detalle en [0.2.2-feature-2/revision.md](../ux/revisiones/0.2.2-feature-2/revision.md).
