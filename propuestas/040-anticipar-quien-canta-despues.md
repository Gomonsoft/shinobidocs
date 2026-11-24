# 040 — Anticipar en pantalla quién canta después

- Estado: Idea
- Origen: prueba manual del usuario en Windows con un dúo real (2026-11-23), guía [Feature 1 · Cantantes por línea](../Test-manuales/0.2.3/feature-1-cantantes-por-linea.md), caso 4 (legibilidad); nota [incidencias-2026-11-23-windows](../Test-manuales/0.2.3/incidencias-2026-11-23-windows.md), M-1
- Fecha: 2026-11-23
- Relacionadas: spec [07 · Feature 1](../ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla) («Disposición por zonas», C1-R2 a C1-R8), pregunta [0360](../preguntas/0360-indicadores-de-espera-sobre-la-linea-en-una-zona-y-tamano-del-coro.md), ADR [0029](../adr/0029-reparto-de-la-letra-entre-cantantes-y-coro.md)

## Problema

En un dúo, entre una línea y la siguiente todas las zonas se ven igual de atenuadas: las líneas próximas de los dos cantantes esperan en gris/opaco y nada indica cuál de las dos entra primero. Quien canta no sabe si le toca hasta que su línea empieza a barrerse. En palabras del usuario: «no se sabe quién cantará después; lo conveniente es que se ilumine de antemano el cantante que cantará, no que se quede solo en gris/opaco».

Visto en el reproductor (0.2.3-alpha.1, Windows, 1718 × 1386, en pausa a los 00:23, entre el fin de la línea 1 y el inicio de la línea 2, las dos del cantante 1): las cuatro líneas en pantalla (dos por zona) y las dos insignias tienen la misma atenuación. Captura del usuario: `C:\Users\Gogo\Pictures\Imagenes Shinobi\Test 23 nov 1\No se sabe cual sera el siguiente cantante en cantar.png` (no copiada al repositorio).

## Propuesta

Resaltar por adelantado la parte que canta a continuación: durante el hueco anterior a una línea, su zona (la insignia y la línea próxima) se ilumina o sube de opacidad respecto a las demás, que siguen atenuadas. El detalle (cuánto antes, si es la insignia, la línea o las dos, y cómo convive con la barra y la cuenta 3·2·1 de los huecos largos) es del diseñador UX.

## Valor y coste

- Valor: es la información que más necesita un dúo en un karaoke (a quién le toca) y hoy solo llega cuando la línea ya empezó. Afecta al reproductor, a la ventana secundaria y al video exportado.
- Coste: sin estimar (lo valora el arquitecto). Toca la disposición por zonas del reproductor y las mediciones de opacidad y color añadidas en 0.2.3.
- Riesgos: la regla de oro (una voz, sin reparto: imagen idéntica a 0.2.2); el caso de voces a la vez (dos partes entran casi juntas); no confundir «próxima» con «cantándose».

## Decisión

(la rellena el usuario o la sesión principal con su respuesta)
