# 0302 — Feature 6 · Metadatos ampliados en el worker y heurística del nombre
- Estado: Pendiente
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
(las rellena el programador al terminar)
