# 0313 — Feature 7 · Worker: `leer-etiquetas`, `info-lista-youtube` e `importar-archivo-cola`
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0302, 0339
- ADRs: 0026 §1–§2, 0009
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 7)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Comandos del worker para leer un lote sin decodificar y preparar el audio en la cola.

## Criterios de aceptación
- [ ] `leer-etiquetas` (cabeceras, < 100 ms por archivo).
- [ ] `info-lista-youtube` en modo plano con `tipo` y `LISTA_NO_DISPONIBLE`; el doble de yt-dlp admite listas.
- [ ] `importar-archivo-cola`: misma normalización que `importar-archivo`, dentro de la carpeta de la canción.

## Pruebas de feedback
- Unitarias: pytest con archivos generados, uno dañado y una lista falsa con una entrada privada.
- E2E: Ninguna.
- Críticos: no (solo worker)
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
