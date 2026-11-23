# 0313 — Feature 7 · Worker: `leer-etiquetas`, `info-lista-youtube` e `importar-archivo-cola`
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0302, 0339
- ADRs: 0026 §1–§2, 0009
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Comandos del worker para leer un lote sin decodificar y preparar el audio en la cola.

## Criterios de aceptación
- [x] `leer-etiquetas` (cabeceras, < 100 ms por archivo).
- [x] `info-lista-youtube` en modo plano con `tipo` y `LISTA_NO_DISPONIBLE`; el doble de yt-dlp admite listas.
- [x] `LISTA_NO_DISPONIBLE` pasa de `CODIGOS_SOLO_MAIN` a los códigos compartidos con `worker/errores.py` (el test de paridad sigue pasando); `ARCHIVO_NO_ENCONTRADO` se queda solo en main (pregunta 0166 §7).
- [x] `importar-archivo-cola`: misma normalización que `importar-archivo`, dentro de la carpeta de la canción.

## Pruebas de feedback
- Unitarias: pytest con archivos generados, uno dañado y una lista falsa con una entrada privada.
- E2E: Ninguna.
- Críticos: no (solo worker)
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación

**Hecho** (worker; `uv run pytest` 377 pasan, `ruff check` y `ruff format --check` limpios)
- `worker/shinobi_worker/leer_etiquetas.py`, comando `leer-etiquetas` `{ rutas: [..≤500] }` → `{ archivos: [{ ruta, ok: true, duracion_ms, etiquetas } | { ruta, ok: false, codigo }] }`. Solo cabeceras con PyAV (sin decodificar), mismas etiquetas crudas que `importar-archivo`; un archivo dañado, sin audio o inexistente sale con `ok: false` (`FORMATO_NO_SOPORTADO`) y no hace fallar el comando. Medido en proceso: ~0,25 ms por archivo (FLAC y MP3 de 90 s); el test exige < 100 ms.
- `worker/shinobi_worker/listas_youtube.py`, comando `info-lista-youtube` `{ url }` → `{ titulo, tipo: lista|album, entradas: [{ id, titulo, canal, duracion_s, disponible }], recortada }`. Modo plano (`extract_flat: in_playlist`, `playlistend` acotado). URL: `/playlist?list=`, `/watch?v=…&list=` y `youtu.be/<id>?list=`; `OLAK5uy_…` = álbum, `RD…` y canales (`/@…`, `/channel/`, `/c/`, `/user/`) = `URL_NO_SOPORTADA`; vacía, privada o inexistente = `LISTA_NO_DISPONIBLE`. `disponible: false` para «[Private video]», «[Deleted video]», `availability` privada o de pago y directos. Devuelve hasta 500 entradas (`MAX_ENTRADAS`; el tope de 50 canciones lo aplica `fuente.lote`, pregunta 0261).
- `youtube.py`: `descomponer_url` (la parte común de `analizar_url`, sin cambiar su comportamiento), `info_lista` en el protocolo `FuenteYoutube`, en la implementación real y en el doble (`FuenteYoutubeFalsa` lee `<dir>/lista-<id de la lista>.json` en la forma de `extract_info` plano, o `{ "error": … }`).
- `importar-archivo-cola`: el mismo comando que `importar-archivo` (misma normalización, temporal y `replace`) registrado con su nombre; la carpeta de la canción llega en `salida` (el trabajo lo lanza main en la cola `ligera`).
- `LISTA_NO_DISPONIBLE` pasa de `CODIGOS_SOLO_MAIN` a los códigos compartidos (`worker/errores.py`, `shared/errores.ts`; actualizado el test de `separacion.test.ts`; el test de paridad de `protocolo.test.ts` pasa). `ARCHIVO_NO_ENCONTRADO` sigue solo en main.
- Pruebas: `test_leer_etiquetas.py` (FLAC, MP3 y M4A con etiquetas, uno dañado, uno mudo y uno inexistente, tiempo), `test_info_lista_youtube.py` (álbum con una entrada privada, un directo y una de suscriptores, lista desde un vídeo, recorte, tres formas de lista no disponible, bloqueo y red, 13 URL), `test_importar_archivo_cola.py`.

**Probar**: `cd worker && uv run pytest tests/test_leer_etiquetas.py tests/test_info_lista_youtube.py tests/test_importar_archivo_cola.py`.

**Pendiente con red y datos reales**: `info-lista-youtube` contra un álbum real de YouTube Music (de verdad `extract_flat` devuelve `availability`, `live_status` y los ids que se esperan; el prefijo del título del álbum «Album - »; los vídeos privados salen como «[Private video]»). Los dobles se han escrito a partir de la documentación de yt-dlp, no de una respuesta real.

**Deuda**: el worker no distingue «directo» de «no disponible» en la entrada (la spec 03 tiene dos líneas distintas; el contrato solo tiene `disponible`).
