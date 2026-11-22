# 0292 — Feature 1 · Verificación, capturas e informe
- Estado: Hecha (con reservas: capturas sin revisar por el diseñador)
- Paso del pipeline: 5
- Depende de: 0287–0291
- ADRs: 0022
- Spec UX: docs/ux/07-reproductor.md (F1-R25), docs/ux/06-editor.md (0.2.2 · Feature 1)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 1.

## Criterios de aceptación
- [x] Capturas F1-R25 en `docs/ux/revisiones/0.2.2-feature-1/` y las del editor que pida la spec.
- [x] Informe `docs/versiones/0.2.2/informe-feature-1.md` con CI, criterios y lo que pasa a la guía (legibilidad a 5 m, mareo, 4:3, equipo modesto, video a 24 y 60 FPS).

## Pruebas de feedback
- Unitarias: —
- E2E: Spec opcional de capturas (`SHINOBI_CAPTURAS_022_1=1`).
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-22. Informe: [informe-feature-1](../versiones/0.2.2/informe-feature-1.md). 17 capturas de reproductor y 16 de editor en `docs/ux/revisiones/0.2.2-feature-1/` (`app/e2e/capturas-022.spec.ts`, `SHINOBI_CAPTURAS_022_1=1`). Guía: `Test-manuales/0.2.2/feature-1-letra-en-pantalla.md`. Sin cubrir con prueba: F1-E13 y F1-E15. Sin defectos nuevos. Críticos: 1 de 1. Pendiente: revisión del diseñador y CI del PR borrador.
