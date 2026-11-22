# 0293 — Feature 2 · Subrayado de lo ya cantado: datos, resolución y render
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0290
- ADRs: 0022 §5
- Spec UX: docs/ux/07-reproductor.md, docs/ux/10-exportacion.md y docs/ux/sistema-visual.md (0.2.2 · Feature 2)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Dibujar el subrayado en la capa de resaltado y resolver cuándo se ve.

## Criterios de aceptación
- [ ] `estilo.letra.subrayar_cantado` y `config.reproductor.subrayar_cantado` (tolerantes); resolución en reproductor local, sesión (main) y exportación (solo el estilo).
- [ ] `PantallaLetra` con `subrayado`; `recorteBarrido(…, { margenInferior })`; opacidad `1 − mezclaGris` al salir; barra de espera con pista al 35 %.
- [ ] F2-R1 a R8 cubiertos.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] Test: el subrayado toma el color del nodo de su línea (sale del ajuste de color por línea de la 0290).

## Pruebas de feedback
- Unitarias: `barrido.test.ts`, `PantallaLetra.test.tsx` (anchos medidos, palabra a palabra, cajas iguales con y sin subrayado, Letra lista sin subrayado), resolución en la sesión.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
