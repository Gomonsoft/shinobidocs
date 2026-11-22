# 0326 — Feature 9 · Paquete, copia y restaurar en la interfaz
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0325, 0323
- ADRs: 0027
- Spec UX: docs/ux/02-biblioteca.md y 08-ajustes-y-acerca.md (0.2.2 · Feature 9)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Diálogos de exportar, importar y restaurar, arrastrar un `.shinobi`, sección de Ajustes y recordatorio.

## Criterios de aceptación
- [ ] Criterios de esas secciones.

## Pruebas de feedback
- Unitarias: Componentes.
- E2E: Una secundaria: exportar con audio una canción de la semilla e importarla con «Conservar las dos».
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
