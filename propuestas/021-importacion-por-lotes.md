# 021 — Importación por lotes: archivos, carpeta, enlaces o lista de YouTube

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §2.2 y §3.3); uso real
- Fecha: 2026-11-21
- Relacionadas: spec [03](../ux/03-anadir-cancion.md); [ADR 0003](../adr/0003-fuente-de-audio.md); propuestas 020, 024 y 028

## Problema
Las canciones se añaden de una en una, y la app lo impone.

- Soltar varios archivos usa el primero y muestra «Añade las canciones de una en una.»
- Una lista o un álbum de YouTube da el error «Las listas y los directos no se pueden usar. Abre el vídeo concreto y copia su enlace.»
- El 10 de noviembre el usuario añadió 9 canciones del mismo álbum en 5 minutos y medio: 9 veces pegar el enlace, esperar la vista previa, revisar los datos y pulsar «Descargar y continuar».

## Propuesta
Aceptar varias fuentes en una sola acción (varios archivos, una carpeta, varios enlaces pegados o el enlace de una lista o álbum de YouTube), mostrar una tabla para revisar los datos de todas y ponerlas en cola.

Detalles para decidir:

- **Entrada.** La misma vista «Añadir canción». Si se sueltan varios archivos o una carpeta, o el enlace es de una lista, la vista pasa a modo lote en vez de dar error. El campo de enlace admite varios, uno por renglón.
- **Tabla de revisión.** Una fila por canción: casilla, título, artista, álbum (editables en la celda), duración y estado («lista para añadir», «ya está en tu biblioteca», «no disponible»). Acciones de columna: «Mismo artista para todas» y «Mismo álbum para todas».
- **Duplicados.** Una canción cuyo video ya está en la biblioteca viene desmarcada y con su aviso.
- **Resumen antes de confirmar.** «12 canciones · unos 1,2 GB · unos 8 minutos en tu equipo», con el factor de separación medido.
- **Límite.** Tope por lote (por ejemplo 50) para no saturar disco ni servicios.
- **Cola.** Reutiliza las colas existentes (descargas y separación de una en una). Con la 020, cada canción sigue sola hasta «Lista para revisar».
- **Resultado.** Al terminar, un resumen por canción, con el patrón de «Aplicar tema…»: añadidas, con error y motivo, omitidas.
- **Aviso legal.** El aviso de YouTube ya aceptado vale también aquí. Su texto debería mencionar las listas.

## Valor y coste
- Valor: alto. Un álbum pasa de 9 rondas de formulario a una. Con la 020, de 9 rondas más 9 visitas a Letra, a una acción y una revisión.
- Coste estimado: L. Modo lote de la vista 03, consulta de listas con yt-dlp, tabla editable accesible, resumen de resultados y revisión del ADR 0003.
- Riesgos o dudas abiertas:
  - **Sin la 020 pierde valor**: se llenaría la biblioteca de borradores sin letra, que es lo que ya pasó con 5 canciones.
  - Los datos de una lista pueden llegar incompletos en la consulta rápida de yt-dlp (ver 024).
  - Bloqueos de YouTube más probables con muchas descargas seguidas.
  - Espacio: unos 100 MB por canción.
  - Legal: descargar listas enteras aumenta la exposición descrita en el ADR 0003. Lo decide el usuario.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
