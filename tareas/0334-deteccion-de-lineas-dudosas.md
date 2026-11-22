# 0334 — Feature 11 · `shared/dudosas.ts`, recuento en main y calibración
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0296
- ADRs: 0024 §3
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 11)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura de motivos y recuento guardado para la Biblioteca.

## Criterios de aceptación
- [ ] `detectarDudosas` con `PARAMETROS_DUDOSAS`; excluye `revisada` vigente.
- [ ] Main guarda `preparacion.dudosas` al terminar la preparación y en cada escritura de la letra de esa canción.
- [ ] `app/scripts/calibrar-dudosas.ts` (desarrollo, fuera del paquete, solo cifras).

## Pruebas de feedback
- Unitarias: `dudosas.test.ts` (cada motivo positivo y negativo, sin picos, `revisada`).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
