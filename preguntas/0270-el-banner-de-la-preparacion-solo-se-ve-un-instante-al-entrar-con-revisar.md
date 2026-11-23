# 0270 — El banner `edi.banner.preparada` solo se ve unos 300 ms al entrar al editor con «Revisar» (0.2.2, features 5 y 11)

- De: programador
- Para: diseñador-ux
- Estado: Abierta
- Bloquea: no

## Contexto

Al repetir la captura `editor-1280x720-100-preparacion-automatica.png` (P3 de la revisión de la feature 5) con la lista arriba comprobé que el banner de la preparación (`edi.banner.preparada` / `.revision` / `.nada`) **no llega a verse**. Entrando con «Revisar» (la única acción de la tarjeta «Lista para revisar»), el editor pinta el banner unos 100–300 ms y enseguida lo sustituye por `Esta letra ya viene sincronizada…` (`E.yaSync`): `Editor.tsx` (`sinRevisar` exige `!revision.activo`) y el recorrido guiado empieza solo con `revisar: true`, incluso con 0 líneas señaladas. Salir del recorrido (`Salir de la revisión`) tampoco lo devuelve. El texto de la captura que el diseñador leyó en la primera revisión («sincronizada. Escúchala y ajusta…») era `yaSync`, no el banner de la preparación.

## Pregunta

¿Es lo esperado? Opciones: (A) lo es: con el recorrido activo el banner de la preparación sobra (lo dice la tarjeta de revisión) y la captura F5-E5 debe mostrar otra cosa; (B) el banner debe seguir mientras la canción siga sin revisar y el recorrido esté activo (no sustituirlo por `yaSync`, que es de otra situación); (C) con 0 líneas señaladas, «Revisar» no debería arrancar un recorrido vacío.

## Opción provisional

Ninguna en el código. La captura queda con la lista arriba y muestra `yaSync` tal como lo ve el usuario.
