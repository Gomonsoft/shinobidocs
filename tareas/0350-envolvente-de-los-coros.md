# 0350 — Feature 2 · `shared/coros.ts`: tramos y envolvente de la voz en los coros
- Estado: Pendiente
- Paso del pipeline: 4–6
- Depende de: 0340
- ADRs: 0030 §2
- Spec UX: — (ADR 0030 §2); valores en docs/ux/06-editor.md#023--feature-2--voz-en-los-coros (Concepto)
- Tamaño: S
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Una función pura del tiempo que comparten el reproductor, el editor y la exportación.

## Criterios de aceptación
- [ ] `tramosCoro`, `envolvente` y `nivelEn` con las reglas y constantes de ADR 0030 §2 (offset, `finEfectivo`, unión de tramos a menos de 1 s, rampas de 150 ms); es el test compartido que citan C2-R4 y C2-V2.

## Pruebas de feedback
- Unitarias: `coros.test.ts`: offset, unión (800 ms frente a 1,2 s, C2-R2), recorte, líneas sin inicio, nivel 0, rampas.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
