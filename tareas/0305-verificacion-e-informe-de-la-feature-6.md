# 0305 — Feature 6 · Verificación e informe
- Estado: Hecha con reservas (guía manual pendiente del usuario; 3 preguntas de UX abiertas)
- Paso del pipeline: 1
- Depende de: 0302–0304
- ADRs: 0025
- Spec UX: docs/ux/03-anadir-cancion.md (0.2.2 · Feature 6)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 6.

## Criterios de aceptación
- [x] Informe `docs/versiones/0.2.2/informe-feature-6.md`. F6-N7 y F6-N8 no se verifican aquí: pasan a la feature 5 (tareas 0308 y 0311, pregunta 0220) y los verifica la 0312.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
QA, 2026-11-22. Informe: [informe-feature-6](../versiones/0.2.2/informe-feature-6.md). Criterios F6-N1 a N6, N9 y N10 verificados (N9 y parte de N4 con matices). 8 capturas en `docs/ux/revisiones/0.2.2-feature-6/` (`editar-datos-lrclib` espera a la feature 5). Guía [feature-6-datos-automaticos](../Test-manuales/0.2.2/feature-6-datos-automaticos.md) (las «10 + 10», lector de pantalla). Defectos: D1 (media, Tab y sugerencia de unificar, pregunta [0230](../preguntas/0230-sugerencia-de-unificar-aparece-despues-de-salir-del-campo.md)), D2 (número inicial del nombre, pregunta [0231](../preguntas/0231-numero-inicial-del-nombre-que-es-parte-del-artista.md)), D3 (mayúsculas, pregunta [0232](../preguntas/0232-grafia-de-la-biblioteca-cuando-solo-difieren-las-mayusculas.md)) y tres bajos (D4–D6) en el informe.
