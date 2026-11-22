# 0287 — Feature 1 · Esquema «Letra en pantalla», reemplazo por canción y resolución
- Estado: Hecha
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
Hecho:
- `app/src/shared/pantalla.ts` (nuevo): `pantallaSchema` (tolerante por campo con `.catch`), `pantallaEstrictaSchema` (IPC), `PANTALLA_PREDETERMINADA`, `pasadasMaximas`, `pasadasEfectivas`, `DURACION_CAMBIO_MS` y las constantes de ADR 0022 §1.
- `shared/estilo.ts`: `estilo.pantalla` opcional y tolerante; `normalizarEstilo` la rellena (`EstiloNormalizado.pantalla`); `estilo.letra.colores_partes` reservado (claves `c1..c4`, `todos`, `coro`; color inválido se descarta, valor ilegible se lee como ausente; sin uso ni control).
- `shared/temas.ts`: `aparienciaSchema.reemplazo_pantalla` (no válido con `propio`), `reemplazosSchema` pasa a `z.object` (descarta claves desconocidas al leer), `resolverApariencia` fusiona y da `procedenciaPantalla` (sin reemplazos devuelve la misma referencia de estilo, como antes). La congelación al borrar un tema y «Personalizar» usan el estilo resuelto, así que ya llevan la pantalla fusionada y `propio` retira el reemplazo.
- `shared/ipc.ts`: `SeleccionApariencia.reemplazo_pantalla` (ausente conserva, `null` quita), `procedenciaPantalla` en `aparienciaResumenSchema` y `resueltaSchema`.
- main: `biblioteca/servicio.ts` (`guardarApariencia`), `biblioteca/resumen.ts`, `temas/servicio.ts` (`alHeredar` conserva el reemplazo) y `temas/impacto.ts` (aplicar en lote conserva el reemplazo). Instantánea de sesión: sin cambios, porque `estiloDe` ya lleva el estilo resuelto y `estiloSchema` conserva `pantalla`.
- Fixtures/pruebas tocados solo para añadir `procedenciaPantalla`: `renderer/.../biblioteca/resumenPrueba.ts`, `editor/fixturesApi.ts`, `exportacion/pruebas.ts`, `shared/__fixtures__/fase5.ts`, `main/ipc/handlers.test.ts`, `temasIpc.test.ts`. `fase5.test.ts`: la clave desconocida en `reemplazos` ahora se descarta en lugar de rechazarse (ADR 0022 §1).
- Una biblioteca de 0.2.1 no se reescribe: ningún campo nuevo se escribe al leer (probado en `estilo.test.ts`).

Pruebas: `shared/pantalla.test.ts`, `estilo.test.ts`, `temas.test.ts` (fusión, respaldo, congelación, copia congelada del `aparienciaSchema` de 0.2.1, `colores_partes` conservado) y `main/biblioteca/escritura.test.ts` (conservar/quitar/sustituir). Pendiente: críticos (`npm run test:e2e:criticos`) por tocar `shared/`; lo ejecuta la sesión principal. E2E y manual: ninguno.

Para 0288/0289: `normalizarEstilo(e).pantalla` siempre existe; usar `pasadasEfectivas`; el editor debe enviar `reemplazo_pantalla` (bloque completo) con `tema`/`heredar`, y `procedenciaPantalla` llega en el resumen y en `resuelta`. `useTemaEditor`/`estado.ts` (`ReemplazosEditor`) aún no conocen `reemplazo_pantalla`.

Deuda: ninguna.

Remate (ADR 0029 §4 bis, preparación 0.2.3): `estilo.pantalla.zonas` (`"por_parte" | "una"`) reservado en `shared/pantalla.ts` (`ZONAS_PANTALLA`, `Pantalla.zonas?`): opcional, lectura tolerante (un valor desconocido se lee como ausente), estricto en el IPC, se conserva al leer, normalizar y escribir; sin uso ni control en 0.2.2. Tests en `shared/pantalla.test.ts` y `shared/estilo.test.ts`.
