# 0349 — Feature 1 · Verificación, capturas e informe (Cantantes por línea)
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0340–0348
- ADRs: 0029
- Spec UX: docs/ux/06-editor.md (0.2.3 · Feature 1), docs/ux/07-reproductor.md (0.2.3 · Feature 1)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cerrar la feature 1 de 0.2.3.

## Criterios de aceptación
- [ ] Capturas que pida la spec en `docs/ux/revisiones/0.2.3-feature-1/` (editor a 1280 × 720 y 1024 × 576 con 1, 3 y 6 carriles; reproductor con dúo y coro; Letra lista).
- [ ] Informe `docs/versiones/0.2.3/informe-feature-1.md` con el CI del PR borrador, criterios cumplidos y lo que pasa a la guía manual (un dúo real del usuario, legibilidad de la insignia a 5 m, abrir en 0.2.2 y volver).

## Pruebas de feedback
- Unitarias: —
- E2E: Spec opcional de capturas (`SHINOBI_CAPTURAS_023_1=1`).
- Críticos: sí
- Manual: Recoger el resultado del CI del PR borrador de la feature, las capturas y la guía manual de QA; la regresión completa en local no es parte de la tarea.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
