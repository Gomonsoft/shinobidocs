# 0349 — Feature 1 · Verificación, capturas e informe (Cantantes por línea)
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0340–0348, 0362–0364
- ADRs: 0029
- Spec UX: docs/ux/06-editor.md#023--feature-1--cantantes-por-línea, docs/ux/07-reproductor.md#023--feature-1--cantantes-por-línea-en-pantalla y docs/ux/10-exportacion.md#023--feature-1--cantantes-en-el-video
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Cerrar la feature 1 de 0.2.3.

## Criterios de aceptación
- [ ] Capturas de C1-E24 (editor) y C1-R12 (reproductor) en `docs/ux/revisiones/0.2.3-feature-1/`.
- [ ] C1-E1 comprobado con capturas comparadas y comparación de archivos; C1-E20 recorrido solo con teclado.
- [ ] Informe `docs/versiones/0.2.3/informe-feature-1.md` con el CI del PR borrador, los criterios y lo que pasa a la guía manual (dúo real con ratón y sin ratón, coros de las 2 canciones del usuario, insignias a 5 m, cuarteto a 3–4 m, simulador de deuteranopía, abrir en 0.2.2 y volver).

## Pruebas de feedback
- Unitarias: —
- E2E: Spec opcional de capturas (`SHINOBI_CAPTURAS_023_1=1`).
- Críticos: sí
- Manual: Recoger el resultado del CI del PR borrador, las capturas y la guía manual de QA; la regresión completa en local no es parte de la tarea.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
