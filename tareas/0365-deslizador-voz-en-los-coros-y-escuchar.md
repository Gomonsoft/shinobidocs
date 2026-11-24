# 0365 — Feature 2 · Funciones: deslizador «Voz en los coros» y «Escuchar un coro»
- Estado: Hecha
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
**Qué se hizo.** «Voz en los coros» en Funciones › «Cantantes y coros», en la prop `vozEnCoros` de `SeccionCantantes`.
- `VozEnCoros.tsx`: deslizador (`slider` «Voz en los coros», 0–100 % de 5 en 5, ←/→ 5, Re Pág/Av Pág 25, Inicio/Fin; `aria-valuetext` «{n} %» o «Sin voz (0 %)»; ayuda y límite en `aria-describedby`) y «Escuchar un coro»/«Detener». Solo con alguna línea de coro; 50 % sin dato; no escribe al abrir. El nivel va por `fijar_voz_en_coros` (una ráfaga de menos de 1 s es un paso) y se guarda en `letra.partes.voz_en_coros`.
- `Editor.tsx`: pasa `coros = envolvente(tramosCoro(letra, duración), vozEnCoros(letra))`, memoizado, a `useMotorAudio` (el motor de 0352 deriva «Instrumental con coros»). «Escuchar un coro»: `await motor.prepararCoros()` y `motor.reproducir({ desdeMs, hastaMs, conCoros: true })` de 2 s antes de la siguiente línea de coro (o la primera) a 1 s después de su fin; no cambia la pista elegida; al acabar, pausa y devuelve el cabezal (suscripción al motor); Esc detiene (antes que «solo principal»); anuncio `edi.coros.anuncio.escuchando`; sin voz separada, `aria-disabled` con `edi.coros.sinVoz`. `edi.coros.preparando` junto a «Escuchar» (`Transporte.tsx`, `corosPreparando`) y toast `edi.coros.error` una vez por visita al pasar `corosError` a verdadero. No hizo falta tocar `karaoke/`.

**Cómo probarlo.** `npx vitest run src/renderer/src/vistas/editor/Editor.reparto`; E2E `e2e/editor-reparto.spec.ts` (el deslizador guarda el nivel). Capturas en `docs/ux/revisiones/0.2.3-feature-2/`.

**No comprobado.** El oído (mezcla, chasquidos), `edi.coros.preparando` en pantalla (hace falta un cálculo de más de 500 ms) y el toast de error con un fallo real de la mezcla.
