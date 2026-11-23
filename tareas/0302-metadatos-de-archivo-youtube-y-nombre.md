# 0302 — Feature 6 · Metadatos ampliados en el worker y heurística del nombre
- Estado: Hecha
- Paso del pipeline: 1
- Depende de: 0339
- ADRs: 0025 §6, 0003
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 6)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Leer más etiquetas y campos de música y proponer datos desde el nombre del archivo.

## Criterios de aceptación
- [ ] Worker: `album_artist`, `track`, `date` del archivo; `track`, `artists`, `album`, `album_artist`, `track_number`, `release_year` de yt-dlp (y en el doble).
- [ ] `shared/metadatosNombre.ts` y `claveFlexible` en `shared/identidad.ts`.
- [ ] `metadatos.origen` en el esquema (tolerante).

## Pruebas de feedback
- Unitarias: pytest con un FLAC y un MP3 generados con etiquetas; `metadatosNombre.test.ts` con una tabla de nombres anonimizados; `identidad.test.ts`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- **Worker** (`worker/shinobi_worker/importar_archivo.py`, `metadatos_youtube.py`, `youtube.py`): `importar-archivo` lee además `album_artist`, `track` (sin «/total») y `date` y devuelve `etiquetas` crudas junto a `metadatos` (que sigue igual salvo que `artist` vacío cae a `album_artist`). `info-youtube` devuelve `musica` con `track`, `artist` (de `artists`), `album`, `album_artist`, `track_number`, `release_year`, `titulo_limpio` y `canal_limpio`. El doble de yt-dlp ya lee cualquier clave del JSON de la fixture.
- **TS**: `shared/metadatosNombre.ts` (`metadatosDeNombre`, `metadatosDeCarpeta`, `partirPorSeparador`, `tituloConRestos`), `claveFlexible` en `shared/identidad.ts`, `metadatos.origen` tolerante en `shared/cancion.ts` (`ORIGENES_DATO`), esquemas `etiquetasArchivoSchema` y `musicaYoutubeSchema` en `shared/protocolo.ts`.
- **Pruebas**: pytest con un FLAC y un MP3 etiquetados (`test_importar_archivo.py`) y `campos_musica` (`test_youtube_metadatos.py`); `metadatosNombre.test.ts` (17 nombres anonimizados), `identidad.test.ts` (`claveFlexible`), lectura tolerante del origen en `servicio.test.ts`.
- **Deuda**: el patrón `NN Título` (p. ej. «21 Guns») descarta el número como pista; es la regla de la spec. La heurística `metadatos_desde_nombre` del worker sigue existiendo (compatibilidad) pero ya no manda: main usa la suya.
- Contratos añadidos: pregunta [0220](../preguntas/0220-contratos-de-los-datos-propuestos-y-lo-que-queda-para-la-feature-5.md).
