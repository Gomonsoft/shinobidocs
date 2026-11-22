# 024 — Datos de la canción automáticos (título, artista y álbum)

- Estado: Idea
- Origen: exploración 0.2.2 del diseñador UX ([mejoras de experiencia](../versiones/0.2.2/exploracion/mejoras-de-experiencia.md) §3.3); uso real
- Fecha: 2026-11-21
- Relacionadas: spec [03](../ux/03-anadir-cancion.md); [ADR 0003](../adr/0003-fuente-de-audio.md) (heurística de metadatos), [ADR 0016](../adr/0016-catalogo-de-temas-e-identidad-de-artista-y-album.md); propuestas 020 y 021

## Problema
Los datos que el usuario revisa al añadir una canción deciden dos cosas automáticas: qué letra se encuentra y qué tema se aplica.

- El ADR 0003 reconoce que la heurística sobre el título del video «fallará a menudo». El álbum solo llega relleno en videos de YouTube Music.
- Las 17 canciones de la biblioteca tienen álbum y 13 dependen de él para heredar el tema. No puedo saber cuántos se teclearon a mano, pero el campo viene vacío por defecto en la mayoría de videos.
- Un artista o un álbum escrito de dos formas («Querido…» y «Querido...») parte el grupo en la Biblioteca y rompe la herencia del tema.
- Con lotes (021), revisar los datos es el único trabajo manual que queda por canción.

## Propuesta
Proponer título, artista y álbum con más fuentes que el título del video, y sugerir los valores que ya existen en la biblioteca mientras se escribe.

Detalles para decidir:

- **Fuentes, por orden.**
  1. Campos de pista, artista y álbum de la propia fuente (ya se usan cuando existen).
  2. La respuesta de LRCLIB: el registro que coincide trae nombre de pista, artista y álbum normalizados. Con la 020 la búsqueda ya se hace al añadir, así que no cuesta peticiones nuevas.
  3. Opcional y a decidir: un servicio abierto de metadatos musicales (MusicBrainz), solo si los dos anteriores no dan álbum.
- **Autocompletado local.** Los campos Artista y Álbum sugieren los valores ya usados en la biblioteca. Al salir del campo, un valor que solo difiere en mayúsculas, tildes o puntuación de uno existente ofrece unificarse: «¿Te refieres a «Querido…»?».
- **Transparencia.** Bajo el campo, de dónde salió el dato: «Tomado del video» o «Tomado de LRCLIB». El usuario siempre puede cambiarlo.
- **En lotes.** La tabla de la 021 llega con las tres columnas propuestas y marca solo las filas dudosas.

## Valor y coste
- Valor: medio-alto. Menos tecleo en cada canción, mejores búsquedas de letra y grupos de la Biblioteca sin duplicados. Es condición para que un lote no exija revisar fila a fila.
- Coste estimado: S–M. Autocompletado y unificación son S y no dependen de nada. Usar la respuesta de LRCLIB depende de la 020. El servicio externo es M y opcional.
- Riesgos o dudas abiertas:
  - LRCLIB puede devolver el álbum de otra edición (recopilatorio, directo).
  - Un servicio externo nuevo es otro acceso a red: interruptor, límites de uso y condiciones por comprobar. No verifiqué las de MusicBrainz en esta exploración.
  - Sobrescribir lo que el usuario escribió: nunca; solo se propone.

## Decisión
(la rellena el usuario o la sesión principal con su respuesta)
