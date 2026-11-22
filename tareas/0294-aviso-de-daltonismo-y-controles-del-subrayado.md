# 0294 — Feature 2 · Aviso de colores que se confunden y controles
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0293, 0291
- ADRs: 0022 §5
- Spec UX: docs/ux/06-editor.md y docs/ux/08-ajustes-y-acerca.md (0.2.2 · Feature 2)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Casilla del tema, casilla global en Ajustes y aviso de daltonismo en el panel Estilo.

## Criterios de aceptación
- [ ] `confusionDaltonismo` (Machado 2009) y aviso `daltonismo` en `evaluarContraste`.
- [ ] Controles y textos de las specs 06 y 08 · Feature 2.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] La comprobación de daltonismo es una función de dos colores con nombres neutros, `confusionDaltonismo(a, b)`, reutilizable con otros pares.

## Pruebas de feedback
- Unitarias: `contraste.test.ts` con los pares de la spec; componentes del panel y de Ajustes.
- E2E: Ninguna.
- Críticos: sí
- Manual: Simulador de daltonismo o escala de grises con rojo/verde.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
