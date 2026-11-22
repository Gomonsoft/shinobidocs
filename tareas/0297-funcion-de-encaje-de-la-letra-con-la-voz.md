# 0297 — Feature 4 · `shared/encaje.ts`
- Estado: Pendiente
- Paso del pipeline: 3
- Depende de: 0296
- ADRs: 0024 §1
- Spec UX: docs/ux/05-letra.md (0.2.2 · Feature 4)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Función pura de comprobación y desfase global.

## Criterios de aceptación
- [ ] `evaluarEncaje` con los cinco veredictos, `lineasSinVoz`, `tramosVozSinLetra`, `desfaseVariable` y `PARAMETROS_ENCAJE` de ADR 0024.
- [ ] Sumas prefijas: < 10 ms para 4 min; determinista.
- [ ] Corrección y «Quitar la corrección» como funciones puras sobre `offset_ms` y `desfase_corregido_ms`.

## Pruebas de feedback
- Unitarias: `encaje.test.ts` con picos sintéticos (casos de ADR 0024 §5).
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
