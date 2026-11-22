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

## Pruebas de feedback
- Unitarias: `barrido.test.ts`, `PantallaLetra.test.tsx` (anchos medidos, palabra a palabra, cajas iguales con y sin subrayado, Letra lista sin subrayado), resolución en la sesión.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
