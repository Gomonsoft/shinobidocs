# 0298 — Feature 4 · Encaje de los candidatos en main y picos al terminar la separación
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0297
- ADRs: 0024 §2, 0015
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: M
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Que `letras.buscar` devuelva el encaje por candidato y que los picos existan sin abrir el editor.

## Criterios de aceptación
- [ ] `leerNivelBase` en `main/picos/formato.ts`.
- [ ] Main pide `generar-picos` al completarse la separación.
- [ ] `letras.buscar` añade `encaje` y ordena; evento `letras:encaje` cuando los picos terminan.

## Pruebas de feedback
- Unitarias: Servicio de letras con picos falsos y doble de LRCLIB; servicio de picos encadenado a la separación falsa.
- E2E: Ampliar `letras.spec.ts` con un escenario: separación falsa + picos generados + candidato con encaje.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
