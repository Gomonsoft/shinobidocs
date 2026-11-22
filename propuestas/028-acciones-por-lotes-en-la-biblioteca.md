# 028 — Acciones por lotes en la Biblioteca

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.10 y §3.13); uso real
- Fecha: 2026-11-21
- Relacionadas: spec [02](../ux/02-biblioteca.md) (selección múltiple de la fase 3, cola de la fase 4, exportación de la fase 6); propuestas [006](006-exportar-varias-canciones-a-video.md), 020, 021 y 025

## Problema
La selección múltiple existe desde 0.2.0, pero solo sirve para «Aplicar tema…».

- Los 5 borradores sin letra del lote del 10 de noviembre hay que abrirlos uno a uno para buscarles letra, o eliminarlos uno a uno desde su menú ⋯.
- Preparar un evento con 10 canciones son 10 veces «A la cola».
- Exportar un repertorio a video es un diálogo por canción (propuesta 006, sin decidir).
- Corregir el álbum o el artista de varias canciones es un diálogo «Editar datos» por cada una.

## Propuesta
Que la barra de selección ofrezca las acciones que ya existen por canción, aplicadas a todas las seleccionadas, con el mismo resumen de resultado por canción que usa «Aplicar tema…».

Acciones, por orden de valor:

| Acción | Qué hace | Notas |
|---|---|---|
| **Preparar** | Lanza la preparación desatendida (020) en los borradores seleccionados | Depende de la 020. Es la que rescata los 5 borradores actuales |
| **A la cola** | Añade las Listas seleccionadas a la cola, en el orden visual | Respeta `COLA_LLENA` e informa de las que no entraron |
| **Exportar video…** | Mismas opciones y una carpeta para todas; cada una entra en la cola de exportación | Es la propuesta 006: se reactiva aquí |
| **Editar datos…** | Cambia artista o álbum de todas (no el título) | Avisa si el cambio altera qué tema heredan |
| **Eliminar…** | Mueve todas a la papelera, con una sola confirmación que las cuenta | Destructiva: confirmación con la lista de títulos |

Detalles para decidir:

- **Barra.** Con cinco acciones no cabe en una fila a 1024 px: «Aplicar tema…» y las dos más usadas visibles, el resto en un menú «Más acciones».
- **Acciones que no aplican.** Si la selección mezcla borradores y Listas, cada acción dice a cuántas afecta: «A la cola (7 de 9)». No se desactiva por tener una canción que no aplica.
- **Resultado.** Diálogo de resultado por canción (hecho, omitida y motivo, error), ya diseñado para los temas.
- **Teclado.** Supr con selección abre «Eliminar…». Sin otros atajos de una tecla.

## Valor y coste
- Valor: medio-alto, y crece con cada canción de la biblioteca y con los lotes (021).
- Coste estimado: M en total; cada acción es S si se hace suelta. «Preparar» y «Eliminar…» resuelven el caso real de hoy.
- Riesgos o dudas abiertas:
  - Eliminar por lotes es la acción más peligrosa de la app. Las canciones van a la papelera del sistema, como hoy.
  - Exportar muchas canciones seguidas: tiempo y espacio (ver 006), y más valor para la codificación por GPU (007).
  - Durante una sesión en otra pantalla, las acciones de edición siguen bloqueadas como hoy.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
