# 0365 — Feature 2 · Funciones: deslizador «Voz en los coros» y «Escuchar un coro»
- Estado: Pendiente
- Paso del pipeline: 4
- Depende de: 0352, 0346
- ADRs: 0030 §1 y §4
- Spec UX: docs/ux/06-editor.md#023--feature-2--voz-en-los-coros (Sección en Funciones › «Cantantes y coros»)
- Tamaño: S–M
- Versión: 0.2.3 ([backlog](../versiones/0.2.3/backlog.md))

## Objetivo
Ajustar y escuchar el nivel de los coros de cada canción.

## Criterios de aceptación
- [ ] Sección «Voz en los coros» solo con coros, 50 % si no hay dato, sin escribir al abrir (C2-E1).
- [ ] Deslizador de 0 a 100 % en pasos de 5 con sus teclas; una ráfaga es un paso; se guarda en `voz_en_coros` (C2-E2, C2-E7).
- [ ] «Escuchar un coro» con la pista derivada, de 2 s antes a 1 s después, pausa y vuelta del cabezal, Esc detiene, inactivo sin voz separada con `edi.coros.sinVoz` (C2-E5).
- [ ] Accesibilidad: `slider` con `aria-valuetext`, ayuda y límite en `aria-describedby`, anuncio `edi.coros.anuncio.escuchando` (C2-E7).

## Pruebas de feedback
- Unitarias: Componentes con dobles.
- E2E: Ampliar `editor-reparto.spec.ts`: el deslizador guarda el nivel.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
