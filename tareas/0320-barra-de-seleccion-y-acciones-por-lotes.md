# 0320 — Feature 8 · Barra de selección y diálogos de acciones por lotes
- Estado: Pendiente
- Paso del pipeline: 6
- Depende de: 0318
- ADRs: 0026 §4
- Spec UX: docs/ux/02-biblioteca.md (0.2.2 · Feature 8)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
La barra con «Preparar», «A la cola», «Exportar video…», «Editar datos…» y «Eliminar…».

## Criterios de aceptación
- [ ] Criterios de la spec 02 · Feature 8 (1024 px, «Más acciones», Supr).

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: La de 0318.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
