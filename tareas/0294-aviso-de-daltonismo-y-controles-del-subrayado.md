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

## Pruebas de feedback
- Unitarias: `contraste.test.ts` con los pares de la spec; componentes del panel y de Ajustes.
- E2E: Ninguna.
- Críticos: sí
- Manual: Simulador de daltonismo o escala de grises con rojo/verde.
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
