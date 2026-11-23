# 0337 — Feature 11 · Verificación, calibración e informe
- Estado: En revisión (hecha con reservas: faltan criterios del usuario)
- Paso del pipeline: 4
- Depende de: 0334–0336, 0370, 0377
- ADRs: 0024
- Spec UX: docs/ux/06 y 02 (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Cerrar la feature 11.

## Criterios de aceptación
- [ ] **(Pendiente del usuario)** Calibración con `calibrar-dudosas.ts` sobre las canciones del usuario (≤ 10 % en las revisadas).
- [x] Informe `docs/versiones/0.2.2/informe-feature-11.md`.

## Pruebas de feedback
- Unitarias: —
- E2E: —
- Críticos: sí
- Manual: Ejecutar la regresión que no da el CI en local no es parte de la tarea. Recoger el resultado del CI del PR borrador de la feature, las capturas que pida la spec y la guía manual de QA.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
- Ejecutado por `qa` el 2026-11-22 sobre una copia limpia de `10496b8`. **Veredicto: hecha con reservas.** Informe: [informe-feature-11](../versiones/0.2.2/informe-feature-11.md); guía: [feature-11-revision-guiada](../Test-manuales/0.2.2/feature-11-revision-guiada.md).
- Hecho: 20 criterios mapeados (18 cubiertos, E14 solo manual, E11 con defecto); F4-E10 y F11-E15 en los seis viewports (E2E nuevo); capturas del recorrido tras R1–R6, `recorrido-otra-pestana`, la Biblioteca y el diálogo; crítico nuevo con «Revisar».
- **Pendiente del usuario**: `npm run calibrar:dudosas -- <carpeta>` (≤ 10 %).
- Defectos: D1 (0241, media), D2 y D3 (0242).
QA, 2026-11-22 (canciones reales del MVP): `calibrar:dudosas` con 17 canciones del MVP **no revisadas a mano**: 10,1 % global (95/942), 13/17 ≤ 10 %, 5,5 % sin las canciones 5, 8 y 17. El criterio «≤ 10 % en las revisadas» **no se da por cumplido ni por incumplido** (sigue pendiente del usuario con canciones revisadas). Pregunta 0279. Ver [medidas-con-canciones-reales](../versiones/0.2.2/medidas-con-canciones-reales.md).
