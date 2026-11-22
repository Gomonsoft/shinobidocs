# 0358 — Feature 3 · Funciones automáticas con voces a la vez
- Estado: Pendiente
- Paso del pipeline: 3–4
- Depende de: 0357
- ADRs: 0029 §7, 0024, 0027 §4, 0028, 0018 §6
- Spec UX: — (ADR 0029 §7); docs/ux/06-editor.md#voces-a-la-vez-condicionada-a-la-factibilidad-que-dictamine-el-arquitecto (fila «Funciones automáticas»)
- Tamaño: M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))
- **Condicionada**: solo se hace si la prueba técnica 0356 sirve (ADR 0029 §7).

## Objetivo
Que las funciones de 0.2.2 no se equivoquen con líneas solapadas.

## Criterios de aceptación
- [ ] «Ajustar los silencios», «Sincronizar con la voz» y las dudosas no tocan las líneas solapadas y lo dicen con `edi.partes.solapaExcluidas`; «Comprobar la letra» las cuenta una vez (fusión de intervalos); `.lrc` sin marca vacía donde hay solape (C1S-E4).

## Pruebas de feedback
- Unitarias: `silencios.test.ts`, `encaje.test.ts`, `dudosas.test.ts`, `alineacion.test.ts`, `lrc.test.ts` con solapes.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
