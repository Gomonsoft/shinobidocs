# 0314 — Feature 7 · Lote en main: lectura, duplicados, espacio y canciones con fuente pendiente
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0313, 0309
- ADRs: 0026 §1–§3
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: L
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Recibir un lote, revisarlo y crearlo.

## Criterios de aceptación
- [ ] Recorrido de carpeta (3 niveles, 500 elementos), referencias `ref`, tipos de lista, duplicados (regla de la spec), tope de 50, espacio y tiempo estimados.
- [ ] `fuente.lote` crea las canciones con `fuente.ruta_pendiente` y encola; `ARCHIVO_NO_ENCONTRADO`.
- [ ] Aviso legal de listas (`config.aviso_youtube_listas_aceptado`).

## Pruebas de feedback
- Unitarias: Main con dobles del worker.
- E2E: Una secundaria: 3 WAV generados y una lista falsa de 2 vídeos hasta ver 5 tarjetas en cola.
- Críticos: sí
- Manual: Un álbum real de YouTube y una carpeta real.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
