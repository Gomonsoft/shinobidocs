# 0309 — Features 5 y 7 · Tanda, pausa, paradas automáticas y reanudar al abrir
- Estado: Pendiente
- Paso del pipeline: 1
- Depende de: 0308
- ADRs: 0025 §5, 0009
- Spec UX: docs/ux/04-progreso-pipeline.md (0.2.2 · Features 5 y 7), docs/ux/02-biblioteca.md (avisos de reanudación)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La cola de preparación como conjunto: tanda, pausa persistida, paradas y reanudación.

## Criterios de aceptación
- [ ] Tanda en memoria con estimación; `config.preparacion.pausada`; paradas de ADR 0025 §5 con comprobación de conexión cada 60 s.
- [ ] Pausa aleatoria de 3 a 8 s entre descargas de YouTube.
- [ ] Diario `trabajos/pendientes.json` con `interrupciones`; reanudación tras la comprobación del runtime; evento `preparacion:reanudada`.
- [ ] Aviso `tanda` de `ServicioAvisos`.
- [ ] Al llegar a `esperando_separacion` (preparar o reanudar), si la fuente está completada, la separación está `pendiente` y no hay trabajo de separación de esa canción en cola ni en curso, la corrida la encola por el camino de siempre (pregunta 0223 §4). Test: una sola separación encolada; ninguna si ya había una.

## Pruebas de feedback
- Unitarias: Gestor y servicio con reloj falso: paradas por código, tres fallos seguidos, reanudar con 0, 1 y 2 interrupciones, runtime dañado.
- E2E: Ampliar `separacion.spec.ts`: cerrar con dos trabajos en cola y ver que se reanudan.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
