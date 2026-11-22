# 025 — Copia de seguridad, paquete de canción y exportar la letra

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.10 y §3.13)
- Fecha: 2026-11-21
- Relacionadas: specs [02](../ux/02-biblioteca.md), [08](../ux/08-ajustes-y-acerca.md) y [09](../ux/09-descarga-e-instalacion.md); [ADR 0005](../adr/0005-letras-y-formato-de-sincronia.md) (exportar LRC «sin interfaz»), [ADR 0006](../adr/0006-persistencia-y-modelo-de-datos.md); visión («Fuera de alcance: compartir/publicar»)

## Problema
El principio del producto es «nunca perder trabajo», y el trabajo vive en una sola carpeta sin ninguna función que lo proteja ni lo saque de ahí.

- La biblioteca del usuario guarda 12 canciones terminadas, 138 fines de línea fijados y un catálogo de temas. La única herramienta es «Abrir carpeta de datos».
- Las versiones se instalan a mano y se suceden rápido (tres en un día). La guía de desinstalación explica cómo borrar los datos; no hay una forma guiada de guardarlos antes.
- Para llevar una canción a otro equipo propio hay que copiar carpetas con nombre de identificador y acertar con los temas.
- La letra sincronizada no se puede exportar. El video es la única salida, y no se puede volver a editar.

## Propuesta
Tres acciones pequeñas sobre el mismo mecanismo:

1. **Exportar canción** (menú ⋯ y selección múltiple): un archivo por canción con sus datos, pistas, miniatura y el tema que usa. **Importar canción** lo añade a la biblioteca en otro equipo.
2. **Copia de seguridad de la biblioteca** (Ajustes): todas las canciones, los temas y los ajustes en una carpeta o un archivo elegidos por el usuario, y **Restaurar**.
3. **Exportar la letra sincronizada** como `.lrc` (por línea) desde el menú ⋯ y la pestaña «Funciones».

Detalles para decidir:

- **Con o sin audio.** Opción «Solo letra, tiempos y estilo» (unos KB) o «Con las pistas» (unos 100 MB por canción). La versión ligera sirve para guardar el trabajo de sincronía; el audio se puede volver a obtener.
- **Al importar.** Si la canción ya existe: «Sustituir», «Conservar las dos» u «Omitir». Si el tema ya existe con otro aspecto, se importa como copia.
- **Versiones.** El archivo lleva el número de esquema. Uno más nuevo que la app se rechaza con un mensaje claro, como ya hace `TEMAS_SOLO_LECTURA`.
- **Recordatorio.** Tras marcar varias canciones como listas sin copia reciente, una nota discreta en Ajustes. Sin copias automáticas en segundo plano en esta propuesta.
- **Texto legal.** El paquete con pistas contiene audio con derechos de autor. La interfaz lo presenta como copia para uso personal entre equipos propios, no como forma de compartir.

## Valor y coste
- Valor: alto como seguro. Protege horas de trabajo ante un disco roto, una reinstalación o un cambio de equipo. La exportación `.lrc` deja usar la sincronía fuera de la app.
- Coste estimado: M. Empaquetado y lectura en el proceso principal, diálogos de exportar, importar y restaurar, y la conversión a LRC que el ADR 0005 ya contempla.
- Riesgos o dudas abiertas:
  - **Decisión de producto y legal**: la visión excluye «compartir». Un paquete con audio se puede pasar a otra persona aunque la app no lo promueva. El usuario decide si el paquete con pistas entra o solo la versión ligera.
  - Exportar a `.lrc` una letra de LRCLIB con tiempos corregidos: mismo riesgo que ya describe el ADR 0005; queda en el equipo del usuario.
  - Tamaño: 17 canciones con pistas rondan 1,7 GB.
  - Compatibilidad hacia atrás: las notas de 0.2.1 ya avisan de una pérdida al abrir con 0.2.0.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
