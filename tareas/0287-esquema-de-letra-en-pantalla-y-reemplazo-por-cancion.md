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

## Pruebas de feedback
- Unitarias: `pantalla.test.ts` (shared), `estilo.test.ts`, `temas.test.ts` (fusión, congelación, cambios de modo) y una copia congelada del `aparienciaSchema` de 0.2.1 que acepta una canción con `reemplazo_pantalla`.
- E2E: Ninguna.
- Críticos: sí
- Manual: —
- Siempre: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run test:cambios` (y `uv run pytest` / `ruff` si toca el worker).

## Notas de implementación
(las rellena el programador al terminar)
