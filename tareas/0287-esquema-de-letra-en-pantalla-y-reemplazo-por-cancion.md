# 0287 — Feature 1 · Esquema «Letra en pantalla», reemplazo por canción y resolución
- Estado: Pendiente
- Paso del pipeline: 5
- Depende de: 0339
- ADRs: 0022, 0018, 0016, 0006
- Spec UX: docs/ux/06-editor.md (0.2.2 · Feature 1)
- Tamaño: S
- Versión: 0.2.2 ([backlog](../versiones/0.2.2/backlog.md))

## Objetivo
Añadir `estilo.pantalla` y `apariencia.reemplazo_pantalla` sin subir esquemas y con compatibilidad con 0.2.1.

## Criterios de aceptación
- [ ] `shared/pantalla.ts` con esquema, `PANTALLA_PREDETERMINADA`, `pasadasEfectivas` y constantes (ADR 0022 §1); lectura tolerante por campo.
- [ ] `normalizarEstilo` rellena `pantalla`; `estilosIguales` sigue normalizando.
- [ ] `aparienciaSchema.reemplazo_pantalla` (solo `tema`/`heredar`); `reemplazosSchema` tolerante al leer; `resolverApariencia` fusiona y da `procedenciaPantalla`; congelar al borrar tema; «Personalizar» lo fusiona.
- [ ] `SeleccionApariencia.reemplazo_pantalla` en `biblioteca.guardarApariencia` (ausente conserva, `null` quita); `procedenciaPantalla` en el resumen y en `resuelta`.
- [ ] Abrir una biblioteca de 0.2.1 no reescribe ningún archivo.

## Preparación para 0.2.3 (varios cantantes y coros)

Sin efecto visible en 0.2.2. Decisión del usuario del 2026-11-22: la función va en 0.2.3 y aquí solo se prepara ([factibilidad §8.3](../versiones/0.2.2/exploracion/varios-cantantes-y-coros-factibilidad.md), pregunta [0165](../preguntas/0165-decisiones-provisionales-del-arquitecto-de-varios-cantantes-y-coros.md)).

- [ ] `estilo.letra.colores_partes` queda reservado en el esquema del estilo: opcional, tolerante al leer y conservado al escribir, sin ningún uso ni control en 0.2.2. Test: un tema o una canción que lo trae lo conserva tras guardar.

## Pruebas de feedback
- Unitarias: `pantalla.test.ts` (shared), `estilo.test.ts`, `temas.test.ts` (fusión, congelación, cambios de modo) y una copia congelada del `aparienciaSchema` de 0.2.1 que acepta una canción con `reemplazo_pantalla`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
