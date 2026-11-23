# 0323 — Hallazgos visuales de las capturas de las features 7, 8 y 9 (y de la opción prudente de 4 y 5)

- De: qa
- Para: disenador-ux
- Estado: Abierta
- Bloquea: no

## Contexto

Capturas en `docs/ux/revisiones/0.2.2-feature-7/`, `-8/` y `-9/` (y nuevas en `-4/` y `-5/`), abiertas una a una. Los informes de QA las enumeran.

## Hallazgos

1. **Feature 7, todas las tablas (1280 × 800 y 1024 × 640)**: la cabecera «Duración» sale cortada («Duracio») y los tiempos quedan unos píxeles por encima de la fila (`anadir-…-tabla-*`). Parece que la tabla desborda a la derecha y se recorta.
2. **Feature 7, `lote-anadido`**: tras confirmar, la página se desplaza hasta la primera tarjeta nueva y el aviso `bib.import.anadidas` queda fuera de la vista; solo se ve el botón «Preparando 1 de 3».
3. **Feature 7, `tabla-lista`**: con un canal que no acaba en VEVO el artista queda en blanco, sin ninguna línea de aviso («Sin artista es más difícil…»). ¿Debería avisar la tabla?
4. **Feature 8, `lote-formulario`**: el aviso azul «ya tienen un video» tapa el texto de ayuda del formato («Recomendado. Ocupa menos… Si tu» cortado) y no hay indicio de scroll. En `lote-detenido`: «No se puede guardar en esa carpeta.. Puede que…» (doble punto y mayúscula tras los dos puntos). Variantes singulares de `exp.lote.aviso.existe` (respuesta de 0316) aún con «1 canciones no se exportarán» / «1 videos de esta carpeta se sustituirán».
5. **Feature 8, `lote-detenido` y `lote-resultado-cambiar-opciones` son la misma pantalla**: con una carpeta que desaparece, el lote se detiene en la primera canción y se pasa directo al resultado. No hay una vista «detenido» en curso que fotografiar. ¿Basta?
6. **Feature 9, `importar-conflictos`**: el control general «Omitir · Sustituir · Conservar las dos» no tiene la leyenda `paq.imp.paraExistentes` a la vista (solo como nombre accesible). `paquete-creado`: el tamaño se parte «1 / MB» en dos renglones y la ruta completa del destino ocupa tres. `copia-nunca` y `copia-ultima-recordatorio`: el icono ⓘ queda solo en un renglón encima del texto (como C2 de la feature 4). `copia-creando`: el cuadro dice «el paquete se sigue creando» en una copia. `restaurar-revisar`: la lista corta la quinta fila y la casilla de ajustes queda tapada por el pie sin indicio de scroll.
7. **Opción prudente**: las capturas de la vista Letra de la feature 4 salen a 2560 × 1600 (la ventana tiene DPR 2 en el Mac), no a 1280 × 800 como las anteriores. El toast «Pusimos fin a 6 de 6 líneas… Las demás no tenían una pausa clara» contradice «6 de 6». Los tres toasts apilados tapan el editor (`editor-…-preparacion-fines`).

## Pregunta

¿Cuáles son defectos de spec y cuáles se anotan solo como preferencia?

## Respuesta
