# 0295 — Feature 2 · Verificación, capturas e informe
- Estado: Hecha (con reservas: defecto 0205 abierto y capturas sin revisar)
- Paso del pipeline: 5
- Depende de: 0293, 0294
- ADRs: 0022
- Spec UX: docs/ux/07-reproductor.md (F2-R9)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 2.

## Criterios de aceptación
- [x] Capturas F2-R9.
- [x] Informe `docs/versiones/0.2.2/informe-feature-2.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-22. Informe: [informe-feature-2](../versiones/0.2.2/informe-feature-2.md). 10 capturas en `docs/ux/revisiones/0.2.2-feature-2/` (4 reproductor, 5 editor, 1 Ajustes). **Defecto**: línea oscura bajo la ya cantada con el subrayado (F2-R5), pregunta [0205](../preguntas/0205-subrayado-de-lo-ya-cantado-deja-una-linea-oscura-bajo-la-ya-cantada.md). Sin cubrir con prueba: R5, R7, E2, E3, E4, E10. Guía: `Test-manuales/0.2.2/feature-2-subrayado-y-daltonismo.md`.
